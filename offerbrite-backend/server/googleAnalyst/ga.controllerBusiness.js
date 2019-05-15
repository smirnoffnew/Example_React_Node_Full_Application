const log = require('../helpers/winston').getLogger({ name: 'google:ctrl' });
const { getAnalyticsBusiness } = require('./ga.access');

/**
 * get all sahre from google analyst
 * @param {Express.Request} req reqest Obejct
 * @param {Express.Response} res response Object
 */
const getAllShareBusiness = async (req, res) => {
  if (req.authUser.role === 'super-admin' || req.authUser.role === 'admin') {
    log.info('ga-report/share');
    const settings = {
      reportRequests: [
        {
          filtersExpression: 'ga:EventCategory==Share',
          dateRanges: [
            {
              startDate: req.params.dateStart,
              endDate: req.params.dateEnd
            }
          ],
          metrics: [
            {
              expression: 'ga:totalEvents'
            }
          ],
          dimensions: [
            {
              name: 'ga:eventCategory'
            }
          ]
        }
      ]
    };
    getAnalyticsBusiness(res, settings);
  }
  res.status(401).json({ status: 'ERROR', message: 'You do not have access to this event!' });
};
/**
 * get all sahre from google analyst
 * @param {Express.Request} req reqest Obejct
 * @param {Express.Response} res response Object

 */
const getAllEvetsBusiness = async (req, res) => {
  if (req.authUser.role === 'super-admin' || req.authUser.role === 'admin') {
    log.info('ga-report/event');
    const settings = {
      reportRequests: [
        {
          // filtersExpression: 'ga:EventAction==Add to favorites',
          dateRanges: [
            {
              startDate: req.params.dateStart,
              endDate: req.params.dateEnd
            }
          ],
          metrics: [
            {
              expression: 'ga:totalEvents'
            },
            {
              expression: 'ga:uniqueEvents'
            },
            {
              expression: 'ga:eventValue'
            },
            {
              expression: 'ga:avgEventValue'
            }
          ],
          dimensions: [
            {
              name: 'ga:eventAction'
            }
          ]
        }
      ]
    };
    getAnalyticsBusiness(res, settings);
  }
  res.status(401).json({ status: 'ERROR', message: 'You do not have access to this event!' });
};

/**
 * get all session by contry from google analyst
 * @param {Express.Request} req reqest Obejct
 * @param {Express.Response} res response Object
 */

const getAllSessionsByCounryBusiness = async (req, res) => {
  if (req.authUser.role === 'super-admin' || req.authUser.role === 'admin') {
    log.info('ga-report/country');
    const settings = {
      reportRequests: [
        {
          // filtersExpression: 'ga:EventAction==Add to favorites',
          dateRanges: [
            {
              startDate: req.params.dateStart,
              endDate: req.params.dateEnd
            }
          ],
          metrics: [
            {
              expression: 'ga:sessions'
            }
          ],
          dimensions: [
            {
              name: 'ga:country'
            }
          ]
        }
      ]
    };
    getAnalyticsBusiness(res, settings);
  }
  res.status(401).json({ status: 'ERROR', message: 'You do not have access to this event!' });
};

/**
 * get all screen support from google analyst
 * @param {Express.Request} req reqest Obejct
 * @param {Express.Response} res response Object
 */
const getAllScreenSuportBusiness = async (req, res) => {
  if (req.authUser.role === 'super-admin' || req.authUser.role === 'admin') {
    log.info('ga-report/screensuport');
    const settings = {
      reportRequests: [
        {
          // filtersExpression: 'ga:EventAction==Add to favorites',
          dateRanges: [
            {
              startDate: req.params.dateStart,
              endDate: req.params.dateEnd
            }
          ],
          metrics: [
            {
              expression: 'ga:screenviews'
            },
            {
              expression: 'ga:uniqueScreenviews'
            },
            {
              expression: 'ga:avgScreenviewDuration'
            },
            {
              expression: 'ga:exitRate'
            }
          ],
          dimensions: [
            {
              name: 'ga:screenName'
            }
          ]
        }
      ]
    };

    getAnalyticsBusiness(res, settings);
  }
  res.status(401).json({ status: 'ERROR', message: 'You do not have access to this event!' });
};

/**
 * get all session by device from google analyst
 * @param {Express.Request} req reqest Obejct
 * @param {Express.Response} res response Object
 */
const getAllSessionByDeviceBusiness = async (req, res) => {
  if (req.authUser.role === 'super-admin' || req.authUser.role === 'admin') {
    log.info('ga-report/sessiondevice');
    const settings = {
      reportRequests: [
        {
          // filtersExpression: 'ga:EventAction==Add to favorites',
          dateRanges: [
            {
              startDate: req.params.dateStart,
              endDate: req.params.dateEnd
            }
          ],
          metrics: [
            {
              expression: 'ga:sessions'
            }
          ],
          dimensions: [
            {
              name: 'ga:mobileDeviceInfo'
            }
          ]
        }
      ]
    };
    getAnalyticsBusiness(res, settings);
  }
  res.status(401).json({ status: 'ERROR', message: 'You do not have access to this event!' });
};

/**
 * get  user stat  from google analyst
 * @param {Express.Request} req reqest Obejct
 * @param {Express.Response} res response Object
 */
const getUserStatBusiness = async (req, res) => {
  if (req.authUser.role === 'super-admin' || req.authUser.role === 'admin') {
    log.info('ga-report/userstata');
    const settings = {
      reportRequests: [
        {
          // filtersExpression: 'ga:EventAction==Add to favorites',
          dateRanges: [
            {
              startDate: req.params.dateStart,
              endDate: req.params.dateEnd
            }
          ],
          metrics: [
            {
              expression: 'ga:users'
            },
            {
              expression: 'ga:sessions'
            },
            {
              expression: 'ga:newUsers'
            },
            {
              expression: 'ga:sessionDuration'
            }
          ]
        }
      ]
    };
    getAnalyticsBusiness(res, settings);
  }
  res.status(401).json({ status: 'ERROR', message: 'You do not have access to this event!' });
};

/**
 * get user graph from google analyst
 * @param {Express.Request} req reqest Obejct
 * @param {Express.Response} res response Object
 */
const getUserGraphBusiness = async (req, res) => {
  if (req.authUser.role === 'super-admin' || req.authUser.role === 'admin') {
    log.info('ga-report/usersGraph');
    const settings = {
      reportRequests: [
        {
          // filtersExpression: 'ga:EventAction==Add to favorites',
          dateRanges: [
            {
              startDate: req.params.dateStart,
              endDate: req.params.dateEnd
            }
          ],
          metrics: [
            {
              expression: 'ga:users'
            }
          ],
          dimensions: [
            {
              name: 'ga:date'
            }
          ]
        }
      ]
    };
    getAnalyticsBusiness(res, settings);
  }
  res.status(401).json({ status: 'ERROR', message: 'You do not have access to this event!' });
};

/**
 * get get session from google analyst
 * @param {Express.Request} req reqest Obejct
 * @param {Express.Response} res response Object
 */
const getSessionGraphBusiness = async (req, res) => {
  if (req.authUser.role === 'super-admin' || req.authUser.role === 'admin') {
    log.info('ga-report/sessionsGraph');
    const settings = {
      reportRequests: [
        {
          // filtersExpression: 'ga:EventAction==Add to favorites',
          dateRanges: [
            {
              startDate: req.params.dateStart,
              endDate: req.params.dateEnd
            }
          ],
          metrics: [
            {
              expression: 'ga:sessions'
            }
          ],
          dimensions: [
            {
              name: 'ga:date'
            }
          ]
        }
      ]
    };
    getAnalyticsBusiness(res, settings);
  }
  res.status(401).json({ status: 'ERROR', message: 'You do not have access to this event!' });
};

/**
 * get screeen view graph from google analyst
 * @param {Express.Request} req reqest Obejct
 * @param {Express.Response} res response Object

 */
const getScreenViewGraphBusiness = async (req, res) => {
  if (req.authUser.role === 'super-admin' || req.authUser.role === 'admin') {
    log.info('ga-report/screenViewsGraph');
    const settings = {
      reportRequests: [
        {
          // filtersExpression: 'ga:EventAction==Add to favorites',
          dateRanges: [
            {
              startDate: req.params.dateStart,
              endDate: req.params.dateEnd
            }
          ],
          metrics: [
            {
              expression: 'ga:screenviews'
            }
          ],
          dimensions: [
            {
              name: 'ga:date'
            }
          ]
        }
      ]
    };
    getAnalyticsBusiness(res, settings);
  }
  res.status(401).json({ status: 'ERROR', message: 'You do not have access to this event!' });
};

/**
 * get screen session graph  from google analyst
 * @param {Express.Request} req reqest Obejct
 * @param {Express.Response} res response Object

 */
const getScreenSessionGraphBusiness = async (req, res) => {
  if (req.authUser.role === 'super-admin' || req.authUser.role === 'admin') {
    log.info('ga-report/screenSessionGraph');
    const settings = {
      reportRequests: [
        {
          // filtersExpression: 'ga:EventAction==Add to favorites',
          dateRanges: [
            {
              startDate: req.params.dateStart,
              endDate: req.params.dateEnd
            }
          ],
          metrics: [
            {
              expression: 'ga:screenviewsPerSession'
            }
          ],
          dimensions: [
            {
              name: 'ga:date'
            }
          ]
        }
      ]
    };
    getAnalyticsBusiness(res, settings);
  }
  res.status(401).json({ status: 'ERROR', message: 'You do not have access to this event!' });
};

/**
 * get sessin duration graph from google analyst
 * @param {Express.Request} req reqest Obejct
 * @param {Express.Response} res response Object

 */
const getSessionDurationGraphBusiness = async (req, res) => {
  if (req.authUser.role === 'super-admin' || req.authUser.role === 'admin') {
    log.info('ga-report/sessionDurationGraph');
    const settings = {
      reportRequests: [
        {
          // filtersExpression: 'ga:EventAction==Add to favorites',
          dateRanges: [
            {
              startDate: req.params.dateStart,
              endDate: req.params.dateEnd
            }
          ],
          metrics: [
            {
              expression: 'ga:avgSessionDuration'
            }
          ],
          dimensions: [
            {
              name: 'ga:date'
            }
          ]
        }
      ]
    };
    getAnalyticsBusiness(res, settings);
  }
  res.status(401).json({ status: 'ERROR', message: 'You do not have access to this event!' });
};

/**
 * get percetn of new session graph from google analyst
 * @param {Express.Request} req reqest Obejct
 * @param {Express.Response} res response Object

 */
const getPercetnOfNewSessionGraphBusiness = async (req, res) => {
  if (req.authUser.role === 'super-admin' || req.authUser.role === 'admin') {
    log.info('ga-report/percentNewSessionsGraph');
    const settings = {
      reportRequests: [
        {
          // filtersExpression: 'ga:EventAction==Add to favorites',
          dateRanges: [
            {
              startDate: req.params.dateStart,
              endDate: req.params.dateEnd
            }
          ],
          metrics: [
            {
              expression: 'ga:percentNewSessions'
            }
          ],
          dimensions: [
            {
              name: 'ga:date'
            }
          ]
        }
      ]
    };
    getAnalyticsBusiness(res, settings);
  }
  res.status(401).json({ status: 'ERROR', message: 'You do not have access to this event!' });
};

/**
 * get session from google analyst
 * @param {Express.Request} req reqest Obejct
 * @param {Express.Response} res response Object

 */
const getSessionsBusiness = async (req, res) => {
  if (req.authUser.role === 'super-admin' || req.authUser.role === 'admin') {
    log.info('ga-report/sessions');
    const settings = {
      reportRequests: [
        {
          // filtersExpression: 'ga:EventAction==Add to favorites',
          dateRanges: [
            {
              startDate: req.params.dateStart,
              endDate: req.params.dateEnd
            }
          ],
          metrics: [
            {
              expression: 'ga:sessions'
            }
          ]
          // dimensions: [
          //   {
          //     name: 'ga:date'
          //   }],
        }
      ]
    };
    getAnalyticsBusiness(res, settings);
  }
  res.status(401).json({ status: 'ERROR', message: 'You do not have access to this event!' });
};

module.exports = {
    getAllShareBusiness,
    getAllEvetsBusiness,
    getAllSessionsByCounryBusiness,
    getAllScreenSuportBusiness,
    getAllSessionByDeviceBusiness,
    getUserStatBusiness,
    getUserGraphBusiness,
    getSessionGraphBusiness,
    getScreenViewGraphBusiness,
    getScreenSessionGraphBusiness,
    getSessionDurationGraphBusiness,
    getPercetnOfNewSessionGraphBusiness,
    getSessionsBusiness
};
