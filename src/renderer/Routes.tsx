/* eslint react/jsx-props-no-spreading: off */
import React from 'react';
import { Switch, Route } from 'react-router-dom';
import WorkspaceIndex from './containers/WorkspaceIndex';

export default function Routes() {
  return (
    <Switch>
      <Route path="/:workspaceId?" component={WorkspaceIndex} />
    </Switch>
  );
}
