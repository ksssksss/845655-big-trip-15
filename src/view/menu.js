import AbstractView from './abstract.js';
import {MenuItem} from '../utils/const';

const createMenuTemplate = () => (
  `<nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn  trip-tabs__btn--active" href="#" data-menu-item="${MenuItem.EVENTS}">Table</a>
      <a class="trip-tabs__btn" href="#" data-menu-item="${MenuItem.STATISTICS}">Stats</a>
  </nav>`
);

class Menu extends AbstractView {
  constructor () {
    super();

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createMenuTemplate();
  }

  setMenuItem(menuItem) {
    const activeItemElement = this.getElement().querySelector('.trip-tabs__btn--active');
    const checkedItemElement = this.getElement().querySelector(`[data-menu-item="${menuItem}"]`);

    activeItemElement.classList.remove('trip-tabs__btn--active');
    checkedItemElement.classList.add('trip-tabs__btn--active');
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener('click', this._menuClickHandler);
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    this._callback.menuClick(evt.target.dataset.menuItem);
  }
}

export {Menu as default};
