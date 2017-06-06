import * as React from 'react';
import {Card, CardHeader, CardActions, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import {IFlowMetaData} from '../../lib/interfaces';

interface INewFlowFormProps {
  style?: React.CSSProperties;
  onCreateFlow: (newFlow: IFlowMetaData) => any;
}

interface IState {
  name: string;
  description: string;
}

export class NewFlowForm extends React.Component<INewFlowFormProps, IState> {
  state: IState = {
    name: '',
    description: '',
  };

  render() {
    const {
      onCreateFlow,
      style,
    } = this.props;
    const {
      name,
      description,
    } = this.state;

    return (
      <Card
        style={style}
      >
        <CardHeader
          title="New Flow"
        />

        <CardText
          style={{
            paddingTop: 0,
          }}
        >
          <TextField
            autoFocus
            hintText="Flow Name, e.g. Base Flow"
            floatingLabelText="Flow name"
            value={name}
            onChange={(e: React.FormEvent<any>, name: string) => {
              this.setState({
                name,
              });
            }}
            style={{
              width: '100%',
            }}
          />
          <TextField
            floatingLabelText="Flow Description"
            hintText="Describe what this flow does"
            multiLine={true}
            rows={1}
            value={description}
            onChange={(e: React.FormEvent<any>, description: string) => {
              this.setState({
                description,
              });
            }}
            style={{
              width: '100%',
            }}
          />
        </CardText>

        <CardActions
          style={{
            marginTop: 30,
          }}
        >
          <RaisedButton
            primary
            label="Create"
            onClick={() => {
              onCreateFlow && onCreateFlow({
                name,
                description,
              });
            }}
          />
        </CardActions>
      </Card>
    );
  }
}