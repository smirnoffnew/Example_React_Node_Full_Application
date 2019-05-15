import { AsyncStorage } from 'react-native';

export const saveSession = async response => {
  await AsyncStorage.multiSet([
    ['access', JSON.stringify(response.tokens.access)],
    ['refresh', JSON.stringify(response.tokens.refresh)],
    ['user', JSON.stringify(response.user)],
  ]);
};

export const saveUser = async user => {
  await AsyncStorage.setItem('user', JSON.stringify(user));
};

export const saveAccessToken = async accessToken => {
  await AsyncStorage.setItem('access', JSON.stringify(accessToken));
};

export const saveBusiness = async business => {
  await AsyncStorage.setItem('business', JSON.stringify(business));
};

export const removeSession = async () => {
  await AsyncStorage.multiRemove([
    'access',
    'refresh',
    'user',
  ]);
};

export const getTokens = () => AsyncStorage.multiGet(['access', 'refresh']);

export const parseTokens = data => {
  const tokens = {};
  if (data[0][1]) {
    data.forEach(element => {
      tokens[element[0]] = JSON.parse(element[1]);
    });

    return tokens;
  }
  return null;
};
