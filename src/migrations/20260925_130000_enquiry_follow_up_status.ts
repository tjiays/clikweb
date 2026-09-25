import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * The enquiry "sudah ditindaklanjuti" checkbox becomes a two-state status:
 * New, or Follow Up.
 *
 * Add, copy, count, then drop — a generated migration would have dropped the
 * boolean before the new column existed and taken every enquiry's follow-up
 * state with it.
 */
export async function up({ db, payload }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DROP TYPE IF EXISTS "enum_contact_submissions_follow_up_status";
    CREATE TYPE "enum_contact_submissions_follow_up_status" AS ENUM('new', 'follow_up');
    ALTER TABLE "contact_submissions"
      ADD COLUMN "follow_up_status" "enum_contact_submissions_follow_up_status"
      DEFAULT 'new';`)

  // A ticked box meant somebody had picked the enquiry up. NULL and false both
  // mean nobody had.
  await db.execute(sql`
    UPDATE "contact_submissions"
    SET "follow_up_status" = CASE WHEN "followed_up" IS TRUE THEN 'follow_up'::"enum_contact_submissions_follow_up_status"
                                  ELSE 'new'::"enum_contact_submissions_follow_up_status" END;`)

  const check = await db.execute(sql`
    SELECT count(*) AS total,
           count(*) FILTER (WHERE "follow_up_status" = 'follow_up') AS follow_up,
           count(*) FILTER (WHERE "follow_up_status" = 'new') AS still_new,
           count(*) FILTER (WHERE "follow_up_status" IS NULL) AS unset,
           count(*) FILTER (WHERE "followed_up" IS TRUE) AS was_ticked
    FROM "contact_submissions";`)
  const row = check.rows[0] as Record<string, unknown>
  payload.logger.info(`Enquiry status carried over: ${JSON.stringify(row)}`)

  if (Number(row.unset) > 0 || Number(row.follow_up) !== Number(row.was_ticked)) {
    throw new Error('Enquiry follow-up state did not carry over; leaving the old column in place.')
  }

  await db.execute(sql`
    ALTER TABLE "contact_submissions" ALTER COLUMN "follow_up_status" SET NOT NULL;
    ALTER TABLE "contact_submissions" DROP COLUMN "followed_up";`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`ALTER TABLE "contact_submissions" ADD COLUMN "followed_up" boolean;`)
  await db.execute(sql`
    UPDATE "contact_submissions" SET "followed_up" = ("follow_up_status" = 'follow_up');`)
  await db.execute(sql`
    ALTER TABLE "contact_submissions" DROP COLUMN "follow_up_status";
    DROP TYPE IF EXISTS "enum_contact_submissions_follow_up_status";`)
}
