import _ from 'lodash';

const isNilOrEmpty = _.overSome([_.isNil, _.isEmpty]);

const defaultOptions = {
  prefix: ''
};

export default (types, options = {}) => {
  if (isNilOrEmpty(types)) {
    throw new Error('valid types are required');
  }

  const { prefix } = _.merge(defaultOptions, options);

  return _.flow([
    _.trim,
    text => _.split(text, /\s/),
    texts => _.map(texts, _.trim),
    texts => _.reject(texts, isNilOrEmpty),
    texts => _.map(texts, x => [x, prefix + x]),
    _.fromPairs,
  ])(types);
};
