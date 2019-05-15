const ROLE = 'businessUser';

const isAuthenticatedBusinessUser = ({ authUser }) => !!authUser;

const isBusinessUserProfileOwner = ({ businessUser, authUser }) => {
  if (!authUser || !businessUser) return false;
  return String(businessUser.id) === String(authUser.id);
};
const isBusinessOwner = ({ business, authUser }) => {
  if (!authUser || !business) return false;
  return business.isOwner(authUser);
};
const isOfferOwner = ({ offer, authUser }) => {
  if (!offer || !authUser) return false;
  return offer.isOwner(authUser);
};

const init = (ACE) => {
  // offers
  ACE.addPermission(ROLE, {
    action: 'offer:create',
    when: isBusinessOwner
  });
  ACE.addPermission(ROLE, {
    action: 'offer:update',
    when: isOfferOwner
  });
  ACE.addPermission(ROLE, {
    action: 'offer:delete',
    when: isOfferOwner
  });
  // businesses
  ACE.addPermission(ROLE, 'business:create');
  ACE.addPermission(ROLE, {
    action: 'business:update',
    when: isBusinessOwner
  });
  ACE.addPermission(ROLE, {
    action: 'business:delete',
    when: isBusinessOwner
  });
  // storages
  ACE.addPermission(ROLE, {
    action: 'storage:uploadImage',
    when: isAuthenticatedBusinessUser
  });
  // USER
  ACE.addPermission(ROLE, {
    action: 'user:list',
    when: isBusinessUserProfileOwner
  });
  ACE.addPermission(ROLE, {
    action: 'user:get',
    when: isAuthenticatedBusinessUser
  });

  ACE.addPermission(ROLE, {
    action: 'businessUser:update:password',
    when: isBusinessUserProfileOwner
  });
  ACE.addPermission(ROLE, {
    action: 'businessUser:update:email',
    when: isBusinessUserProfileOwner
  });
  ACE.addPermission(ROLE, {
    action: 'businessUser:update',
    when: isBusinessUserProfileOwner
  });
  ACE.addPermission(ROLE, {
    action: 'businessUser:get',
    when: isAuthenticatedBusinessUser
  });
  ACE.addPermission(ROLE, {
    action: 'businessUser:list',
    when: isAuthenticatedBusinessUser
  });
  ACE.addPermission(ROLE, {
    action: 'businessUser:delete',
    when: isBusinessUserProfileOwner
  });
};

module.exports.init = init;
