const Reports = require('../../modules/reports/reports.model');
const User = require('../../modules/user/user.model');
const Offer = require('../../modules/offer/offer.model');

const newRoports = data => new Reports({
  userID: data.authUser.id,
  reason: data.body.reason,
  // title: data.body.title,
  // description: data.body.description,
  offerId: data.body.offerId
});
// { limit: data.query.limit, skip: data.query.skip}
const getReports = (data) => {
  if (data.authUser.role === 'admin' || data.authUser.role === 'super-admin') {
    return Reports.find({}).limit(+data.query.limit).skip(+data.query.skip)
      .then(resReport => Promise.all(
        resReport.map(item => User.findById(item.userID)
          .then(resUser => ({ user: resUser, reports: item })))
      ))
      .then(res => Promise.all(
        res.map(item => Offer.findById(item.reports.offerId)
          .then(resOffer => ({ offer: resOffer, reports: item.reports, user: item.user })))
      ));
  }
  return false;
};
const createdReports = data => newRoports(data).save();

module.exports = {
  createdReports,
  getReports
};
