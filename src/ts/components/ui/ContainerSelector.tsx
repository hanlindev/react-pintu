import * as _ from 'lodash';
import * as React from 'react';
import * as Radium from 'radium';
import * as tinycolor from 'tinycolor2';
import {CSSProperties} from 'react';
import {ScrollableArea} from './ScrollableArea';
import {ThemeableComponent} from './ThemeableComponent';
import {ContainerRegistry, IContainerSpec, IContainerSpecMap} from '../../lib/ContainerRegistry';

const FONT_SIZE = 11;
const COLOR = 'rgb(249, 249, 249)';
const BACKGROUND_COLOR = 'rgb(64, 65, 66)';

interface IContainerSelectorProps {
  height?: number;
  registry: ContainerRegistry;
}

interface IContainerSelectorState {
  search?: string;
}

class _ContainerSelector 
  extends ThemeableComponent<IContainerSelectorProps, IContainerSelectorState> {

  static defaultProps = {
    height: 300,
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
      borderRadius: 2,
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
          tiny,
          small,
        },
      },
    } = this.context;
    return {
      color: COLOR,
      fontSize: FONT_SIZE,
      padding: `${tiny}px ${small}px`,
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

  private getSearchInputStyle(): CSSProperties {
    return {
    };
  }

  render() {
    const {height} = this.props;

    return (
      <div
        style={this.getRootStyle()}
        onClick={(e) => e.stopPropagation()}
      >
        <ScrollableArea
          height={height as number}
        >
          {this.renderSearchInput()}
          {this.renderContent()}
        </ScrollableArea>
      </div>
    );
  }

  private getContainers(): IContainerSpecMap {
    const {search} = this.state;
    const containers = this.props.registry.registeredContainers;
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
        },
      },
    } = this.context;

    return (
      <div
        style={{
          padding: `0 ${tiny}px`,
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
    const containers = this.getContainers();
    const content = Object.keys(containers).sort().map((name) => {
      const container = containers[name];
      return (
        <div
          key={name}
          style={this.getListItemStyle()}
        >
          {name}
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