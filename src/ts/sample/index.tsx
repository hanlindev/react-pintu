import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {PintuProvider} from '../.';
import {registry} from './views';
import {IThemeCustomization} from '../components/ui';

function App(props: any) {
  return (
    <div>
      Sample:
      {props.children}
    </div>
  );
}

class PintuSample extends React.Component<{}, void> {
  render() {
    return (
      <PintuProvider
        builderUrlPrefix="/builder"
        appWrapper={App}
        viewRegistry={registry}
      />
    );
  }
}

window.addEventListener('load', (e: Event) => {
  ReactDOM.render(
    <PintuSample />,
    document.getElementById('app')
  );
});
