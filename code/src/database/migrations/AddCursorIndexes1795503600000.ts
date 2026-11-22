import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCursorIndexes1795503600000 implements MigrationInterface {
  name = 'AddCursorIndexes1795503600000';

  async up(runner: QueryRunner): Promise<void> {
    await runner.query('CREATE INDEX shop_cursor_idx ON shop (created_at DESC, uuid ASC)');
  }

  async down(): Promise<void> {
    throw new Error('Cursor index rollback is not supported');
  }
}
