import TripPresenter from './presenter/trip.js';
import PointsModel from './model/points.js';
import FilterModel from './model/filter.js';
import FilterPresenter from './presenter/filter.js';
import {events} from './mock/data.js';

// const events = [];

const pointsModel = new PointsModel();
pointsModel.setPoints(events);

const filterModel = new FilterModel();

const sitePageHeaderElement = document.querySelector('.page-header');
const sitePageMainElement = document.querySelector('.page-main');
const headerTripMainElement = sitePageHeaderElement.querySelector('.trip-main');
const mainTripEventsElement = sitePageMainElement.querySelector('.trip-events');

// Пререзнтер Trip
const tripPresenter = new TripPresenter(headerTripMainElement, mainTripEventsElement, pointsModel, filterModel);
tripPresenter.init();

const filterPresenter = new FilterPresenter(
  headerTripMainElement.querySelector('.trip-controls__filters'),
  filterModel,
);
filterPresenter.init();

// нужно будет заблокировать кнопку New Point !
document.querySelector('.trip-main__event-add-btn').addEventListener('click', (evt) => {
  evt.preventDefault();
  // нужно будет передать коллбэк TripPresenter'а по созданию нового поинта
  tripPresenter.createPoint();
});

