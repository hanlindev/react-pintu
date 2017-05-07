import {combineReducers} from 'redux'
import {routerReducer} from 'react-router-redux'

import {runner} from './runner';

export const rootReducer = combineReducers({
  runner,
  routing: routerReducer,
});