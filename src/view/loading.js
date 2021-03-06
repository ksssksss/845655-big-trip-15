import Abstract from './abstract';

const createLoadingStatusTemplate = () => (
  `<p class="trip-events__msg">
    Loading...
  </p>`
);

class Loading extends Abstract {
  getTemplate() {
    return createLoadingStatusTemplate();
  }
}

export {Loading as default};
