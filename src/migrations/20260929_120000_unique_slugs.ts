import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * One address, one page: slugs on news, reports and vacancies become unique.
 *
 * Two reports already shared `gundul-gundul-pacul`. The page loads the first
 * match, so one of them could never be opened. Report 9 is the approved one
 * the address shows today, so it keeps it; report 8, an unapproved copy, gets
 * `-2`, in its version history too so its next save does not bring the clash
 * back. Then the plain indexes become unique ones, under the names Payload
 * gives a `unique` field.
 *
 * Hand-written: the schema snapshot the generator compares against is stale
 * (hand-written migrations since 25 September did not update it), so it asked
 * about columns added days ago instead of producing this.
 */
export async function up({ db, payload }: MigrateUpArgs): Promise<void> {
  const clash = await db.execute(sql`
    SELECT id FROM "reports" WHERE "slug" = 'gundul-gundul-pacul' AND "id" = 8;`)
  if (clash.rows.length) {
    await db.execute(sql`
      UPDATE "reports" SET "slug" = 'gundul-gundul-pacul-2' WHERE "id" = 8;
      UPDATE "_reports_v" SET "version_slug" = 'gundul-gundul-pacul-2' WHERE "parent_id" = 8;`)
    payload.logger.info('Report 8 moved to /laporan/gundul-gundul-pacul-2')
  }

  // Refuse to go on if any other duplicate exists, rather than fail half-way.
  const dupes = await db.execute(sql`
    SELECT 'articles' AS t, slug FROM articles GROUP BY slug HAVING count(*) > 1
    UNION ALL SELECT 'reports', slug FROM reports GROUP BY slug HAVING count(*) > 1
    UNION ALL SELECT 'job_openings', slug FROM job_openings GROUP BY slug HAVING count(*) > 1;`)
  if (dupes.rows.length) {
    throw new Error(`Duplicate slugs remain: ${JSON.stringify(dupes.rows)}`)
  }

  await db.execute(sql`
    DROP INDEX IF EXISTS "articles_slug_idx";
    CREATE UNIQUE INDEX "articles_slug_idx" ON "articles" USING btree ("slug");
    DROP INDEX IF EXISTS "reports_slug_idx";
    CREATE UNIQUE INDEX "reports_slug_idx" ON "reports" USING btree ("slug");
    DROP INDEX IF EXISTS "job_openings_slug_idx";
    CREATE UNIQUE INDEX "job_openings_slug_idx" ON "job_openings" USING btree ("slug");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "articles_slug_idx";
    CREATE INDEX "articles_slug_idx" ON "articles" USING btree ("slug");
    DROP INDEX IF EXISTS "reports_slug_idx";
    CREATE INDEX "reports_slug_idx" ON "reports" USING btree ("slug");
    DROP INDEX IF EXISTS "job_openings_slug_idx";
    CREATE INDEX "job_openings_slug_idx" ON "job_openings" USING btree ("slug");`)
}
