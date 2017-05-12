import {combineReducers} from 'redux'
import {routerReducer} from 'react-router-redux'

import {runner, RunnerState} from './runner';

export const rootReducer = combineReducers({
  runner,
  routing: routerReducer,
});

export interface IState {
  runner: RunnerState;
}