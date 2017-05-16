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
  typesString: string,
): IPayloadDeclaration | null {
  const typesObject = JSON.parse(typesString);
  const result: IPayloadDeclaration = {};
  _.forEach(typesObject, (typeObject, name: string) => {
    const serialized = deSerializeTypeDeclaration(typeObject);
    if (serialized !== null) {
      result[name] = serialized;
    }
  });
  return (_.size(result) > 0) ? result : null;
}

export function deSerializeTypeDeclaration(
  typeObject: any,
): TypeCheckerFactory | null {
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