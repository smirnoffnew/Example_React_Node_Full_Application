const request = require('supertest');
const app = require('../../index');
const httpStatus = require('http-status');

module.exports = {
  getById: ({ accessToken, userId }) => request(app)
    .get(`/api/v1/business-users/${userId}`)
    .set('Authorization', `bearer ${accessToken}`),
  getInfo: accessToken => request(app)
    .get('/api/v1/auth/business-users/login')
    .set('Authorization', `bearer ${accessToken}`),
  updateToken: refreshToken => request(app)
    .get('/api/v1/auth/business-users/token')
    .set('Authorization', `bearer ${refreshToken}`),
  login: ({ email, password }) => request(app)
    .post('/api/v1/auth/business-users/login')
    .auth(email, password),
  create: data => request(app)
    .post('/api/v1/business-users')
    .send(data),
  checkAccessToken: accessToken => request(app)
    .get('/api/v1/auth/business-users/check-access')
    .set('Authorization', `bearer ${accessToken}`),
  checkRefreshToken: refreshToken => request(app)
    .get('/api/v1/auth/business-users/check-refresh')
    .set('Authorization', `bearer ${refreshToken}`),
  createOrLogin: data => request(app)
    .post('/api/v1/business-users')
    .send(data)
    .then((res) => {
      if (res.status !== httpStatus.OK) {
        return request(app)
          .post('/api/v1/auth/business-users/login')
          .auth(data.email, data.password);
      }
      return res;
    }),
  update: ({ userId, data, accessToken }) => request(app)
    .put(`/api/v1/business-users/${userId}`)
    .set('Authorization', `bearer ${accessToken}`)
    .send(data),
  delete: ({ userId, email, password }) => request(app)
    .delete(`/api/v1/business-users/${userId}`)
    .auth(email, password),
  updatePassword: ({
                     userId, data, email, password
                   }) => request(app)
    .put(`/api/v1/business-users/${userId}/password`)
    .auth(email, password)
    .send(data),
  updateEmail: ({
                  userId, data, email, password
                }) => request(app)
    .put(`/api/v1/business-users/${userId}/email`)
    .auth(email, password)
    .send(data),
  resetPasswordInit: email => request(app)
    .post('/api/v1/auth/business-users/reset-password')
    .send({ email }),
  resetPassword: ({ password, token }) => request(app)
    .put('/api/v1/auth/business-users/reset-password')
    .set('Authorization', `bearer ${token}`)
    .send({ password })
};
