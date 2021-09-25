import React from 'react';
import { render } from 'react-dom';
import { ipcRenderer } from 'electron';
import { history, configuredStore } from './store/store';
import './app.global.less';
import { connection } from '../common/models';

const store = configuredStore();

document.addEventListener('DOMContentLoaded', async () => {
  // ensure 'default' connection
  await connection();
  ipcRenderer.on('dispatch', (_, action) => {
    store.dispatch(action);
  });
  // eslint-disable-next-line global-require
  const Root = require('./containers/Root').default;
  render(
    <Root store={store} history={history} />,
    document.getElementById('root')
  );
});
