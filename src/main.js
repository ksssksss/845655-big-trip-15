import {render} from './utils/render.js';
import {createTripInfoTemplate} from './view/trip-info.js';
import {createCostInfoTemplate, calculateCost} from './view/cost.js';
import {createMenuTemplate} from './view/menu.js';
import {createFiltersTemplate} from './view/filters.js';
import {createSortTemplate} from './view/sort.js';
import {createPointsListTemplate} from './view/points-list.js';
import {createNewEditPointTemplate} from './view/point-edit';
import {createTripItemTemplate} from './view/trip-item.js';
import {events} from './mock/data.js';

// Вычисление общей стоймости
const cost = calculateCost(events);

// Сортировка элементов
const sortedEvents = events.sort((a, b) => a.dateTime.dateStart.toDate().getTime() - b.dateTime.dateStart.toDate().getTime());

const headerTripMainElement = document.querySelector('.trip-main');
const headerMenuElement = headerTripMainElement.querySelector('.trip-controls__navigation');
const headerFiltersElement = headerTripMainElement.querySelector('.trip-controls__filters');
const mainTripEventsElement = document.querySelector('.trip-events');

render(headerTripMainElement, createTripInfoTemplate(sortedEvents), 'afterbegin');

const headerTripInfoElement = headerTripMainElement.querySelector('.trip-info');
render(headerTripInfoElement, createCostInfoTemplate(cost), 'beforeend');

render(headerMenuElement, createMenuTemplate(), 'afterend');
render(headerFiltersElement, createFiltersTemplate(), 'afterend');

render(mainTripEventsElement, createSortTemplate(), 'afterbegin');
render(mainTripEventsElement, createPointsListTemplate(), 'beforeend');

const mainPointsList = mainTripEventsElement.querySelector('.trip-events__list');
render(mainPointsList, createNewEditPointTemplate(sortedEvents[0], 'edit'), 'beforeend');

for (let i = 1; i < sortedEvents.length - 1; i++) {
  render(mainPointsList, createTripItemTemplate(sortedEvents[i]), 'beforeend');
}

render(mainPointsList, createNewEditPointTemplate(sortedEvents[sortedEvents.length - 1], 'new'), 'beforeend');


