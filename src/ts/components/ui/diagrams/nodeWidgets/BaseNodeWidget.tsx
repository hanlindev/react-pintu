import * as React from 'react';
import {DiagramEngine, NodeWidgetFactory} from 'storm-react-diagrams';
import {NodeModel} from '../NodeModel';
import {PortLabel} from '../PortLabel';
import {ThemeableComponent} from '../../ThemeableComponent';
import {camelToWords} from '../../../../lib/utils/strings';

export interface IBaseNodeWidgetProps {
  node: NodeModel;
  diagramEngine: DiagramEngine;
}

export abstract class BaseNodeWidget 
  extends ThemeableComponent<IBaseNodeWidgetProps, void> {
  protected getNodeRootStyle(): React.CSSProperties {
    return {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      borderRadius: '5px',
      border: '1px solid black',
      minWidth: 180,
    };
  }

  protected getTitleStyle(): React.CSSProperties {
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

  protected getPortSectionRootStyle(): React.CSSProperties {
    return {
      display: 'flex',
      color: 'white',
      flexFlow: 'row',
      fontSize: this.context.theme.fontSize.small,
      padding: '8px 8px 4px 8px',
      whiteSpace: 'nowrap',
    };
  }

  protected getLeftPortSectionStyle(): React.CSSProperties {
    return {
      flex: 1,
    };
  }

  protected getRightPortSectionStyle(): React.CSSProperties {
    return {
      flex: 1,
      marginLeft: this.context.theme.spacing.small,
      textAlign: 'right',
    };
  }

  render() {
    const {node} = this.props;
    return (
      <div style={this.getNodeRootStyle()}>
        <div style={this.getTitleStyle()}>
          {node.config.id}.
          {camelToWords(node.getName())}
        </div>

        <div style={this.getPortSectionRootStyle()}>
          {this.renderLeftPortSection()}
          {this.renderRightPortSection()}
        </div>
      </div>
    );
  }

  protected renderLeftPortSection() {
    return (
      <div style={this.getLeftPortSectionStyle()}>
        {this.getLeftPortLabels()}        
      </div>
    );
  }


  protected renderRightPortSection() {
    return (
      <div style={this.getRightPortSectionStyle()}>
        {this.getRightPortLabels()}
      </div>
    );
  }

  protected abstract getLeftPortLabels(): Array<JSX.Element>;
  protected abstract getRightPortLabels(): Array<JSX.Element>;
}
