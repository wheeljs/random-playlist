/* eslint-disable class-methods-use-this */
import type { MigrationInterface, QueryRunner } from 'typeorm';

export default class Theme1638179178312 implements MigrationInterface {
  async up(qr: QueryRunner) {
    await qr.query(
      `INSERT INTO t_config(key, value, version) VALUES('theme', 'system', 1)`
    );
  }

  down(qr: QueryRunner) {
    return qr.query(`UPDATE t_config SET enabled = 0 WHERE key = 'theme'`);
  }
}
