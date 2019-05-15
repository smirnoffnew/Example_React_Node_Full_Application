/* eslint-disable no-use-before-define,no-unused-expressions,no-else-return */
const _ = require('lodash');
const chai = require('chai');

const { expect } = chai;

const getRequiredFields = _.flow([
  _.toPairs,
  pairs => _.filter(pairs, ([, value]) => value.isRequired()),
  pairs => _.map(pairs, p => p[0])
]);

const getForbiddenFields = _.flow([
  _.toPairs,
  pairs => _.filter(pairs, ([, value]) => value.isForbidden()),
  pairs => _.map(pairs, p => p[0])
]);

exports.getOptionalFields = _.flow(
  _.toPairs,
  pairs => _.filter(pairs, ([, value]) => value.isOptional()),
  pairs => _.map(pairs, p => p[0])
);

const normalizeType = (type) => {
  if (type instanceof ValidationSchema) {
    return 'object';
  } else if (_.isString(type)) {
    return type;
  } else if (_.isFunction(type)) {
    return null;
  } else if (_.isArray(type)) {
    return 'array';
  } else if (_.isObject(type)) {
    return new ValidationSchema(type);
  } else {
    return undefined;
  }
};

const normalizeSchema = (type) => {
  if (type instanceof ValidationSchema) {
    return type;
  } else if (_.isObject(type)) {
    return new ValidationSchema(type);
  } else {
    return undefined;
  }
};

const normalize = (v) => {
  if (!v) {
    return undefined;
  } else if (_.isString(v)) {
    return normalize({ type: v });
  } else if (v instanceof ValidationSchema) {
    return normalize({
      type: v,
      schema: v
    });
  } else if (_.isFunction(v)) {
    return normalize({
      type: v,
      run: v
    });
  } else if (_.isArray(v)) {
    return normalize({
      type: 'array',
      items: v[0]
    });
  } else {
    return {
      ...v,
      type: normalizeType(v.type),
      schema: normalizeSchema(v.type),
      items: v.items ? new Field(v.items) : undefined,
    };
  }
};

class Field {
  constructor(field) {
    this.validation = normalize(field);
  }

  isRequired() {
    return !(this.validation.optional || this.validation.forbidden);
  }

  isOptional() {
    return this.validation.optional;
  }

  isForbidden() {
    return this.validation.forbidden;
  }

  validate(value) {
    if (this.isForbidden()) {
      // eslint-disable-next-line no-unused-expressions
      expect(value)
        .to
        .be
        .undefined;
    } else if (!this.isOptional() && value) {
      if (this.validation.type) {
        expect(value)
          .to
          .be
          .a(this.validation.type);
      }
      if (_.isFunction(this.validation.custom)) {
        this.validation.custom(value);
      }
      if (this.validation.run) {
        this.validation.run(value);
      }
      if (this.validation.schema) {
        this.validation.schema.validate(value);
      }
      if (this.validation.items) {
        _.forEach(value, v => this.validation.items.validate(v));
      }
    }
  }

  shouldBeCompared() {
    return !this.validation.skipPreCheckEquals;
  }

  checkEquals(value, sample) {
    if (this.shouldBeCompared()) {
      if ((this.isOptional() && value) || this.isRequired()) {
        if (this.validation.schema) {
          this.validation.schema.checkEquals(value, sample);
        } else if (this.validation.items) {
          expect(value.length)
            .to
            .be
            .eq(sample.length);
          if (this.validation.items.checkEquals) {
            _.forEach(sample, (v, i) => this.validation.items.checkEquals(v, value[i]));
          }
        } else {
          expect(value)
            .to
            .be
            .deep
            .eq(sample);
        }
      } else if (this.isForbidden()) {
        expect(value).to.be.undefined;
      }
    }
  }
}

class ValidationSchema {
  constructor(schema = {}) {
    this._schema = schema;
    this._rebuild();
  }

  get schema() {
    return this._schema;
  }

  _addField(key, v) {
    this.tree[key] = new Field(v);
  }

  _rebuild() {
    this.tree = {};
    _.forIn(this.schema, (value, key) => {
      if (_.isObject(value)) {
        this._addField(key, value);
      } else {
        this._addField(key, { type: value });
      }
    });
    this.requiredFields = getRequiredFields(this.tree);
    this.forbiddentFields = getForbiddenFields(this.tree);
  }

  validate(obj) {
    if (this.requiredFields && this.requiredFields.length) {
      expect(obj)
        .to
        .include
        .keys(this.requiredFields);
    }
    if (this.forbiddentFields.length) {
      expect(obj)
        .to
        .have
        .not
        .all
        .keys(this.forbiddentFields);
    }
    _.forIn(this.tree, (field, key) => {
      field.validate(obj[key]);
    });
  }

  checkEquals(dest, src) {
    _.forIn(src, (value, key) => {
      if (_.has(this.tree, key)) {
        this.tree[key].checkEquals(dest[key], value);
      }
    });
  }
}

module.exports = ValidationSchema;
