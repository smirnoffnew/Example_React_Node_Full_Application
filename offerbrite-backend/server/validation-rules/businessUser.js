module.exports = {
  password: {
    regExp: /^(?=.*\d)(?=.*[A-Za-z]).*$/,
    min: 6,
    max: 20
  },
  username: {
    max: 20,
    min: 2,
    regExp: /^(\w+\.? *\w*)+$/
  }
};
