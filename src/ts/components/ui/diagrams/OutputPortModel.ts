import {AbstractInstanceFactory} from 'storm-react-diagrams';
import {InputPortModel} from './InputPortModel';
import {TypeCheckerFactory} from '../../../lib/interfaces';

export class OutputPortModel extends InputPortModel {
  constructor(
    outputName?: string, 
    type?: TypeCheckerFactory, 
    readonly groupID?: string,
  ) {
    super(outputName, type);
    this.portType = 'output';
  }
}

export class OutputPortFactory extends AbstractInstanceFactory<OutputPortModel> {
  constructor() {
    super('OutputPortModel');
  }

  getInstance() {
    return new OutputPortModel();
  }
}