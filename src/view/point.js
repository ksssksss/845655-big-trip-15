import {calculateDuration} from '../utils/date.js';
import AbstractView from './abstract.js';

const createOfferTemplate = (offerData) => {
  const {name, price} = offerData;

  return `<li class="event__offer">
    <span class="event__offer-title">${name}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${price}</span>
  </li>`;
};

const createPointTemplate = (event) => {
  const {
    eventType,
    destinationCity,
    dateTime,
    price,
    offers,
    isFavorite,
  } = event;

  const startData = dateTime.dateStart.format('YYYY-MM-DD');
  const startDataTime = dateTime.dateStart.format('YYYY-MM-DDTHH:mm');
  const endDataTime = dateTime.dateEnd.format('YYYY-MM-DDTHH:mm');
  const offersList = offers.map((value) => createOfferTemplate(value)).join(' ');
  const startTime = dateTime.dateStart.format('HH:mm');
  const endTime = dateTime.dateEnd.format('HH:mm');
  const startDate = dateTime.dateStart.format('MMM DD');
  const duration = calculateDuration(dateTime.dateStart, dateTime.dateEnd);
  const favotiteClass = isFavorite ? 'event__favorite-btn--active' : '';


  return `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime=${startData}>${startDate}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${eventType.toLowerCase()}.png" alt="${eventType.toLowerCase()} icon">
      </div>
      <h3 class="event__title">${eventType} ${destinationCity}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime=${startDataTime}>${startTime}</time>
          &mdash;
          <time class="event__end-time" datetime=${endDataTime}>${endTime}</time>
        </p>
        <p class="event__duration">${duration}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${price}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${offersList}
      </ul>
      <button class="event__favorite-btn  ${favotiteClass}" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`;
};

export default class Point extends AbstractView {
  constructor (event) {
    super();
    this._event = event;

    this._onEditBtnClick = this._onEditBtnClick.bind(this);
    this._onFavoriteClick = this._onFavoriteClick.bind(this);
  }

  _onEditBtnClick() {
    this._callback.editPoint();
  }

  _onFavoriteClick() {
    this._callback.favoriteClick();
  }

  getTemplate() {
    return createPointTemplate(this._event);
  }

  setOnEditBtnClick(callback) {
    this._callback.editPoint = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._onEditBtnClick);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('.event__favorite-btn').addEventListener('click', this._onFavoriteClick);
  }
}
