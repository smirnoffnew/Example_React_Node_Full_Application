const Firebase = require('../helpers/firebase');
const config = require('../../config');
const log = require('../helpers/winston')
  .getLogger({ name: 'firebase' });
const fse = require('fs-extra');

let firebaseApp = null;

const connect = () => {
  if (firebaseApp) return;
  try {
    firebaseApp = new Firebase({
      serviceAccount: fse.readJSONSync(config.firebase.pathToServiceAccount),
      name: config.firebase.name,
      bucketName: `${config.firebase.projectId}.appspot.com`
    });
    log.info('connected');
  } catch (err) {
    log.error(err);
    throw err;
  }
};

const getClient = () => {
  if (!firebaseApp) {
    connect();
  }
  return firebaseApp;
};

module.exports = {
  connect,
  getClient
};
