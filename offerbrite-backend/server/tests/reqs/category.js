const request = require('supertest');
const app = require('../../index');
const queryString = require('query-string');

module.exports = {
  getById: ({ accessToken, categoryId }) => request(app)
    .get(`/api/v1/categories/${categoryId}`)
    .set('Authorization', `bearer ${accessToken}`),
  create: ({ accessToken, data }) => request(app)
    .post('/api/v1/categories')
    .set('Authorization', `bearer ${accessToken}`)
    .send(data),
  update: ({ categoryId, data, accessToken }) => request(app)
    .put(`/api/v1/categories/${categoryId}`)
    .set('Authorization', `bearer ${accessToken}`)
    .send(data),
  delete: ({ categoryId, accessToken }) => request(app)
    .delete(`/api/v1/categories/${categoryId}`)
    .set('Authorization', `bearer ${accessToken}`),
  list: ({ query = {} }) => request(app)
    .get(`/api/v1/categories?${queryString.stringify(query)}`)
};
