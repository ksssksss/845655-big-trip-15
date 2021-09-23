const Mode = {
  DEFAULT: 'default',
  EDITTING: 'edditing',
};

const OperationType = {
  NEW: 'new',
  EDIT: 'edit',
};

const EventFormMode = {
  EDIT: 'Delete',
  ADD: 'Cancel',
};

const SortType = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price',
};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

// типо изменений (для того, чтобы понять, что обновлять далее)
const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

const FilterType = {
  EVERYTHING: 'EVERYTHING',
  FUTURE: 'FUTURE',
  PAST: 'PAST',
};

const EventType = {
  TAXI: 'taxi',
  BUS: 'bus',
  TRAIN: 'train',
  SHIP: 'ship',
  DRIVE: 'drive',
  FLIGHT: 'flight',
  CHECKIN: 'check-in',
  SIGHTSEEING: 'sightseeing',
  RESTAURANT: 'restaurant',
};

const TransportType = {
  TAXI: 'taxi',
  BUS: 'bus',
  TRAIN: 'train',
  SHIP: 'ship',
  DRIVE: 'drive',
  FLIGHT: 'flight',
};

const MenuItem = {
  EVENTS: 'EVENTS',
  STATISTICS: 'STATISTICS',
};

export {Mode, OperationType, EventFormMode, SortType, UserAction, UpdateType, FilterType, EventType, TransportType, MenuItem};
