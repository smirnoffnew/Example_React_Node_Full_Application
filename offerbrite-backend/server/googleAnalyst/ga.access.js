const { google } = require('googleapis');

const log = require('../helpers/winston').getLogger({ name: 'google:index' });

const oauth2Client = new google.auth.OAuth2();
const scopes = 'https://www.googleapis.com/auth/analytics.readonly';
const VIEW_ID = 'ga:184488351';
const VIEW_ID_BUSINESS = 'ga:185450007';
const jwtClient = new google.auth.JWT(
  '194654778175-compute@developer.gserviceaccount.com',
  null,
  '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCd6ntZvrFzj3vt\nu+f2J2K/yEU6hb55QQutNO+fT4c9UCmFPlUCjMbmsG1SkzU/ImdY3DjRwqRRdlrK\nilMoC/Ybn83ClkXHoRVsfQYBg4u1q9Jp0FYlwmJjmutGcSkWXbtPhpXMgo276RcX\n+v5Di9KNMXFjzl3mM60OV4mwD0a2GjKhvSU/EXeMnj7nCelPnoTItkH0LzGiVz2Y\nrWTagvUmAOys3QdFoqpmiKnZIChGb9D7DfhPJOSk9oJbsChPzEk+GiWi1ezExomY\nRUnGK8G69AjtbjgHX4DsIhQBMibytIlllFET96u9Amb+HaM+JfnYwKQ9NA15Jyye\n+diofoS7AgMBAAECggEAC6oRGsPCphdgSeL6KHen9s7gtN4XKoFa+Zwc4lwZ+wtA\n8zYeSmDCpQc9c/7VTTNfMImdFXq2miEku1bfUJMdm9RrJZHlrUVhPeZi5gQPnZzc\n9HLul2hrIxIDiexRjXThS+epiKB7aU4M0M552dxp8i2c7giFbWZoxH6ZIteQsLeo\niMiendrcM8W/XMPnA5sQtV0RAXbz8qCe+9Hrz0QMXb5XGaS75GrQRBa2j84OXF2i\nR8DM4/CNnBYPC26faE+iONCqo1L8nJSzQVYK3PxsLU1uTfCDKdu5BrWraZ0Aq+HT\nBjAJpUUdEKgEw919u+Vde6oi+szzSvrdIkoWBDQSzQKBgQDaJWHQ38El3B/d4lyS\njIoixjU5yZTK/BksaL56wGRraKuXDXR5T9tI2KyebV7fxFcRbgCvmQ03G3qTS8H9\n5uOgpUInCer/+sNikFbxRNx8NU1amqiqPR8oJnMMg7mLwis99QJXw3IQHOYx9GUz\nroHAJz8wNat8do9zD7BX7TOQfQKBgQC5UYWWt0le5z1Q/nDDhnZQsbgFHXs9V9kQ\nC2eWcHfFmxkXQZ6bvK4lXn6k/BXaTZ5ykUT9OaAdVYjrKr4BkdRihTZVD/FjkhJS\nMNaZbUc1AHDXBiT6A5nFHck3vXkwxIop1OeMUrYwqcZNWlYny5+syustYWUcqVEu\nXMNSRFpnlwKBgEPrgbIcCLI2AEIAeZwzX8sF9YqBhe9RYLEgB7aGcn2ywEIusUYY\nJAlhVRWargBzzDwkCNijiabPynFUFBluqw7YhWlMQDvlIrJsiHVkYFXX7ra4Eq22\njB3fItERrlKiaP5Ia6tRshDsPovtMRlPSxy924GyJCuDapSDnP8zXmutAoGBAKhT\nrAviH/rb/436D2MKV52kT4oV5UMq8DbqpQS405Hh90BwkijTkTrQQiiJ8S+BIVLf\nMNLx7MW4U82H3V5/n3J9nYRWHuRaYdnWEpb585vo8pXdNukBLEMncwX2TIZHf1fP\n0yJaXrKFA2Jvk6JCCp9hEYz+0mDeSqbaC3BGNfexAoGAcli+EJVs1Vd548QA03Cz\n71gUM0PIFduDezvhc1ucl5vI8USZMQWYl65nMyvQXGqd30qYxIzXQuf6GU4KVjiO\nACEy7NO7pkIgkO9DKIHL2qBeXHqBfGI8LB/EslDcviVDtA70fxIdDnFwmi4pxowv\nNdn4Y02sOkQfcHJkILFabpM=\n-----END PRIVATE KEY-----\n',
  scopes
);
const jwtClienBusiness = new google.auth.JWT(
  '194654778175-compute@developer.gserviceaccount.com',
  'client_id.json',
  '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCd6ntZvrFzj3vt\nu+f2J2K/yEU6hb55QQutNO+fT4c9UCmFPlUCjMbmsG1SkzU/ImdY3DjRwqRRdlrK\nilMoC/Ybn83ClkXHoRVsfQYBg4u1q9Jp0FYlwmJjmutGcSkWXbtPhpXMgo276RcX\n+v5Di9KNMXFjzl3mM60OV4mwD0a2GjKhvSU/EXeMnj7nCelPnoTItkH0LzGiVz2Y\nrWTagvUmAOys3QdFoqpmiKnZIChGb9D7DfhPJOSk9oJbsChPzEk+GiWi1ezExomY\nRUnGK8G69AjtbjgHX4DsIhQBMibytIlllFET96u9Amb+HaM+JfnYwKQ9NA15Jyye\n+diofoS7AgMBAAECggEAC6oRGsPCphdgSeL6KHen9s7gtN4XKoFa+Zwc4lwZ+wtA\n8zYeSmDCpQc9c/7VTTNfMImdFXq2miEku1bfUJMdm9RrJZHlrUVhPeZi5gQPnZzc\n9HLul2hrIxIDiexRjXThS+epiKB7aU4M0M552dxp8i2c7giFbWZoxH6ZIteQsLeo\niMiendrcM8W/XMPnA5sQtV0RAXbz8qCe+9Hrz0QMXb5XGaS75GrQRBa2j84OXF2i\nR8DM4/CNnBYPC26faE+iONCqo1L8nJSzQVYK3PxsLU1uTfCDKdu5BrWraZ0Aq+HT\nBjAJpUUdEKgEw919u+Vde6oi+szzSvrdIkoWBDQSzQKBgQDaJWHQ38El3B/d4lyS\njIoixjU5yZTK/BksaL56wGRraKuXDXR5T9tI2KyebV7fxFcRbgCvmQ03G3qTS8H9\n5uOgpUInCer/+sNikFbxRNx8NU1amqiqPR8oJnMMg7mLwis99QJXw3IQHOYx9GUz\nroHAJz8wNat8do9zD7BX7TOQfQKBgQC5UYWWt0le5z1Q/nDDhnZQsbgFHXs9V9kQ\nC2eWcHfFmxkXQZ6bvK4lXn6k/BXaTZ5ykUT9OaAdVYjrKr4BkdRihTZVD/FjkhJS\nMNaZbUc1AHDXBiT6A5nFHck3vXkwxIop1OeMUrYwqcZNWlYny5+syustYWUcqVEu\nXMNSRFpnlwKBgEPrgbIcCLI2AEIAeZwzX8sF9YqBhe9RYLEgB7aGcn2ywEIusUYY\nJAlhVRWargBzzDwkCNijiabPynFUFBluqw7YhWlMQDvlIrJsiHVkYFXX7ra4Eq22\njB3fItERrlKiaP5Ia6tRshDsPovtMRlPSxy924GyJCuDapSDnP8zXmutAoGBAKhT\nrAviH/rb/436D2MKV52kT4oV5UMq8DbqpQS405Hh90BwkijTkTrQQiiJ8S+BIVLf\nMNLx7MW4U82H3V5/n3J9nYRWHuRaYdnWEpb585vo8pXdNukBLEMncwX2TIZHf1fP\n0yJaXrKFA2Jvk6JCCp9hEYz+0mDeSqbaC3BGNfexAoGAcli+EJVs1Vd548QA03Cz\n71gUM0PIFduDezvhc1ucl5vI8USZMQWYl65nMyvQXGqd30qYxIzXQuf6GU4KVjiO\nACEy7NO7pkIgkO9DKIHL2qBeXHqBfGI8LB/EslDcviVDtA70fxIdDnFwmi4pxowv\nNdn4Y02sOkQfcHJkILFabpM=\n-----END PRIVATE KEY-----\n',
  scopes
);
const analytics = google.analyticsreporting('v4');

const getAnalytics = (resend, req) => {
  jwtClient
    .authorize((err, tokens) => {
      if (err) {
        log.error('error connect to google');
        log.error(err);
        throw Error(err);
      }
      log.info('success connect to google');

      oauth2Client.setCredentials({
        access_token: tokens.access_token
      });
      req.reportRequests[0].viewId = VIEW_ID;

      const request = {
        headers: { 'Content-Type': 'application/json' },
        auth: oauth2Client,
        resource: req
      };

      analytics.reports.batchGet(request, (error, response) => {
        if (error) {
          log.error(error);
          throw Error(error);
        }

        resend.send(response.data.reports[0].data.rows);
      });
    })
    .catch((err) => {
      log.error(err);
    });
};

const getAnalyticsBusiness = (resend, req) => {
  jwtClienBusiness
    .authorize((err, tokens) => {
      if (err) {
        log.error('error connect to google');
        log.error(err);
        throw Error(err);
      }
      log.info('success connect to google');

      oauth2Client.setCredentials({
        access_token: tokens.access_token
      });
      req.reportRequests[0].viewId = VIEW_ID_BUSINESS;

      const request = {
        headers: { 'Content-Type': 'application/json' },
        auth: oauth2Client,
        resource: req
      };

      analytics.reports.batchGet(request, (error, response) => {
        if (error) {
          log.error(error);
          throw Error(error);
        }

        resend.send(response.data.reports[0].data.rows);
      });
    })
    .catch((err) => {
      log.error(err);
    });
};

const updateUsersInfo = () => {
  jwtClient
    .authorize((err, tokens) => {
      if (err) {
        log.error('error connect to google');
        log.error(err);
        throw Error(err);
      }
      const settings = {
        reportRequests: [
          {
            dateRanges: [
              {
                startDate: '2018-01-01',
                endDate: 'today'
              }
            ],
            metrics: [
              {
                expression: 'ga:sessions'
              }
            ],
            dimensions: [
        {
          name: 'ga:country',
        },
      ],
        }
        ]
      };
      log.info('success connect to google');

      oauth2Client.setCredentials({
        access_token: tokens.access_token
      });
      settings.reportRequests[0].viewId = VIEW_ID;

      const request = {
        headers: { 'Content-Type': 'application/json' },
        auth: oauth2Client,
        resource: settings
      };

      analytics.reports.batchGet(request, (error, response) => {
        if (error) {
          log.error(error);
          throw Error(error);
        }
        log.debug('response.data ==== response.data ==== response.data', response.data);
      });
    });
};
module.exports = {
  getAnalytics,
  updateUsersInfo,
  getAnalyticsBusiness
};
