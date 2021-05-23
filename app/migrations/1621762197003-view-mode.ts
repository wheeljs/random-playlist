/* eslint-disable class-methods-use-this */
import { MigrationInterface, QueryRunner } from 'typeorm';

export default class ViewMode1621762197003 implements MigrationInterface {
  async up(qr: QueryRunner) {
    await qr.query(`ALTER TABLE t_directory ADD COLUMN view_mode VARCHAR(10)`);
    await qr.query(`ALTER TABLE t_workspace ADD COLUMN view_mode VARCHAR(10)`);
    await qr.query(
      `INSERT INTO t_config(key, value, version) VALUES('viewMode', 'thumb', 1)`
    );
  }

  down(qr: QueryRunner) {
    return qr.query(`UPDATE t_config SET enabled = 0 WHERE key = 'viewMode'`);
  }
}
