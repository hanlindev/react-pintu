import * as _ from 'lodash';
import * as React from 'react';
import * as Props from 'prop-types';
import {createStore} from 'redux'
import {Provider} from 'react-redux'
import {Router, Route} from 'react-router';

import {createRunner} from './runner';
import {HomePage} from './HomePage';
import {createBuilder} from './builder/PintuBuilder';
import {history, store} from '../lib/History';
import {ContainerRegistry} from '../lib/ContainerRegistry';
import {fillString} from '../lib/utils';
import {getDefaultTheme, ITheme, IThemeContext, ThemeContextProps} from './ui/ThemeableComponent';
import {IBuilderEventHandlers, IRunnerEventHandlers} from '../lib/interfaces';

import * as injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

export interface IPintuProviderProps {
  appWrapper?: React.ComponentClass<any> | React.StatelessComponent<any>;
  builderUrlPrefix?: string;
  builderEventHandlers: IBuilderEventHandlers;
  canUseBuilder?: boolean;
  containerRegistry: ContainerRegistry;
  // This is the entry point to your website. This is the path to the step that
  // should replace the '/' path. By default, it is '/'
  homePath?: string;
  runnerEventHandlers: IRunnerEventHandlers;
  runnerUrlTemplate?: string;
  theme?: Pick<ITheme, any>;
}

const DEFAULT_CONTEXT: IThemeContext = {
  theme: getDefaultTheme(),
  registry: new ContainerRegistry(),
}

export class PintuProvider extends React.Component<IPintuProviderProps, void> {
  static childContextTypes = ThemeContextProps;
  
  static defaultProps = {
    appWrapper: (props: any) => <div>props.children</div>,
    canUseBuilder: false,
    builderUrlPrefix: '/builder',
    homePath: '/',
    /**
     * Three possible parameters:
     * 1. :flowID
     * 2. :stepID,
     * 3. :containerPathTemplate
     */
    runnerUrlTemplate: '/:flowID/:stepID:containerPathTemplate',
    theme: {},
  };

  constructor(props: IPintuProviderProps) {
    super(props);
  }

  getChildContext() {
    return _.merge({...DEFAULT_CONTEXT}, {
      theme: this.props.theme,
      registry: this.props.containerRegistry,
    });
  }

  private getBuilderComponent() {
    const {
      containerRegistry, 
      builderEventHandlers, 
      builderUrlPrefix,
      runnerUrlTemplate,
    } = this.props;
    return createBuilder(
      builderEventHandlers, 
      containerRegistry,
      builderUrlPrefix as string,
      runnerUrlTemplate as string,
    );
  }

  render() {
    const {
      builderUrlPrefix,
      appWrapper, 
      children, 
      containerRegistry,
      runnerEventHandlers,
      runnerUrlTemplate,
      homePath,
      builderEventHandlers,
    } = this.props;
    const routes = _.map(
      containerRegistry.containerSpecs,
      (spec, name) => {
        const path = fillString(
          runnerUrlTemplate as string,
          {
            containerPathTemplate: spec.pathTemplate,
          },
        );

        return (
          <Route 
            key={`container-${name}`}
            path={path} 
            component={createRunner(
              spec, 
              containerRegistry, 
              runnerUrlTemplate as string,
              runnerEventHandlers,
            )}
          />
        );
      }
    );
    return (
      <Provider store={store}>
        <Router history={history}>
          <div>
            <Route 
              path="/"
              component={() => {
                return (
                  <HomePage 
                    homePath={homePath as string}
                  />
                );
              }}
            />
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