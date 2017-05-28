import {DiagramEngine} from 'storm-react-diagrams';

import {IContainerSpec, IStepConfig, IFlow} from '../../interfaces';
import {ContainerRegistry} from '../../ContainerRegistry';
import {NodeModel} from '../../../components/ui/diagrams';
import {IDiagramTrigger} from '../interfaces';

interface IPosition {
  x: number,
  y: number,
}

export class AddNode implements IDiagramTrigger {
  private node: NodeModel;
  private consumed: boolean = false;

  constructor(
    containerSpec: IContainerSpec,
    flow: IFlow,
    position: IPosition,
  ) {
    const stepConfig = this.buildStepConfig(containerSpec, flow);
    this.node = new NodeModel(stepConfig, containerSpec);
    this.node.x = position.x;
    this.node.y = position.y;
  }

  buildStepConfig(
    containerSpec: IContainerSpec,
    flow: IFlow,
  ): IStepConfig {
    const stepIDs = new Set(Object.keys(flow.steps));
    let id = 0;
    while (stepIDs.has(id.toString())) {
      id += 1;
    }
    return {
      id: id.toString(),
      containerName: containerSpec.name,
      destinations: {},
      sources: [],
      actionPayloads: {},
    };
  }

  trigger(engine: DiagramEngine) {
    if (this.consumed) {
      throw new TypeError(
        'The AddNode SRD event has been consumed. Do not reuse triggers!',
      );
    }
    engine.getDiagramModel().addNode(this.node);
  }
}