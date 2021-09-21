import Abstract from './abstract';

const createLoadingStatusTemplate = () => (
  `<p class="trip-events__msg">
    Loading...
  </p>`
);

export default class Loading extends Abstract {
  getTemplate() {
    return createLoadingStatusTemplate();
  }
}
