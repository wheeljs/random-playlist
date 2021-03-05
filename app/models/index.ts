/* eslint-disable import/prefer-default-export */
import { join } from 'path';
import { app, remote } from 'electron';
import {
  Connection,
  ConnectionOptions,
  createConnection as _createConnection,
  getConnection,
  getConnectionOptions,
} from 'typeorm';

import { Config, IConfig, ConfigValueType, SaveOrUpdateConfig } from './Config';
import { File } from './File';
import { Directory } from './Directory';
import { Workspace } from './Workspace';

export {
  Config,
  IConfig,
  ConfigValueType,
  SaveOrUpdateConfig,
  Workspace,
  Directory,
  File,
};

async function createConnection(options: Partial<ConnectionOptions> = {}) {
  const userDataPath = (app || remote.app).getPath('userData');

  const defaultOptions = await getConnectionOptions();
  const opts: ConnectionOptions = ({
    ...defaultOptions,
    ...options,
    entities: [Config, Workspace, Directory, File],
    database: join(userDataPath, 'random-playlist.db'),
  } as unknown) as ConnectionOptions;
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
