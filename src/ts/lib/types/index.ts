import {PrimitiveTypeChecker} from './PrimitiveTypeChecker';
import {ClassInstanceTypeChecker} from './ClassInstanceTypeChecker';

const number = PrimitiveTypeChecker.getFactory('number');
const string = PrimitiveTypeChecker.getFactory('string');
const bool = PrimitiveTypeChecker.getFactory('boolean');
const func = PrimitiveTypeChecker.getFactory('function');
const array = PrimitiveTypeChecker.getFactory('array');
const object = PrimitiveTypeChecker.getFactory('object');
const instanceOf = ClassInstanceTypeChecker.getFactory();

export {
  number,
  string,
  bool,
  func,
  array,
  object,
  instanceOf,
}

export * from './common';