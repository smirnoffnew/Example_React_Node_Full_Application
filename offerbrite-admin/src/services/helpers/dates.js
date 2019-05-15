import moment from 'moment';

export const DATE_FORMAT = 'YYYY-MM-DD';

export const TIME_CONSTANTS = {
  MONTH: 2592000000,
};

export const TIME_PERIODS = [
  'Today',
  'Last 7 days',
  'Last 30 days',
  'Last year',
  'All time',
];

export const timeSelectors = {
  TODAY: moment().format(DATE_FORMAT),
  YESTERDAY: moment().subtract(1, 'd').format(DATE_FORMAT),
  WEEK_AGO: moment().subtract(7, 'd').format(DATE_FORMAT),
  MONTH_AGO: moment().subtract(30, 'd').format(DATE_FORMAT),
  YEAR_AGO: moment().subtract(1, 'Y').format(DATE_FORMAT),
  BEGGINING: moment('2018-01-01').format(DATE_FORMAT),
};

export const parsers = {
  byDay: dateString => moment(dateString).format('dddd, MMMM Do YYYY'),
  byWeekDay: dateString => moment(dateString).format('ddd MM/DD'),
  byDate: dateString => moment(dateString).format('MM/DD'),
  byMonth: dateString => moment(dateString).format('MMM YYYY'),
  byYear: dateString => moment(dateString).format('YYYY'),
};

export const findTimes = timePeriod => {
  const { TODAY, WEEK_AGO, YESTERDAY, MONTH_AGO, YEAR_AGO, BEGGINING } = timeSelectors;
  switch (timePeriod) {
    case TIME_PERIODS[0]:
      return {
        startDate: TODAY,
        endDate: TODAY,
      };
    case TIME_PERIODS[1]:
      return {
        startDate: WEEK_AGO,
        endDate: YESTERDAY,
      };
    case TIME_PERIODS[2]:
      return {
        startDate: MONTH_AGO,
        endDate: YESTERDAY,
      };
    case TIME_PERIODS[3]:
      return {
        startDate: YEAR_AGO,
        endDate: YESTERDAY,
      };
    default:
      return {
        startDate: BEGGINING,
        endDate: TODAY,
      };
  }
};

export const findTimesForComparison = requestedTime => {
  const { WEEK_AGO, YESTERDAY, MONTH_AGO, YEAR_AGO, BEGGINING } = timeSelectors;
  switch (requestedTime) {
    case TIME_PERIODS[0]:
      return {
        startDate: YESTERDAY,
        endDate: YESTERDAY,
      };
    case TIME_PERIODS[1]:
      return {
        startDate: moment(WEEK_AGO).subtract(7, 'd').format(DATE_FORMAT),
        endDate: WEEK_AGO,
      };
    case TIME_PERIODS[2]:
      return {
        startDate: moment(MONTH_AGO).subtract(30, 'd').format(DATE_FORMAT),
        endDate: MONTH_AGO,
      };
    case TIME_PERIODS[3]:
      return {
        startDate: moment(YEAR_AGO).subtract(12, 'M').format(DATE_FORMAT),
        endDate: YEAR_AGO,
      };
    default:
      return {
        startDate: BEGGINING,
        endDate: YESTERDAY,
      };
  }
};

export const makeTimeFromSeconds = seconds => {
  const time = {
    hours: `${Math.floor(moment.duration(seconds,'seconds').asHours())}`,
    minutes: `${moment.duration(seconds,'seconds').minutes()}`,
    seconds: `${moment.duration(seconds,'seconds').seconds()}`,
  };
  return Object.values(time)
    .map(timePart => {
      if (timePart.length === 1) {
        return `0${timePart}`;
      }
      return timePart;
    })
    .join(':');
};

export const getDateFromString = dateString => (
  `${dateString.getFullYear()}-${dateString.getMonth() + 1}-${dateString.getDate()}`
);

export const getTimeFromString = dateString => (
  // const utcOffsetInHours = new Date().getTimezoneOffset() / 60;
  `${dateString.getHours() + getUtcOffset()}:${dateString.getMinutes()}`
);

export const getUtcOffset = () => new Date().getTimezoneOffset() / 60;
