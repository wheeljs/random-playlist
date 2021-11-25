/* eslint-disable class-methods-use-this */
import type { MigrationInterface, QueryRunner } from 'typeorm';

export default class FileThumb1621095620847 implements MigrationInterface {
  up(qr: QueryRunner) {
    return qr.query(`ALTER TABLE t_file ADD COLUMN thumb TEXT`);
  }

  down() {
    return Promise.resolve();
  }
}
