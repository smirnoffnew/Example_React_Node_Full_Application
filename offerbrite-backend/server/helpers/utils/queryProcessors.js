const inArray = array => ({ $in: array });
const notInArray = array => ({ $nin: array });

const exactly = value => value;
const containsString = str => new RegExp(`.*${str}.*`);

const containsWords = separator => (src) => {
  const searchQuery = src
    .split(separator !== undefined ? separator : ' ')
    .map(x => `(?=.*${x})`)
    .join();
  return new RegExp(`^${searchQuery}.*$`, 'i');
};

const text = src => ({
  $text: {
    $search: src,
    $caseSensitive: false,
  }
});


module.exports = {
  inArray,
  text,
  containsWords,
  containsString,
  notInArray,
  exactly
};
