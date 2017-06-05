import {IStepConfig, IStepPayloadMap, IInputSourceMap} from '../../lib/interfaces';
import {ContainerRegistry} from '../../lib/ContainerRegistry';
import {ActionPayloadMultiplexer} from '../../lib/containers';
import {fillString, getStringParams} from '../../lib/utils';
import {history} from '../../lib/History';
import {InputLoader} from '../../lib/InputLoader';

export class NextStepNavigator {
  constructor(
    readonly newStepPaylaodMap: IStepPayloadMap,
    readonly nextStepConfig: IStepConfig,
    readonly registry: ContainerRegistry,
    readonly runnerUrlTemplate: string,
  ) {}

  private getUrl() {
    const {
      id,
      containerName,
      inputSources,
    } = this.nextStepConfig;
    const {pathTemplate} = this.registry.getContainerSpec(containerName);
    const inputs = this.getInputs(containerName, inputSources);
    const containerPath = fillString(pathTemplate, inputs);
    const finalPath = fillString(this.runnerUrlTemplate, {
      containerPathTemplate: containerPath,
      stepID: id,
    });

    return finalPath;
  }

  private getInputs(containerName: string, inputSources: IInputSourceMap) {
    const container = this.registry.getContainer(containerName);

    if (container instanceof ActionPayloadMultiplexer) {
      return InputLoader.generateActionPayloadMultiplexerInputs(
        this.nextStepConfig,
        this.newStepPaylaodMap,
      );
    }

    return InputLoader.generateInputFromSourceSpecs(
      inputSources, 
      this.newStepPaylaodMap,
    );
  }

  navigate(actionType: string) {
    const url = this.getUrl();

    switch (actionType) {
      case 'replaceStep':
        history.replace(url);
      case 'endOfStep':
      default:
        history.push(url);
    }
  }
}