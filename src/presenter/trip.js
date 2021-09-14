import PointPresenter from './point.js';
import NewPointPresenter from './new-point.js';
import SortView from '../view/sort.js';
import TripInfoView from '../view/trip-info.js';
import CostView from '../view/cost.js';
import PointsListView from '../view/points-list.js';
import NoEventsView from '../view/noEvents.js';
import MenuView from '../view/menu.js';
import {render, RenderPosition} from '../utils/render.js';
import {sortByDateUp, sortByDurationDown, sortByPriceDown} from '../utils/sort.js';
import {SortType, UserAction, UpdateType, FilterType} from '../utils/const.js';
import {remove} from '../utils/render.js';
import {filter} from '../utils/filter.js';

export default class Trip {
  constructor(headerTripMainElement, mainTripEventsElement, pointsModel, filterModel) {
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._headerTripMainElement = headerTripMainElement; // '.trip-main'
    this._mainTripEventsElement = mainTripEventsElement; // .trip-events'
    this._headerMenuElement = this._headerTripMainElement.querySelector('.trip-controls__navigation');
    this._pointPresenter = new Map(); // для хранения созданных pointPresenter'ов
    this._newPointPresenter = null;

    this._currentSortType = SortType.DAY;
    this._currentFilterType = FilterType.EVERYTHING;

    this._mainPointsList = null;
    this._sortComponent = null;
    this._noEventView = null;
    this._tripInfoView = null;
    this._costView = null;
    this._menuView = new MenuView();

    // this._handlePointChange = this._handlePointChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    render(this._headerMenuElement, this._menuView, RenderPosition.AFTEREND);
    this._renderList(this._getPoints());
  }

  createPoint() {
    if (this._newPointPresenter) {
      this._newPointPresenter.destroy();
    }
    this._currentSortType = FilterType.EVERYTHING;
    this._newPointPresenter = new NewPointPresenter(this._mainPointsList, this._handleViewAction);
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._newPointPresenter.init();
  }

  _getPoints() {
    this._currentFilterType = this._filterModel.getFilter();
    const points = this._pointsModel.getPoints();
    const filteredPoints = filter[this._currentFilterType](points);

    switch(this._currentSortType) {
      case SortType.DAY:
        return filteredPoints.slice().sort(sortByDateUp);
      case SortType.TIME:
        return filteredPoints.slice().sort(sortByDurationDown);
      case SortType.PRICE:
        return filteredPoints.slice().sort(sortByPriceDown);
    }

    return filteredPoints;
  }

  _renderList() {
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
    const pointPresenter = new PointPresenter(this._mainPointsList, this._handleViewAction, this._handleModeChange);
    pointPresenter.init(event);
    this._pointPresenter.set(event.id, pointPresenter);
  }

  _renderSort() {
    if (this._sortComponent) {
      remove(this._sortComponent); // TO DO: переделать - как ???
    }
    this._sortComponent = new SortView(this._currentSortType);
    render(this._mainTripEventsElement, this._sortComponent, RenderPosition.AFTERBEGIN);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderTripInfo() {
    if (this._tripInfoView !== null) {
      this._tripInfoView !== null;
    }

    this._tripInfoView = new TripInfoView(this._getPoints());
    render(this._headerTripMainElement, this._tripInfoView, RenderPosition.AFTERBEGIN);
  }

  _renderCost() {
    if (this._costView !== null) {
      this._costView !== null;
    }

    this._costView = new CostView(this._getPoints());
    render(this._tripInfoView, this._costView, RenderPosition.BEFOREEND);
  }

  _clearPointsList() {
    this._pointPresenter.forEach((point) => point.destroy());
    this._pointPresenter.clear();
  }

  _clearAllEvents({resetSortType = false, resetTripInfo = true, resetCost = true} = {}) {
    this._clearPointsList();

    if (this._newPointPresenter) {
      this._newPointPresenter.destroy();
    }

    if (this._noEventView) {
      remove(this._noEventView);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DAY;
    }

    if (resetTripInfo || resetCost) {
      remove(this._tripInfoView);
      remove(this._costView);
    }
  }

  // обработчик уведомления всех презентеров о смене режима (ставим всех в DEFAULT)
  _handleModeChange() {
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
  _handleViewAction(actionType, updateType, update) {
    switch(actionType) {
      case UserAction.UPDATE_POINT:
        this._pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this._pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this._pointsModel.deletePoint(updateType, update);
        break;
    }
  }

  // callback передаваемый в model
  // В зависимости от типа изменений решаем, что делать:
  // - обновить часть списка (например, когда поменялось что-то в point)
  // - обновить список (например, когда задача удалена)
  // - обновить всю доску (например, при переключении фильтра)
  _handleModelEvent(updateType, data) {
    switch(updateType) {
      case UpdateType.PATCH:
        this._pointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this._clearAllEvents({resetTripInfo: true, resetCost: true});
        this._renderList();
        break;
      case UpdateType.MAJOR:
        this._clearAllEvents({resetSortType: true, resetTripInfo: true, resetCost: true});
        this._renderList();
        break;
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._renderSort();
    this._clearPointsList();
    this._renderEvents();
  }
}
