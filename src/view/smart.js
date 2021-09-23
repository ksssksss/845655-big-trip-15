import AbstractView from './abstract.js';

class Smart extends AbstractView {
  constructor() {
    super();
    this._data = {};
  }

  // обновляет данные в свойстве _data и вызывает обновление шаблона
  updateData(update, justDataUpdating) {
    if (!update) {
      return;
    }

    this._data = Object.assign(
      {},
      this._data,
      update,
    );

    if (justDataUpdating) {
      // обновляется только состояние, без перерисовки
      return;
    }

    this.updateElement();
  }

  updateElement() {
    const prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();

    // при генерации нового элемента будет снова зачитано свойство _data.
    // И если мы сперва обновим его, а потом шаблон, то в итоге получим элемент с новыми данными
    const newElement = this.getElement();

    parent.replaceChild(newElement, prevElement);

    this.restoreHandlers();
  }

  restoreHandlers() {
    throw new Error('Abstract method not implemented: restoreHandlers');
  }
}
export {Smart as default};
