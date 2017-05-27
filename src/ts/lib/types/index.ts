import * as _ from 'lodash';
import {TypeCheckerFactory, IPayloadDeclaration} from '../interfaces';
import {PrimitiveTypeChecker} from './PrimitiveTypeChecker';

const number = PrimitiveTypeChecker.getFactory('number');
const string = PrimitiveTypeChecker.getFactory('string');
const bool = PrimitiveTypeChecker.getFactory('boolean');
const func = PrimitiveTypeChecker.getFactory('function');
const array = PrimitiveTypeChecker.getFactory('array');
const object = PrimitiveTypeChecker.getFactory('object');

export {
  number,
  string,
  bool,
  func,
  array,
  object,
  // We will probably never support instanceOf check until Javascript supports
  // loading Class using string. (this almost means it will never be supported)
  // instanceOf,
}


export function preparePayloadDeclarationSerialize(
  types: IPayloadDeclaration
): Object {
  return _.mapValues(types, (factory) => {
    return factory();
  });
}

const TypeClasses = [PrimitiveTypeChecker];
export function deSerializePayloadDeclaration(
  typeStrings: string | {[key: string]: string},
): IPayloadDeclaration {
  if (_.isString(typeStrings)) {
    typeStrings = JSON.parse(typeStrings);
  }
  const result: IPayloadDeclaration = {};
  _.forEach(typeStrings, (typeString, name: string) => {
    const serialized = deSerializeTypeDeclaration(JSON.parse(typeString));
    if (serialized !== null) {
      result[name] = serialized;
    }
  });
  return (_.size(result) > 0) ? result : {};
}

export function deSerializeTypeDeclaration(
  typeObject: string | Object,
): TypeCheckerFactory | null {
  if (typeof typeObject === 'string') {
    typeObject = JSON.parse(typeObject);
  }
  let result = null;
  TypeClasses.some((clazz) => {
    const trialResult = clazz.fromObject(typeObject);
    if (trialResult !== null) {
      result = trialResult;
      return true;
    }
    return false;
  });
  return result;
}

export * from './common';