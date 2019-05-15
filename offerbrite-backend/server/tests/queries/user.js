const httpStatus = require('http-status');

module.exports.testSuitsForUserPassword = {
  password: [
    {
      data: {
        password: null
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: 'empty'
    },
    {
      data: {
        password: 'a2!34'
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: '< 6 symbols'
    },
    {
      data: {
        password: 'a234asakIHIBS!Ibi2i7iaih87xaixjnsscscscscsci'
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: '> 20 symbols'
    },
    {
      data: {
        password: 'ADLassd23'
      },
      expectedCode: httpStatus.OK,
      description: 'without special symbols'
    },
    {
      data: {
        password: 'ADLNLWNOWN23!'
      },
      expectedCode: httpStatus.OK,
      description: 'without lowercase symbols'
    },
    {
      data: {
        password: 'asfsisib2b@k23k2k'
      },
      expectedCode: httpStatus.OK,
      description: 'without uppercase symbols'
    },
    {
      data: {
        password: 'asdfgAsd@'
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: 'without digits'
    }
  ]
};
module.exports.testSuitsForUserEmail = {
  email: [
    {
      data: {
        email: 'hr@com.com'
      },
      expectedCode: httpStatus.OK,
      description: 'valid, short email'
    },
    {
      data: {
        email: 'invalid1'
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: 'not a email'
    },
    {
      data: {
        email: null
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: 'empty'
    },
    {
      data: {
        email: 'some.user.123@mail.com'
      },
      expectedCode: httpStatus.OK,
      description: 'valid'
    }
  ]
};
module.exports.testSuitsForUserUpdating = {
  isNotificationsEnabled: [
    {
      data: {
        isNotificationsEnabled: null
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: 'empty'
    },
    {
      data: {
        isNotificationsEnabled: false
      },
      expectedCode: httpStatus.OK,
      description: '=false'
    },
    {
      data: {
        isNotificationsEnabled: true
      },
      expectedCode: httpStatus.OK,
      description: '=true'
    },
    {
      data: {
        isNotificationsEnabled: 'smlsqamcma'
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: 'cannot be converted to boolean'
    }
  ],
  username: [
    {
      data: {
        username: 'Offerbrite'
      },
      expectedCode: httpStatus.OK,
      description: 'valid, solid word'
    },
    {
      data: {
        username: 'O Fferbrite'
      },
      expectedCode: httpStatus.OK,
      description: 'valid, several words'
    },
    {
      data: {
        username: 'O.Fferbrite'
      },
      expectedCode: httpStatus.OK,
      description: 'valid, several words, split by .'
    },
    {
      data: {
        username: 'O. Fferbrite'
      },
      expectedCode: httpStatus.OK,
      description: 'valid, several words, split by "." and space'
    },
    {
      data: {
        username: 'O.    Fferb   rite'
      },
      expectedCode: httpStatus.OK,
      expectedData: {
        username: 'O. Fferb rite'
      },
      description: 'valid, several words, split by "." and several spaces'
    },
    {
      data: {
        username: 'O.    Fferb..rite'
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: 'several words, split by several "."'
    },
    {
      data: {
        username: null
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: 'empty'
    },
    {
      data: {
        username: 'Offerbr!te'
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: 'contains not-alphanumeric symbols'
    },
    {
      data: {
        username: 'n'
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: '< 2 symbols'
    },
    {
      data: {
        username: 'naaaaaaaaaaaaaaanaaaaaaaaaaaaaaa'
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: '> 20 symbols'
    },

  ],
  password: [
    {
      data: {
        password: '123!@Jsnsd'
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: 'password field is forbidden'
    }
  ],
  email: [
    {
      data: {
        email: 'some.user.123@mail.com'
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: 'email field is forbidden'
    }
  ]
};
module.exports.testSuitsForUserCreation = {
  username: module.exports.testSuitsForUserUpdating.username,
  password: module.exports.testSuitsForUserPassword.password,
  email: module.exports.testSuitsForUserEmail.email
};
