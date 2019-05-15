const request = require('supertest');
const app = require('../../index');
const queryString = require('query-string');

module.exports = {
  create: ({ accessToken, offerId, userId }) => request(app)
    .post(`/api/v1/users/${userId}/favourite-offers/${offerId}`)
    .set('Authorization', `bearer ${accessToken}`),
  delete: ({ accessToken, offerId, userId }) => request(app)
    .delete(`/api/v1/users/${userId}/favourite-offers/${offerId}`)
    .set('Authorization', `bearer ${accessToken}`),
  list: ({
           accessToken, userId, query = {}
         }) => request(app)
    .get(`/api/v1/users/${userId}/favourite-offers?${queryString.stringify(query)}`)
    .set('Authorization', `bearer ${accessToken}`),
};
