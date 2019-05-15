const express = require('express');
const gaCtrl = require('./ga.controller');
const gaCtrlBusiness = require('./ga.controllerBusiness');
const auth = require('../helpers/passport/index');

const router = express.Router();
const gaRoute = express.Router();

// get all Share
gaRoute.get('/share/:dateStart/:dateEnd',
auth.jwtAnyAccess,
gaCtrl.getAllShare);

// get all event
gaRoute.get('/event/:dateStart/:dateEnd',
auth.jwtAnyAccess,
gaCtrl.getAllEvets);

// get all sessinos by country
gaRoute.get('/country/:dateStart/:dateEnd',
auth.jwtAnyAccess,
gaCtrl.getAllSessionsByCounry);

// get all screen suport
gaRoute.get('/screensuport/:dateStart/:dateEnd',
auth.jwtAnyAccess,
gaCtrl.getAllScreenSuport);

// get all session by device
gaRoute.get('/sessiondevice/:dateStart/:dateEnd',
auth.jwtAnyAccess,
gaCtrl.getAllSessionByDevice);

// get user stat
gaRoute.get('/userstata/:dateStart/:dateEnd',
auth.jwtAnyAccess,
gaCtrl.getUserStat);

// get user graph
gaRoute.get('/usersGraph/:dateStart/:dateEnd',
auth.jwtAnyAccess,
gaCtrl.getUserGraph);

// get sessions graph
gaRoute.get('/sessionsGraph/:dateStart/:dateEnd',
auth.jwtAnyAccess,
gaCtrl.getSessionGraph);

// get screenViews graph
gaRoute.get('/screenViewsGraph/:dateStart/:dateEnd',
auth.jwtAnyAccess,
gaCtrl.getScreenViewGraph);

// get screen session graph
gaRoute.get('/screenSessionGraph/:dateStart/:dateEnd',
auth.jwtAnyAccess,
gaCtrl.getScreenSessionGraph);

// get SessionDuration graph
gaRoute.get('/sessionDurationGraph/:dateStart/:dateEnd',
auth.jwtAnyAccess,
gaCtrl.getSessionDurationGraph);

// get percent of new sessions graph graph
gaRoute.get('/percentNewSessionsGraph/:dateStart/:dateEnd',
auth.jwtAnyAccess,
gaCtrl.getPercetnOfNewSessionGraph);

// get sessions
gaRoute.get('/sessions/:dateStart/:dateEnd', auth.jwtAnyAccess,
gaCtrl.getSessions);

// get all Share Business
gaRoute.get('/shareBusiness/:dateStart/:dateEnd',
auth.jwtAnyAccess,
gaCtrlBusiness.getAllShareBusiness);

// get all event Business
gaRoute.get('/eventBusiness/:dateStart/:dateEnd',
auth.jwtAnyAccess,
gaCtrlBusiness.getAllEvetsBusiness);

// get all sessinos by countryBusiness
gaRoute.get('/countryBusiness/:dateStart/:dateEnd',
auth.jwtAnyAccess,
gaCtrlBusiness.getAllSessionsByCounryBusiness);

// get all screen suport Business
gaRoute.get('/screensuportBusiness/:dateStart/:dateEnd',
auth.jwtAnyAccess,
gaCtrlBusiness.getAllScreenSuportBusiness);

// get all session by device Business
gaRoute.get('/sessiondeviceBusiness/:dateStart/:dateEnd',
auth.jwtAnyAccess,
gaCtrlBusiness.getAllSessionByDeviceBusiness);

// get user stat Business
gaRoute.get('/userstataBusiness/:dateStart/:dateEnd',
auth.jwtAnyAccess,
gaCtrlBusiness.getUserStatBusiness);

// get user graph
gaRoute.get('/usersGraphBusiness/:dateStart/:dateEnd',
auth.jwtAnyAccess,
gaCtrlBusiness.getUserGraphBusiness);

// get sessions graph Business
gaRoute.get('/sessionsGraphBusiness/:dateStart/:dateEnd',
auth.jwtAnyAccess,
gaCtrlBusiness.getSessionGraphBusiness);

// get screenViews graph Business
gaRoute.get('/screenViewsGraphBusiness/:dateStart/:dateEnd',
auth.jwtAnyAccess,
gaCtrlBusiness.getScreenViewGraphBusiness);

// get screen session graph Business
gaRoute.get('/screenSessionGraphBusiness/:dateStart/:dateEnd',
auth.jwtAnyAccess,
gaCtrlBusiness.getScreenSessionGraphBusiness);

// get SessionDuration graph
gaRoute.get('/sessionDurationGraphBusiness/:dateStart/:dateEnd',
auth.jwtAnyAccess,
gaCtrlBusiness.getSessionDurationGraphBusiness);

// get percent of new sessions graph graph Business
gaRoute.get('/percentNewSessionsGraphBusiness/:dateStart/:dateEnd',
auth.jwtAnyAccess,
gaCtrlBusiness.getPercetnOfNewSessionGraphBusiness);

// get sessions Business
gaRoute.get('/sessionsBusiness/:dateStart/:dateEnd', auth.jwtAnyAccess,
gaCtrlBusiness.getSessionsBusiness);

router.use('/ga-report', gaRoute);
module.exports = router;
