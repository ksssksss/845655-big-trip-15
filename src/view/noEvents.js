import AbstractView from './abstract.js';
import {FilterType} from '../utils/const.js';

const NoEventsText = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PAST]: 'There are no past events now',
};

const createNoEventsTemplate = (filterType) => (
  `<p class="trip-events__msg">${NoEventsText[filterType]}</p>`
);

export default class noEvents extends AbstractView {
  constructor(data) {
    super();
    this._data = data;
  }

  getTemplate() {
    return createNoEventsTemplate(this._data);
  }
}


