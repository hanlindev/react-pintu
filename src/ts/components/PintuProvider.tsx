import * as _ from 'lodash';
import * as React from 'react';
import {createStore} from 'redux'
import {Provider} from 'react-redux'
import {Router, Route} from 'react-router';

import {createRunner} from './runner';
import {history, store} from '../lib/History';
import {ContainerRegistry} from '../lib/ContainerRegistry';
import {getDefaultTheme, ITheme, IThemeContext, ThemeContextProps} from './ui/ThemeableComponent';

export interface IPintuProviderProps {
  appWrapper?: React.StatelessComponent<any>;
  builderUrlPrefix?: string;
  theme?: Pick<ITheme, any>;
  viewRegistry: ContainerRegistry;
}

// Dummy themes, fill in the correct values.
const DEFAULT_CONTEXT: IThemeContext = {
  theme: getDefaultTheme(),
}

export class PintuProvider extends React.Component<IPintuProviderProps, void> {
  static childContextTypes = ThemeContextProps;
  
  static defaultProps = {
    appWrapper: (props: any) => <div>props.children</div>,
    builderUrlPrefix: '/builder',
    theme: {},
  };

  constructor(props: IPintuProviderProps) {
    super(props);
  }

  getChildContext() {
    return _.merge({...DEFAULT_CONTEXT}, {theme: this.props.theme});
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
            component={createRunner(spec)}
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