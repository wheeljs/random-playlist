import { ipcRenderer } from 'electron';

import { Channel } from '../../common/constants';

// eslint-disable-next-line @typescript-eslint/ban-types
export function rendererService<T extends object>(
  serviceName: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  service: T | any = {}
): T {
  return new Proxy(service, {
    get(_target, property) {
      const path = `${serviceName}.${String(property)}`;

      return (...args: unknown[]) => {
        return ipcRenderer.invoke(Channel.Model, path, ...args);
      };
    },
  }) as T;
}

export default {
  rendererService,
};
