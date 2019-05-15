const httpStatus = require('http-status');

module.exports.testSuitsForUpdating = {
  name: [
    {
      data: {
        name: 'Offerbrite'
      },
      expectedCode: httpStatus.OK,
      description: 'valid, solid word'
    },
    {
      data: {
        name: 'O. 2@1Fferb  rite'
      },
      expectedCode: httpStatus.OK,
      description: 'valid, several words, contains not-alphanumeric symbols'
    },
    {
      data: {
        name: null
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: 'empty'
    },
    {
      data: {
        name: 'n'
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: '< 2 symbols'
    },
    {
      data: {
        name: Array.from({ length: 21 })
          .map(() => 'a')
          .join()
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: '> 20 symbols'
    },
  ],
};

module.exports.testSuitsForCreation = {
  ...exports.testSuitsForUpdating
};
