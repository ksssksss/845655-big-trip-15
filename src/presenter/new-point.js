import NewEditPointView from '../view/point-edit.js';
import {render, remove, RenderPosition } from '../utils/render.js';
import {UserAction, UpdateType, EventFormMode, EventTypes, OperationType} from '../utils/const.js';
import {destinationsMock, offersMock} from '../mock/mock-structures.js';
import {isEscEvent} from '../utils/common.js';
import {getRandomInteger} from '../utils/common.js';
import dayjs from 'dayjs';
import {nanoid} from 'nanoid';

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
      dateStart: dateStart.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
      dateEnd: dateStart.add(600, 'minute').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
    },
    price: 0,
    offers: offersMock.find((element) => element.type === eventType).offers,
    isFavorite: false,
  };
};

export default class NewPoint {
  constructor(pointListElement, changeData) {
    this._pointListElement = pointListElement;
    this._changeData = changeData;

    this._pointEditComponent = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleFormClose = this._handleFormClose.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._handleOnEscKeydown = this._handleOnEscKeydown.bind(this);
  }

  init () {
    if (this._pointEditComponent !== null) {
      return;
    }

    this._pointEditComponent = new NewEditPointView(OperationType.NEW, getBlankPoint());
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

    remove(this._pointEditComponent);
    this._pointEditComponent = null;

    document.removeEventListener('keydown', this._handleOnEscKeydown);
  }

  _handleFormSubmit(event) {
    this._changeData(
      UserAction.ADD_POINT,
      UpdateType.MAJOR,
      Object.assign({id: nanoid()}, event),
    );

    this._pointFormMode = EventFormMode.EDIT;
    this.destroy();
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
