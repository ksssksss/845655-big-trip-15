export const calculateCost = (events) => {
  let cost = 0;
  events.forEach((element) => {
    cost += element.price + element.offers.reduce((sum, current) => sum + current.price, 0);
  });
  return cost;
};

export const createCostInfoTemplate = (cost) => (
  `<p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
  </p>`
);
