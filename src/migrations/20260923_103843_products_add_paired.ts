import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_product_items_statuses" AS ENUM('live', 'ready_to_sell', 'new');
  CREATE TYPE "public"."enum__product_items_v_version_statuses" AS ENUM('live', 'ready_to_sell', 'new');
  CREATE TABLE "product_items_statuses" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_product_items_statuses",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "product_items_features_id" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "product_items_features_en" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "product_items_suitable_for_id" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "product_items_suitable_for_en" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "product_items_use_cases_id" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "product_items_use_cases_en" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "_product_items_v_version_statuses" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__product_items_v_version_statuses",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_product_items_v_version_features_id" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_product_items_v_version_features_en" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_product_items_v_version_suitable_for_id" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_product_items_v_version_suitable_for_en" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_product_items_v_version_use_cases_id" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_product_items_v_version_use_cases_en" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  ALTER TABLE "product_items" ADD COLUMN "name_id" varchar;
  ALTER TABLE "product_items" ADD COLUMN "name_en" varchar;
  ALTER TABLE "product_items" ADD COLUMN "short_description_id" varchar;
  ALTER TABLE "product_items" ADD COLUMN "short_description_en" varchar;
  ALTER TABLE "product_items" ADD COLUMN "description_id" jsonb;
  ALTER TABLE "product_items" ADD COLUMN "description_en" jsonb;
  ALTER TABLE "_product_items_v" ADD COLUMN "version_name_id" varchar;
  ALTER TABLE "_product_items_v" ADD COLUMN "version_name_en" varchar;
  ALTER TABLE "_product_items_v" ADD COLUMN "version_short_description_id" varchar;
  ALTER TABLE "_product_items_v" ADD COLUMN "version_short_description_en" varchar;
  ALTER TABLE "_product_items_v" ADD COLUMN "version_description_id" jsonb;
  ALTER TABLE "_product_items_v" ADD COLUMN "version_description_en" jsonb;
  ALTER TABLE "product_items_statuses" ADD CONSTRAINT "product_items_statuses_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."product_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_items_features_id" ADD CONSTRAINT "product_items_features_id_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_items_features_en" ADD CONSTRAINT "product_items_features_en_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_items_suitable_for_id" ADD CONSTRAINT "product_items_suitable_for_id_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_items_suitable_for_en" ADD CONSTRAINT "product_items_suitable_for_en_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_items_use_cases_id" ADD CONSTRAINT "product_items_use_cases_id_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_items_use_cases_en" ADD CONSTRAINT "product_items_use_cases_en_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_product_items_v_version_statuses" ADD CONSTRAINT "_product_items_v_version_statuses_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_product_items_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_product_items_v_version_features_id" ADD CONSTRAINT "_product_items_v_version_features_id_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_product_items_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_product_items_v_version_features_en" ADD CONSTRAINT "_product_items_v_version_features_en_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_product_items_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_product_items_v_version_suitable_for_id" ADD CONSTRAINT "_product_items_v_version_suitable_for_id_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_product_items_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_product_items_v_version_suitable_for_en" ADD CONSTRAINT "_product_items_v_version_suitable_for_en_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_product_items_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_product_items_v_version_use_cases_id" ADD CONSTRAINT "_product_items_v_version_use_cases_id_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_product_items_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_product_items_v_version_use_cases_en" ADD CONSTRAINT "_product_items_v_version_use_cases_en_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_product_items_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "product_items_statuses_order_idx" ON "product_items_statuses" USING btree ("order");
  CREATE INDEX "product_items_statuses_parent_idx" ON "product_items_statuses" USING btree ("parent_id");
  CREATE INDEX "product_items_features_id_order_idx" ON "product_items_features_id" USING btree ("_order");
  CREATE INDEX "product_items_features_id_parent_id_idx" ON "product_items_features_id" USING btree ("_parent_id");
  CREATE INDEX "product_items_features_en_order_idx" ON "product_items_features_en" USING btree ("_order");
  CREATE INDEX "product_items_features_en_parent_id_idx" ON "product_items_features_en" USING btree ("_parent_id");
  CREATE INDEX "product_items_suitable_for_id_order_idx" ON "product_items_suitable_for_id" USING btree ("_order");
  CREATE INDEX "product_items_suitable_for_id_parent_id_idx" ON "product_items_suitable_for_id" USING btree ("_parent_id");
  CREATE INDEX "product_items_suitable_for_en_order_idx" ON "product_items_suitable_for_en" USING btree ("_order");
  CREATE INDEX "product_items_suitable_for_en_parent_id_idx" ON "product_items_suitable_for_en" USING btree ("_parent_id");
  CREATE INDEX "product_items_use_cases_id_order_idx" ON "product_items_use_cases_id" USING btree ("_order");
  CREATE INDEX "product_items_use_cases_id_parent_id_idx" ON "product_items_use_cases_id" USING btree ("_parent_id");
  CREATE INDEX "product_items_use_cases_en_order_idx" ON "product_items_use_cases_en" USING btree ("_order");
  CREATE INDEX "product_items_use_cases_en_parent_id_idx" ON "product_items_use_cases_en" USING btree ("_parent_id");
  CREATE INDEX "_product_items_v_version_statuses_order_idx" ON "_product_items_v_version_statuses" USING btree ("order");
  CREATE INDEX "_product_items_v_version_statuses_parent_idx" ON "_product_items_v_version_statuses" USING btree ("parent_id");
  CREATE INDEX "_product_items_v_version_features_id_order_idx" ON "_product_items_v_version_features_id" USING btree ("_order");
  CREATE INDEX "_product_items_v_version_features_id_parent_id_idx" ON "_product_items_v_version_features_id" USING btree ("_parent_id");
  CREATE INDEX "_product_items_v_version_features_en_order_idx" ON "_product_items_v_version_features_en" USING btree ("_order");
  CREATE INDEX "_product_items_v_version_features_en_parent_id_idx" ON "_product_items_v_version_features_en" USING btree ("_parent_id");
  CREATE INDEX "_product_items_v_version_suitable_for_id_order_idx" ON "_product_items_v_version_suitable_for_id" USING btree ("_order");
  CREATE INDEX "_product_items_v_version_suitable_for_id_parent_id_idx" ON "_product_items_v_version_suitable_for_id" USING btree ("_parent_id");
  CREATE INDEX "_product_items_v_version_suitable_for_en_order_idx" ON "_product_items_v_version_suitable_for_en" USING btree ("_order");
  CREATE INDEX "_product_items_v_version_suitable_for_en_parent_id_idx" ON "_product_items_v_version_suitable_for_en" USING btree ("_parent_id");
  CREATE INDEX "_product_items_v_version_use_cases_id_order_idx" ON "_product_items_v_version_use_cases_id" USING btree ("_order");
  CREATE INDEX "_product_items_v_version_use_cases_id_parent_id_idx" ON "_product_items_v_version_use_cases_id" USING btree ("_parent_id");
  CREATE INDEX "_product_items_v_version_use_cases_en_order_idx" ON "_product_items_v_version_use_cases_en" USING btree ("_order");
  CREATE INDEX "_product_items_v_version_use_cases_en_parent_id_idx" ON "_product_items_v_version_use_cases_en" USING btree ("_parent_id");`)

  /*
   * Carry the content across while both shapes exist. The old fields stay
   * until the follow-up migration drops them, so this is reversible and the
   * site keeps working in between.
   */
  for (const [main, loc] of [
    ['product_items', 'product_items_locales'],
    ['_product_items_v', '_product_items_v_locales'],
  ] as const) {
    const p = main === 'product_items' ? '' : 'version_'
    for (const lang of ['id', 'en'] as const) {
      await db.execute(sql`
        UPDATE ${sql.raw(`"${main}"`)} m SET
          ${sql.raw(`"${p}name_${lang}"`)}              = l.${sql.raw(`"${p}name"`)},
          ${sql.raw(`"${p}short_description_${lang}"`)} = l.${sql.raw(`"${p}short_description"`)},
          ${sql.raw(`"${p}description_${lang}"`)}       = l.${sql.raw(`"${p}description"`)}
        FROM ${sql.raw(`"${loc}"`)} l
        WHERE l."_parent_id" = m."id" AND l."_locale" = ${lang};
      `)
    }
  }

  // The three lists: each locale's rows become that language's table.
  for (const src of [
    'product_items_features',
    'product_items_suitable_for',
    'product_items_use_cases',
    '_product_items_v_version_features',
    '_product_items_v_version_suitable_for',
    '_product_items_v_version_use_cases',
  ] as const) {
    for (const lang of ['id', 'en'] as const) {
      await db.execute(sql`
        INSERT INTO ${sql.raw(`"${src}_${lang}"`)} ("_order", "_parent_id", "id", "label")
        SELECT "_order", "_parent_id", "id", "label"
          FROM ${sql.raw(`"${src}"`)} WHERE "_locale" = ${lang};
      `)
    }
  }

  /*
   * Status becomes a list: the sellable state first, then NEW where it was
   * ticked, which is the order the badges are drawn in.
   */
  await db.execute(sql`
    INSERT INTO "product_items_statuses" ("order", "parent_id", "value")
    SELECT 1, "id", "product_status"::text::"enum_product_items_statuses" FROM "product_items"
     WHERE "product_status" IS NOT NULL;
  `)
  await db.execute(sql`
    INSERT INTO "product_items_statuses" ("order", "parent_id", "value")
    SELECT 2, "id", 'new'::"enum_product_items_statuses" FROM "product_items" WHERE "is_new" IS TRUE;
  `)
  await db.execute(sql`
    INSERT INTO "_product_items_v_version_statuses" ("order", "parent_id", "value")
    SELECT 1, "id", "version_product_status"::text::"enum__product_items_v_version_statuses" FROM "_product_items_v"
     WHERE "version_product_status" IS NOT NULL;
  `)
  await db.execute(sql`
    INSERT INTO "_product_items_v_version_statuses" ("order", "parent_id", "value")
    SELECT 2, "id", 'new'::"enum__product_items_v_version_statuses" FROM "_product_items_v" WHERE "version_is_new" IS TRUE;
  `)

  const moved = await db.execute(sql`
    SELECT count("name_id") AS id_names, count("name_en") AS en_names,
           (SELECT count(*) FROM "product_items_statuses") AS status_rows,
           (SELECT count(*) FROM "product_items_features_id") AS features_id,
           (SELECT count(*) FROM "product_items_features_en") AS features_en
      FROM "product_items";
  `)
  payload.logger.info(`Products carried across: ${JSON.stringify(moved.rows[0])}`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "product_items_statuses" CASCADE;
  DROP TABLE "product_items_features_id" CASCADE;
  DROP TABLE "product_items_features_en" CASCADE;
  DROP TABLE "product_items_suitable_for_id" CASCADE;
  DROP TABLE "product_items_suitable_for_en" CASCADE;
  DROP TABLE "product_items_use_cases_id" CASCADE;
  DROP TABLE "product_items_use_cases_en" CASCADE;
  DROP TABLE "_product_items_v_version_statuses" CASCADE;
  DROP TABLE "_product_items_v_version_features_id" CASCADE;
  DROP TABLE "_product_items_v_version_features_en" CASCADE;
  DROP TABLE "_product_items_v_version_suitable_for_id" CASCADE;
  DROP TABLE "_product_items_v_version_suitable_for_en" CASCADE;
  DROP TABLE "_product_items_v_version_use_cases_id" CASCADE;
  DROP TABLE "_product_items_v_version_use_cases_en" CASCADE;
  ALTER TABLE "product_items" DROP COLUMN "name_id";
  ALTER TABLE "product_items" DROP COLUMN "name_en";
  ALTER TABLE "product_items" DROP COLUMN "short_description_id";
  ALTER TABLE "product_items" DROP COLUMN "short_description_en";
  ALTER TABLE "product_items" DROP COLUMN "description_id";
  ALTER TABLE "product_items" DROP COLUMN "description_en";
  ALTER TABLE "_product_items_v" DROP COLUMN "version_name_id";
  ALTER TABLE "_product_items_v" DROP COLUMN "version_name_en";
  ALTER TABLE "_product_items_v" DROP COLUMN "version_short_description_id";
  ALTER TABLE "_product_items_v" DROP COLUMN "version_short_description_en";
  ALTER TABLE "_product_items_v" DROP COLUMN "version_description_id";
  ALTER TABLE "_product_items_v" DROP COLUMN "version_description_en";
  DROP TYPE "public"."enum_product_items_statuses";
  DROP TYPE "public"."enum__product_items_v_version_statuses";`)
}
