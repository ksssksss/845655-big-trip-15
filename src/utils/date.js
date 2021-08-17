import dayjs from 'dayjs';

export const calculateDuration = (start, end) => {
  const minutes = dayjs(end).diff(dayjs(start), 'minute');
  const days = Math.floor(minutes / (60*24));
  const hours = Math.floor(minutes % (60*24) / 60);
  const min = Math.floor(minutes % 60);
  const duration = days === 0 ? `${hours}H ${min}M` : `${days}D ${hours}H ${min}M`;
  return duration;
};
