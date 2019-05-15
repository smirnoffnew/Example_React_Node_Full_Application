import Types from './types';
import { sendDeviceToken as apiSendDeviceToken } from '@/services/api';

export const onGenerateToken = info => ({
  type: Types.ON_GENEGATE_TOKEN,
  payload: {
    operationSystem: info.os,
    token: info.token,
  },
});

export const sendDeviceToken = (userId, data) => dispatch => {
  dispatch({ type: Types.SEND_DEVICE_TOKEN_START });

  apiSendDeviceToken(userId, data)
    .then(response => {
      if (response.status === 200) {
        dispatch({ type: Types.SEND_DEVICE_TOKEN_SUCCESS });
      }
    })
    .catch(() => {
      dispatch({ type: Types.SEND_DEVICE_TOKEN_FAIL });
    });
};
