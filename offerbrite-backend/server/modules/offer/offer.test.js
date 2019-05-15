const httpStatus = require('http-status');
const path = require('path');
const chai = require('chai');
const reqs = require('../../tests/reqs/index');
const expects = require('../../tests/expects/index');
const mongoose = require('mongoose');
const {
  getUserData, getAdminData, getBusinessUserData, getBusinessData, getOfferData
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
  business: {
    data: getBusinessData(),
    entity: null
  },
  image: {
    path: path.join(__dirname, '../../tests/resources/image41kb.jpg'),
    url: null
  }
};

describe('## Offer APIs', () => {
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
  before('create business', (done) => {
    reqs.business.create({
      accessToken: env.businessUser.access,
      data: env.business.data
    })
      .then((res) => {
        expect(res.status)
          .to
          .be
          .eq(httpStatus.OK);
        env.business.entity = res.body;
        done();
      })
      .catch(done);
  });
  describe('# POST /api/v1/businesses/:id/offers', testCreation);
  describe('# PUT /api/v1/offers/:id', testUpdate);
  describe('# DELETE /api/v1/offers/:id', testDelete);
  describe('# GET /api/v1/offers/:id', testGetById);
  describe('# GET /api/v1/offers', testGetList);
  describe('counting of images references', testImageReferences);
});

function testCreation() {
  after('clear offers DB', (done) => {
    dbFiller.clearOfferDB()
      .then(() => done())
      .catch(done);
  });
  describe('valid data, different roles', () => {
    it('should return 403 ( use plain user )', (done) => {
      reqs.offer.create({
        accessToken: env.user.access,
        businessId: env.business.entity.id,
        data: getOfferData()
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
    it('should create offer ( use business-user )', (done) => {
      const offerData = getOfferData();
      reqs.offer.create({
        accessToken: env.businessUser.access,
        businessId: env.business.entity.id,
        data: offerData
      })
        .then((res) => {
          expect(res.status)
            .to
            .be
            .eq(httpStatus.OK);
          expects.offer.expectEntity(res.body, {
            ...offerData,
            businessId: env.business.entity.id
          });
          done();
        })
        .catch(done);
    });
    it('should return 403, ( use another business-user )', (done) => {
      const offerData = getOfferData();
      reqs.businessUser
        .create(getBusinessUserData())
        .then((res) => {
          expect(res.status)
            .to
            .be
            .eq(httpStatus.OK);
          const { access } = testTools.parseAuthBody(res.body);
          return reqs.offer.create({
            accessToken: access,
            businessId: env.business.entity.id,
            data: offerData
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
    it('should create offer ( use business-user & create imageUrl )', (done) => {
      const offerData = getOfferData([env.image.url]);
      reqs.offer.create({
        accessToken: env.businessUser.access,
        businessId: env.business.entity.id,
        data: offerData
      })
        .then((res) => {
          expect(res.status)
            .to
            .be
            .eq(httpStatus.OK);
          expects.offer.expectEntity(res.body, {
            ...offerData,
            businessId: env.business.entity.id
          });
          done();
        })
        .catch(done);
    });
  });
  describe('invalid business id', () => {
    it('should return 400 ( not a ObjectId)', (done) => {
      const offerData = getOfferData();
      reqs.offer.create({
        accessToken: env.businessUser.access,
        businessId: 'invalid',
        data: offerData
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
    it('should return 404 ( no such business )', (done) => {
      const offerData = getOfferData();
      reqs.offer.create({
        accessToken: env.businessUser.access,
        businessId: ObjectId(),
        data: offerData
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
  });
  describe('check each property separately', () => {
    const runTestCaseCreation = (testCase, done) => reqs.offer
      .create({
        data: {
          ...getOfferData(),
          ...testCase.data,
        },
        businessId: env.business.entity.id,
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
      testData: testQueries.offer.testSuitsForCreation,
      makeReq: runTestCaseCreation
    });
  });
}

function testUpdate() {
  let createdOffer = null;
  const offerData = getOfferData();
  after('clear offers DB', (done) => {
    dbFiller.clearOfferDB()
      .then(() => done())
      .catch(done);
  });
  before('create new offer', (done) => {
    reqs.offer.create({
      accessToken: env.businessUser.access,
      data: offerData,
      businessId: env.business.entity.id
    })
      .then((res) => {
        expect(res.status)
          .to
          .be
          .eq(httpStatus.OK);
        createdOffer = res.body;
        done();
      })
      .catch(done);
  });
  describe('valid data, different roles', () => {
    const newData = { title: 'New name' };

    it('should return 403 ( use plain user )', (done) => {
      reqs.offer.update({
        accessToken: env.user.access,
        data: newData,
        offerId: createdOffer.id
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
      reqs.offer.update({
        accessToken: env.businessUser.access,
        data: newData,
        offerId: createdOffer.id
      })
        .then((res) => {
          expect(res.status)
            .to
            .be
            .eq(httpStatus.OK);
          expects.offer.expectEntityUpdated(res.body, newData);
          done();
        })
        .catch(done);
    });
    it('should return 403, ( use another business-user )', (done) => {
      reqs.businessUser
        .create(getBusinessUserData())
        .then((res) => {
          expect(res.status)
            .to
            .be
            .eq(httpStatus.OK);
          const { access } = testTools.parseAuthBody(res.body);
          return reqs.offer.update({
            accessToken: access,
            data: newData,
            offerId: createdOffer.id
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
  describe('use different offerId', () => {
    const newData = { title: 'Aezakmi' };
    it('should return 404 no such offer', (done) => {
      reqs.offer.update({
        accessToken: env.businessUser.access,
        data: newData,
        offerId: ObjectId()
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
      reqs.offer.update({
        accessToken: env.businessUser.access,
        data: newData,
        offerId: 'invalid'
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
    const runTestCaseUpdate = (testCase, done) => reqs.offer
      .update({
        offerId: createdOffer.id,
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
      testData: testQueries.offer.testSuitsForUpdating,
      makeReq: runTestCaseUpdate
    });
  });
}

function testDelete() {
  let createdOffer = null;
  const offerData = getOfferData();
  afterEach('clear offers DB', (done) => {
    dbFiller.clearOfferDB()
      .then(() => done())
      .catch(done);
  });
  beforeEach('create new offer', (done) => {
    reqs.offer.create({
      accessToken: env.businessUser.access,
      data: offerData,
      businessId: env.business.entity.id
    })
      .then((res) => {
        expect(res.status)
          .to
          .be
          .eq(httpStatus.OK);
        createdOffer = res.body;
        done();
      })
      .catch(done);
  });
  describe('valid id, different roles', () => {
    it('should return 403 ( use plain user )', (done) => {
      reqs.offer.delete({
        accessToken: env.user.access,
        offerId: createdOffer.id
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
    it('should delete offer ( use business-user owner of business )', (done) => {
      reqs.offer.delete({
        accessToken: env.businessUser.access,
        offerId: createdOffer.id
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
          return reqs.offer.delete({
            accessToken: access,
            offerId: createdOffer.id
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
    it('should delete offer ( use admin user )', (done) => {
      reqs.offer.delete({
        accessToken: env.adminUser.access,
        offerId: createdOffer.id
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
  describe('use different offerId', () => {
    it('should return 404 no such offer', (done) => {
      reqs.offer.delete({
        accessToken: env.businessUser.access,
        offerId: ObjectId()
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
      reqs.offer.delete({
        accessToken: env.businessUser.access,
        offerId: 'invalid'
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
  it('should return 404, on get by id deleted offer', (done) => {
    reqs.offer.delete({
      accessToken: env.businessUser.access,
      offerId: createdOffer.id
    })
      .then((res) => {
        expect(res.status)
          .to
          .be
          .eq(httpStatus.OK);
        expects.offer.expectEntity(res.body, createdOffer);
        return reqs.offer.getById({ offerId: createdOffer.id });
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
  let createdOffer = null;
  const offerData = getOfferData();
  before('create new offer', (done) => {
    reqs.offer.create({
      accessToken: env.businessUser.access,
      data: offerData,
      businessId: env.business.entity.id
    })
      .then((res) => {
        expect(res.status)
          .to
          .be
          .eq(httpStatus.OK);
        createdOffer = res.body;
        done();
      })
      .catch(done);
  });
  after('clear offers DB', (done) => {
    dbFiller.clearOfferDB()
      .then(() => done())
      .catch(done);
  });
  describe('valid id, different roles', () => {
    it('should return offer ( use plain user )', (done) => {
      reqs.offer.getById({
        accessToken: env.user.access,
        offerId: createdOffer.id
      })
        .then((res) => {
          expect(res.status)
            .to
            .be
            .eq(httpStatus.OK);
          expects.offer.expectEntity(res.body, createdOffer);
          done();
        })
        .catch(done);
    });
    it('should return offer ( use business-user owner of business )', (done) => {
      reqs.offer.getById({
        accessToken: env.businessUser.access,
        offerId: createdOffer.id
      })
        .then((res) => {
          expect(res.status)
            .to
            .be
            .eq(httpStatus.OK);
          expects.offer.expectEntity(res.body, createdOffer);
          done();
        })
        .catch(done);
    });
    it('should return offer, ( use another business-user )', (done) => {
      reqs.businessUser
        .create(getBusinessUserData())
        .then((res) => {
          expect(res.status)
            .to
            .be
            .eq(httpStatus.OK);
          const { access } = testTools.parseAuthBody(res.body);
          return reqs.offer.getById({
            accessToken: access,
            offerId: createdOffer.id
          });
        })
        .then((res) => {
          expect(res.status)
            .to
            .be
            .eq(httpStatus.OK);
          expects.offer.expectEntity(res.body, createdOffer);
          done();
        })
        .catch(done);
    });
    it('should delete offer ( use admin user )', (done) => {
      reqs.offer.getById({
        accessToken: env.adminUser.access,
        offerId: createdOffer.id
      })
        .then((res) => {
          expect(res.status)
            .to
            .be
            .eq(httpStatus.OK);
          expects.offer.expectEntity(res.body, createdOffer);
          done();
        })
        .catch(done);
    });
  });
  describe('use different offerId', () => {
    it('should return 404 no such offer', (done) => {
      reqs.offer.getById({
        accessToken: env.businessUser.access,
        offerId: ObjectId()
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
      reqs.offer.getById({
        accessToken: env.businessUser.access,
        offerId: 'invalid'
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

function testGetList() {
  const offersLenght = 20;
  const usersLength = 4;
  const businessesLength = 4;
  const offers = [];
  const users = [];
  const businesses = [];
  after('clear offers DB', (done) => {
    dbFiller.clearOfferDB()
      .then(() => done())
      .catch(done);
  });
  before('generate offers', (done) => {
    const categories = ['sport', 'food', 'fitnes', 'gym', 'books', 'smartphones', 'clothes', 'goods'];
    for (let i = 0; i < offersLenght; i++) {
      const offer = getOfferData();
      offer.category = categories[testTools.getRandomNumber(categories.length)];
      offers.push(offer);
    }
    done();
  });
  before('create business users', (done) => {
    const promises = [];
    for (let i = 0; i < usersLength; i++) {
      const pos = i;
      promises.push(new Promise((resolve, reject) => {
        reqs.businessUser
          .create(getBusinessUserData())
          .then((res) => {
            testTools.parseAuthBody(res.body, users[pos] = {});
            resolve();
          })
          .catch(reject);
      }));
    }
    Promise.all(promises)
      .then(() => {
        done();
      })
      .catch(done);
  });
  before('create businesses', (done) => {
    const promises = [];
    for (let i = 0; i < businessesLength; i++) {
      const pos = i;
      promises.push(new Promise((resolve, reject) => {
        reqs.business.create({
          accessToken: users[pos].access,
          data: getBusinessData()
        })
          .then((res) => {
            businesses[pos] = res.body;
            resolve();
          })
          .catch(reject);
      }));
    }
    Promise.all(promises)
      .then(() => {
        done();
      })
      .catch(done);
  });
  before('filling offer db', (done) => {
    const promises = offers.map(offer => new Promise((resolve, reject) => {
      const pos = testTools.getRandomNumber(usersLength);
      reqs.offer.create({
        accessToken: users[pos].access,
        data: offer,
        businessId: businesses[pos].id
      })
        .then(() => {
          resolve();
        })
        .catch(reject);
    }));
    Promise.all(promises)
      .then(() => {
        done();
      })
      .catch(done);
  });
  Object.keys(testQueries.offer.testSuitsForGettingList)
    .forEach((field) => {
      describe(`testing query for ${field}`, () => {
        testQueries.offer.testSuitsForGettingList[field].goodTestSuits.forEach((testSuit) => {
          it(testSuit.description, (done) => {
            const testValue = testSuit.getTestValue(offers);
            const query = testSuit.getQuery(testValue);
            reqs.offer.list({
              query: {
                status: 'all',
                ...query
              }
            })
              .then((res) => {
                expect(res.body.docs)
                  .to
                  .be
                  .an('array');
                expects.offer.expectArrayOfEntities(res.body.docs);
                expect(res.body.docs.length)
                  .to
                  .be
                  .eq(testSuit.countSuitable(testValue, offers));
                done();
              })
              .catch(done);
          });
        });
        testQueries.offer.testSuitsForGettingList[field].badTestSuits.forEach((testSuit) => {
          it(`should responce with status ${testSuit.expectedCode} (${testSuit.description})`, (done) => {
            reqs.offer.list({
              query: {
                status: 'all',
                ...testSuit.getQuery()
              }
            })
              .then((res) => {
                expect(res.status)
                  .to
                  .be
                  .eq(testSuit.expectedCode);
                done();
              })
              .catch(done);
          });
        });
      });
    });
}

function testImageReferences() {
  let fileReferenceBefore = null;
  beforeEach('load reference to file', async () => {
    fileReferenceBefore = await StorageFile.getByUrl(env.image.url);
  });
  describe('on create', () => {
    it('should increase reference counter ( send logoUrl )', async () => {
      const offerData = getOfferData([env.image.url]);
      const res = await reqs.offer.create({
        accessToken: env.businessUser.access,
        data: offerData,
        businessId: env.business.entity.id
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
    let createdOffer = null;
    before('create new offer with image', async () => {
      const offerData = getOfferData([env.image.url]);
      const res = await reqs.offer.create({
        accessToken: env.businessUser.access,
        data: offerData,
        businessId: env.business.entity.id
      });
      expect(res.status)
        .to
        .be
        .eq(httpStatus.OK);
      createdOffer = res.body;
    });
    beforeEach('add image to offer', async () => {
      const res = await reqs.offer.update({
        accessToken: env.businessUser.access,
        data: { imagesUrls: [env.image.url] },
        offerId: createdOffer.id
      });
      expect(res.status)
        .to
        .be
        .eq(httpStatus.OK);
    });
    it('should not change reference counter ( send old image )', async () => {
      const newData = { imagesUrls: [env.image.url] };
      const res = await reqs.offer.update({
        accessToken: env.businessUser.access,
        data: newData,
        offerId: createdOffer.id
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
      const newData = { imagesUrls: [] };
      const res = await reqs.offer.update({
        accessToken: env.businessUser.access,
        data: newData,
        offerId: createdOffer.id
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
    it('should increase reference counter ( send new image )', async () => {
      const newData = { imagesUrls: [env.image.url] };
      await reqs.offer.update({
        accessToken: env.businessUser.access,
        data: { imageUrls: [] },
        offerId: createdOffer.id
      });
      const res = await reqs.offer.update({
        accessToken: env.businessUser.access,
        data: newData,
        offerId: createdOffer.id
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
    let createdOffer = null;
    before('create new offer with images', async () => {
      const offerData = getOfferData([env.image.url]);
      const res = await reqs.offer.create({
        accessToken: env.businessUser.access,
        data: offerData,
        businessId: env.business.entity.id
      });
      expect(res.status)
        .to
        .be
        .eq(httpStatus.OK);
      createdOffer = res.body;
    });
    it('should decrease reference counter', async () => {
      const res = await reqs.offer.delete({
        accessToken: env.businessUser.access,
        offerId: createdOffer.id
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
