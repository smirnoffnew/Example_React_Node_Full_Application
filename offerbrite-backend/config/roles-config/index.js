const user = require('./user');
const admin = require('./admin');
const businessUser = require('./businessUser');
const AccessControlEngine = require('../../server/helpers/roles-permissions/AccessControlEngine');

const ACE = new AccessControlEngine();
user.init(ACE);
businessUser.init(ACE);
admin.init(ACE);

ACE.addPermission('*', 'businessUser:create');
ACE.addPermission('*', 'user:create');
ACE.addPermission('*', 'category:list');
ACE.addPermission('*', 'category:get');
ACE.addPermission('*', 'business:list');
ACE.addPermission('*', 'business:get');
ACE.addPermission('*', 'offer:get');
ACE.addPermission('*', 'offer:list');

module.exports = ACE;
