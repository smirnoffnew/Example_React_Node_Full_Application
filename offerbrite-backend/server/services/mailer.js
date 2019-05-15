const nodemailer = require('nodemailer');
const config = require('../../config');
const log = require('../helpers/winston')
  .getLogger({ name: 'mailer' });
const _ = require('lodash');

const transporter = nodemailer.createTransport({
  service: config.mailer.emailService,
  secure: true,
  tls: {
    rejectUnauthorized: false
  },
  auth: {
    user: config.mailer.emailAddress,
    pass: config.mailer.emailPassword
  }
});

transporter.verify((error) => {
  if (error) {
    log.error('Server cannot send messages');
    log.error(error);
    throw error;
  } else {
    log.info('Server is ready to send messages');
  }
});

function sendLetter(destination, html, subject) {
  const mail = {
    from: config.auth.emailAddress,
    to: destination,
    subject,
    html
  };
  log.info(`Sent mail ${subject} to ${destination}`);
  transporter.sendMail(mail);
}

module.exports = {
  // send mails only in production
  sendLetter: config.isProduction ? sendLetter : _.noop
};
