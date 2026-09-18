import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "media_outlets" ADD COLUMN IF NOT EXISTS "slug" varchar;
  ALTER TABLE "_media_outlets_v" ADD COLUMN IF NOT EXISTS "version_slug" varchar;
  UPDATE "media_outlets" m SET "slug" = l."slug"
    FROM "media_outlets_locales" l
    WHERE l."_parent_id" = m."id" AND l."_locale" = 'id' AND m."slug" IS NULL;
  UPDATE "_media_outlets_v" v SET "version_slug" = l."version_slug"
    FROM "_media_outlets_v_locales" l
    WHERE l."_parent_id" = v."id" AND l."_locale" = 'id' AND v."version_slug" IS NULL;

   ALTER TABLE "media_outlets_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_media_outlets_v_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "media_outlets_locales" CASCADE;
  DROP TABLE "_media_outlets_v_locales" CASCADE;
  ALTER TABLE "media_outlets" ADD COLUMN IF NOT EXISTS "slug" varchar;
  ALTER TABLE "_media_outlets_v" ADD COLUMN IF NOT EXISTS "version_slug" varchar;
  CREATE INDEX "media_outlets_slug_idx" ON "media_outlets" USING btree ("slug");
  CREATE INDEX "_media_outlets_v_version_version_slug_idx" ON "_media_outlets_v" USING btree ("version_slug");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "media_outlets_locales" (
  	"slug" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_media_outlets_v_locales" (
  	"version_slug" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  DROP INDEX "media_outlets_slug_idx";
  DROP INDEX "_media_outlets_v_version_version_slug_idx";
  ALTER TABLE "media_outlets_locales" ADD CONSTRAINT "media_outlets_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media_outlets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_media_outlets_v_locales" ADD CONSTRAINT "_media_outlets_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_media_outlets_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "media_outlets_slug_idx" ON "media_outlets_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "media_outlets_locales_locale_parent_id_unique" ON "media_outlets_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_media_outlets_v_version_version_slug_idx" ON "_media_outlets_v_locales" USING btree ("version_slug","_locale");
  CREATE UNIQUE INDEX "_media_outlets_v_locales_locale_parent_id_unique" ON "_media_outlets_v_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "media_outlets" DROP COLUMN "slug";
  ALTER TABLE "_media_outlets_v" DROP COLUMN "version_slug";`)
}
