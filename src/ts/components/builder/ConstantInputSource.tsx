import * as React from 'react';
import TextField from 'material-ui/TextField';
import {IConstantInputSource} from '../../lib/interfaces';
import {InputPortModel, NodeModel} from '../ui/diagrams';
import {IFlowEngine} from '../../lib/FlowEngine/interfaces';
import {ChangeConstantInputSource} from '../../lib/FlowEngine/diagramTriggers';

interface IConstantInputSourceProps {
  flowEngine: IFlowEngine;
  sourceSpec?: IConstantInputSource;
  inputName: string;
  input: InputPortModel;
  style?: React.CSSProperties;
  node: NodeModel;
}

export class ConstantInputSource extends React.Component<IConstantInputSourceProps, void> {
  render() {
    const {
      input,
      inputName,
      node,
      style,
      sourceSpec = {
        type: 'constant',
        value: '',
      } as IConstantInputSource,
      flowEngine,
    } = this.props;

    return (
      <TextField
        autoFocus
        hintText={input.type().getName()}
        style={{
          height: 34,
          ...style,
        }}
        hintStyle={{
          fontSize: 14,
          bottom: 5,
        }}
        inputStyle={{
          fontSize: 14,
        }}
        onKeyUp={(e) => {
          e.stopPropagation();
        }}
        onChange={(e, value: string) => {
          const newSpec: IConstantInputSource = {
            ...sourceSpec,
            value,
          }
          const trigger = new ChangeConstantInputSource(
            node,
            inputName,
            newSpec,
          );
          trigger.trigger(flowEngine.getDiagramEngine());
        }}
        value={sourceSpec.value}
      />
    );
  }
}