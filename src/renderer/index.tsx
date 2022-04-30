import { render } from 'react-dom';
import { Channel } from '../common/constants';
import { configuredStore } from './store/store';
import App from './App';
import './app.less';

const { ipcRenderer } = rpHost;

const store = configuredStore();

document.addEventListener('DOMContentLoaded', async () => {
  ipcRenderer.on(Channel.Dispatch, (_, action) => {
    store.dispatch(action);
  });

  render(<App store={store} />, document.getElementById('root'));
});
