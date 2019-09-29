'use strict';
/**
 * A class representation of the BSON MaxKey type.
 */
class MaxKey {
  /**
   * Create a MaxKey type
   *
   * @return {MaxKey} A MaxKey instance
   */
  constructor() {}

  /**
   * @ignore
   */
  toExtendedJSON() {
    return { $maxKey: 1 };
  }

  /**
   * @ignore
   */
  static fromExtendedJSON() {
    return new MaxKey();
  }
}

Object.defineProperty(MaxKey.prototype, '_bsontype', { value: 'MaxKey' });
module.exports = MaxKey;
