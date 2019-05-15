const httpStatus = require('http-status');
const chai = require('chai');
const reqs = require('../../tests/reqs/index');
const expects = require('../../tests/expects/index');
const mongoose = require('mongoose');
const {
  getUserData, getAdminData, getBusinessUserData, getCategoryData
} = require('../../tests/validData');
const testTools = require('../../tests/tools/index');
const testQueries = require('../../tests/queries/index');
const dbFiller = require('../../helpers/dbFiller/index');

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
  category: {
    data: getCategoryData(),
    entity: null,
  }
};

describe('## Category APIs', () => {
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
  beforeEach(() => {
    env.category.data = getCategoryData();
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
  describe('# POST /api/v1/categories', testCreation);
  describe('# PUT /api/v1/categories/:id', testUpdate);
  describe('# GET /api/v1/categories/:id', testGetById);
  describe('# GET /api/v1/categories/', testList);
  describe('# DELETE /api/v1/categories/:id', testDelete);
});

function testCreation() {
  beforeEach('clear categories DB', (done) => {
    dbFiller.clearCategoryDB()
      .then(() => done())
      .catch(done);
  });
  describe('valid data', () => {
    it('should create a new category (valid info)', (done) => {
      reqs.category
        .create({
          accessToken: env.adminUser.access,
          data: env.category.data
        })
        .then((res) => {
          expect(res.status)
            .to
            .be
            .eq(httpStatus.OK);
          expects.category.expectEntity(res.body);
          done();
        })
        .catch(done);
    });
    it('should return 400, ( used name ) ', (done) => {
      reqs.category
        .create({
          accessToken: env.adminUser.access,
          data: env.category.data
        })
        .then(() => reqs.category
          .create({
            accessToken: env.adminUser.access,
            data: env.category.data
          }))
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
  describe('invalid access', () => {
    it('should return 403, ( use plain user account )', (done) => {
      reqs.category
        .create({
          accessToken: env.user.access,
          data: env.category.data
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
    it('should return 403, ( use plain business user )', (done) => {
      reqs.category
        .create({
          accessToken: env.businessUser.access,
          data: env.category.data
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
  const runTestCaseCreation = (testCase, done) => reqs.category
    .create({
      data: {
        ...env.category.data,
        ...testCase.data,
      },
      accessToken: env.adminUser.access
    })
    .then((res) => {
      expect(res.status)
        .to
        .be
        .eq(testCase.expectedCode);
      done();
    });
  testTools.runTestCases({
    testData: testQueries.category.testSuitsForCreation,
    makeReq: runTestCaseCreation
  });
}

function testUpdate() {
  beforeEach('create category', (done) => {
    reqs.category
      .create({
        accessToken: env.adminUser.access,
        data: env.category.data
      })
      .then((res) => {
        expect(res.status)
          .to
          .be
          .eq(httpStatus.OK);
        env.category.entity = res.body;
        done();
      })
      .catch(done);
  });
  afterEach('clear categories DB', (done) => {
    dbFiller.clearCategoryDB()
      .then(() => done())
      .catch(done);
  });
  describe('invalid id', () => {
    it('should return 404 ( new id )', (done) => {
      reqs.category
        .update({
          categoryId: ObjectId(),
          accessToken: env.adminUser.access
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
    it('should return 400 ( invalid id )', (done) => {
      reqs.user
        .update({
          categoryId: 'not-an-id',
          accessToken: env.adminUser.access
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
  describe('invalid access', () => {
    it('should return 403 ( use plain business user )', (done) => {
      reqs.category
        .update({
          categoryId: env.category.entity.id,
          accessToken: env.businessUser.access
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
    it('should return 403 ( use plain user )', (done) => {
      reqs.category
        .update({
          categoryId: env.category.entity.id,
          accessToken: env.user.access
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
  describe('test each property', () => {
    const runTestCaseUpdate = (tc, done) => reqs.category
      .update({
        categoryId: env.category.entity.id,
        data: tc.data,
        accessToken: env.adminUser.access
      })
      .then((res) => {
        expect(res.status)
          .to
          .be
          .eq(tc.expectedCode);
        if (tc.expectedCode === httpStatus.OK) {
          expects.category.expectEntityUpdated(res.body, tc.data);
        }
        done();
      });
    testTools.runTestCases({
      testData: testQueries.category.testSuitsForUpdating,
      makeReq: runTestCaseUpdate
    });
  });
}

function testGetById() {
  before('create category', (done) => {
    reqs.category
      .create({
        accessToken: env.adminUser.access,
        data: env.category.data
      })
      .then((res) => {
        expect(res.status)
          .to
          .be
          .eq(httpStatus.OK);
        env.category.entity = res.body;
        done();
      })
      .catch(done);
  });
  after('clear categories DB', (done) => {
    dbFiller.clearCategoryDB()
      .then(() => done())
      .catch(done);
  });
  it('should return category (valid id and no auth) ', (done) => {
    reqs.category
      .getById({
        categoryId: env.category.entity.id,
      })
      .then((res) => {
        expect(res.status)
          .to
          .be
          .eq(httpStatus.OK);
        expects.category.expectEntity(res.body);
        done();
      })
      .catch(done);
  });
  describe('invalid id', () => {
    it('should return 404 ( new id )', (done) => {
      reqs.category
        .getById({
          categoryId: ObjectId(),
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
    it('should return 400 ( invalid id )', (done) => {
      reqs.category
        .getById({
          userId: 'not-an-id',
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

function testDelete() {
  beforeEach('create category', (done) => {
    reqs.category
      .create({
        accessToken: env.adminUser.access,
        data: env.category.data
      })
      .then((res) => {
        expect(res.status)
          .to
          .be
          .eq(httpStatus.OK);
        env.category.entity = res.body;
        done();
      })
      .catch(done);
  });
  after('clear categories DB', (done) => {
    dbFiller.clearCategoryDB()
      .then(() => done())
      .catch(done);
  });
  it('should return 200 and deleted category (valid id & auth)', (done) => {
    reqs.category
      .delete({
        categoryId: env.category.entity.id,
        accessToken: env.adminUser.access
      })
      .then((res) => {
        expect(res.status)
          .to
          .be
          .eq(httpStatus.OK);
        expects.category.expectEntity(res.body);
        done();
      })
      .catch(done);
  });
  it('should return 404 on getById after deleting', (done) => {
    reqs.category
      .delete({
        categoryId: env.category.entity.id,
        accessToken: env.adminUser.access
      })
      .then((res) => {
        expect(res.status)
          .to
          .be
          .eq(httpStatus.OK);
        return reqs.category.getById({
          categoryId: env.category.entity.id,
        });
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
  describe('invalid access', () => {
    it('should return 403 ( use plain business user )', (done) => {
      reqs.category
        .delete({
          categoryId: env.category.entity.id,
          accessToken: env.businessUser.access
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
    it('should return 403 ( use plain user )', (done) => {
      reqs.category
        .delete({
          categoryId: env.category.entity.id,
          accessToken: env.user.access
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
  describe('invalid id', () => {
    it('should return 404 ( new id )', (done) => {
      reqs.category
        .delete({ categoryId: ObjectId(), })
        .then((res) => {
          expect(res.status)
            .to
            .be
            .eq(httpStatus.NOT_FOUND);
          done();
        })
        .catch(done);
    });
  });
}

function testList() {
  const NUMBER_OF_CATEGORIES = 10;
  before(`create ${NUMBER_OF_CATEGORIES} categories`, (done) => {
    Promise.all(Array.from({ length: NUMBER_OF_CATEGORIES }, () => reqs.category
      .create({
        accessToken: env.adminUser.access,
        data: getCategoryData()
      })))
      .then((responses) => {
        responses.forEach((res) => {
          expect(res.status)
            .to
            .be
            .eq(httpStatus.OK);
        });
        done();
      })
      .catch(done);
  });
  it('should return all categories', (done) => {
    reqs.category.list({ query: { all: true } })
      .then((res) => {
        expect(res.status)
          .to
          .be
          .eq(httpStatus.OK);
        expects.expectPaginatedBody({
          body: res.body,
          skip: 0,
          total: NUMBER_OF_CATEGORIES,
          limit: NUMBER_OF_CATEGORIES,
          testForItems: c => expect(c)
            .to
            .be
            .a('string')
        });
        done();
      })
      .catch(done);
  });
  describe('use query options', () => {
    testQueries.defaultTestsForQueries.forEach((ts) => {
      it(`should return ${ts.expectedCode}, ( ${JSON.stringify(ts.query)} )`, (done) => {
        reqs.category
          .list(ts)
          .then((res) => {
            expect(res.status)
              .to
              .be
              .eq(ts.expectedCode);
            if (ts.expectedCode === httpStatus.OK) {
              expects.expectPaginatedBody({
                body: res.body,
                testForItems: expects.category.expectEntity,
                query: ts.query,
                total: NUMBER_OF_CATEGORIES
              });
            }
            done();
          })
          .catch(done);
      });
    });
  });
}
