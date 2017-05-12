import * as Immutable from 'immutable';

const RunnerRecord = Immutable.Record({
  query: {},
  snowball: {},
  step: null,
});

export interface IStep {

}

export class RunnerState extends RunnerRecord {
  query: any;
  snowball: any;
  step: IStep | null;

  setQuery(query: any) {
    return this.set('query', query);
  }

  mergeSnowball(snowball: any) {
    return this.set('snowball', {
      ...this.snowball,
      ...snowball,
    });
  }
}

const SET_QUERY = 'runner.setQuery';
const MERGE_SNOWBALL = 'runner.mergeSnowball';

type RunnerActionType =
{
  type: 'runner.setQuery',
  query: any,
}
| {
  type: 'runner.mergeSnowball',
  snowball: any,
};

export function runner(state: RunnerState, action: RunnerActionType) {
  if (!state) {
    state = new RunnerState();
  }

  switch (action.type) {
    case SET_QUERY:
      return state.setQuery(action.query);
    case MERGE_SNOWBALL:
      return state.mergeSnowball(action.snowball);
  }

  return state;
}

export const runnerActions = {
  setQuery(query: any): RunnerActionType {
    return {
      type: SET_QUERY,
      query,
    };
  },

  mergeSnowball(snowball: any): RunnerActionType {
    return {
      type: MERGE_SNOWBALL,
      snowball,
    };
  }
};