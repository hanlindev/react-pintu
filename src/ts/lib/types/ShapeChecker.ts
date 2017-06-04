import * as _ from 'lodash';
import {makeFactory, deSerializeTypeDeclaration} from './common';
import {ITypeChecker, TypeCheckerFactory} from '../interfaces';
import {PrimitiveTypeChecker} from './PrimitiveTypeChecker';

interface IShape {
  [propName: string]: TypeCheckerFactory;
}
export class ShapeChecker implements ITypeChecker {
  constructor(readonly shape: IShape, readonly required: boolean) {}

  isSerializable() {
    return false;
  }

  serialize(value: any) {
    return '';
  }

  deserialize(valueStr: string) {
    return undefined;
  }

  satisfy(other: ITypeChecker): boolean {
    if (!(other instanceof ShapeChecker)) {
      return false;
    }

    const otherString = other.toString();
    const exactEqual = this.toString() === otherString;
    if (exactEqual) {
      return true;
    }

    if (this.required) {
      const notRequiredVersion = 
        ShapeChecker.getFactory(this.shape)().toString();
      return notRequiredVersion === otherString;
    }

    return false;
  }

  validate(data: any): boolean {
    return _.every(this.shape, (typeFactory, name: string) => {
      const type = typeFactory();
      const value = data[name];
      return type.validate(value);
    });
  }

  getName(): string {
    return 'Shape'; 
  }

  isRequired() {
    return this.required;
  }

  toString() {
    const shapeArray = _.map(this.shape, (typeFactory, name: string) => {
      return [name, typeFactory().toString()];
    });
    const sortedShapeArray = _.sortBy(shapeArray, [0]);
    return JSON.stringify(['ShapeChecker', sortedShapeArray, this.required]);
  }

  toJSON() {
    return this.toString();
  }

  static fromObject(typeObject: any): TypeCheckerFactory | null {
    const deserializeCandidates = [
      PrimitiveTypeChecker,
      ShapeChecker,
    ];

    if (Array.isArray(typeObject)) {
      const name = typeObject[0];
      const shapeArray = typeObject[1];
      const required = typeObject[2];
      if (name === 'shapeChecker' && shapeArray && required !== undefined) {
        const shape: IShape = {};
        shapeArray.forEach((spec: [string, string]) => {
          const name = spec[0];
          const typeString = spec[1];
          const deserialized = deSerializeTypeDeclaration(
            typeString,
            deserializeCandidates,
          );
          deserialized && (shape[name] = deserialized);
        });
        const requireable = ShapeChecker.getFactory(shape);
        return (required) ? requireable.isRequired : requireable;
      }
    }


    return null;
  }

  static getFactory(shape: IShape) {
    return makeFactory(
      new ShapeChecker(shape, false),
      new ShapeChecker(shape, true),
    );
  }
}