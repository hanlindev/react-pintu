import * as _ from 'lodash';
import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {push} from 'react-router-redux';
import {shape, getRequiredProps} from '../../lib/types';
import {getStringParams, fillString} from '../../lib/utils';
import {history} from '../../lib/History';
import {ContainerRegistry} from '../../lib/ContainerRegistry';
import {LogicContainer} from '../../lib/LogicContainer';
import {UIContainer} from '../../lib/UIContainer';
import {ActionPayloadMultiplexer} from '../../lib/containers';
import {IContainerSpec, IActionDestination, IFlow, IStepPayloadMap, IStepConfig, IURLLocation, IURLParams, IRunnerEventHandlers, IAction} from '../../lib/interfaces';
import {IState} from '../../reducers';
import {RunnerActionType} from '../../reducers/runner';
import {actions} from '../../reducers/runner/actions';
import {InputLoader} from '../../lib/InputLoader';
import {IPintuRunnerProps} from './props';
import {LogicRunner} from './LogicRunner';
import {UIRunner} from './UIRunner';
import CircularProgress from 'material-ui/CircularProgress';

interface IRunnerProps {
  flow: IFlow,
  dispatch: Dispatch<RunnerActionType>;
  stepConfig: IStepConfig;
  stepPayloads: IStepPayloadMap;
  location: IURLLocation;
  params: IURLParams;
}

export function createRunner(
  container: IContainerSpec,
  registry: ContainerRegistry,
  runnerUrlTemplate: string,
  eventHandler: IRunnerEventHandlers,
): React.ComponentClass<IRunnerProps> {
  class _PintuRunner extends React.Component<IRunnerProps, void> {
    async updateFlow() {
      const {
        dispatch,
        location,
        params,
        flow,
        stepConfig,
      } = this.props;
      const newFlow = await eventHandler.onRunnerLoadFlow(location, params);
      if (!_.isEqual(flow, newFlow)) {
        dispatch(actions.setFlow(newFlow));
      }
      
      const newStepID = 
        (await eventHandler.onGetStepID(location, params, flow)) || flow.firstStepID;
      if (!stepConfig || stepConfig.id !== newStepID) {
        dispatch(actions.setStepID(newStepID));
      }
    }

    componentDidMount() {
      this.updateFlow();
    }

    componentDidUpdate() {
      this.updateFlow();
    }

    getInputLoader(): InputLoader {
      const {
        location,
        params,
        stepConfig: {
          inputSources = {},
        },
        stepPayloads = {},
      } = this.props;
      const {
        inputs,
      } = container;
      return new InputLoader(
        inputs, 
        inputSources, 
        stepPayloads, 
        location, 
        params,
      );
    }

    private onAction(name: string, payload: any) {
      const {
        dispatch,
        stepConfig,
      } = this.props;
      const actionSpec = container.actions[name];

      if (actionSpec && stepConfig) {
        dispatch(actions.performAction(
          stepConfig, 
          actionSpec, 
          payload,
          registry,
          runnerUrlTemplate,
        ));
      } else {
        // TODO better error handling
        console.error('Unknown action - ' + name);
      }
    }

    render() {
      const {
        stepConfig,
      } = this.props;

      if (!stepConfig || stepConfig.containerName !== container.name) {
        return (
          <div 
            style={{
              boxSizing: 'border-box',
              height: '100%', 
              paddingTop: 400,
              textAlign: 'center',
              width: '100vw',
            }}
          >
            <CircularProgress />
          </div>
        );
      }

      return this.renderRealContent(stepConfig);
    }

    private renderRealContent(stepConfig: IStepConfig) {
      const component = registry.getContainer(container.name);
      const inputLoader = this.getInputLoader();
      if (component instanceof ActionPayloadMultiplexer) {
        inputLoader.prepareActionPayloadMultiplexerInputs(stepConfig);
      } else {
        inputLoader.prepareCommonNodeInputs();
      }

      if (!inputLoader.isValid()) {
        return (
          <div>
            TODO invalid input error
          </div>
        );
      }
      if (component instanceof LogicContainer) {
        return (
          <LogicRunner 
            container={{...container}} 
            logic={component}
            inputs={inputLoader.inputs}
            onAction={(name, payload) => this.onAction(name, payload)}
          />
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
        flow: runner.flow,
        stepPayloads: runner.getStepPayloadMap(),
        stepConfig: runner.getStepConfig(),
      };
    },
  )(_PintuRunner);
}

