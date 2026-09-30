import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload }: MigrateUpArgs): Promise<void> {
  /*
   * Payload put the DROP TABLE first again, which would have taken every
   * article's title, summary and body before there was anywhere to put them.
   * Add, copy, count, then drop.
   */
  await db.execute(sql`
    ALTER TABLE "articles" ADD COLUMN "title_id" varchar;
    ALTER TABLE "articles" ADD COLUMN "title_en" varchar;
    ALTER TABLE "articles" ADD COLUMN "excerpt_id" varchar;
    ALTER TABLE "articles" ADD COLUMN "excerpt_en" varchar;
    ALTER TABLE "articles" ADD COLUMN "body_id" jsonb;
    ALTER TABLE "articles" ADD COLUMN "body_en" jsonb;
    ALTER TABLE "articles" ADD COLUMN "seo_title_id" varchar;
    ALTER TABLE "articles" ADD COLUMN "seo_title_en" varchar;
    ALTER TABLE "articles" ADD COLUMN "seo_description_id" varchar;
    ALTER TABLE "articles" ADD COLUMN "seo_description_en" varchar;
    ALTER TABLE "articles" ADD COLUMN "slug" varchar;
    ALTER TABLE "_articles_v" ADD COLUMN "version_title_id" varchar;
    ALTER TABLE "_articles_v" ADD COLUMN "version_title_en" varchar;
    ALTER TABLE "_articles_v" ADD COLUMN "version_excerpt_id" varchar;
    ALTER TABLE "_articles_v" ADD COLUMN "version_excerpt_en" varchar;
    ALTER TABLE "_articles_v" ADD COLUMN "version_body_id" jsonb;
    ALTER TABLE "_articles_v" ADD COLUMN "version_body_en" jsonb;
    ALTER TABLE "_articles_v" ADD COLUMN "version_seo_title_id" varchar;
    ALTER TABLE "_articles_v" ADD COLUMN "version_seo_title_en" varchar;
    ALTER TABLE "_articles_v" ADD COLUMN "version_seo_description_id" varchar;
    ALTER TABLE "_articles_v" ADD COLUMN "version_seo_description_en" varchar;
    ALTER TABLE "_articles_v" ADD COLUMN "version_slug" varchar;
  `)

  await db.execute(sql`
    UPDATE "articles" a SET
      "title_id" = i."title",
      "excerpt_id" = i."excerpt",
      "body_id" = i."body",
      "seo_title_id" = i."seo_title",
      "seo_description_id" = i."seo_description",
      "slug" = i."slug"
    FROM "articles_locales" i
    WHERE i."_parent_id" = a."id" AND i."_locale" = 'id';
  `)
  await db.execute(sql`
    UPDATE "articles" a SET
      "title_en" = e."title",
      "excerpt_en" = e."excerpt",
      "body_en" = e."body",
      "seo_title_en" = e."seo_title",
      "seo_description_en" = e."seo_description",
      "slug" = COALESCE(a."slug", e."slug")
    FROM "articles_locales" e
    WHERE e."_parent_id" = a."id" AND e."_locale" = 'en';
  `)
  await db.execute(sql`
    UPDATE "_articles_v" v SET
      "version_title_id" = i."version_title",
      "version_excerpt_id" = i."version_excerpt",
      "version_body_id" = i."version_body",
      "version_seo_title_id" = i."version_seo_title",
      "version_seo_description_id" = i."version_seo_description",
      "version_slug" = i."version_slug"
    FROM "_articles_v_locales" i
    WHERE i."_parent_id" = v."id" AND i."_locale" = 'id';
  `)
  await db.execute(sql`
    UPDATE "_articles_v" v SET
      "version_title_en" = e."version_title",
      "version_excerpt_en" = e."version_excerpt",
      "version_body_en" = e."version_body",
      "version_seo_title_en" = e."version_seo_title",
      "version_seo_description_en" = e."version_seo_description",
      "version_slug" = COALESCE(v."version_slug", e."version_slug")
    FROM "_articles_v_locales" e
    WHERE e."_parent_id" = v."id" AND e."_locale" = 'en';
  `)

  const moved = await db.execute(sql`
    SELECT count(*) AS articles,
           count("title_id") AS id_titles,
           count("title_en") AS en_titles,
           count("body_id")  AS id_bodies,
           count("body_en")  AS en_bodies,
           count("slug")     AS slugs
      FROM "articles";
  `)
  payload.logger.info(`Articles carried across: ${JSON.stringify(moved.rows[0])}`)

  await db.execute(sql`
    DROP TABLE "articles_locales" CASCADE;
    DROP TABLE "_articles_v_locales" CASCADE;
    CREATE INDEX "articles_slug_idx" ON "articles" USING btree ("slug");
    CREATE INDEX "_articles_v_version_version_slug_idx" ON "_articles_v" USING btree ("version_slug");
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "articles_locales" (
  	"title" varchar,
  	"excerpt" varchar,
  	"body" jsonb,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"slug" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_articles_v_locales" (
  	"version_title" varchar,
  	"version_excerpt" varchar,
  	"version_body" jsonb,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_slug" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  DROP INDEX "articles_slug_idx";
  DROP INDEX "_articles_v_version_version_slug_idx";
  ALTER TABLE "articles_locales" ADD CONSTRAINT "articles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_locales" ADD CONSTRAINT "_articles_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "articles_slug_idx" ON "articles_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "articles_locales_locale_parent_id_unique" ON "articles_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_articles_v_version_version_slug_idx" ON "_articles_v_locales" USING btree ("version_slug","_locale");
  CREATE UNIQUE INDEX "_articles_v_locales_locale_parent_id_unique" ON "_articles_v_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "articles" DROP COLUMN "title_id";
  ALTER TABLE "articles" DROP COLUMN "title_en";
  ALTER TABLE "articles" DROP COLUMN "excerpt_id";
  ALTER TABLE "articles" DROP COLUMN "excerpt_en";
  ALTER TABLE "articles" DROP COLUMN "body_id";
  ALTER TABLE "articles" DROP COLUMN "body_en";
  ALTER TABLE "articles" DROP COLUMN "seo_title_id";
  ALTER TABLE "articles" DROP COLUMN "seo_title_en";
  ALTER TABLE "articles" DROP COLUMN "seo_description_id";
  ALTER TABLE "articles" DROP COLUMN "seo_description_en";
  ALTER TABLE "articles" DROP COLUMN "slug";
  ALTER TABLE "_articles_v" DROP COLUMN "version_title_id";
  ALTER TABLE "_articles_v" DROP COLUMN "version_title_en";
  ALTER TABLE "_articles_v" DROP COLUMN "version_excerpt_id";
  ALTER TABLE "_articles_v" DROP COLUMN "version_excerpt_en";
  ALTER TABLE "_articles_v" DROP COLUMN "version_body_id";
  ALTER TABLE "_articles_v" DROP COLUMN "version_body_en";
  ALTER TABLE "_articles_v" DROP COLUMN "version_seo_title_id";
  ALTER TABLE "_articles_v" DROP COLUMN "version_seo_title_en";
  ALTER TABLE "_articles_v" DROP COLUMN "version_seo_description_id";
  ALTER TABLE "_articles_v" DROP COLUMN "version_seo_description_en";
  ALTER TABLE "_articles_v" DROP COLUMN "version_slug";`)
}
