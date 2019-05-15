const express = require('express');
const authRoutes = require('./modules/auth/auth.route');
const authBusinessRoutes = require('./modules/auth-business/auth-business.route');
const userRoutes = require('./modules/user/user.route');
const businessUser = require('./modules/business-user/businessUser.route');
const storage = require('./modules/storage/storage.route');
const category = require('./modules/category/category.route');
const business = require('./modules/business/business.route');
const reportRouter = require('./modules/reports/reports.route');
const offer = require('./modules/offer/offer.route');
const favouriteOffers = require('./modules/favouriteOffers/favouriteOffer.route');
const googleAnalystRoutes = require('./googleAnalyst/ga.route');
const notifications = require('./modules/notification/notification.route');

const router = express.Router();

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) => res.json({ status: 'OK' }));

router.use(userRoutes);
router.use(authRoutes);
router.use(businessUser);
router.use(authBusinessRoutes);
router.use(storage);
router.use(category);
router.use(business);
router.use(offer);
router.use(favouriteOffers);
router.use(reportRouter);
router.use(googleAnalystRoutes);
router.use(notifications);

module.exports = router;
