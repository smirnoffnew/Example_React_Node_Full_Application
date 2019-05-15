const request = require('supertest');
const app = require('../../index');
const queryString = require('query-string');

module.exports = {
  getById: ({ businessId, accessToken }) => request(app)
    .get(`/api/v1/businesses/${businessId}`)
    .set('Authorization', `bearer ${accessToken}`),
  create: ({ accessToken, data }) => request(app)
    .post('/api/v1/businesses')
    .set('Authorization', `bearer ${accessToken}`)
    .send(data),
  update: ({ businessId, data, accessToken }) => request(app)
    .put(`/api/v1/businesses/${businessId}`)
    .set('Authorization', `bearer ${accessToken}`)
    .send(data),
  delete: ({ businessId, accessToken }) => request(app)
    .delete(`/api/v1/businesses/${businessId}`)
    .set('Authorization', `bearer ${accessToken}`),
  list: ({ query = {} }) => request(app)
    .get(`/api/v1/businesses?${queryString.stringify(query)}`)
};
