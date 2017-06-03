import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {ContainerRegistry} from '../../lib/ContainerRegistry';
import {LogicContainer} from '../../lib/LogicContainer';
import {UIContainer} from '../../lib/UIContainer';
import {IContainerSpec, IStepPayloadMap, IStepConfig, IURLLocation, IURLParams, IRunnerEventHandlers} from '../../lib/interfaces';
import {IState} from '../../reducers';
import {actions, RunnerActionType} from '../../reducers/runner';
import {InputLoader} from './InputLoader';
import {IPintuRunnerProps} from './props';
import {LogicRunner} from './LogicRunner';
import {UIRunner} from './UIRunner';
import CircularProgress from 'material-ui/CircularProgress';

interface IRunnerProps {
  dispatch: Dispatch<RunnerActionType>;
  stepConfig: IStepConfig;
  stepPayloads: IStepPayloadMap;
  location: IURLLocation;
  params: IURLParams;
}

export function createRunner(
  container: IContainerSpec,
  registry: ContainerRegistry,
  eventHandler: IRunnerEventHandlers,
): React.ComponentClass<IRunnerProps> {
  class _PintuRunner extends React.Component<IRunnerProps, void> {
    async loadFlow() {
      const {
        dispatch,
        location,
        params,
      } = this.props;
      const flow = await eventHandler.onRunnerLoadFlow(location, params);
      dispatch(actions.setFlow(flow));
      dispatch(actions.setStepID(params.stepID));
    }

    componentDidMount() {
      this.loadFlow();
    }

    getInputLoader(): InputLoader {
      const {
        location,
        params,
        stepConfig: {
          inputSources = {},
        }
      } = this.props;
      const {
        inputs,
      } = container;
      return new InputLoader(inputs, inputSources, location, params);
    }

    private onAction(name: string, payload: any) {
      // TODO
    }

    render() {
      const {
        stepConfig,
      } = this.props;

      if (!stepConfig) {
        return (
          <div 
            style={{
              boxSizing: 'border-box',
              height: '100vh', 
              paddingTop: 400,
              textAlign: 'center',
              width: '100vw',
            }}
          >
            <CircularProgress />
          </div>
        );
      }

      return this.renderRealContent();
    }

    private renderRealContent() {
      const component = registry.getContainer(container.name);
      const inputLoader = this.getInputLoader();
      if (component instanceof LogicContainer) {
        return (
          /*<LogicRunner 
            container={{...container}} 
            logic={component}
            {...props} 
          />*/
          <div>TODO</div>
        );
      } else if (component instanceof UIContainer) {
        return (
          <UIRunner 
            container={{
              ...container,
            }}
            ui={component}
            inputs={inputLoader.inputs}
            onAction={(name, payload) => this.onAction(name, payload)}
          />
        );
      } else {
        return (
          <div>
            TODO Error
          </div>
        );
      }
    }
  }

  return connect<IRunnerProps, any, any>(
    (state: IState): any => {
      const {runner} = state;
      return {
        stepPayloads: runner.getStepPayloadMap(),
        stepConfig: runner.getStepConfig(),
      };
    },
  )(_PintuRunner);
}

