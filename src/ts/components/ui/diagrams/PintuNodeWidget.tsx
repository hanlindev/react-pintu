import * as React from 'react';
import {DiagramEngine, NodeWidgetFactory} from 'storm-react-diagrams';
import {PintuNodeModel} from './PintuNodeModel';
import {PintuPortWidget} from './PintuPortWidget';

export interface IPintuNodeWidgetProps {
  node: PintuNodeModel;
  diagramEngine: DiagramEngine;
}

export class PintuNodeWidget extends React.Component<IPintuNodeWidgetProps, void> {
  _getNodeRootStyle(): React.CSSProperties {
    return {

    };
  }

  _getTitleStyle(): React.CSSProperties {
    return {

    };
  }

  _getPortSectionRootStyle(): React.CSSProperties {
    return {
      display: 'flex',
      flexFlow: 'row',
    };
  }

  _getInputPortSectionStyle(): React.CSSProperties {
    return {
      flex: 1,
    };
  }

  _getActionPortSectionStyle(): React.CSSProperties {
    return {
      flex: 1,
    };
  }

  render() {
    const {node} = this.props;

    return (
      <div style={this._getNodeRootStyle()}>
        <div style={this._getTitleStyle()}>
          {node.getName()}
        </div>

        <div style={this._getPortSectionRootStyle()}>
          {this._renderInputPortSection()}
          {this._renderActionPortSection()}
        </div>
      </div>
    );
  }

  _renderInputPortSection() {
    const {node} = this.props;
    const content = node.getInputPortModels().map((model) => {
      return <PintuPortWidget key={model.getID()} model={model} />;
    });
    return (
      <div style={this._getInputPortSectionStyle()}>
        {content}
      </div>
    );
  }

  _renderActionPortSection() {
    const {node} = this.props;
    const content = node.getActionPortModels().map((model) => {
      return <PintuPortWidget key={model.getID()} model={model} />;
    });
    return (
      <div style={this._getActionPortSectionStyle()}>
        {content}
      </div>
    );
  }
}

export class PintuNodeWidgetFactory extends NodeWidgetFactory {
  constructor() {
    super('Pintu');
  }

  generateReactWidget(diagramEngine: DiagramEngine, node: PintuNodeModel) {
    return <PintuNodeWidget diagramEngine={diagramEngine} node={node} />;
  }
}