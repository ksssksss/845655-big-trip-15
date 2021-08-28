import PointsListView from '../view/points-list.js';
import NoEventsView from '../view/noEvents.js';
import SortView from '../view/sort.js';
import {render, RenderPosition} from '../utils/render.js';
import PointPresenter from './point.js';
import {updateItem} from '../utils/common.js';
import {SortType} from '../utils/const.js';
import {sortByDateUp, sortByDurationDown, sortByPriceDown} from '../utils/sort.js';

export default class Trip {
  constructor(mainContentContainer) {
    this._mainContentContainer = mainContentContainer;
    this._pointPresenter = new Map(); // для хранения созданный pointPresenter'ов
    this._currentSortType = SortType.DAY;

    this._mainPointsList = new PointsListView();
    this._sortComponent = new SortView();
    this._noEventView = new NoEventsView();

    this._handlePointChange = this._handlePointChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(eventPoints) {
    this._eventPoints = eventPoints.slice();
    this._sourceEventPoints = eventPoints.slice();

    // сохраняем исходный порядок

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

  _handleModeChange() {
    this._pointPresenter.forEach((point) => point.resetView());
  }

  _handlePointChange(updatedPoint) {
    this._pointPresenter.get(updatedPoint.id).init(updatedPoint);
    this._eventPoints = updateItem(this._eventPoints, updatedPoint);
    this._sourceEventPoints = updateItem(this._sourceEventPoints, updatedPoint);
  }

  _handleSortTypeChange(sortType) {
    // Сортируем задачи
    this._sortEvents(sortType);
    this._clearPointsList();
    this._renderEvents(this._eventPoints);

    // Очищаем список
    // Рендерим отсортированный список
    // console.log('Sort Click!');
  }
}
