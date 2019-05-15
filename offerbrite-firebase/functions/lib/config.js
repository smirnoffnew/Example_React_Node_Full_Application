"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
exports.IMAGE_COMPRESSED_WIDTH = functions.config().image_compressor.image_compressed_width || 1600;
exports.IMAGE_COMPRESSED_HEIGHT = functions.config().image_compressor.image_compressed_height || 1600;
//# sourceMappingURL=config.js.map