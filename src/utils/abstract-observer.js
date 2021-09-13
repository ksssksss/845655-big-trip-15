export default class AbstractObserver {
  constructor() {
    this._observers = new Set();
  }


  // observer - callback
  addObserver(observer) {
    this._observers.add(observer);
  }

  removeObserver(observer) {
    this._observers.delete(observer);
  }

  // event - типо обновления; payload - данные
  _notify(event, payload) {
    this._observers.forEach((observer) => observer(event, payload));
  }
}
