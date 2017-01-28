export class DrivePhoto {

  constructor(path) {
    this.path = path;
    this.dimensions = {};
    this.lastModified = null;
    this.lastModifiedISO = '';
    this.exifCreateDate = '';
    this.exifDateTimeOriginal = '';
  }

  getPath() {
    return this.path;
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
