/* eslint-disable import/prefer-default-export */
import { join } from 'path';
import { app } from 'electron';
import {
  ConnectionOptions,
  createConnection,
  getConnectionOptions,
} from 'typeorm';

export async function connection(options: Partial<ConnectionOptions> = {}) {
  const defaultOptions = await getConnectionOptions();
  const opts: ConnectionOptions = ({
    ...defaultOptions,
    ...options,
    database: join(app.getPath('userData'), 'random-playlist.db'),
  } as unknown) as ConnectionOptions;
  return createConnection(opts);
}
