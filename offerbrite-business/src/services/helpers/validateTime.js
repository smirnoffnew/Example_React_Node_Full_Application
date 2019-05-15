import moment from 'moment';
import { DATE_FORMAT } from '@/services/helpers/formatDate';

export default function updateTime(nextTime) {
  let updatedStartDate, updatedEndDate;
  const now = moment();
  const nextStartDate = moment(nextTime.startDate, DATE_FORMAT);
  const nextEndDate = moment(nextTime.endDate, DATE_FORMAT);

  if (nextStartDate.isBefore(now)) {
    updatedStartDate = now;
  } else {
    updatedStartDate = nextStartDate;
  }

  const nextStartDatePlusHour = moment(updatedStartDate).add(1, 'hours');
  if (nextEndDate.isBefore(nextStartDatePlusHour)) {
    updatedEndDate = nextStartDatePlusHour;
  } else {
    updatedEndDate = nextEndDate;
  }

  return {
    startDate: updatedStartDate.format(),
    endDate: updatedEndDate.format(),
  };
}
