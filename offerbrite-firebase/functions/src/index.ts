import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as imageCompressor from "./imageCompressor";

admin.initializeApp();

exports.compressImage=functions.storage.object().onFinalize((object) => imageCompressor.compress(object));

