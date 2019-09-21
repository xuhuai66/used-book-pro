'use strict';
/**
 * A class representation of a BSON Int32 type.
 */
class Int32 {
  /**
   * Create an Int32 type
   *
   * @param {number} value the number we want to represent as an int32.
   * @return {Int32}
   */
  constructor(value) {
    this.value = value;
  }

  /**
   * Access the number value.
   *
   * @method
   * @return {number} returns the wrapped int32 number.
   */
  valueOf() {
    return this.value;
  }

  /**
   * @ignore
   */
  toJSON() {
    return this.value;
  }

  /**
   * @ignore
   */
  toExtendedJSON(options) {
    if (options && options.relaxed) return this.value;
    return { $numberInt: this.value.toString() };
  }

  /**
   * @ignore
   */
  static fromExtendedJSON(doc, options) {
    return options && options.relaxed ? parseInt(doc.$numberInt, 10) : new Int32(doc.$numberInt);
  }
}

Object.defineProperty(Int32.prototype, '_bsontype', { value: 'Int32' });
module.exports = Int32;
