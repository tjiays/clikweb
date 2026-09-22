import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload }: MigrateUpArgs): Promise<void> {
  /*
   * Order matters more than usual here. Payload generated this migration with
   * the DROP TABLE first, which would have taken every report's title,
   * summary and body with it — the financial statements included, since those
   * now live in the body. So: add the columns, carry the content across, and
   * only then drop the locale tables.
   */
  await db.execute(sql`
    ALTER TABLE "reports" ADD COLUMN "title_id" varchar;
    ALTER TABLE "reports" ADD COLUMN "title_en" varchar;
    ALTER TABLE "reports" ADD COLUMN "excerpt_id" varchar;
    ALTER TABLE "reports" ADD COLUMN "excerpt_en" varchar;
    ALTER TABLE "reports" ADD COLUMN "body_id" jsonb;
    ALTER TABLE "reports" ADD COLUMN "body_en" jsonb;
    ALTER TABLE "reports" ADD COLUMN "slug" varchar;
    ALTER TABLE "_reports_v" ADD COLUMN "version_title_id" varchar;
    ALTER TABLE "_reports_v" ADD COLUMN "version_title_en" varchar;
    ALTER TABLE "_reports_v" ADD COLUMN "version_excerpt_id" varchar;
    ALTER TABLE "_reports_v" ADD COLUMN "version_excerpt_en" varchar;
    ALTER TABLE "_reports_v" ADD COLUMN "version_body_id" jsonb;
    ALTER TABLE "_reports_v" ADD COLUMN "version_body_en" jsonb;
    ALTER TABLE "_reports_v" ADD COLUMN "version_slug" varchar;
  `)

  // The published rows.
  await db.execute(sql`
    UPDATE "reports" r SET
      "title_id"   = i."title",
      "excerpt_id" = i."excerpt",
      "body_id"    = i."body",
      "slug"       = COALESCE(i."slug", e."slug")
    FROM "reports_locales" i
    LEFT JOIN "reports_locales" e ON e."_parent_id" = i."_parent_id" AND e."_locale" = 'en'
    WHERE i."_parent_id" = r."id" AND i."_locale" = 'id';
  `)
  await db.execute(sql`
    UPDATE "reports" r SET
      "title_en"   = e."title",
      "excerpt_en" = e."excerpt",
      "body_en"    = e."body",
      "slug"       = COALESCE(r."slug", e."slug")
    FROM "reports_locales" e
    WHERE e."_parent_id" = r."id" AND e."_locale" = 'en';
  `)

  // Every stored version, so history and the admin's draft both survive.
  await db.execute(sql`
    UPDATE "_reports_v" v SET
      "version_title_id"   = i."version_title",
      "version_excerpt_id" = i."version_excerpt",
      "version_body_id"    = i."version_body",
      "version_slug"       = i."version_slug"
    FROM "_reports_v_locales" i
    WHERE i."_parent_id" = v."id" AND i."_locale" = 'id';
  `)
  await db.execute(sql`
    UPDATE "_reports_v" v SET
      "version_title_en"   = e."version_title",
      "version_excerpt_en" = e."version_excerpt",
      "version_body_en"    = e."version_body",
      "version_slug"       = COALESCE(v."version_slug", e."version_slug")
    FROM "_reports_v_locales" e
    WHERE e."_parent_id" = v."id" AND e."_locale" = 'en';
  `)

  const moved = await db.execute(sql`
    SELECT count(*) FILTER (WHERE "title_id" IS NOT NULL) AS id_titles,
           count(*) FILTER (WHERE "title_en" IS NOT NULL) AS en_titles,
           count(*) FILTER (WHERE "body_id"  IS NOT NULL) AS id_bodies,
           count(*) FILTER (WHERE "body_en"  IS NOT NULL) AS en_bodies
      FROM "reports";
  `)
  payload.logger.info(`Reports carried across: ${JSON.stringify(moved.rows[0])}`)

  await db.execute(sql`
    DROP TABLE "reports_locales" CASCADE;
    DROP TABLE "_reports_v_locales" CASCADE;
    CREATE INDEX "reports_slug_idx" ON "reports" USING btree ("slug");
    CREATE INDEX "_reports_v_version_version_slug_idx" ON "_reports_v" USING btree ("version_slug");
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "reports_locales" (
  	"title" varchar,
  	"excerpt" varchar,
  	"body" jsonb,
  	"slug" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_reports_v_locales" (
  	"version_title" varchar,
  	"version_excerpt" varchar,
  	"version_body" jsonb,
  	"version_slug" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  DROP INDEX "reports_slug_idx";
  DROP INDEX "_reports_v_version_version_slug_idx";
  ALTER TABLE "reports_locales" ADD CONSTRAINT "reports_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."reports"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_reports_v_locales" ADD CONSTRAINT "_reports_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_reports_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "reports_slug_idx" ON "reports_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "reports_locales_locale_parent_id_unique" ON "reports_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_reports_v_version_version_slug_idx" ON "_reports_v_locales" USING btree ("version_slug","_locale");
  CREATE UNIQUE INDEX "_reports_v_locales_locale_parent_id_unique" ON "_reports_v_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "reports" DROP COLUMN "title_id";
  ALTER TABLE "reports" DROP COLUMN "title_en";
  ALTER TABLE "reports" DROP COLUMN "excerpt_id";
  ALTER TABLE "reports" DROP COLUMN "excerpt_en";
  ALTER TABLE "reports" DROP COLUMN "body_id";
  ALTER TABLE "reports" DROP COLUMN "body_en";
  ALTER TABLE "reports" DROP COLUMN "slug";
  ALTER TABLE "_reports_v" DROP COLUMN "version_title_id";
  ALTER TABLE "_reports_v" DROP COLUMN "version_title_en";
  ALTER TABLE "_reports_v" DROP COLUMN "version_excerpt_id";
  ALTER TABLE "_reports_v" DROP COLUMN "version_excerpt_en";
  ALTER TABLE "_reports_v" DROP COLUMN "version_body_id";
  ALTER TABLE "_reports_v" DROP COLUMN "version_body_en";
  ALTER TABLE "_reports_v" DROP COLUMN "version_slug";`)
}
