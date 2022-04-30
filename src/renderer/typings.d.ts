import type { PlatformPath } from 'path';
import type { IpcRenderer } from 'electron';

declare global {
  const rpHost: {
    ipcRenderer: Pick<IpcRenderer, 'on' | 'invoke'>;
    path: Pick<PlatformPath, 'basename' | 'join'>;
  };
}
