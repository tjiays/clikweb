import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "product_items_features" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "product_items_suitable_for" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "product_items_use_cases" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "product_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_product_items_v_version_features" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_product_items_v_version_suitable_for" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_product_items_v_version_use_cases" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_product_items_v_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "product_items_features" CASCADE;
  DROP TABLE "product_items_suitable_for" CASCADE;
  DROP TABLE "product_items_use_cases" CASCADE;
  DROP TABLE "product_items_locales" CASCADE;
  DROP TABLE "_product_items_v_version_features" CASCADE;
  DROP TABLE "_product_items_v_version_suitable_for" CASCADE;
  DROP TABLE "_product_items_v_version_use_cases" CASCADE;
  DROP TABLE "_product_items_v_locales" CASCADE;
  ALTER TABLE "product_items" DROP CONSTRAINT "product_items_image_id_media_id_fk";
  
  ALTER TABLE "_product_items_v" DROP CONSTRAINT "_product_items_v_version_image_id_media_id_fk";
  
  DROP INDEX "product_items_image_idx";
  DROP INDEX "_product_items_v_version_version_image_idx";
  ALTER TABLE "product_items" DROP COLUMN "product_status";
  ALTER TABLE "product_items" DROP COLUMN "is_new";
  ALTER TABLE "product_items" DROP COLUMN "image_id";
  ALTER TABLE "_product_items_v" DROP COLUMN "version_product_status";
  ALTER TABLE "_product_items_v" DROP COLUMN "version_is_new";
  ALTER TABLE "_product_items_v" DROP COLUMN "version_image_id";
  DROP TYPE "public"."enum_product_items_product_status";
  DROP TYPE "public"."enum__product_items_v_version_product_status";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_product_items_product_status" AS ENUM('live', 'ready_to_sell');
  CREATE TYPE "public"."enum__product_items_v_version_product_status" AS ENUM('live', 'ready_to_sell');
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
  
  CREATE TABLE "product_items_use_cases" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "product_items_locales" (
  	"name" varchar,
  	"short_description" varchar,
  	"description" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
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
  
  CREATE TABLE "_product_items_v_version_use_cases" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_product_items_v_locales" (
  	"version_name" varchar,
  	"version_short_description" varchar,
  	"version_description" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "product_items" ADD COLUMN "product_status" "enum_product_items_product_status" DEFAULT 'live';
  ALTER TABLE "product_items" ADD COLUMN "is_new" boolean;
  ALTER TABLE "product_items" ADD COLUMN "image_id" integer;
  ALTER TABLE "_product_items_v" ADD COLUMN "version_product_status" "enum__product_items_v_version_product_status" DEFAULT 'live';
  ALTER TABLE "_product_items_v" ADD COLUMN "version_is_new" boolean;
  ALTER TABLE "_product_items_v" ADD COLUMN "version_image_id" integer;
  ALTER TABLE "product_items_features" ADD CONSTRAINT "product_items_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_items_suitable_for" ADD CONSTRAINT "product_items_suitable_for_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_items_use_cases" ADD CONSTRAINT "product_items_use_cases_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_items_locales" ADD CONSTRAINT "product_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_product_items_v_version_features" ADD CONSTRAINT "_product_items_v_version_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_product_items_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_product_items_v_version_suitable_for" ADD CONSTRAINT "_product_items_v_version_suitable_for_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_product_items_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_product_items_v_version_use_cases" ADD CONSTRAINT "_product_items_v_version_use_cases_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_product_items_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_product_items_v_locales" ADD CONSTRAINT "_product_items_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_product_items_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "product_items_features_order_idx" ON "product_items_features" USING btree ("_order");
  CREATE INDEX "product_items_features_parent_id_idx" ON "product_items_features" USING btree ("_parent_id");
  CREATE INDEX "product_items_features_locale_idx" ON "product_items_features" USING btree ("_locale");
  CREATE INDEX "product_items_suitable_for_order_idx" ON "product_items_suitable_for" USING btree ("_order");
  CREATE INDEX "product_items_suitable_for_parent_id_idx" ON "product_items_suitable_for" USING btree ("_parent_id");
  CREATE INDEX "product_items_suitable_for_locale_idx" ON "product_items_suitable_for" USING btree ("_locale");
  CREATE INDEX "product_items_use_cases_order_idx" ON "product_items_use_cases" USING btree ("_order");
  CREATE INDEX "product_items_use_cases_parent_id_idx" ON "product_items_use_cases" USING btree ("_parent_id");
  CREATE INDEX "product_items_use_cases_locale_idx" ON "product_items_use_cases" USING btree ("_locale");
  CREATE UNIQUE INDEX "product_items_locales_locale_parent_id_unique" ON "product_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_product_items_v_version_features_order_idx" ON "_product_items_v_version_features" USING btree ("_order");
  CREATE INDEX "_product_items_v_version_features_parent_id_idx" ON "_product_items_v_version_features" USING btree ("_parent_id");
  CREATE INDEX "_product_items_v_version_features_locale_idx" ON "_product_items_v_version_features" USING btree ("_locale");
  CREATE INDEX "_product_items_v_version_suitable_for_order_idx" ON "_product_items_v_version_suitable_for" USING btree ("_order");
  CREATE INDEX "_product_items_v_version_suitable_for_parent_id_idx" ON "_product_items_v_version_suitable_for" USING btree ("_parent_id");
  CREATE INDEX "_product_items_v_version_suitable_for_locale_idx" ON "_product_items_v_version_suitable_for" USING btree ("_locale");
  CREATE INDEX "_product_items_v_version_use_cases_order_idx" ON "_product_items_v_version_use_cases" USING btree ("_order");
  CREATE INDEX "_product_items_v_version_use_cases_parent_id_idx" ON "_product_items_v_version_use_cases" USING btree ("_parent_id");
  CREATE INDEX "_product_items_v_version_use_cases_locale_idx" ON "_product_items_v_version_use_cases" USING btree ("_locale");
  CREATE UNIQUE INDEX "_product_items_v_locales_locale_parent_id_unique" ON "_product_items_v_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "product_items" ADD CONSTRAINT "product_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_product_items_v" ADD CONSTRAINT "_product_items_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "product_items_image_idx" ON "product_items" USING btree ("image_id");
  CREATE INDEX "_product_items_v_version_version_image_idx" ON "_product_items_v" USING btree ("version_image_id");`)
}
