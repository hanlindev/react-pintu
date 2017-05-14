import * as React from 'react';

import {Button} from '../../components/ui/Button';
import {IContainerSpec} from '../../lib/ContainerRegistry';

interface IProps {

}

export class SampleView extends React.Component<IProps, void> {
  static container: IContainerSpec = {
    name: 'Sample',
    pathTemplate: '/sample',
    component: SampleView,
    inputs: {}, // TODO add some demo inputs
    actions: {}, // TODO add some demo actions
  };

  render() {
    const style: React.CSSProperties = {
      marginLeft: 8,
    };

    return (
      <div>
        TODO
        <Button style={style} use="confirm">
          Confirm
        </Button>
        <Button style={style} use="default">
          Default
        </Button>
        <Button style={style} use="danger">
          Danger
        </Button>
      </div>
    );
  }
}