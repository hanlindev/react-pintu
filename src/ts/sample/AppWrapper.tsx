import * as React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {ITheme, IThemeContext, makeThemeable} from '../components/ui/ThemeableComponent';

import {Icon} from './ui';

const navheight = 40;

function getRootStyle(): React.CSSProperties {
  return {
    boxSizing: 'border-box',
    height: '100%',
    paddingTop: navheight,
  };
}

function getNavbarStyle(theme: ITheme): React.CSSProperties {
  return {
    alignItems: 'center',
    backgroundColor: theme.color.normal,
    boxShadow: '0 0 4px rgba(0,0,0,.14), 0 4px 8px rgba(0,0,0,.28)',
    boxSizing: 'border-box',
    color: 'white',
    display: 'flex',
    flexFlow: 'row',
    height: navheight,
    padding: `0 ${theme.spacing.small}px`,
    position: 'fixed',
    top: 0,
    width: '100%',
  };
}

function getContentStyle(): React.CSSProperties {
  return {
    height: '100%',
  };
}

function _AppWrapper(props: any, context: IThemeContext) {
  const {theme} = context;
  return (
    <MuiThemeProvider>
      <div style={getRootStyle()}>
        <div style={getNavbarStyle(theme)}>
          <div
            style={{
              alignItems: 'center',
              display: 'flex',
              flex: '0 0 auto',
              userSelect: 'none',
            }}
          >
            <Icon style={{marginRight: 8}}>view_compact</Icon>
            Pintu Demo
          </div>
          <div
            style={{flex: 1}}
          />
          <div
            style={{
              flex: '0 0 auto',
            }}
          >
          </div>
        </div>

        <div style={getContentStyle()}>
          {props.children}
        </div>
      </div>
    </MuiThemeProvider>
  );
}

export const AppWrapper = makeThemeable(_AppWrapper);