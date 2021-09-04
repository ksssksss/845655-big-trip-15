export const isEscEvent = (evt) => {
  const keyEsc = evt.key === 'Escape' || evt.key === 'Esc';
  return keyEsc;
};

export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

export const getRandomInteger = (minNumber, maxNumber) => {
  const a = Math.ceil(Math.min(Math.abs(minNumber), Math.abs(maxNumber)));
  const b = Math.floor(Math.max(Math.abs(minNumber), Math.abs(maxNumber)));
  return Math.floor(a + Math.random()*(b + 1 - a));
};
