import * as React from 'react';
import {DiagramEngine, NodeWidgetFactory} from 'storm-react-diagrams';
import {PintuNodeModel} from './PintuNodeModel';
import {PintuNodeWidget} from './PintuNodeWidget';

export class PintuNodeFactory extends NodeWidgetFactory {
  constructor() {
    super('Pintu');
  }

  generateReactWidget(diagramEngine: DiagramEngine, node: PintuNodeModel) {
    return <PintuNodeWidget diagramEngine={diagramEngine} node={node} />;
  }
}