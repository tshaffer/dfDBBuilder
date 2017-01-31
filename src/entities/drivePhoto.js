const sizeOf = require('image-size');

export class DrivePhoto {

  constructor(path) {
    this.path = path;
    this.hashablePath = path;
    this.hash = '';
    this.dimensions = this.getPhotoDimensions(path);
    this.lastModified = null;
    this.lastModifiedISO = '';
    this.exifCreateDate = '';
    this.exifDateTimeOriginal = '';
  }

  getPhotoDimensions(photoFilePath) {

    let dimensions = null;

    try {
      if (photoFilePath.indexOf('DSC_0017.JPG') < 0) {
        dimensions = sizeOf(photoFilePath);
      }
    } catch (sizeOfError) {
      console.log(sizeOfError, " invoking sizeOf on: ", photoFilePath);
    }

    return dimensions;
  }


  getPath() {
    return this.path;
  }

  setHashablePath(hashablePath: string) {
    this.hashablePath = hashablePath;
  }

  getHashablePath() {
    return this.hashablePath;
  }


  setHash(hash) {
    this.hash = hash;
  }

  getHash() {
    return this.hash;
  }

  setDimensions(dimensions) {
    this.dimensions = dimensions;
  }

  getDimensions() {
    return this.dimensions;
  }

  getWidth() {
    if (this.dimensions) {
      return this.dimensions.width;
    }
    return -1;
  }

  getHeight() {
    if (this.dimensions) {
      return this.dimensions.height;
    }
    return -1;
  }

  setLastModified(lastModified) {
    this.lastModified = lastModified;
  }

  getLastModified() {
    return this.lastModified;
  }

  setLastModifiedISO(lastModifiedISO) {
    this.lastModifiedISO = lastModifiedISO;
  }

  getLastModifiedISO() {
    return this.lastModifiedISO;
  }

  setExifCreateDate(exifCreateDate) {
    this.exifCreateDate = exifCreateDate;
  }

  getExifCreateDate() {
    return this.exifCreateDate;
  }

  setExifDateTimeOriginal(exifDateTimeOriginal) {
    this.exifDateTimeOriginal = exifDateTimeOriginal;
  }

  getExifDateTimeOriginal() {
    return this.exifDateTimeOriginal;
  }
}
