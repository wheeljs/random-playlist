/* eslint-disable import/prefer-default-export */
import { join } from 'path';
import { app, remote } from 'electron';
import { createConnection as _createConnection, getConnection } from 'typeorm';
import type { Connection, ConnectionOptions } from 'typeorm';

import defaultOptions from '../../ormconfig';
import type { ViewMode } from './BaseModel';
import { Config } from './Config';
import type {
  IConfig,
  ConfigValueType,
  SaveOrUpdateConfig,
  SupportedLngs,
} from './Config';
import { File } from './File';
import type { IFile } from './File';
import { Directory } from './Directory';
import { Workspace } from './Workspace';

export { Config, Workspace, Directory, File };
export type {
  IFile,
  IConfig,
  ConfigValueType,
  SaveOrUpdateConfig,
  SupportedLngs,
  ViewMode,
};

async function createConnection(options: Partial<ConnectionOptions> = {}) {
  const userDataPath = (app || remote.app).getPath('userData');

  const opts: ConnectionOptions = {
    ...defaultOptions,
    ...options,
    entities: [Config, Workspace, Directory, File],
    database: join(userDataPath, 'random-playlist.db'),
  } as ConnectionOptions;
  return _createConnection(opts);
}

export async function connection(
  createOptions: Partial<ConnectionOptions> = {}
) {
  let conn: Connection;
  try {
    conn = getConnection();
    if (conn != null && conn.isConnected) {
      return conn;
    }
    // eslint-disable-next-line no-empty
  } catch (e: unknown) {}
  return createConnection(createOptions);
}
