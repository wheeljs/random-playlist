import { ConnectionOptions } from 'typeorm';

export default {
  type: 'better-sqlite3',
  entities: ['models/*.ts'],
  synchronize: false,
  migrationsTableName: '__migrations',
  cli: {
    migrationsDir: 'migrations/',
  },
} as ConnectionOptions;
