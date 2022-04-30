const path = require('path');
const { contextBridge, ipcRenderer } = require('electron');

const ipcRendererWrapper = {
  invoke(...args) {
    return ipcRenderer.invoke(...args);
  },
  on(channel, func) {
    const validChannels = ['dispatch'];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, func);
    }
  },
};

let exposePath = path.posix;
if (process.platform === 'win32') {
  exposePath = path.win32;
}

contextBridge.exposeInMainWorld('rpHost', {
  ipcRenderer: ipcRendererWrapper,
  path: {
    basename: exposePath.basename,
    join: exposePath.join,
  },
});
