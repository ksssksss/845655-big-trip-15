import {createTripInfoTemplate} from './view/trip-info.js';
import {createCostInfoTemplate} from './view/cost.js';
import {createMenuTemplate} from './view/menu.js';
import {createFiltersTemplate} from './view/filters.js';
import {createSortTemplate} from './view/sort.js';
import {createPointsListTemplate} from './view/points-list.js';
import {createEditPointTemplate} from './view/edit-point.js';
import {createTripItemTemplate} from './view/trip-item.js';

const POINT_COUNT = 3;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const headerTripMainElement = document.querySelector('.trip-main');
const headerMenuElement = headerTripMainElement.querySelector('.trip-controls__navigation');
const headerFiltersElement = headerTripMainElement.querySelector('.trip-controls__filters');
const mainTripEventsElement = document.querySelector('.trip-events');

render(headerTripMainElement, createTripInfoTemplate(), 'afterbegin');

const headerTripInfoElement = headerTripMainElement.querySelector('.trip-info');
render(headerTripInfoElement, createCostInfoTemplate(), 'beforeend');

render(headerMenuElement, createMenuTemplate(), 'afterend');
render(headerFiltersElement, createFiltersTemplate(), 'afterend');

render(mainTripEventsElement, createSortTemplate(), 'afterbegin');
render(mainTripEventsElement, createPointsListTemplate(), 'beforeend');

const mainPointsList = mainTripEventsElement.querySelector('.trip-events__list');
render(mainPointsList, createEditPointTemplate(), 'beforeend');
for (let i = 0; i < POINT_COUNT; i++) {
  render(mainPointsList, createTripItemTemplate(), 'beforeend');
}


