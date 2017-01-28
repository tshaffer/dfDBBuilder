// @flow

const fs = require('fs');
const exifImage = require('exif').ExifImage;

// import { DrivePhoto } from '../entities/drivePhoto';
import DrivePhoto from '../entities/drivePhoto';

// ------------------------------------
// Photo Date Helper functions
// ------------------------------------
function getExifDateTimes(df: DrivePhoto) {

  const dfPath = df.getPath();

  return new Promise((resolve) => {

    // check for blacklisted files
    if (dfPath.indexOf('_dsc3755') >= 0) {
      resolve(null);
      return;
    }

    try {
      new exifImage({image: dfPath}, function (error, exifData) {
        if (error || !exifData || !exifData.exif || (!exifData.exif.CreateDate && !exifData.exif.DateTimeOriginal)) {
          resolve();
        }
        else {
          df.setExifCreateDate(exifData.exif.CreateDate);
          df.setExifDateTimeOriginal(exifData.exif.DateTimeOriginal);
          resolve();
          // searchResult.isoString = isoString;
        }
      });
    } catch (error) {
      console.log('FAILED return from exifImage call: ', dfPath);
      resolve(null);
    }
  });
}

function getFileSystemDateTimes(df: DrivePhoto) {

  const dfPath = df.getPath();

  return new Promise((resolve, reject) => {
    fs.lstat(dfPath, (err, stats) => {
      if (err) {
        console.log(dfPath);
        reject(err);
      }

      const lastModified = stats.mtime; // Date object
      df.setLastModified(lastModified);

      const lastModifiedISO = lastModified.toISOString();
      df.setLastModifiedISO(lastModifiedISO);

      resolve();
    });
  });
}

export function getDFDateTimes(df: DrivePhoto) {
  return new Promise( (resolve, reject) => {
    getExifDateTimes(df).then( () => {
      getFileSystemDateTimes(df).then( () => {
        resolve();
      }).catch( (err) => {
        reject(err);
      })
    }).catch( (err) => {
      reject(err);
    })
  });
}

