import dayjs from 'dayjs';

const calculateDuration = (minutes) => {
  const days = Math.floor(minutes / (60*24));
  const hours = Math.floor(minutes % (60*24) / 60);
  const min = Math.floor(minutes % 60);
  const duration = days === 0 ? `${hours}H ${min}M` : `${days}D ${hours}H ${min}M`;
  return duration;
};

const calculateDurationFromStartToEnd = (start, end) => {
  const minutes = dayjs(end).diff(dayjs(start), 'minute');
  return calculateDuration(minutes);
};

const calculateDurationFromMilliseconds = (milliseconds) => {
  const minutes = milliseconds / (60 * 1000);
  return calculateDuration(minutes);
};

export {calculateDuration, calculateDurationFromStartToEnd, calculateDurationFromMilliseconds};
