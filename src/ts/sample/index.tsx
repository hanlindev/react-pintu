import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {AppWrapper} from './AppWrapper';
import {IThemeCustomization} from '../components/ui';
import {PintuProvider} from '../.';
import {registry} from './views';


class PintuSample extends React.Component<{}, void> {
  render() {
    return (
      <PintuProvider
        builderUrlPrefix="/builder"
        appWrapper={AppWrapper}
        viewRegistry={registry}
      />
    );
  }
}

window.addEventListener('load', (e: Event) => {
  ReactDOM.render(
    <PintuSample />,
    document.body,
  );
});
