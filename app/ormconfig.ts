// import { ConnectionOptions } from 'typeorm';

module.exports = {
  type: 'better-sqlite3',
  synchronize: false,
  migrationsTableName: '__migrations',
  cli: {
    migrationsDir: 'migrations/',
  },
} /* as ConnectionOptions */;
