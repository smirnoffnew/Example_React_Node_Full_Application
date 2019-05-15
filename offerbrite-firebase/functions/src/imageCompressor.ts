import {ObjectMetadata} from "firebase-functions/lib/providers/storage";
import * as  path from 'path';
import * as os from 'os';
import * as fse from 'fs-extra';
import * as admin from 'firebase-admin';
import * as Gm from 'gm';
import * as config from './config';

const gm = Gm.subClass({imageMagick: true});

async function compressPng(tempFilePath: string, optimizedFilePath: string) {
    return new Promise((resolve, reject) => {
        gm(tempFilePath)
            .strip()
            .resize(config.IMAGE_COMPRESSED_WIDTH, config.IMAGE_COMPRESSED_HEIGHT, '>')
            .quality(5)
            .interlace('Plane')
            .colorspace('sRGB')
            .write(optimizedFilePath, (err): void => {
                if (err) reject(err);
                else resolve()
            })
    })
}

function compressJpeg(tempFilePath: string, optimizedFilePath: string) {
    return new Promise((resolve, reject) => {
        gm(tempFilePath)
            .strip()
            .resize(config.IMAGE_COMPRESSED_WIDTH, config.IMAGE_COMPRESSED_HEIGHT, '>')
            .quality(70)
            .interlace('Plane')
            .colorspace('sRGB')
            .write(optimizedFilePath, (err): void => {
                if (err) reject(err);
                else resolve()
            })
    })
}

/**
 * When an image is uploaded in the Storage bucket We compress it
 */
export async function compress(object: ObjectMetadata) {
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
    const [fileMetadata] = await file.getMetadata();
    if (fileMetadata.metadata && fileMetadata.metadata.optimized) {
        console.log(`This file ${fileName} is already optimized`);
        return;
    }
    const tempFilePath = path.join(os.tmpdir(), fileName);
    const optimizedFilePath = path.join(os.tmpdir(), fileName + '-optimized');
    await file.download({destination: tempFilePath, validation: false});
    // Generate a thumbnail using ImageMagick.
    switch (contentType) {
        case 'image/png':
            await compressPng(tempFilePath, optimizedFilePath);
            break;
        default:
            await compressJpeg(tempFilePath, optimizedFilePath);
            break;
    }
    // Uploading the thumbnail.
    await bucket.upload(optimizedFilePath, {
        destination: filePath,
        metadata: {
            metadata: {optimized: true},
            contentType: contentType,
        },
    });
    console.log('Image uploaded to', filePath);
    // Once the thumbnail has been uploaded delete the local file to free up disk space.
    await Promise.all([fse.unlink(tempFilePath), fse.unlink(optimizedFilePath)])
}

