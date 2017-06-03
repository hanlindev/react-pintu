import {DiagramEngine} from 'storm-react-diagrams';

import {IContainerSpec, IStepConfig, IFlow} from '../../interfaces';
import {ContainerRegistry} from '../../ContainerRegistry';
import {NodeModel} from '../../../components/ui/diagrams';
import {BaseTrigger} from './BaseTrigger';

interface IPosition {
  x: number,
  y: number,
}

export class AddNode extends BaseTrigger {
  private node: NodeModel;

  constructor(
    containerSpec: IContainerSpec,
    flow: IFlow,
    position: IPosition,
  ) {
    super();
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
      inputSources: {},
    };
  }

  trigger(engine: DiagramEngine) {
    super.trigger(engine);
    engine.getDiagramModel().addNode(this.node);
  }
}