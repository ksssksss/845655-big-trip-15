import AbstractView from './abstract.js';
import dayjs from 'dayjs';

const MAX_CITY_NUMBER = 3;

const createTripDatesTemplate = (startDate, endDate) => {
  const startDateFormat = 'MMM DD';
  const endDateFormat = dayjs(startDate).month() === dayjs(endDate).month()
    ? 'DD'
    : 'MMM DD';

  return `<p class="trip-info__dates">${dayjs(startDate).format(startDateFormat)}&nbsp;&mdash;&nbsp;${dayjs(endDate).format(endDateFormat)}</p>`;
};

const createRouteTemplate = (events) => {
  const cities = events.map((event) => event.destination.name);
  if (cities.length > MAX_CITY_NUMBER) {
    return `<h1 class="trip-info__title">${cities[0]} &mdash; ... &mdash; ${cities[cities.length-1]}</h1>`;
  }
  return `<h1 class="trip-info__title">${cities.map((city) => city).join(' &mdash; ')}</h1>`;
};

const createTripInfoTemplate = (sortedEvents) => (
  `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      ${createRouteTemplate(sortedEvents)}

      ${createTripDatesTemplate(sortedEvents[0].dateTime.dateStart, sortedEvents[sortedEvents.length-1].dateTime.dateEnd)}
    </div>
  </section>`
);

class TripInfo extends AbstractView {
  constructor (events) {
    super();
    this._events = events;
  }

  getTemplate() {
    return createTripInfoTemplate(this._events);
  }
}

export {TripInfo as default};
