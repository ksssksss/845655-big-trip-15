import PointPresenter from './point.js';
import SortView from '../view/sort.js';
import PointsListView from '../view/points-list.js';
import NoEventsView from '../view/noEvents.js';
import {render, RenderPosition} from '../utils/render.js';
import {updateItem} from '../utils/common.js';
import {sortByDateUp, sortByDurationDown, sortByPriceDown} from '../utils/sort.js';
import {SortType} from '../utils/const.js';
import {remove} from '../utils/render.js';

export default class Trip {
  constructor(mainContentContainer) {
    this._mainContentContainer = mainContentContainer;
    this._pointPresenter = new Map(); // для хранения созданный pointPresenter'ов
    this._currentSortType = SortType.DAY;

    this._mainPointsList = new PointsListView();
    this._sortComponent = null;
    this._noEventView = new NoEventsView();

    this._handlePointChange = this._handlePointChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(eventPoints) {
    this._eventPoints = eventPoints.slice();
    this._sourceEventPoints = eventPoints.slice(); // копируем исходный список элементов
    this._renderList(this._eventPoints);
  }


  _renderList(events) {
    if (events.length === 0) {
      return this._renderNoEvents();
    }

    this._renderSort();
    this._renderEvents(events);
  }

  _renderNoEvents() {
    render(this._mainContentContainer, this._noEventView, RenderPosition.AFTERBEGIN);
  }

  _renderEvents(events) {
    render(this._mainContentContainer, this._mainPointsList, RenderPosition.BEFOREEND);
    events.forEach((event) => this._renderEvent(event));
  }

  _renderEvent(event) {
    const pointPresenter = new PointPresenter(this._mainPointsList, this._handlePointChange, this._handleModeChange);
    pointPresenter.init(event);
    this._pointPresenter.set(event.id, pointPresenter);
  }

  _renderSort() {
    if (this._sortComponent) {
      remove(this._sortComponent); // TO DO: переделать - как ???
    }
    this._sortComponent = new SortView(this._currentSortType);
    render(this._mainContentContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _sortEvents(sortType) {
    switch(sortType){
      case `sort-${SortType.DAY}`:
        this._eventPoints.sort(sortByDateUp);
        this._currentSortType = SortType.DAY;
        break;

      case `sort-${SortType.TIME}`:
        this._eventPoints.sort(sortByDurationDown);
        this._currentSortType = SortType.TIME;
        break;

      case `sort-${SortType.PRICE}`:
        this._eventPoints.sort(sortByPriceDown);
        this._currentSortType = SortType.PRICE;
        break;
    }
  }

  _clearPointsList() {
    this._pointPresenter.forEach((point) => point.destroy());
    this._pointPresenter.clear();
  }

  // обработчик уведомления всех презентеров о смене режима (ставим всех в DEFAULT)
  _handleModeChange() {
    this._pointPresenter.forEach((point) => point.resetView());
  }

  // обработчик изменений в задаче
  _handlePointChange(updatedPoint) {
    this._pointPresenter.get(updatedPoint.id).init(updatedPoint);
    this._eventPoints = updateItem(this._eventPoints, updatedPoint);
    this._sourceEventPoints = updateItem(this._sourceEventPoints, updatedPoint);
  }

  _handleSortTypeChange(sortType) {
    this._sortEvents(sortType);
    this._renderSort();
    this._clearPointsList();
    this._renderEvents(this._eventPoints);
  }
}
