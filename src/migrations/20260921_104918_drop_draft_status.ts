import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  /*
   * Anything still sitting in Draft becomes In Review before the type is
   * rebuilt without that value — the cast at the end of this migration would
   * fail on it otherwise, and Draft was never a state anyone chose: saving
   * has submitted for review since the status box was removed.
   *
   * 'in_review' is already a member of the old enum, so these run before any
   * of the type surgery below.
   */
  for (const table of ['articles', 'reports', 'job_openings', 'product_items']) {
    await db.execute(
      sql`UPDATE ${sql.raw(`"${table}"`)} SET "approval_status" = 'in_review' WHERE "approval_status" = 'draft'`,
    )
    await db.execute(
      sql`UPDATE ${sql.raw(`"_${table}_v"`)} SET "version_approval_status" = 'in_review' WHERE "version_approval_status" = 'draft'`,
    )
  }

  await db.execute(sql`
   ALTER TABLE "articles" ALTER COLUMN "approval_status" SET DATA TYPE text;
  ALTER TABLE "articles" ALTER COLUMN "approval_status" SET DEFAULT 'in_review'::text;
  DROP TYPE "public"."enum_articles_approval_status";
  CREATE TYPE "public"."enum_articles_approval_status" AS ENUM('in_review', 'approved', 'rejected');
  ALTER TABLE "articles" ALTER COLUMN "approval_status" SET DEFAULT 'in_review'::"public"."enum_articles_approval_status";
  ALTER TABLE "articles" ALTER COLUMN "approval_status" SET DATA TYPE "public"."enum_articles_approval_status" USING "approval_status"::"public"."enum_articles_approval_status";
  ALTER TABLE "_articles_v" ALTER COLUMN "version_approval_status" SET DATA TYPE text;
  ALTER TABLE "_articles_v" ALTER COLUMN "version_approval_status" SET DEFAULT 'in_review'::text;
  DROP TYPE "public"."enum__articles_v_version_approval_status";
  CREATE TYPE "public"."enum__articles_v_version_approval_status" AS ENUM('in_review', 'approved', 'rejected');
  ALTER TABLE "_articles_v" ALTER COLUMN "version_approval_status" SET DEFAULT 'in_review'::"public"."enum__articles_v_version_approval_status";
  ALTER TABLE "_articles_v" ALTER COLUMN "version_approval_status" SET DATA TYPE "public"."enum__articles_v_version_approval_status" USING "version_approval_status"::"public"."enum__articles_v_version_approval_status";
  ALTER TABLE "reports" ALTER COLUMN "approval_status" SET DATA TYPE text;
  ALTER TABLE "reports" ALTER COLUMN "approval_status" SET DEFAULT 'in_review'::text;
  DROP TYPE "public"."enum_reports_approval_status";
  CREATE TYPE "public"."enum_reports_approval_status" AS ENUM('in_review', 'approved', 'rejected');
  ALTER TABLE "reports" ALTER COLUMN "approval_status" SET DEFAULT 'in_review'::"public"."enum_reports_approval_status";
  ALTER TABLE "reports" ALTER COLUMN "approval_status" SET DATA TYPE "public"."enum_reports_approval_status" USING "approval_status"::"public"."enum_reports_approval_status";
  ALTER TABLE "_reports_v" ALTER COLUMN "version_approval_status" SET DATA TYPE text;
  ALTER TABLE "_reports_v" ALTER COLUMN "version_approval_status" SET DEFAULT 'in_review'::text;
  DROP TYPE "public"."enum__reports_v_version_approval_status";
  CREATE TYPE "public"."enum__reports_v_version_approval_status" AS ENUM('in_review', 'approved', 'rejected');
  ALTER TABLE "_reports_v" ALTER COLUMN "version_approval_status" SET DEFAULT 'in_review'::"public"."enum__reports_v_version_approval_status";
  ALTER TABLE "_reports_v" ALTER COLUMN "version_approval_status" SET DATA TYPE "public"."enum__reports_v_version_approval_status" USING "version_approval_status"::"public"."enum__reports_v_version_approval_status";
  ALTER TABLE "job_openings" ALTER COLUMN "approval_status" SET DATA TYPE text;
  ALTER TABLE "job_openings" ALTER COLUMN "approval_status" SET DEFAULT 'in_review'::text;
  DROP TYPE "public"."enum_job_openings_approval_status";
  CREATE TYPE "public"."enum_job_openings_approval_status" AS ENUM('in_review', 'approved', 'rejected');
  ALTER TABLE "job_openings" ALTER COLUMN "approval_status" SET DEFAULT 'in_review'::"public"."enum_job_openings_approval_status";
  ALTER TABLE "job_openings" ALTER COLUMN "approval_status" SET DATA TYPE "public"."enum_job_openings_approval_status" USING "approval_status"::"public"."enum_job_openings_approval_status";
  ALTER TABLE "_job_openings_v" ALTER COLUMN "version_approval_status" SET DATA TYPE text;
  ALTER TABLE "_job_openings_v" ALTER COLUMN "version_approval_status" SET DEFAULT 'in_review'::text;
  DROP TYPE "public"."enum__job_openings_v_version_approval_status";
  CREATE TYPE "public"."enum__job_openings_v_version_approval_status" AS ENUM('in_review', 'approved', 'rejected');
  ALTER TABLE "_job_openings_v" ALTER COLUMN "version_approval_status" SET DEFAULT 'in_review'::"public"."enum__job_openings_v_version_approval_status";
  ALTER TABLE "_job_openings_v" ALTER COLUMN "version_approval_status" SET DATA TYPE "public"."enum__job_openings_v_version_approval_status" USING "version_approval_status"::"public"."enum__job_openings_v_version_approval_status";
  ALTER TABLE "product_items" ALTER COLUMN "approval_status" SET DATA TYPE text;
  ALTER TABLE "product_items" ALTER COLUMN "approval_status" SET DEFAULT 'in_review'::text;
  DROP TYPE "public"."enum_product_items_approval_status";
  CREATE TYPE "public"."enum_product_items_approval_status" AS ENUM('in_review', 'approved', 'rejected');
  ALTER TABLE "product_items" ALTER COLUMN "approval_status" SET DEFAULT 'in_review'::"public"."enum_product_items_approval_status";
  ALTER TABLE "product_items" ALTER COLUMN "approval_status" SET DATA TYPE "public"."enum_product_items_approval_status" USING "approval_status"::"public"."enum_product_items_approval_status";
  ALTER TABLE "_product_items_v" ALTER COLUMN "version_approval_status" SET DATA TYPE text;
  ALTER TABLE "_product_items_v" ALTER COLUMN "version_approval_status" SET DEFAULT 'in_review'::text;
  DROP TYPE "public"."enum__product_items_v_version_approval_status";
  CREATE TYPE "public"."enum__product_items_v_version_approval_status" AS ENUM('in_review', 'approved', 'rejected');
  ALTER TABLE "_product_items_v" ALTER COLUMN "version_approval_status" SET DEFAULT 'in_review'::"public"."enum__product_items_v_version_approval_status";
  ALTER TABLE "_product_items_v" ALTER COLUMN "version_approval_status" SET DATA TYPE "public"."enum__product_items_v_version_approval_status" USING "version_approval_status"::"public"."enum__product_items_v_version_approval_status";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_articles_approval_status" ADD VALUE 'draft' BEFORE 'in_review';
  ALTER TYPE "public"."enum__articles_v_version_approval_status" ADD VALUE 'draft' BEFORE 'in_review';
  ALTER TYPE "public"."enum_reports_approval_status" ADD VALUE 'draft' BEFORE 'in_review';
  ALTER TYPE "public"."enum__reports_v_version_approval_status" ADD VALUE 'draft' BEFORE 'in_review';
  ALTER TYPE "public"."enum_job_openings_approval_status" ADD VALUE 'draft' BEFORE 'in_review';
  ALTER TYPE "public"."enum__job_openings_v_version_approval_status" ADD VALUE 'draft' BEFORE 'in_review';
  ALTER TYPE "public"."enum_product_items_approval_status" ADD VALUE 'draft' BEFORE 'in_review';
  ALTER TYPE "public"."enum__product_items_v_version_approval_status" ADD VALUE 'draft' BEFORE 'in_review';
  ALTER TABLE "articles" ALTER COLUMN "approval_status" SET DEFAULT 'draft';
  ALTER TABLE "_articles_v" ALTER COLUMN "version_approval_status" SET DEFAULT 'draft';
  ALTER TABLE "reports" ALTER COLUMN "approval_status" SET DEFAULT 'draft';
  ALTER TABLE "_reports_v" ALTER COLUMN "version_approval_status" SET DEFAULT 'draft';
  ALTER TABLE "job_openings" ALTER COLUMN "approval_status" SET DEFAULT 'draft';
  ALTER TABLE "_job_openings_v" ALTER COLUMN "version_approval_status" SET DEFAULT 'draft';
  ALTER TABLE "product_items" ALTER COLUMN "approval_status" SET DEFAULT 'draft';
  ALTER TABLE "_product_items_v" ALTER COLUMN "version_approval_status" SET DEFAULT 'draft';`)
}
