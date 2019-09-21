'use strict';

const Buffer = require('buffer').Buffer;
let randomBytes = require('./parser/utils').randomBytes;
const util = require('util');
const deprecate = util.deprecate;

// constants
const PROCESS_UNIQUE = randomBytes(5);

// Regular expression that checks for hex value
const checkForHexRegExp = new RegExp('^[0-9a-fA-F]{24}$');
let hasBufferType = false;

// Check if buffer exists
try {
  if (Buffer && Buffer.from) hasBufferType = true;
} catch (err) {
  hasBufferType = false;
}

// Precomputed hex table enables speedy hex string conversion
const hexTable = [];
for (let i = 0; i < 256; i++) {
  hexTable[i] = (i <= 15 ? '0' : '') + i.toString(16);
}

// Lookup tables
const decodeLookup = [];
let i = 0;
while (i < 10) decodeLookup[0x30 + i] = i++;
while (i < 16) decodeLookup[0x41 - 10 + i] = decodeLookup[0x61 - 10 + i] = i++;

const _Buffer = Buffer;
function convertToHex(bytes) {
  return bytes.toString('hex');
}

function makeObjectIdError(invalidString, index) {
  const invalidCharacter = invalidString[index];
  return new TypeError(
    `ObjectId string "${invalidString}" contains invalid character "${invalidCharacter}" with character code (${invalidString.charCodeAt(
      index
    )}). All character codes for a non-hex string must be less than 256.`
  );
}

/**
 * A class representation of the BSON ObjectId type.
 */
class ObjectId {
  /**
   * Create an ObjectId type
   *
   * @param {(string|Buffer|number)} id Can be a 24 byte hex string, 12 byte binary Buffer, or a Number.
   * @property {number} generationTime The generation time of this ObjectId instance
   * @return {ObjectId} instance of ObjectId.
   */
  constructor(id) {
    // Duck-typing to support ObjectId from different npm packages
    if (id instanceof ObjectId) return id;

    // The most common usecase (blank id, new objectId instance)
    if (id == null || typeof id === 'number') {
      // Generate a new id
      this.id = ObjectId.generate(id);
      // If we are caching the hex string
      if (ObjectId.cacheHexString) this.__id = this.toString('hex');
      // Return the object
      return;
    }

    // Check if the passed in id is valid
    const valid = ObjectId.isValid(id);

    // Throw an error if it's not a valid setup
    if (!valid && id != null) {
      throw new TypeError(
        'Argument passed in must be a single String of 12 bytes or a string of 24 hex characters'
      );
    } else if (valid && typeof id === 'string' && id.length === 24 && hasBufferType) {
      return new ObjectId(Buffer.from(id, 'hex'));
    } else if (valid && typeof id === 'string' && id.length === 24) {
      return ObjectId.createFromHexString(id);
    } else if (id != null && id.length === 12) {
      // assume 12 byte string
      this.id = id;
    } else if (id != null && id.toHexString) {
      // Duck-typing to support ObjectId from different npm packages
      return ObjectId.createFromHexString(id.toHexString());
    } else {
      throw new TypeError(
        'Argument passed in must be a single String of 12 bytes or a string of 24 hex characters'
      );
    }

    if (ObjectId.cacheHexString) this.__id = this.toString('hex');
  }

  /**
   * Return the ObjectId id as a 24 byte hex string representation
   *
   * @method
   * @return {string} return the 24 byte hex string representation.
   */
  toHexString() {
    if (ObjectId.cacheHexString && this.__id) return this.__id;

    let hexString = '';
    if (!this.id || !this.id.length) {
      throw new TypeError(
        'invalid ObjectId, ObjectId.id must be either a string or a Buffer, but is [' +
          JSON.stringify(this.id) +
          ']'
      );
    }

    if (this.id instanceof _Buffer) {
      hexString = convertToHex(this.id);
      if (ObjectId.cacheHexString) this.__id = hexString;
      return hexString;
    }

    for (let i = 0; i < this.id.length; i++) {
      const hexChar = hexTable[this.id.charCodeAt(i)];
      if (typeof hexChar !== 'string') {
        throw makeObjectIdError(this.id, i);
      }
      hexString += hexChar;
    }

    if (ObjectId.cacheHexString) this.__id = hexString;
    return hexString;
  }

  /**
   * Update the ObjectId index used in generating new ObjectId's on the driver
   *
   * @method
   * @return {number} returns next index value.
   * @ignore
   */
  static getInc() {
    return (ObjectId.index = (ObjectId.index + 1) % 0xffffff);
  }

  /**
   * Generate a 12 byte id buffer used in ObjectId's
   *
   * @method
   * @param {number} [time] optional parameter allowing to pass in a second based timestamp.
   * @return {Buffer} return the 12 byte id buffer string.
   */
  static generate(time) {
    if ('number' !== typeof time) {
      time = ~~(Date.now() / 1000);
    }

    const inc = ObjectId.getInc();
    const buffer = Buffer.alloc(12);

    // 4-byte timestamp
    buffer[3] = time & 0xff;
    buffer[2] = (time >> 8) & 0xff;
    buffer[1] = (time >> 16) & 0xff;
    buffer[0] = (time >> 24) & 0xff;

    // 5-byte process unique
    buffer[4] = PROCESS_UNIQUE[0];
    buffer[5] = PROCESS_UNIQUE[1];
    buffer[6] = PROCESS_UNIQUE[2];
    buffer[7] = PROCESS_UNIQUE[3];
    buffer[8] = PROCESS_UNIQUE[4];

    // 3-byte counter
    buffer[11] = inc & 0xff;
    buffer[10] = (inc >> 8) & 0xff;
    buffer[9] = (inc >> 16) & 0xff;

    return buffer;
  }

  /**
   * Converts the id into a 24 byte hex string for printing
   *
   * @param {String} format The Buffer toString format parameter.
   * @return {String} return the 24 byte hex string representation.
   * @ignore
   */
  toString(format) {
    // Is the id a buffer then use the buffer toString method to return the format
    if (this.id && this.id.copy) {
      return this.id.toString(typeof format === 'string' ? format : 'hex');
    }

    return this.toHexString();
  }

  /**
   * Converts to its JSON representation.
   *
   * @return {String} return the 24 byte hex string representation.
   * @ignore
   */
  toJSON() {
    return this.toHexString();
  }

  /**
   * Compares the equality of this ObjectId with `otherID`.
   *
   * @method
   * @param {object} otherId ObjectId instance to compare against.
   * @return {boolean} the result of comparing two ObjectId's
   */
  equals(otherId) {
    if (otherId instanceof ObjectId) {
      return this.toString() === otherId.toString();
    }

    if (
      typeof otherId === 'string' &&
      ObjectId.isValid(otherId) &&
      otherId.length === 12 &&
      this.id instanceof _Buffer
    ) {
      return otherId === this.id.toString('binary');
    }

    if (typeof otherId === 'string' && ObjectId.isValid(otherId) && otherId.length === 24) {
      return otherId.toLowerCase() === this.toHexString();
    }

    if (typeof otherId === 'string' && ObjectId.isValid(otherId) && otherId.length === 12) {
      return otherId === this.id;
    }

    if (otherId != null && (otherId instanceof ObjectId || otherId.toHexString)) {
      return otherId.toHexString() === this.toHexString();
    }

    return false;
  }

  /**
   * Returns the generation date (accurate up to the second) that this ID was generated.
   *
   * @method
   * @return {Date} the generation date
   */
  getTimestamp() {
    const timestamp = new Date();
    const time = this.id.readUInt32BE(0);
    timestamp.setTime(Math.floor(time) * 1000);
    return timestamp;
  }

  /**
   * @ignore
   */
  static createPk() {
    return new ObjectId();
  }

  /**
   * Creates an ObjectId from a second based number, with the rest of the ObjectId zeroed out. Used for comparisons or sorting the ObjectId.
   *
   * @method
   * @param {number} time an integer number representing a number of seconds.
   * @return {ObjectId} return the created ObjectId
   */
  static createFromTime(time) {
    const buffer = Buffer.from([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    // Encode time into first 4 bytes
    buffer[3] = time & 0xff;
    buffer[2] = (time >> 8) & 0xff;
    buffer[1] = (time >> 16) & 0xff;
    buffer[0] = (time >> 24) & 0xff;
    // Return the new objectId
    return new ObjectId(buffer);
  }

  /**
   * Creates an ObjectId from a hex string representation of an ObjectId.
   *
   * @method
   * @param {string} hexString create a ObjectId from a passed in 24 byte hexstring.
   * @return {ObjectId} return the created ObjectId
   */
  static createFromHexString(string) {
    // Throw an error if it's not a valid setup
    if (typeof string === 'undefined' || (string != null && string.length !== 24)) {
      throw new TypeError(
        'Argument passed in must be a single String of 12 bytes or a string of 24 hex characters'
      );
    }

    // Use Buffer.from method if available
    if (hasBufferType) return new ObjectId(Buffer.from(string, 'hex'));

    // Calculate lengths
    const array = new _Buffer(12);

    let n = 0;
    let i = 0;
    while (i < 24) {
      array[n++] =
        (decodeLookup[string.charCodeAt(i++)] << 4) | decodeLookup[string.charCodeAt(i++)];
    }

    return new ObjectId(array);
  }

  /**
   * Checks if a value is a valid bson ObjectId
   *
   * @method
   * @return {boolean} return true if the value is a valid bson ObjectId, return false otherwise.
   */
  static isValid(id) {
    if (id == null) return false;

    if (typeof id === 'number') {
      return true;
    }

    if (typeof id === 'string') {
      return id.length === 12 || (id.length === 24 && checkForHexRegExp.test(id));
    }

    if (id instanceof ObjectId) {
      return true;
    }

    if (id instanceof _Buffer && id.length === 12) {
      return true;
    }

    // Duck-Typing detection of ObjectId like objects
    if (id.toHexString) {
      return id.id.length === 12 || (id.id.length === 24 && checkForHexRegExp.test(id.id));
    }

    return false;
  }

  /**
   * @ignore
   */
  toExtendedJSON() {
    if (this.toHexString) return { $oid: this.toHexString() };
    return { $oid: this.toString('hex') };
  }

  /**
   * @ignore
   */
  static fromExtendedJSON(doc) {
    return new ObjectId(doc.$oid);
  }
}

// Deprecated methods
ObjectId.get_inc = deprecate(
  () => ObjectId.getInc(),
  'Please use the static `ObjectId.getInc()` instead'
);

ObjectId.prototype.get_inc = deprecate(
  () => ObjectId.getInc(),
  'Please use the static `ObjectId.getInc()` instead'
);

ObjectId.prototype.getInc = deprecate(
  () => ObjectId.getInc(),
  'Please use the static `ObjectId.getInc()` instead'
);

ObjectId.prototype.generate = deprecate(
  time => ObjectId.generate(time),
  'Please use the static `ObjectId.generate(time)` instead'
);

/**
 * @ignore
 */
Object.defineProperty(ObjectId.prototype, 'generationTime', {
  enumerable: true,
  get: function() {
    return this.id[3] | (this.id[2] << 8) | (this.id[1] << 16) | (this.id[0] << 24);
  },
  set: function(value) {
    // Encode time into first 4 bytes
    this.id[3] = value & 0xff;
    this.id[2] = (value >> 8) & 0xff;
    this.id[1] = (value >> 16) & 0xff;
    this.id[0] = (value >> 24) & 0xff;
  }
});

/**
 * Converts to a string representation of this Id.
 *
 * @return {String} return the 24 byte hex string representation.
 * @ignore
 */
ObjectId.prototype[util.inspect.custom || 'inspect'] = ObjectId.prototype.toString;

/**
 * @ignore
 */
ObjectId.index = ~~(Math.random() * 0xffffff);

// In 4.0.0 and 4.0.1, this property name was changed to ObjectId to match the class name.
// This caused interoperability problems with previous versions of the library, so in
// later builds we changed it back to ObjectID (capital D) to match legacy implementations.
Object.defineProperty(ObjectId.prototype, '_bsontype', { value: 'ObjectID' });
module.exports = ObjectId;
