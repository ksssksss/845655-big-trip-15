import dayjs from 'dayjs';

export const calculateDuration = (minutes) => {
  const days = Math.floor(minutes / (60*24));
  const hours = Math.floor(minutes % (60*24) / 60);
  const min = Math.floor(minutes % 60);
  const duration = days === 0 ? `${hours}H ${min}M` : `${days}D ${hours}H ${min}M`;
  return duration;
};

export const calculateDurationFromStartToEnd = (start, end) => {
  const minutes = dayjs(end).diff(dayjs(start), 'minute');
  return calculateDuration(minutes);
};

export const calculateDurationFromMiliSeconds = (miliseconds) => {
  const minutes = miliseconds / (60 * 1000);
  return calculateDuration(minutes);
};
