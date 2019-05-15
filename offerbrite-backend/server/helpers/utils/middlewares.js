const httpStatus = require('http-status');

exports.ok = (req, res) => res.status(httpStatus.OK)
  .send();
