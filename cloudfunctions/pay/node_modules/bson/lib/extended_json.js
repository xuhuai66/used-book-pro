'use strict';

// const Buffer = require('buffer').Buffer;
// const Map = require('./map');
const Long = require('./long');
const Double = require('./double');
const Timestamp = require('./timestamp');
const ObjectId = require('./objectid');
const BSONRegExp = require('./regexp');
const Symbol = require('./symbol');
const Int32 = require('./int_32');
const Code = require('./code');
const Decimal128 = require('./decimal128');
const MinKey = require('./min_key');
const MaxKey = require('./max_key');
const DBRef = require('./db_ref');
const Binary = require('./binary');

/**
 * @namespace EJSON
 */

// all the types where we don't need to do any special processing and can just pass the EJSON
//straight to type.fromExtendedJSON
const keysToCodecs = {
  $oid: ObjectId,
  $binary: Binary,
  $symbol: Symbol,
  $numberInt: Int32,
  $numberDecimal: Decimal128,
  $numberDouble: Double,
  $numberLong: Long,
  $minKey: MinKey,
  $maxKey: MaxKey,
  $regularExpression: BSONRegExp,
  $timestamp: Timestamp
};

function deserializeValue(self, key, value, options) {
  if (typeof value === 'number') {
    if (options.relaxed) {
      return value;
    }

    // if it's an integer, should interpret as smallest BSON integer
    // that can represent it exactly. (if out of range, interpret as double.)
    if (Math.floor(value) === value) {
      if (value >= BSON_INT32_MIN && value <= BSON_INT32_MAX) return new Int32(value);
      if (value >= BSON_INT64_MIN && value <= BSON_INT64_MAX) return new Long.fromNumber(value);
    }

    // If the number is a non-integer or out of integer range, should interpret as BSON Double.
    return new Double(value);
  }

  // from here on out we're looking for bson types, so bail if its not an object
  if (value == null || typeof value !== 'object') return value;

  // upgrade deprecated undefined to null
  if (value.$undefined) return null;

  const keys = Object.keys(value).filter(k => k.startsWith('$') && value[k] != null);
  for (let i = 0; i < keys.length; i++) {
    let c = keysToCodecs[keys[i]];
    if (c) return c.fromExtendedJSON(value, options);
  }

  if (value.$date != null) {
    const d = value.$date;
    const date = new Date();

    if (typeof d === 'string') date.setTime(Date.parse(d));
    else if (Long.isLong(d)) date.setTime(d.toNumber());
    else if (typeof d === 'number' && options.relaxed) date.setTime(d);
    return date;
  }

  if (value.$code != null) {
    let copy = Object.assign({}, value);
    if (value.$scope) {
      copy.$scope = deserializeValue(self, null, value.$scope);
    }

    return Code.fromExtendedJSON(value);
  }

  if (value.$ref != null || value.$dbPointer != null) {
    let v = value.$ref ? value : value.$dbPointer;

    // we run into this in a "degenerate EJSON" case (with $id and $ref order flipped)
    // because of the order JSON.parse goes through the document
    if (v instanceof DBRef) return v;

    const dollarKeys = Object.keys(v).filter(k => k.startsWith('$'));
    let valid = true;
    dollarKeys.forEach(k => {
      if (['$ref', '$id', '$db'].indexOf(k) === -1) valid = false;
    });

    // only make DBRef if $ keys are all valid
    if (valid) return DBRef.fromExtendedJSON(v);
  }

  return value;
}

/**
 * Parse an Extended JSON string, constructing the JavaScript value or object described by that
 * string.
 *
 * @memberof EJSON
 * @param {string} text
 * @param {object} [options] Optional settings
 * @param {boolean} [options.relaxed=true] Attempt to return native JS types where possible, rather than BSON types (if true)
 * @return {object}
 *
 * @example
 * const { EJSON } = require('bson');
 * const text = '{ "int32": { "$numberInt": "10" } }';
 *
 * // prints { int32: { [String: '10'] _bsontype: 'Int32', value: '10' } }
 * console.log(EJSON.parse(text, { relaxed: false }));
 *
 * // prints { int32: 10 }
 * console.log(EJSON.parse(text));
 */
function parse(text, options) {
  options = Object.assign({}, { relaxed: true }, options);

  // relaxed implies not strict
  if (typeof options.relaxed === 'boolean') options.strict = !options.relaxed;
  if (typeof options.strict === 'boolean') options.relaxed = !options.strict;

  return JSON.parse(text, (key, value) => deserializeValue(this, key, value, options));
}

//
// Serializer
//

// MAX INT32 boundaries
const BSON_INT32_MAX = 0x7fffffff,
  BSON_INT32_MIN = -0x80000000,
  BSON_INT64_MAX = 0x7fffffffffffffff,
  BSON_INT64_MIN = -0x8000000000000000;

/**
 * Converts a BSON document to an Extended JSON string, optionally replacing values if a replacer
 * function is specified or optionally including only the specified properties if a replacer array
 * is specified.
 *
 * @memberof EJSON
 * @param {object} value The value to convert to extended JSON
 * @param {function|array} [replacer] A function that alters the behavior of the stringification process, or an array of String and Number objects that serve as a whitelist for selecting/filtering the properties of the value object to be included in the JSON string. If this value is null or not provided, all properties of the object are included in the resulting JSON string
 * @param {string|number} [space] A String or Number object that's used to insert white space into the output JSON string for readability purposes.
 * @param {object} [options] Optional settings
 * @param {boolean} [options.relaxed=true] Enabled Extended JSON's `relaxed` mode
 * @returns {string}
 *
 * @example
 * const { EJSON } = require('bson');
 * const Int32 = require('mongodb').Int32;
 * const doc = { int32: new Int32(10) };
 *
 * // prints '{"int32":{"$numberInt":"10"}}'
 * console.log(EJSON.stringify(doc, { relaxed: false }));
 *
 * // prints '{"int32":10}'
 * console.log(EJSON.stringify(doc));
 */
function stringify(value, replacer, space, options) {
  if (space != null && typeof space === 'object') {
    options = space;
    space = 0;
  }
  if (replacer != null && typeof replacer === 'object' && !Array.isArray(replacer)) {
    options = replacer;
    replacer = null;
    space = 0;
  }
  options = Object.assign({}, { relaxed: true }, options);

  const doc = Array.isArray(value)
    ? serializeArray(value, options)
    : serializeDocument(value, options);

  return JSON.stringify(doc, replacer, space);
}

/**
 * Serializes an object to an Extended JSON string, and reparse it as a JavaScript object.
 *
 * @memberof EJSON
 * @param {object} bson The object to serialize
 * @param {object} [options] Optional settings passed to the `stringify` function
 * @return {object}
 */
function serialize(bson, options) {
  options = options || {};
  return JSON.parse(stringify(bson, options));
}

/**
 * Deserializes an Extended JSON object into a plain JavaScript object with native/BSON types
 *
 * @memberof EJSON
 * @param {object} ejson The Extended JSON object to deserialize
 * @param {object} [options] Optional settings passed to the parse method
 * @return {object}
 */
function deserialize(ejson, options) {
  options = options || {};
  return parse(JSON.stringify(ejson), options);
}

function serializeArray(array, options) {
  return array.map(v => serializeValue(v, options));
}

function getISOString(date) {
  const isoStr = date.toISOString();
  // we should only show milliseconds in timestamp if they're non-zero
  return date.getUTCMilliseconds() !== 0 ? isoStr : isoStr.slice(0, -5) + 'Z';
}

function serializeValue(value, options) {
  if (Array.isArray(value)) return serializeArray(value, options);

  if (value === undefined) return null;

  if (value instanceof Date) {
    let dateNum = value.getTime(),
      // is it in year range 1970-9999?
      inRange = dateNum > -1 && dateNum < 253402318800000;

    return options.relaxed && inRange
      ? { $date: getISOString(value) }
      : { $date: { $numberLong: value.getTime().toString() } };
  }

  if (typeof value === 'number' && !options.relaxed) {
    // it's an integer
    if (Math.floor(value) === value) {
      let int32Range = value >= BSON_INT32_MIN && value <= BSON_INT32_MAX,
        int64Range = value >= BSON_INT64_MIN && value <= BSON_INT64_MAX;

      // interpret as being of the smallest BSON integer type that can represent the number exactly
      if (int32Range) return { $numberInt: value.toString() };
      if (int64Range) return { $numberLong: value.toString() };
    }
    return { $numberDouble: value.toString() };
  }

  if (value instanceof RegExp) {
    let flags = value.flags;
    if (flags === undefined) {
      flags = value.toString().match(/[gimuy]*$/)[0];
    }

    const rx = new BSONRegExp(value.source, flags);
    return rx.toExtendedJSON();
  }

  if (value != null && typeof value === 'object') return serializeDocument(value, options);
  return value;
}

const BSON_TYPE_MAPPINGS = {
  Binary: o => new Binary(o.value(), o.subtype),
  Code: o => new Code(o.code, o.scope),
  DBRef: o => new DBRef(o.collection || o.namespace, o.oid, o.db, o.fields), // "namespace" for 1.x library backwards compat
  Decimal128: o => new Decimal128(o.bytes),
  Double: o => new Double(o.value),
  Int32: o => new Int32(o.value),
  Long: o =>
    Long.fromBits(
      // underscore variants for 1.x backwards compatibility
      o.low != null ? o.low : o.low_,
      o.low != null ? o.high : o.high_,
      o.low != null ? o.unsigned : o.unsigned_
    ),
  MaxKey: () => new MaxKey(),
  MinKey: () => new MinKey(),
  ObjectID: o => new ObjectId(o),
  ObjectId: o => new ObjectId(o), // support 4.0.0/4.0.1 before _bsontype was reverted back to ObjectID
  BSONRegExp: o => new BSONRegExp(o.pattern, o.options),
  Symbol: o => new Symbol(o.value),
  Timestamp: o => Timestamp.fromBits(o.low, o.high)
};

function serializeDocument(doc, options) {
  if (doc == null || typeof doc !== 'object') throw new Error('not an object instance');

  const bsontype = doc._bsontype;
  if (typeof bsontype === 'undefined') {
    // It's a regular object. Recursively serialize its property values.
    const _doc = {};
    for (let name in doc) {
      _doc[name] = serializeValue(doc[name], options);
    }
    return _doc;
  } else if (typeof bsontype === 'string') {
    // the "document" is really just a BSON type object
    let _doc = doc;
    if (typeof _doc.toExtendedJSON !== 'function') {
      // There's no EJSON serialization function on the object. It's probably an
      // object created by a previous version of this library (or another library)
      // that's duck-typing objects to look like they were generated by this library).
      // Copy the object into this library's version of that type.
      const mapper = BSON_TYPE_MAPPINGS[bsontype];
      if (!mapper) {
        throw new TypeError('Unrecognized or invalid _bsontype: ' + bsontype);
      }
      _doc = mapper(_doc);
    }

    // Two BSON types may have nested objects that may need to be serialized too
    if (bsontype === 'Code' && _doc.scope) {
      _doc = new Code(_doc.code, serializeValue(_doc.scope, options));
    } else if (bsontype === 'DBRef' && _doc.oid) {
      _doc = new DBRef(_doc.collection, serializeValue(_doc.oid, options), _doc.db, _doc.fields);
    }

    return _doc.toExtendedJSON(options);
  } else {
    throw new Error('_bsontype must be a string, but was: ' + typeof bsontype);
  }
}

module.exports = {
  parse,
  deserialize,
  serialize,
  stringify
};
