import types from './types';

import {
  getCompanies as apiGetCompanies,
  deleteCompany as apiDeleteCompany,
  updateCompany as apiUpdateCompany,
} from 'services/api';

import { actions as requestActions } from 'reducers/request';

export const getCompanies = () => async (dispatch, getState) => {
  const { limit, skip } = getState().reports.params;
  dispatch(requestActions.start());
  dispatch({ type: types.GET_COMPANIES_START });

  try {
    const response = await apiGetCompanies(limit, skip);
    console.log(response);
    dispatch(requestActions.success());
    dispatch({ type: types.GET_COMPANIES_SUCCESS, payload: { companiesList: response.data.data } });
  } catch (error) {
    dispatch(requestActions.fail(error));
    dispatch({ type: types.GET_COMPANIES_FAIL });
  }
};

export const deleteCompany = businessUserId => async dispatch => {
  dispatch(requestActions.start());
  dispatch({ type: types.DELETE_COMPANY_START });

  try {
    const response = await apiDeleteCompany(businessUserId);
    console.log(response);
    if (response.data.status === 'OK') {
      dispatch(getCompanies());
    }
    dispatch(requestActions.success());
    dispatch({ type: types.DELETE_COMPANY_SUCCESS });
  } catch (error) {
    dispatch(requestActions.fail(error));
    dispatch({ type: types.DELETE_COMPANY_FAIL });
  }
};

export const setCompanyToUpdate = company => ({
  type: types.SET_COMPANY_TO_UPDATE,
  payload: { company },
});

export const onChangeCompanyFormField = (e, fieldTitle) => ({
  type: types.ON_CHANGE_COMPANY_FORM_FIELD,
  payload: {
    text: e.target.value,
    fieldTitle,
  },
});

export const updateCompany = () => async (dispatch, getState) => {
  const { id, email, brandName, mobileNumbers } = getState().companies.companyToUpdate;
  console.log(id, email, brandName, mobileNumbers);
  dispatch(requestActions.start());
  dispatch({ type: types.UPDATE_COMPANY_START });

  try {
    const response = await apiUpdateCompany(id, { email, brandName, mobileNumbers });
    console.log(response);
    if (response.data.status === 'OK') {
      dispatch(getCompanies());
    }
    dispatch(requestActions.success());
    dispatch({ type: types.UPDATE_COMPANY_SUCCESS });
  } catch (error) {
    dispatch(requestActions.fail(error));
    dispatch({ type: types.UPDATE_COMPANY_FAIL });
  }
};

export const filterCompaniesByCountry = country => (dispatch, getState) => {
  const { companiesList } = getState().companies;

  const filteredData = companiesList.filter(company => company.country === country);
  dispatch({
    type: types.FILTER_COMPANIES_BY_COUNTRY,
    payload: { country, filteredData },
  });
};

export const filterCompaniesBySearch = e => (dispatch, getState) => {
  const { companiesList, selectedCountry } = getState().companies;
  const searchTarget = e.target.value.toLowerCase();
  const filteredData = companiesList.filter(company => {
    const lowerName = company.brandName.toLowerCase();
    if (selectedCountry) {
      return company.country === selectedCountry &&
        (lowerName.includes(searchTarget) ||
          company.email.includes(searchTarget) ||
          company.mobileNumbers[0].includes(searchTarget));
    }
    return lowerName.includes(searchTarget) ||
      company.email.includes(searchTarget) ||
      company.mobileNumbers[0].includes(searchTarget);
  });

  dispatch({
    type: types.FILTER_COMPANIES_BY_SEARCH,
    payload: { filteredData }
  });
};

export const turnOffCompaniesFilter = () => ({
  type: types.TURN_OFF_COMPANIES_FILTER,
});
