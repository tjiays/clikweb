import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/*
 * Repairs the id sequences on the product tables created by
 * 20260923_103843_products_add_paired.
 *
 * That migration copied array rows across with their existing ids, into
 * columns Payload declares as serial. Copying a value does not advance the
 * sequence behind it, so the counters were left at 3 while the tables held
 * ids up to 411 — and the next save, which is the next version Payload
 * writes, failed with "Value must be unique" on id. Saving any product was
 * impossible, whatever was being edited.
 *
 * setval to the highest id present puts each counter back where it belongs.
 * Harmless to run against a table already in step.
 */
const TABLES = [
  'product_items_statuses',
  '_product_items_v_version_statuses',
  '_product_items_v_version_features_id',
  '_product_items_v_version_features_en',
  '_product_items_v_version_suitable_for_id',
  '_product_items_v_version_suitable_for_en',
  '_product_items_v_version_use_cases_id',
  '_product_items_v_version_use_cases_en',
]

export async function up({ db, payload }: MigrateUpArgs): Promise<void> {
  for (const table of TABLES) {
    const result = await db.execute(sql`
      SELECT setval(
        pg_get_serial_sequence(${table}, 'id'),
        GREATEST(COALESCE((SELECT max("id") FROM ${sql.raw(`"${table}"`)}), 0), 1)
      ) AS value;
    `)
    payload.logger.info(`${table}: id sequence set to ${result.rows[0]?.value}`)
  }
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // Nothing to undo: a sequence in step with its table is simply correct.
}
