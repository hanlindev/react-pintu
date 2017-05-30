import * as Radium from 'radium';
import * as React from "react";
import * as cx from 'classnames';
import {PortModel, NodeModel} from 'storm-react-diagrams';
import {FontIcon} from 'material-ui';

import {InputPortModel} from './InputPortModel';
import {OutputPortModel} from './OutputPortModel';
import {ActionPortModel} from './ActionPortModel';
import {EntrancePortModel} from './EntrancePortModel';
import {UseType} from './common';
import {TypeCheckerFactory} from '../../../lib/interfaces';
import {PrimitiveTypeChecker} from '../../../lib/types/PrimitiveTypeChecker';


export interface IPortProps {
	name: string;
	port: PortModel;
  node: NodeModel;
  use?: UseType;
}

interface Colors {
  backgroundColor: string;
  borderColor: string;
}

const DEFAULT_COLORS = {
  backgroundColor: 'white',
  borderColor: 'white',
};

class _PortWidget extends React.Component<IPortProps, void> {
  static defaultProps = {
    use: 'diagram',
  };
  
  get mode() {
    return (() => {
      const {port} = this.props;
      if (
        port instanceof InputPortModel 
        || port instanceof OutputPortModel
      ) {
        return 'type';
      } else if (port instanceof ActionPortModel) {
        return 'action';
      } else {
        return 'default';
      }
    })();
  }

  get type(): TypeCheckerFactory | null {
    return (() => {
      const {port} = this.props;
      if (port instanceof InputPortModel) {
        return port.type;
      }
      return null;
    })();
  }

  get cursor(): 'crosshair' | 'initial' {
    return (() => {
      return (this.props.use === 'diagram') ? 'crosshair' : 'initial';
    })();
  }

	constructor(props: IPortProps){
		super(props);
	}

  private getColors(typeFactory: TypeCheckerFactory | null): Colors {
    if (!typeFactory) {
      return DEFAULT_COLORS;
    }

    const type = typeFactory();
    if (type instanceof PrimitiveTypeChecker) {
      let borderColor;
      let backgroundColor = 'black';
      switch (type.type) {
        case 'boolean':
          borderColor = 'rgb(219, 6, 59)';
          break;
        case 'number':
          borderColor = 'rgb(0, 255, 212)';
          break;
        case 'array':
        case 'object':
          borderColor = 'rgb(0, 192, 255)';
          backgroundColor = 'transparent';
          break;
        case 'string':
        default:
          borderColor = 'rgb(232, 9, 232)';
      }
      return {
        borderColor,
        backgroundColor,
      };
    }

    return DEFAULT_COLORS;
  }

  private getTypePortIconStyle(
    typeFactory: TypeCheckerFactory | null,
  ): React.CSSProperties {
    if (!typeFactory) {
      return {};
    }

    let size;
    const type = typeFactory();
    if (type instanceof PrimitiveTypeChecker) {
      size = 8;
      switch (type.type) {
        case 'array':
        case 'object':
          return {
            height: 13,
            cursor: this.cursor,
            width: 13,
          };
        default:
          return {
            borderRadius: '50%',
            borderWidth: 2,
            borderStyle: 'solid',
            cursor: this.cursor,
            height: size,
            userSelect: 'none',
            width: size,
          };
      }
    }
    return {};
  }

  private getArrayIcon(
    typeFactory: TypeCheckerFactory | null,
  ) {
    if (!typeFactory) {
      return null;
    }

    const type = typeFactory();
    if (
      type instanceof PrimitiveTypeChecker 
      && (type.type === 'array' || type.type === 'object')
    ) {
      return (
        <FontIcon 
          className="material-icons"
          style={{
            color: 'rgb(0, 192, 255)',
            fontSize: 13,
            marginLeft: -1,
          }}
        >
          {(type.type === 'array') ? 'view_comfy' : 'list'}
        </FontIcon>
      );
    }
    return null;
  }

  private getRootStyle(): React.CSSProperties {
    const {
      port
    } = this.props;

    const commonStyle: React.CSSProperties = {
      ...this.getColors(this.type),
      position: 'relative',
    };

    let size;
    switch (this.mode) {
      case 'type':
        return {
          ...commonStyle,
          ...this.getTypePortIconStyle(this.type),
        };
      case 'default':
      case 'action':
      default:
        size = 5;
        return {
          ...commonStyle,
          backgroundColor: 'transparent',
          borderColor: 'transparent transparent transparent white',
          borderStyle: 'solid',
          borderWidth: size,
          cursor: this.cursor,
          left: 6,
          marginRight: 2,
          height: 0,
          width: 0,
        }
    }
  }

	render() {
    const {name, node, use} = this.props;
    const className = cx({
      'port': use === 'diagram',
    });

    return (
      <div
        style={this.getRootStyle()}
        className={className}
        data-name={name}
        data-nodeid={node.getID()}
      >
        {this.getArrayIcon(this.type)}
        {this.getBefore()}
      </div>
    );
  }

  getBefore() {
    if (this.mode !== 'type') {
      return (
        <span
          style={{
            width: 3,
            height: 10,
            backgroundColor: 'white',
            borderRadius: '20% 3px 3px 20%',
            borderRight: '1px solid white',
            display: 'inline-block',
            position: 'absolute',
            top: -5,
            left: -8,
          }}
        />
      );
    }
    return null;
  }
}

export const PortWidget = Radium(_PortWidget);