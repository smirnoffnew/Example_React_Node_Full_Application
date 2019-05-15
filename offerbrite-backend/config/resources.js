const path = require('path');
const os = require('os');

const config = {
  resetPasswordTemplate: path.resolve('resources/email-letters/reset-password.letter.pug'),
  spa: path.resolve('public/index.html'),
  publicResources: path.resolve('public'),
  favicon: path.resolve('public/favicon.ico'),
  uploadImagesDir: os.tmpdir(),
  predefinedCategories: path.resolve('resources/predefined-categories.json')
};

module.exports = config;
