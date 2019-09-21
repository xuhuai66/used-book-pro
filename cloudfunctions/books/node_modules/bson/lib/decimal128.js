'use strict';

let Long = require('./long');
const Buffer = require('buffer').Buffer;

const PARSE_STRING_REGEXP = /^(\+|-)?(\d+|(\d*\.\d*))?(E|e)?([-+])?(\d+)?$/;
const PARSE_INF_REGEXP = /^(\+|-)?(Infinity|inf)$/i;
const PARSE_NAN_REGEXP = /^(\+|-)?NaN$/i;

const EXPONENT_MAX = 6111;
const EXPONENT_MIN = -6176;
const EXPONENT_BIAS = 6176;
const MAX_DIGITS = 34;

// Nan value bits as 32 bit values (due to lack of longs)
const NAN_BUFFER = [
  0x7c,
  0x00,
  0x00,
  0x00,
  0x00,
  0x00,
  0x00,
  0x00,
  0x00,
  0x00,
  0x00,
  0x00,
  0x00,
  0x00,
  0x00,
  0x00
].reverse();
// Infinity value bits 32 bit values (due to lack of longs)
const INF_NEGATIVE_BUFFER = [
  0xf8,
  0x00,
  0x00,
  0x00,
  0x00,
  0x00,
  0x00,
  0x00,
  0x00,
  0x00,
  0x00,
  0x00,
  0x00,
  0x00,
  0x00,
  0x00
].reverse();
const INF_POSITIVE_BUFFER = [
  0x78,
  0x00,
  0x00,
  0x00,
  0x00,
  0x00,
  0x00,
  0x00,
  0x00,
  0x00,
  0x00,
  0x00,
  0x00,
  0x00,
  0x00,
  0x00
].reverse();

const EXPONENT_REGEX = /^([-+])?(\d+)?$/;

// Detect if the value is a digit
function isDigit(value) {
  return !isNaN(parseInt(value, 10));
}

// Divide two uint128 values
function divideu128(value) {
  const DIVISOR = Long.fromNumber(1000 * 1000 * 1000);
  let _rem = Long.fromNumber(0);

  if (!value.parts[0] && !value.parts[1] && !value.parts[2] && !value.parts[3]) {
    return { quotient: value, rem: _rem };
  }

  for (let i = 0; i <= 3; i++) {
    // Adjust remainder to match value of next dividend
    _rem = _rem.shiftLeft(32);
    // Add the divided to _rem
    _rem = _rem.add(new Long(value.parts[i], 0));
    value.parts[i] = _rem.div(DIVISOR).low;
    _rem = _rem.modulo(DIVISOR);
  }

  return { quotient: value, rem: _rem };
}

// Multiply two Long values and return the 128 bit value
function multiply64x2(left, right) {
  if (!left && !right) {
    return { high: Long.fromNumber(0), low: Long.fromNumber(0) };
  }

  const leftHigh = left.shiftRightUnsigned(32);
  const leftLow = new Long(left.getLowBits(), 0);
  const rightHigh = right.shiftRightUnsigned(32);
  const rightLow = new Long(right.getLowBits(), 0);

  let productHigh = leftHigh.multiply(rightHigh);
  let productMid = leftHigh.multiply(rightLow);
  let productMid2 = leftLow.multiply(rightHigh);
  let productLow = leftLow.multiply(rightLow);

  productHigh = productHigh.add(productMid.shiftRightUnsigned(32));
  productMid = new Long(productMid.getLowBits(), 0)
    .add(productMid2)
    .add(productLow.shiftRightUnsigned(32));

  productHigh = productHigh.add(productMid.shiftRightUnsigned(32));
  productLow = productMid.shiftLeft(32).add(new Long(productLow.getLowBits(), 0));

  // Return the 128 bit result
  return { high: productHigh, low: productLow };
}

function lessThan(left, right) {
  // Make values unsigned
  const uhleft = left.high >>> 0;
  const uhright = right.high >>> 0;

  // Compare high bits first
  if (uhleft < uhright) {
    return true;
  } else if (uhleft === uhright) {
    const ulleft = left.low >>> 0;
    const ulright = right.low >>> 0;
    if (ulleft < ulright) return true;
  }

  return false;
}

function invalidErr(string, message) {
  throw new TypeError(`"${string}" is not a valid Decimal128 string - ${message}`);
}

/**
 * A class representation of the BSON Decimal128 type.
 *
 * @class
 * @param {Buffer} bytes a buffer containing the raw Decimal128 bytes.
 * @return {Double}
 */
function Decimal128(bytes) {
  this.bytes = bytes;
}

/**
 * Create a Decimal128 instance from a string representation
 *
 * @method
 * @param {string} string a numeric string representation.
 * @return {Decimal128} returns a Decimal128 instance.
 */
Decimal128.fromString = function(string) {
  // Parse state tracking
  let isNegative = false;
  let sawRadix = false;
  let foundNonZero = false;

  // Total number of significant digits (no leading or trailing zero)
  let significantDigits = 0;
  // Total number of significand digits read
  let nDigitsRead = 0;
  // Total number of digits (no leading zeros)
  let nDigits = 0;
  // The number of the digits after radix
  let radixPosition = 0;
  // The index of the first non-zero in *str*
  let firstNonZero = 0;

  // Digits Array
  const digits = [0];
  // The number of digits in digits
  let nDigitsStored = 0;
  // Insertion pointer for digits
  let digitsInsert = 0;
  // The index of the first non-zero digit
  let firstDigit = 0;
  // The index of the last digit
  let lastDigit = 0;

  // Exponent
  let exponent = 0;
  // loop index over array
  let i = 0;
  // The high 17 digits of the significand
  let significandHigh = [0, 0];
  // The low 17 digits of the significand
  let significandLow = [0, 0];
  // The biased exponent
  let biasedExponent = 0;

  // Read index
  let index = 0;

  // Naively prevent against REDOS attacks.
  // TODO: implementing a custom parsing for this, or refactoring the regex would yield
  //       further gains.
  if (string.length >= 7000) {
    throw new TypeError('' + string + ' not a valid Decimal128 string');
  }

  // Results
  const stringMatch = string.match(PARSE_STRING_REGEXP);
  const infMatch = string.match(PARSE_INF_REGEXP);
  const nanMatch = string.match(PARSE_NAN_REGEXP);

  // Validate the string
  if ((!stringMatch && !infMatch && !nanMatch) || string.length === 0) {
    throw new TypeError('' + string + ' not a valid Decimal128 string');
  }

  if (stringMatch) {
    // full_match = stringMatch[0]
    // sign = stringMatch[1]

    let unsignedNumber = stringMatch[2];
    // stringMatch[3] is undefined if a whole number (ex "1", 12")
    // but defined if a number w/ decimal in it (ex "1.0, 12.2")

    let e = stringMatch[4];
    let expSign = stringMatch[5];
    let expNumber = stringMatch[6];

    // they provided e, but didn't give an exponent number. for ex "1e"
    if (e && expNumber === undefined) invalidErr(string, 'missing exponent power');

    // they provided e, but didn't give a number before it. for ex "e1"
    if (e && unsignedNumber === undefined) invalidErr(string, 'missing exponent base');

    if (e === undefined && (expSign || expNumber)) {
      invalidErr(string, 'missing e before exponent');
    }
  }

  // Get the negative or positive sign
  if (string[index] === '+' || string[index] === '-') {
    isNegative = string[index++] === '-';
  }

  // Check if user passed Infinity or NaN
  if (!isDigit(string[index]) && string[index] !== '.') {
    if (string[index] === 'i' || string[index] === 'I') {
      return new Decimal128(Buffer.from(isNegative ? INF_NEGATIVE_BUFFER : INF_POSITIVE_BUFFER));
    } else if (string[index] === 'N') {
      return new Decimal128(Buffer.from(NAN_BUFFER));
    }
  }

  // Read all the digits
  while (isDigit(string[index]) || string[index] === '.') {
    if (string[index] === '.') {
      if (sawRadix) invalidErr(string, 'contains multiple periods');

      sawRadix = true;
      index = index + 1;
      continue;
    }

    if (nDigitsStored < 34) {
      if (string[index] !== '0' || foundNonZero) {
        if (!foundNonZero) {
          firstNonZero = nDigitsRead;
        }

        foundNonZero = true;

        // Only store 34 digits
        digits[digitsInsert++] = parseInt(string[index], 10);
        nDigitsStored = nDigitsStored + 1;
      }
    }

    if (foundNonZero) nDigits = nDigits + 1;
    if (sawRadix) radixPosition = radixPosition + 1;

    nDigitsRead = nDigitsRead + 1;
    index = index + 1;
  }

  if (sawRadix && !nDigitsRead) throw new TypeError('' + string + ' not a valid Decimal128 string');

  // Read exponent if exists
  if (string[index] === 'e' || string[index] === 'E') {
    // Read exponent digits
    const match = string.substr(++index).match(EXPONENT_REGEX);

    // No digits read
    if (!match || !match[2]) return new Decimal128(Buffer.from(NAN_BUFFER));

    // Get exponent
    exponent = parseInt(match[0], 10);

    // Adjust the index
    index = index + match[0].length;
  }

  // Return not a number
  if (string[index]) return new Decimal128(Buffer.from(NAN_BUFFER));

  // Done reading input
  // Find first non-zero digit in digits
  firstDigit = 0;

  if (!nDigitsStored) {
    firstDigit = 0;
    lastDigit = 0;
    digits[0] = 0;
    nDigits = 1;
    nDigitsStored = 1;
    significantDigits = 0;
  } else {
    lastDigit = nDigitsStored - 1;
    significantDigits = nDigits;
    if (significantDigits !== 1) {
      while (string[firstNonZero + significantDigits - 1] === '0') {
        significantDigits = significantDigits - 1;
      }
    }
  }

  // Normalization of exponent
  // Correct exponent based on radix position, and shift significand as needed
  // to represent user input

  // Overflow prevention
  if (exponent <= radixPosition && radixPosition - exponent > 1 << 14) {
    exponent = EXPONENT_MIN;
  } else {
    exponent = exponent - radixPosition;
  }

  // Attempt to normalize the exponent
  while (exponent > EXPONENT_MAX) {
    // Shift exponent to significand and decrease
    lastDigit = lastDigit + 1;

    if (lastDigit - firstDigit > MAX_DIGITS) {
      // Check if we have a zero then just hard clamp, otherwise fail
      const digitsString = digits.join('');
      if (digitsString.match(/^0+$/)) {
        exponent = EXPONENT_MAX;
        break;
      }

      invalidErr(string, 'overflow');
    }
    exponent = exponent - 1;
  }

  while (exponent < EXPONENT_MIN || nDigitsStored < nDigits) {
    // Shift last digit. can only do this if < significant digits than # stored.
    if (lastDigit === 0 && significantDigits < nDigitsStored) {
      exponent = EXPONENT_MIN;
      significantDigits = 0;
      break;
    }

    if (nDigitsStored < nDigits) {
      // adjust to match digits not stored
      nDigits = nDigits - 1;
    } else {
      // adjust to round
      lastDigit = lastDigit - 1;
    }

    if (exponent < EXPONENT_MAX) {
      exponent = exponent + 1;
    } else {
      // Check if we have a zero then just hard clamp, otherwise fail
      const digitsString = digits.join('');
      if (digitsString.match(/^0+$/)) {
        exponent = EXPONENT_MAX;
        break;
      }
      invalidErr(string, 'overflow');
    }
  }

  // Round
  // We've normalized the exponent, but might still need to round.
  if (lastDigit - firstDigit + 1 < significantDigits) {
    let endOfString = nDigitsRead;

    // If we have seen a radix point, 'string' is 1 longer than we have
    // documented with ndigits_read, so inc the position of the first nonzero
    // digit and the position that digits are read to.
    if (sawRadix) {
      firstNonZero = firstNonZero + 1;
      endOfString = endOfString + 1;
    }
    // if negative, we need to increment again to account for - sign at start.
    if (isNegative) {
      firstNonZero = firstNonZero + 1;
      endOfString = endOfString + 1;
    }

    const roundDigit = parseInt(string[firstNonZero + lastDigit + 1], 10);
    let roundBit = 0;

    if (roundDigit >= 5) {
      roundBit = 1;
      if (roundDigit === 5) {
        roundBit = digits[lastDigit] % 2 === 1;
        for (i = firstNonZero + lastDigit + 2; i < endOfString; i++) {
          if (parseInt(string[i], 10)) {
            roundBit = 1;
            break;
          }
        }
      }
    }

    if (roundBit) {
      let dIdx = lastDigit;

      for (; dIdx >= 0; dIdx--) {
        if (++digits[dIdx] > 9) {
          digits[dIdx] = 0;

          // overflowed most significant digit
          if (dIdx === 0) {
            if (exponent < EXPONENT_MAX) {
              exponent = exponent + 1;
              digits[dIdx] = 1;
            } else {
              return new Decimal128(
                Buffer.from(isNegative ? INF_NEGATIVE_BUFFER : INF_POSITIVE_BUFFER)
              );
            }
          }
        }
      }
    }
  }

  // Encode significand
  // The high 17 digits of the significand
  significandHigh = Long.fromNumber(0);
  // The low 17 digits of the significand
  significandLow = Long.fromNumber(0);

  // read a zero
  if (significantDigits === 0) {
    significandHigh = Long.fromNumber(0);
    significandLow = Long.fromNumber(0);
  } else if (lastDigit - firstDigit < 17) {
    let dIdx = firstDigit;
    significandLow = Long.fromNumber(digits[dIdx++]);
    significandHigh = new Long(0, 0);

    for (; dIdx <= lastDigit; dIdx++) {
      significandLow = significandLow.multiply(Long.fromNumber(10));
      significandLow = significandLow.add(Long.fromNumber(digits[dIdx]));
    }
  } else {
    let dIdx = firstDigit;
    significandHigh = Long.fromNumber(digits[dIdx++]);

    for (; dIdx <= lastDigit - 17; dIdx++) {
      significandHigh = significandHigh.multiply(Long.fromNumber(10));
      significandHigh = significandHigh.add(Long.fromNumber(digits[dIdx]));
    }

    significandLow = Long.fromNumber(digits[dIdx++]);

    for (; dIdx <= lastDigit; dIdx++) {
      significandLow = significandLow.multiply(Long.fromNumber(10));
      significandLow = significandLow.add(Long.fromNumber(digits[dIdx]));
    }
  }

  const significand = multiply64x2(significandHigh, Long.fromString('100000000000000000'));
  significand.low = significand.low.add(significandLow);

  if (lessThan(significand.low, significandLow)) {
    significand.high = significand.high.add(Long.fromNumber(1));
  }

  // Biased exponent
  biasedExponent = exponent + EXPONENT_BIAS;
  const dec = { low: Long.fromNumber(0), high: Long.fromNumber(0) };

  // Encode combination, exponent, and significand.
  if (
    significand.high
      .shiftRightUnsigned(49)
      .and(Long.fromNumber(1))
      .equals(Long.fromNumber(1))
  ) {
    // Encode '11' into bits 1 to 3
    dec.high = dec.high.or(Long.fromNumber(0x3).shiftLeft(61));
    dec.high = dec.high.or(
      Long.fromNumber(biasedExponent).and(Long.fromNumber(0x3fff).shiftLeft(47))
    );
    dec.high = dec.high.or(significand.high.and(Long.fromNumber(0x7fffffffffff)));
  } else {
    dec.high = dec.high.or(Long.fromNumber(biasedExponent & 0x3fff).shiftLeft(49));
    dec.high = dec.high.or(significand.high.and(Long.fromNumber(0x1ffffffffffff)));
  }

  dec.low = significand.low;

  // Encode sign
  if (isNegative) {
    dec.high = dec.high.or(Long.fromString('9223372036854775808'));
  }

  // Encode into a buffer
  const buffer = Buffer.alloc(16);
  index = 0;

  // Encode the low 64 bits of the decimal
  // Encode low bits
  buffer[index++] = dec.low.low & 0xff;
  buffer[index++] = (dec.low.low >> 8) & 0xff;
  buffer[index++] = (dec.low.low >> 16) & 0xff;
  buffer[index++] = (dec.low.low >> 24) & 0xff;
  // Encode high bits
  buffer[index++] = dec.low.high & 0xff;
  buffer[index++] = (dec.low.high >> 8) & 0xff;
  buffer[index++] = (dec.low.high >> 16) & 0xff;
  buffer[index++] = (dec.low.high >> 24) & 0xff;

  // Encode the high 64 bits of the decimal
  // Encode low bits
  buffer[index++] = dec.high.low & 0xff;
  buffer[index++] = (dec.high.low >> 8) & 0xff;
  buffer[index++] = (dec.high.low >> 16) & 0xff;
  buffer[index++] = (dec.high.low >> 24) & 0xff;
  // Encode high bits
  buffer[index++] = dec.high.high & 0xff;
  buffer[index++] = (dec.high.high >> 8) & 0xff;
  buffer[index++] = (dec.high.high >> 16) & 0xff;
  buffer[index++] = (dec.high.high >> 24) & 0xff;

  // Return the new Decimal128
  return new Decimal128(buffer);
};

// Extract least significant 5 bits
const COMBINATION_MASK = 0x1f;
// Extract least significant 14 bits
const EXPONENT_MASK = 0x3fff;
// Value of combination field for Inf
const COMBINATION_INFINITY = 30;
// Value of combination field for NaN
const COMBINATION_NAN = 31;

/**
 * Create a string representation of the raw Decimal128 value
 *
 * @method
 * @return {string} returns a Decimal128 string representation.
 */
Decimal128.prototype.toString = function() {
  // Note: bits in this routine are referred to starting at 0,
  // from the sign bit, towards the coefficient.

  // bits 0 - 31
  let high;
  // bits 32 - 63
  let midh;
  // bits 64 - 95
  let midl;
  // bits 96 - 127
  let low;
  // bits 1 - 5
  let combination;
  // decoded biased exponent (14 bits)
  let biased_exponent;
  // the number of significand digits
  let significand_digits = 0;
  // the base-10 digits in the significand
  const significand = new Array(36);
  for (let i = 0; i < significand.length; i++) significand[i] = 0;
  // read pointer into significand
  let index = 0;

  // unbiased exponent
  let exponent;
  // the exponent if scientific notation is used
  let scientific_exponent;

  // true if the number is zero
  let is_zero = false;

  // the most signifcant significand bits (50-46)
  let significand_msb;
  // temporary storage for significand decoding
  let significand128 = { parts: new Array(4) };
  // indexing variables
  let j, k;

  // Output string
  const string = [];

  // Unpack index
  index = 0;

  // Buffer reference
  const buffer = this.bytes;

  // Unpack the low 64bits into a long
  low =
    buffer[index++] | (buffer[index++] << 8) | (buffer[index++] << 16) | (buffer[index++] << 24);
  midl =
    buffer[index++] | (buffer[index++] << 8) | (buffer[index++] << 16) | (buffer[index++] << 24);

  // Unpack the high 64bits into a long
  midh =
    buffer[index++] | (buffer[index++] << 8) | (buffer[index++] << 16) | (buffer[index++] << 24);
  high =
    buffer[index++] | (buffer[index++] << 8) | (buffer[index++] << 16) | (buffer[index++] << 24);

  // Unpack index
  index = 0;

  // Create the state of the decimal
  const dec = {
    low: new Long(low, midl),
    high: new Long(midh, high)
  };

  if (dec.high.lessThan(Long.ZERO)) {
    string.push('-');
  }

  // Decode combination field and exponent
  combination = (high >> 26) & COMBINATION_MASK;

  if (combination >> 3 === 3) {
    // Check for 'special' values
    if (combination === COMBINATION_INFINITY) {
      return string.join('') + 'Infinity';
    } else if (combination === COMBINATION_NAN) {
      return 'NaN';
    } else {
      biased_exponent = (high >> 15) & EXPONENT_MASK;
      significand_msb = 0x08 + ((high >> 14) & 0x01);
    }
  } else {
    significand_msb = (high >> 14) & 0x07;
    biased_exponent = (high >> 17) & EXPONENT_MASK;
  }

  exponent = biased_exponent - EXPONENT_BIAS;

  // Create string of significand digits

  // Convert the 114-bit binary number represented by
  // (significand_high, significand_low) to at most 34 decimal
  // digits through modulo and division.
  significand128.parts[0] = (high & 0x3fff) + ((significand_msb & 0xf) << 14);
  significand128.parts[1] = midh;
  significand128.parts[2] = midl;
  significand128.parts[3] = low;

  if (
    significand128.parts[0] === 0 &&
    significand128.parts[1] === 0 &&
    significand128.parts[2] === 0 &&
    significand128.parts[3] === 0
  ) {
    is_zero = true;
  } else {
    for (k = 3; k >= 0; k--) {
      let least_digits = 0;
      // Peform the divide
      let result = divideu128(significand128);
      significand128 = result.quotient;
      least_digits = result.rem.low;

      // We now have the 9 least significant digits (in base 2).
      // Convert and output to string.
      if (!least_digits) continue;

      for (j = 8; j >= 0; j--) {
        // significand[k * 9 + j] = Math.round(least_digits % 10);
        significand[k * 9 + j] = least_digits % 10;
        // least_digits = Math.round(least_digits / 10);
        least_digits = Math.floor(least_digits / 10);
      }
    }
  }

  // Output format options:
  // Scientific - [-]d.dddE(+/-)dd or [-]dE(+/-)dd
  // Regular    - ddd.ddd

  if (is_zero) {
    significand_digits = 1;
    significand[index] = 0;
  } else {
    significand_digits = 36;
    while (!significand[index]) {
      significand_digits = significand_digits - 1;
      index = index + 1;
    }
  }

  scientific_exponent = significand_digits - 1 + exponent;

  // The scientific exponent checks are dictated by the string conversion
  // specification and are somewhat arbitrary cutoffs.
  //
  // We must check exponent > 0, because if this is the case, the number
  // has trailing zeros.  However, we *cannot* output these trailing zeros,
  // because doing so would change the precision of the value, and would
  // change stored data if the string converted number is round tripped.
  if (scientific_exponent >= 34 || scientific_exponent <= -7 || exponent > 0) {
    // Scientific format

    // if there are too many significant digits, we should just be treating numbers
    // as + or - 0 and using the non-scientific exponent (this is for the "invalid
    // representation should be treated as 0/-0" spec cases in decimal128-1.json)
    if (significand_digits > 34) {
      string.push(0);
      if (exponent > 0) string.push('E+' + exponent);
      else if (exponent < 0) string.push('E' + exponent);
      return string.join('');
    }

    string.push(significand[index++]);
    significand_digits = significand_digits - 1;

    if (significand_digits) {
      string.push('.');
    }

    for (let i = 0; i < significand_digits; i++) {
      string.push(significand[index++]);
    }

    // Exponent
    string.push('E');
    if (scientific_exponent > 0) {
      string.push('+' + scientific_exponent);
    } else {
      string.push(scientific_exponent);
    }
  } else {
    // Regular format with no decimal place
    if (exponent >= 0) {
      for (let i = 0; i < significand_digits; i++) {
        string.push(significand[index++]);
      }
    } else {
      let radix_position = significand_digits + exponent;

      // non-zero digits before radix
      if (radix_position > 0) {
        for (let i = 0; i < radix_position; i++) {
          string.push(significand[index++]);
        }
      } else {
        string.push('0');
      }

      string.push('.');
      // add leading zeros after radix
      while (radix_position++ < 0) {
        string.push('0');
      }

      for (let i = 0; i < significand_digits - Math.max(radix_position - 1, 0); i++) {
        string.push(significand[index++]);
      }
    }
  }

  return string.join('');
};

Decimal128.prototype.toJSON = function() {
  return { $numberDecimal: this.toString() };
};

/**
 * @ignore
 */
Decimal128.prototype.toExtendedJSON = function() {
  return { $numberDecimal: this.toString() };
};

/**
 * @ignore
 */
Decimal128.fromExtendedJSON = function(doc) {
  return Decimal128.fromString(doc.$numberDecimal);
};

Object.defineProperty(Decimal128.prototype, '_bsontype', { value: 'Decimal128' });
module.exports = Decimal128;
