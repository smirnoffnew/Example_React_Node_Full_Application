const mongoose = require('mongoose');
const util = require('util');
const config = require('../../config');
const log = require('../helpers/winston')
  .getLogger({ name: 'mongo' });
const debug = require('debug')('app:mongo');


mongoose.Promise = Promise;
// print mongoose logs in dev env
if (config.mongo.debug) {
  mongoose.set('debug', (collectionName, method, query, doc) => {
    debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
  });
}
const onMongoConnectionError = (err) => {
  log.error(err);
  throw new Error(`Unable to connect to database ${err.message}`);
};
// connect to mongo db
const connect = (onConnect) => {
  const opts = {
    useNewUrlParser: true
  };
  mongoose.connect(
    config.mongo.host,
    opts
  )
    .then(() => {
      log.info('connected to database');
      if (!config.isProduction) {
        // log.info('DB dropped');
        // return mongoose.connection.db.dropDatabase();
      }
    })
    .then(() => {
      if (onConnect) {
        onConnect();
      }
    })
    .catch(onMongoConnectionError);
};

module.exports = {
  connect
};
