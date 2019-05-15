const redis = require('redis');
const bluebird = require('bluebird');
const config = require('../../config');
const log = require('../helpers/winston')
  .getLogger({ name: 'redis' });

const pRedis = bluebird.promisifyAll(redis);
let client = null;

function connect() {
  if (!client) {
    client = pRedis.createClient({
      url: config.redis.url,
      password: config.redis.password
    });
    client.on('error', (err) => {
      log.error(err);
      throw err;
    });
    client.on('connect', async () => {
      if (!config.isProduction) {
        log.info('FLUSH db');
        await client.flushallAsync();
      }
      log.info(`successfully connected to redis on ${config.redis.url}`);
    });
  }
}

function getClient() {
  if (!client) {
    connect();
  }
  return client;
}

module.exports = {
  getClient,
  connect
};
