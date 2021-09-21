import PointView from '../view/point.js';
import NewEditPointView from '../view/point-edit';
import {OperationType} from '../utils/const.js';
import {UserAction, UpdateType, Mode} from '../utils/const.js';
import {isEscEvent} from '../utils/common.js';
import {render, replace, remove, RenderPosition} from '../utils/render.js';

export const State = {
  SAVING: 'SAVING',
  DELETING: 'DELETING',
  ABORTING: 'ABORTING',
};

export default class Point {
  constructor(pointListElement, changeData, changeMode, destinationsServer, offersServer) {
    this._pointListElement = pointListElement; // container
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._destinationsServer = destinationsServer;
    this._offersServer = offersServer;

    this._mode = Mode.DEFAULT;

    this._pointComponent = null;
    this._pointEditComponent = null;

    this._handleOnEscKeydown = this._handleOnEscKeydown.bind(this);
    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleFormClose = this._handleFormClose.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
  }

  init(event) {
    this._event = event;

    // Добавим возможность повторно инициализировать презентер задачи:
    // для этого будем запоминать предыдущие компоненты.
    const prevPointComponent = this._pointComponent;
    const prevPointEditComponent = this._pointEditComponent;

    this._pointComponent = new PointView(this._event);
    this._pointEditComponent = new NewEditPointView(OperationType.EDIT, this._event, this._destinationsServer, this._offersServer);

    this._pointEditComponent.setPointFormSubmitHandler(this._handleFormSubmit);
    this._pointEditComponent.setRollupBtnClickHandler(this._handleFormClose);
    this._pointEditComponent.setDeleteClickHandler(this._handleDeleteClick);
    this._pointComponent.setEditBtnClickHandler(this._handleEditClick);
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
      replace(this._pointComponent, prevPointEditComponent);
      this._mode = Mode.DEFAULT;
    }


    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  destroy() {
    remove(this._pointComponent);
    remove(this._pointEditComponent);
  }

  // Сброс point в состояние по умолчанию
  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToCard();
      document.removeEventListener('keydown', this._handleOnEscKeydown);
    }
  }

  setViewState(state) {
    if (this._mode === Mode.DEFAULT) {
      return;
    }

    const resetFormState = () => {
      this._pointEditComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    switch(state) {
      case State.SAVING:
        this._pointEditComponent.updateData({
          isDisabled: true,
          isSaving: true,
        });
        break;
      case State.DELETING:
        this._pointEditComponent.updateData({
          isDisabled: true,
          isDeleting: true,
        });
        break;
      case State.ABORTING:
        this._pointComponent.shake(resetFormState);
        this._pointEditComponent.shake(resetFormState);
        break;
    }
  }

  _replaceCardToFrom() {
    this._changeMode(); // используем resetView() через TripPresenter в _changeMode (=_handleModeChange())
    this._mode = Mode.EDITTING;
    replace(this._pointEditComponent, this._pointComponent);
  }

  _replaceFormToCard() {
    this._mode = Mode.DEFAULT;
    replace(this._pointComponent, this._pointEditComponent);
  }

  _handleOnEscKeydown(evt) {
    if (isEscEvent(evt)){
      this._pointEditComponent.reset(this._event);
      this._replaceFormToCard();
      document.removeEventListener('keydown', this._handleOnEscKeydown);
    }
  }

  _handleEditClick() {
    this._replaceCardToFrom();
    document.addEventListener('keydown', this._handleOnEscKeydown);
  }

  _handleFormSubmit(event) {
    this._changeData(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      event,
    );

    document.removeEventListener('keydown', this._handleOnEscKeydown);
  }

  _handleFormClose() {
    this._pointEditComponent.reset(this._event);
    this._replaceFormToCard();
    document.removeEventListener('keydown', this._handleOnEscKeydown);
  }

  _handleFavoriteClick() {
    this._changeData(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      Object.assign(
        {},
        this._event,
        {
          isFavorite: !this._event.isFavorite,
        },
      ),
    );
  }

  _handleDeleteClick(event) {
    this._changeData(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      event,
    );
  }
}
