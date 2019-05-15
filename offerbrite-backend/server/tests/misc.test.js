const request = require('supertest');
const httpStatus = require('http-status');
const chai = require('chai'); // eslint-disable-line import/newline-after-import
const expect = chai.expect;
const app = require('../index');
const ObjectId = require('mongoose').Types.ObjectId;

chai.config.includeStack = true;

describe('## Misc', () => {
  describe('# GET /api/health-check', () => {
    it('should return OK', (done) => {
      request(app)
        .get('/api/v1/health-check')
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.status)
            .to
            .equal('OK');
          done();
        })
        .catch(done);
    });
  });
  describe('# GET /', () => {
    it('should return 200 and SPA page', (done) => {
      request(app)
        .get('/')
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.text)
            .to
            .be
            .a('string');
          expect(res.type)
            .to
            .be
            .eq('text/html');
          done();
        })
        .catch(done);
    });
  });
  describe('# GET /api/users/:new-id', () => {
    it('should return 404 status', (done) => {
      request(app)
        .get(`/api/v1/users/${ObjectId()}`)
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.message)
            .to
            .equal('No such user exists');
          done();
        })
        .catch(done);
    });
  });

  describe('# Error Handling', () => {
    it('should handle mongoose CastError - Cast to ObjectId failed', (done) => {
      request(app)
        .get('/api/v1/users/56z787zzz67fc')
        .expect(httpStatus.BAD_REQUEST)
        .then(() => done())
        .catch(done);
    });

    it('should handle express validation error - some fields is required', (done) => {
      request(app)
        .post('/api/v1/users')
        .send({})
        .expect(httpStatus.BAD_REQUEST)
        .then(() => done())
        .catch(done);
    });
  });
});
