import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "product_items_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "product_items_suitable_for" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "_product_items_v_version_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_product_items_v_version_suitable_for" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  ALTER TABLE "product_items_use_cases_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_product_items_v_version_use_cases_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "product_items_use_cases_locales" CASCADE;
  DROP TABLE "_product_items_v_version_use_cases_locales" CASCADE;
  ALTER TABLE "product_items_use_cases" ADD COLUMN "_locale" "_locales" NOT NULL;
  ALTER TABLE "product_items_use_cases" ADD COLUMN "label" varchar;
  ALTER TABLE "_product_items_v_version_use_cases" ADD COLUMN "_locale" "_locales" NOT NULL;
  ALTER TABLE "_product_items_v_version_use_cases" ADD COLUMN "label" varchar;
  ALTER TABLE "product_items_features" ADD CONSTRAINT "product_items_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_items_suitable_for" ADD CONSTRAINT "product_items_suitable_for_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_product_items_v_version_features" ADD CONSTRAINT "_product_items_v_version_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_product_items_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_product_items_v_version_suitable_for" ADD CONSTRAINT "_product_items_v_version_suitable_for_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_product_items_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "product_items_features_order_idx" ON "product_items_features" USING btree ("_order");
  CREATE INDEX "product_items_features_parent_id_idx" ON "product_items_features" USING btree ("_parent_id");
  CREATE INDEX "product_items_features_locale_idx" ON "product_items_features" USING btree ("_locale");
  CREATE INDEX "product_items_suitable_for_order_idx" ON "product_items_suitable_for" USING btree ("_order");
  CREATE INDEX "product_items_suitable_for_parent_id_idx" ON "product_items_suitable_for" USING btree ("_parent_id");
  CREATE INDEX "product_items_suitable_for_locale_idx" ON "product_items_suitable_for" USING btree ("_locale");
  CREATE INDEX "_product_items_v_version_features_order_idx" ON "_product_items_v_version_features" USING btree ("_order");
  CREATE INDEX "_product_items_v_version_features_parent_id_idx" ON "_product_items_v_version_features" USING btree ("_parent_id");
  CREATE INDEX "_product_items_v_version_features_locale_idx" ON "_product_items_v_version_features" USING btree ("_locale");
  CREATE INDEX "_product_items_v_version_suitable_for_order_idx" ON "_product_items_v_version_suitable_for" USING btree ("_order");
  CREATE INDEX "_product_items_v_version_suitable_for_parent_id_idx" ON "_product_items_v_version_suitable_for" USING btree ("_parent_id");
  CREATE INDEX "_product_items_v_version_suitable_for_locale_idx" ON "_product_items_v_version_suitable_for" USING btree ("_locale");
  CREATE INDEX "product_items_use_cases_locale_idx" ON "product_items_use_cases" USING btree ("_locale");
  CREATE INDEX "_product_items_v_version_use_cases_locale_idx" ON "_product_items_v_version_use_cases" USING btree ("_locale");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "product_items_use_cases_locales" (
  	"segment" varchar,
  	"use" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_product_items_v_version_use_cases_locales" (
  	"segment" varchar,
  	"use" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "product_items_features" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "product_items_suitable_for" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_product_items_v_version_features" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_product_items_v_version_suitable_for" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "product_items_features" CASCADE;
  DROP TABLE "product_items_suitable_for" CASCADE;
  DROP TABLE "_product_items_v_version_features" CASCADE;
  DROP TABLE "_product_items_v_version_suitable_for" CASCADE;
  DROP INDEX "product_items_use_cases_locale_idx";
  DROP INDEX "_product_items_v_version_use_cases_locale_idx";
  ALTER TABLE "product_items_use_cases_locales" ADD CONSTRAINT "product_items_use_cases_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_items_use_cases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_product_items_v_version_use_cases_locales" ADD CONSTRAINT "_product_items_v_version_use_cases_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_product_items_v_version_use_cases"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "product_items_use_cases_locales_locale_parent_id_unique" ON "product_items_use_cases_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_product_items_v_version_use_cases_locales_locale_parent_id_" ON "_product_items_v_version_use_cases_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "product_items_use_cases" DROP COLUMN "_locale";
  ALTER TABLE "product_items_use_cases" DROP COLUMN "label";
  ALTER TABLE "_product_items_v_version_use_cases" DROP COLUMN "_locale";
  ALTER TABLE "_product_items_v_version_use_cases" DROP COLUMN "label";`)
}
