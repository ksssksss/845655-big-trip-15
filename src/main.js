import {events} from './mock/data.js';
import TripPresenter from './presenter/trip.js';

// Сортировка элементов
const sortedEvents = events.sort((a, b) => a.dateTime.dateStart.toDate().getTime() - b.dateTime.dateStart.toDate().getTime());
// const sortedEvents = [];

const mainTripEventsElement = document.querySelector('.trip-events');

const tripPresenter = new TripPresenter(mainTripEventsElement);
tripPresenter.init(sortedEvents);

