import PointsModel from './model/points.js';
import FilterModel from './model/filter.js';
import TripPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';
import MenuView from './view/menu.js';
import StatisticsView from './view/statistics.js';
import {remove, render, RenderPosition} from './utils/render.js';
import {MenuItem} from './utils/const.js';
import {events} from './mock/data.js';

// const events = [];

const sitePageHeaderElement = document.querySelector('.page-header');
const sitePageMainElement = document.querySelector('.page-main');
const headerTripMainElement = sitePageHeaderElement.querySelector('.trip-main');
const mainTripEventsElement = sitePageMainElement.querySelector('.trip-events');
const headerMenuElement = headerTripMainElement.querySelector('.trip-controls__navigation');
const mainBodyContainer = sitePageMainElement.querySelector('.page-body__container');
const newEventButton = headerTripMainElement.querySelector('.trip-main__event-add-btn');

const pointsModel = new PointsModel();
const filterModel = new FilterModel();
const menuView = new MenuView();
let statisticsView = null;

pointsModel.setPoints(events);

const handleNewPointButtonUndisabled = () => {
  newEventButton.disabled = false;
};

// MENU
render(headerMenuElement, menuView, RenderPosition.AFTEREND);

// TRIP PRESENTER
const tripPresenter = new TripPresenter(headerTripMainElement, mainTripEventsElement, pointsModel, filterModel);
tripPresenter.init();

// FILTER PRESENTER
const filterPresenter = new FilterPresenter(
  headerTripMainElement.querySelector('.trip-controls__filters'),
  filterModel,
);
filterPresenter.init();

// ADD NEW EVENT
newEventButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  newEventButton.disabled = true;
  // нужно будет передать коллбэк TripPresenter'а по созданию нового поинта
  tripPresenter.createPoint(handleNewPointButtonUndisabled);
});


// MENU CLICK
const handleMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.EVENTS:
      menuView.setMenuItem(menuItem);
      remove(statisticsView);
      tripPresenter.init();
      handleNewPointButtonUndisabled();
      break;
    case MenuItem.STATISTICS:
      menuView.setMenuItem(menuItem);
      newEventButton.disabled = true;
      tripPresenter.destroy();
      statisticsView = new StatisticsView(pointsModel);
      render(mainBodyContainer, statisticsView, RenderPosition.BEFOREEND);
      break;
  }
};

menuView.setMenuClickHandler(handleMenuClick);

