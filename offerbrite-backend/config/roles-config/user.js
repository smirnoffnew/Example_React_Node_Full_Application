const ROLE = 'user';
const isUserProfileOwner = ({ user, authUser }) => {
  if (!user || !authUser) {
    return false;
  }
  return String(user.id) === String(authUser.id);
};

const isAuthenticated = ({ authUser }) => !!authUser;

const init = (ACE) => {
  // business users
  ACE.addPermission(ROLE, {
    action: 'businessUser:get',
    when: isAuthenticated
  });
  ACE.addPermission(ROLE, {
    action: 'businessUser:list',
    when: isAuthenticated
  });
  // users
  ACE.addPermission(ROLE, {
    action: 'user:list:favouritesOffers',
    when: isUserProfileOwner
  });
  ACE.addPermission(ROLE, {
    action: 'user:update:password',
    when: isUserProfileOwner
  });
  ACE.addPermission(ROLE, {
    action: 'user:update:email',
    when: isUserProfileOwner
  });
  ACE.addPermission(ROLE, {
    action: 'user:update',
    when: isUserProfileOwner
  });
  ACE.addPermission(ROLE, {
    action: 'user:get',
    when: isAuthenticated
  });
  ACE.addPermission(ROLE, {
    action: 'user:list',
    when: isAuthenticated
  });
  ACE.addPermission(ROLE, {
    action: 'user:delete',
    when: isUserProfileOwner
  });
  // favourites offers
  ACE.addPermission(ROLE, {
    action: 'user:favouritesOffers:get',
    when: isUserProfileOwner
  });
  ACE.addPermission(ROLE, {
    action: 'user:favouritesOffers:create',
    when: isUserProfileOwner
  });
  ACE.addPermission(ROLE, {
    action: 'user:favouritesOffers:delete',
    when: isUserProfileOwner
  });
  ACE.addPermission(ROLE, {
    action: 'user:favouritesOffers:list',
    when: isUserProfileOwner
  });
};

module.exports.init = init;
