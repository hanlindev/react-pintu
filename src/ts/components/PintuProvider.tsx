import * as _ from 'lodash';
import * as React from 'react';
import {createStore} from 'redux'
import {Provider} from 'react-redux'
import {Router, Route} from 'react-router';

import {createRunner} from './runner';
import {createBuilder, IBuilderEventHandlers} from './builder/PintuBuilder';
import {history, store} from '../lib/History';
import {ContainerRegistry} from '../lib/ContainerRegistry';
import {getDefaultTheme, ITheme, IThemeContext, ThemeContextProps} from './ui/ThemeableComponent';

export interface IPintuProviderProps {
  appWrapper?: React.StatelessComponent<any>;
  builderUrlPrefix?: string;
  builderEventHandlers: IBuilderEventHandlers;
  canUseBuilder?: boolean;
  theme?: Pick<ITheme, any>;
  containerRegistry: ContainerRegistry;
}

const DEFAULT_CONTEXT: IThemeContext = {
  theme: getDefaultTheme(),
}

export class PintuProvider extends React.Component<IPintuProviderProps, void> {
  static childContextTypes = ThemeContextProps;
  
  static defaultProps = {
    appWrapper: (props: any) => <div>props.children</div>,
    canUseBuilder: false,
    builderUrlPrefix: '/builder',
    theme: {},
  };

  constructor(props: IPintuProviderProps) {
    super(props);
  }

  getChildContext() {
    return _.merge({...DEFAULT_CONTEXT}, {theme: this.props.theme});
  }

  private getBuilderComponent() {
    const {containerRegistry} = this.props;
    return createBuilder(this.props.builderEventHandlers, containerRegistry);
  }

  render() {
    const {
      builderUrlPrefix, 
      appWrapper, 
      children, 
      containerRegistry,
    } = this.props;
    const routes = _.map(
      containerRegistry.registeredContainers,
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
              {this.renderBuilderRoute()}
            </Route>
          </div>
        </Router>
      </Provider>
    );
  }

  private renderBuilderRoute() {
    const {canUseBuilder, builderUrlPrefix} = this.props;
    if (canUseBuilder) {
      return (
        <Route 
          path={`${builderUrlPrefix}(/:flowID)`} 
          component={this.getBuilderComponent()} 
        />
      )
    }
    return null;
  }
}