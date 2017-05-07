import * as Props from 'prop-types';
import * as _ from 'lodash';

type ReactPropType = Props.Validator<any>;
type TypeCheckerFactory = () => TypeChecker;

interface TypeChecker {
  isEqual: (other: TypeChecker) => boolean;
  toPropType: () => ReactPropType;
  toString: () => string;
  validate: (value: any) => boolean;
}

interface Requireable extends TypeCheckerFactory {
  isRequired: TypeCheckerFactory;
}

function makeFactory(
  optional: TypeChecker,
  required: TypeChecker,
): Requireable {
  const result: any = () => optional;
  result.required = () => required;
  return result as Requireable;
}

type PrimitiveType = 
  'number' 
  | 'boolean' 
  | 'string' 
  | 'function' 
  | 'object' 
  | 'array';
type LodashChecker = (value: any) => boolean;
class PrimitiveTypeChecker implements TypeChecker {
  private lodashChecker: LodashChecker;

  constructor(
    private type: PrimitiveType,
    private required: boolean,
  ) {
    this.lodashChecker = (_ as any)[`is${_.upperFirst(type)}`];
    if (!this.lodashChecker) {
      throw new TypeError(`Invalid type - ${type}`);
    }
  }

  isEqual(other: TypeChecker | undefined): boolean {
    return (
      other instanceof PrimitiveTypeChecker
      && this.toString() === other.toString()
    );
  }

  toPropType(): ReactPropType {
    let result;
    switch (this.type) {
      case 'boolean':
        result = Props.bool;
      case 'function':
        result = Props.func;
      default:
        result = (Props as any)[this.type];
    }

    return (this.required) ? result.isReqeuired : result;
  }

  toString() {
    return JSON.stringify(['PrimitiveTypeChecker', this.type, this.required]);
  }

  validate(value: any) {
    return (
      (!this.required && value === undefined)
      || this.lodashChecker(value)
    );
  }

  static getFactory(type: PrimitiveType) {
    return makeFactory(
      new PrimitiveTypeChecker(type, false),
      new PrimitiveTypeChecker(type, true),
    );
  }
}

interface ClassConstructor<T> {
  new (...args: Array<any>): T;
}

class ClassInstanceTypeChecker implements TypeChecker {
  constructor(
    private clazz: ClassConstructor<any>,
    private required: boolean,
  ) {}

  isEqual(other: TypeChecker): boolean {
    return (
      other instanceof ClassInstanceTypeChecker
      && other.toString() === this.toString()
    );
  }

  toPropType(): ReactPropType {
    let result = Props.instanceOf(this.clazz);
    return (this.required) ? result.isRequired : result;
  }

  toString() {
    return JSON.stringify(
      ['ClassInstanceTypeChecker', this.clazz.name, this.required],
    );
  }

  validate(value: any) {
    return (
      (!this.required && value === undefined)
      || value instanceof this.clazz
    );
  }

  static getFactory() {
    return (clazz: ClassConstructor<any>) => {
      return makeFactory(
        new ClassInstanceTypeChecker(clazz, false),
        new ClassInstanceTypeChecker(clazz, true),
      );
    };
  }
}

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