import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "job_openings" DROP COLUMN "apply_email";
  ALTER TABLE "job_openings" DROP COLUMN "posted_date";
  ALTER TABLE "job_openings_locales" DROP COLUMN "education";
  ALTER TABLE "job_openings_locales" DROP COLUMN "email_subject_format";
  ALTER TABLE "_job_openings_v" DROP COLUMN "version_apply_email";
  ALTER TABLE "_job_openings_v" DROP COLUMN "version_posted_date";
  ALTER TABLE "_job_openings_v_locales" DROP COLUMN "version_education";
  ALTER TABLE "_job_openings_v_locales" DROP COLUMN "version_email_subject_format";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "job_openings" ADD COLUMN "apply_email" varchar DEFAULT 'talent@cbclik.com';
  ALTER TABLE "job_openings" ADD COLUMN "posted_date" timestamp(3) with time zone;
  ALTER TABLE "job_openings_locales" ADD COLUMN "education" jsonb;
  ALTER TABLE "job_openings_locales" ADD COLUMN "email_subject_format" varchar;
  ALTER TABLE "_job_openings_v" ADD COLUMN "version_apply_email" varchar DEFAULT 'talent@cbclik.com';
  ALTER TABLE "_job_openings_v" ADD COLUMN "version_posted_date" timestamp(3) with time zone;
  ALTER TABLE "_job_openings_v_locales" ADD COLUMN "version_education" jsonb;
  ALTER TABLE "_job_openings_v_locales" ADD COLUMN "version_email_subject_format" varchar;`)
}
