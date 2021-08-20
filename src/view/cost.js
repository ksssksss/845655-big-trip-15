import {createElement} from '../utils/render.js';

const calculateCost = (events) => {
  let cost = 0;
  events.forEach((element) => {
    cost += element.price + element.offers.reduce((sum, current) => sum + current.price, 0);
  });
  return cost;
};

const createCostInfoTemplate = (cost) => (
  `<p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
  </p>`
);

export default class Cost {
  constructor(events) {
    this._events = events;
    this._cost = calculateCost(this._events);
    this._element = null;
  }

  getTemplate() {
    return createCostInfoTemplate(this._cost);
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
