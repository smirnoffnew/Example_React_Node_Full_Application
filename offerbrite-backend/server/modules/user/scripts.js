const User = require('../../modules/user/user.model');
const config = require('../../../config');
const log = require('../../helpers/winston').getLogger({ name: 'scripts' });
const Category = require('../../modules/category/category.model');
const fse = require('fs-extra');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const BusinessUser = require('../business-user/businessUser.model');
const Offer = require('../offer/offer.model');
const Business = require('../business/business.model');
const Reports = require('../reports/reports.model');
const moment = require('moment');
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

const returnNumbers = numbers => (numbers ? numbers.map(number => `+${number.cc}${number.number}`) : null);
// const returnCountry = countrys => countrys.map(countrys => countrys.address.country);
const getNumberOfWeek = (date) => {
  const today = new Date(date);
  const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
  const pastDaysOfYear = (today - firstDayOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};
const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];
const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const createDateObejct = (offer) => {
  const views = offer.views.map((view) => {
    const date = new Date(view.date);
    return {
      year: date.getFullYear(),
      month: monthNames[date.getMonth()],
      day: dayNames[date.getDay() - 1],
      week: getNumberOfWeek(view.date)
    };
  });
  offer._doc.views = views;
  return offer;
};

const mobileNumberParaser = numbers => numbers.map((number) => {
    try {
      const phone = phoneUtil.parseAndKeepRawInput(number);
      if (!(phoneUtil.isValidNumber(phone) && phoneUtil.isPossibleNumber(phone))) {
        throw Error(`Invalid phone number: ${phone}`);
      }

      return {
        region: phoneUtil.getRegionCodeForNumber(phone),
        number: phone.getNationalNumber(),
        cc: phone.getCountryCode()
      };
    } catch (e) {
      return Error(e);
    }
  });

const findUserBusiness = businesUser => Business.findOne({ ownerId: businesUser.id })
.then((busines) => {
    if (busines === null) {
      return null;
    }
    return {
      id: businesUser.id,
      email: businesUser.email,
      brandName: busines.brandName,
      websiteUrl: busines.websiteUrl,
      mobileNumbers: busines.mobileNumbers
        ? returnNumbers(busines.mobileNumbers)
        : busines.mobileNumbers,
      country: busines.locations[0].address.country
    };
  });

const createAdmin = data => new User({
    email: data.body.email,
    password: data.body.password,
    // username: 'super-admin',
    username: data.body.name,
    role: data.body.role
  }).save();

const initAdminUserCreation = data => User.findOne({ username: data.body.name })
    .then((doc) => {
      if (doc === null) {
        return createAdmin(data);
      }
      return null;
    })
    .then((doc) => {
      if (doc) {
        log.info('admin created');
        return true;
      }
      log.info('admin user exist');
      return false;
    });

const initPredefinedCategories = () => {
  Category.find()
    .countDocuments()
    .exec()
    .then((count) => {
      if (count > 0) {
        log.info('DB contains %s categories, so do not fill DB with pre defined categories', count);
      } else {
        fse
          .readJSON(config.resources.predefinedCategories)
          .then(cats => Promise.all(cats.map(cat => new Category(cat).save())))
          .then((savedDocs) => {
            log.info('fill DB with %s categories', savedDocs.length);
          });
      }
    })
    .catch((err) => {
      log.error(err);
    });
};

const getAdminUser = data => User.findOne({ username: data.body.name }).then((res) => {
    if (res == null) {
      return false;
    }
    const pass = bcrypt.compareSync(data.body.password, res.password);
    if (pass) {
      return genAuthTokens(res);
    }
    return false;
  });

const getLoginAdmin = data => User.findOne({ username: data.username }).then((res) => {
    if (res == null) {
      return false;
    }
    const pass = data.password === res.password;
    if (pass) {
      return genAuthTokens(res);
    }
    return false;
  });

const getAllAdmin = data => User.find({ role: ['admin', 'super-admin'] }).then((res) => {
    if (res == null) {
      return false;
    }
    if (data.role === 'admin') {
      return false;
    }
    return res;
  });

const getAllUsers = data => User.find({ role: 'user' })
    .skip(+data.query.skip)
    .limit(+data.query.limit)
    .then((res) => {
      if (res == null) {
        return false;
      }
      if (data.role === 'user') {
        return false;
      }
      return res;
    });

const getAllBusinessUsers = data => BusinessUser.find({ role: 'businessUser' })
    .skip(+data.query.skip)
    .limit(+data.query.limit)
    .then((res) => {
      if (res == null) {
        return false;
      }
      if (data.role === 'user' || data.role === 'businessUser') {
        return false;
      }
      const businesUsers = Promise.all(res.map(user => findUserBusiness(user)));

      return businesUsers;
    });

const updateBusinesUserById = (data) => {
  if (data.role === 'user' || data.role === 'businessUser') {
    return false;
  }

  return BusinessUser.findByIdAndUpdate(data.params.businessUserId, {
    email: data.body.email
  })
    .then(updatedUser => Business.findOneAndUpdate(
        { ownerId: updatedUser.id },
        {
          brandName: data.body.brandName,
          mobileNumbers: mobileNumberParaser(data.body.mobileNumbers)
        }
      ).then((updatedBusiness) => {
        const returnedObject = {
          email: updatedUser.email,
          brandName: updatedBusiness.brandName
        };
        return returnedObject;
      }))
    .catch(() => false);
};

const getAllOffers = data => Offer.find()
    .skip(+data.query.skip)
    .limit(+data.query.limit)
    .then((res) => {
      if (res == null) {
        return false;
      }
      if (data.role === 'user' || data.role === 'businessUser') {
        return false;
      }

      return res;
    })
    .then(resData => resData
        .map(offer => (offer.views ? createDateObejct(offer) : offer))
        .filter(
          offer => offer.endDate
            > moment()
              .add('10', 's')
              .valueOf()
        ));

const getOfferById = data => Offer.findById(data.params.offerId).then((offer) => {
    if (data.role === 'user' || data.role === 'businessUser') {
      return false;
    }
    if (offer == null) {
      return false;
    }
    return offer.views ? createDateObejct(offer) : offer;
  });

const deleteOfferById = (data) => {
  if (data.role === 'user' || data.role === 'businessUser') {
    return false;
  }
  return Offer.findByIdAndRemove(data.params.offerId)
    .catch((err) => {
      log.error('ERR: ', err);
      return false;
    })
    .then(() => {
      Reports.find({ offerId: data.params.offerId }).then((reportOnOffer) => {
        if (reportOnOffer != null) {
          Promise.all(
            reportOnOffer.map((report) => {
              Reports.findByIdAndRemove(report.id);
              return true;
            })
          );
        }
      });
      return true;
    });
};

const updateOfferById = (data) => {
  if (data.role === 'user' || data.role === 'businessUser') {
    return false;
  }
  return Offer.findByIdAndUpdate(data.params.offerId, {
    title: data.body.title,
    description: data.body.description,
    discount: data.body.discount,
    fullPrice: data.body.fullPrice,
    isDateHidden: data.body.isDateHidden,
    startDate: data.body.startDate,
    endDate: data.body.endDate,
    category: data.body.category,
    imagesUrls: data.body.imagesUrls,
    locations: data.body.locations
  })
    .catch((err) => {
      log.error('ERR: ', err);
      return false;
    })
    .then(updatedOffer => updatedOffer);
};

const updateAdmin = (data) => {
  if (data.authUser.role === 'super-admin') {
    return data.body.password
      ? bcrypt
          .hash(data.body.password, 10)
          .then(async (hp) => {
            const updateduser = await User.findByIdAndUpdate(data.body.id, {
              email: data.body.email,
              role: data.body.role,
              username: data.body.name,
              password: hp
            });
            return updateduser;
          })
          .catch((err) => {
            log.error('ERR: ', err);
            return false;
          })
      : User.findByIdAndUpdate(data.body.id, {
          email: data.body.email,
          role: data.body.role,
          username: data.body.name
        })
          .then(updatedUser => User.findById(updatedUser.id))
          .catch((err) => {
            log.error('ERR: ', err);
            return false;
          });
  }
  return false;
};

const deleteAdmin = (data) => {
  if (data.authUser.role === 'super-admin') {
    return User.findByIdAndRemove(data.body.id)
      .catch((err) => {
        log.error('ERR: ', err);
        return false;
      })
      .then(() => true);
  }
  return false;
};

const deleteReportById = (data) => {
  if (data.role === 'user' || data.role === 'businessUser') {
    return false;
  }
  return Reports.findByIdAndRemove(data.params.reportId)
    .then(deletedObject => deletedObject)
    .catch((err) => {
      log.error('ERR: ', err);
      return false;
    });
};

const updateUserById = (data) => {
  if (data.role === 'user' || data.role === 'businessUser') {
    return false;
  }
  return User.findByIdAndUpdate(data.params.userId, {
    email: data.body.email,
    username: data.body.username,
    role: data.body.role,
    isNotificationsEnabled: data.body.isNotificationsEnabled
  });
};

const deleteUserById = (data) => {
  if (data.role === 'user' || data.role === 'businessUser') {
    return false;
  }
  return User.findByIdAndRemove(data.params.userId)
    .catch((err) => {
      log.error('ERR: ', err);
      return false;
    })
    .then(() => true);
};

const deleteBusinessUserById = (data) => {
  if (data.role === 'user' || data.role === 'businessUser') {
    return false;
  }
  return BusinessUser.findByIdAndRemove(data.params.businessUserId)
    .then(() => {
      Business.findOneAndRemove({ ownerId: data.params.businessUserId });
      return true;
    })
    .catch((err) => {
      log.error('ERR: ', err);
      return false;
    });
};

const getBusinessById = data => Business.findById(data.params.businessId).then((business) => {
    if (data.role === 'user' || data.role === 'businessUser') {
      return false;
    }
    if (business == null) {
      return false;
    }
    return business;
  });

const updateUserCountry = data => User.findByIdAndUpdate(data.params.userId, {
    country: data.body.country
  }).then(async (user) => {
    if (user == null) {
      return false;
    }

    const updatedUser = await User.findById(user.id);
    return updatedUser;
  });

const updateUserCategories = data => User.findByIdAndUpdate(data.params.userId, {
    categories: data.body.categories
  }).then(async (user) => {
    if (user == null) {
      return false;
    }

    const updatedUser = await User.findById(user.id);
    return updatedUser;
  });

const addUserTokenAndOperationSystem = data => User.findByIdAndUpdate(data.params.userId, {
    operationSystem: data.body.operationSystem,
    token: data.body.token
  }).then(async (user) => {
    if (user == null) {
      return false;
    }
    const updatedUser = await User.findById(user.id);
    return updatedUser;
  });

function genAuthTokens(data) {
  const admin = {};
  admin.adminname = data.username;
  admin.id = data.id;
  admin.role = data.role;
  return {
    access: genJWTAccessToken(data),
    refresh: genJWTRefreshToken(data),
    admin
  };
}

// Generate access token
function genJWTRefreshToken(data) {
  return {
    expiredIn: config.auth.jwtExpRefresh + new Date().getTime(),
    token: jwt.sign(
      {
        id: data.id,
        secret: data.jwtSecret
      },
      config.auth.jwtSecretRefreshUser,
      {
        expiresIn: Math.floor(config.auth.jwtExpRefresh / 1000)
      }
    )
  };
}

// Generate refresh token
function genJWTAccessToken(data) {
  return {
    expiredIn: config.auth.jwtExpAccess + new Date().getTime(),
    token: jwt.sign(
      {
        id: data.id,
        secret: data.jwtSecret
      },
      config.auth.jwtSecretAccessUser,
      {
        expiresIn: Math.floor(config.auth.jwtExpAccess / 1000)
      }
    )
  };
}

const onStart = () => {
  initAdminUserCreation();
  initPredefinedCategories();
};

module.exports = {
  getAllBusinessUsers,
  getAllUsers,
  deleteAdmin,
  updateAdmin,
  getAllAdmin,
  getAdminUser,
  onStart,
  initAdminUserCreation,
  getLoginAdmin,
  getAllOffers,
  getOfferById,
  deleteOfferById,
  updateOfferById,
  deleteReportById,
  deleteUserById,
  deleteBusinessUserById,
  updateUserById,
  updateBusinesUserById,
  getBusinessById,
  updateUserCountry,
  updateUserCategories,
  addUserTokenAndOperationSystem
};
