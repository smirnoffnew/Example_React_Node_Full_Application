const httpStatus = require('http-status');
const path = require('path');
const chai = require('chai');
const reqs = require('../../tests/reqs/index');
const expects = require('../../tests/expects/index');
const mongoose = require('mongoose');
const {
  getUserData, getAdminData, getBusinessUserData, getBusinessData
} = require('../../tests/validData');
const testTools = require('../../tests/tools/index');
const testQueries = require('../../tests/queries/index');
const dbFiller = require('../../helpers/dbFiller/index');
const StorageFile = require('../storage/file.model');

const ObjectId = mongoose.Types.ObjectId;
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
    data: getAdminData(),
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
    path: path.join(__dirname, '../../tests/resources/image41kb.jpg'),
    url: null
  }
};

describe('## Business APIs', () => {
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
  before('upload image to storage', (done) => {
    reqs.storage
      .uploadImage({
        accessToken: env.businessUser.access,
        image: env.image.path
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
        env.image.url = res.body.url;
        done();
      })
      .catch(done);
  });
  after('delete uploaded image', (done) => {
    reqs.user.initAdmin()
      .then(() => reqs.user
        .login(env.adminUser.data))
      .then((res) => {
        expect(res.status)
          .to
          .be
          .eq(httpStatus.OK);
        testTools.parseAuthBody(res.body, env.adminUser);
        return reqs.storage.deleteImage({
          accessToken: env.adminUser.access,
          data: {
            url: env.image.url
          }
        });
      })
      .then((res) => {
        expect(res.status)
          .to
          .be
          .eq(httpStatus.OK);
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
  describe('# POST /api/v1/businesses', testCreation);
  describe('# PUT /api/v1/businesses/:id', testUpdate);
  describe('# DELETE /api/v1/businesses/:id', testDelete);
  describe('# GET /api/v1/businesses/:id', testGetById);
  describe('counting of images references', testImageReferences);
});

function testCreation() {
  afterEach('clear business DB', (done) => {
    dbFiller.clearBusinessDB()
      .then(() => done())
      .catch(done);
  });
  describe('valid data, different roles', () => {
    it('should return 403 ( use plain user )', (done) => {
      reqs.business.create({
        accessToken: env.user.access,
        data: getBusinessData()
      })
        .then((res) => {
          expect(res.status)
            .to
            .be
            .eq(httpStatus.FORBIDDEN);
          done();
        })
        .catch(done);
    });
    it('should create business ( use business-user )', (done) => {
      const businessData = getBusinessData();
      reqs.business.create({
        accessToken: env.businessUser.access,
        data: businessData
      })
        .then((res) => {
          expect(res.status)
            .to
            .be
            .eq(httpStatus.OK);
          expects.business.expectEntity(res.body, businessData);
          done();
        })
        .catch(done);
    });
    it('should return 400, create second business ( use business-user )', (done) => {
      const businessData = getBusinessData();
      reqs.business.create({
        accessToken: env.businessUser.access,
        data: businessData
      })
        .then((res) => {
          expect(res.status)
            .to
            .be
            .eq(httpStatus.OK);
          return reqs.business.create({
            accessToken: env.businessUser.access,
            data: businessData
          });
        })
        .then((res) => {
          expect(res.status)
            .to
            .be
            .eq(httpStatus.BAD_REQUEST);
          expect(res.body.message)
            .to
            .be
            .eq('You have already created 1 businesses and cannot create a new one');
          done();
        })
        .catch(done);
    });
    it('should create business ( use business-user & create logoUrl )', () => {
      const businessData = getBusinessData(env.image.url);
      return reqs.business.create({
        accessToken: env.businessUser.access,
        data: businessData
      })
        .then((res) => {
          expect(res.status)
            .to
            .be
            .eq(httpStatus.OK);
          expects.business.expectEntity(res.body, businessData);
        });
    });
  });
  describe('check each property separately', () => {
    const runTestCaseCreation = (testCase, done) => reqs.business
      .create({
        data: {
          ...getBusinessData(),
          ...testCase.data,
        },
        accessToken: env.businessUser.access
      })
      .then((res) => {
        expect(res.status)
          .to
          .be
          .eq(testCase.expectedCode);
        done();
      });
    testTools.runTestCases({
      testData: testQueries.business.testSuitsForCreation,
      makeReq: runTestCaseCreation
    });
  });
}

function testUpdate() {
  let createdBusiness = null;
  const businessData = getBusinessData();
  after('clear business DB', (done) => {
    dbFiller.clearBusinessDB()
      .then(() => done())
      .catch(done);
  });
  before('create new business', (done) => {
    reqs.business.create({
      accessToken: env.businessUser.access,
      data: businessData
    })
      .then((res) => {
        expect(res.status)
          .to
          .be
          .eq(httpStatus.OK);
        createdBusiness = res.body;
        done();
      })
      .catch(done);
  });
  describe('valid data, different roles', () => {
    it('should return 403 ( use plain user )', (done) => {
      reqs.business.update({
        accessToken: env.user.access,
        data: { brandName: 'New name' },
        businessId: createdBusiness.id
      })
        .then((res) => {
          expect(res.status)
            .to
            .be
            .eq(httpStatus.FORBIDDEN);
          done();
        })
        .catch(done);
    });
    it('should update business ( use business-user owner of business )', (done) => {
      const newData = { brandName: 'New name' };
      reqs.business.update({
        accessToken: env.businessUser.access,
        data: newData,
        businessId: createdBusiness.id
      })
        .then((res) => {
          expect(res.status)
            .to
            .be
            .eq(httpStatus.OK);
          expects.business.expectEntityUpdated(res.body, newData);
          done();
        })
        .catch(done);
    });
    it('should return 403, ( use another business-user )', (done) => {
      const newData = { brandName: 'New name' };
      reqs.businessUser
        .create(getBusinessUserData())
        .then((res) => {
          expect(res.status)
            .to
            .be
            .eq(httpStatus.OK);
          const { access } = testTools.parseAuthBody(res.body);
          return reqs.business.update({
            accessToken: access,
            data: newData,
            businessId: createdBusiness.id
          });
        })
        .then((res) => {
          expect(res.status)
            .to
            .be
            .eq(httpStatus.FORBIDDEN);
          done();
        })
        .catch(done);
    });
  });
  describe('use different businessId', () => {
    const newData = { brandName: 'Aezakmi' };
    it('should return 404 no such business', (done) => {
      reqs.business.update({
        accessToken: env.businessUser.access,
        data: newData,
        businessId: ObjectId()
      })
        .then((res) => {
          expect(res.status)
            .to
            .be
            .eq(httpStatus.NOT_FOUND);
          done();
        })
        .catch(done);
    });
    it('should return 400 use not a ObjectId', (done) => {
      reqs.business.update({
        accessToken: env.businessUser.access,
        data: newData,
        businessId: 'invalid'
      })
        .then((res) => {
          expect(res.status)
            .to
            .be
            .eq(httpStatus.BAD_REQUEST);
          done();
        })
        .catch(done);
    });
  });
  describe('check each property separately', () => {
    const runTestCaseUpdate = (testCase, done) => reqs.business
      .update({
        businessId: createdBusiness.id,
        data: {
          ...testCase.data,
        },
        accessToken: env.businessUser.access
      })
      .then((res) => {
        expect(res.status)
          .to
          .be
          .eq(testCase.expectedCode);
        done();
      });
    testTools.runTestCases({
      testData: testQueries.business.testSuitsForCreation,
      makeReq: runTestCaseUpdate
    });
  });
}

function testDelete() {
  let createdBusiness = null;
  const businessData = getBusinessData();
  beforeEach('create new business', (done) => {
    reqs.business.create({
      accessToken: env.businessUser.access,
      data: businessData
    })
      .then((res) => {
        expect(res.status)
          .to
          .be
          .eq(httpStatus.OK);
        createdBusiness = res.body;
        done();
      })
      .catch(done);
  });
  afterEach('delete all created businesses', (done) => {
    dbFiller.clearBusinessDB()
      .then(() => done())
      .catch(done);
  });
  describe('valid id, different roles', () => {
    it('should return 403 ( use plain user )', (done) => {
      reqs.business.delete({
        accessToken: env.user.access,
        businessId: createdBusiness.id
      })
        .then((res) => {
          expect(res.status)
            .to
            .be
            .eq(httpStatus.FORBIDDEN);
          done();
        })
        .catch(done);
    });
    it('should delete business ( use business-user owner of business )', (done) => {
      reqs.business.delete({
        accessToken: env.businessUser.access,
        businessId: createdBusiness.id
      })
        .then((res) => {
          expect(res.status)
            .to
            .be
            .eq(httpStatus.OK);
          done();
        })
        .catch(done);
    });
    it('should return 403 ( use another business-user )', (done) => {
      reqs.businessUser
        .create(getBusinessUserData())
        .then((res) => {
          expect(res.status)
            .to
            .be
            .eq(httpStatus.OK);
          const { access } = testTools.parseAuthBody(res.body);
          return reqs.business.delete({
            accessToken: access,
            businessId: createdBusiness.id
          });
        })
        .then((res) => {
          expect(res.status)
            .to
            .be
            .eq(httpStatus.FORBIDDEN);
          done();
        })
        .catch(done);
    });
    it('should delete business ( use admin user )', (done) => {
      reqs.business.delete({
        accessToken: env.adminUser.access,
        businessId: createdBusiness.id
      })
        .then((res) => {
          expect(res.status)
            .to
            .be
            .eq(httpStatus.OK);
          done();
        })
        .catch(done);
    });
  });
  describe('use different businessId', () => {
    it('should return 404 no such business', (done) => {
      reqs.business.delete({
        accessToken: env.businessUser.access,
        businessId: ObjectId()
      })
        .then((res) => {
          expect(res.status)
            .to
            .be
            .eq(httpStatus.NOT_FOUND);
          done();
        })
        .catch(done);
    });
    it('should return 400 use not a ObjectId', (done) => {
      reqs.business.delete({
        accessToken: env.businessUser.access,
        businessId: 'invalid'
      })
        .then((res) => {
          expect(res.status)
            .to
            .be
            .eq(httpStatus.BAD_REQUEST);
          done();
        })
        .catch(done);
    });
  });
  it('should return 404, on get by id deleted business', (done) => {
    reqs.business.delete({
      accessToken: env.businessUser.access,
      businessId: createdBusiness.id
    })
      .then((res) => {
        expect(res.status)
          .to
          .be
          .eq(httpStatus.OK);
        expects.business.expectEntity(res.body, createdBusiness);
        return reqs.business.getById({ businessId: createdBusiness.id });
      })
      .then((res) => {
        expect(res.status)
          .to
          .be
          .eq(httpStatus.NOT_FOUND);
        done();
      })
      .catch(done);
  });
}

function testGetById() {
  let createdBusiness = null;
  const businessData = getBusinessData();
  after('clear business DB', (done) => {
    dbFiller.clearBusinessDB()
      .then(() => done())
      .catch(done);
  });
  before('create new business', (done) => {
    reqs.business.create({
      accessToken: env.businessUser.access,
      data: businessData
    })
      .then((res) => {
        expect(res.status)
          .to
          .be
          .eq(httpStatus.OK);
        createdBusiness = res.body;
        done();
      })
      .catch(done);
  });
  describe('valid id, different roles', () => {
    it('should return business ( use plain user )', (done) => {
      reqs.business.getById({
        accessToken: env.user.access,
        businessId: createdBusiness.id
      })
        .then((res) => {
          expect(res.status)
            .to
            .be
            .eq(httpStatus.OK);
          expects.business.expectEntity(res.body, createdBusiness);
          done();
        })
        .catch(done);
    });
    it('should return business ( use business-user owner of business )', (done) => {
      reqs.business.getById({
        accessToken: env.businessUser.access,
        businessId: createdBusiness.id
      })
        .then((res) => {
          expect(res.status)
            .to
            .be
            .eq(httpStatus.OK);
          expects.business.expectEntity(res.body, createdBusiness);
          done();
        })
        .catch(done);
    });
    it('should return business, ( use another business-user )', (done) => {
      reqs.businessUser
        .create(getBusinessUserData())
        .then((res) => {
          expect(res.status)
            .to
            .be
            .eq(httpStatus.OK);
          const { access } = testTools.parseAuthBody(res.body);
          return reqs.business.getById({
            accessToken: access,
            businessId: createdBusiness.id
          });
        })
        .then((res) => {
          expect(res.status)
            .to
            .be
            .eq(httpStatus.OK);
          expects.business.expectEntity(res.body, createdBusiness);
          done();
        })
        .catch(done);
    });
    it('should delete business ( use admin user )', (done) => {
      reqs.business.getById({
        accessToken: env.adminUser.access,
        businessId: createdBusiness.id
      })
        .then((res) => {
          expect(res.status)
            .to
            .be
            .eq(httpStatus.OK);
          expects.business.expectEntity(res.body, createdBusiness);
          done();
        })
        .catch(done);
    });
  });
  describe('use different businessId', () => {
    it('should return 404 no such business', (done) => {
      reqs.business.getById({
        accessToken: env.businessUser.access,
        businessId: ObjectId()
      })
        .then((res) => {
          expect(res.status)
            .to
            .be
            .eq(httpStatus.NOT_FOUND);
          done();
        })
        .catch(done);
    });
    it('should return 400 use not a ObjectId', (done) => {
      reqs.business.getById({
        accessToken: env.businessUser.access,
        businessId: 'invalid'
      })
        .then((res) => {
          expect(res.status)
            .to
            .be
            .eq(httpStatus.BAD_REQUEST);
          done();
        })
        .catch(done);
    });
  });
}

function testImageReferences() {
  let fileReferenceBefore = null;
  beforeEach('load reference to file', async () => {
    fileReferenceBefore = await StorageFile.getByUrl(env.image.url);
  });
  describe('on create', () => {
    after('clear business DB', (done) => {
      dbFiller.clearBusinessDB()
        .then(() => done())
        .catch(done);
    });
    it('should increase reference counter ( send logoUrl )', async () => {
      const businessData = getBusinessData(env.image.url);
      const res = await reqs.business.create({
        accessToken: env.businessUser.access,
        data: businessData
      });
      expect(res.status)
        .to
        .be
        .eq(httpStatus.OK);
      const fileReferenceAfter = await StorageFile.getByUrl(env.image.url);
      expect(fileReferenceAfter.referencesCount - fileReferenceBefore.referencesCount)
        .to
        .be
        .eq(1);
    });
  });
  describe('on update', () => {
    let createdBusiness = null;
    before('clear business DB', (done) => {
      dbFiller.clearBusinessDB()
        .then(() => done())
        .catch(done);
    });
    before('create new business with logoUrl', async () => {
      const businessData = getBusinessData(env.image.url);
      const res = await reqs.business.create({
        accessToken: env.businessUser.access,
        data: businessData
      });
      expect(res.status)
        .to
        .be
        .eq(httpStatus.OK);
      createdBusiness = res.body;
    });
    beforeEach('add logoUrl to business', async () => {
      const res = await reqs.business.update({
        accessToken: env.businessUser.access,
        data: { logoUrl: env.image.url },
        businessId: createdBusiness.id
      });
      expect(res.status)
        .to
        .be
        .eq(httpStatus.OK);
    });
    it('should not change reference counter ( send old logoUrl )', async () => {
      const newData = { logoUrl: env.image.url };
      const res = await reqs.business.update({
        accessToken: env.businessUser.access,
        data: newData,
        businessId: createdBusiness.id
      });
      expect(res.status)
        .to
        .be
        .eq(httpStatus.OK);
      const fileReferenceAfter = await StorageFile.getByUrl(env.image.url);
      expect(fileReferenceAfter.referencesCount)
        .to
        .be
        .eq(fileReferenceBefore.referencesCount);
    });
    it('should decrease reference counter ( send empty logoUrl )', async () => {
      const newData = { logoUrl: '' };
      const res = await reqs.business.update({
        accessToken: env.businessUser.access,
        data: newData,
        businessId: createdBusiness.id
      });
      expect(res.status)
        .to
        .be
        .eq(httpStatus.OK);
      const fileReferenceAfter = await StorageFile.getByUrl(env.image.url);
      expect(fileReferenceBefore.referencesCount - fileReferenceAfter.referencesCount)
        .to
        .be
        .eq(1);
    });
    it('should increase reference counter ( send new logoUrl )', async () => {
      const newData = { logoUrl: env.image.url };
      await reqs.business.update({
        accessToken: env.businessUser.access,
        data: { logoUrl: '' },
        businessId: createdBusiness.id
      });
      const res = await reqs.business.update({
        accessToken: env.businessUser.access,
        data: newData,
        businessId: createdBusiness.id
      });
      expect(res.status)
        .to
        .be
        .eq(httpStatus.OK);
      const fileReferenceAfter = await StorageFile.getByUrl(env.image.url);
      expect(fileReferenceAfter.referencesCount - fileReferenceBefore.referencesCount)
        .to
        .be
        .eq(1);
    });
  });
  describe('on delete', () => {
    let createdBusiness = null;
    before('clear business DB', (done) => {
      dbFiller.clearBusinessDB()
        .then(() => done())
        .catch(done);
    });
    before('create new business with logoUrl', async () => {
      const businessData = getBusinessData(env.image.url);
      const res = await reqs.business.create({
        accessToken: env.businessUser.access,
        data: businessData
      });
      expect(res.status)
        .to
        .be
        .eq(httpStatus.OK);
      createdBusiness = res.body;
    });
    it('should decrease reference counter', async () => {
      const res = await reqs.business.delete({
        accessToken: env.businessUser.access,
        businessId: createdBusiness.id
      });
      expect(res.status)
        .to
        .be
        .eq(httpStatus.OK);
      const fileReferenceAfter = await StorageFile.getByUrl(env.image.url);
      expect(fileReferenceBefore.referencesCount - fileReferenceAfter.referencesCount)
        .to
        .be
        .eq(1);
    });
  });
}
