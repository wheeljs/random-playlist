/* eslint import/prefer-default-export: off, import/no-mutable-exports: off */
import { URL } from 'url';
import path from 'path';
import { BrowserWindow } from 'electron';

export let resolveHtmlPath: (htmlFileName: string) => string;

if (process.env.NODE_ENV === 'development') {
  const port = process.env.PORT || 1212;
  resolveHtmlPath = (htmlFileName: string) => {
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  };
} else {
  resolveHtmlPath = (htmlFileName: string) => {
    return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
  };
}

export const startBackgroundWindowForResult = async <T, R = unknown>({
  workerFile,
  params,
}: {
  workerFile: string;
  params: T;
}): Promise<R> => {
  const win = new BrowserWindow({
    show: false,
    webPreferences: {
      nodeIntegrationInWorker: true,
    },
  });
  win.loadFile(path.join(__dirname, 'background.html'));
  const result = await win.webContents.executeJavaScript(
    `
      new Promise((resolve) => {
        const worker = new Worker('${workerFile}');
        worker.onmessage = (event) => resolve(event.data);
        worker.postMessage(${JSON.stringify(params)});
      });
    `
  );
  win.close();

  return result;
};
