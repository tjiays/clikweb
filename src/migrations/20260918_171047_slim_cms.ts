import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Slims the CMS to seven collections.
 *
 * Page copy, imagery and the structural lists moved into src/content/, so the
 * collections that held them are dropped. What remains is what a
 * non-technical person publishes on their own schedule: articles, reports,
 * job vacancies, product items, contact submissions, users and the audit log.
 *
 * Written by hand rather than generated: the generator read the dropped
 * enums as renames of the new category enums, which would have mangled the
 * data instead of replacing it.
 *
 * The category on job openings and product items becomes a text column
 * holding a fixed slug, replacing a foreign key to a collection that no
 * longer exists. Existing values are carried across by name before the old
 * tables go.
 */

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // --- 1. Carry the category slugs onto the rows that keep them ---
  await db.execute(sql`
    ALTER TABLE "job_openings" ADD COLUMN IF NOT EXISTS "category" varchar;
    ALTER TABLE "_job_openings_v" ADD COLUMN IF NOT EXISTS "version_category" varchar;
    ALTER TABLE "product_items" ADD COLUMN IF NOT EXISTS "category" varchar;
    ALTER TABLE "_product_items_v" ADD COLUMN IF NOT EXISTS "version_category" varchar;
  `)

  // Job categories were a relationship; map the stored name to its slug.
  await db.execute(sql`
    UPDATE "job_openings" j SET "category" =
      lower(regexp_replace(regexp_replace(l."name", ' & ', '-', 'g'), '\\s+', '-', 'g'))
    FROM "job_categories_locales" l
    WHERE l."_parent_id" = j."category_id" AND l."_locale" = 'id' AND j."category" IS NULL;
  `)

  await db.execute(sql`
    UPDATE "product_items" p SET "category" = l."slug"
    FROM "product_categories_locales" l
    WHERE l."_parent_id" = p."category_id" AND l."_locale" = 'id' AND p."category" IS NULL;
  `)

  // --- 2. Drop the foreign keys and columns that pointed at them ---
  await db.execute(sql`
    ALTER TABLE "job_openings" DROP COLUMN IF EXISTS "category_id";
    ALTER TABLE "_job_openings_v" DROP COLUMN IF EXISTS "version_category_id";
    ALTER TABLE "product_items" DROP COLUMN IF EXISTS "category_id";
    ALTER TABLE "_product_items_v" DROP COLUMN IF EXISTS "version_category_id";
  `)

  // Articles kept a byline, not a relationship.
  await db.execute(sql`
    ALTER TABLE "articles" ADD COLUMN IF NOT EXISTS "author" varchar;
    ALTER TABLE "_articles_v" ADD COLUMN IF NOT EXISTS "version_author" varchar;
    UPDATE "articles" a SET "author" = au."name"
      FROM "authors" au WHERE au."id" = a."author_id" AND a."author" IS NULL;
    ALTER TABLE "articles" DROP COLUMN IF EXISTS "author_id";
    ALTER TABLE "_articles_v" DROP COLUMN IF EXISTS "version_author_id";
  `)

  // --- 3. Drop the collections that moved into code ---
  await db.execute(sql`
  DROP TABLE IF EXISTS "_authors_v" CASCADE;
  DROP TABLE IF EXISTS "_career_page_v" CASCADE;
  DROP TABLE IF EXISTS "_career_page_v_locales" CASCADE;
  DROP TABLE IF EXISTS "_career_page_v_version_benefits" CASCADE;
  DROP TABLE IF EXISTS "_career_page_v_version_benefits_locales" CASCADE;
  DROP TABLE IF EXISTS "_career_page_v_version_hero_images" CASCADE;
  DROP TABLE IF EXISTS "_career_page_v_version_recruitment_steps" CASCADE;
  DROP TABLE IF EXISTS "_career_page_v_version_recruitment_steps_locales" CASCADE;
  DROP TABLE IF EXISTS "_career_page_v_version_values" CASCADE;
  DROP TABLE IF EXISTS "_career_page_v_version_values_locales" CASCADE;
  DROP TABLE IF EXISTS "_cta_blocks_v" CASCADE;
  DROP TABLE IF EXISTS "_cta_blocks_v_locales" CASCADE;
  DROP TABLE IF EXISTS "_hero_slides_v" CASCADE;
  DROP TABLE IF EXISTS "_hero_slides_v_locales" CASCADE;
  DROP TABLE IF EXISTS "_home_settings_v" CASCADE;
  DROP TABLE IF EXISTS "_home_settings_v_locales" CASCADE;
  DROP TABLE IF EXISTS "_job_categories_v" CASCADE;
  DROP TABLE IF EXISTS "_job_categories_v_locales" CASCADE;
  DROP TABLE IF EXISTS "_milestones_v" CASCADE;
  DROP TABLE IF EXISTS "_milestones_v_version_items" CASCADE;
  DROP TABLE IF EXISTS "_milestones_v_version_items_locales" CASCADE;
  DROP TABLE IF EXISTS "_page_content_v" CASCADE;
  DROP TABLE IF EXISTS "_page_content_v_locales" CASCADE;
  DROP TABLE IF EXISTS "_page_content_v_version_sections" CASCADE;
  DROP TABLE IF EXISTS "_page_content_v_version_sections_locales" CASCADE;
  DROP TABLE IF EXISTS "_partner_logos_v" CASCADE;
  DROP TABLE IF EXISTS "_product_categories_v" CASCADE;
  DROP TABLE IF EXISTS "_product_categories_v_locales" CASCADE;
  DROP TABLE IF EXISTS "_product_categories_v_version_advantages" CASCADE;
  DROP TABLE IF EXISTS "_product_categories_v_version_advantages_locales" CASCADE;
  DROP TABLE IF EXISTS "_static_pages_v" CASCADE;
  DROP TABLE IF EXISTS "_static_pages_v_locales" CASCADE;
  DROP TABLE IF EXISTS "_static_pages_v_version_attachments" CASCADE;
  DROP TABLE IF EXISTS "_static_pages_v_version_attachments_locales" CASCADE;
  DROP TABLE IF EXISTS "_stats_v" CASCADE;
  DROP TABLE IF EXISTS "_stats_v_locales" CASCADE;
  DROP TABLE IF EXISTS "_testimonials_v" CASCADE;
  DROP TABLE IF EXISTS "_testimonials_v_locales" CASCADE;
  DROP TABLE IF EXISTS "authors" CASCADE;
  DROP TABLE IF EXISTS "career_page" CASCADE;
  DROP TABLE IF EXISTS "career_page_benefits" CASCADE;
  DROP TABLE IF EXISTS "career_page_benefits_locales" CASCADE;
  DROP TABLE IF EXISTS "career_page_hero_images" CASCADE;
  DROP TABLE IF EXISTS "career_page_locales" CASCADE;
  DROP TABLE IF EXISTS "career_page_recruitment_steps" CASCADE;
  DROP TABLE IF EXISTS "career_page_recruitment_steps_locales" CASCADE;
  DROP TABLE IF EXISTS "career_page_values" CASCADE;
  DROP TABLE IF EXISTS "career_page_values_locales" CASCADE;
  DROP TABLE IF EXISTS "cta_blocks" CASCADE;
  DROP TABLE IF EXISTS "cta_blocks_locales" CASCADE;
  DROP TABLE IF EXISTS "hero_slides" CASCADE;
  DROP TABLE IF EXISTS "hero_slides_locales" CASCADE;
  DROP TABLE IF EXISTS "home_settings" CASCADE;
  DROP TABLE IF EXISTS "home_settings_locales" CASCADE;
  DROP TABLE IF EXISTS "job_categories" CASCADE;
  DROP TABLE IF EXISTS "job_categories_locales" CASCADE;
  DROP TABLE IF EXISTS "milestones" CASCADE;
  DROP TABLE IF EXISTS "milestones_items" CASCADE;
  DROP TABLE IF EXISTS "milestones_items_locales" CASCADE;
  DROP TABLE IF EXISTS "page_content" CASCADE;
  DROP TABLE IF EXISTS "page_content_locales" CASCADE;
  DROP TABLE IF EXISTS "page_content_sections" CASCADE;
  DROP TABLE IF EXISTS "page_content_sections_locales" CASCADE;
  DROP TABLE IF EXISTS "partner_logos" CASCADE;
  DROP TABLE IF EXISTS "product_categories" CASCADE;
  DROP TABLE IF EXISTS "product_categories_advantages" CASCADE;
  DROP TABLE IF EXISTS "product_categories_advantages_locales" CASCADE;
  DROP TABLE IF EXISTS "product_categories_locales" CASCADE;
  DROP TABLE IF EXISTS "site_settings" CASCADE;
  DROP TABLE IF EXISTS "site_settings_locales" CASCADE;
  DROP TABLE IF EXISTS "site_settings_social_links" CASCADE;
  DROP TABLE IF EXISTS "static_pages" CASCADE;
  DROP TABLE IF EXISTS "static_pages_attachments" CASCADE;
  DROP TABLE IF EXISTS "static_pages_attachments_locales" CASCADE;
  DROP TABLE IF EXISTS "static_pages_locales" CASCADE;
  DROP TABLE IF EXISTS "stats" CASCADE;
  DROP TABLE IF EXISTS "stats_locales" CASCADE;
  DROP TABLE IF EXISTS "testimonials" CASCADE;
  DROP TABLE IF EXISTS "testimonials_locales" CASCADE;
  `)
}

export async function down(): Promise<void> {
  // Not reversible: the content these tables held now lives in src/content/
  // and in git. Restore from a backup taken before this migration ran.
  throw new Error(
    'slim_cms cannot be rolled back automatically. Restore from a database backup.',
  )
}
