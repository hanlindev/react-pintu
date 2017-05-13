import {combineReducers} from 'redux'
import {routerReducer} from 'react-router-redux'

import {builder, BuilderState} from './builder';
import {runner, RunnerState} from './runner';

export const rootReducer = combineReducers({
  builder,
  runner,
  routing: routerReducer,
});

export interface IState {
  builder: BuilderState;
  runner: RunnerState;
}