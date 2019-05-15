const request = require('supertest');
const app = require('../../index');
const queryString = require('query-string');


module.exports = {
  uploadImage: ({ accessToken, image }) => request(app)
    .post('/api/v1/storage/image')
    .set('Authorization', `bearer ${accessToken}`)
    .attach('image', image),
  deleteImage: ({ accessToken, data }) => request(app)
    .delete('/api/v1/storage/image')
    .set('Authorization', `bearer ${accessToken}`)
    .send(data),
  list: ({ query = {}, accessToken }) => request(app)
    .get(`/api/v1/storage/image?${queryString.stringify(query)}`)
    .set('Authorization', `bearer ${accessToken}`)
};
