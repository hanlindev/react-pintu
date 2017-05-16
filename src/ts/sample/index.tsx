import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {AppWrapper} from './AppWrapper';
import {IThemeCustomization} from '../components/ui';
import {PintuProvider} from '../.';
import {registry} from './views';
import * as SampleServerAPI from './SampleServerAPI';


class PintuSample extends React.Component<{}, void> {
  render() {
    return (
      <PintuProvider
        builderUrlPrefix="/builder"
        canUseBuilder={true}
        appWrapper={AppWrapper}
        containerRegistry={registry}
        builderEventHandlers={SampleServerAPI}
      />
    );
  }
}

window.addEventListener('load', (e: Event) => {
  ReactDOM.render(
    <PintuSample />,
    document.getElementById('app'),
  );
});
