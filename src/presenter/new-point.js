import NewEditPointView from '../view/point-edit.js';
import {render, remove, RenderPosition } from '../utils/render.js';
import {UserAction, UpdateType, EventFormMode, EventTypes, OperationType} from '../utils/const.js';
import {isEscEvent} from '../utils/common.js';
import {getRandomInteger} from '../utils/common.js';
import dayjs from 'dayjs';

const getBlankPoint = (destinationsServer, offersServer) => {
  const eventType = EventTypes.TAXI;
  const destinationCity = destinationsServer[getRandomInteger(0, destinationsServer.length - 1)].name; // получаем список возможных с сервера
  const dateStart = dayjs();

  return {
    eventType,
    destination: {
      name: destinationCity,
      description: destinationsServer.find((element) => element.name === destinationCity).description,
      pictures: destinationsServer.find((element) => element.name === destinationCity).pictures,
    },
    dateTime: {
      dateStart: dateStart.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
      dateEnd: dateStart.add(600, 'minute').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
    },
    price: 0,
    offers: offersServer.find((element) => element.type === eventType).offers,
    isFavorite: false,
  };
};

export default class NewPoint {
  constructor(pointListElement, changeData, destinationsServer, offersServer) {
    this._pointListElement = pointListElement;
    this._changeData = changeData;
    this._destinationsServer = destinationsServer;
    this._offersServer = offersServer;

    this._pointEditComponent = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleFormClose = this._handleFormClose.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._handleOnEscKeydown = this._handleOnEscKeydown.bind(this);
  }

  init (callback) {
    if (this._pointEditComponent !== null) {
      return;
    }

    this._destroyCallback = callback;

    const blankPoint = getBlankPoint(this._destinationsServer, this._offersServer);

    this._pointEditComponent = new NewEditPointView(OperationType.NEW, blankPoint, this._destinationsServer, this._offersServer);
    delete this._pointFormMode;
    this._pointEditComponent.setPointFormSubmitHandler(this._handleFormSubmit);
    this._pointEditComponent.setDeleteClickHandler(this._handleDeleteClick);

    render(this._pointListElement, this._pointEditComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this._handleOnEscKeydown);
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

    document.removeEventListener('keydown', this._handleOnEscKeydown);
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

  _handleFormSubmit(event) {
    this._changeData(
      UserAction.ADD_POINT,
      UpdateType.MAJOR,
      // Object.assign({id: nanoid()}, event),
      event,
    );

    this._pointFormMode = EventFormMode.EDIT;
    // this.destroy();
  }

  _handleFormClose() {
    this.destroy();
  }

  _handleDeleteClick() {
    this.destroy();
  }

  _handleOnEscKeydown(evt) {
    if (isEscEvent(evt)){
      document.removeEventListener('keydown', this._handleOnEscKeydown);
      this.destroy();
    }
  }
}
