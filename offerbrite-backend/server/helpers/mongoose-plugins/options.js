const toJSONOpt = {
  virtuals: true,
  minimize: true,
  versionKey: false,
  transform: (doc, ret) => {
    delete ret.__v;
    delete ret._id;
  }
};
const toObjectOpt = toJSONOpt;

const toJSON = (...args) => ({
    virtuals: true,
    minimize: true,
    versionKey: false,
    transform: (doc, ret) => {
      args.forEach((arg) => {
          delete ret[arg];
        });
    }
  });
const toObject = toJSON;

module.exports = {
  toJSON,
  toObject,
  toJSONOpt,
  toObjectOpt
};
