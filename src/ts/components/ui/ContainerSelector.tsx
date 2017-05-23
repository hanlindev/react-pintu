import * as _ from 'lodash';
import * as React from 'react';
import * as Radium from 'radium';
import * as tinycolor from 'tinycolor2';
import {CSSProperties} from 'react';
import {DiagramEngine} from 'storm-react-diagrams';
import {ScrollableArea} from './ScrollableArea';
import {ThemeableComponent} from './ThemeableComponent';
import {ContainerRegistry} from '../../lib/ContainerRegistry';
import {IContainerSpec, IContainerSpecMap, IFlow} from '../../lib/interfaces';
import {UIContainer, LogicContainer} from '../../lib';
import {AddNode} from '../../lib/FlowEngine/diagramTriggers';
import {camelToWords} from '../../lib/utils';

const FONT_SIZE = 11;
const COLOR = 'rgb(249, 249, 249)';
const BACKGROUND_COLOR = 'rgb(64, 65, 66)';

interface IPosition {
  x: number;
  y: number;
}

interface IContainerSelectorProps {
  flow: IFlow;
  height?: number;
  registry: ContainerRegistry;
  engine: DiagramEngine;
  newNodePosition?: IPosition;
  onRequestClose?: () => any;
}

interface IContainerSelectorState {
  search?: string;
}

class _ContainerSelector 
  extends ThemeableComponent<IContainerSelectorProps, IContainerSelectorState> {

  static defaultProps = {
    height: 300,
    position: {
      x: 0,
      y: 0,
    },
  };

  state: IContainerSelectorState;

  getRootStyle(): CSSProperties {
    const {
      theme: {
        spacing: {
          tiny,
        },
      },
    } = this.context;
    return {
      backgroundColor: BACKGROUND_COLOR,
      border: '1px solid black',
      borderRadius: 5,
      paddingTop: tiny,
    };
  }

  getListStyle(): CSSProperties {
    const {
      theme: {
        spacing: {
          small,
        },
      },
    } = this.context;

    return {
      boxSizing: 'border-box',
      padding: small,
      width: 300,
    };
  }

  getListItemStyle(): CSSProperties {
    const {
      theme: {
        spacing: {
          small,
        },
      },
    } = this.context;

    return {
      color: COLOR,
      fontSize: FONT_SIZE,
      marginTop: small,
      height: 16,
      ':hover': {
        cursor: 'pointer',
        backgroundColor: tinycolor(BACKGROUND_COLOR).lighten(20).toHexString(),
      },
      ':active': {
        backgroundColor: tinycolor(BACKGROUND_COLOR).lighten(15).toHexString(),
      }
    };
  }

  private getListTitleStyle(): CSSProperties {
    const {
      theme: {
        spacing: {
          tiny,
        },
      },
    } = this.context;
    return {
      color: COLOR,
      fontSize: FONT_SIZE,
      paddingBottom: tiny,
      marginBottom: tiny,
      borderBottom: `1px solid ${COLOR}`,
    }
  }

  private onSelectContainer(containerSpec: IContainerSpec) {
    const {
      engine,
      flow,
      newNodePosition,
      onRequestClose,
    } = this.props;
    const trigger = new AddNode(
      containerSpec, 
      flow, 
      newNodePosition as IPosition,
    );
    trigger.trigger(engine);
    onRequestClose && onRequestClose();
  }

  render() {
    const {height} = this.props;

    return (
      <div
        style={this.getRootStyle()}
        onClick={(e) => e.stopPropagation()}
      >
        {this.renderSearchInput()}
        <ScrollableArea
          height={height as number}
        >
          {this.renderContent()}
        </ScrollableArea>
      </div>
    );
  }

  private getContainers(): IContainerSpecMap {
    const {search} = this.state;
    const containers = this.props.registry.containerSpecs;
    const filteredKeys = Object.keys(containers).filter((key) => {
      return !search || key.startsWith(search);
    });
    return _.pick<IContainerSpecMap, IContainerSpecMap>(
      containers,
      filteredKeys,
    );
  }

  private renderSearchInput() {
    const {
      theme: {
        spacing: {
          tiny,
          small,
        },
      },
    } = this.context;

    return (
      <div
        style={{
          padding: `0 ${small}px`,
        }}
      >
        <input
          autoFocus
          style={{
            border: 'none',
            borderRadius: 4,
            boxSizing: 'border-box',
            paddingLeft: tiny,
            paddingRight: tiny,
            width: '100%',
            fontSize: FONT_SIZE,
          }}
          type="text"
          onChange={(e) => {this.setState({search: e.target.value})}}
          placeholder="Search"
        />
      </div>
    )
  }

  private renderContent() {
    const {
      theme: {
        spacing: {
          tiny,
        },
      },
    } = this.context;

    const containers = this.getContainers();
    const content = Object.keys(containers).sort().map((name) => {
      const containerSpec = containers[name];
      const container = this.props.registry.getContainer(name);
      let containerType;
      if (container instanceof UIContainer) {
        containerType = 'U';
      } else if (container instanceof LogicContainer) {
        containerType = 'L';
      } else {
        containerType = '?';
      }
      return (
        <div
          key={name}
          onClick={() => this.onSelectContainer(containerSpec)}
          style={this.getListItemStyle()}
        >
          <span
            style={{
              border: `1px solid ${COLOR}`,
              borderRadius: 2,
              fontSize: 8,
              padding: 2,
              marginRight: tiny,
            }}
          >
            {containerType}
          </span>
          {camelToWords(name)}
        </div>
      );
    });

    return (
      <div
        style={this.getListStyle()}
      >
        <div
          style={this.getListTitleStyle()}
        >
          Select a step container to add to the canvas.
        </div>
        {content}
      </div>
    );
  }
}

export const ContainerSelector = Radium(_ContainerSelector);