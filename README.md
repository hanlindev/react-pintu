React Pintu (Alpha)
=========
A flow-based React application framework for everyone.

## Installation

  `npm install --save react-pintu`
  or
  `yarn add react-pintu`

## Usecase (written in Typescript)

1. Write application views React components. Package the components as 
Pintu containers.

```Typescript
import * as React from 'react';
import {UIContainer, IActionCallback, IContainerSpec, Types} from 'react-pintu';

interface IInputs {
  sampleInput: string;
}

interface IProps {
  inputs: IInputs;
  actions: IActionCallback;
  //... other props
}

class ViewComponent extends React.Component<IProps, void> {
  render() {
    // ... render React component
  }
}

export class View extends UIContainer<IInputs> {
  getContainerSpec(): IContainerSpec {
    return {
      name: 'SampleView',
      pathTemplate: '/sample(:/prevButton)',
      inputs: {
        sampleInput: Types.string.isRequired,
      },
      actions: {
        sampleAction: {
          id: 'sampleAction',
          label: 'Sample Action',
          type: 'endOfStep',
          payload: {
            buttonClicked: Types.string.isRequired,
          },
        },
      },
    }
  }

  render(inputs: IInputs, onAction: IActionCallback) {
    return (
      <ViewComponent inputs={inputs} onAction={onAction} />
    );
  }
}
```

2. Pintu containers are also used for packaging business logic.

```Typescript
import {LogicContainer, IContainerSpec, IActionCallback, Types} from 'react-pintu';

export class BranchLogic extends LogicContainer<void> {
  getContainerSpec(): IContainerSpec {
    return {
      name: 'Branch',
      pathTemplate: '/branch',
      inputs: {
        flag: Types.bool,
      },
      actions: {
        true: {
          id: 'true',
          label: 'True',
          type: 'endOfStep',
          payload: {},
        },
        false: {
          id: 'false',
          label: 'False',
          type: 'endOfStep',
          payload: {},
        },
      },
    };
  }

  async run(inputs: any, onAction: IActionCallback): Promise<void> {
    if (inputs.flat) {
      onAction('true', {});
    } else {
      onAction('false', {});
    }
  }
}
```

3. Connect application views and business logic using flow builder and run them.

![workflow demo](https://raw.githubusercontent.com/hanlindev/Pintu/master/images/sample/demo.gif)

## Usage

Please refer to the `sample` directory for the sample usage.\

## Roadmap to beta

1. Support container composition.
2. Layout editor and code generator
3. Fix common bugs and errors.
4. Make sample page stable and create a Github IO page.
5. Productionalize.

## Roadmap to release
1. Add container and flow versioning support.
2. Add package script or create a binary to help with version management.
3. Release ready.
