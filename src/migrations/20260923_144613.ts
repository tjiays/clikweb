import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/*
 * Brings the category column onto the five-department enum.
 *
 * DROP TYPE carries IF EXISTS because the column was a plain varchar here
 * while the schema snapshot believed it was already an enum, so the generated
 * statement failed on a type that was never created. The rename in
 * 20260923_150000_career_categories runs first, which is what lets the cast
 * below succeed: 'information-technology' is not a member of the new type.
 */
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "job_openings" ALTER COLUMN "category" SET DATA TYPE text;
  DROP TYPE IF EXISTS "public"."enum_job_openings_category";
  CREATE TYPE "public"."enum_job_openings_category" AS ENUM('it', 'analytics', 'sales-business-development', 'operations', 'finance');
  ALTER TABLE "job_openings" ALTER COLUMN "category" SET DATA TYPE "public"."enum_job_openings_category" USING "category"::"public"."enum_job_openings_category";
  ALTER TABLE "_job_openings_v" ALTER COLUMN "version_category" SET DATA TYPE text;
  DROP TYPE IF EXISTS "public"."enum__job_openings_v_version_category";
  CREATE TYPE "public"."enum__job_openings_v_version_category" AS ENUM('it', 'analytics', 'sales-business-development', 'operations', 'finance');
  ALTER TABLE "_job_openings_v" ALTER COLUMN "version_category" SET DATA TYPE "public"."enum__job_openings_v_version_category" USING "version_category"::"public"."enum__job_openings_v_version_category";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "job_openings" ALTER COLUMN "category" SET DATA TYPE text;
  DROP TYPE IF EXISTS "public"."enum_job_openings_category";
  CREATE TYPE "public"."enum_job_openings_category" AS ENUM('information-technology', 'analysis-reporting', 'sales-business-development');
  ALTER TABLE "job_openings" ALTER COLUMN "category" SET DATA TYPE "public"."enum_job_openings_category" USING "category"::"public"."enum_job_openings_category";
  ALTER TABLE "_job_openings_v" ALTER COLUMN "version_category" SET DATA TYPE text;
  DROP TYPE IF EXISTS "public"."enum__job_openings_v_version_category";
  CREATE TYPE "public"."enum__job_openings_v_version_category" AS ENUM('information-technology', 'analysis-reporting', 'sales-business-development');
  ALTER TABLE "_job_openings_v" ALTER COLUMN "version_category" SET DATA TYPE "public"."enum__job_openings_v_version_category" USING "version_category"::"public"."enum__job_openings_v_version_category";`)
}
