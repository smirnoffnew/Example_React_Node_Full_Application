const ROLE = 'admin';

const init = (ACE) => {
  ACE.addPermission(ROLE, '*');
};

module.exports.init = init;
