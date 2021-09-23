import PointPresenter, {State as PointPresenterViewState} from './point.js';
import NewPointPresenter from './new-point.js';
import SortView from '../view/sort.js';
import TripInfoView from '../view/trip-info.js';
import CostView from '../view/cost.js';
import PointsListView from '../view/points-list.js';
import NoEventsView from '../view/no-events.js';
import LoadingVew from '../view/loading.js';
import {render, RenderPosition} from '../utils/render.js';
import {sortByDateUp, sortByDurationDown, sortByPriceDown} from '../utils/sort.js';
import {SortType, UserAction, UpdateType, FilterType} from '../utils/const.js';
import {remove} from '../utils/render.js';
import {filter} from '../utils/filter.js';

class Trip {
  constructor(headerTripMainElement, mainTripEventsElement, pointsModel, filterModel, api) {
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._headerTripMainElement = headerTripMainElement; // '.trip-main'
    this._mainTripEventsElement = mainTripEventsElement; // .trip-events'
    this._pointPresenter = new Map(); // для хранения созданных pointPresenter'ов
    this._newPointPresenter = null;

    this._serverDestinations = [];
    this._serverOffers = [];

    this._currentSortType = SortType.DAY;
    this._currentFilterType = FilterType.EVERYTHING;

    this._mainPointsList = null;
    this._sortComponent = null;
    this._noEventView = null;
    this._tripInfoView = null;
    this._costView = null;

    this._api = api;
    this._isLoading = true;
    this._loadingView = new LoadingVew();

    this._modeChangeHandler = this._modeChangeHandler.bind(this);
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
    this._viewActionHandler = this._viewActionHandler.bind(this);
    this._modelEventChangeHandler = this._modelEventChangeHandler.bind(this);
  }

  init() {
    this._renderList(this._getPoints());

    this._pointsModel.addObserver(this._modelEventChangeHandler);
    this._filterModel.addObserver(this._modelEventChangeHandler);
  }

  createPoint(callback) {
    if (this._newPointPresenter) {
      this._newPointPresenter.destroy();
    }

    this._serverDestinations = this._pointsModel.getDestinations();
    this._serverOffers = this._pointsModel.getOffers();

    this._currentSortType = FilterType.EVERYTHING;
    this._newPointPresenter = new NewPointPresenter(this._mainPointsList, this._viewActionHandler, this._serverDestinations, this._serverOffers);
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._newPointPresenter.init(callback);
  }

  destroy() {
    this._clearAllEvents({resetSortType: true});
    this._currentSortType = SortType.DAY;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    remove(this._mainPointsList);
    remove(this._sortComponent);

    this._pointsModel.removeObserver(this._modelEventChangeHandler);
    this._filterModel.removeObserver(this._modelEventChangeHandler);
  }

  addDestinations(destinations) {
    this._serverDestinations = destinations;
  }

  _getPoints() {
    this._currentFilterType = this._filterModel.getFilter();
    const points = this._pointsModel.getPoints();
    const filteredPoints = filter[this._currentFilterType](points);

    switch(this._currentSortType) {
      case SortType.DAY: {
        return filteredPoints.slice().sort(sortByDateUp);
      }
      case SortType.TIME: {
        return filteredPoints.slice().sort(sortByDurationDown);
      }
      case SortType.PRICE: {
        return filteredPoints.slice().sort(sortByPriceDown);
      }
    }

    return filteredPoints;
  }

  _renderList() {
    if (this._isLoading) {
      return this._renderLoading;
    }

    const events = this._getPoints();
    if (events.length === 0) {
      return this._renderNoEvents();
    }

    this._renderTripInfo();
    this._renderCost();
    this._renderSort();
    this._renderEvents();
  }

  _renderNoEvents() {
    remove(this._sortComponent);
    this._noEventView = new NoEventsView(this._currentFilterType);
    render(this._mainTripEventsElement, this._noEventView, RenderPosition.AFTERBEGIN);
  }

  _renderEvents() {
    const events = this._getPoints();
    this._mainPointsList = new PointsListView();
    render(this._mainTripEventsElement, this._mainPointsList, RenderPosition.BEFOREEND);
    events.forEach((event) => this._renderEvent(event));
  }

  _renderEvent(event) {
    this._serverDestinations = this._pointsModel.getDestinations();
    this._serverOffers = this._pointsModel.getOffers();

    const pointPresenter = new PointPresenter(this._mainPointsList, this._viewActionHandler, this._modeChangeHandler, this._serverDestinations, this._serverOffers);
    pointPresenter.init(event);
    this._pointPresenter.set(event.id, pointPresenter);
  }

  _renderSort() {
    if (this._sortComponent) {
      remove(this._sortComponent);
    }

    this._sortComponent = new SortView(this._currentSortType);
    render(this._mainTripEventsElement, this._sortComponent, RenderPosition.AFTERBEGIN);
    this._sortComponent.setSortTypeChangeHandler(this._sortTypeChangeHandler);
  }

  _renderTripInfo() {
    if (this._tripInfoView) {
      remove(this._tripInfoView);
    }

    this._tripInfoView = new TripInfoView(this._getPoints());
    render(this._headerTripMainElement, this._tripInfoView, RenderPosition.AFTERBEGIN);
  }

  _renderCost() {
    if (this._costView) {
      remove(this._costView);
    }

    this._costView = new CostView(this._getPoints());
    render(this._tripInfoView, this._costView, RenderPosition.BEFOREEND);
  }

  _renderLoading() {
    render(this.this._mainPointsList, this._loadingView, RenderPosition.BEFOREEND);
  }

  _clearPointsList() {
    this._pointPresenter.forEach((point) => point.destroy());
    this._pointPresenter.clear();
  }

  _clearAllEvents({resetSortType = false, resetTripInfo = false, resetCost = false} = {}) {
    this._clearPointsList();

    if (this._newPointPresenter) {
      this._newPointPresenter.destroy();
    }

    if (this._noEventView) {
      remove(this._noEventView);
    }

    this._currentSortType = resetSortType ? SortType.DAY : this._currentSortType;

    if (resetTripInfo || resetCost) {
      remove(this._tripInfoView);
      remove(this._costView);
    }
  }

  // обработчик уведомления всех презентеров о смене режима (ставим всех в DEFAULT)
  _modeChangeHandler() {
    this._pointPresenter.forEach((point) => point.resetView());

    if (this._newPointPresenter) {
      this._newPointPresenter.destroy();
    }
  }

  // callback передаваймый в view
  // Здесь будем вызывать обновление модели.
  // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
  // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
  // update - обновленные данные
  _viewActionHandler(actionType, updateType, update) {
    switch(actionType) {
      case UserAction.UPDATE_POINT: {
        this._pointPresenter.get(update.id).setViewState(PointPresenterViewState.SAVING);
        this._api
          .updateEvent(update)
          .then((response) => {
            this._pointsModel.updatePoint(updateType, response);
          })
          .catch(() => {
            this._pointPresenter.get(update.id).setViewState(PointPresenterViewState.ABORTING);
          });
        break;
      }
      case UserAction.ADD_POINT: {
        this._newPointPresenter.setSaving();
        this._api
          .addEvent(update)
          .then((response) => {
            this._pointsModel.addPoint(updateType, response);
          })
          .catch(() => {
            this._newPointPresenter.setAborting();
          });
        break;
      }
      case UserAction.DELETE_POINT: {
        this._pointPresenter.get(update.id).setViewState(PointPresenterViewState.DELETING);
        this._api
          .deleteEvent(update)
          .then(() => {
            this._pointsModel.deletePoint(updateType, update);
          })
          .catch(() => {
            this._pointPresenter.get(update.id).setViewState(PointPresenterViewState.ABORTING);
          });
        break;
      }
    }
  }

  // callback передаваемый в model
  // В зависимости от типа изменений решаем, что делать:
  // - обновить часть списка (например, когда поменялось что-то в point)
  // - обновить список (например, когда задача удалена)
  // - обновить всю доску (например, при переключении фильтра)
  _modelEventChangeHandler(updateType, data) {
    switch(updateType) {
      case UpdateType.PATCH: {
        this._pointPresenter.get(data.id).init(data);
        break;
      }
      case UpdateType.MINOR: {
        this._clearAllEvents({resetTripInfo: true, resetCost: true});
        this._renderList();
        break;
      }
      case UpdateType.MAJOR: {
        this._clearAllEvents({resetSortType: true, resetTripInfo: true, resetCost: true});
        this._renderList();
        break;
      }
      case UpdateType.INIT: {
        this._isLoading = false;
        remove(this._loadingView);

        this._renderTripInfo();
        this._renderCost();
        this._renderSort();
        this._renderEvents();
        break;
      }
    }
  }

  _sortTypeChangeHandler(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._renderSort();
    this._clearPointsList();
    this._renderEvents();
  }
}

export {Trip as default};
