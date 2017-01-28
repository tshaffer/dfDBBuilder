// @flow

const photoFileExtensions=[
  'jpg',
  'png',
  // 'psd',
  'tif',
  'tiff'
];

function getFileExtension(fileName: string) {
  return fileName.split('.').pop();
}

function isJpegFile(fileName: string) {
  const ext = getFileExtension(fileName.toLowerCase());
  if ( (['jpg'].indexOf(ext)) >= 0) {
    return true;
  }
  else {
    return false;
  }
}

function isPhotoFile(fileName: string) {
  const ext = getFileExtension(fileName.toLowerCase());
  if ( (photoFileExtensions.indexOf(ext)) >= 0) {
    return true;
  }
  else {
    return false;
  }
}

function isPhoto(photo: Object) {
  const fileName = photo.title[0]._;
  return isPhotoFile(fileName);
}

function getDateFromString(dateTimeStr: string) {
  const year = Number(dateTimeStr.substring(0, 4));
  const month = Number(dateTimeStr.substring(5, 7)) - 1;
  const day = Number(dateTimeStr.substring(8, 10));
  const hours = Number(dateTimeStr.substring(11, 13));
  const minutes = Number(dateTimeStr.substring(14, 16));
  const seconds = Number(dateTimeStr.substring(17, 19));
  return new Date(year, month, day, hours, minutes, seconds);
}

module.exports = {
  getFileExtension,
  isJpegFile,
  isPhotoFile,
  isPhoto,
  getDateFromString
}
