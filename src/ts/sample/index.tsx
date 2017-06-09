import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {AppWrapper} from './AppWrapper';
import {IThemeCustomization} from '../components/ui';
import {PintuProvider} from '../.';
import {ContainerRegistry} from '../lib/ContainerRegistry';
import * as SampleServerAPI from './SampleServerAPI';
import combinedRegistry from './CombinedRegistry';


class PintuSample extends React.Component<{}, void> {
  render() {
    return (
      <PintuProvider
        builderUrlPrefix="/builder"
        canUseBuilder={true}
        appWrapper={AppWrapper}
        containerRegistry={combinedRegistry}
        homePath="/sample/start"
        builderEventHandlers={SampleServerAPI}
        runnerEventHandlers={SampleServerAPI}
        runnerUrlTemplate=":containerPathTemplate/:stepID"
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
