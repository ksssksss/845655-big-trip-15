import PointsModel from './model/points.js';
import FilterModel from './model/filter.js';
import TripPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';
import MenuView from './view/menu.js';
import StatisticsView from './view/statistics.js';
import Api from './api/api.js';
import {remove, render, RenderPosition} from './utils/render.js';
import {MenuItem, UpdateType} from './utils/const.js';

const END_POINT = 'https://15.ecmascript.pages.academy/big-trip/';
const AUTHORIZATION = 'Basic ksksksksksksks';

const sitePageHeaderElement = document.querySelector('.page-header');
const sitePageMainElement = document.querySelector('.page-main');
const headerTripMainElement = sitePageHeaderElement.querySelector('.trip-main');
const mainTripEventsElement = sitePageMainElement.querySelector('.trip-events');
const headerMenuElement = headerTripMainElement.querySelector('.trip-controls__navigation');
const mainBodyContainer = sitePageMainElement.querySelector('.page-body__container');
const newEventButton = headerTripMainElement.querySelector('.trip-main__event-add-btn');

const api = new Api(END_POINT, AUTHORIZATION);

const pointsModel = new PointsModel();
const filterModel = new FilterModel();
const menuView = new MenuView();
let statisticsView = null;

// TRIP PRESENTER
const tripPresenter = new TripPresenter(headerTripMainElement, mainTripEventsElement, pointsModel, filterModel, api);

api.getData()
  .then((serverData) => {
    pointsModel.setDestinations(serverData.destinations);
    pointsModel.setOffers(serverData.offers);
    pointsModel.setPoints(UpdateType.INIT, serverData.events);
    render(headerMenuElement, menuView, RenderPosition.AFTEREND);
  })
  .catch(() => {
    pointsModel.setPoints(UpdateType.INIT, []);
    render(headerMenuElement, menuView, RenderPosition.AFTEREND);
  })
  .then(tripPresenter.init());

const handleNewPointButtonUndisabled = () => {
  newEventButton.disabled = false;
};

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
