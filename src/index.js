// @flow

const path = require('path');
const fs = require('fs');
const readline = require('readline');
const nodeDir = require('node-dir');

import { DrivePhoto } from './entities/drivePhoto';
import * as utils from './utils/utils';

function getRootFolder() {

  // let rl = readline.createInterface({
  //   input: process.stdin,
  //   output: process.stdout
  // });
  // rl.question('Enter the path to the root folder: ', (rootFolder) => {
  //   resolve(rootFolder);
  // });
  // /Users/tedshaffer/Documents/Projects/testPhotos

  return new Promise( (resolve, reject) => {
    // resolve("/Users/tedshaffer/Documents/Projects/testPhotos");
    resolve("C:\\Users\\Ted\\Documents\\testPhotos");
  });
}


function getAllFiles(rootFolder) {
  return new Promise( (resolve, reject) => {
    nodeDir.files(rootFolder, (err, files) => {
      if (err) reject(err);
      resolve(files);
    });
  });
}


function getPhotoFiles(allFiles) {
  let photoFiles = allFiles.filter(utils.isPhotoFile);
  return photoFiles;
}


function buildDFDb(photoFilePaths) {

  let drivePhotos = [];
  photoFilePaths.forEach( (photoFilePath) => {
    const df = new DrivePhoto(photoFilePath);
    drivePhotos.push(df);
  })

  // for testing a subset of all the files.
  // drivePhotos = drivePhotos.slice(0, 20);

}
/*************************************************************************************************
 *
 *   PROGRAM START
 *
 ************************************************************************************************/
console.log("dfDBBBuilder - start");
console.log("__dirname: ", __dirname);

getRootFolder().then( (rootFolder) => {
  getAllFiles(rootFolder).then( (allFiles) => {
    let photoFilePaths = getPhotoFiles(allFiles);
    console.log("Photos on drive: ", photoFilePaths.length);
  })
})
