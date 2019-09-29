'use strict';

const Buffer = require('buffer').Buffer;
const Long = require('./long');

const MASK_8 = 0xff;
const MASK_24 = 0xffffff;
const MASK_32 = 0xffffffff;

// See http://www.isthe.com/chongo/tech/comp/fnv/#FNV-param for the definition of these parameters;
const FNV_PRIME = new Long(16777619, 0);
const OFFSET_BASIS = new Long(2166136261, 0);
const FNV_MASK = new Long(MASK_32, 0);

/**
 * Implementation of the FNV-1a hash for a 32-bit hash value
 * Algorithm can be found here: http://www.isthe.com/chongo/tech/comp/fnv/#FNV-1a
 * @ignore
 */
function fnv1a32(input, encoding) {
  encoding = encoding || 'utf8';
  const octets = Buffer.from(input, encoding);

  let hash = OFFSET_BASIS;
  for (let i = 0; i < octets.length; i += 1) {
    hash = hash.xor(new Long(octets[i], 0));
    hash = hash.multiply(FNV_PRIME);
    hash = hash.and(FNV_MASK);
  }
  return hash.getLowBitsUnsigned();
}

/**
 * Implements FNV-1a to generate 32-bit hash, then uses xor-folding
 * to convert to a 24-bit hash. See here for more info:
 * http://www.isthe.com/chongo/tech/comp/fnv/#xor-fold
 * @ignore
 */
function fnv1a24(input, encoding) {
  const _32bit = fnv1a32(input, encoding);
  const base = _32bit & MASK_24;
  const top = (_32bit >>> 24) & MASK_8;
  const final = (base ^ top) & MASK_24;

  return final;
}

module.exports = { fnv1a24, fnv1a32 };
