import AbstractView from './abstract.js';

/* Значение отображаемого текста зависит от выбранного фильтра:
      * Everthing – 'Click New Event to create your first point'
      * Past — 'There are no past events now';
      * Future — 'There are no future events now'.
*/
const createNoEventsTemplate = () => (
  '<p class="trip-events__msg">Click New Event to create your first point</p>'
);

export default class noEvents extends AbstractView {
  getTemplate() {
    return createNoEventsTemplate();
  }
}


