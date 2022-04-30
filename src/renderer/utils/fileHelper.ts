/* eslint-disable import/prefer-default-export */
import { uniq } from 'lodash-es';
import type { OpenDialogOptions, OpenDialogReturnValue } from 'electron';
import i18n from 'i18next';
import { Channel } from '../../common/constants';
import type { VideoFile } from '../../common/types';
import { ConfigKeys } from '../services';
import type { IConfig } from '../../common/models';

const { ipcRenderer } = rpHost;

export interface PathListed {
  files: string[];
  directories: string[];
}

export function showOpenDialog(
  options: OpenDialogOptions
): Promise<OpenDialogReturnValue> {
  return ipcRenderer.invoke(Channel.ShowOpenDialog, options);
}

export function openSelectPlayerDialog(
  args: OpenDialogOptions
): Promise<OpenDialogReturnValue> {
  return showOpenDialog({
    ...args,
    title: i18n.t('config.select player.title'),
    message: i18n.t('config.playerExecutable.placeholder'),
    properties: ['openFile', 'dontAddToRecent'],
    filters: [
      { name: i18n.t('config.select player.exe filter'), extensions: ['exe'] },
    ],
  });
}

export function openImportDialog(): Promise<OpenDialogReturnValue> {
  return showOpenDialog({
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
