import AbstractView from './abstract.js';
import dayjs from 'dayjs';

export const OperationType = {
  NEW: 'new',
  EDIT: 'edit',
};

const BLANK_POINT = {
  eventType: 'Taxi',
  destinationCity: '', // получаем список возможных с сервера
  dateTime: {
    dateStart: dayjs(),
    dateEnd: dayjs(),
  },
  price: 0,
  offers: [], // получаем список возможных с сервера
  description: '',
  pictures: [],
};

const createOfferTemplate = (offerData) => {
  const {name, price} = offerData;

  return `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-comfort-1" type="checkbox" name="event-offer-comfort">
    <label class="event__offer-label" for="event-offer-comfort-1">
      <span class="event__offer-title">${name}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${price}</span>
    </label>
  </div>`;
};

const createOffersTemplate = (offersArray) => {
  const offersList = offersArray.map((value) => createOfferTemplate(value)).join(' ');
  return `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

    <div class="event__available-offers">
      ${offersList}
    </div>
  </section>`;
};

const createDescriptionTemplate = (description) => (
  `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${description}</p>
  </section>`
);

const createPictureTemplate = (pictureSrc) => (
  `<img class="event__photo" src="${pictureSrc}" alt="Event photo">`
);

const createPicturesTemplate = (picturesArray) => {
  const picturesList = picturesArray.map((value) => createPictureTemplate(value)).join(' ');
  return `<div class="event__photos-container">
    <div class="event__photos-tape">
      ${picturesList}
    </div>
  </div>`;
};

const setOperationTemplate = (operation) => {
  switch (operation) {
    case 'edit':
      return 'Delete';

    case 'new':
      return 'Cancel';
  }
};

const createNewEditPointTemplate = (operation, event) => {
  const {
    eventType,
    destinationCity,
    dateTime,
    price,
    offers,
    description,
    pictures,
  } = event;

  const offersList = offers.length !== 0 ? createOffersTemplate(offers) : '';
  const startData = dateTime.dateStart.format('DD/MM/YY HH:mm');
  const endData = dateTime.dateEnd.format('DD/MM/YY HH:mm');
  const descriptionText = description ? createDescriptionTemplate(description) : '';
  const picturesList = pictures.length !== 0 ? createPicturesTemplate(pictures): '';
  const eventControls = setOperationTemplate(operation); // изменение шаблона event взависимости от operation: new event / edit event

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${eventType.toLowerCase()}.png" alt="${eventType.toLowerCase()} icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>

              <div class="event__type-item">
                <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi">
                <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus">
                <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train">
                <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship">
                <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-transport-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="transport">
                <label class="event__type-label  event__type-label--transport" for="event-type-transport-1">Transport</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive">
                <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" checked>
                <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in">
                <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing">
                <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant">
                <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
              </div>
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${eventType}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destinationCity}" list="destination-list-1">
          <datalist id="destination-list-1">
            <option value="Amsterdam"></option>
            <option value="Geneva"></option>
            <option value="Chamonix"></option>
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startData}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endData}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">${eventControls}</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        ${offersList}
        ${descriptionText}
        ${picturesList}
      </section>
    </form>
  </li>`;
};

export default class NewEditPoint extends AbstractView {
  constructor(operation, event = BLANK_POINT) {
    super();
    this._event = event;
    this._operation = operation;

    this._pointFormSubmitHandler = this._pointFormSubmitHandler.bind(this);
    this._rollupBtnClickHandler = this._rollupBtnClickHandler.bind(this);
  }

  _pointFormSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.submitForm(this._event);
  }

  _rollupBtnClickHandler() {
    this._callback.rollupForm();
  }

  getTemplate() {
    return createNewEditPointTemplate(this._operation, this._event);
  }

  setPointFormSubmitHandler(callback) {
    this._callback.submitForm = callback;
    this.getElement().querySelector('form').addEventListener('submit', this._pointFormSubmitHandler);
  }

  setRollupBtnClickHandler(callback) {
    this._callback.rollupForm = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._rollupBtnClickHandler);
  }
}
