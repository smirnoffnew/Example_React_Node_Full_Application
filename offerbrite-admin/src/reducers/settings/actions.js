import types from './types';

export const onChangeUsersTableSettings = setting => ({
  type: types.ON_CHANGE_USERS_TABLE_SETTINGS,
  payload: { setting },
});

export const onChangeCompaniesTableSettings = setting => ({
  type: types.ON_CHANGE_COMPANIES_TABLE_SETTINGS,
  payload: { setting },
});

export const onChangeOffersTableSettings = setting => ({
  type: types.ON_CHANGE_OFFERS_TABLE_SETTINGS,
  payload: { setting },
});

export const setSettingsFromStorage = settings => ({
  type: types.SET_SETTINGS_FROM_STORAGE,
  payload: { settings: JSON.parse(settings) },
});
