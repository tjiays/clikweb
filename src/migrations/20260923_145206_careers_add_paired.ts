import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload }: MigrateUpArgs): Promise<void> {
  /*
   * Order rewritten. As generated, this dropped job_openings_locales.slug in
   * the same breath as creating the column meant to replace it, so the copy
   * below had nothing left to read. Add, copy, then drop.
   */
  await db.execute(sql`
   DROP INDEX "job_openings_slug_idx";
  DROP INDEX "_job_openings_v_version_version_slug_idx";
  ALTER TABLE "job_openings" ADD COLUMN "title_id" varchar;
  ALTER TABLE "job_openings" ADD COLUMN "title_en" varchar;
  ALTER TABLE "job_openings" ADD COLUMN "slug" varchar;
  ALTER TABLE "job_openings" ADD COLUMN "responsibilities_id" jsonb;
  ALTER TABLE "job_openings" ADD COLUMN "responsibilities_en" jsonb;
  ALTER TABLE "job_openings" ADD COLUMN "minimum_qualifications_id" jsonb;
  ALTER TABLE "job_openings" ADD COLUMN "minimum_qualifications_en" jsonb;
  ALTER TABLE "_job_openings_v" ADD COLUMN "version_title_id" varchar;
  ALTER TABLE "_job_openings_v" ADD COLUMN "version_title_en" varchar;
  ALTER TABLE "_job_openings_v" ADD COLUMN "version_slug" varchar;
  ALTER TABLE "_job_openings_v" ADD COLUMN "version_responsibilities_id" jsonb;
  ALTER TABLE "_job_openings_v" ADD COLUMN "version_responsibilities_en" jsonb;
  ALTER TABLE "_job_openings_v" ADD COLUMN "version_minimum_qualifications_id" jsonb;
  ALTER TABLE "_job_openings_v" ADD COLUMN "version_minimum_qualifications_en" jsonb;
  CREATE INDEX "job_openings_slug_idx" ON "job_openings" USING btree ("slug");
  CREATE INDEX "_job_openings_v_version_version_slug_idx" ON "_job_openings_v" USING btree ("version_slug");
`)

  /*
   * Carry the content across while both shapes exist, so the site keeps
   * working between this migration and the one that drops the old columns.
   */
  for (const [main, loc] of [
    ['job_openings', 'job_openings_locales'],
    ['_job_openings_v', '_job_openings_v_locales'],
  ] as const) {
    const p = main === 'job_openings' ? '' : 'version_'
    for (const lang of ['id', 'en'] as const) {
      await db.execute(sql`
        UPDATE ${sql.raw(`"${main}"`)} m SET
          ${sql.raw(`"${p}title_${lang}"`)}                   = l.${sql.raw(`"${p}title"`)},
          ${sql.raw(`"${p}responsibilities_${lang}"`)}        = l.${sql.raw(`"${p}responsibilities"`)},
          ${sql.raw(`"${p}minimum_qualifications_${lang}"`)}  = l.${sql.raw(`"${p}minimum_qualifications"`)}
        FROM ${sql.raw(`"${loc}"`)} l
        WHERE l."_parent_id" = m."id" AND l."_locale" = ${lang};
      `)
    }
  }

  // The slug was per language and identical in both; keep the Indonesian one.
  await db.execute(sql`
    UPDATE "job_openings" m SET "slug" = l."slug"
    FROM "job_openings_locales" l
    WHERE l."_parent_id" = m."id" AND l."_locale" = 'id' AND m."slug" IS NULL;
  `)
  await db.execute(sql`
    UPDATE "_job_openings_v" m SET "version_slug" = l."version_slug"
    FROM "_job_openings_v_locales" l
    WHERE l."_parent_id" = m."id" AND l."_locale" = 'id' AND m."version_slug" IS NULL;
  `)

  const moved = await db.execute(sql`
    SELECT count(*) AS jobs, count("title_id") AS id_titles, count("title_en") AS en_titles,
           count("slug") AS slugs FROM "job_openings";
  `)
  payload.logger.info(`Jobs carried across: ${JSON.stringify(moved.rows[0])}`)

  // Safe now that the slug lives on the document itself.
  await db.execute(sql`
    ALTER TABLE "job_openings_locales" DROP COLUMN "slug";
    ALTER TABLE "_job_openings_v_locales" DROP COLUMN "version_slug";
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "job_openings_slug_idx";
  DROP INDEX "_job_openings_v_version_version_slug_idx";
  ALTER TABLE "job_openings_locales" ADD COLUMN "slug" varchar;
  ALTER TABLE "_job_openings_v_locales" ADD COLUMN "version_slug" varchar;
  CREATE INDEX "job_openings_slug_idx" ON "job_openings_locales" USING btree ("slug","_locale");
  CREATE INDEX "_job_openings_v_version_version_slug_idx" ON "_job_openings_v_locales" USING btree ("version_slug","_locale");
  ALTER TABLE "job_openings" DROP COLUMN "title_id";
  ALTER TABLE "job_openings" DROP COLUMN "title_en";
  ALTER TABLE "job_openings" DROP COLUMN "slug";
  ALTER TABLE "job_openings" DROP COLUMN "responsibilities_id";
  ALTER TABLE "job_openings" DROP COLUMN "responsibilities_en";
  ALTER TABLE "job_openings" DROP COLUMN "minimum_qualifications_id";
  ALTER TABLE "job_openings" DROP COLUMN "minimum_qualifications_en";
  ALTER TABLE "_job_openings_v" DROP COLUMN "version_title_id";
  ALTER TABLE "_job_openings_v" DROP COLUMN "version_title_en";
  ALTER TABLE "_job_openings_v" DROP COLUMN "version_slug";
  ALTER TABLE "_job_openings_v" DROP COLUMN "version_responsibilities_id";
  ALTER TABLE "_job_openings_v" DROP COLUMN "version_responsibilities_en";
  ALTER TABLE "_job_openings_v" DROP COLUMN "version_minimum_qualifications_id";
  ALTER TABLE "_job_openings_v" DROP COLUMN "version_minimum_qualifications_en";`)
}
