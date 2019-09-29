'use strict';

const FIRST_BIT = 0x80;
const FIRST_TWO_BITS = 0xc0;
const FIRST_THREE_BITS = 0xe0;
const FIRST_FOUR_BITS = 0xf0;
const FIRST_FIVE_BITS = 0xf8;

const TWO_BIT_CHAR = 0xc0;
const THREE_BIT_CHAR = 0xe0;
const FOUR_BIT_CHAR = 0xf0;
const CONTINUING_CHAR = 0x80;

/**
 * Determines if the passed in bytes are valid utf8
 * @param {Buffer|Uint8Array} bytes An array of 8-bit bytes. Must be indexable and have length property
 * @param {Number} start The index to start validating
 * @param {Number} end The index to end validating
 * @returns {boolean} True if valid utf8
 */
function validateUtf8(bytes, start, end) {
  let continuation = 0;

  for (let i = start; i < end; i += 1) {
    const byte = bytes[i];

    if (continuation) {
      if ((byte & FIRST_TWO_BITS) !== CONTINUING_CHAR) {
        return false;
      }
      continuation -= 1;
    } else if (byte & FIRST_BIT) {
      if ((byte & FIRST_THREE_BITS) === TWO_BIT_CHAR) {
        continuation = 1;
      } else if ((byte & FIRST_FOUR_BITS) === THREE_BIT_CHAR) {
        continuation = 2;
      } else if ((byte & FIRST_FIVE_BITS) === FOUR_BIT_CHAR) {
        continuation = 3;
      } else {
        return false;
      }
    }
  }

  return !continuation;
}

module.exports.validateUtf8 = validateUtf8;
