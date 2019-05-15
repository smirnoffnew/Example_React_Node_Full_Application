import types from './types';

const initialState = {
  email: '',
  password: '',
  rememberSession: true,
  admin: {},
  access: {
    token: '',
    expiredIn: 0,
  },
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.SET_TOKEN:
      return { ...state, access: action.payload.access };

    case types.SET_ADMIN:
      return { ...state, admin: action.payload.admin };

    case types.ON_CHANGE_LOGIN:
      const { inputName, text } = action.payload;
      return { ...state, [inputName]: text };

    case types.ON_TOGGLE_REMEMBER_SESSION:
      return { ...state, rememberSession: !state.rememberSession };

    case types.LOGIN_SUCCESS:
      const { admin, access } = action.payload;
      return { ...state, admin, access };

    case types.LOGOUT:
      return initialState;

    default:
      return state;
  }
};
