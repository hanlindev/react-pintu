import {browserHistory} from 'react-router';
import {applyMiddleware, createStore, compose} from 'redux';
import { createLogger } from 'redux-logger';
import reduxThunk from 'redux-thunk';
import {syncHistoryWithStore} from 'react-router-redux';

import {rootReducer} from '../reducers';

const logger = createLogger({
  level: 'info',
  collapsed: true
});

const createStoreWithMiddleware = applyMiddleware(
  logger,
  reduxThunk
);
const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const store = createStore(
  rootReducer,
  {},
  composeEnhancers(createStoreWithMiddleware)
);
export const history = syncHistoryWithStore(browserHistory, store);