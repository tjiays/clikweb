import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users" ADD COLUMN "_verified" boolean;
  ALTER TABLE "users" ADD COLUMN "_verificationtoken" varchar;`)

  /*
   * Everyone who already had an account keeps it.
   *
   * Payload refuses a login from an unverified user, and these rows predate
   * the column, so leaving them null would lock the whole team out of the CMS
   * the moment this runs — including the only Super Admin, which is not a
   * mistake anyone could undo from inside the admin.
   *
   * They proved the address by using it; only accounts created from here on
   * have to verify.
   */
  await db.execute(sql`UPDATE "users" SET "_verified" = true WHERE "_verified" IS NULL;`)

  const state = await db.execute(sql`
    SELECT count(*) AS total, count(*) FILTER (WHERE "_verified") AS verified FROM "users";
  `)
  payload.logger.info(`Existing accounts kept active: ${JSON.stringify(state.rows[0])}`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users" DROP COLUMN "_verified";
  ALTER TABLE "users" DROP COLUMN "_verificationtoken";`)
}
