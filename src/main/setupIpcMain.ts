import fs from 'fs/promises';
import { access, mkdir, constants } from 'fs-extra';
import path from 'path';
import { exec, spawn } from 'child_process';
import fg from 'fast-glob';
import type { Options } from 'fast-glob';
import { app, ipcMain, nativeImage, BrowserWindow } from 'electron';
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
  }
);

ipcMain.handle(
  Channel.FastGlob,
  (_event, ...args: [string | string[], Options?]) => {
    return fg(...args);
  }
);

ipcMain.handle(
  Channel.EnsureDir,
  (_event, dir: string, fallbackDir?: string) => {
    return access(dir, constants.W_OK)
      .catch((err) => {
        if (err.code === 'ENOENT') {
          /* eslint-disable consistent-return, default-case, promise/always-return, promise/no-nesting */
          return mkdir(dir).then(() => {
            switch (process.platform) {
              case 'win32':
                return new Promise<void>((resolve) => {
                  exec(`attrib +H "${dir}"`, { windowsHide: true }, () =>
                    resolve()
                  );
                });
            }
          });
          /* eslint-enable consistent-return, default-case, promise/always-return, promise/no-nesting */
        }

        throw err;
      })
      .then(() => dir)
      .catch(() => {
        const fallbackPaths = [app.getPath('cache'), 'random-playlist/'];
        if (fallbackDir) {
          fallbackPaths.push(fallbackDir);
        }

        return path.join(...fallbackPaths);
      }) as Promise<string>;
  }
);

ipcMain.handle(
  Channel.Play,
  (event, player: string, args?: readonly string[]) => {
    const childProcess = spawn(player, args, {
      detached: true,
    });
    childProcess.unref();

    BrowserWindow.fromWebContents(event.sender).minimize();
  }
);
