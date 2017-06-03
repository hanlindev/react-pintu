import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {AppWrapper} from './AppWrapper';
import {IThemeCustomization} from '../components/ui';
import {PintuProvider} from '../.';
import {ContainerRegistry} from '../lib/ContainerRegistry';
import {registry as builtInRegistry} from '../lib/containers';
import {registry as viewRegistry} from './views';
import {registry as logicRegistry} from './logics';
import * as SampleServerAPI from './SampleServerAPI';


class PintuSample extends React.Component<{}, void> {
  render() {
    return (
      <PintuProvider
        builderUrlPrefix="/builder"
        canUseBuilder={true}
        appWrapper={AppWrapper}
        containerRegistry={ContainerRegistry.combineRegistries(
          viewRegistry,
          logicRegistry,
          builtInRegistry,
        )}
        builderEventHandlers={SampleServerAPI}
        runnerEventHandlers={SampleServerAPI}
        runnerUrlTemplate="/:stepID:containerPathTemplate"
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
