import * as _ from 'lodash';
import * as React from 'react';
import {createStore} from 'redux'
import {Provider} from 'react-redux'
import {Router, Route} from 'react-router';

import {history, store} from '../lib/History';
import {ViewRegistry} from '../lib/ViewRegistry';
import {ITheme, IThemeContext} from './ui/ThemeableComponent';

export interface IPintuProviderProps {
  appWrapper?: React.StatelessComponent<any>;
  builderUrlPrefix?: string;
  theme?: Pick<ITheme, any>;
  viewRegistry: ViewRegistry;
}

// Dummy themes, fill in the correct values.
const DEFAULT_CONTEXT: IThemeContext = {
  theme: {
    color: {
      primary: 'blue',
      accent: 'gray',
      danger: 'read',
    },
  },
}

export class PintuProvider extends React.Component<IPintuProviderProps, void> {
  static defaultProps = {
    appWrapper: (props: any) => <div>props.children</div>,
    builderUrlPrefix: '/builder',
  };

  constructor(props: IPintuProviderProps) {
    super(props, {theme: _.merge({...DEFAULT_CONTEXT}, {theme: props.theme})});
  }

  render() {
    const {builderUrlPrefix, appWrapper, children, viewRegistry} = this.props;
    const routes = _.map(
      viewRegistry.registeredContainers,
      (spec, name) => {
        return (
          <Route 
            key={name}
            path={spec.pathTemplate} 
            component={spec.component} 
          />
        );
      }
    );
    return (
      <Provider store={store}>
        <Router history={history}>
          <div>
            <Route component={appWrapper}>
              {routes}
              {children}
            </Route>
          </div>
        </Router>
      </Provider>
    );
  }
}