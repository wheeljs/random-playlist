import React, { Fragment } from 'react';
import { render } from 'react-dom';
import { ipcRenderer } from 'electron';
import { AppContainer as ReactHotAppContainer } from 'react-hot-loader';
import { history, configuredStore } from './store';
import './app.global.less';
import { connection } from './models';

const store = configuredStore();

const AppContainer = process.env.PLAIN_HMR ? Fragment : ReactHotAppContainer;

document.addEventListener('DOMContentLoaded', async () => {
  // ensure 'default' connection
  await connection();
  ipcRenderer.on('dispatch', (_, action) => {
    store.dispatch(action);
  });
  // eslint-disable-next-line global-require
  const Root = require('./containers/Root').default;
  render(
    <AppContainer>
      <Root store={store} history={history} />
    </AppContainer>,
    document.getElementById('root')
  );
});
