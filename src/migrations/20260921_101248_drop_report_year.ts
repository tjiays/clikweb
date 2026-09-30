import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "reports" DROP COLUMN "year";
  ALTER TABLE "_reports_v" DROP COLUMN "version_year";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "reports" ADD COLUMN "year" numeric;
  ALTER TABLE "_reports_v" ADD COLUMN "version_year" numeric;`)
}
