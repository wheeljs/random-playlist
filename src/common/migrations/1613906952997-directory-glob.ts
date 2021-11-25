/* eslint-disable class-methods-use-this */
import type { MigrationInterface, QueryRunner } from 'typeorm';

export default class DirectoryGlob1613906952997 implements MigrationInterface {
  up(qr: QueryRunner) {
    return qr.query(`ALTER TABLE t_directory ADD COLUMN glob TEXT`);
  }

  down() {
    return Promise.resolve();
  }
}
