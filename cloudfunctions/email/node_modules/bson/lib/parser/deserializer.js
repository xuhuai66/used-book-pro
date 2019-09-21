'use strict';

const Buffer = require('buffer').Buffer;
const Long = require('../long');
const Double = require('../double');
const Timestamp = require('../timestamp');
const ObjectId = require('../objectid');
const Code = require('../code');
const MinKey = require('../min_key');
const MaxKey = require('../max_key');
const Decimal128 = require('../decimal128');
const Int32 = require('../int_32');
const DBRef = require('../db_ref');
const BSONRegExp = require('../regexp');
const Binary = require('../binary');
const constants = require('../constants');
const validateUtf8 = require('../validate_utf8').validateUtf8;

// Internal long versions
const JS_INT_MAX_LONG = Long.fromNumber(constants.JS_INT_MAX);
const JS_INT_MIN_LONG = Long.fromNumber(constants.JS_INT_MIN);

const functionCache = {};

function deserialize(buffer, options, isArray) {
  options = options == null ? {} : options;
  const index = options && options.index ? options.index : 0;
  // Read the document size
  const size =
    buffer[index] |
    (buffer[index + 1] << 8) |
    (buffer[index + 2] << 16) |
    (buffer[index + 3] << 24);

  if (size < 5) {
    throw new Error(`bson size must be >= 5, is ${size}`);
  }

  if (options.allowObjectSmallerThanBufferSize && buffer.length < size) {
    throw new Error(`buffer length ${buffer.length} must be >= bson size ${size}`);
  }

  if (!options.allowObjectSmallerThanBufferSize && buffer.length !== size) {
    throw new Error(`buffer length ${buffer.length} must === bson size ${size}`);
  }

  if (size + index > buffer.length) {
    throw new Error(
      `(bson size ${size} + options.index ${index} must be <= buffer length ${Buffer.byteLength(
        buffer
      )})`
    );
  }

  // Illegal end value
  if (buffer[index + size - 1] !== 0) {
    throw new Error("One object, sized correctly, with a spot for an EOO, but the EOO isn't 0x00");
  }

  // Start deserializtion
  return deserializeObject(buffer, index, options, isArray);
}

function deserializeObject(buffer, index, options, isArray) {
  const evalFunctions = options['evalFunctions'] == null ? false : options['evalFunctions'];
  const cacheFunctions = options['cacheFunctions'] == null ? false : options['cacheFunctions'];
  const cacheFunctionsCrc32 =
    options['cacheFunctionsCrc32'] == null ? false : options['cacheFunctionsCrc32'];

  if (!cacheFunctionsCrc32) var crc32 = null;

  const fieldsAsRaw = options['fieldsAsRaw'] == null ? null : options['fieldsAsRaw'];

  // Return raw bson buffer instead of parsing it
  const raw = options['raw'] == null ? false : options['raw'];

  // Return BSONRegExp objects instead of native regular expressions
  const bsonRegExp = typeof options['bsonRegExp'] === 'boolean' ? options['bsonRegExp'] : false;

  // Controls the promotion of values vs wrapper classes
  const promoteBuffers = options['promoteBuffers'] == null ? false : options['promoteBuffers'];
  const promoteLongs = options['promoteLongs'] == null ? true : options['promoteLongs'];
  const promoteValues = options['promoteValues'] == null ? true : options['promoteValues'];

  // Set the start index
  let startIndex = index;

  // Validate that we have at least 4 bytes of buffer
  if (buffer.length < 5) throw new Error('corrupt bson message < 5 bytes long');

  // Read the document size
  const size =
    buffer[index++] | (buffer[index++] << 8) | (buffer[index++] << 16) | (buffer[index++] << 24);

  // Ensure buffer is valid size
  if (size < 5 || size > buffer.length) throw new Error('corrupt bson message');

  // Create holding object
  const object = isArray ? [] : {};
  // Used for arrays to skip having to perform utf8 decoding
  let arrayIndex = 0;
  let done = false;

  // While we have more left data left keep parsing
  while (!done) {
    // Read the type
    const elementType = buffer[index++];

    // If we get a zero it's the last byte, exit
    if (elementType === 0) break;

    // Get the start search index
    let i = index;
    // Locate the end of the c string
    while (buffer[i] !== 0x00 && i < buffer.length) {
      i++;
    }

    // If are at the end of the buffer there is a problem with the document
    if (i >= Buffer.byteLength(buffer)) throw new Error('Bad BSON Document: illegal CString');
    const name = isArray ? arrayIndex++ : buffer.toString('utf8', index, i);

    index = i + 1;

    if (elementType === constants.BSON_DATA_STRING) {
      const stringSize =
        buffer[index++] |
        (buffer[index++] << 8) |
        (buffer[index++] << 16) |
        (buffer[index++] << 24);
      if (
        stringSize <= 0 ||
        stringSize > buffer.length - index ||
        buffer[index + stringSize - 1] !== 0
      )
        throw new Error('bad string length in bson');

      if (!validateUtf8(buffer, index, index + stringSize - 1)) {
        throw new Error('Invalid UTF-8 string in BSON document');
      }

      const s = buffer.toString('utf8', index, index + stringSize - 1);

      object[name] = s;
      index = index + stringSize;
    } else if (elementType === constants.BSON_DATA_OID) {
      const oid = Buffer.alloc(12);
      buffer.copy(oid, 0, index, index + 12);
      object[name] = new ObjectId(oid);
      index = index + 12;
    } else if (elementType === constants.BSON_DATA_INT && promoteValues === false) {
      object[name] = new Int32(
        buffer[index++] | (buffer[index++] << 8) | (buffer[index++] << 16) | (buffer[index++] << 24)
      );
    } else if (elementType === constants.BSON_DATA_INT) {
      object[name] =
        buffer[index++] |
        (buffer[index++] << 8) |
        (buffer[index++] << 16) |
        (buffer[index++] << 24);
    } else if (elementType === constants.BSON_DATA_NUMBER && promoteValues === false) {
      object[name] = new Double(buffer.readDoubleLE(index));
      index = index + 8;
    } else if (elementType === constants.BSON_DATA_NUMBER) {
      object[name] = buffer.readDoubleLE(index);
      index = index + 8;
    } else if (elementType === constants.BSON_DATA_DATE) {
      const lowBits =
        buffer[index++] |
        (buffer[index++] << 8) |
        (buffer[index++] << 16) |
        (buffer[index++] << 24);
      const highBits =
        buffer[index++] |
        (buffer[index++] << 8) |
        (buffer[index++] << 16) |
        (buffer[index++] << 24);
      object[name] = new Date(new Long(lowBits, highBits).toNumber());
    } else if (elementType === constants.BSON_DATA_BOOLEAN) {
      if (buffer[index] !== 0 && buffer[index] !== 1) throw new Error('illegal boolean type value');
      object[name] = buffer[index++] === 1;
    } else if (elementType === constants.BSON_DATA_OBJECT) {
      const _index = index;
      const objectSize =
        buffer[index] |
        (buffer[index + 1] << 8) |
        (buffer[index + 2] << 16) |
        (buffer[index + 3] << 24);
      if (objectSize <= 0 || objectSize > buffer.length - index)
        throw new Error('bad embedded document length in bson');

      // We have a raw value
      if (raw) {
        object[name] = buffer.slice(index, index + objectSize);
      } else {
        object[name] = deserializeObject(buffer, _index, options, false);
      }

      index = index + objectSize;
    } else if (elementType === constants.BSON_DATA_ARRAY) {
      const _index = index;
      const objectSize =
        buffer[index] |
        (buffer[index + 1] << 8) |
        (buffer[index + 2] << 16) |
        (buffer[index + 3] << 24);
      let arrayOptions = options;

      // Stop index
      const stopIndex = index + objectSize;

      // All elements of array to be returned as raw bson
      if (fieldsAsRaw && fieldsAsRaw[name]) {
        arrayOptions = {};
        for (let n in options) arrayOptions[n] = options[n];
        arrayOptions['raw'] = true;
      }

      object[name] = deserializeObject(buffer, _index, arrayOptions, true);
      index = index + objectSize;

      if (buffer[index - 1] !== 0) throw new Error('invalid array terminator byte');
      if (index !== stopIndex) throw new Error('corrupted array bson');
    } else if (elementType === constants.BSON_DATA_UNDEFINED) {
      object[name] = undefined;
    } else if (elementType === constants.BSON_DATA_NULL) {
      object[name] = null;
    } else if (elementType === constants.BSON_DATA_LONG) {
      // Unpack the low and high bits
      const lowBits =
        buffer[index++] |
        (buffer[index++] << 8) |
        (buffer[index++] << 16) |
        (buffer[index++] << 24);
      const highBits =
        buffer[index++] |
        (buffer[index++] << 8) |
        (buffer[index++] << 16) |
        (buffer[index++] << 24);
      const long = new Long(lowBits, highBits);
      // Promote the long if possible
      if (promoteLongs && promoteValues === true) {
        object[name] =
          long.lessThanOrEqual(JS_INT_MAX_LONG) && long.greaterThanOrEqual(JS_INT_MIN_LONG)
            ? long.toNumber()
            : long;
      } else {
        object[name] = long;
      }
    } else if (elementType === constants.BSON_DATA_DECIMAL128) {
      // Buffer to contain the decimal bytes
      const bytes = Buffer.alloc(16);
      // Copy the next 16 bytes into the bytes buffer
      buffer.copy(bytes, 0, index, index + 16);
      // Update index
      index = index + 16;
      // Assign the new Decimal128 value
      const decimal128 = new Decimal128(bytes);
      // If we have an alternative mapper use that
      object[name] = decimal128.toObject ? decimal128.toObject() : decimal128;
    } else if (elementType === constants.BSON_DATA_BINARY) {
      let binarySize =
        buffer[index++] |
        (buffer[index++] << 8) |
        (buffer[index++] << 16) |
        (buffer[index++] << 24);
      const totalBinarySize = binarySize;
      const subType = buffer[index++];

      // Did we have a negative binary size, throw
      if (binarySize < 0) throw new Error('Negative binary type element size found');

      // Is the length longer than the document
      if (binarySize > Buffer.byteLength(buffer))
        throw new Error('Binary type size larger than document size');

      // Decode as raw Buffer object if options specifies it
      if (buffer['slice'] != null) {
        // If we have subtype 2 skip the 4 bytes for the size
        if (subType === Binary.SUBTYPE_BYTE_ARRAY) {
          binarySize =
            buffer[index++] |
            (buffer[index++] << 8) |
            (buffer[index++] << 16) |
            (buffer[index++] << 24);
          if (binarySize < 0)
            throw new Error('Negative binary type element size found for subtype 0x02');
          if (binarySize > totalBinarySize - 4)
            throw new Error('Binary type with subtype 0x02 contains to long binary size');
          if (binarySize < totalBinarySize - 4)
            throw new Error('Binary type with subtype 0x02 contains to short binary size');
        }

        if (promoteBuffers && promoteValues) {
          object[name] = buffer.slice(index, index + binarySize);
        } else {
          object[name] = new Binary(buffer.slice(index, index + binarySize), subType);
        }
      } else {
        const _buffer =
          typeof Uint8Array !== 'undefined'
            ? new Uint8Array(new ArrayBuffer(binarySize))
            : new Array(binarySize);
        // If we have subtype 2 skip the 4 bytes for the size
        if (subType === Binary.SUBTYPE_BYTE_ARRAY) {
          binarySize =
            buffer[index++] |
            (buffer[index++] << 8) |
            (buffer[index++] << 16) |
            (buffer[index++] << 24);
          if (binarySize < 0)
            throw new Error('Negative binary type element size found for subtype 0x02');
          if (binarySize > totalBinarySize - 4)
            throw new Error('Binary type with subtype 0x02 contains to long binary size');
          if (binarySize < totalBinarySize - 4)
            throw new Error('Binary type with subtype 0x02 contains to short binary size');
        }

        // Copy the data
        for (i = 0; i < binarySize; i++) {
          _buffer[i] = buffer[index + i];
        }

        if (promoteBuffers && promoteValues) {
          object[name] = _buffer;
        } else {
          object[name] = new Binary(_buffer, subType);
        }
      }

      // Update the index
      index = index + binarySize;
    } else if (elementType === constants.BSON_DATA_REGEXP && bsonRegExp === false) {
      // Get the start search index
      i = index;
      // Locate the end of the c string
      while (buffer[i] !== 0x00 && i < buffer.length) {
        i++;
      }
      // If are at the end of the buffer there is a problem with the document
      if (i >= buffer.length) throw new Error('Bad BSON Document: illegal CString');
      // Return the C string
      const source = buffer.toString('utf8', index, i);
      // Create the regexp
      index = i + 1;

      // Get the start search index
      i = index;
      // Locate the end of the c string
      while (buffer[i] !== 0x00 && i < buffer.length) {
        i++;
      }
      // If are at the end of the buffer there is a problem with the document
      if (i >= buffer.length) throw new Error('Bad BSON Document: illegal CString');
      // Return the C string
      const regExpOptions = buffer.toString('utf8', index, i);
      index = i + 1;

      // For each option add the corresponding one for javascript
      const optionsArray = new Array(regExpOptions.length);

      // Parse options
      for (i = 0; i < regExpOptions.length; i++) {
        switch (regExpOptions[i]) {
          case 'm':
            optionsArray[i] = 'm';
            break;
          case 's':
            optionsArray[i] = 'g';
            break;
          case 'i':
            optionsArray[i] = 'i';
            break;
        }
      }

      object[name] = new RegExp(source, optionsArray.join(''));
    } else if (elementType === constants.BSON_DATA_REGEXP && bsonRegExp === true) {
      // Get the start search index
      i = index;
      // Locate the end of the c string
      while (buffer[i] !== 0x00 && i < buffer.length) {
        i++;
      }
      // If are at the end of the buffer there is a problem with the document
      if (i >= buffer.length) throw new Error('Bad BSON Document: illegal CString');
      // Return the C string
      const source = buffer.toString('utf8', index, i);
      index = i + 1;

      // Get the start search index
      i = index;
      // Locate the end of the c string
      while (buffer[i] !== 0x00 && i < buffer.length) {
        i++;
      }
      // If are at the end of the buffer there is a problem with the document
      if (i >= buffer.length) throw new Error('Bad BSON Document: illegal CString');
      // Return the C string
      const regExpOptions = buffer.toString('utf8', index, i);
      index = i + 1;

      // Set the object
      object[name] = new BSONRegExp(source, regExpOptions);
    } else if (elementType === constants.BSON_DATA_SYMBOL) {
      const stringSize =
        buffer[index++] |
        (buffer[index++] << 8) |
        (buffer[index++] << 16) |
        (buffer[index++] << 24);
      if (
        stringSize <= 0 ||
        stringSize > buffer.length - index ||
        buffer[index + stringSize - 1] !== 0
      )
        throw new Error('bad string length in bson');
      // symbol is deprecated - upgrade to string.
      object[name] = buffer.toString('utf8', index, index + stringSize - 1);
      index = index + stringSize;
    } else if (elementType === constants.BSON_DATA_TIMESTAMP) {
      const lowBits =
        buffer[index++] |
        (buffer[index++] << 8) |
        (buffer[index++] << 16) |
        (buffer[index++] << 24);
      const highBits =
        buffer[index++] |
        (buffer[index++] << 8) |
        (buffer[index++] << 16) |
        (buffer[index++] << 24);

      object[name] = new Timestamp(lowBits, highBits);
    } else if (elementType === constants.BSON_DATA_MIN_KEY) {
      object[name] = new MinKey();
    } else if (elementType === constants.BSON_DATA_MAX_KEY) {
      object[name] = new MaxKey();
    } else if (elementType === constants.BSON_DATA_CODE) {
      const stringSize =
        buffer[index++] |
        (buffer[index++] << 8) |
        (buffer[index++] << 16) |
        (buffer[index++] << 24);
      if (
        stringSize <= 0 ||
        stringSize > buffer.length - index ||
        buffer[index + stringSize - 1] !== 0
      )
        throw new Error('bad string length in bson');
      const functionString = buffer.toString('utf8', index, index + stringSize - 1);

      // If we are evaluating the functions
      if (evalFunctions) {
        // If we have cache enabled let's look for the md5 of the function in the cache
        if (cacheFunctions) {
          const hash = cacheFunctionsCrc32 ? crc32(functionString) : functionString;
          // Got to do this to avoid V8 deoptimizing the call due to finding eval
          object[name] = isolateEvalWithHash(functionCache, hash, functionString, object);
        } else {
          object[name] = isolateEval(functionString);
        }
      } else {
        object[name] = new Code(functionString);
      }

      // Update parse index position
      index = index + stringSize;
    } else if (elementType === constants.BSON_DATA_CODE_W_SCOPE) {
      const totalSize =
        buffer[index++] |
        (buffer[index++] << 8) |
        (buffer[index++] << 16) |
        (buffer[index++] << 24);

      // Element cannot be shorter than totalSize + stringSize + documentSize + terminator
      if (totalSize < 4 + 4 + 4 + 1) {
        throw new Error('code_w_scope total size shorter minimum expected length');
      }

      // Get the code string size
      const stringSize =
        buffer[index++] |
        (buffer[index++] << 8) |
        (buffer[index++] << 16) |
        (buffer[index++] << 24);
      // Check if we have a valid string
      if (
        stringSize <= 0 ||
        stringSize > buffer.length - index ||
        buffer[index + stringSize - 1] !== 0
      )
        throw new Error('bad string length in bson');

      // Javascript function
      const functionString = buffer.toString('utf8', index, index + stringSize - 1);
      // Update parse index position
      index = index + stringSize;
      // Parse the element
      const _index = index;
      // Decode the size of the object document
      const objectSize =
        buffer[index] |
        (buffer[index + 1] << 8) |
        (buffer[index + 2] << 16) |
        (buffer[index + 3] << 24);
      // Decode the scope object
      const scopeObject = deserializeObject(buffer, _index, options, false);
      // Adjust the index
      index = index + objectSize;

      // Check if field length is to short
      if (totalSize < 4 + 4 + objectSize + stringSize) {
        throw new Error('code_w_scope total size is to short, truncating scope');
      }

      // Check if totalSize field is to long
      if (totalSize > 4 + 4 + objectSize + stringSize) {
        throw new Error('code_w_scope total size is to long, clips outer document');
      }

      // If we are evaluating the functions
      if (evalFunctions) {
        // If we have cache enabled let's look for the md5 of the function in the cache
        if (cacheFunctions) {
          const hash = cacheFunctionsCrc32 ? crc32(functionString) : functionString;
          // Got to do this to avoid V8 deoptimizing the call due to finding eval
          object[name] = isolateEvalWithHash(functionCache, hash, functionString, object);
        } else {
          object[name] = isolateEval(functionString);
        }

        object[name].scope = scopeObject;
      } else {
        object[name] = new Code(functionString, scopeObject);
      }
    } else if (elementType === constants.BSON_DATA_DBPOINTER) {
      // Get the code string size
      const stringSize =
        buffer[index++] |
        (buffer[index++] << 8) |
        (buffer[index++] << 16) |
        (buffer[index++] << 24);
      // Check if we have a valid string
      if (
        stringSize <= 0 ||
        stringSize > buffer.length - index ||
        buffer[index + stringSize - 1] !== 0
      )
        throw new Error('bad string length in bson');
      // Namespace
      if (!validateUtf8(buffer, index, index + stringSize - 1)) {
        throw new Error('Invalid UTF-8 string in BSON document');
      }
      const namespace = buffer.toString('utf8', index, index + stringSize - 1);
      // Update parse index position
      index = index + stringSize;

      // Read the oid
      const oidBuffer = Buffer.alloc(12);
      buffer.copy(oidBuffer, 0, index, index + 12);
      const oid = new ObjectId(oidBuffer);

      // Update the index
      index = index + 12;

      // Upgrade to DBRef type
      object[name] = new DBRef(namespace, oid);
    } else {
      throw new Error(
        'Detected unknown BSON type ' +
          elementType.toString(16) +
          ' for fieldname "' +
          name +
          '", are you using the latest BSON parser?'
      );
    }
  }

  // Check if the deserialization was against a valid array/object
  if (size !== index - startIndex) {
    if (isArray) throw new Error('corrupt array bson');
    throw new Error('corrupt object bson');
  }

  // check if object's $ keys are those of a DBRef
  const dollarKeys = Object.keys(object).filter(k => k.startsWith('$'));
  let valid = true;
  dollarKeys.forEach(k => {
    if (['$ref', '$id', '$db'].indexOf(k) === -1) valid = false;
  });

  // if a $key not in "$ref", "$id", "$db", don't make a DBRef
  if (!valid) return object;

  if (object['$id'] != null && object['$ref'] != null) {
    let copy = Object.assign({}, object);
    delete copy.$ref;
    delete copy.$id;
    delete copy.$db;
    return new DBRef(object.$ref, object.$id, object.$db || null, copy);
  }

  return object;
}

/**
 * Ensure eval is isolated.
 *
 * @ignore
 * @api private
 */
function isolateEvalWithHash(functionCache, hash, functionString, object) {
  // Contains the value we are going to set
  let value = null;

  // Check for cache hit, eval if missing and return cached function
  if (functionCache[hash] == null) {
    eval('value = ' + functionString);
    functionCache[hash] = value;
  }

  // Set the object
  return functionCache[hash].bind(object);
}

/**
 * Ensure eval is isolated.
 *
 * @ignore
 * @api private
 */
function isolateEval(functionString) {
  // Contains the value we are going to set
  let value = null;
  // Eval the function
  eval('value = ' + functionString);
  return value;
}

module.exports = deserialize;
