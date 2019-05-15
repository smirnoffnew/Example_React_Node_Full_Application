const _ = require('lodash');
const httpStatus = require('http-status');
const APIError = require('../APIError');

class AccessControlEngine {
  constructor(opts = {}) {
    this.init(opts);
  }

  init(acl) {
    if (!_.isObject(acl)) {
      throw new Error('Expected object for roles definition');
    }
    this.roles = {};
    _.forEach(acl, (rules, role) => {
      this.roles[role] = _.reduce(
        rules,
        (rulesForRole, rule) => {
          if (_.isString(rule)) {
            rulesForRole[rule] = true;
          } else if (_.isString(rule.action) && _.isFunction(rule.when)) {
            rulesForRole[rule.action] = rule.when;
          } else {
            throw new Error(`Invalid rule definition for ${role}:${rule}`);
          }
          return rulesForRole;
        },
        {}
      );
    });
  }

  checkAccess(role, action, params) {
    const rulesForRole = this.roles[role] || this.roles['*'];
    if (rulesForRole) {
      if (rulesForRole['*']) {
        return true;
      }
      if (rulesForRole[action]) {
        if (!_.isFunction(rulesForRole[action])) {
          return true;
        }
        return rulesForRole[action](params);
      }
    }
    return false;
  }

  addPermission(role, ...permission) {
    const roles = _.flatten([role]);
    const permissions = _.flatten([permission]);
    _.forEach(roles, (roleName) => {
      _.forEach(permissions, (rule) => {
        if (_.isString(rule)) {
          _.set(this.roles, `${roleName}.${rule}`, true);
        } else {
          _.set(this.roles, `${roleName}.${rule.action}`, rule.when || true);
        }
      });
    });
  }

  removePermission(role, action) {
    delete this.roles[role][action];
  }

  middleware(role, action, params) {
    return async (req, res, next) => {
      if (await this.checkAccess(role, action, params)) {
        return next();
      }
      return next(new APIError(null, httpStatus.FORBIDDEN, false));
    };
  }
}

module.exports = AccessControlEngine;
