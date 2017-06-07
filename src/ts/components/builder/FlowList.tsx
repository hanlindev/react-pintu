import * as _ from 'lodash';
import * as React from 'react';
import {Link} from 'react-router';
import {Card, CardHeader, CardActions, CardText, CardTitle} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import {List, ListItem} from 'material-ui/List';

import {IFlowMetaData, IFlow, IFlowMetaDataMap} from '../../lib/interfaces';

interface IFlowListProps {
  builderUrlPrefix: string;
  flowList: IFlowMetaDataMap;
  style?: React.CSSProperties;
  onCreateFlow: (newFlow: IFlowMetaData) => any;
}

interface IState {
  expanded: boolean;
  name: string;
  description: string;
}

export class FlowList extends React.Component<IFlowListProps, IState> {
  state: IState = {
    expanded: false,
    name: '',
    description: '',
  };

  render() {
    const {
      flowList,
      style,
    } = this.props;
    const {
      expanded,
      name,
      description,
    } = this.state;

    return (
      <Card
        expanded={expanded}
        style={style}
        onExpandChange={(expanded) => {
          this.setState({
            expanded,
          });
        }}
      >
        <CardHeader
          title="Flows"
          subtitle="Select the flow to edit"
        />

        <CardText>
          {this.renderFlowList()}
        </CardText>

        <CardTitle
          title="Create New Flow"
          expandable={true}
        />
        <CardText
          style={{
            paddingTop: 0,
          }}
          expandable={true}
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
            marginTop: (expanded) ? 30 : 0,
          }}
        >
          {this.renderActions()}
        </CardActions>
      </Card>
    );
  }

  private renderActions() {
    const {
      onCreateFlow,
    } = this.props;
    const {
      expanded,
      name,
      description,
    } = this.state;

    const confirmButton = (expanded)
      ? <RaisedButton
          primary
          label="Create"
          onClick={() => {
            onCreateFlow && onCreateFlow({
              name,
              description,
            });
          }}
        />
      : null;

    return (
      <div>
        <RaisedButton
          primary={!expanded}
          label={(expanded) ? 'Cancel' : 'Create New Flow'}
          onClick={() => {
            this.setState({
              expanded: !expanded,
            });
          }}
          style={{
            marginRight: 8,
          }}
        />
        {confirmButton}
      </div>
    );
  }

  private renderFlowList() {
    const {
      flowList,
    } = this.props;

    if (_.isEmpty(flowList)) {
      return (
        <div>No flow found.</div>
      );
    }

    const flowItems = Object.keys(flowList).sort().map((flowId) => {
      const flow = flowList[flowId];

      return (
        <ListItem
          key={`flow-list-item-${flowId}`}
          primaryText={
            <Link to={`${this.props.builderUrlPrefix}/${flowId}`}>
              {flow.name}
            </Link>
          }
          secondaryText={flow.description}
          secondaryTextLines={2}
        />
      );
    });

    return (
      <List>
        {flowItems}
      </List>
    ); 
  }
}