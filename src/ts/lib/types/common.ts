import * as _ from 'lodash';
import * as Props from 'prop-types';
import {ITypeChecker, Requireable, IPayloadDeclaration, TypeCheckerFactory} from '../interfaces';

export function makeFactory(
  optional: ITypeChecker,
  required: ITypeChecker,
): Requireable {
  const result: any = () => optional;
  result.isRequired = () => required;
  return result as Requireable;
}

export function getRequiredProps(
  propTypes: IPayloadDeclaration,
): IPayloadDeclaration {
  const result: IPayloadDeclaration = {};
  _.forEach(propTypes, (type, name: string) => {
    if (type().isRequired()) {
      result[name] = type;
    }
  });
  return result;
}

export function deSerializeTypeDeclaration(
  typeObject: string | Object,
  candidates: Array<new (...args: Array<any>) => any>,
): TypeCheckerFactory | null {
  if (typeof typeObject === 'string') {
    typeObject = JSON.parse(typeObject);
  }
  let result = null;
  candidates.some((clazz) => {
    const trialResult = (clazz as any).fromObject(typeObject);
    if (trialResult !== null) {
      result = trialResult;
      return true;
    }
    return false;
  });
  return result;
}
