import { access, mkdir, constants } from 'fs-extra';
import path from 'path';
import { exec, spawn } from 'child_process';
import fg from 'fast-glob';
import type { Options } from 'fast-glob';
import { app, ipcMain, nativeTheme, BrowserWindow, dialog } from 'electron';
import type { OpenDialogOptions } from 'electron';

import { Channel } from '../common/constants';
import type { VideoFile } from '../common/types';
import * as service from './services/available';
import { startBackgroundWindowForResult } from './util';
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

ipcMain.handle(Channel.ShowOpenDialog, (_event, args: OpenDialogOptions) => {
  if (
    Object.hasOwnProperty.call(args, 'defaultPath') &&
    typeof args.defaultPath === 'undefined'
  ) {
    args.defaultPath = app.getPath('home');
  }
  return dialog.showOpenDialog(args);
});

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
              default:
                return undefined;
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

/* eslint-disable promise/no-nesting */
ipcMain.handle(
  Channel.VideoFileDetails,
  async (
    _event,
    params: { filePaths: string[]; thumbDir: string }
  ): Promise<VideoFile[]> => {
    return startBackgroundWindowForResult({
      workerFile: './videoDetails.js',
      params,
    });
  }
);

ipcMain.handle(
  Channel.DarkMode,
  (_event, darkMode?: 'light' | 'dark' | 'system') => {
    if (
      typeof darkMode !== 'undefined' &&
      nativeTheme.themeSource !== darkMode
    ) {
      nativeTheme.themeSource = darkMode;
    }

    return nativeTheme.shouldUseDarkColors;
  }
);
