import * as _ from 'lodash';
import {PortModel} from 'storm-react-diagrams';
import {ITypeChecker} from '../../../lib';

export class PintuBasePortModel extends PortModel {
  public portType = 'base';

  constructor(name: string) {
    super(name);
  }

  public clearLinks() {
    const links = _.values(this.links);
    links.forEach((link) => {
      this.removeLink(link);
    });
  }

  serialize() {
    return {
      ...super.serialize(),
      portType: this.portType,
    };
  }

  deSerialize(data: any) {
    super.deSerialize(data);
    this.portType = data.portType;
  }
}