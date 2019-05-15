const request = require('supertest');
const app = require('../../index');
const queryString = require('query-string');

module.exports = {
  getById: ({ offerId, accessToken }) => request(app)
    .get(`/api/v1/offers/${offerId}`)
    .set('Authorization', `bearer ${accessToken}`),
  create: ({ accessToken, data, businessId }) => request(app)
    .post(`/api/v1/businesses/${businessId}/offers`)
    .set('Authorization', `bearer ${accessToken}`)
    .send(data),
  update: ({ offerId, data, accessToken }) => request(app)
    .put(`/api/v1/offers/${offerId}`)
    .set('Authorization', `bearer ${accessToken}`)
    .send(data),
  delete: ({ offerId, accessToken }) => request(app)
    .delete(`/api/v1/offers/${offerId}`)
    .set('Authorization', `bearer ${accessToken}`),
  list: ({ query }) => request(app)
    .get(`/api/v1/offers${query !== undefined ? `?${queryString.stringify(query)}` : ''}`)
};
