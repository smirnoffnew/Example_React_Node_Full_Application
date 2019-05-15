import isUrl from 'is-url';

export const required = value => value ? undefined : 'Required';

export const isMinLength = minLength => value =>
  value && value.length >= minLength
    ? undefined
    : `Must contain minimum ${minLength} characters`;

export const isMaxLength = maxLength => value =>
  value && value.length <= maxLength
    ? undefined
    : `Must contain maximum ${maxLength} characters`;

export const isExactLength = exactLength => value =>
  value && value.length === exactLength
    ? undefined
    : `Must be ${exactLength} characters long`;

export const isNumber = value => value && isNaN(Number(value)) ? 'Must be a number' : undefined;

export const isValidName = value => value && /^(\w+\.? *\w*)+$/.test(value) ? undefined : 'Please enter a valid name';

export const isValidEmail = value =>
  value && !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value.trim())
    ? 'Invalid email address'
    : undefined;

export const isPasswordSafe = value =>
  value && /^(?=.*\d)(?=.*[A-Za-z]).*$/.test(value)
    ? undefined
    : 'This password isn\'t safe. It should contain at least one number';

export const isSignInPasswordValid = value => (
  value && /^(?=.*\d)(?=.*[A-Za-z]).[^\s]{6,20}$/.test(value) ?
    undefined :
    'The password is not valid. It should be 6-20 characters long.'
);

export const isValidDiscount = value =>
  value && value < 100 && value >= 0
    ? undefined
    : !value
      ? undefined
      : 'Please enter a valid discount from 0 to 99';

export const isValidUrl = value => {
  if (!value) {
    return undefined;
  } else if (value && /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(value.trim())) {
    return undefined;
  }
  return 'Please enter a valid url';
};

export const isValidMobileNumber = value => {
  if (!value) {
    return undefined;
  } else {
    if (isNaN(Number(value))) {
      return 'Must be a number';
    } else if (value.length < 8) {
      return 'Must contain minimum 8 characters';
    } else if (value.length > 12) {
      return 'Must contain maximum 12 characters';
    }
  }
};

export const isPriceValid = value => value && isNaN(Number(value)) ?
  'Must be a number' :
  undefined;

export const offerTitle = [
  required,
  isMinLength(3),
  isMaxLength(50),
];

export const urlValidation = [
  isValidUrl,
];

export const mobileNumberValidation = [
  required,
  isValidMobileNumber,
];

export const usernameValidation = [
  isValidName,
  isMinLength(2),
  isMaxLength(20),
];

export const emailValidation = [
  required,
  isValidEmail,
];

export const passwordValidation = [
  required,
  isMinLength(6),
  isMaxLength(20),
  isPasswordSafe,
];

export const signinPasswordValidation = [
  required,
  isMinLength(6),
  isMaxLength(20),
  isPasswordSafe,
];

export const priceValidation = [
  isPriceValid,
];

export const discountValidation = [
  isNumber,
  isValidDiscount,
];
