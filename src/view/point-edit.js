// import AbstractView from './abstract.js';
import SmartView from './smart.js';
import dayjs from 'dayjs';
import {destinationsMock, offersMock} from '../mock/mock-structures.js';
import {getRandomInteger} from '../utils/common.js';

export const OperationType = {
  NEW: 'new',
  EDIT: 'edit',
};

const EventTypes = {
  TAXI: 'taxi',
  BUS: 'bus',
  TRAIN: 'train',
  SHIP: 'ship',
  DRIVE: 'drive',
  FLIGHT: 'flight',
  CHECKIN: 'check-in',
  SIGHTSEEING: 'sightseeing',
  RESTAURANT: 'restaurant',
};

const getBlankPoint = () => {
  const eventType = EventTypes.TAXI;
  const destinationCity = destinationsMock[getRandomInteger(0, destinationsMock.length - 1)].name; // получаем список возможных с сервера
  const dateStart = dayjs();

  return {
    eventType,
    destination: {
      name: destinationCity,
      description: destinationsMock.find((element) => element.name === destinationCity).description,
      pictures: destinationsMock.find((element) => element.name === destinationCity).pictures,
    },
    dateTime: {
      dateStart: dateStart,
      dateEnd: dateStart.add(600, 'minute'),
    },
    price: 0,
    offers: offersMock.find((element) => element.type === eventType).offers,
    isFavorite: false,
  };
};

const createOffersTemplate = (offersArray) => {
  let offersList = '';
  offersArray.forEach((offer, index) => {
    offersList += `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${index}" type="checkbox" name="event-offer-comfort" data-index="${index}" ${offer.isChecked ? 'checked' : ''}>
    <label class="event__offer-label" for="event-offer-${index}">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </label>
  </div>`;
  });

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
  `<img class="event__photo" src="${pictureSrc.src}" alt="${pictureSrc.description}">`
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

const createDestinationsListTemplate = (destinations) => {
  let datalistOptions = '';
  destinations.forEach((destination) => {
    datalistOptions += `<option value="${destination.name}"></option>`;
  });
  return `<datalist id="destination-list-1">${datalistOptions}</datalist>`;
};

const createNewEditPointTemplate = (operation, data) => {
  const {
    eventType,
    destination,
    dateTime,
    price,
    offers,
    // description, // получаем с сервера
    // pictures, // получаем с сервера
    isHasOffers,
    isHasPictures,
  } = data;

  const offersList = isHasOffers ? createOffersTemplate(offers) : '';
  const startData = dateTime.dateStart.format('DD/MM/YY HH:mm');
  const endData = dateTime.dateEnd.format('DD/MM/YY HH:mm');
  const descriptionText = createDescriptionTemplate(destination.description);
  const picturesList = isHasPictures? createPicturesTemplate(destination.pictures): '';
  const eventControls = setOperationTemplate(operation); // изменение шаблона event взависимости от operation: new event / edit event
  const destinationsCityList = createDestinationsListTemplate(destinationsMock);

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
                <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi" ${eventType === EventTypes.TAXI ? 'checked' : ''}>
                <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus" ${eventType === EventTypes.BUS ? 'checked' : ''}>
                <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train" ${eventType === EventTypes.TRAIN ? 'checked' : ''}>
                <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship" ${eventType === EventTypes.SHIP ? 'checked' : ''}>
                <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-transport-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="transport">
                <label class="event__type-label  event__type-label--transport" for="event-type-transport-1">Transport</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive" ${eventType === EventTypes.DRIVE ? 'checked' : ''}>
                <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" ${eventType === EventTypes.FLIGHT ? 'checked' : ''}>
                <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in" ${eventType === EventTypes.CHECKIN ? 'checked' : ''}>
                <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing" ${eventType === EventTypes.SIGHTSEEING ? 'checked' : ''}>
                <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant" ${eventType === EventTypes.RESTAURANT ? 'checked' : ''}>
                <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
              </div>
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${eventType}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
          ${destinationsCityList}
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

export default class NewEditPoint extends SmartView {
  constructor(operation, event = getBlankPoint()) {
    super();
    this._operation = operation;
    this._data = NewEditPoint.parseEventToData(this._operation, event);

    this._pointFormSubmitHandler = this._pointFormSubmitHandler.bind(this);
    this._rollupBtnClickHandler = this._rollupBtnClickHandler.bind(this);
    this._eventTypeClickHandler = this._eventTypeClickHandler.bind(this);
    // this._destinationClickHandler = this._destinationClickHandler.bind(this);
    this._destinationInputHandler = this._destinationInputHandler.bind(this);
    this._offerChangeHandler = this._offerChangeHandler.bind(this);
    this._priceInputHandler = this._priceInputHandler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createNewEditPointTemplate(this._operation, this._data);
  }

  setPointFormSubmitHandler(callback) {
    this._callback.submitForm = callback;
    this.getElement().querySelector('form').addEventListener('submit', this._pointFormSubmitHandler);
  }

  setRollupBtnClickHandler(callback) {
    this._callback.rollupForm = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._rollupBtnClickHandler);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setPointFormSubmitHandler(this._callback.submitForm);
    this.setRollupBtnClickHandler(this._callback.rollupForm);
  }

  reset(event) {
    this.updateData(
      NewEditPoint.parseEventToData(OperationType.EDIT, event),
    );
  }

  _eventTypeClickHandler(evt) {
    evt.preventDefault();
    const selectedType = evt.target.previousElementSibling.value;

    // selectedType === transport ?
    const offers = offersMock.find((element) => element.type === selectedType).offers;
    if (!offers.length !== 0) {
      offers.forEach((offer) => offer.isChecked = false);
    }

    this.updateData({
      eventType: selectedType,
      offers: offers,
      isHasOffers: offers.length !== 0,
    });
  }

  _destinationClickHandler(evt) {
    evt.preventDefault();
    evt.target.value = '';
  }

  _destinationInputHandler(evt) {
    const input = evt.target;
    evt.preventDefault();
    const inputDestinationValue = evt.target.value;
    input.blur();

    // нужно ограничить ввод пользовательских значений !

    const description = destinationsMock.find((element) => element.name === inputDestinationValue).description;
    const pictures = destinationsMock.find((element) => element.name === inputDestinationValue).pictures;

    this.updateData({
      destination: {
        name: inputDestinationValue,
        description,
        pictures,
      },
      isHasPictures: pictures.length !== 0,
    });
  }

  _offerChangeHandler(evt) {
    evt.preventDefault();
    const offersIndex = evt.target.dataset.index;

    this.updateData({
      offers: Object.assign(
        [],
        this._data.offers,
        this._data.offers[offersIndex].isChecked = evt.target.checked,
      ),
    });
  }

  _priceInputHandler(evt) {
    evt.preventDefault();
    const inputPrice = Number(evt.target.value);

    this.updateData({
      price: inputPrice && inputPrice > 0 ? inputPrice : 0,
    }, true);
  }

  _setInnerHandlers() {
    this.getElement().querySelector('.event__type-list').addEventListener('click', this._eventTypeClickHandler);
    this.getElement().querySelector('.event__input--destination').addEventListener('click', this._destinationClickHandler);
    this.getElement().querySelector('.event__input--destination').addEventListener('input', this._destinationInputHandler);
    this.getElement().querySelector('.event__input--price').addEventListener('input', this._priceInputHandler);
    if (this._data.isHasOffers) {
      this.getElement().querySelector('.event__available-offers').addEventListener('change', this._offerChangeHandler);
    }
  }

  _pointFormSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.submitForm(NewEditPoint.parseDataToEvent(this._data));
  }

  _rollupBtnClickHandler() {
    this._callback.rollupForm();
  }


  // event - данные c MODEL (сервер)
  static parseEventToData(operation, event) {

    return Object.assign(
      {},
      event,
      {
        isHasOffers: event.offers.length !== 0,
        isHasPictures: event.destination.pictures.length !== 0,
        isEditMode: operation === OperationType.EDIT,
      },
    );
  }

  // data - состояния c VIEW
  static parseDataToEvent(data) {
    data = Object.assign({}, data);

    delete data.isHasOffers;
    delete data.isHasPictures;

    return data;
  }

}
