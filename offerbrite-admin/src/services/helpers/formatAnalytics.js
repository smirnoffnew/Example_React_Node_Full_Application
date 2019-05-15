import moment from 'moment';

import { analyticsGetUserStats } from 'services/api';
import {
  timeSelectors,
  parsers,
  TIME_PERIODS,
  findTimesForComparison,
  makeTimeFromSeconds,
} from 'services/helpers';

const { WEEK_AGO, MONTH_AGO, YEAR_AGO, BEGGINING } = timeSelectors;
const { byDay, byWeekDay, byDate, byMonth, byYear } = parsers;

const makeInitialDates = (startDate, limit, dateKey, parser) => {
  let currentDate = startDate;
  const initialDates = [];
  for (let i = 0; i < limit; i++) {
    initialDates.push({
      date: parser(currentDate),
      count: 0,
    });
    currentDate = moment(currentDate).add(1, dateKey);
  }

  return initialDates;
};

const formatData = (initialDates, data, parser) => initialDates.map(date => {
  let dateData = date;
  data.forEach(dateStat => {
    const { dimensions, metrics } = dateStat;
    const parsedDate = parser(dimensions[0]);
    if (date.date === parsedDate) {
      dateData.count += Number(metrics[0].values[0]);
    }      
  });
  return dateData;
});

const formatByToday = data => [{
  date: byDay(data[0].dimensions[0]),
  count: data[0].metrics[0].values[0],
}];

const formatByLastWeek = data => {
  const initialDays = makeInitialDates(WEEK_AGO, 7, 'd', byWeekDay);
  return formatData(initialDays, data, byWeekDay);
};

const formatByLastMonth = data => {
  const initialDays = makeInitialDates(MONTH_AGO, 30, 'd', byDate);
  return formatData(initialDays, data, byDate);
};

const formatByLastYear = data => {
  const initialMonths = makeInitialDates(YEAR_AGO, 12, 'M', byMonth);
  return formatData(initialMonths, data, byMonth);
};

const formatByAllTime = data => {
  const initialYears = makeInitialDates(BEGGINING, 1, 'Y', byYear);
  return formatData(initialYears, data, byYear);
};

export const formatDataByTime = (data, period) => {
  switch (period) {
    case TIME_PERIODS[0]:
      return formatByToday(data);
    case TIME_PERIODS[1]:
      return formatByLastWeek(data);
    case TIME_PERIODS[2]:
      return formatByLastMonth(data);
    case TIME_PERIODS[3]:
      return formatByLastYear(data);
    default:
      return formatByAllTime(data);
  }
};

export const formatDataByDevice = data => {
  const hundredPercent = data.reduce((prev, cur) => prev + Number(cur.metrics[0].values[0]), 0);
  return data.map(session => ({
    device: session.dimensions[0],
    count: session.metrics[0].values[0],
    percent: `${Math.floor(Number(session.metrics[0].values[0]) / hundredPercent * 100)}%`,
  }))
};

export const formatUserStats = data => {  
  const { values } = data[0].metrics[0];
  const seconds = Math.floor(parseInt(values[3]) / Number(values[1]));
  const sessionDuration = makeTimeFromSeconds(seconds);

  return {
    Users: Number(values[0]),
    Sessions: Number(values[1]),
    'New users': Number(values[2]),
    sessionInSeconds: seconds,
    'Session duration': sessionDuration,
  };
};

export const formatUserAppScreenData = data => data.map(screen => {
  const [ views, uniqViews, avgDuration, exitPercent ] = screen.metrics[0].values;
  return {
    name: screen.dimensions[0],
    views,
    uniqViews,
    avgDuration: makeTimeFromSeconds(parseInt(avgDuration)),
    exitPercent: `${Number(exitPercent).toFixed(1)}%`,
  };
});
