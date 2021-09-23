import AbstractView from './abstract.js';

const createPointsListTemplate = () => (
  `<ul class="trip-events__list">
  </ul>`
);

class PointsList extends AbstractView {
  getTemplate() {
    return createPointsListTemplate();
  }
}

export {PointsList as default};
