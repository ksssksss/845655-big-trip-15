import {render, RenderPosition} from './utils/render.js';
import TripInfoView from './view/trip-info.js';
import CostView from './view/cost.js';
import MenuView from './view/menu.js';
import FiltersView from './view/filters.js';
import SortView from './view/sort.js';
import PointsListView from './view/points-list.js';
import NewEditPointView from './view/point-edit';
import PointView from './view/point.js';
import NoEventsView from './view/noEvents.js';
import {OperationType} from './view/point-edit';
import {events} from './mock/data.js';
import {isEscEvent} from './utils/utils.js';

// Сортировка элементов
const sortedEvents = events.sort((a, b) => a.dateTime.dateStart.toDate().getTime() - b.dateTime.dateStart.toDate().getTime());

const sitePageHeaderElement = document.querySelector('.page-header');
const sitePageMainElement = document.querySelector('.page-main');
const headerTripMainElement = sitePageHeaderElement.querySelector('.trip-main');
const headerMenuElement = headerTripMainElement.querySelector('.trip-controls__navigation');
const headerFiltersElement = headerTripMainElement.querySelector('.trip-controls__filters');
const mainTripEventsElement = sitePageMainElement.querySelector('.trip-events');

const renderPoint = (pointListElement, point) => {
  const pointComponent = new PointView(point);
  const pointEditComponent = new NewEditPointView(OperationType.EDIT, point);

  const replaceCardToFrom = () => {
    pointListElement.replaceChild(pointEditComponent.getElement(), pointComponent.getElement());
  };

  const replaceFormToCard = () => {
    pointListElement.replaceChild(pointComponent.getElement(), pointEditComponent.getElement());
  };

  const onEscKeydown = (evt) => {
    if (isEscEvent(evt)){
      replaceFormToCard();
      document.removeEventListener('keydown', onEscKeydown);
    }
  };

  const onPointFormSubmit = (evt) => {
    evt.preventDefault();
    replaceFormToCard();
    document.removeEventListener('keydown', onEscKeydown);
  };

  const onRollupBtnClick = () => {
    replaceFormToCard();
    document.removeEventListener('keydown', onEscKeydown);
  };

  pointEditComponent.getElement().querySelector('form').addEventListener('submit', onPointFormSubmit);
  pointEditComponent.getElement().querySelector('.event__rollup-btn').addEventListener('click', onRollupBtnClick);

  pointComponent.getElement().querySelector('.event__rollup-btn').addEventListener('click', () => {
    replaceCardToFrom();
    document.addEventListener('keydown', onEscKeydown);
  });

  render(pointListElement, pointComponent.getElement(), RenderPosition.BEFOREEND);
};

const renderEventsContent = (mainContentContainer, eventPoints) => {
  if (eventPoints.length === 0) {
    return render(mainContentContainer, new NoEventsView().getElement(), RenderPosition.AFTERBEGIN);
  }

  const mainPointsList = new PointsListView(); // '.trip-events__list'
  const headerTripInfoElement = new TripInfoView(eventPoints); // '.trip-info'
  // HEADER
  render(headerTripMainElement, headerTripInfoElement.getElement(), RenderPosition.AFTERBEGIN);
  render(headerTripInfoElement.getElement(), new CostView(eventPoints).getElement(), RenderPosition.BEFOREEND);
  // MAIN
  render(mainContentContainer, new SortView().getElement(), RenderPosition.AFTERBEGIN);
  render(mainContentContainer, mainPointsList.getElement(), RenderPosition.BEFOREEND);
  // for (let i = 0; i < eventPoints.length; i++) {
  //   renderPoint(mainPointsList.getElement(), eventPoints[i]);
  // }
  eventPoints.forEach((point) => renderPoint(mainPointsList.getElement(), point));
  render(mainPointsList.getElement(), new NewEditPointView(OperationType.NEW).getElement(), RenderPosition.BEFOREEND);
};

render(headerMenuElement, new MenuView().getElement(), RenderPosition.AFTEREND);
render(headerFiltersElement, new FiltersView().getElement(), RenderPosition.AFTEREND);
renderEventsContent(mainTripEventsElement, sortedEvents);


