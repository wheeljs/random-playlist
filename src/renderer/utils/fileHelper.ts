/* eslint-disable import/prefer-default-export */
import { uniq } from 'lodash-es';
import { ipcRenderer } from 'electron';
import type { OpenDialogReturnValue } from 'electron';
import * as remote from '@electron/remote';
import i18n from 'i18next';
import { Channel } from '../../common/constants';
import type { VideoFile } from '../../common/types';
import { ConfigKeys } from '../services';
import type { IConfig } from '../../common/models';

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
  const files = (await ipcRenderer.invoke(Channel.FastGlob, patterns, {
    cwd: root,
    baseNameMatch: true,
    caseSensitiveMatch: false,
  })) as string[];

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
  return ipcRenderer.invoke(Channel.EnsureDir, thumbDir, fallbackDirectory);
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

  return ipcRenderer.invoke(Channel.VideoFileDetails, {
    filePaths,
    thumbDir: ensuredThumbDir,
  });
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

  ipcRenderer.invoke(
    Channel.Play,
    playerExecutable,
    args.filter((x) => x)
  );
}
