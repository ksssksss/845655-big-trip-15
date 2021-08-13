import {createTripInfoTemplate} from './view/trip-info.js';
import {createCostInfoTemplate} from './view/cost.js';
import {createMenuTemplate} from './view/menu.js';
import {createFiltersTemplate} from './view/filters.js';
import {createSortTemplate} from './view/sort.js';
import {createPointsListTemplate} from './view/points-list.js';
import {createNewEditPointTemplate} from './view/new-or-edit-point.js';
import {createTripItemTemplate} from './view/trip-item.js';
import {events} from './mock/data.js';

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


// console.log(events);

const mainPointsList = mainTripEventsElement.querySelector('.trip-events__list');
render(mainPointsList, createNewEditPointTemplate(events[0], 'edit'), 'beforeend');

for (let i = 1; i < events.length - 1; i++) {
  render(mainPointsList, createTripItemTemplate(events[i]), 'beforeend');
}

render(mainPointsList, createNewEditPointTemplate(events[events.length - 1], 'new'), 'beforeend');


