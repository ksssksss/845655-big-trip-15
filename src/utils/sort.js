import dayjs from 'dayjs';

const sortByDateUp = (eventA, eventB) => dayjs(eventA.dateTime.dateStart).toDate().getTime() - dayjs(eventB.dateTime.dateStart).toDate().getTime();

const sortByDurationDown = (eventA, eventB) => {
  const durationA = dayjs(eventA.dateTime.dateEnd).toDate().getTime() - dayjs(eventA.dateTime.dateStart).toDate().getTime();
  const durationB = dayjs(eventB.dateTime.dateEnd).toDate().getTime() - dayjs(eventB.dateTime.dateStart).toDate().getTime();
  return durationB - durationA;
};

const sortByPriceDown = (eventA, eventB) => eventB.price - eventA.price;
const sortByMoneyDown = (a, b) => b.money - a.money;
const sortByTimeDown = (a, b) => b.timeSpend - a.timeSpend;
const sortByAmountDown = (a, b) => b.amount - a.amount;

export {sortByDateUp, sortByDurationDown, sortByPriceDown, sortByMoneyDown, sortByTimeDown, sortByAmountDown};

