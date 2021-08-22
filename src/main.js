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
import {render, replace, RenderPosition} from './utils/render.js';
import {isEscEvent} from './utils/common.js';

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
    replace(pointEditComponent, pointComponent);
  };

  const replaceFormToCard = () => {
    replace(pointComponent, pointEditComponent);
  };

  const onEscKeydown = (evt) => {
    if (isEscEvent(evt)){
      replaceFormToCard();
      document.removeEventListener('keydown', onEscKeydown);
    }
  };

  pointEditComponent.setOnPointFormSubmit(() => {
    replaceFormToCard();
    document.removeEventListener('keydown', onEscKeydown);
  });

  pointEditComponent.setOnRollupBtnClick(() => {
    replaceFormToCard();
    document.removeEventListener('keydown', onEscKeydown);
  });

  pointComponent.setOnEditBtnClick(() => {
    replaceCardToFrom();
    document.addEventListener('keydown', onEscKeydown);
  });

  render(pointListElement, pointComponent, RenderPosition.BEFOREEND);
};

const renderEventsContent = (mainContentContainer, eventPoints) => {
  if (eventPoints.length === 0) {
    return render(mainContentContainer, new NoEventsView(), RenderPosition.AFTERBEGIN);
  }

  const mainPointsList = new PointsListView(); // '.trip-events__list'
  const headerTripInfoElement = new TripInfoView(eventPoints); // '.trip-info'
  // HEADER
  render(headerTripMainElement, headerTripInfoElement, RenderPosition.AFTERBEGIN);
  render(headerTripInfoElement, new CostView(eventPoints), RenderPosition.BEFOREEND);
  // MAIN
  render(mainContentContainer, new SortView(), RenderPosition.AFTERBEGIN);
  render(mainContentContainer, mainPointsList, RenderPosition.BEFOREEND);
  eventPoints.forEach((point) => renderPoint(mainPointsList, point));
  render(mainPointsList, new NewEditPointView(OperationType.NEW), RenderPosition.BEFOREEND);
};

render(headerMenuElement, new MenuView(), RenderPosition.AFTEREND);
render(headerFiltersElement, new FiltersView(), RenderPosition.AFTEREND);
renderEventsContent(mainTripEventsElement, sortedEvents);
