/* eslint-disable class-methods-use-this */
import type { MigrationInterface, QueryRunner } from 'typeorm';

export default class Config1613889634944 implements MigrationInterface {
  async up(qr: QueryRunner): Promise<void> {
    await qr.query(`CREATE TABLE IF NOT EXISTS t_config (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key VARCHAR NOT NULL UNIQUE,
      value VARCHAR,
      value_type VARCHAR DEFAULT 'string',
      version INTEGER,
      enabled BOOLEAN DEFAULT true,
      created_at DATE DEFAULT CURRENT_TIMESTAMP,
      updated_at DATE,
      deleted_at DATE
    )`);

    await qr.query(
      `INSERT INTO t_config(key, value, value_type, version) VALUES('glob', '*.webm,*.mpg,*.mp2,*.mpeg,*.mpe,*.mpv,*.ogg,*.mp4,*.m4p,*.m4v,*.mkv,*.avi,*.wmv,*.mov,*.qt,*.flv,*.swf,*.rmvb', 'separated-string', 1)`
    );
  }

  down(qr: QueryRunner): Promise<void> {
    return qr.query('DROP TABLE t_config');
  }
}
