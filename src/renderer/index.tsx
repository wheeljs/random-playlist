import { render } from 'react-dom';
import { ipcRenderer } from 'electron';
import { Channel } from '../common/constants';
import { configuredStore } from './store/store';
import App from './App';
import './app.less';

const store = configuredStore();

document.addEventListener('DOMContentLoaded', async () => {
  ipcRenderer.on(Channel.Dispatch, (_, action) => {
    store.dispatch(action);
  });

  render(<App store={store} />, document.getElementById('root'));
});
