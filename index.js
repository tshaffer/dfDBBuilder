const path = require('path');
const fs = require('fs');
const readline = require('readline');
const nodeDir = require('node-dir');

const utils = require('./utils');

function getRootFolder() {

  // let rl = readline.createInterface({
  //   input: process.stdin,
  //   output: process.stdout
  // });
  // rl.question('Enter the path to the root folder: ', (rootFolder) => {
  //   resolve(rootFolder);
  // });

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
  console.log("Photos on drive: ", photoFiles.length);
  return photoFiles;
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
    let photoFiles = getPhotoFiles(allFiles);
    console.log('poo');
  })
})



  // nodeDir.files(rootFolder, (err, photoFiles) => {
  //
  //   if (err) throw err;
  //   photoFiles = photoFiles.filter(utils.isPhotoFile);
  //


    // let promises = [];
    // files.forEach( (file) => {
    //   promise = findFile(file);
    //   promises.push(promise);
    // });
    // Promise.all(promises).then( (searchResults) => {
    //   saveSearchResults(searchResults);
    // });
  // });

// });

// /Users/tedshaffer/Documents/Projects/testPhotos