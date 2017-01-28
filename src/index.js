const path = require('path');
const fs = require('fs');
const Jimp = require("jimp");
const readline = require('readline');
const nodeDir = require('node-dir');

import { DrivePhoto } from './entities/drivePhoto';
import * as dateMatcher from './utilities/dateMatcher';

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

  console.log("hashDF invoked - hash file: ", df.getPath());
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

      // next step - get date/times

      dateMatcher.getDFDateTimes(df).then( () => {

        // after all steps are complete, resolve
        resolve(df);

      }).catch( (err) => {
        reject(err);
      });
    })
  });
}

let dfsToProcess = [];
let processedDFs = [];
function processDFs() {
  return new Promise( (resolve, reject) => {
    if (dfsToProcess.length > 0) {
      let dfToProcess = dfsToProcess.shift();
      processDF(dfToProcess).then( (processedDF) => {
        console.log('completed processing:');
        console.log(processedDF);
        processedDFs.push(processedDF);
        console.log("remaining df's to process: ", dfsToProcess.length);
        processDFs();
      }).catch( (err) => {
        reject(err);
      });
    }
    else {
      debugger;
      resolve();
    }
  });
}

function buildDFDb(photoFilePaths) {

  photoFilePaths.forEach( (photoFilePath) => {
    const df = new DrivePhoto(photoFilePath);
    dfsToProcess.push(df);
  })

  // only test a subset of all the files.
  dfsToProcess = dfsToProcess.slice(0, 5);

  processDFs().then( () => {
    console.log("processDFs complete");
    debugger;
  }).catch( (err) => {
    console.log(err);
    debugger;
  });
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
