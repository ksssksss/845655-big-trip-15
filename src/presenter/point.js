import PointView from '../view/point.js';
import NewEditPointView from '../view/new-edit-point';
import {OperationType} from '../utils/const.js';
import {UserAction, UpdateType, Mode} from '../utils/const.js';
import {isEscEvent} from '../utils/common.js';
import {render, replace, remove, RenderPosition} from '../utils/render.js';

const State = {
  SAVING: 'SAVING',
  DELETING: 'DELETING',
  ABORTING: 'ABORTING',
};

class Point {
  constructor(pointListElement, changeData, changeMode, serverDestinations, serverOffers) {
    this._pointListElement = pointListElement; // container
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._serverDestinations = serverDestinations;
    this._serverOffers = serverOffers;

    this._mode = Mode.DEFAULT;

    this._pointComponent = null;
    this._pointEditComponent = null;

    this._escKeydownHandler = this._escKeydownHandler.bind(this);
    this._editClickHandler = this._editClickHandler.bind(this);
    this._formSubmitClickHandler = this._formSubmitClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._formCloseClickHandler = this._formCloseClickHandler.bind(this);
    this._deleteClickHandler = this._deleteClickHandler.bind(this);
  }

  init(event) {
    this._event = event;

    // Добавим возможность повторно инициализировать презентер задачи:
    // для этого будем запоминать предыдущие компоненты.
    const prevPointComponent = this._pointComponent;
    const prevPointEditComponent = this._pointEditComponent;

    this._pointComponent = new PointView(this._event);
    this._pointEditComponent = new NewEditPointView(OperationType.EDIT, this._event, this._serverDestinations, this._serverOffers);

    this._pointEditComponent.setPointFormSubmitHandler(this._formSubmitClickHandler);
    this._pointEditComponent.setRollupBtnClickHandler(this._formCloseClickHandler);
    this._pointEditComponent.setDeleteClickHandler(this._deleteClickHandler);
    this._pointComponent.setEditBtnClickHandler(this._editClickHandler);
    this._pointComponent.setFavoriteClickHandler(this._favoriteClickHandler);


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
      document.removeEventListener('keydown', this._escKeydownHandler);
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
      case State.SAVING: {
        this._pointEditComponent.updateData({
          isDisabled: true,
          isSaving: true,
        });
        break;
      }
      case State.DELETING: {
        this._pointEditComponent.updateData({
          isDisabled: true,
          isDeleting: true,
        });
        break;
      }
      case State.ABORTING: {
        this._pointComponent.shake(resetFormState);
        this._pointEditComponent.shake(resetFormState);
        break;
      }
    }
  }

  _replaceCardToFrom() {
    this._changeMode(); // используем resetView() через TripPresenter в _changeMode (=_modeChangeHandler())
    this._mode = Mode.EDITTING;
    replace(this._pointEditComponent, this._pointComponent);
  }

  _replaceFormToCard() {
    this._mode = Mode.DEFAULT;
    replace(this._pointComponent, this._pointEditComponent);
  }

  _escKeydownHandler(evt) {
    if (isEscEvent(evt)){
      this._pointEditComponent.reset(this._event);
      this._replaceFormToCard();
      document.removeEventListener('keydown', this._escKeydownHandler);
    }
  }

  _editClickHandler() {
    this._replaceCardToFrom();
    document.addEventListener('keydown', this._escKeydownHandler);
  }

  _formSubmitClickHandler(event) {
    this._changeData(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      event,
    );

    document.removeEventListener('keydown', this._escKeydownHandler);
  }

  _formCloseClickHandler() {
    this._pointEditComponent.reset(this._event);
    this._replaceFormToCard();
    document.removeEventListener('keydown', this._escKeydownHandler);
  }

  _favoriteClickHandler() {
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

  _deleteClickHandler(event) {
    this._changeData(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      event,
    );
  }
}

export {Point as default, State};
