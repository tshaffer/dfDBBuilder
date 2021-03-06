// @flow

const path = require('path');
const fs = require('fs');
const Jimp = require("jimp");
const readline = require('readline');
const nodeDir = require('node-dir');

import { DrivePhoto } from './entities/drivePhoto';
import * as dateMatcher from './utilities/dateMatcher';
import { convertPhoto } from './utilities/photoUtilities';

import * as utils from './utilities/utils';

let processedDFsByPath: Object = {};
let dfsToProcess = [];
let processedDFs = [];
let dfsProcessedSinceLastSave = 0;
const numDfsToProcessPerSave = 50;


function getExistingData() {
  try {
    const existingProcessedDFsStr: any = fs.readFileSync("dfDB.json");
    processedDFsByPath = JSON.parse(existingProcessedDFsStr);
  } catch(err) {
    console.log("getExistingData: ", err);
  }
}

function getRootFolder() {

  // let rl = readline.createInterface({
  //   input: process.stdin,
  //   output: process.stdout
  // });
  // rl.question('Enter the path to the root folder: ', (rootFolder) => {
  //   resolve(rootFolder);
  // });
  // /Users/tedshaffer/Documents/Projects/testPhotos

  // const rootFolder = "C:\\Users\\Ted\\Documents\\testPhotos";
  // const rootFolder = "C:\\Users\\Ted\\Documents\\RemovableMedia";
  const rootFolder = "E:\\RemovableMedia";

  return new Promise( (resolve, reject) => {
    resolve(rootFolder);
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

  console.log("hashDF invoked - hash file: ", df.getHashablePath());
  return new Promise( (resolve, reject) => {
    Jimp.read(df.getHashablePath()).then((image) => {
      const hashValue = image.hash(2);
      resolve(hashValue);
    }).catch( (err) => {
      reject(err);
    });
  });
}

function makeHashable(df: DrivePhoto) {

  return new Promise( (resolve, reject) => {
    const dfPath = df.getPath();
    const extension = path.extname(dfPath).toLowerCase();
    // if (extension === '.tif' || extension === '.tiff') {
    if (extension === '.tif' || extension === '.tiff') {
      // jimp doesn't support tif - convert to jpg here for hash comparison
      let dfName = path.basename(dfPath).toLowerCase();
      let fileNameWithoutExtension = dfName.slice(0, -4);
      dfName = fileNameWithoutExtension + ".jpg";

      const targetDir = "C:\\Users\\Ted\\Documents\\Projects\\photoSyncATron\\tmpFiles";
      const guid = utils.guid();
      let targetPath = path.join(targetDir, fileNameWithoutExtension + guid + ".jpg");
      console.log('convertPhoto then perform hash compare: ', dfPath);

      let promise = convertPhoto(dfPath, targetPath);
      promise.then( () => {
        // converted file should be at targetPath
        // TODO - don't know why, but it appears as though sometimes a '-0' is appended to the photo file name
        if (!fs.existsSync(targetPath)) {
          console.log(targetPath, ' converted file does not exist');
          targetPath = path.join(targetDir, fileNameWithoutExtension + guid + "-0.jpg");
          if (!fs.existsSync(targetPath)) {
            debugger;
          }
        }
        df.setHashablePath(targetPath);
        resolve(df);
      });
    }
    else {
      resolve(df);
    }
  });
}

function processDF(df) {
  return new Promise( (resolve, reject) => {

    console.log('Process DF:');
    console.log(df);

    // first step - convert to hashable file type
    makeHashable(df).then( (df) => {

      // next step - get hash
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
  });
}

function saveResults() {
  processedDFsByPath = {};
  processedDFs.forEach( (processedDF) => {
    processedDFsByPath[processedDF.getPath()] = processedDF;
  });
  const processedDFsByPathStr = JSON.stringify(processedDFsByPath, null, 2);
  fs.writeFileSync('dfDB.json', processedDFsByPathStr);
  console.log('dfDB.json saved');
}

function processDFs() {

  return new Promise( (resolve, reject) => {
    if (dfsToProcess.length > 0) {
      let dfToProcess = dfsToProcess.shift();
      processDF(dfToProcess).then( (processedDF) => {
        console.log('completed processing:');
        console.log(processedDF);
        processedDFs.push(processedDF);
        console.log("remaining df's to process: ", dfsToProcess.length);

        if (dfsProcessedSinceLastSave >= numDfsToProcessPerSave) {
          saveResults();
          dfsProcessedSinceLastSave = 0;
        }
        else {
          dfsProcessedSinceLastSave++;
        }

        processDFs();
      }).catch( (err) => {
        reject(err);
      });
    }
    else {
      // HOW DO I NOT GET THIS RESOLVE MIXED UP WITH THE ONE ABOVE??
      // IF THAT'S WHAT'S HAPPENING
      // resolve();

      saveResults();

      resolve();
    }
  });
}

function buildDFDb(photoFilePaths) {

  let filesSkipped = 0;

  photoFilePaths.forEach( (photoFilePath) => {

    // check if the file has already been processed or is blacklisted
    if ( !processedDFsByPath[photoFilePath] && photoFilePath.indexOf('PA070457.JPG') < 0  && photoFilePath.indexOf('PA070458.JPG') < 0) {
      const df = new DrivePhoto(photoFilePath);
      dfsToProcess.push(df);
    }
    else {
      filesSkipped++;
    }
  });

  console.log('######################## Number of files skipped: ', filesSkipped);

  // only test a subset of all the files.
  // dfsToProcess = dfsToProcess.slice(0, 50);

  processDFs().then( () => {
    // console.log("processDFs complete");
    //
    // // put results into a dictionary
    // processedDFs.forEach( (processedDF) => {
    //   processedDFsByPath[processedDF.getPath()] = processedDF;
    // });
    // const processedDFsByPathStr = JSON.stringify(processedDFsByPath, null, 2);
    // fs.writeFileSync('dfDB.json', processedDFsByPathStr);
    //
    // console.log('dfDB.json saved');
    console.log("dfDBBuilder complete");
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

getExistingData();

getRootFolder().then( (rootFolder) => {
  getAllFiles(rootFolder).then( (allFiles) => {
    let photoFilePaths = getPhotoFiles(allFiles);
    console.log("Photos on drive: ", photoFilePaths.length);
    buildDFDb(photoFilePaths);
  })
})
