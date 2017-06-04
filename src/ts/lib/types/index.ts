import * as _ from 'lodash';
import {TypeCheckerFactory, IPayloadDeclaration} from '../interfaces';
import {deSerializeTypeDeclaration} from './common';
import {PrimitiveTypeChecker} from './PrimitiveTypeChecker';
import {ShapeChecker} from './ShapeChecker';

const number = PrimitiveTypeChecker.getFactory('number');
const string = PrimitiveTypeChecker.getFactory('string');
const bool = PrimitiveTypeChecker.getFactory('boolean');
const func = PrimitiveTypeChecker.getFactory('function');
const array = PrimitiveTypeChecker.getFactory('array');
const object = PrimitiveTypeChecker.getFactory('object');
const shape = ShapeChecker.getFactory;

export {
  number,
  string,
  bool,
  func,
  array,
  object,
  shape,
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

export const SerializableTypeClasses = [PrimitiveTypeChecker, ShapeChecker];
export function deSerializePayloadDeclaration(
  typeStrings: string | {[key: string]: string},
): IPayloadDeclaration {
  if (_.isString(typeStrings)) {
    typeStrings = JSON.parse(typeStrings);
  }
  const result: IPayloadDeclaration = {};
  _.forEach(typeStrings, (typeString, name: string) => {
    const serialized = deSerializeTypeDeclaration(
      JSON.parse(typeString),
      SerializableTypeClasses,
    );
    if (serialized !== null) {
      result[name] = serialized;
    }
  });
  return (_.size(result) > 0) ? result : {};
}

export * from './common';