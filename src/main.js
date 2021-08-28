import TripPresenter from './presenter/trip.js';
import TripInfoView from './view/trip-info.js';
import CostView from './view/cost.js';
import MenuView from './view/menu.js';
import FiltersView from './view/filters.js';
import {render, RenderPosition} from './utils/render.js';
import {events} from './mock/data.js';

// Сортировка элементов
const sortedEvents = events.sort((a, b) => a.dateTime.dateStart.toDate().getTime() - b.dateTime.dateStart.toDate().getTime());
// const sortedEvents = [];

const sitePageHeaderElement = document.querySelector('.page-header');
const sitePageMainElement = document.querySelector('.page-main');
const headerTripMainElement = sitePageHeaderElement.querySelector('.trip-main');
const headerMenuElement = headerTripMainElement.querySelector('.trip-controls__navigation');
const headerFiltersElement = headerTripMainElement.querySelector('.trip-controls__filters');
const mainTripEventsElement = sitePageMainElement.querySelector('.trip-events');


if (sortedEvents.length !== 0) {
  const headerTripInfoElement = new TripInfoView(sortedEvents); // '.trip-info'

  render(headerTripMainElement, headerTripInfoElement, RenderPosition.AFTERBEGIN);
  render(headerTripInfoElement, new CostView(sortedEvents), RenderPosition.BEFOREEND);
}

// Пререзнтер Trip
const tripPresenter = new TripPresenter(mainTripEventsElement);
tripPresenter.init(sortedEvents);

render(headerMenuElement, new MenuView(), RenderPosition.AFTEREND);
render(headerFiltersElement, new FiltersView(), RenderPosition.AFTEREND);

