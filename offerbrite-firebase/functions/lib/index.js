"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require("firebase-admin");
const functions = require("firebase-functions");
const imageCompressor = require("./imageCompressor");
admin.initializeApp();
exports.compressImage = functions.storage.object().onFinalize((object) => imageCompressor.compress(object));
//# sourceMappingURL=index.js.map