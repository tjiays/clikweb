import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Names the record on old audit entries that only carried its id.
 *
 * The hook used to look for `title` or `name`, but news, reports, jobs and
 * products keep their title as a language pair (`titleId`/`titleEn`), so it
 * fell through to the id and wrote "5" where it meant "Senior Marketing
 * Manager". The hook reads the paired fields now; this fixes what it already
 * wrote.
 *
 * Only rows whose record still exists can be fixed. Entries for collections
 * the project has since dropped — milestones, stats, testimonials, cta-blocks
 * — keep their id, because there is nothing left to look the name up in.
 *
 * Reversible exactly: document_id holds the same value the title had.
 */
const SOURCES: { slug: string; table: string; column: string; fallback: string }[] = [
  { slug: 'job-openings', table: 'job_openings', column: 'title_id', fallback: 'title_en' },
  { slug: 'reports', table: 'reports', column: 'title_id', fallback: 'title_en' },
  { slug: 'articles', table: 'articles', column: 'title_id', fallback: 'title_en' },
  { slug: 'product-items', table: 'product_items', column: 'name_id', fallback: 'name_en' },
]

export async function up({ db, payload }: MigrateUpArgs): Promise<void> {
  let fixed = 0

  for (const { slug, table, column, fallback } of SOURCES) {
    const result = await db.execute(sql`
      UPDATE "audit_log" AS a
      SET "document_title" = COALESCE(
        NULLIF(TRIM(s.${sql.raw(`"${column}"`)}), ''),
        NULLIF(TRIM(s.${sql.raw(`"${fallback}"`)}), ''),
        a."document_title"
      )
      FROM ${sql.raw(`"${table}"`)} AS s
      WHERE a."collection_slug" = ${slug}
        AND a."document_title" ~ '^[0-9]+$'
        AND s."id"::text = a."document_id";`)
    fixed += result.rowCount ?? 0
  }

  const left = await db.execute(sql`
    SELECT "collection_slug", count(*) AS remaining
    FROM "audit_log" WHERE "document_title" ~ '^[0-9]+$'
    GROUP BY "collection_slug" ORDER BY 2 DESC;`)

  payload.logger.info(`Audit entries given a name: ${fixed}`)
  payload.logger.info(
    `Still showing an id (collection no longer exists): ${JSON.stringify(left.rows)}`,
  )
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // document_id carried the same value, so the id can be put back exactly.
  for (const { slug } of SOURCES) {
    await db.execute(sql`
      UPDATE "audit_log"
      SET "document_title" = "document_id"
      WHERE "collection_slug" = ${slug} AND "document_id" ~ '^[0-9]+$';`)
  }
}
