import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/*
 * Karir grows from three departments to five, and two of the three are
 * renamed: Information Technology becomes IT, and Analysis & Reporting
 * becomes Analytics. Operations and Finance are new and hold nothing yet.
 *
 * The slug is what sits in the column, so the rows move with the list.
 * category is a varchar rather than an enum here, so this is an update and
 * not type surgery — and nothing routes or filters on it, so no URL changes.
 */
const RENAMES: [from: string, to: string][] = [
  ['information-technology', 'it'],
  ['analysis-reporting', 'analytics'],
]

export async function up({ db, payload }: MigrateUpArgs): Promise<void> {
  for (const [from, to] of RENAMES) {
    await db.execute(sql`UPDATE "job_openings" SET "category" = ${to} WHERE "category" = ${from};`)
    await db.execute(
      sql`UPDATE "_job_openings_v" SET "version_category" = ${to} WHERE "version_category" = ${from};`,
    )
  }

  const after = await db.execute(sql`
    SELECT "category", count(*) AS n FROM "job_openings" GROUP BY "category" ORDER BY "category";
  `)
  payload.logger.info(`Career categories now: ${JSON.stringify(after.rows)}`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  for (const [from, to] of RENAMES) {
    await db.execute(sql`UPDATE "job_openings" SET "category" = ${from} WHERE "category" = ${to};`)
    await db.execute(
      sql`UPDATE "_job_openings_v" SET "version_category" = ${from} WHERE "version_category" = ${to};`,
    )
  }
}
