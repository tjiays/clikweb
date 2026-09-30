import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "job_openings" ADD COLUMN "apply_url" varchar;
  ALTER TABLE "_job_openings_v" ADD COLUMN "version_apply_url" varchar;`)

  /*
   * CLIK's own JobStreet page, verified live and listing current roles.
   * One link for every job rather than one per role: the positions on
   * JobStreet are not the ones seeded here, so a per-role deep link would
   * point at a vacancy that does not exist.
   */
  const APPLY_URL =
    'https://id.jobstreet.com/id/companies/crif-lembaga-informasi-keuangan-168557222859016/jobs'

  await db.execute(sql`UPDATE "job_openings" SET "apply_url" = ${APPLY_URL} WHERE "apply_url" IS NULL;`)
  await db.execute(sql`UPDATE "_job_openings_v" SET "version_apply_url" = ${APPLY_URL} WHERE "version_apply_url" IS NULL;`)

  const filled = await db.execute(sql`SELECT count("apply_url") AS with_link, count(*) AS total FROM "job_openings";`)
  payload.logger.info(`Apply links set: ${JSON.stringify(filled.rows[0])}`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "job_openings" DROP COLUMN "apply_url";
  ALTER TABLE "_job_openings_v" DROP COLUMN "version_apply_url";`)
}
