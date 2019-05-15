const Readable = require('stream').Readable;

module.exports.fromBuffer = (buffer) => {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
};
