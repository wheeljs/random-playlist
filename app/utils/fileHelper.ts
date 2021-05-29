/* eslint-disable import/prefer-default-export */
import { exec, execFile } from 'child_process';
import { access, mkdir, constants } from 'fs-extra';
import os from 'os';
import path from 'path';
import fg from 'fast-glob';
import { uniq } from 'lodash-es';
import { OpenDialogReturnValue, remote } from 'electron';
import i18n from 'i18next';
import { ConfigKeys } from '../services';
import { IConfig } from '../models';

export interface PathListed {
  files: string[];
  directories: string[];
}

export function openImportDialog(): Promise<OpenDialogReturnValue> {
  return remote.dialog.showOpenDialog({
    title: i18n.t('file helper.choose directory'),
    message: i18n.t('file helper.recursive import'),
    buttonLabel: i18n.t('file helper.import button'),
    properties: ['openDirectory', 'multiSelections', 'dontAddToRecent'],
  });
}

export async function listFilesAndDirectories({
  patterns,
  root,
}: {
  patterns: string | string[];
  root: string;
}): Promise<PathListed> {
  const files = await fg(patterns, {
    cwd: root,
    baseNameMatch: true,
    caseSensitiveMatch: false,
  });

  // extra directories from matched files
  const directoryNameMatcher = /(.*)\/.*$/;
  const directories = uniq(
    files.map((file) => {
      const matched = file.match(directoryNameMatcher);
      if (matched != null) {
        return matched[1];
      }
      return '';
    })
  ).filter((x) => x);

  return {
    files,
    directories,
  };
}

export function ensureThumbDir(
  thumbDir: string,
  fallbackDirectory?: string
): Promise<string> {
  return access(thumbDir, constants.W_OK)
    .catch((err) => {
      if (err.code === 'ENOENT') {
        /* eslint-disable consistent-return, default-case, promise/always-return, promise/no-nesting */
        return mkdir(thumbDir).then(() => {
          switch (os.platform()) {
            case 'win32':
              return new Promise<void>((resolve) => {
                exec(`attrib +H "${thumbDir}"`, { windowsHide: true }, () => {
                  resolve();
                });
              });
          }
        });
        /* eslint-enable consistent-return, default-case, promise/always-return, promise/no-nesting */
      }

      throw err;
    })
    .then(() => thumbDir)
    .catch(() => {
      const fallbackPaths = [remote.app.getPath('cache'), 'random-playlist/'];
      if (fallbackDirectory) {
        fallbackPaths.push(fallbackDirectory);
      }

      return path.join(...fallbackPaths);
    }) as Promise<string>;
}

export interface VideoFile {
  path: string;
  extension: string;
  thumb?: string;
  duration: number;
}

export async function videoFileDetails({
  filePaths,
  thumbDir,
  fallbackDirectory,
}: {
  filePaths: string[];
  thumbDir: string;
  fallbackDirectory?: string;
}): Promise<VideoFile[]> {
  const ensuredThumbDir = await ensureThumbDir(thumbDir, fallbackDirectory);

  let worker = new Worker('utils/videoFileDetails.js');
  const promise = new Promise<VideoFile[]>((resolve) => {
    worker.onmessage = (event: MessageEvent<VideoFile[]>) => {
      worker.terminate();
      worker = null;
      resolve(event.data);
    };
  });
  worker.postMessage({
    filePaths,
    thumbDir: ensuredThumbDir,
  });

  return promise;
}

export function play({
  configs,
  fileList,
}: {
  configs: Record<string, IConfig>;
  fileList: string[];
}) {
  const playerExecutable = configs[ConfigKeys.PlayerExecutable].value as string;
  const playerPassMode = configs[ConfigKeys.PlayerPassMode].value as string;
  const playerParameter = configs[ConfigKeys.PlayerParameter].value as string;
  const playerSeparateParameter = configs[ConfigKeys.PlayerSeparateParameter]
    .value as string;

  const args = [playerParameter.replace(/%f/g, '')];
  switch (playerPassMode) {
    case 'separate':
      args.push(
        ...fileList.map((x) => playerSeparateParameter.replace(/%fi/g, x))
      );
      break;
    default:
      args.push(...fileList);
      break;
  }

  // TODO exit app but not player
  execFile(
    playerExecutable,
    args.filter((x) => x)
  );
  remote.getCurrentWindow().minimize();
}
