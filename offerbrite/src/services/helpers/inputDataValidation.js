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

export const isValidName = value => value && /^(\w+\.? *\w*)+$/.test(value.trim()) ? undefined : 'Please enter a valid name';

export const isValidEmail = value =>
  value && !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value.trim())
    ? 'Invalid email address'
    : undefined;

export const isPasswordSafe = value =>
  value && /^(?=.*\d)(?=.*[A-Za-z]).*$/.test(value)
    ? undefined
    : 'This password isn\'t safe. It should contain at least one number';

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
];
