'use strict';
/**
 * A class representation of the BSON MinKey type.
 */
class MinKey {
  /**
   * Create a MinKey type
   *
   * @return {MinKey} A MinKey instance
   */
  constructor() {}

  /**
   * @ignore
   */
  toExtendedJSON() {
    return { $minKey: 1 };
  }

  /**
   * @ignore
   */
  static fromExtendedJSON() {
    return new MinKey();
  }
}

Object.defineProperty(MinKey.prototype, '_bsontype', { value: 'MinKey' });
module.exports = MinKey;
