const pug = require('pug');
const config = require('../../../config');
const url = require('url');

const resetPasswordTemplateFunc = pug.compileFile(config.resources.resetPasswordTemplate);
/**
 * renders .pug letter template for password reset
 * @param {User} user - destination user
 * @property {string} token - token, to be encoded into letter
 * @returns {string} - rendered template for letter
 */
const getResetPasswordLetter = (user, { token }) => resetPasswordTemplateFunc({
  email: user.email,
  url: url.resolve(config.host, `/reset-password?token=${token}`),
  username: user.username
});

/**
 * renders .pug letter template for password reset for business user
 * @param {User} user - destination user
 * @property {string} token - token, to be encoded into letter
 * @returns {string} - rendered template for letter
 */
const getResetPasswordLetterForBusinessUser = (user, { token }) => resetPasswordTemplateFunc({
  email: user.email,
  url: url.resolve(config.host, `/business-users/reset-password?token=${token}`),
  username: user.username
});

module.exports = {
  getResetPasswordLetter,
  getResetPasswordLetterForBusinessUser
};
