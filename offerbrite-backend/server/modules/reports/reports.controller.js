const utils = require('../reports/scripts');

const getReports = (req, res, next) => utils.getReports(req)
  .then(data => (
    data
    ? res.json({ status: 'OK', data })
    : res.json({ status: 'ERROR', message: 'you have incorect role' })
  ))
  .catch(next);

const createdReports = (req, res, next) => utils.createdReports(req)
  .then(data => (
  data
    ? res.json({ status: 'OK', message: 'report created' })
    : res.json({ status: 'ERROR', message: 'you have incorect role' })
  ))
  .catch(next);

module.exports = {
  createdReports,
  getReports
};
