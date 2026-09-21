import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import { seedReportsFromFigma } from './seeds/reportsFromFigma'

/**
 * Laporan: byline (author) and financial statement tables, then the Figma
 * sample content for the four sample reports (see seeds/reportsFromFigma.ts).
 */

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_reports_financial_tables_rows_emphasis" AS ENUM('none', 'label', 'row');
  CREATE TYPE "public"."enum__reports_v_version_financial_tables_rows_emphasis" AS ENUM('none', 'label', 'row');
  CREATE TABLE "reports_financial_tables_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"emphasis" "enum_reports_financial_tables_rows_emphasis" DEFAULT 'none',
  	"gap_before" boolean DEFAULT false
  );
  
  CREATE TABLE "reports_financial_tables_rows_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "reports_financial_tables" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "reports_financial_tables_locales" (
  	"intro" varchar,
  	"title" varchar,
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_reports_v_version_financial_tables_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"emphasis" "enum__reports_v_version_financial_tables_rows_emphasis" DEFAULT 'none',
  	"gap_before" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_reports_v_version_financial_tables_rows_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_reports_v_version_financial_tables" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_reports_v_version_financial_tables_locales" (
  	"intro" varchar,
  	"title" varchar,
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "reports" ADD COLUMN "author" varchar;
  ALTER TABLE "_reports_v" ADD COLUMN "version_author" varchar;
  ALTER TABLE "reports_financial_tables_rows" ADD CONSTRAINT "reports_financial_tables_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."reports_financial_tables"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "reports_financial_tables_rows_locales" ADD CONSTRAINT "reports_financial_tables_rows_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."reports_financial_tables_rows"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "reports_financial_tables" ADD CONSTRAINT "reports_financial_tables_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."reports"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "reports_financial_tables_locales" ADD CONSTRAINT "reports_financial_tables_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."reports_financial_tables"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_reports_v_version_financial_tables_rows" ADD CONSTRAINT "_reports_v_version_financial_tables_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_reports_v_version_financial_tables"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_reports_v_version_financial_tables_rows_locales" ADD CONSTRAINT "_reports_v_version_financial_tables_rows_locales_parent_i_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_reports_v_version_financial_tables_rows"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_reports_v_version_financial_tables" ADD CONSTRAINT "_reports_v_version_financial_tables_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_reports_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_reports_v_version_financial_tables_locales" ADD CONSTRAINT "_reports_v_version_financial_tables_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_reports_v_version_financial_tables"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "reports_financial_tables_rows_order_idx" ON "reports_financial_tables_rows" USING btree ("_order");
  CREATE INDEX "reports_financial_tables_rows_parent_id_idx" ON "reports_financial_tables_rows" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "reports_financial_tables_rows_locales_locale_parent_id_uniqu" ON "reports_financial_tables_rows_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "reports_financial_tables_order_idx" ON "reports_financial_tables" USING btree ("_order");
  CREATE INDEX "reports_financial_tables_parent_id_idx" ON "reports_financial_tables" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "reports_financial_tables_locales_locale_parent_id_unique" ON "reports_financial_tables_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_reports_v_version_financial_tables_rows_order_idx" ON "_reports_v_version_financial_tables_rows" USING btree ("_order");
  CREATE INDEX "_reports_v_version_financial_tables_rows_parent_id_idx" ON "_reports_v_version_financial_tables_rows" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_reports_v_version_financial_tables_rows_locales_locale_pare" ON "_reports_v_version_financial_tables_rows_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_reports_v_version_financial_tables_order_idx" ON "_reports_v_version_financial_tables" USING btree ("_order");
  CREATE INDEX "_reports_v_version_financial_tables_parent_id_idx" ON "_reports_v_version_financial_tables" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_reports_v_version_financial_tables_locales_locale_parent_id" ON "_reports_v_version_financial_tables_locales" USING btree ("_locale","_parent_id");`)

  await seedReportsFromFigma(payload, req)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "reports_financial_tables_rows" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "reports_financial_tables_rows_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "reports_financial_tables" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "reports_financial_tables_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_reports_v_version_financial_tables_rows" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_reports_v_version_financial_tables_rows_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_reports_v_version_financial_tables" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_reports_v_version_financial_tables_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "reports_financial_tables_rows" CASCADE;
  DROP TABLE "reports_financial_tables_rows_locales" CASCADE;
  DROP TABLE "reports_financial_tables" CASCADE;
  DROP TABLE "reports_financial_tables_locales" CASCADE;
  DROP TABLE "_reports_v_version_financial_tables_rows" CASCADE;
  DROP TABLE "_reports_v_version_financial_tables_rows_locales" CASCADE;
  DROP TABLE "_reports_v_version_financial_tables" CASCADE;
  DROP TABLE "_reports_v_version_financial_tables_locales" CASCADE;
  ALTER TABLE "reports" DROP COLUMN "author";
  ALTER TABLE "_reports_v" DROP COLUMN "version_author";
  DROP TYPE "public"."enum_reports_financial_tables_rows_emphasis";
  DROP TYPE "public"."enum__reports_v_version_financial_tables_rows_emphasis";`)
}
