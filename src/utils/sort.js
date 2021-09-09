import dayjs from 'dayjs';

export const sortByDateUp = (eventA, eventB) => dayjs(eventA.dateTime.dateStart).toDate().getTime() - dayjs(eventB.dateTime.dateStart).toDate().getTime();

export const sortByDurationDown = (eventA, eventB) => {
  const durationA = dayjs(eventA.dateTime.dateEnd).toDate().getTime() - dayjs(eventA.dateTime.dateStart).toDate().getTime();
  const durationB = dayjs(eventB.dateTime.dateEnd).toDate().getTime() - dayjs(eventB.dateTime.dateStart).toDate().getTime();
  return durationB - durationA;
};

export const sortByPriceDown = (eventA, eventB) => eventB.price - eventA.price;
