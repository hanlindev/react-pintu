import * as React from 'react';
import {DiagramEngine, NodeWidgetFactory as SRDNodeWidgetFactory} from 'storm-react-diagrams';
import {BaseNodeWidget} from './BaseNodeWidget';
import {ActionPayloadNodeWidget} from './ActionPayloadNodeWidget';
import {NodeModel} from '../NodeModel';
import {PortLabel} from '../PortLabel';
import {ThemeableComponent} from '../../ThemeableComponent';
import {camelToWords} from '../../../../lib/utils/strings';
import {ActionPayloadMultiplexer} from '../../../../lib/containers';

export class NodeWidget extends BaseNodeWidget {
  protected getLeftPortLabels(): Array<JSX.Element> {
    const {node} = this.props;
    const content = node.getInputPortModels().map((model) => {
      return (
        <PortLabel 
          key={model.getID()} 
          model={model} 
          style={{
            marginTop: this.context.theme.spacing.small,
          }}
        />
      );
    });
    return [
      <PortLabel
        key="entrance"
        model={node.getEntrancePortModel()} 
      />,
      ...content,
    ];
  }

  
  protected getRightPortLabels(): Array<JSX.Element> {
    const {node} = this.props;
    return node.getActionPortModels().map((model, i) => {
      const style: React.CSSProperties = (i > 0)
        ? {
          marginTop: this.context.theme.spacing.small,
        }
        : {
          top: 0,
        };
      return (
        <PortLabel 
          key={model.getID()} 
          model={model} 
          style={style}
        />
      );
    });
  }

  render() {
    const {
      node,
    } = this.props;
    const container = this.context.registry.getContainer(node.container.name);
    if (container instanceof ActionPayloadMultiplexer) {
      return (
        <ActionPayloadNodeWidget {...this.props} />
      );
    }

    return super.render();
  }
}

export class NodeWidgetFactory extends SRDNodeWidgetFactory {
  constructor() {
    super('Node');
  }

  generateReactWidget(diagramEngine: DiagramEngine, node: NodeModel) {
    return <NodeWidget diagramEngine={diagramEngine} node={node} />;
  }
}