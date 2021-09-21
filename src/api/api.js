import PointsModel from '../model/points.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

const SuccessHTTPStatusRange = {
  MIN: 200,
  MAX: 299,
};

export default class Api {
  constructor(endPoint, autorization) {
    this._endPoint = endPoint;
    this._autorization = autorization;
  }

  getData() {
    return Promise.all([
      this._getServerEvents(),
      this._getServerDestinations(),
      this._getServerOffers(),
    ])
      .then((serverData) => {
        const [events, destinations, offers] = serverData;
        return {events, destinations, offers};
      });
  }

  addEvent(event) {
    return this._load({
      url: 'points',
      method: Method.POST,
      body: JSON.stringify(PointsModel.adaptToServer(event)),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(Api.toJSON)
      .then(PointsModel.adaptToClient);
  }

  deleteEvent(event) {
    return this._load({
      url: `points/${event.id}`,
      method: Method.DELETE,
    });
  }

  updateEvent(event) {
    return this._load({
      url: `points/${event.id}`,
      method: Method.PUT,
      body: JSON.stringify(PointsModel.adaptToServer(event)),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(Api.toJSON)
      .then(PointsModel.adaptToClient);
  }

  _getServerEvents() {
    return this._load({url: 'points'})
      .then(Api.toJSON)
      .then((events) => events.map(PointsModel.adaptToClient));
  }

  _getServerDestinations() {
    return this._load({url: 'destinations'})
      .then(Api.toJSON);
  }

  _getServerOffers() {
    return this._load({url: 'offers'})
      .then(Api.toJSON);
  }

  _load({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) {
    headers.append('Authorization', this._autorization);

    return fetch(
      `${this._endPoint}/${url}`,
      {method, body, headers},
    )
      .then(Api.checkStatus)
      .catch(Api.catchError);
  }

  static checkStatus(response) {
    if (
      response.status < SuccessHTTPStatusRange.MIN ||
      response.status > SuccessHTTPStatusRange.MAX
    ) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response;
  }

  static toJSON(response) {
    return response.json();
  }

  static catchError(err) {
    throw err;
  }
}
