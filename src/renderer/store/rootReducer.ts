import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import type { History } from 'history';

import configReducer from './features/config/configSlice';
import workspaceReducer from './features/workspace/workspaceSlice';

export default function createRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),
    config: configReducer,
    workspace: workspaceReducer,
  });
}
