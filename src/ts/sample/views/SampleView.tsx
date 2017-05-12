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
  };

  render() {
    return (
      <div>
        TODO
        <Button use="confirm" size="small">
          Confirm
        </Button>
        <Button use="default" size="medium">
          Default
        </Button>
        <Button use="danger" size="large">
          Danger
        </Button>
      </div>
    );
  }
}