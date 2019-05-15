const admin = require('firebase-admin');
const Storage = require('./Storage');
const gs = require('@google-cloud/storage');

/**
 * @typedef Firebase
 */
class Firebase {
  /**
   * Builds wrapper around Firebase API
   * @property {String} name name of Firebase to associate with
   */
  constructor({ serviceAccount, name = 'DEFAULT' }) {
    this._projectId = serviceAccount.projectId;
    this._app = admin.initializeApp(
      {
        credential: admin.credential.cert(serviceAccount),
        storageBucket: `${serviceAccount.project_id}.appspot.com`
      },
      name
    );
    this._name = name;
    this._storage = new Storage(
      serviceAccount.projectId,
      new gs.Storage(
        {
          projectId: serviceAccount.projectId,
          credentials: serviceAccount
        }
      ),
      `${serviceAccount.project_id}.appspot.com`
    );
  }

  get projectId() {
    return this._projectId;
  }

  get name() {
    return this._name;
  }

  get app() {
    return this._app;
  }

  get storage() {
    return this._storage;
  }
}

module.exports = Firebase;
