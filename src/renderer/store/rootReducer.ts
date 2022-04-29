import { combineReducers } from 'redux';

import configReducer from './features/config/configSlice';
import workspaceReducer from './features/workspace/workspaceSlice';

export default function createRootReducer() {
  return combineReducers({
    config: configReducer,
    workspace: workspaceReducer,
  });
}
