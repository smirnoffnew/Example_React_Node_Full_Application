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
  },
  offers: []
};
const NUMBER_OF_OFFERS = 5;
describe('## FavouriteOffers APIs', () => {
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
  before(`create ${NUMBER_OF_OFFERS} offers`, (done) => {
    Promise.all(Array.from({ length: NUMBER_OF_OFFERS }, () => reqs.offer.create({
      accessToken: env.businessUser.access,
      data: getOfferData(),
      businessId: env.business.entity.id
    })))
      .then((responses) => {
        responses.forEach(res => expect(res.status)
          .to
          .be
          .eq(httpStatus.OK));
        env.offers = responses.map(res => res.body);
        done();
      })
      .catch(done);
  });
  describe('# POST /api/v1/users/:id/favourite-offers/:id', testCreation);
  describe('# DELETE /api/v1/users/:id/favourite-offers/:id', testDelete);
  describe('# GET /api/v1/users/:id/favourite-offers', testList);
});

function testCreation() {
  afterEach('clear favouriteOffers DB', (done) => {
    dbFiller.clearFavouriteOffersDB()
      .then(() => done())
      .catch(done);
  });
  describe('valid ids, different roles', () => {
    it('should return 200 ( use plain user )', (done) => {
      reqs.favouriteOffers.create({
        accessToken: env.user.access,
        offerId: env.offers[0].id,
        userId: env.user.account.id,
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
    it('should return 200 ( use admin user )', (done) => {
      reqs.favouriteOffers.create({
        accessToken: env.adminUser.access,
        offerId: env.offers[0].id,
        userId: env.user.account.id,
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
    it('should return 403( use business-user )', (done) => {
      reqs.favouriteOffers.create({
        accessToken: env.businessUser.access,
        offerId: env.offers[0].id,
        userId: env.user.account.id,
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
    it('should return 403, ( use another plain user )', (done) => {
      reqs.user
        .create(getUserData())
        .then((res) => {
          expect(res.status)
            .to
            .be
            .eq(httpStatus.OK);
          const { access } = testTools.parseAuthBody(res.body);
          return reqs.favouriteOffers.create({
            accessToken: access,
            offerId: env.offers[0].id,
            userId: env.user.account.id,
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
  describe('invalid user id', () => {
    it('should return 400 ( not a ObjectId)', (done) => {
      reqs.favouriteOffers.create({
        accessToken: env.user.access,
        offerId: env.offers[0].id,
        userId: 'invalid'
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
    it('should return 404 ( no such user )', (done) => {
      reqs.favouriteOffers.create({
        accessToken: env.user.access,
        offerId: env.offers[0].id,
        userId: ObjectId()
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
  describe('invalid offer id', () => {
    it('should return 400 ( not a ObjectId)', (done) => {
      reqs.favouriteOffers.create({
        accessToken: env.user.access,
        offerId: 'invalid',
        userId: env.user.account.id
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
    it('should return 404 ( no such offer )', (done) => {
      reqs.favouriteOffers.create({
        accessToken: env.user.access,
        offerId: ObjectId(),
        userId: env.user.account.id
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
  describe('try to add the same offer to favourites twice', () => {
    beforeEach('add offer to favourites', (done) => {
      reqs.favouriteOffers.create({
        accessToken: env.user.access,
        offerId: env.offers[0].id,
        userId: env.user.account.id,
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
    it('should return 400, offer is already in favourites', (done) => {
      reqs.favouriteOffers.create({
        accessToken: env.user.access,
        offerId: env.offers[0].id,
        userId: env.user.account.id,
      })
        .then((res) => {
          expect(res.status)
            .to
            .be
            .eq(httpStatus.BAD_REQUEST);
          expect(res.body.message)
            .to
            .be
            .eq('This offer is already in favourites');
          done();
        })
        .catch(done);
    });
  });
}

function testDelete() {
  before('clear favouriteOffers DB', (done) => {
    dbFiller.clearFavouriteOffersDB()
      .then(() => done())
      .catch(done);
  });
  beforeEach('add offer to favourites', (done) => {
    reqs.favouriteOffers.create({
      accessToken: env.user.access,
      offerId: env.offers[0].id,
      userId: env.user.account.id,
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
  afterEach('clear favouriteOffers DB', (done) => {
    dbFiller.clearFavouriteOffersDB()
      .then(() => done())
      .catch(done);
  });
  describe('valid ids, different roles', () => {
    it('should return 200 ( use plain user )', (done) => {
      reqs.favouriteOffers.delete({
        accessToken: env.user.access,
        offerId: env.offers[0].id,
        userId: env.user.account.id,
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
    it('should return 200 ( use admin user )', (done) => {
      reqs.favouriteOffers.delete({
        accessToken: env.adminUser.access,
        offerId: env.offers[0].id,
        userId: env.user.account.id,
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
    it('should return 403( use business-user )', (done) => {
      reqs.favouriteOffers.delete({
        accessToken: env.businessUser.access,
        offerId: env.offers[0].id,
        userId: env.user.account.id,
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
    it('should return 403, ( use another plain user )', (done) => {
      reqs.user
        .create(getUserData())
        .then((res) => {
          expect(res.status)
            .to
            .be
            .eq(httpStatus.OK);
          const { access } = testTools.parseAuthBody(res.body);
          return reqs.favouriteOffers.delete({
            accessToken: access,
            offerId: env.offers[0].id,
            userId: env.user.account.id,
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
  describe('invalid user id', () => {
    it('should return 400 ( not a ObjectId)', (done) => {
      reqs.favouriteOffers.delete({
        accessToken: env.user.access,
        offerId: env.offers[0].id,
        userId: 'invalid'
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
    it('should return 404 ( no such user )', (done) => {
      reqs.favouriteOffers.delete({
        accessToken: env.user.access,
        offerId: env.offers[0].id,
        userId: ObjectId()
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
  describe('invalid offer id', () => {
    it('should return 400 ( not a ObjectId)', (done) => {
      reqs.favouriteOffers.delete({
        accessToken: env.user.access,
        offerId: 'invalid',
        userId: env.user.account.id
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
    it('should return 404 ( no such offer )', (done) => {
      reqs.favouriteOffers.delete({
        accessToken: env.user.access,
        offerId: ObjectId(),
        userId: env.user.account.id
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
    it('should return 400 ( offer is not in favourites )', (done) => {
      reqs.favouriteOffers.delete({
        accessToken: env.user.access,
        offerId: env.offers[1].id,
        userId: env.user.account.id
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
  describe('test workflow after deletion', () => {
    beforeEach('remove offer from favourites', (done) => {
      reqs.favouriteOffers.delete({
        accessToken: env.user.access,
        offerId: env.offers[0].id,
        userId: env.user.account.id,
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
    it('should allow to add deleted offer to favourites again', (done) => {
      reqs.favouriteOffers.create({
        accessToken: env.user.access,
        offerId: env.offers[0].id,
        userId: env.user.account.id,
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
}

function testList() {
  before('clear favouriteOffers DB', (done) => {
    dbFiller.clearFavouriteOffersDB()
      .then(() => done())
      .catch(done);
  });
  before('add all offers to favourites', (done) => {
    Promise.all(env.offers.map(offer => reqs.favouriteOffers.create({
      accessToken: env.user.access,
      offerId: offer.id,
      userId: env.user.account.id,
    })))
      .then((responses) => {
        responses.forEach(res => expect(res.status)
          .to
          .be
          .eq(httpStatus.OK));
        done();
      })
      .catch(done);
  });
  describe('use query options', () => {
    testQueries.defaultTestsForQueries.forEach((ts) => {
      it(`should return ${ts.expectedCode}, ( ${JSON.stringify(ts.query)} )`, (done) => {
        reqs.favouriteOffers
          .list({
            query: ts.query,
            accessToken: env.user.access,
            userId: env.user.account.id
          })
          .then((res) => {
            expect(res.status)
              .to
              .be
              .eq(ts.expectedCode);
            if (ts.expectedCode === httpStatus.OK) {
              expects.expectPaginatedBody({
                body: res.body,
                testForItems: expects.offer.expectEntity,
                query: ts.query,
                total: NUMBER_OF_OFFERS
              });
            }
            done();
          })
          .catch(done);
      });
    });
  });
}
