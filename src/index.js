const path = require('path');
const fs = require('fs');
const Jimp = require("jimp");
const readline = require('readline');
const nodeDir = require('node-dir');

import { DrivePhoto } from './entities/drivePhoto';
import * as utils from './utilities/utils';

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
  return allFiles.filter(utils.isPhotoFile);
}


function hashDF(df) {
  return new Promise( (resolve, reject) => {
    Jimp.read(df.getPath()).then((image) => {
      const hashValue = image.hash(2);
      resolve(hashValue);
    }).catch( (err) => {
      reject(err);
    });
  });
}

function processDF(df) {
  return new Promise( (resolve, reject) => {

    // first step - get hash
    hashDF(df).then( (hashValue) => {
      df.setHash(hashValue);

      // send step - get exif dates
    })
  });
}

let dfsToProcess = [];
function processDFs() {
  if (dfsToProcess.length > 0) {
    let dfToProcess = dfsToProcess.shift();
    processDF(dfToProcess).then( () => {
      processDFs();
    }).catch( (err) => {

    });
  }
}
function buildDFDb(photoFilePaths) {

  photoFilePaths.forEach( (photoFilePath) => {
    const df = new DrivePhoto(photoFilePath);
    dfsToProcess.push(df);
  })

  // for testing a subset of all the files.
  dfsToProcess = dfsToProcess.slice(0, 20);

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
    buildDFDb(photoFilePaths);
  })
})
