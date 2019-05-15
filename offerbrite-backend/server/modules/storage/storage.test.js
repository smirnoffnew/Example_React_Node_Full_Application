const httpStatus = require('http-status');
const chai = require('chai');
const reqs = require('../../tests/reqs/index');
const mongoose = require('mongoose');
const { getUserData, getBusinessUserData } = require('../../tests/validData');
const testTools = require('../../tests/tools/index');
const path = require('path');
const rp = require('request-promise');
const config = require('../../../config/index');
const StorageFile = require('./file.model');
const expects = require('../../tests/expects/index');
const _ = require('lodash');
const dbFiller = require('../../helpers/dbFiller/index');

const expect = chai.expect;
chai.config.includeStack = true;

after((done) => {
  mongoose.models = {};
  mongoose.modelSchemas = {};
  mongoose.connection.close();
  done();
});

const env = {
  adminUser: {
    data: config.auth.admin,
    account: null,
    access: null,
    refresh: null
  },
  businessUser: {
    data: getBusinessUserData(),
    account: null,
    access: null,
    refresh: null
  },
  user: {
    data: getUserData(),
    account: null,
    access: null,
    refresh: null
  },
  image: {
    paths: {
      small:
        path.join(__dirname, '../../tests/resources/image41kb.jpg'),
      big: path.join(__dirname, '../../tests/resources/image62kb.jpg'),
      invalid: path.join(__dirname, '../../tests/resources/notAnImage.png'),
    }
  }
};
describe('## Storage APIs', () => {
  before('clean DB', testTools.cleanup);
  after('clean DB', testTools.cleanup);
  before('create user', (done) => {
    reqs.user
      .create(env.user.data)
      .then((res) => {
        expect(res.status)
          .to
          .be
          .eq(httpStatus.OK);
        testTools.parseAuthBody(res.body, env.user);
        done();
      })
      .catch(done);
  });
  before('create business user', (done) => {
    reqs.businessUser
      .create(env.businessUser.data)
      .then((res) => {
        expect(res.status)
          .to
          .be
          .eq(httpStatus.OK);
        testTools.parseAuthBody(res.body, env.businessUser);
        done();
      })
      .catch(done);
  });
  beforeEach('login admin user', (done) => {
    reqs.user.initAdmin()
      .then(() => reqs.user
        .login(env.adminUser.data))
      .then((res) => {
        expect(res.status)
          .to
          .be
          .eq(httpStatus.OK);
        testTools.parseAuthBody(res.body, env.adminUser);
        done();
      })
      .catch(done);
  });
  beforeEach('login business user', (done) => {
    reqs.businessUser
      .login(env.businessUser.data)
      .then((res) => {
        expect(res.status)
          .to
          .be
          .eq(httpStatus.OK);
        testTools.parseAuthBody(res.body, env.businessUser);
        done();
      })
      .catch(done);
  });
  beforeEach('login user', (done) => {
    reqs.user
      .login(env.user.data)
      .then((res) => {
        expect(res.status)
          .to
          .be
          .eq(httpStatus.OK);
        testTools.parseAuthBody(res.body, env.user);
        done();
      })
      .catch(done);
  });
  describe('# POST /api/v1/storage/image', testUploadImage);
  describe('# DELETE /api/v1/storage/image', testDeleteImage);
  describe('# GET /api/v1/storage/image', testListImages);
});

function testDeleteImage() {
  let imageUrl = '';
  beforeEach('upload image', () => reqs.storage
    .uploadImage({
      accessToken: env.businessUser.access,
      image: env.image.paths.small
    })
    .then((res) => {
      expect(res.status)
        .to
        .be
        .eq(httpStatus.OK);
      imageUrl = res.body.url;
    }));
  it('should remove image, use valid URL', () => reqs.storage.deleteImage({
    accessToken: env.adminUser.access,
    data: {
      url: imageUrl
    }
  })
    .then((res) => {
      expect(res.status)
        .to
        .be
        .eq(httpStatus.OK);
    })
    .catch(_.noop)
    .then(() => rp(imageUrl))
    .then(() => {
      throw new Error('Should not return this image, it must be deleted');
    })
    .catch(_.noop));
  it('should remove image, use valid URL', () => reqs.storage.deleteImage({
    accessToken: env.adminUser.access,
    data: {
      url: imageUrl
    }
  })
    .then((res) => {
      expect(res.status)
        .to
        .be
        .eq(httpStatus.OK);
      return StorageFile.getByUrl(imageUrl);
    })
    .catch((err) => {
      expect(err.status)
        .to
        .be
        .eq(httpStatus.NOT_FOUND);
    }));
}

function testUploadImage() {
  describe('invalid image', () => {
    [{
      description: 'image is not attached',
      status: httpStatus.BAD_REQUEST,
      data: {
        image: () => '',
        accessToken: () => env.businessUser.access
      }
    },
      {
        description: 'not an image',
        status: httpStatus.BAD_REQUEST,
        data: {
          image: env.image.paths.invalid,
          accessToken: () => env.businessUser.access
        }
      }].forEach(runTestCaseUploadImage);
  });
  describe('invalid user', () => {
    [
      {
        description: 'use plain user instead of business user',
        status: httpStatus.FORBIDDEN,
        data: {
          image: env.image.paths.small,
          accessToken: () => env.user.access
        }
      }].forEach(runTestCaseUploadImage);
  });
  describe('valid image', () => {
    it('should return valid URL to uploaded image', (done) => {
      reqs.storage
        .uploadImage({
          accessToken: env.businessUser.access,
          image: env.image.paths.small
        })
        .then((res) => {
          expect(res.status)
            .to
            .be
            .eq(httpStatus.OK);
          expect(res.body.url)
            .to
            .be
            .a('string');
          return rp(res.body.url);
        })
        .then((res) => {
          expect(res)
            .to
            .be
            .a('string');
          done();
        })
        .catch(done);
    });
    it('should create record at db', (done) => {
      reqs.storage
        .uploadImage({
          accessToken: env.businessUser.access,
          image: env.image.paths.small
        })
        .then((res) => {
          expect(res.status)
            .to
            .be
            .eq(httpStatus.OK);
          return StorageFile.getByUrl(res.body.url);
        })
        .then((doc) => {
          expects.storageFile.expectEntity(doc.toJSON());
          done();
        })
        .catch(done);
    });
  });
}

function runTestCaseUploadImage(testCase) {
  it(`should return ${testCase.status} ( ${testCase.description} )`, (done) => {
    reqs.storage
      .uploadImage(testTools.compile(testCase.data))
      .then((res) => {
        expect(res.status)
          .to
          .be
          .eq(testCase.status);
        done();
      })
      .catch(done);
  });
}


function uploadImage() {
  return reqs.storage
    .uploadImage({
      accessToken: env.businessUser.access,
      image: env.image.paths.small
    });
}

function deleteImageByUrl(url) {
  return reqs.storage.deleteImage({
    accessToken: env.adminUser.access,
    data: {
      url
    }
  });
}

function testListImages() {
  const NUMBER_OF_IMAGES = 5;
  const imagesUrls = [];
  before('clear storage DB', () => dbFiller.clearStorageFileDB());
  before('upload images', () => Promise.all(Array.from({ length: NUMBER_OF_IMAGES }, uploadImage))
    .then((ress) => {
      ress.forEach((res) => {
        expect(res.status)
          .to
          .be
          .eq(httpStatus.OK);
        imagesUrls.push(res.body.url);
      });
    }));
  after('delete images', () => Promise.all(imagesUrls.map(deleteImageByUrl))
    .then((ress) => {
      ress.forEach((res) => {
        expect(res.status)
          .to
          .be
          .eq(httpStatus.OK);
        imagesUrls.push(res.body.url);
      });
    }));
  it('should return all uploaded images', () => reqs.storage.list({ accessToken: env.adminUser.access })
    .then((res) => {
      expect(res.status)
        .to
        .be
        .eq(httpStatus.OK);
      expects.expectPaginatedBody({
        body: res.body,
        testForItems: expects.storageFile.expectEntity,
        query: {},
        total: NUMBER_OF_IMAGES
      });
    }));
  it('should return 403 use plain user', () => reqs.storage.list({ accessToken: env.user.access })
    .then((res) => {
      expect(res.status)
        .to
        .be
        .eq(httpStatus.FORBIDDEN);
    }));
  it('should return 403 use business user', () => reqs.storage.list({ accessToken: env.businessUser.access })
    .then((res) => {
      expect(res.status)
        .to
        .be
        .eq(httpStatus.FORBIDDEN);
    }));
}
