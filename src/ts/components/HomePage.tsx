import * as React from 'react';
import {IDefaultStepData} from '../lib/interfaces';
import {history} from '../lib/History';
import {ContainerRegistry} from '../lib/ContainerRegistry';

interface IHomePageProps {
  homePath: string;
}

export class HomePage extends React.Component<IHomePageProps, void> {
  async componentDidMount() {
    history.replace(this.props.homePath);
  }

  render() {
    return null;
  }
}