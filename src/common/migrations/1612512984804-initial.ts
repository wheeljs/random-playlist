/* eslint-disable class-methods-use-this */
import type { MigrationInterface, QueryRunner } from 'typeorm';

export default class Initial1612512984804 implements MigrationInterface {
  async up(qr: QueryRunner): Promise<void> {
    await qr.query(`CREATE TABLE IF NOT EXISTS t_workspace (
      id   VARCHAR PRIMARY KEY,
      name VARCHAT(50) NOT NULL,
      'order' INTEGER,
      created_at DATE DEFAULT CURRENT_TIMESTAMP,
      updated_at DATE,
      deleted_at DATE
    )`);

    await qr.query(`CREATE TABLE IF NOT EXISTS t_directory (
      id VARCHAR PRIMARY KEY,
      workspace_id VARCHAR NOT NULL,
      path VARCHAR NOT NULL,
      'order' INTEGER,
      created_at DATE DEFAULT CURRENT_TIMESTAMP,
      updated_at DATE,
      deleted_at DATE,
      CONSTRAINT directory_fk_workspace_id FOREIGN KEY (workspace_id)
        REFERENCES t_workspace (id)
    )`);

    await qr.query(
      'CREATE INDEX IF NOT EXISTS directory_fk_workspace_id ON t_directory (workspace_id)'
    );

    await qr.query(`CREATE TABLE IF NOT EXISTS t_file (
      id VARCHAR PRIMARY KEY,
      directory_id VARCHAR NOT NULL,
      path VARCHAR NOT NULL UNIQUE,
      duration INTEGER,
      extension VARCHAT,
      created_at DATE DEFAULT CURRENT_TIMESTAMP,
      updated_at DATE,
      deleted_at DATE,
      CONSTRAINT file_fk_directory_id FOREIGN KEY (directory_id)
        REFERENCES t_directory (id)
    )`);

    await qr.query(
      'CREATE INDEX IF NOT EXISTS file_fk_directory_id ON t_file (directory_id)'
    );

    await qr.query(
      `INSERT INTO t_workspace(id, name, 'order') VALUES(1, '默认空间', 1)`
    );
  }

  async down(qr: QueryRunner): Promise<void> {
    await qr.query('DROP INDEX file_fk_directory_id');
    await qr.query('DROP TABLE t_file');
    await qr.query('DROP INDEX directory_fk_workspace_id');
    await qr.query('DROP TABLE t_directory');
    await qr.query('DROP TABLE t_workspace');
  }
}
