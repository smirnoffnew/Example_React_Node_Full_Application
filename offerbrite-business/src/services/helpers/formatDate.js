import moment from 'moment';

export const DATE_FORMAT = 'YYYY-MM-DD HH:mm';

export default function formatDate(date) {
  const month = `${date.getMonth() + 1}`.length === 1
    ? `0${date.getMonth() + 1}`
    : date.getMonth() + 1;
  const dayOfMonth = `${date.getDate()}`.length === 1
    ? `0${date.getDate()}` :
    date.getDate();

  return `${date.getFullYear()}-${month}-${dayOfMonth}`;
}

/**
 * Calculates difference between to dates
 * @param {string} start - Start date in Date ISO string format
 * @param {string} end - End date in Date ISO string format
 * @returns {string}
 */
export function findDuration(end) {
  const now = moment();
  const endDate = moment(end);

  const days = endDate.diff(now, 'days');
  const hours = endDate.diff(now, 'hours') - days * 24;
  const minutes = endDate.diff(now, 'minutes') - days * 24 * 60 - hours * 60;

  return `${days > 0 ? `${days} days and ` : ''}${addZero(hours)}:${addZero(minutes)}`;
}

/**
 * Formats hours / minutes string by adding zero character if needed.
 * @param {number} time - Amount of hours / minutes
 * @returns {string}
 */
function addZero(time) {
  return String(time).length > 1 ? time : `0${time}`;
}
