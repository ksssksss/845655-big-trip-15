import NewEditPointView from '../view/new-edit-point.js';
import {render, remove, RenderPosition } from '../utils/render.js';
import {UserAction, UpdateType, EventFormMode, EventType, OperationType} from '../utils/const.js';
import {isEscEvent} from '../utils/common.js';
import {getRandomInteger} from '../utils/common.js';
import dayjs from 'dayjs';

const getBlankPoint = (serverDestinations, serverOffers) => {
  const eventType = EventType.TAXI;
  const destinationCity = serverDestinations[getRandomInteger(0, serverDestinations.length - 1)].name; // получаем список возможных с сервера
  const dateStart = dayjs();

  return {
    eventType,
    destination: {
      name: destinationCity,
      description: serverDestinations.find((element) => element.name === destinationCity).description,
      pictures: serverDestinations.find((element) => element.name === destinationCity).pictures,
    },
    dateTime: {
      dateStart: dateStart.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
      dateEnd: dateStart.add(600, 'minute').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
    },
    price: 0,
    offers: serverOffers.find((element) => element.type === eventType).offers,
    isFavorite: false,
  };
};

class NewPoint {
  constructor(pointListElement, changeData, serverDestinations, serverOffers) {
    this._pointListElement = pointListElement;
    this._changeData = changeData;
    this._serverDestinations = serverDestinations;
    this._serverOffers = serverOffers;

    this._pointEditComponent = null;

    this._formSubmitClickHandler = this._formSubmitClickHandler.bind(this);
    this._formCloseClickHandler = this._formCloseClickHandler.bind(this);
    this._deleteClickHandler = this._deleteClickHandler.bind(this);
    this._escKeydownHandler = this._escKeydownHandler.bind(this);
  }

  init (callback) {
    if (this._pointEditComponent !== null) {
      return;
    }

    this._destroyCallback = callback;

    const blankPoint = getBlankPoint(this._serverDestinations, this._serverOffers);

    this._pointEditComponent = new NewEditPointView(OperationType.NEW, blankPoint, this._serverDestinations, this._serverOffers);
    delete this._pointFormMode;
    this._pointEditComponent.setPointFormSubmitHandler(this._formSubmitClickHandler);
    this._pointEditComponent.setDeleteClickHandler(this._deleteClickHandler);

    render(this._pointListElement, this._pointEditComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this._escKeydownHandler);
  }

  destroy() {
    if (this._pointEditComponent === null) {
      return;
    }

    if (this._destroyCallback !== null) {
      this._destroyCallback();
    }

    remove(this._pointEditComponent);
    this._pointEditComponent = null;

    document.removeEventListener('keydown', this._escKeydownHandler);
  }

  setSaving() {
    this._pointEditComponent.updateData({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this._pointEditComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this._pointEditComponent.shake(resetFormState);
  }

  _formSubmitClickHandler(event) {
    this._changeData(
      UserAction.ADD_POINT,
      UpdateType.MAJOR,
      event,
    );

    this._pointFormMode = EventFormMode.EDIT;
  }

  _formCloseClickHandler() {
    this.destroy();
  }

  _deleteClickHandler() {
    this.destroy();
  }

  _escKeydownHandler(evt) {
    if (isEscEvent(evt)){
      document.removeEventListener('keydown', this._escKeydownHandler);
      this.destroy();
    }
  }
}

export {NewPoint as default};
