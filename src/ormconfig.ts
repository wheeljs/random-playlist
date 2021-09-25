import { ConnectionOptions } from 'typeorm';

export default {
  type: 'better-sqlite3',
  synchronize: false,
  migrationsTableName: '__migrations',
  cli: {
    migrationsDir: 'migrations/',
  },
} as ConnectionOptions;
