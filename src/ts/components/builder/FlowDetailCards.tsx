import * as React from 'react';
import {Dispatch} from 'react-redux';
import {Card, CardHeader, CardText, CardActions, RaisedButton, FlatButton, TextField, CircularProgress} from 'material-ui';
import {ThemeableComponent} from '../ui/ThemeableComponent';
import {BuilderActionType} from '../../reducers/builder/common';
import {actions} from '../../reducers/builder/actions';
import {IFlow, IFlowMetaData, SaveFlowCallbackType} from '../../lib/interfaces';
import {IFlowEngine} from '../../lib/FlowEngine/interfaces';
import {SelectModel} from '../../lib/FlowEngine/diagramTriggers';
import {MiddleEmptyRow as Row} from '../ui/MiddleEmptyRow';

interface IFlowDetailCardsProps {
  flow: IFlow;
  flowEngine: IFlowEngine;
  dispatch: Dispatch<BuilderActionType>;
  saveFlowCallback: SaveFlowCallbackType;
  isSavingFlow: boolean;
  metaExpanded: boolean;
  onMetaExpandsionChange: (expanded: boolean) => any;
}

export class FlowDetailCards extends ThemeableComponent<IFlowDetailCardsProps, void> {
  private confirmEditTimeout: number;

  onFieldChange<TK extends keyof IFlow>(fieldName: TK, value: IFlow[TK]) {
    const {
      dispatch,
      flow,
      saveFlowCallback,
    } = this.props;

    const newFlow: IFlow = {
      ...flow,
    };
    newFlow[fieldName] = value;
    dispatch(actions.updateCurrentFlow(
      newFlow,
      saveFlowCallback,
    ));
  }

  onMetaFieldChange<TK extends keyof IFlowMetaData>(
    fieldName: TK, 
    value: IFlowMetaData[TK],
  ) {
    const {
      flow: {
        metaData,
      },
    } = this.props;
    const newMeta = {
      ...metaData,
    };
    newMeta[fieldName] = value;
    this.onFieldChange('metaData', newMeta);
  }

  render() {
    const {
      flow,
      flowEngine,
      isSavingFlow,
      metaExpanded,
      onMetaExpandsionChange,
    } = this.props;
    const {
      metaData,
    } = flow;
    const {
      theme: {
        spacing: {
          tiny,
          small,
        },
      },
    } = this.context;

    const textStyle: React.CSSProperties = {
      width: '100%',
    };

    const cardTitle =
      <span>
        Flow Details 
        <CircularProgress 
          size={15} 
          thickness={2} 
          style={{
            marginLeft: tiny,
            top: 2,
            visibility: (isSavingFlow) ? 'inherit' : 'hidden',
          }}
        />
      </span>;

    return (
      <Card 
        expanded={metaExpanded}
        onExpandChange={(e) => {
          onMetaExpandsionChange && onMetaExpandsionChange(e);
        }}
      >
        <CardHeader
          title={cardTitle}
          subtitle={`Flow ID: ${flow.id}`}
          actAsExpander={true}
          showExpandableButton={true}
        />

        <CardText
          style={{
            paddingTop: 0,
          }}
          expandable={true}
        >
          <TextField
            floatingLabelText="Name"
            hintText="Human readable string, e.g. Sample Flow"
            value={metaData.name}
            onChange={(e, newValue) => {
              this.onMetaFieldChange('name', newValue);
            }}
            style={textStyle}
          />
          <TextField
            floatingLabelText="Description"
            hintText="Human readable string, e.g. Sample description"
            value={metaData.description}
            multiLine={true}
            rows={1}
            onChange={(e, newValue) => {
              this.onMetaFieldChange('description', newValue);
            }}
            style={textStyle}
          />
          <TextField
            floatingLabelText="URL ID Override"
            hintText="URL compatible string, e.g. default_flow"
            value={metaData.urlIdOverride}
            onChange={(e, newValue) => {
              this.onMetaFieldChange('urlIdOverride', newValue);
            }}
            style={textStyle}
          />

          <Row
            style={{
              marginTop: small,
            }}
          >
            <div>Starting Step ID: {flow.firstStepID} </div>
            <div>
              <RaisedButton
                primary={true}
                label="Go to step"
                style={{
                  textDecoration: 'none',
                }}
                onClick={() => {
                  const node = flowEngine.getNodeRef(flow.firstStepID);
                  (new SelectModel(node))
                    .trigger(flowEngine.getDiagramEngine());
                }}
              />
            </div>
          </Row>
        </CardText>
      </Card>
    );
  }
}