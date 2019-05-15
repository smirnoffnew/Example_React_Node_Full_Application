"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const os = require("os");
const fse = require("fs-extra");
const admin = require("firebase-admin");
const Gm = require("gm");
const config = require("./config");
const gm = Gm.subClass({ imageMagick: true });
function compressPng(tempFilePath, optimizedFilePath) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            gm(tempFilePath)
                .strip()
                .resize(config.IMAGE_COMPRESSED_WIDTH, config.IMAGE_COMPRESSED_HEIGHT, '>')
                .quality(5)
                .interlace('Plane')
                .colorspace('sRGB')
                .write(optimizedFilePath, (err) => {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
    });
}
function compressJpeg(tempFilePath, optimizedFilePath) {
    return new Promise((resolve, reject) => {
        gm(tempFilePath)
            .strip()
            .resize(config.IMAGE_COMPRESSED_WIDTH, config.IMAGE_COMPRESSED_HEIGHT, '>')
            .quality(70)
            .interlace('Plane')
            .colorspace('sRGB')
            .write(optimizedFilePath, (err) => {
            if (err)
                reject(err);
            else
                resolve();
        });
    });
}
/**
 * When an image is uploaded in the Storage bucket We compress it
 */
function compress(object) {
    return __awaiter(this, void 0, void 0, function* () {
        const fileBucket = object.bucket; // The Storage bucket that contains the file.
        const filePath = object.name; // File path in the bucket.
        const contentType = object.contentType; // File content type.
        const metageneration = +object.metageneration;
        const fileName = path.basename(filePath); // Get the file name.
        // Exit if this is triggered on a file that is not an image.
        if (!contentType.startsWith('image/')) {
            console.log(`This is not an image ${fileName}`);
            return null;
        }
        // Exit if file exists but is not new and is only being triggered because of a metadata change.
        if (metageneration > 1) {
            console.log('This is a metadata change event.');
            return;
        }
        // Download file from bucket.
        const bucket = admin.storage().bucket(fileBucket);
        const file = bucket.file(filePath);
        const [fileMetadata] = yield file.getMetadata();
        if (fileMetadata.metadata && fileMetadata.metadata.optimized) {
            console.log(`This file ${fileName} is already optimized`);
            return;
        }
        const tempFilePath = path.join(os.tmpdir(), fileName);
        const optimizedFilePath = path.join(os.tmpdir(), fileName + '-optimized');
        yield file.download({ destination: tempFilePath, validation: false });
        // Generate a thumbnail using ImageMagick.
        switch (contentType) {
            case 'image/png':
                yield compressPng(tempFilePath, optimizedFilePath);
                break;
            default:
                yield compressJpeg(tempFilePath, optimizedFilePath);
                break;
        }
        // Uploading the thumbnail.
        yield bucket.upload(optimizedFilePath, {
            destination: filePath,
            metadata: {
                metadata: { optimized: true },
                contentType: contentType,
            },
        });
        console.log('Image uploaded to', filePath);
        // Once the thumbnail has been uploaded delete the local file to free up disk space.
        yield Promise.all([fse.unlink(tempFilePath), fse.unlink(optimizedFilePath)]);
    });
}
exports.compress = compress;
//# sourceMappingURL=imageCompressor.js.map