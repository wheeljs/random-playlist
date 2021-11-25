import React from 'react';
import { render } from 'react-dom';
import { ipcRenderer } from 'electron';
import { Channel } from '../common/constants';
import { history, configuredStore } from './store/store';
import './app.global.less';

const store = configuredStore();

document.addEventListener('DOMContentLoaded', async () => {
  ipcRenderer.on(Channel.Dispatch, (_, action) => {
    store.dispatch(action);
  });
  // eslint-disable-next-line global-require
  const Root = require('./containers/Root').default;
  render(
    <Root store={store} history={history} />,
    document.getElementById('root')
  );
});
