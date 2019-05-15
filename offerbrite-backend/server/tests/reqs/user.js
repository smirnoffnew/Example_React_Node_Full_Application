const request = require('supertest');
const app = require('../../index');
const httpStatus = require('http-status');

module.exports = {
  initAdmin: () => request(app)
    .post('/api/v1/users/admin'),
  getById: ({ accessToken, userId }) => request(app)
    .get(`/api/v1/users/${userId}`)
    .set('Authorization', `bearer ${accessToken}`),
  getInfo: accessToken => request(app)
    .get('/api/v1/auth/login')
    .set('Authorization', `bearer ${accessToken}`),
  updateToken: refreshToken => request(app)
    .get('/api/v1/auth/token')
    .set('Authorization', `bearer ${refreshToken}`),
  login: ({ email, password }) => request(app)
    .post('/api/v1/auth/login')
    .auth(email, password),
  create: data => request(app)
    .post('/api/v1/users')
    .send(data),
  checkAccessToken: accessToken => request(app)
    .get('/api/v1/auth/check-access')
    .set('Authorization', `bearer ${accessToken}`),
  checkRefreshToken: refreshToken => request(app)
    .get('/api/v1/auth/check-refresh')
    .set('Authorization', `bearer ${refreshToken}`),
  createOrLogin: data => request(app)
    .post('/api/v1/users')
    .send(data)
    .then((res) => {
      if (res.status !== httpStatus.OK) {
        return request(app)
          .post('/api/v1/auth/login')
          .auth(data.email, data.password);
      }
      return res;
    }),
  update: ({ userId, data, accessToken }) => request(app)
    .put(`/api/v1/users/${userId}`)
    .set('Authorization', `bearer ${accessToken}`)
    .send(data),
  delete: ({ userId, email, password }) => request(app)
    .delete(`/api/v1/users/${userId}`)
    .auth(email, password),
  updatePassword: ({
                     userId, data, email, password
                   }) => request(app)
    .put(`/api/v1/users/${userId}/password`)
    .auth(email, password)
    .send(data),
  updateEmail: ({
                  userId, data, email, password
                }) => request(app)
    .put(`/api/v1/users/${userId}/email`)
    .auth(email, password)
    .send(data),
  resetPasswordInit: email => request(app)
    .post('/api/v1/auth/reset-password')
    .send({ email }),
  resetPassword: ({ password, token }) => request(app)
    .put('/api/v1/auth/reset-password')
    .set('Authorization', `bearer ${token}`)
    .send({ password })
};
