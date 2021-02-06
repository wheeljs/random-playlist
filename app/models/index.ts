/* eslint-disable import/prefer-default-export */
import { join } from 'path';
import { app, remote } from 'electron';
import {
  ConnectionOptions,
  createConnection,
  getConnectionOptions,
} from 'typeorm';

import { File } from './File';
import { Directory } from './Directory';
import { Workspace } from './Workspace';

export { Workspace, Directory, File };

export async function connection(options: Partial<ConnectionOptions> = {}) {
  const userDataPath = (app || remote.app).getPath('userData');

  const defaultOptions = await getConnectionOptions();
  const opts: ConnectionOptions = ({
    ...defaultOptions,
    ...options,
    entities: [Workspace, Directory, File],
    database: join(userDataPath, 'random-playlist.db'),
  } as unknown) as ConnectionOptions;
  return createConnection(opts);
}
