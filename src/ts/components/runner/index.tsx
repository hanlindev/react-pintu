import * as React from 'react';
import {connect} from 'react-redux';
import {IContainerSpec, ContainerRegistry} from '../../lib/ContainerRegistry';
import {LogicContainer} from '../../lib/LogicContainer';
import {IState} from '../../reducers';
import {IPintuRunnerProps} from './props';
import {LogicRunner} from './LogicRunner';
import {UIRunner} from './UIRunner';

export function createRunner(
  container: IContainerSpec,
  registry: ContainerRegistry,
): React.ComponentClass<IPintuRunnerProps> {
  function _PintuRunner(props: IPintuRunnerProps): JSX.Element {
    const component = registry.getComponent(container.name);
    if (component instanceof LogicContainer) {
      return (
        <LogicRunner 
          container={{...container}} 
          logic={component}
          {...props} 
        />
      );
    } else if (component) {
      return (
        <UIRunner 
          container={{
            ...container,
          }}
          component={component}
          {...props}
        />
      );
    } else {
      return (
        <div>
          TODO Error
        </div>
      )
    }
  }

  return connect<IPintuRunnerProps, any, any>((state: IState) => {
    return state.runner.toJS();
  })(_PintuRunner);
}

