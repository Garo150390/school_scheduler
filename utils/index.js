const { addDays, format } = require('date-fns');

const query = require('./query');
const freeDays = ['Saturday', 'Sunday'];

const parseDateTo = (date) => {
  const d = date ? new Date(date) : new Date();
  return format(addDays(d, 1), 'yyyy-MM-dd');
};

const parseDateFrom = (date) => {
  const d = date ? new Date(date) : query.MIN_DATE;
  return format(d, 'yyyy-MM-dd');
};

const checkWeekday = (date) => {
  return !freeDays.includes(format(new Date(date), 'EEEE'));
};

module.exports = {
  query,
  parseDateTo,
  parseDateFrom,
  checkWeekday,
};
