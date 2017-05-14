import * as Props from 'prop-types';

export type ReactPropType = Props.Validator<any>;

export type TypeCheckerFactory = () => ITypeChecker;

export interface Requireable extends TypeCheckerFactory {
  isRequired: TypeCheckerFactory;
}

export interface ITypeChecker {
  isEqual: (other: ITypeChecker) => boolean;
  toPropType: () => ReactPropType;
  toString: () => string;
  validate: (value: any) => boolean;
}
