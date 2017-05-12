import * as React from 'react';

import {Button} from '../../components/ui/Button';

interface IProps {

}

export function SampleView(props: IProps): React.ReactElement<any> {
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
