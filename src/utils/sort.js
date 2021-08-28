export const sortByDateUp = (eventA, eventB) => eventA.dateTime.dateStart.toDate().getTime() - eventB.dateTime.dateStart.toDate().getTime();

export const sortByDurationDown = (eventA, eventB) => {
  const durationA = eventA.dateTime.dateEnd.toDate().getTime() - eventA.dateTime.dateStart.toDate().getTime();
  const durationB = eventB.dateTime.dateEnd.toDate().getTime() - eventB.dateTime.dateStart.toDate().getTime();
  return durationB - durationA;
};

export const sortByPriceDown = (eventA, eventB) => eventB.price - eventA.price;
