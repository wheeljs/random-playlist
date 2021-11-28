import type { nativeTheme } from 'electron';

// eslint-disable-next-line import/prefer-default-export
export enum ConfigKeys {
  Glob = 'glob',
  PlayerExecutable = 'playerExecutable',
  PlayerPassMode = 'playerPassMode',
  PlayerParameter = 'playerParameter',
  PlayerSeparateParameter = 'playerSeparateParameter',
  ViewMode = 'viewMode',
  Language = 'language',
  Theme = 'theme',
}

export type NativeThemeSource = typeof nativeTheme.themeSource;
