import AbstractView from './abstract.js';
import dayjs from 'dayjs';

const createTripDatesTemplate = (startDate, endDate) => {
  const startDateFormat = 'MMM DD';
  const endDateFormat = dayjs(startDate).month() === dayjs(endDate).month()
    ? 'DD'
    : 'MMM DD';

  return `<p class="trip-info__dates">${startDate.format(startDateFormat)}&nbsp;&mdash;&nbsp;${endDate.format(endDateFormat)}</p>`;
};

const createRouteTemplate = (events) => {
  const cities = events.map((event) => event.destinationCity);
  if (cities.length > 3) {
    return `<h1 class="trip-info__title">${cities[0]} &mdash; ... &mdash; ${cities[cities.length-1]}</h1>`;
  } else {
    return `<h1 class="trip-info__title">${cities.map((city) => city).join(' &mdash; ')}</h1>`;
  }
};

const createTripInfoTemplate = (sortedEvents) => (
  `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      ${createRouteTemplate(sortedEvents)}

      ${createTripDatesTemplate(sortedEvents[0].dateTime.dateStart, sortedEvents[sortedEvents.length-1].dateTime.dateEnd)}
    </div>
  </section>`
);

export default class TripInfo extends AbstractView {
  constructor (events) {
    super();
    this._events = events;
  }

  getTemplate() {
    return createTripInfoTemplate(this._events);
  }
}
