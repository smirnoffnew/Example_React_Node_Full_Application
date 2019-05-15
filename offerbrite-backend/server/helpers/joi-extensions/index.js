const fs = require('fs');
const path = require('path');

function forEachInDirDo(srcDir, callback) {
  fs.readdirSync(srcDir)
    .filter(file => file.indexOf('.') !== 0 && file !== 'index.js')
    .forEach((file) => {
      callback(file);
    });
}

const pathToConfigs = __dirname;
forEachInDirDo(pathToConfigs, (file) => {
  // eslint-disable-next-line
  module.exports[file.substring(0, file.lastIndexOf('.'))] = require(path.resolve(
    pathToConfigs,
    file
  ));
});
