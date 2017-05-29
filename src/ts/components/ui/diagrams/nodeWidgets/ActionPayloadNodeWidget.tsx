import * as React from 'react';
import {DiagramEngine, NodeWidgetFactory} from 'storm-react-diagrams';
import {NodeModel} from '../NodeModel';
import {BaseNodeWidget} from './BaseNodeWidget';
import {PortLabel} from '../PortLabel';
import {ThemeableComponent} from '../../ThemeableComponent';
import {camelToWords} from '../../../../lib/utils/strings';

/**
 * ActionPayloadMultiplexer is a special container that does not specify the
 * input prop types but reads from the source action and export source
 * action's payload types as output proptypes.
 */
export class ActionPayloadNodeWidget extends BaseNodeWidget {
  protected getLeftPortLabels(): Array<JSX.Element> {
    const {node} = this.props;

    return [
      <PortLabel
        key="entrance"
        model={node.getEntrancePortModel()}
      />
    ];
  }

  protected getTitleStyle(): React.CSSProperties {
    const style = super.getTitleStyle();
    style.background =
      'linear-gradient(to right, rgb(0, 169, 212), rgba(255, 255, 255, 0.2))';
    return style;
  }
  
  protected getRightPortLabels(): Array<JSX.Element> {
    const {node} = this.props;
    const {
      theme: {
        spacing: {
          small,
        },
      },
    } = this.context;
    let results = node.getActionPortModels().map((model, i) => {
      const style: React.CSSProperties = (i > 0)
        ? {
          marginTop: small,
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

    results = results.concat(node.getOutputPortModels().map((model) => {
      return (
        <PortLabel
          key={model.getID()}
          model={model}
          style={{
            marginTop: small,
          }}
        />
      );
    }));

    return results;
  }
}
