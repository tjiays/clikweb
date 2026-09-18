import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "articles" ADD COLUMN "is_sample" boolean DEFAULT false;
  ALTER TABLE "_articles_v" ADD COLUMN "version_is_sample" boolean DEFAULT false;
  ALTER TABLE "authors" ADD COLUMN "is_sample" boolean DEFAULT false;
  ALTER TABLE "_authors_v" ADD COLUMN "version_is_sample" boolean DEFAULT false;
  ALTER TABLE "media_outlets" ADD COLUMN "is_sample" boolean DEFAULT false;
  ALTER TABLE "_media_outlets_v" ADD COLUMN "version_is_sample" boolean DEFAULT false;
  ALTER TABLE "media_coverage" ADD COLUMN "is_sample" boolean DEFAULT false;
  ALTER TABLE "_media_coverage_v" ADD COLUMN "version_is_sample" boolean DEFAULT false;
  ALTER TABLE "reports" ADD COLUMN "is_sample" boolean DEFAULT false;
  ALTER TABLE "_reports_v" ADD COLUMN "version_is_sample" boolean DEFAULT false;
  ALTER TABLE "job_openings" ADD COLUMN "is_sample" boolean DEFAULT false;
  ALTER TABLE "_job_openings_v" ADD COLUMN "version_is_sample" boolean DEFAULT false;
  ALTER TABLE "job_categories" ADD COLUMN "is_sample" boolean DEFAULT false;
  ALTER TABLE "_job_categories_v" ADD COLUMN "version_is_sample" boolean DEFAULT false;
  ALTER TABLE "product_categories" ADD COLUMN "is_sample" boolean DEFAULT false;
  ALTER TABLE "_product_categories_v" ADD COLUMN "version_is_sample" boolean DEFAULT false;
  ALTER TABLE "product_items" ADD COLUMN "is_sample" boolean DEFAULT false;
  ALTER TABLE "_product_items_v" ADD COLUMN "version_is_sample" boolean DEFAULT false;
  ALTER TABLE "hero_slides" ADD COLUMN "is_sample" boolean DEFAULT false;
  ALTER TABLE "_hero_slides_v" ADD COLUMN "version_is_sample" boolean DEFAULT false;
  ALTER TABLE "stats" ADD COLUMN "is_sample" boolean DEFAULT false;
  ALTER TABLE "_stats_v" ADD COLUMN "version_is_sample" boolean DEFAULT false;
  ALTER TABLE "testimonials" ADD COLUMN "is_sample" boolean DEFAULT false;
  ALTER TABLE "_testimonials_v" ADD COLUMN "version_is_sample" boolean DEFAULT false;
  ALTER TABLE "milestones" ADD COLUMN "is_sample" boolean DEFAULT false;
  ALTER TABLE "_milestones_v" ADD COLUMN "version_is_sample" boolean DEFAULT false;
  ALTER TABLE "partner_logos" ADD COLUMN "is_sample" boolean DEFAULT false;
  ALTER TABLE "_partner_logos_v" ADD COLUMN "version_is_sample" boolean DEFAULT false;
  ALTER TABLE "cta_blocks" ADD COLUMN "is_sample" boolean DEFAULT false;
  ALTER TABLE "_cta_blocks_v" ADD COLUMN "version_is_sample" boolean DEFAULT false;
  ALTER TABLE "page_content" ADD COLUMN "is_sample" boolean DEFAULT false;
  ALTER TABLE "_page_content_v" ADD COLUMN "version_is_sample" boolean DEFAULT false;
  ALTER TABLE "static_pages" ADD COLUMN "is_sample" boolean DEFAULT false;
  ALTER TABLE "_static_pages_v" ADD COLUMN "version_is_sample" boolean DEFAULT false;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "articles" DROP COLUMN "is_sample";
  ALTER TABLE "_articles_v" DROP COLUMN "version_is_sample";
  ALTER TABLE "authors" DROP COLUMN "is_sample";
  ALTER TABLE "_authors_v" DROP COLUMN "version_is_sample";
  ALTER TABLE "media_outlets" DROP COLUMN "is_sample";
  ALTER TABLE "_media_outlets_v" DROP COLUMN "version_is_sample";
  ALTER TABLE "media_coverage" DROP COLUMN "is_sample";
  ALTER TABLE "_media_coverage_v" DROP COLUMN "version_is_sample";
  ALTER TABLE "reports" DROP COLUMN "is_sample";
  ALTER TABLE "_reports_v" DROP COLUMN "version_is_sample";
  ALTER TABLE "job_openings" DROP COLUMN "is_sample";
  ALTER TABLE "_job_openings_v" DROP COLUMN "version_is_sample";
  ALTER TABLE "job_categories" DROP COLUMN "is_sample";
  ALTER TABLE "_job_categories_v" DROP COLUMN "version_is_sample";
  ALTER TABLE "product_categories" DROP COLUMN "is_sample";
  ALTER TABLE "_product_categories_v" DROP COLUMN "version_is_sample";
  ALTER TABLE "product_items" DROP COLUMN "is_sample";
  ALTER TABLE "_product_items_v" DROP COLUMN "version_is_sample";
  ALTER TABLE "hero_slides" DROP COLUMN "is_sample";
  ALTER TABLE "_hero_slides_v" DROP COLUMN "version_is_sample";
  ALTER TABLE "stats" DROP COLUMN "is_sample";
  ALTER TABLE "_stats_v" DROP COLUMN "version_is_sample";
  ALTER TABLE "testimonials" DROP COLUMN "is_sample";
  ALTER TABLE "_testimonials_v" DROP COLUMN "version_is_sample";
  ALTER TABLE "milestones" DROP COLUMN "is_sample";
  ALTER TABLE "_milestones_v" DROP COLUMN "version_is_sample";
  ALTER TABLE "partner_logos" DROP COLUMN "is_sample";
  ALTER TABLE "_partner_logos_v" DROP COLUMN "version_is_sample";
  ALTER TABLE "cta_blocks" DROP COLUMN "is_sample";
  ALTER TABLE "_cta_blocks_v" DROP COLUMN "version_is_sample";
  ALTER TABLE "page_content" DROP COLUMN "is_sample";
  ALTER TABLE "_page_content_v" DROP COLUMN "version_is_sample";
  ALTER TABLE "static_pages" DROP COLUMN "is_sample";
  ALTER TABLE "_static_pages_v" DROP COLUMN "version_is_sample";`)
}
