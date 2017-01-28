const path = require('path');
const fs = require('fs');
const readline = require('readline');
const nodeDir = require('node-dir');

const utils = require('./utils');

// Program start
console.log("dfDBBBuilder - start");
console.log("__dirname: ", __dirname);

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter the path to the root folder: ', (rootFolder) => {

  console.log("rootFolder is: ", rootFolder);

  nodeDir.files(rootFolder, (err, photoFiles) => {

    if (err) throw err;
    photoFiles = photoFiles.filter(utils.isPhotoFile);

    console.log("Photos on drive: ", photoFiles.length);

    // let promises = [];
    // files.forEach( (file) => {
    //   promise = findFile(file);
    //   promises.push(promise);
    // });
    // Promise.all(promises).then( (searchResults) => {
    //   saveSearchResults(searchResults);
    // });
  });

});

// /Users/tedshaffer/Documents/Projects/testPhotos