const express = require('express');
const logger = require('morgan');
const config = require('../config');
const bodyParser = require('body-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const cors = require('cors');
const httpStatus = require('http-status');
const expressWinston = require('express-winston');
const helmet = require('helmet');
const winstonInstance = require('./helpers/winston').expressWinstonInstance;
const apiRoutes = require('./routes');
const APIError = require('./helpers/APIError');
const boolParser = require('express-query-boolean');
const auth = require('./helpers/passport/index');
const utils = require('./helpers/utils/index');
const favicon = require('serve-favicon');
const debug = require('debug')('app:express');
const log = require('./helpers/winston')
  .getLogger({ name: 'express' });

const app = express();
if (config.env !== 'test') {
  app.use(logger('dev'));
}

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(boolParser());

app.use(auth.init());
app.use(compress());
app.use(methodOverride());

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

// enable detailed API logging
if (config.log.express) {
  expressWinston.requestWhitelist.push('body');
  expressWinston.responseWhitelist.push('body');
  app.use(
    expressWinston.logger({
      meta: true,
      expressFormat: true,
      winstonInstance
    })
  );
}
app.use(favicon(config.resources.favicon));
app.use(express.static(config.pathToPublicDir));
app.use('/admin', express.static(`${config.pathToPublicDir}/admin`));

// app.get('/admin', (req, res) =>{
//   res.send()
// })

app.use('/api/v1', apiRoutes);
app.get('*', (req, res) => res.sendFile(config.resources.spa));

// if error is not an instanceOf APIError, convert it.
app.use((err, req, res, next) => {
  debug(err);
  if (!err.status || err.status >= 500) {
    log.error('%O', err);
  }
  next(utils.errorConverter.normalizeError(err));
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new APIError('API not found', httpStatus.NOT_FOUND);
  return next(err);
});

// error handler, send stacktrace only during development
app.use((
  err,
  req,
  res,
  next // eslint-disable-line no-unused-vars
) => res.status(err.status)
  .json({
    message: err.isPublic ? err.message : httpStatus[err.status],
    stack: config.env === 'development' ? err.stack : undefined
  }));
module.exports = app;
