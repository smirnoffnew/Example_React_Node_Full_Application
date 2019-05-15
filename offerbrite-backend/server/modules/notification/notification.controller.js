const Notification = require('./notification.model');
const log = require('../../helpers/winston').getLogger({ module });
const User = require('../user/user.model');
const serviceAcc = require('./offerbrite-216205-firebase-adminsdk-7xjul-4510ab8348.json');
const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert(serviceAcc),
  databaseURL: 'https://offerbrite-216205.firebaseio.com'
});

const calculateDeliverTime = (date, time) => {
  const currentDate = new Date();

  const inputDate = new Date(`${date} ${time}`);

  const endTime = inputDate.getTime() - currentDate.getTime();

  log.info(
    `data was data was data was data was data was data was data was data was ${
      endTime > 0 ? endTime : 1000
    }`
  );

  return endTime > 0 ? endTime : 1000;
};

/**
 * Sended sended notification after time end
 * @param {Notification.id} notificationId id notification
 * @param {User.token} token token user for notification
 * @param {milliseconds} time time for timeout
 */

const sendNotificationAfterTime = async (notificationId, token, time) => {
  log.info('Start send notifications');
  setTimeout(async () => {
    log.info('Start timeout  send notifications');

    const notification = await Notification.findById(notificationId);
    log.info('notification was find, start send notification');

    await admin.messaging().sendToDevice(
      token,
      {
        notification: {
          title: notification.title || '',
          body: notification.message,
          color: '#18d821',
          sound: 'default'
        }
      },
      {
        timeToLive: 86400,
        priority: 'high'
      }
    );
    log.info('end send notification');
  }, time);
};

/**
 * Send nitification
 * @param {Express.Request} req request object
 * @param {Express.Response} res response object
 * @param {Express.Next} next next middleware
 */
const sendNotification = async (req, res) => {
  try {
    if (req.authUser.role === 'admin' || req.authUser.role === 'super-admin') {
      const { token, title, text } = req.body;

      const notificationRes = await admin.messaging().sendToDevice(
        token,
        {
          notification: {
            title,
            body: text,
            tag: 'newMessage',
            color: '#18d821',
            sound: 'default'
          }
        },
        {
          timeToLive: 86400,
          priority: 'high'
        }
      );

      if (notificationRes.results[0].messageId) {
        const date = new Date();
        const newNotification = await Notification.create({
          title,
          message: text,
          category: 'all',
          date,
          time: `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        });
        return res
          .status(200)
          .json({ status: 'OK', message: 'notification sended!', newNotification });
      }
      return res.status(notificationRes.status).json({ message: `${notificationRes.statusText}` });
    }
    return res.status(401).json({ status: 'ERROR', message: 'You have incorrect role!' });
  } catch (e) {
    log.error(e);
    return res.status(500).send(e);
  }
};

/**
 * send normal notofication to groups users
 * @param {Express.Request} req request object
 * @param {Express.Response} res response object
 */

const sendAdminNotification = async (req, res) => {
  try {
    if (req.authUser.role === 'admin' || req.authUser.role === 'super-admin') {
      const {
 time, text, title, date
} = req.body;
      const usersForNotification = await User.find({ isNotificationsEnabled: true, ...req.query });

      if (usersForNotification.length) {
        const newNotification = await Notification.create({
          title,
          message: text,
          category: req.query.category || 'All',
          date,
          time
        });
        await Promise.all(
          usersForNotification.map(async (user) => {
            log.info('Start fucntion for send notofocation!');
            if (user.token) {
              sendNotificationAfterTime(
                newNotification.id,
                user.token,
                calculateDeliverTime(date, time)
              );
            }
            return newNotification;
          })
        );
        return res.status(200).json({ status: 'OK', data: await newNotification });
      }
      return res
        .status(404)
        .json({ status: 'ERROR', message: 'Users by this filter is not defined!' });
    }
    return res.status(401).json({ status: 'ERROR', message: 'You have incorrect role!' });
  } catch (e) {
    return res.status(500).send(e);
  }
};

/**
 * List notification
 * @param {Express.Request} req reqest object
 * @param {Express.Response} res response object
 * @returns {<Notifications, Error>}
 */

const list = async (req, res) => {
  try {
    if (req.authUser.role === 'admin' || req.authUser.role === 'super-admin') {
      const notofications = await Notification.find()
        .limit(req.params.limit)
        .skip(req.params.skip);
      return res.status(200).json({ status: 'OK', data: notofications });
    }
    return res.status(401).json({ status: 'ERROR', message: 'You have incorrect role' });
  } catch (e) {
    return res.status(500).send(e);
  }
};

const getOne = async (req, res) => {
  try {
    if (req.authUser.role === 'admin' || req.authUser.role === 'super-admin') {
      const notification = await Notification.findById(req.params.notificationId);
      if (notification != null) {
        return res.status(200).json({ status: 'OK', data: notification });
      }
      return res.status(404).json({
        status: 'ERROR',
        message: `Notification with id #${req.params.notificationId} is not defined!`
      });
    }
    return res.status(401).json({ status: 'ERROR', message: 'You have incorrect role!' });
  } catch (e) {
    return res.status(500).send(e);
  }
};

const updateOne = async (req, res) => {
  try {
    if (req.authUser.role === 'admin' || req.authUser.role === 'super-admin') {
      const updatedNotification = await Notification.findByIdAndUpdate(req.params.notificationId, {
        ...req.body
      });
      if (updatedNotification != null) {
        return res
          .status(200)
          .json({ status: 'OK', message: 'Notification updated', updatedNotification });
      }
      return res.status(404).json({
        status: 'ERROR',
        message: `Notification with id #${req.params.notificationId} is not defined!`
      });
    }
    return res.status(401).json({ status: 'ERROR', message: 'You have incorrect role!' });
  } catch (e) {
    return res.status(500).send(e);
  }
};

/**
 * admin can delete notification by id
 * @param {Express.Request} req request object
 * @param {Express.Response} res response object
 */

const deleteById = async (req, res) => {
  try {
    if (req.authUser.role === 'admin' || req.authUser.role === 'super-admin') {
      const deletedNotification = await Notification.findByIdAndRemove(req.params.notificationId);
      if (deletedNotification != null) {
        return res
          .status(200)
          .json({ status: 'OK', message: 'Notification deleted!', deletedNotification });
      }
      return res.status(404).json({
        status: 'ERROR',
        message: `Notification with id ${req.params.notificationId} is not defined`
      });
    }
    return res.status(401).json({ status: 'ERROR', message: 'You have a bad role' });
  } catch (e) {
    return res.status(500).send(e);
  }
};

module.exports = {
  sendNotification,
  list,
  deleteById,
  sendAdminNotification,
  getOne,
  updateOne
};
