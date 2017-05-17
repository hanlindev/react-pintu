import * as React from 'react';
import {DiagramEngine, NodeWidgetFactory} from 'storm-react-diagrams';
import {PintuNodeModel} from './PintuNodeModel';
import {PintuPortLabel} from './PintuPortLabel';
import {ThemeableComponent} from '../ThemeableComponent';
import {camelToWords} from '../../../lib/utils/strings';

export interface IPintuNodeWidgetProps {
  node: PintuNodeModel;
  diagramEngine: DiagramEngine;
}

export class PintuNodeWidget extends ThemeableComponent<IPintuNodeWidgetProps, void> {
  _getNodeRootStyle(): React.CSSProperties {
    return {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      borderRadius: '5px',
      border: '1px solid black',
      minWidth: 180,
    };
  }

  _getTitleStyle(): React.CSSProperties {
    const {
      theme: {
        spacing: {
          tiny,
          small,
        },
        fontSize: {
          medium,
        }
      },
    } = this.context;
    return {
      background: 
        'linear-gradient(to right, rgba(51, 101, 138, 1), rgba(255, 255, 255, 0.2))',
      borderRadius: '5px 5px 0 0 ',
      color: 'white',
      fontSize: medium,
      padding: `${tiny}px ${small}px`,
    };
  }

  _getPortSectionRootStyle(): React.CSSProperties {
    return {
      display: 'flex',
      color: 'white',
      flexFlow: 'row',
      fontSize: this.context.theme.fontSize.small,
      padding: '8px 8px 4px 8px',
      whiteSpace: 'nowrap',
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
      marginLeft: this.context.theme.spacing.small,
      textAlign: 'right',
    };
  }

  render() {
    const {node} = this.props;
    return (
      <div style={this._getNodeRootStyle()}>
        <div style={this._getTitleStyle()}>
          {camelToWords(node.getName())}
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
      return (
        <PintuPortLabel 
          key={model.getID()} 
          model={model} 
          style={{
            marginTop: this.context.theme.spacing.small,
          }}
        />
      );
    });
    return (
      <div style={this._getInputPortSectionStyle()}>
        <PintuPortLabel 
          model={node.getEntrancePortModel()} 
        />
        {content}
      </div>
    );
  }

  _renderActionPortSection() {
    const {node} = this.props;
    const content = node.getActionPortModels().map((model, i) => {
      const style: React.CSSProperties = (i > 0)
        ? {
          marginTop: this.context.theme.spacing.small,
        }
        : {
          top: 0,
        };
      return (
        <PintuPortLabel 
          key={model.getID()} 
          model={model} 
          style={style}
        />
      );
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
    super('PintuNode');
  }

  generateReactWidget(diagramEngine: DiagramEngine, node: PintuNodeModel) {
    return <PintuNodeWidget diagramEngine={diagramEngine} node={node} />;
  }
}