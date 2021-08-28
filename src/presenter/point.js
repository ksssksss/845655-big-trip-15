import PointView from '../view/point.js';
import NewEditPointView from '../view/point-edit';
import {OperationType} from '../view/point-edit';
import {isEscEvent} from '../utils/common.js';
import {render, replace, remove, RenderPosition} from '../utils/render.js';

const Mode = {
  DEFAULT: 'default',
  EDITTING: 'edditing',
};

export default class Point {
  constructor(pointListElement, changeData, changeMode) {
    this._pointListElement = pointListElement; // container
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._mode = Mode.DEFAULT;

    this._pointComponent = null;
    this._pointEditComponent = null;

    this._handeleOnEscKeydown = this._handeleOnEscKeydown.bind(this);
    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handeleFormClose = this._handeleFormClose.bind(this);
  }

  init(event) {
    this._event = event;

    // Добавим возможность повторно инициализировать презентер задачи:
    // для этого будем запоминать предыдущие компоненты.
    const prevPointComponent = this._pointComponent;
    const prevPointEditComponent = this._pointEditComponent;

    this._pointComponent = new PointView(this._event);
    this._pointEditComponent = new NewEditPointView(OperationType.EDIT, this._event);

    this._pointEditComponent.setOnPointFormSubmit(this._handleFormSubmit);
    this._pointEditComponent.setOnRollupBtnClick(this._handeleFormClose);
    this._pointComponent.setOnEditBtnClick(this._handleEditClick);
    this._pointComponent.setFavoriteClickHandler(this._handleFavoriteClick);


    // Если компоненты null, то есть не создавались, рендерим как раньше.
    // Если они отличны от null, то есть создавались, то заменяем их новыми и удаляем.
    if (prevPointComponent === null || prevPointEditComponent === null) {
      return render(this._pointListElement, this._pointComponent, RenderPosition.BEFOREEND);
    }

    // Проверка на наличие в DOM необходима,
    // чтобы не пытаться заменить то, что не было отрисовано
    if (this._mode === Mode.DEFAULT) {
      replace(this._pointComponent, prevPointComponent);
    }

    if (this._mode === Mode.EDITTING) {
      replace(this._pointEditComponent, prevPointEditComponent);
    }


    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  destroy() {
    remove(this._pointComponent);
    remove(this._pointEditComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToCard();
    }
  }

  _replaceCardToFrom() {
    replace(this._pointEditComponent, this._pointComponent);
    this._changeMode(); // используем resetView() через TripPresenter в _changeMode (=_handleModeChange())
    this._mode = Mode.EDITTING;
  }

  _replaceFormToCard() {
    replace(this._pointComponent, this._pointEditComponent);
    this._mode = Mode.DEFAULT;
  }

  _handeleOnEscKeydown(evt) {
    if (isEscEvent(evt)){
      this._replaceFormToCard();
      document.removeEventListener('keydown', this._handeleOnEscKeydown);
    }
  }

  _handleEditClick() {
    this._replaceCardToFrom();
    document.addEventListener('keydown', this._handeleOnEscKeydown);
  }

  _handleFormSubmit(task) {
    this._changeData(task);
    this._replaceFormToCard();
    document.removeEventListener('keydown', this._handeleOnEscKeydown);
  }

  _handeleFormClose() {
    this._replaceFormToCard();
    document.removeEventListener('keydown', this._handeleOnEscKeydown);
  }

  _handleFavoriteClick() {
    this._changeData(
      Object.assign(
        {},
        this._event,
        {
          isFavorite: !this._event.isFavorite,
        },
      ),
    );
  }
}
