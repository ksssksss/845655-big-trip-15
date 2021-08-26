import TripInfoView from '../view/trip-info.js';
import PointsListView from '../view/points-list.js';
import NoEventsView from '../view/noEvents.js';
import CostView from '../view/cost.js';
import SortView from '../view/sort.js';
import MenuView from '../view/menu.js';
import FiltersView from '../view/filters.js';
import {render, RenderPosition} from '../utils/render.js';
import PointPresenter from './point.js';
import {updateItem} from '../utils/common.js';

export default class Trip {
  constructor(mainContentContainer) {
    this._mainContentContainer = mainContentContainer;
    this._headerTripMainElement = document.querySelector('.trip-main');
    this._pointPresenter = new Map(); // для хранения созданный pointPresenter'ов

    this._mainPointsList = new PointsListView();
    this._sortComponent = new SortView();
    this._menuComponent = new MenuView();
    this._filterComponent = new FiltersView();
    this._noEventView = new NoEventsView();
    this._headerTripInfoElement = null;
    this._costComponent = null;

    this._handlePointChange = this._handlePointChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
  }

  init(eventPoints) {
    this._eventPoints = eventPoints.slice();

    this._renderMenu();
    this._renderFilter();
    this._renderList(this._eventPoints);
  }


  _renderList(events) {
    if (events.length === 0) {
      return this._renderNoEvents();
    }

    this._renderTripMainInfo();
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

  _renderMenu() {
    const headerMenuElement = this._headerTripMainElement.querySelector('.trip-controls__navigation');
    render(headerMenuElement, this._menuComponent, RenderPosition.AFTEREND);
  }

  _renderFilter() {
    const headerFiltersElement = this._headerTripMainElement.querySelector('.trip-controls__filters');
    render(headerFiltersElement, this._filterComponent, RenderPosition.AFTEREND);
  }

  _renderTripMainInfo() {
    // рендер TripInfo и Cost
    this._headerTripInfoElement = new TripInfoView(this._eventPoints);
    this._costComponent = new CostView(this._eventPoints);
    render(this._headerTripMainElement, this._headerTripInfoElement, RenderPosition.AFTERBEGIN);
    render(this._headerTripInfoElement, this._costComponent, RenderPosition.BEFOREEND);
  }

  _renderSort() {
    render(this._mainContentContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
  }

  _clearPointsList() {
    this._pointPresenter.forEach((point) => point.destroy());
    this._pointPresenter.clear();
  }

  _handleModeChange() {
    this._pointPresenter.forEach((point) => point.resetView());
  }

  _handlePointChange(updatedPoint) {
    this._eventPoints = updateItem(this._eventPoints, updatedPoint);
    this._pointPresenter.get(updatedPoint.id).init(updatedPoint);
  }
}
