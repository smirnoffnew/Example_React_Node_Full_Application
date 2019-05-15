const config = require('../config/index');
const app = require('./express');
const log = require('./helpers/winston')
  .getLogger({ name: 'index' });
const http = require('http');
const mongo = require('./services/mongo');
const redis = require('./services/redis');
const firebase = require('./services/firebase');
const { scripts } = require('./helpers/utils/index');

// connect to MongoDB
mongo.connect(scripts.onStart);
// connect to Redis
redis.connect();
// connect to Firebase
firebase.connect();

const server = http.createServer(app);

process.on('SIGINT', disconnect);
process.on('SIGTERM', disconnect);
process.on('exit', disconnect);

function disconnect(exitCode) {
  log.error(`exit code ${exitCode}`);
  server.close();
  log.info('Server stopped');
  process.exit(exitCode);
}

// module.parent check is required to support mocha watch
// src: https://github.com/mochajs/mocha/issues/1912
if (!module.parent) {
  // listen on port config.port
  server.listen(config.port, () => {
    log.info(`server started on port ${config.port} (${config.env})`);
  });
}

module.exports = app;
