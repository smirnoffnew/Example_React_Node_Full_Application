const User = require('../user/user.model');
const config = require('../../../config/index');
const mailer = require('../../services/mailer');
const utils = require('../../helpers/utils/index');
const log = require('../../helpers/winston')
  .getLogger({ name: 'auth.ctrl' });
/**
 * Login to user's account
 * @param {Express.Request} req request object
 * @param {Express.Response} res response object
 */
const login = (req, res) => res.json({
  user: req.authUser.toJSON(),
  tokens: req.authUser.genAuthTokens()
});
/**
 * Returns user's own profile by it's token
 * @param {Express.Request} req request object
 * @param {Express.Response} res response object
 */
const get = (req, res) => res.json(req.authUser.toJSON());
/**
 * Protected route, used for check, is token valid
 * @param {Express.Request} req request object
 * @param {Express.Response} res response object
 */
const check = (req, res) => res.json({
  status: 'OK'
});

/**
 * Generates new access token
 * @param {Express.Request} req request object
 * @param {Express.Response} res response object
 */
const genAccessToken = (req, res) => res.json(req.authUser.genJWTAccessToken());

/**
 * Resets user's password
 * @param {Express.Request} req request object
 * @param {Express.Response} res response object
 * @param {Express.Next} next next object
 * @property {Promise<string>} req.body.password - The password of user.
 */
const resetPasswordUser = async (req, res, next) => {
  try {
    const user = req.authUser;
    user.password = req.body.password;
    log.info('user %s updated password', user.id);
    await user.save();
    return res.json({ status: 'OK' });
  } catch (err) {
    return next(err);
  }
};

/**
 * Sends letter with reset password auth token to user's email
 * @param {Express.Request} req request object
 * @param {Express.Response} res response object
 * @param {Express.Next} next next object
 * @property {Promise<string>} req.body.email - The email of user.
 */
const sendResetPasswordTokenUser = async (req, res, next) => {
  try {
    const user = await User.getByEmail(req.body.email);
    const token = await user.genJWTPasswordResetToken();
    mailer.sendLetter(
      user.email,
      utils.emailsLettersBuilder.getResetPasswordLetter(user, {
        token
      }),
      'Follow link to reset password'
    );
    log.info('user %s initialized password reset', user.id);
    return res.json({
      status: 'OK',
      token: config.isProduction ? undefined : token
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  sendResetPasswordTokenUser,
  login,
  get,
  check,
  genAccessToken,
  resetPasswordUser
};
