import * as React from 'react';
import {Link} from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {ITheme, IThemeContext, makeThemeable, ThemeableComponent} from '../components/ui/ThemeableComponent';

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

function getNavLinkStyle(): React.CSSProperties {
  return {
    color: 'white',
    marginLeft: 8,
    textDecoration: 'none',
  };
}

export class AppWrapper extends ThemeableComponent<any, void> {
  render() {
    const {theme} = this.context;
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
              <Link 
                style={getNavLinkStyle()}
                to="/builder"
              >
                Builder
              </Link>
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
            {this.props.children}
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}