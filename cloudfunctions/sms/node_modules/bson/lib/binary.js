'use strict';

const Buffer = require('buffer').Buffer;

/**
 * A class representation of the BSON Binary type.
 */
class Binary {
  /**
   * Create a Binary type
   *
   * Sub types
   *  - **BSON.BSON_BINARY_SUBTYPE_DEFAULT**, default BSON type.
   *  - **BSON.BSON_BINARY_SUBTYPE_FUNCTION**, BSON function type.
   *  - **BSON.BSON_BINARY_SUBTYPE_BYTE_ARRAY**, BSON byte array type.
   *  - **BSON.BSON_BINARY_SUBTYPE_UUID**, BSON uuid type.
   *  - **BSON.BSON_BINARY_SUBTYPE_MD5**, BSON md5 type.
   *  - **BSON.BSON_BINARY_SUBTYPE_USER_DEFINED**, BSON user defined type.
   *
   * @param {Buffer} buffer a buffer object containing the binary data.
   * @param {Number} [subType] the option binary type.
   * @return {Binary}
   */
  constructor(buffer, subType) {
    if (
      buffer != null &&
      !(typeof buffer === 'string') &&
      !Buffer.isBuffer(buffer) &&
      !(buffer instanceof Uint8Array) &&
      !Array.isArray(buffer)
    ) {
      throw new TypeError('only String, Buffer, Uint8Array or Array accepted');
    }

    this.sub_type = subType == null ? BSON_BINARY_SUBTYPE_DEFAULT : subType;
    this.position = 0;

    if (buffer != null && !(buffer instanceof Number)) {
      // Only accept Buffer, Uint8Array or Arrays
      if (typeof buffer === 'string') {
        // Different ways of writing the length of the string for the different types
        if (typeof Buffer !== 'undefined') {
          this.buffer = Buffer.from(buffer);
        } else if (typeof Uint8Array !== 'undefined' || Array.isArray(buffer)) {
          this.buffer = writeStringToArray(buffer);
        } else {
          throw new TypeError('only String, Buffer, Uint8Array or Array accepted');
        }
      } else {
        this.buffer = buffer;
      }
      this.position = buffer.length;
    } else {
      if (typeof Buffer !== 'undefined') {
        this.buffer = Buffer.alloc(Binary.BUFFER_SIZE);
      } else if (typeof Uint8Array !== 'undefined') {
        this.buffer = new Uint8Array(new ArrayBuffer(Binary.BUFFER_SIZE));
      } else {
        this.buffer = new Array(Binary.BUFFER_SIZE);
      }
    }
  }

  /**
   * Updates this binary with byte_value.
   *
   * @method
   * @param {string} byte_value a single byte we wish to write.
   */
  put(byte_value) {
    // If it's a string and a has more than one character throw an error
    if (byte_value['length'] != null && typeof byte_value !== 'number' && byte_value.length !== 1)
      throw new TypeError('only accepts single character String, Uint8Array or Array');
    if ((typeof byte_value !== 'number' && byte_value < 0) || byte_value > 255)
      throw new TypeError('only accepts number in a valid unsigned byte range 0-255');

    // Decode the byte value once
    let decoded_byte = null;
    if (typeof byte_value === 'string') {
      decoded_byte = byte_value.charCodeAt(0);
    } else if (byte_value['length'] != null) {
      decoded_byte = byte_value[0];
    } else {
      decoded_byte = byte_value;
    }

    if (this.buffer.length > this.position) {
      this.buffer[this.position++] = decoded_byte;
    } else {
      if (typeof Buffer !== 'undefined' && Buffer.isBuffer(this.buffer)) {
        // Create additional overflow buffer
        let buffer = Buffer.alloc(Binary.BUFFER_SIZE + this.buffer.length);
        // Combine the two buffers together
        this.buffer.copy(buffer, 0, 0, this.buffer.length);
        this.buffer = buffer;
        this.buffer[this.position++] = decoded_byte;
      } else {
        let buffer = null;
        // Create a new buffer (typed or normal array)
        if (isUint8Array(this.buffer)) {
          buffer = new Uint8Array(new ArrayBuffer(Binary.BUFFER_SIZE + this.buffer.length));
        } else {
          buffer = new Array(Binary.BUFFER_SIZE + this.buffer.length);
        }

        // We need to copy all the content to the new array
        for (let i = 0; i < this.buffer.length; i++) {
          buffer[i] = this.buffer[i];
        }

        // Reassign the buffer
        this.buffer = buffer;
        // Write the byte
        this.buffer[this.position++] = decoded_byte;
      }
    }
  }

  /**
   * Writes a buffer or string to the binary.
   *
   * @method
   * @param {(Buffer|string)} string a string or buffer to be written to the Binary BSON object.
   * @param {number} offset specify the binary of where to write the content.
   * @return {null}
   */
  write(string, offset) {
    offset = typeof offset === 'number' ? offset : this.position;

    // If the buffer is to small let's extend the buffer
    if (this.buffer.length < offset + string.length) {
      let buffer = null;
      // If we are in node.js
      if (typeof Buffer !== 'undefined' && Buffer.isBuffer(this.buffer)) {
        buffer = Buffer.alloc(this.buffer.length + string.length);
        this.buffer.copy(buffer, 0, 0, this.buffer.length);
      } else if (isUint8Array(this.buffer)) {
        // Create a new buffer
        buffer = new Uint8Array(new ArrayBuffer(this.buffer.length + string.length));
        // Copy the content
        for (let i = 0; i < this.position; i++) {
          buffer[i] = this.buffer[i];
        }
      }

      // Assign the new buffer
      this.buffer = buffer;
    }

    if (typeof Buffer !== 'undefined' && Buffer.isBuffer(string) && Buffer.isBuffer(this.buffer)) {
      string.copy(this.buffer, offset, 0, string.length);
      this.position =
        offset + string.length > this.position ? offset + string.length : this.position;
      // offset = string.length
    } else if (
      typeof Buffer !== 'undefined' &&
      typeof string === 'string' &&
      Buffer.isBuffer(this.buffer)
    ) {
      this.buffer.write(string, offset, 'binary');
      this.position =
        offset + string.length > this.position ? offset + string.length : this.position;
      // offset = string.length;
    } else if (isUint8Array(string) || (Array.isArray(string) && typeof string !== 'string')) {
      for (let i = 0; i < string.length; i++) {
        this.buffer[offset++] = string[i];
      }

      this.position = offset > this.position ? offset : this.position;
    } else if (typeof string === 'string') {
      for (let i = 0; i < string.length; i++) {
        this.buffer[offset++] = string.charCodeAt(i);
      }

      this.position = offset > this.position ? offset : this.position;
    }
  }

  /**
   * Reads **length** bytes starting at **position**.
   *
   * @method
   * @param {number} position read from the given position in the Binary.
   * @param {number} length the number of bytes to read.
   * @return {Buffer}
   */
  read(position, length) {
    length = length && length > 0 ? length : this.position;

    // Let's return the data based on the type we have
    if (this.buffer['slice']) {
      return this.buffer.slice(position, position + length);
    }

    // Create a buffer to keep the result
    const buffer =
      typeof Uint8Array !== 'undefined'
        ? new Uint8Array(new ArrayBuffer(length))
        : new Array(length);
    for (let i = 0; i < length; i++) {
      buffer[i] = this.buffer[position++];
    }

    // Return the buffer
    return buffer;
  }

  /**
   * Returns the value of this binary as a string.
   *
   * @method
   * @return {string}
   */
  value(asRaw) {
    asRaw = asRaw == null ? false : asRaw;

    // Optimize to serialize for the situation where the data == size of buffer
    if (
      asRaw &&
      typeof Buffer !== 'undefined' &&
      Buffer.isBuffer(this.buffer) &&
      this.buffer.length === this.position
    )
      return this.buffer;

    // If it's a node.js buffer object
    if (typeof Buffer !== 'undefined' && Buffer.isBuffer(this.buffer)) {
      return asRaw
        ? this.buffer.slice(0, this.position)
        : this.buffer.toString('binary', 0, this.position);
    } else {
      if (asRaw) {
        // we support the slice command use it
        if (this.buffer['slice'] != null) {
          return this.buffer.slice(0, this.position);
        } else {
          // Create a new buffer to copy content to
          const newBuffer = isUint8Array(this.buffer)
            ? new Uint8Array(new ArrayBuffer(this.position))
            : new Array(this.position);

          // Copy content
          for (let i = 0; i < this.position; i++) {
            newBuffer[i] = this.buffer[i];
          }

          // Return the buffer
          return newBuffer;
        }
      } else {
        return convertArraytoUtf8BinaryString(this.buffer, 0, this.position);
      }
    }
  }

  /**
   * Length.
   *
   * @method
   * @return {number} the length of the binary.
   */
  length() {
    return this.position;
  }

  /**
   * @ignore
   */
  toJSON() {
    return this.buffer != null ? this.buffer.toString('base64') : '';
  }

  /**
   * @ignore
   */
  toString(format) {
    return this.buffer != null ? this.buffer.slice(0, this.position).toString(format) : '';
  }

  /**
   * @ignore
   */
  toExtendedJSON() {
    const base64String = Buffer.isBuffer(this.buffer)
      ? this.buffer.toString('base64')
      : Buffer.from(this.buffer).toString('base64');

    const subType = Number(this.sub_type).toString(16);
    return {
      $binary: {
        base64: base64String,
        subType: subType.length === 1 ? '0' + subType : subType
      }
    };
  }

  /**
   * @ignore
   */
  static fromExtendedJSON(doc) {
    const type = doc.$binary.subType ? parseInt(doc.$binary.subType, 16) : 0;
    const data = Buffer.from(doc.$binary.base64, 'base64');
    return new Binary(data, type);
  }
}

/**
 * Binary default subtype
 * @ignore
 */
const BSON_BINARY_SUBTYPE_DEFAULT = 0;

function isUint8Array(obj) {
  return Object.prototype.toString.call(obj) === '[object Uint8Array]';
}

/**
 * @ignore
 */
function writeStringToArray(data) {
  // Create a buffer
  const buffer =
    typeof Uint8Array !== 'undefined'
      ? new Uint8Array(new ArrayBuffer(data.length))
      : new Array(data.length);

  // Write the content to the buffer
  for (let i = 0; i < data.length; i++) {
    buffer[i] = data.charCodeAt(i);
  }
  // Write the string to the buffer
  return buffer;
}

/**
 * Convert Array ot Uint8Array to Binary String
 *
 * @ignore
 */
function convertArraytoUtf8BinaryString(byteArray, startIndex, endIndex) {
  let result = '';
  for (let i = startIndex; i < endIndex; i++) {
    result = result + String.fromCharCode(byteArray[i]);
  }

  return result;
}

Binary.BUFFER_SIZE = 256;

/**
 * Default BSON type
 *
 * @classconstant SUBTYPE_DEFAULT
 **/
Binary.SUBTYPE_DEFAULT = 0;
/**
 * Function BSON type
 *
 * @classconstant SUBTYPE_DEFAULT
 **/
Binary.SUBTYPE_FUNCTION = 1;
/**
 * Byte Array BSON type
 *
 * @classconstant SUBTYPE_DEFAULT
 **/
Binary.SUBTYPE_BYTE_ARRAY = 2;
/**
 * OLD UUID BSON type
 *
 * @classconstant SUBTYPE_DEFAULT
 **/
Binary.SUBTYPE_UUID_OLD = 3;
/**
 * UUID BSON type
 *
 * @classconstant SUBTYPE_DEFAULT
 **/
Binary.SUBTYPE_UUID = 4;
/**
 * MD5 BSON type
 *
 * @classconstant SUBTYPE_DEFAULT
 **/
Binary.SUBTYPE_MD5 = 5;
/**
 * User BSON type
 *
 * @classconstant SUBTYPE_DEFAULT
 **/
Binary.SUBTYPE_USER_DEFINED = 128;

Object.defineProperty(Binary.prototype, '_bsontype', { value: 'Binary' });
module.exports = Binary;
