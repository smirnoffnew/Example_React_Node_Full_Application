import types from './types';

const initialState = {
  users: [
    { label: 'User id', value: true },
    { label: 'Name', value: true },
    { label: 'Email', value: true },
    { label: 'Country', value: true },
    { label: 'Categories', value: true },
  ],
  companies: [
    { label: 'Company id', value: true },
    { label: 'Name', value: true },
    { label: 'Email', value: true },
    { label: 'Country', value: true },
    { label: 'Phone', value: true },
    { label: 'Website', value: true },
    // { label: 'Profile status', value: false },
  ],
  offers: [
    { label: 'Offer id', value: true },
    { label: 'Title', value: true },
    { label: 'Description', value: false },
    { label: 'Category', value: true },
    { label: 'Price', value: false },
    { label: 'Discount', value: false },
    { label: 'Address', value: true },
  ],
};

const copyAndChangeSetting = (data, setting, state, selector) => {
  const updatedSettings = data.map(item => {
    if (item.label === setting) {
      return { ...item, value: !item.value };
    }
    return item;
  });
  localStorage.removeItem('settings');
  localStorage.setItem('settings', JSON.stringify({
    ...state,
    [selector]: updatedSettings,
  }));
  return updatedSettings;
};

export default (state = initialState, action) => {
  let setting;
  switch (action.type) {
    case types.SET_SETTINGS_FROM_STORAGE:
      return { ...state, ...action.payload.settings };

    case types.ON_CHANGE_USERS_TABLE_SETTINGS:
      setting = action.payload.setting;
      return {
        ...state,
        users: copyAndChangeSetting(state.users, setting, state, 'users'),
      };
    case types.ON_CHANGE_COMPANIES_TABLE_SETTINGS:
      setting = action.payload.setting;
      return {
        ...state,
        companies: copyAndChangeSetting(state.companies, setting, state, 'companies'),
      };
    case types.ON_CHANGE_OFFERS_TABLE_SETTINGS:
      setting = action.payload.setting;
      return {
        ...state,
        offers: copyAndChangeSetting(state.offers, setting, state, 'offers'),
      };
    default:
      return state;
  }
};
