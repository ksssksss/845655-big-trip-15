export const isEscEvent = (evt) => {
  const keyEsc = evt.key === 'Escape' || evt.key === 'Esc';
  return keyEsc;
};
