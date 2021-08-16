import dayjs from 'dayjs';

const EVENTS_COUNT = 15;

const MAX_SENTENSE_COUNT = 5;
const MIN_PHOTOS_COUNT = 1;
const MAX_PHOTOS_COUNT = 5;

let currentId = 0;

const getRandomInteger = (minNumber, maxNumber) => {
  const a = Math.ceil(Math.min(Math.abs(minNumber), Math.abs(maxNumber)));
  const b = Math.floor(Math.max(Math.abs(minNumber), Math.abs(maxNumber)));
  return Math.floor(a + Math.random()*(b + 1 - a));
};

const getRandomType = () => {
  const EVENT_TYPES = [
    'Taxi',
    'Bus',
    'Train',
    'Ship',
    'Drive',
    'Flight',
    'Check-in',
    'Sightseeing',
    'Restaurant',
  ];

  return EVENT_TYPES[getRandomInteger(0, EVENT_TYPES.length-1)];
};

const getRandomCity = () => {
  const CITY = [
    'Chamonix',
    'Amsterdam',
    'Geneva',
    'Moscow',
    'Saint-Petersburg',
  ];

  return CITY[getRandomInteger(0, CITY.length-1)];
};

const generateDescription = () => {
  let description = '';
  const descriptions = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'Cras aliquet varius magna, non porta ligula feugiat eget.',
    'Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra.',
    'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
    'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
    'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
    'Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus.',
    'In rutrum ac purus sit amet tempus.',
  ];

  const sentenseNumber = getRandomInteger(0, MAX_SENTENSE_COUNT);

  for (let i = 0; i < sentenseNumber; i++) {
    description += descriptions[getRandomInteger(0, descriptions.length-1)];
  }
  return description;
};

const generateOffersList = (offerType) => {
  const offersFullList = {
    'Taxi': {
      type: 'Taxi',
      offers: [
        {
          name: 'Add lagguage',
          price: 30,
        },
        {
          name: 'Switch to comfort class',
          price: 100,
        },
        {
          name: 'Add meal',
          price: 15,
        },
        {
          name: 'Choose seats',
          price: 5,
        },
      ],
    },

    'Bus': {
      type: 'Bus',
      offers: [
        {
          name: 'Add lagguage',
          price: 30,
        },
        {
          name: 'Switch to comfort class',
          price: 100,
        },
        {
          name: 'Add meal',
          price: 15,
        },
        {
          name: 'Choose seats',
          price: 5,
        },
      ],
    },

    'Train': {
      type: 'Train',
      offers: [
        {
          name: 'Switch to comfort class',
          price: 100,
        },
        {
          name: 'Choose seats',
          price: 5,
        },
      ],
    },

    'Ship': {
      type: 'Ship',
      offers: [
        {
          name: 'Switch to comfort class',
          price: 100,
        },
      ],
    },

    'Drive': {
      type: 'Drive',
      offers: [],
    },

    'Flight': {
      type: 'Flight',
      offers: [

      ],
    },

    'Check-in': {
      type: 'Check-in',
      offers: [],
    },

    'Sightseeing': {
      type: 'Sightseeing',
      offers: [],
    },

    'Restaurant': {
      type: 'Restaurant',
      offers: [],
    },
  };

  const offersList = offersFullList[offerType].offers;

  return offersList;
};

const generatePictures = () => {
  const photos = [];
  const photosCount = getRandomInteger(MIN_PHOTOS_COUNT, MAX_PHOTOS_COUNT);
  for (let i = 0; i <photosCount; i++) {
    photos.push(`http://picsum.photos/248/152?r=${Math.random()}`);
  }
  return photos;
};

const generateDate = () => {
  const maxDaysGap = 7;
  const maxHoursGap = 12;
  const minutesGap = (getRandomInteger(0, -maxDaysGap) * 24 + getRandomInteger(0, -maxHoursGap)) * 60 + getRandomInteger(0, -60);
  return dayjs().add(minutesGap, 'minute');
};


const generateEventData = () => {
  const eventType = getRandomType();
  const dateStart = generateDate();
  const duration = getRandomInteger(10, 4320);

  return {
    id: ++currentId,
    eventType,
    destinationCity: getRandomCity(),
    dateTime: {
      dateStart: dateStart,
      dateEnd: dateStart.add(duration, 'minute'),
    },
    price: getRandomInteger(60, 900),
    offers: generateOffersList(eventType),
    description: generateDescription(),
    pictures: generatePictures(),
    isFavorite: Boolean(getRandomInteger(0, 1)),
  };
};

export const events = new Array(EVENTS_COUNT).fill().map(generateEventData);
