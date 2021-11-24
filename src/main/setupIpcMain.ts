import { ipcMain } from 'electron';
import { Channel } from '../common/constants';
import * as service from './services/available';

// Model Operation
ipcMain.handle(
  Channel.Model,
  (_event, servicePath: string, ...args: unknown[]) => {
    const [serviceName, methodName] = servicePath.split('.');
  if (!Object.prototype.hasOwnProperty.call(service, serviceName)) {
    return Promise.reject(new Error('Method unimplemented.'));
  }

  const srv = service[serviceName];
  const method = srv[methodName];
  if (typeof method !== 'function') {
    return Promise.reject(new Error('Not a function.'));
  }

  return method.apply(srv, args);
});
