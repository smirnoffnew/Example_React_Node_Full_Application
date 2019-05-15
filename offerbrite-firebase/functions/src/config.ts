import * as functions from 'firebase-functions';

export const IMAGE_COMPRESSED_WIDTH = functions.config().image_compressor.image_compressed_width || 1600;
export const IMAGE_COMPRESSED_HEIGHT= functions.config().image_compressor.image_compressed_height || 1600;
