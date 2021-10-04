/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'reflect-metadata';
import path from 'path';
import { app, BrowserWindow, nativeTheme, shell } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import * as remote from '@electron/remote/main';
import './setupIpcMain';
import { connection } from '../common/models';
import { Channel } from '../common/constants';

import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { configService, ConfigKeys } from './services';
import type { NativeThemeSource } from './services';

remote.initialize();

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDevelopment) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async (theme: NativeThemeSource = 'system') => {
  if (isDevelopment) {
    await installExtensions();
  }

  if (theme !== nativeTheme.themeSource) {
    nativeTheme.themeSource = theme;
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1440,
    height: 860,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      contextIsolation: false,
      webSecurity: false,
      // preload: path.join(__dirname, 'preload.js'),
    },
  });
  remote.enable(mainWindow.webContents);

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.webContents.send(Channel.Dispatch, {
        type: 'config/setUseDarkTheme',
        payload: nativeTheme.shouldUseDarkColors,
      });
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', async () => {
  (await connection()).close();
});

const MigrationExt = isDevelopment ? '.ts' : '.js';
app.on('ready', async () => {
  const conn = await connection({
    migrations: [path.join(__dirname, `../common/migrations/*${MigrationExt}`)],
  });
  await Promise.all(await conn.runMigrations({ transaction: 'all' }));

  let theme: NativeThemeSource = 'system';
  try {
    theme =
      ((await configService.get(ConfigKeys.Theme))
        .value as NativeThemeSource) ?? 'system';
  } catch (err) {
    console.log(err);
  }
  createWindow(theme);
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});

nativeTheme.on('updated', () => {
  if (mainWindow != null) {
    mainWindow.webContents.send(Channel.Dispatch, {
      type: 'config/setUseDarkTheme',
      payload: nativeTheme.shouldUseDarkColors,
    });
  }
});
