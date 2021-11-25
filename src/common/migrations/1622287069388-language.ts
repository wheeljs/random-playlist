/* eslint-disable class-methods-use-this */
import type { MigrationInterface, QueryRunner } from 'typeorm';

export default class Language1622287069388 implements MigrationInterface {
  async up(qr: QueryRunner) {
    await qr.query(
      `INSERT INTO t_config(key, value, version) VALUES('language', NULL, 1)`
    );
  }

  down(qr: QueryRunner) {
    return qr.query(`UPDATE t_config SET enabled = 0 WHERE key = 'language'`);
  }
}
