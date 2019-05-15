/**
 * Returns capitalized version of the given string.
 * @param {string} word - String which will be capitalized.
 * @returns {string}
 */
const toCapitalize = word => (
  `${word.split('')[0].toUpperCase()}${word.toLowerCase().split('').slice(1).join('')}`
);

export default toCapitalize;
