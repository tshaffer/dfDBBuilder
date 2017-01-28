// @flow

const path = require('path');
const fs = require('fs');
const readline = require('readline');
const nodeDir = require('node-dir');

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
    resolve("/Users/tedshaffer/Documents/Projects/testPhotos");
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
