/* eslint-disable import/prefer-default-export */
import { execFile } from 'child_process';
import fg from 'fast-glob';
import { uniq } from 'lodash-es';
import { OpenDialogReturnValue, remote } from 'electron';
import { ConfigKeys } from '../services';
import { IConfig } from '../models';

export interface PathListed {
  files: string[];
  directories: string[];
}

export function openImportDialog(): Promise<OpenDialogReturnValue> {
  return remote.dialog.showOpenDialog({
    title: '选择文件夹进行导入',
    message: '文件夹中的视频将被递归导入',
    buttonLabel: '导入',
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
