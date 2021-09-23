import AbstractView from './abstract.js';

const calculateCost = (events) => {
  let cost = 0;
  events.forEach((element) => {
    const checkedOffers = element.offers.filter((offer) => offer.isChecked);
    cost += element.price + checkedOffers.reduce((sum, current) => sum + current.price, 0);
  });
  return cost;
};

const createCostInfoTemplate = (cost) => (
  `<p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
  </p>`
);

class Cost extends AbstractView {
  constructor(events) {
    super();
    this._events = events;
    this._cost = calculateCost(this._events);
  }

  getTemplate() {
    return createCostInfoTemplate(this._cost);
  }
}

export {Cost as default};
