import {createElement} from '../utils/render.js';

const createPointsListTemplate = () => (
  `<ul class="trip-events__list">
  </ul>`
);

export default class PointsList {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createPointsListTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
