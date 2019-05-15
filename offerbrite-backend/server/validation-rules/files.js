const config = require('../../config/index');

module.exports = {
  image: {
    maxSize: config.env === 'test' ? 1024 * 50 : 5 * 1024 * 1024, // 50Kb or less at test, 5Mb or less at other
    mimetypes: ['image/jpeg', 'image/png']
  }
};
