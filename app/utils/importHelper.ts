/* eslint-disable import/prefer-default-export */
import fg from 'fast-glob';
import { uniq } from 'lodash-es';
import { OpenDialogReturnValue, remote } from 'electron';

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
