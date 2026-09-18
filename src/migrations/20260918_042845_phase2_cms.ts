import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DO $$ BEGIN
    CREATE TYPE "public"."_locales" AS ENUM('id', 'en');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;

   CREATE TYPE "public"."enum_articles_approval_status" AS ENUM('draft', 'in_review', 'approved', 'rejected');
  CREATE TYPE "public"."enum_articles_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__articles_v_version_approval_status" AS ENUM('draft', 'in_review', 'approved', 'rejected');
  CREATE TYPE "public"."enum__articles_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__articles_v_published_locale" AS ENUM('id', 'en');
  CREATE TYPE "public"."enum_authors_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__authors_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__authors_v_published_locale" AS ENUM('id', 'en');
  CREATE TYPE "public"."enum_media_outlets_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__media_outlets_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__media_outlets_v_published_locale" AS ENUM('id', 'en');
  CREATE TYPE "public"."enum_media_coverage_approval_status" AS ENUM('draft', 'in_review', 'approved', 'rejected');
  CREATE TYPE "public"."enum_media_coverage_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__media_coverage_v_version_approval_status" AS ENUM('draft', 'in_review', 'approved', 'rejected');
  CREATE TYPE "public"."enum__media_coverage_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__media_coverage_v_published_locale" AS ENUM('id', 'en');
  CREATE TYPE "public"."enum_reports_type" AS ENUM('annual_report', 'business_development');
  CREATE TYPE "public"."enum_reports_approval_status" AS ENUM('draft', 'in_review', 'approved', 'rejected');
  CREATE TYPE "public"."enum_reports_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__reports_v_version_type" AS ENUM('annual_report', 'business_development');
  CREATE TYPE "public"."enum__reports_v_version_approval_status" AS ENUM('draft', 'in_review', 'approved', 'rejected');
  CREATE TYPE "public"."enum__reports_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__reports_v_published_locale" AS ENUM('id', 'en');
  CREATE TYPE "public"."enum_job_openings_approval_status" AS ENUM('draft', 'in_review', 'approved', 'rejected');
  CREATE TYPE "public"."enum_job_openings_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__job_openings_v_version_approval_status" AS ENUM('draft', 'in_review', 'approved', 'rejected');
  CREATE TYPE "public"."enum__job_openings_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__job_openings_v_published_locale" AS ENUM('id', 'en');
  CREATE TYPE "public"."enum_job_categories_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__job_categories_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__job_categories_v_published_locale" AS ENUM('id', 'en');
  CREATE TYPE "public"."enum_product_categories_approval_status" AS ENUM('draft', 'in_review', 'approved', 'rejected');
  CREATE TYPE "public"."enum_product_categories_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__product_categories_v_version_approval_status" AS ENUM('draft', 'in_review', 'approved', 'rejected');
  CREATE TYPE "public"."enum__product_categories_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__product_categories_v_published_locale" AS ENUM('id', 'en');
  CREATE TYPE "public"."enum_product_items_product_status" AS ENUM('live', 'ready_to_sell');
  CREATE TYPE "public"."enum_product_items_approval_status" AS ENUM('draft', 'in_review', 'approved', 'rejected');
  CREATE TYPE "public"."enum_product_items_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__product_items_v_version_product_status" AS ENUM('live', 'ready_to_sell');
  CREATE TYPE "public"."enum__product_items_v_version_approval_status" AS ENUM('draft', 'in_review', 'approved', 'rejected');
  CREATE TYPE "public"."enum__product_items_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__product_items_v_published_locale" AS ENUM('id', 'en');
  CREATE TYPE "public"."enum_hero_slides_approval_status" AS ENUM('draft', 'in_review', 'approved', 'rejected');
  CREATE TYPE "public"."enum_hero_slides_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__hero_slides_v_version_approval_status" AS ENUM('draft', 'in_review', 'approved', 'rejected');
  CREATE TYPE "public"."enum__hero_slides_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__hero_slides_v_published_locale" AS ENUM('id', 'en');
  CREATE TYPE "public"."enum_stats_approval_status" AS ENUM('draft', 'in_review', 'approved', 'rejected');
  CREATE TYPE "public"."enum_stats_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__stats_v_version_approval_status" AS ENUM('draft', 'in_review', 'approved', 'rejected');
  CREATE TYPE "public"."enum__stats_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__stats_v_published_locale" AS ENUM('id', 'en');
  CREATE TYPE "public"."enum_testimonials_approval_status" AS ENUM('draft', 'in_review', 'approved', 'rejected');
  CREATE TYPE "public"."enum_testimonials_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__testimonials_v_version_approval_status" AS ENUM('draft', 'in_review', 'approved', 'rejected');
  CREATE TYPE "public"."enum__testimonials_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__testimonials_v_published_locale" AS ENUM('id', 'en');
  CREATE TYPE "public"."enum_milestones_approval_status" AS ENUM('draft', 'in_review', 'approved', 'rejected');
  CREATE TYPE "public"."enum_milestones_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__milestones_v_version_approval_status" AS ENUM('draft', 'in_review', 'approved', 'rejected');
  CREATE TYPE "public"."enum__milestones_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__milestones_v_published_locale" AS ENUM('id', 'en');
  CREATE TYPE "public"."enum_partner_logos_group" AS ENUM('member', 'regulator', 'clik_member');
  CREATE TYPE "public"."enum_partner_logos_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__partner_logos_v_version_group" AS ENUM('member', 'regulator', 'clik_member');
  CREATE TYPE "public"."enum__partner_logos_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__partner_logos_v_published_locale" AS ENUM('id', 'en');
  CREATE TYPE "public"."enum_cta_blocks_page" AS ENUM('home', 'about', 'products', 'business-solution', 'credit-scoring');
  CREATE TYPE "public"."enum_cta_blocks_approval_status" AS ENUM('draft', 'in_review', 'approved', 'rejected');
  CREATE TYPE "public"."enum_cta_blocks_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__cta_blocks_v_version_page" AS ENUM('home', 'about', 'products', 'business-solution', 'credit-scoring');
  CREATE TYPE "public"."enum__cta_blocks_v_version_approval_status" AS ENUM('draft', 'in_review', 'approved', 'rejected');
  CREATE TYPE "public"."enum__cta_blocks_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__cta_blocks_v_published_locale" AS ENUM('id', 'en');
  CREATE TYPE "public"."enum_page_content_page" AS ENUM('about', 'products', 'business-solution', 'credit-scoring');
  CREATE TYPE "public"."enum_page_content_approval_status" AS ENUM('draft', 'in_review', 'approved', 'rejected');
  CREATE TYPE "public"."enum_page_content_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__page_content_v_version_page" AS ENUM('about', 'products', 'business-solution', 'credit-scoring');
  CREATE TYPE "public"."enum__page_content_v_version_approval_status" AS ENUM('draft', 'in_review', 'approved', 'rejected');
  CREATE TYPE "public"."enum__page_content_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__page_content_v_published_locale" AS ENUM('id', 'en');
  CREATE TYPE "public"."enum_static_pages_key" AS ENUM('information_security_policy', 'privacy_policy', 'how_to_get_credit_report', 'complaint_resolution');
  CREATE TYPE "public"."enum_static_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__static_pages_v_version_key" AS ENUM('information_security_policy', 'privacy_policy', 'how_to_get_credit_report', 'complaint_resolution');
  CREATE TYPE "public"."enum__static_pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__static_pages_v_published_locale" AS ENUM('id', 'en');
  CREATE TYPE "public"."enum_contact_submissions_marketing_channels" AS ENUM('SMS/WhatsApp', 'Telephone', 'Email', 'Newsletter');
  CREATE TYPE "public"."enum_contact_submissions_interested_in" AS ENUM('Business Information', 'Business Analytics', 'Business Solutions', 'Market Research', 'CRIF PLUS Membership Programme', 'Credit Bureau', 'General Enquiries');
  CREATE TYPE "public"."enum_contact_submissions_hear_about_us" AS ENUM('Conference/Exhibition', 'Flyer/Leaflet', 'Google Search', 'Magazine', 'Referral', 'Social Media', 'Webinar', 'Other');
  CREATE TYPE "public"."enum_contact_submissions_marketing_preference" AS ENUM('opt_in', 'opt_out');
  CREATE TYPE "public"."enum_users_role" AS ENUM('super_admin', 'hr_admin', 'news_admin', 'marketing_admin', 'sales_admin', 'approver');
  CREATE TYPE "public"."enum_home_settings_approval_status" AS ENUM('draft', 'in_review', 'approved', 'rejected');
  CREATE TYPE "public"."enum_home_settings_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__home_settings_v_version_approval_status" AS ENUM('draft', 'in_review', 'approved', 'rejected');
  CREATE TYPE "public"."enum__home_settings_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__home_settings_v_published_locale" AS ENUM('id', 'en');
  CREATE TYPE "public"."enum_career_page_approval_status" AS ENUM('draft', 'in_review', 'approved', 'rejected');
  CREATE TYPE "public"."enum_career_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__career_page_v_version_approval_status" AS ENUM('draft', 'in_review', 'approved', 'rejected');
  CREATE TYPE "public"."enum__career_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__career_page_v_published_locale" AS ENUM('id', 'en');
  CREATE TYPE "public"."enum_site_settings_social_links_platform" AS ENUM('linkedin', 'instagram', 'facebook', 'x', 'whatsapp', 'youtube');
  CREATE TABLE "articles" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"cover_id" integer,
  	"author_id" integer,
  	"publish_date" timestamp(3) with time zone,
  	"is_featured" boolean,
  	"approval_status" "enum_articles_approval_status" DEFAULT 'draft',
  	"rejection_reason" varchar,
  	"submitted_by_id" integer,
  	"submitted_at" timestamp(3) with time zone,
  	"reviewed_by_id" integer,
  	"reviewed_at" timestamp(3) with time zone,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_articles_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "articles_locales" (
  	"title" varchar,
  	"slug" varchar,
  	"excerpt" varchar,
  	"body" jsonb,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_articles_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_cover_id" integer,
  	"version_author_id" integer,
  	"version_publish_date" timestamp(3) with time zone,
  	"version_is_featured" boolean,
  	"version_approval_status" "enum__articles_v_version_approval_status" DEFAULT 'draft',
  	"version_rejection_reason" varchar,
  	"version_submitted_by_id" integer,
  	"version_submitted_at" timestamp(3) with time zone,
  	"version_reviewed_by_id" integer,
  	"version_reviewed_at" timestamp(3) with time zone,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__articles_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__articles_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_articles_v_locales" (
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_excerpt" varchar,
  	"version_body" jsonb,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "authors" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"photo_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_authors_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_authors_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_photo_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__authors_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__authors_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "media_outlets" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"logo_id" integer,
  	"website_url" varchar,
  	"sort_order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_media_outlets_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "media_outlets_locales" (
  	"slug" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_media_outlets_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_logo_id" integer,
  	"version_website_url" varchar,
  	"version_sort_order" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__media_outlets_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__media_outlets_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_media_outlets_v_locales" (
  	"version_slug" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "media_coverage" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"outlet_id" integer,
  	"image_id" integer,
  	"external_url" varchar,
  	"publish_date" timestamp(3) with time zone,
  	"approval_status" "enum_media_coverage_approval_status" DEFAULT 'draft',
  	"rejection_reason" varchar,
  	"submitted_by_id" integer,
  	"submitted_at" timestamp(3) with time zone,
  	"reviewed_by_id" integer,
  	"reviewed_at" timestamp(3) with time zone,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_media_coverage_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "media_coverage_locales" (
  	"title" varchar,
  	"excerpt" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_media_coverage_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_outlet_id" integer,
  	"version_image_id" integer,
  	"version_external_url" varchar,
  	"version_publish_date" timestamp(3) with time zone,
  	"version_approval_status" "enum__media_coverage_v_version_approval_status" DEFAULT 'draft',
  	"version_rejection_reason" varchar,
  	"version_submitted_by_id" integer,
  	"version_submitted_at" timestamp(3) with time zone,
  	"version_reviewed_by_id" integer,
  	"version_reviewed_at" timestamp(3) with time zone,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__media_coverage_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__media_coverage_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_media_coverage_v_locales" (
  	"version_title" varchar,
  	"version_excerpt" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "reports" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum_reports_type" DEFAULT 'annual_report',
  	"year" numeric,
  	"cover_id" integer,
  	"publish_date" timestamp(3) with time zone,
  	"sort_order" numeric DEFAULT 0,
  	"approval_status" "enum_reports_approval_status" DEFAULT 'draft',
  	"rejection_reason" varchar,
  	"submitted_by_id" integer,
  	"submitted_at" timestamp(3) with time zone,
  	"reviewed_by_id" integer,
  	"reviewed_at" timestamp(3) with time zone,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_reports_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "reports_locales" (
  	"title" varchar,
  	"slug" varchar,
  	"excerpt" varchar,
  	"body" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_reports_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_type" "enum__reports_v_version_type" DEFAULT 'annual_report',
  	"version_year" numeric,
  	"version_cover_id" integer,
  	"version_publish_date" timestamp(3) with time zone,
  	"version_sort_order" numeric DEFAULT 0,
  	"version_approval_status" "enum__reports_v_version_approval_status" DEFAULT 'draft',
  	"version_rejection_reason" varchar,
  	"version_submitted_by_id" integer,
  	"version_submitted_at" timestamp(3) with time zone,
  	"version_reviewed_by_id" integer,
  	"version_reviewed_at" timestamp(3) with time zone,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__reports_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__reports_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_reports_v_locales" (
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_excerpt" varchar,
  	"version_body" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "job_openings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"category_id" integer,
  	"apply_email" varchar DEFAULT 'talent@cbclik.com',
  	"is_open" boolean DEFAULT true,
  	"posted_date" timestamp(3) with time zone,
  	"sort_order" numeric DEFAULT 0,
  	"approval_status" "enum_job_openings_approval_status" DEFAULT 'draft',
  	"rejection_reason" varchar,
  	"submitted_by_id" integer,
  	"submitted_at" timestamp(3) with time zone,
  	"reviewed_by_id" integer,
  	"reviewed_at" timestamp(3) with time zone,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_job_openings_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "job_openings_locales" (
  	"title" varchar,
  	"slug" varchar,
  	"responsibilities" jsonb,
  	"minimum_qualifications" jsonb,
  	"education" jsonb,
  	"email_subject_format" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_job_openings_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_category_id" integer,
  	"version_apply_email" varchar DEFAULT 'talent@cbclik.com',
  	"version_is_open" boolean DEFAULT true,
  	"version_posted_date" timestamp(3) with time zone,
  	"version_sort_order" numeric DEFAULT 0,
  	"version_approval_status" "enum__job_openings_v_version_approval_status" DEFAULT 'draft',
  	"version_rejection_reason" varchar,
  	"version_submitted_by_id" integer,
  	"version_submitted_at" timestamp(3) with time zone,
  	"version_reviewed_by_id" integer,
  	"version_reviewed_at" timestamp(3) with time zone,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__job_openings_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__job_openings_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_job_openings_v_locales" (
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_responsibilities" jsonb,
  	"version_minimum_qualifications" jsonb,
  	"version_education" jsonb,
  	"version_email_subject_format" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "job_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_job_categories_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "job_categories_locales" (
  	"name" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_job_categories_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__job_categories_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__job_categories_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_job_categories_v_locales" (
  	"version_name" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "product_categories_advantages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "product_categories_advantages_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "product_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"image_id" integer,
  	"sort_order" numeric DEFAULT 0,
  	"approval_status" "enum_product_categories_approval_status" DEFAULT 'draft',
  	"rejection_reason" varchar,
  	"submitted_by_id" integer,
  	"submitted_at" timestamp(3) with time zone,
  	"reviewed_by_id" integer,
  	"reviewed_at" timestamp(3) with time zone,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_product_categories_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "product_categories_locales" (
  	"name" varchar,
  	"slug" varchar,
  	"short_description" varchar,
  	"lead" varchar,
  	"description" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_product_categories_v_version_advantages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_product_categories_v_version_advantages_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_product_categories_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_icon_id" integer,
  	"version_image_id" integer,
  	"version_sort_order" numeric DEFAULT 0,
  	"version_approval_status" "enum__product_categories_v_version_approval_status" DEFAULT 'draft',
  	"version_rejection_reason" varchar,
  	"version_submitted_by_id" integer,
  	"version_submitted_at" timestamp(3) with time zone,
  	"version_reviewed_by_id" integer,
  	"version_reviewed_at" timestamp(3) with time zone,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__product_categories_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__product_categories_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_product_categories_v_locales" (
  	"version_name" varchar,
  	"version_slug" varchar,
  	"version_short_description" varchar,
  	"version_lead" varchar,
  	"version_description" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "product_items_use_cases" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "product_items_use_cases_locales" (
  	"segment" varchar,
  	"use" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "product_items" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"category_id" integer,
  	"product_status" "enum_product_items_product_status" DEFAULT 'live',
  	"is_new" boolean,
  	"sort_order" numeric DEFAULT 0,
  	"approval_status" "enum_product_items_approval_status" DEFAULT 'draft',
  	"rejection_reason" varchar,
  	"submitted_by_id" integer,
  	"submitted_at" timestamp(3) with time zone,
  	"reviewed_by_id" integer,
  	"reviewed_at" timestamp(3) with time zone,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_product_items_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "product_items_locales" (
  	"name" varchar,
  	"short_description" varchar,
  	"description" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_product_items_v_version_use_cases" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_product_items_v_version_use_cases_locales" (
  	"segment" varchar,
  	"use" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_product_items_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_category_id" integer,
  	"version_product_status" "enum__product_items_v_version_product_status" DEFAULT 'live',
  	"version_is_new" boolean,
  	"version_sort_order" numeric DEFAULT 0,
  	"version_approval_status" "enum__product_items_v_version_approval_status" DEFAULT 'draft',
  	"version_rejection_reason" varchar,
  	"version_submitted_by_id" integer,
  	"version_submitted_at" timestamp(3) with time zone,
  	"version_reviewed_by_id" integer,
  	"version_reviewed_at" timestamp(3) with time zone,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__product_items_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__product_items_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_product_items_v_locales" (
  	"version_name" varchar,
  	"version_short_description" varchar,
  	"version_description" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "hero_slides" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"button_link" varchar,
  	"sort_order" numeric DEFAULT 0,
  	"approval_status" "enum_hero_slides_approval_status" DEFAULT 'draft',
  	"rejection_reason" varchar,
  	"submitted_by_id" integer,
  	"submitted_at" timestamp(3) with time zone,
  	"reviewed_by_id" integer,
  	"reviewed_at" timestamp(3) with time zone,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_hero_slides_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "hero_slides_locales" (
  	"title" varchar,
  	"subtitle" varchar,
  	"button_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_hero_slides_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_image_id" integer,
  	"version_button_link" varchar,
  	"version_sort_order" numeric DEFAULT 0,
  	"version_approval_status" "enum__hero_slides_v_version_approval_status" DEFAULT 'draft',
  	"version_rejection_reason" varchar,
  	"version_submitted_by_id" integer,
  	"version_submitted_at" timestamp(3) with time zone,
  	"version_reviewed_by_id" integer,
  	"version_reviewed_at" timestamp(3) with time zone,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__hero_slides_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__hero_slides_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_hero_slides_v_locales" (
  	"version_title" varchar,
  	"version_subtitle" varchar,
  	"version_button_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "stats" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"value" varchar,
  	"sort_order" numeric DEFAULT 0,
  	"approval_status" "enum_stats_approval_status" DEFAULT 'draft',
  	"rejection_reason" varchar,
  	"submitted_by_id" integer,
  	"submitted_at" timestamp(3) with time zone,
  	"reviewed_by_id" integer,
  	"reviewed_at" timestamp(3) with time zone,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_stats_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "stats_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_stats_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_icon_id" integer,
  	"version_value" varchar,
  	"version_sort_order" numeric DEFAULT 0,
  	"version_approval_status" "enum__stats_v_version_approval_status" DEFAULT 'draft',
  	"version_rejection_reason" varchar,
  	"version_submitted_by_id" integer,
  	"version_submitted_at" timestamp(3) with time zone,
  	"version_reviewed_by_id" integer,
  	"version_reviewed_at" timestamp(3) with time zone,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__stats_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__stats_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_stats_v_locales" (
  	"version_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "testimonials" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"partner_name" varchar,
  	"logo_id" integer,
  	"sort_order" numeric DEFAULT 0,
  	"approval_status" "enum_testimonials_approval_status" DEFAULT 'draft',
  	"rejection_reason" varchar,
  	"submitted_by_id" integer,
  	"submitted_at" timestamp(3) with time zone,
  	"reviewed_by_id" integer,
  	"reviewed_at" timestamp(3) with time zone,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_testimonials_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "testimonials_locales" (
  	"quote" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_testimonials_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_partner_name" varchar,
  	"version_logo_id" integer,
  	"version_sort_order" numeric DEFAULT 0,
  	"version_approval_status" "enum__testimonials_v_version_approval_status" DEFAULT 'draft',
  	"version_rejection_reason" varchar,
  	"version_submitted_by_id" integer,
  	"version_submitted_at" timestamp(3) with time zone,
  	"version_reviewed_by_id" integer,
  	"version_reviewed_at" timestamp(3) with time zone,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__testimonials_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__testimonials_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_testimonials_v_locales" (
  	"version_quote" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "milestones_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "milestones_items_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "milestones" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"year" numeric,
  	"sort_order" numeric DEFAULT 0,
  	"approval_status" "enum_milestones_approval_status" DEFAULT 'draft',
  	"rejection_reason" varchar,
  	"submitted_by_id" integer,
  	"submitted_at" timestamp(3) with time zone,
  	"reviewed_by_id" integer,
  	"reviewed_at" timestamp(3) with time zone,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_milestones_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_milestones_v_version_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_milestones_v_version_items_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_milestones_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_year" numeric,
  	"version_sort_order" numeric DEFAULT 0,
  	"version_approval_status" "enum__milestones_v_version_approval_status" DEFAULT 'draft',
  	"version_rejection_reason" varchar,
  	"version_submitted_by_id" integer,
  	"version_submitted_at" timestamp(3) with time zone,
  	"version_reviewed_by_id" integer,
  	"version_reviewed_at" timestamp(3) with time zone,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__milestones_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__milestones_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "partner_logos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"logo_id" integer,
  	"url" varchar,
  	"group" "enum_partner_logos_group" DEFAULT 'member',
  	"sort_order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_partner_logos_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_partner_logos_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_logo_id" integer,
  	"version_url" varchar,
  	"version_group" "enum__partner_logos_v_version_group" DEFAULT 'member',
  	"version_sort_order" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__partner_logos_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__partner_logos_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "cta_blocks" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"page" "enum_cta_blocks_page",
  	"cross_link_image_id" integer,
  	"cross_link_target_url" varchar,
  	"banner_background_image_id" integer,
  	"banner_button_link" varchar,
  	"is_active" boolean DEFAULT true,
  	"approval_status" "enum_cta_blocks_approval_status" DEFAULT 'draft',
  	"rejection_reason" varchar,
  	"submitted_by_id" integer,
  	"submitted_at" timestamp(3) with time zone,
  	"reviewed_by_id" integer,
  	"reviewed_at" timestamp(3) with time zone,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_cta_blocks_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "cta_blocks_locales" (
  	"cross_link_label" varchar,
  	"cross_link_title" varchar,
  	"banner_title" varchar,
  	"banner_text" varchar,
  	"banner_button_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_cta_blocks_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_page" "enum__cta_blocks_v_version_page",
  	"version_cross_link_image_id" integer,
  	"version_cross_link_target_url" varchar,
  	"version_banner_background_image_id" integer,
  	"version_banner_button_link" varchar,
  	"version_is_active" boolean DEFAULT true,
  	"version_approval_status" "enum__cta_blocks_v_version_approval_status" DEFAULT 'draft',
  	"version_rejection_reason" varchar,
  	"version_submitted_by_id" integer,
  	"version_submitted_at" timestamp(3) with time zone,
  	"version_reviewed_by_id" integer,
  	"version_reviewed_at" timestamp(3) with time zone,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__cta_blocks_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__cta_blocks_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_cta_blocks_v_locales" (
  	"version_cross_link_label" varchar,
  	"version_cross_link_title" varchar,
  	"version_banner_title" varchar,
  	"version_banner_text" varchar,
  	"version_banner_button_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "page_content_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"image_id" integer
  );
  
  CREATE TABLE "page_content_sections_locales" (
  	"title" varchar,
  	"lead" varchar,
  	"body" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "page_content" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"page" "enum_page_content_page",
  	"hero_image_id" integer,
  	"video_url" varchar,
  	"approval_status" "enum_page_content_approval_status" DEFAULT 'draft',
  	"rejection_reason" varchar,
  	"submitted_by_id" integer,
  	"submitted_at" timestamp(3) with time zone,
  	"reviewed_by_id" integer,
  	"reviewed_at" timestamp(3) with time zone,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_page_content_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "page_content_locales" (
  	"title" varchar,
  	"lead" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_page_content_v_version_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_page_content_v_version_sections_locales" (
  	"title" varchar,
  	"lead" varchar,
  	"body" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_page_content_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_page" "enum__page_content_v_version_page",
  	"version_hero_image_id" integer,
  	"version_video_url" varchar,
  	"version_approval_status" "enum__page_content_v_version_approval_status" DEFAULT 'draft',
  	"version_rejection_reason" varchar,
  	"version_submitted_by_id" integer,
  	"version_submitted_at" timestamp(3) with time zone,
  	"version_reviewed_by_id" integer,
  	"version_reviewed_at" timestamp(3) with time zone,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__page_content_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__page_content_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_page_content_v_locales" (
  	"version_title" varchar,
  	"version_lead" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "static_pages_attachments" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"file_id" integer
  );
  
  CREATE TABLE "static_pages_attachments_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "static_pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" "enum_static_pages_key",
  	"last_updated_date" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_static_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "static_pages_locales" (
  	"title" varchar,
  	"body" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_static_pages_v_version_attachments" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"file_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_static_pages_v_version_attachments_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_static_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_key" "enum__static_pages_v_version_key",
  	"version_last_updated_date" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__static_pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__static_pages_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_static_pages_v_locales" (
  	"version_title" varchar,
  	"version_body" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "contact_submissions_marketing_channels" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_contact_submissions_marketing_channels",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "contact_submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"first_name" varchar NOT NULL,
  	"last_name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"company_name" varchar NOT NULL,
  	"interested_in" "enum_contact_submissions_interested_in" NOT NULL,
  	"hear_about_us" "enum_contact_submissions_hear_about_us",
  	"message" varchar,
  	"consent" boolean DEFAULT false NOT NULL,
  	"marketing_preference" "enum_contact_submissions_marketing_preference",
  	"locale" varchar,
  	"page_url" varchar,
  	"ip_address" varchar,
  	"user_agent" varchar,
  	"consent_text_version" varchar,
  	"followed_up" boolean,
  	"followed_up_by_id" integer,
  	"followed_up_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "audit_log" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"action" varchar NOT NULL,
  	"collection_slug" varchar,
  	"document_id" varchar,
  	"document_title" varchar,
  	"user_id" integer,
  	"user_email" varchar,
  	"detail" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "home_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"approval_status" "enum_home_settings_approval_status" DEFAULT 'draft',
  	"rejection_reason" varchar,
  	"submitted_by_id" integer,
  	"submitted_at" timestamp(3) with time zone,
  	"reviewed_by_id" integer,
  	"reviewed_at" timestamp(3) with time zone,
  	"_status" "enum_home_settings_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "home_settings_locales" (
  	"about_title" varchar,
  	"about_text" varchar,
  	"trust_bar_text" varchar,
  	"solutions_title" varchar,
  	"solutions_subtitle" varchar,
  	"testimonials_title" varchar,
  	"testimonials_subtitle" varchar,
  	"news_title" varchar,
  	"news_subtitle" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_settings_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_approval_status" "enum__home_settings_v_version_approval_status" DEFAULT 'draft',
  	"version_rejection_reason" varchar,
  	"version_submitted_by_id" integer,
  	"version_submitted_at" timestamp(3) with time zone,
  	"version_reviewed_by_id" integer,
  	"version_reviewed_at" timestamp(3) with time zone,
  	"version__status" "enum__home_settings_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__home_settings_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_home_settings_v_locales" (
  	"version_about_title" varchar,
  	"version_about_text" varchar,
  	"version_trust_bar_text" varchar,
  	"version_solutions_title" varchar,
  	"version_solutions_subtitle" varchar,
  	"version_testimonials_title" varchar,
  	"version_testimonials_subtitle" varchar,
  	"version_news_title" varchar,
  	"version_news_subtitle" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "career_page_hero_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "career_page_values" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "career_page_values_locales" (
  	"title" varchar,
  	"subtitle" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "career_page_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon_id" integer
  );
  
  CREATE TABLE "career_page_benefits_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "career_page_recruitment_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "career_page_recruitment_steps_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "career_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"approval_status" "enum_career_page_approval_status" DEFAULT 'draft',
  	"rejection_reason" varchar,
  	"submitted_by_id" integer,
  	"submitted_at" timestamp(3) with time zone,
  	"reviewed_by_id" integer,
  	"reviewed_at" timestamp(3) with time zone,
  	"_status" "enum_career_page_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "career_page_locales" (
  	"hero_title" varchar,
  	"hero_subtitle" varchar,
  	"cv_note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_career_page_v_version_hero_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_career_page_v_version_values" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_career_page_v_version_values_locales" (
  	"title" varchar,
  	"subtitle" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_career_page_v_version_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_career_page_v_version_benefits_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_career_page_v_version_recruitment_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_career_page_v_version_recruitment_steps_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_career_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_approval_status" "enum__career_page_v_version_approval_status" DEFAULT 'draft',
  	"version_rejection_reason" varchar,
  	"version_submitted_by_id" integer,
  	"version_submitted_at" timestamp(3) with time zone,
  	"version_reviewed_by_id" integer,
  	"version_reviewed_at" timestamp(3) with time zone,
  	"version__status" "enum__career_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__career_page_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_career_page_v_locales" (
  	"version_hero_title" varchar,
  	"version_hero_subtitle" varchar,
  	"version_cv_note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "site_settings_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_site_settings_social_links_platform" NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"company_name" varchar DEFAULT 'PT CRIF Lembaga Informasi Keuangan' NOT NULL,
  	"phone" varchar DEFAULT '(+62) 21 8060 4228',
  	"general_email" varchar DEFAULT 'info@cbclik.com',
  	"sales_email" varchar DEFAULT 'sales@cbclik.com',
  	"careers_email" varchar DEFAULT 'talent@cbclik.com',
  	"website_url" varchar DEFAULT 'https://www.cbclik.com',
  	"map_embed_url" varchar,
  	"ojk_licence_number" varchar,
  	"crif_url" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_settings_locales" (
  	"address" varchar,
  	"default_seo_title" varchar,
  	"default_seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "users" ADD COLUMN "name" varchar NOT NULL;
  ALTER TABLE "users" ADD COLUMN "role" "enum_users_role" DEFAULT 'news_admin' NOT NULL;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "articles_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "authors_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "media_outlets_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "media_coverage_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "reports_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "job_openings_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "job_categories_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "product_categories_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "product_items_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "hero_slides_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "stats_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "testimonials_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "milestones_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "partner_logos_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "cta_blocks_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "page_content_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "static_pages_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "contact_submissions_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "audit_log_id" integer;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_author_id_authors_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."authors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_submitted_by_id_users_id_fk" FOREIGN KEY ("submitted_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_reviewed_by_id_users_id_fk" FOREIGN KEY ("reviewed_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles_locales" ADD CONSTRAINT "articles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_parent_id_articles_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."articles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_author_id_authors_id_fk" FOREIGN KEY ("version_author_id") REFERENCES "public"."authors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_submitted_by_id_users_id_fk" FOREIGN KEY ("version_submitted_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_reviewed_by_id_users_id_fk" FOREIGN KEY ("version_reviewed_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v_locales" ADD CONSTRAINT "_articles_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "authors" ADD CONSTRAINT "authors_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_authors_v" ADD CONSTRAINT "_authors_v_parent_id_authors_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."authors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_authors_v" ADD CONSTRAINT "_authors_v_version_photo_id_media_id_fk" FOREIGN KEY ("version_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media_outlets" ADD CONSTRAINT "media_outlets_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media_outlets_locales" ADD CONSTRAINT "media_outlets_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media_outlets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_media_outlets_v" ADD CONSTRAINT "_media_outlets_v_parent_id_media_outlets_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."media_outlets"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_media_outlets_v" ADD CONSTRAINT "_media_outlets_v_version_logo_id_media_id_fk" FOREIGN KEY ("version_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_media_outlets_v_locales" ADD CONSTRAINT "_media_outlets_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_media_outlets_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_coverage" ADD CONSTRAINT "media_coverage_outlet_id_media_outlets_id_fk" FOREIGN KEY ("outlet_id") REFERENCES "public"."media_outlets"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media_coverage" ADD CONSTRAINT "media_coverage_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media_coverage" ADD CONSTRAINT "media_coverage_submitted_by_id_users_id_fk" FOREIGN KEY ("submitted_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media_coverage" ADD CONSTRAINT "media_coverage_reviewed_by_id_users_id_fk" FOREIGN KEY ("reviewed_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media_coverage_locales" ADD CONSTRAINT "media_coverage_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media_coverage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_media_coverage_v" ADD CONSTRAINT "_media_coverage_v_parent_id_media_coverage_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."media_coverage"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_media_coverage_v" ADD CONSTRAINT "_media_coverage_v_version_outlet_id_media_outlets_id_fk" FOREIGN KEY ("version_outlet_id") REFERENCES "public"."media_outlets"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_media_coverage_v" ADD CONSTRAINT "_media_coverage_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_media_coverage_v" ADD CONSTRAINT "_media_coverage_v_version_submitted_by_id_users_id_fk" FOREIGN KEY ("version_submitted_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_media_coverage_v" ADD CONSTRAINT "_media_coverage_v_version_reviewed_by_id_users_id_fk" FOREIGN KEY ("version_reviewed_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_media_coverage_v_locales" ADD CONSTRAINT "_media_coverage_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_media_coverage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "reports" ADD CONSTRAINT "reports_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "reports" ADD CONSTRAINT "reports_submitted_by_id_users_id_fk" FOREIGN KEY ("submitted_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "reports" ADD CONSTRAINT "reports_reviewed_by_id_users_id_fk" FOREIGN KEY ("reviewed_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "reports_locales" ADD CONSTRAINT "reports_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."reports"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_reports_v" ADD CONSTRAINT "_reports_v_parent_id_reports_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."reports"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_reports_v" ADD CONSTRAINT "_reports_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_reports_v" ADD CONSTRAINT "_reports_v_version_submitted_by_id_users_id_fk" FOREIGN KEY ("version_submitted_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_reports_v" ADD CONSTRAINT "_reports_v_version_reviewed_by_id_users_id_fk" FOREIGN KEY ("version_reviewed_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_reports_v_locales" ADD CONSTRAINT "_reports_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_reports_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "job_openings" ADD CONSTRAINT "job_openings_category_id_job_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."job_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "job_openings" ADD CONSTRAINT "job_openings_submitted_by_id_users_id_fk" FOREIGN KEY ("submitted_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "job_openings" ADD CONSTRAINT "job_openings_reviewed_by_id_users_id_fk" FOREIGN KEY ("reviewed_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "job_openings_locales" ADD CONSTRAINT "job_openings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."job_openings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_job_openings_v" ADD CONSTRAINT "_job_openings_v_parent_id_job_openings_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."job_openings"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_job_openings_v" ADD CONSTRAINT "_job_openings_v_version_category_id_job_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."job_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_job_openings_v" ADD CONSTRAINT "_job_openings_v_version_submitted_by_id_users_id_fk" FOREIGN KEY ("version_submitted_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_job_openings_v" ADD CONSTRAINT "_job_openings_v_version_reviewed_by_id_users_id_fk" FOREIGN KEY ("version_reviewed_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_job_openings_v_locales" ADD CONSTRAINT "_job_openings_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_job_openings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "job_categories_locales" ADD CONSTRAINT "job_categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."job_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_job_categories_v" ADD CONSTRAINT "_job_categories_v_parent_id_job_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."job_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_job_categories_v_locales" ADD CONSTRAINT "_job_categories_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_job_categories_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_categories_advantages" ADD CONSTRAINT "product_categories_advantages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_categories_advantages_locales" ADD CONSTRAINT "product_categories_advantages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_categories_advantages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_submitted_by_id_users_id_fk" FOREIGN KEY ("submitted_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_reviewed_by_id_users_id_fk" FOREIGN KEY ("reviewed_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "product_categories_locales" ADD CONSTRAINT "product_categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_product_categories_v_version_advantages" ADD CONSTRAINT "_product_categories_v_version_advantages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_product_categories_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_product_categories_v_version_advantages_locales" ADD CONSTRAINT "_product_categories_v_version_advantages_locales_parent_i_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_product_categories_v_version_advantages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_product_categories_v" ADD CONSTRAINT "_product_categories_v_parent_id_product_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."product_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_product_categories_v" ADD CONSTRAINT "_product_categories_v_version_icon_id_media_id_fk" FOREIGN KEY ("version_icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_product_categories_v" ADD CONSTRAINT "_product_categories_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_product_categories_v" ADD CONSTRAINT "_product_categories_v_version_submitted_by_id_users_id_fk" FOREIGN KEY ("version_submitted_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_product_categories_v" ADD CONSTRAINT "_product_categories_v_version_reviewed_by_id_users_id_fk" FOREIGN KEY ("version_reviewed_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_product_categories_v_locales" ADD CONSTRAINT "_product_categories_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_product_categories_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_items_use_cases" ADD CONSTRAINT "product_items_use_cases_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_items_use_cases_locales" ADD CONSTRAINT "product_items_use_cases_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_items_use_cases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_items" ADD CONSTRAINT "product_items_category_id_product_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."product_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "product_items" ADD CONSTRAINT "product_items_submitted_by_id_users_id_fk" FOREIGN KEY ("submitted_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "product_items" ADD CONSTRAINT "product_items_reviewed_by_id_users_id_fk" FOREIGN KEY ("reviewed_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "product_items_locales" ADD CONSTRAINT "product_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_product_items_v_version_use_cases" ADD CONSTRAINT "_product_items_v_version_use_cases_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_product_items_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_product_items_v_version_use_cases_locales" ADD CONSTRAINT "_product_items_v_version_use_cases_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_product_items_v_version_use_cases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_product_items_v" ADD CONSTRAINT "_product_items_v_parent_id_product_items_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."product_items"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_product_items_v" ADD CONSTRAINT "_product_items_v_version_category_id_product_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."product_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_product_items_v" ADD CONSTRAINT "_product_items_v_version_submitted_by_id_users_id_fk" FOREIGN KEY ("version_submitted_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_product_items_v" ADD CONSTRAINT "_product_items_v_version_reviewed_by_id_users_id_fk" FOREIGN KEY ("version_reviewed_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_product_items_v_locales" ADD CONSTRAINT "_product_items_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_product_items_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "hero_slides" ADD CONSTRAINT "hero_slides_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "hero_slides" ADD CONSTRAINT "hero_slides_submitted_by_id_users_id_fk" FOREIGN KEY ("submitted_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "hero_slides" ADD CONSTRAINT "hero_slides_reviewed_by_id_users_id_fk" FOREIGN KEY ("reviewed_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "hero_slides_locales" ADD CONSTRAINT "hero_slides_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."hero_slides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_hero_slides_v" ADD CONSTRAINT "_hero_slides_v_parent_id_hero_slides_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."hero_slides"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_hero_slides_v" ADD CONSTRAINT "_hero_slides_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_hero_slides_v" ADD CONSTRAINT "_hero_slides_v_version_submitted_by_id_users_id_fk" FOREIGN KEY ("version_submitted_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_hero_slides_v" ADD CONSTRAINT "_hero_slides_v_version_reviewed_by_id_users_id_fk" FOREIGN KEY ("version_reviewed_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_hero_slides_v_locales" ADD CONSTRAINT "_hero_slides_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_hero_slides_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stats" ADD CONSTRAINT "stats_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "stats" ADD CONSTRAINT "stats_submitted_by_id_users_id_fk" FOREIGN KEY ("submitted_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "stats" ADD CONSTRAINT "stats_reviewed_by_id_users_id_fk" FOREIGN KEY ("reviewed_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "stats_locales" ADD CONSTRAINT "stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stats_v" ADD CONSTRAINT "_stats_v_parent_id_stats_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."stats"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stats_v" ADD CONSTRAINT "_stats_v_version_icon_id_media_id_fk" FOREIGN KEY ("version_icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stats_v" ADD CONSTRAINT "_stats_v_version_submitted_by_id_users_id_fk" FOREIGN KEY ("version_submitted_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stats_v" ADD CONSTRAINT "_stats_v_version_reviewed_by_id_users_id_fk" FOREIGN KEY ("version_reviewed_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stats_v_locales" ADD CONSTRAINT "_stats_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stats_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_submitted_by_id_users_id_fk" FOREIGN KEY ("submitted_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_reviewed_by_id_users_id_fk" FOREIGN KEY ("reviewed_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials_locales" ADD CONSTRAINT "testimonials_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_testimonials_v" ADD CONSTRAINT "_testimonials_v_parent_id_testimonials_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."testimonials"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_testimonials_v" ADD CONSTRAINT "_testimonials_v_version_logo_id_media_id_fk" FOREIGN KEY ("version_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_testimonials_v" ADD CONSTRAINT "_testimonials_v_version_submitted_by_id_users_id_fk" FOREIGN KEY ("version_submitted_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_testimonials_v" ADD CONSTRAINT "_testimonials_v_version_reviewed_by_id_users_id_fk" FOREIGN KEY ("version_reviewed_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_testimonials_v_locales" ADD CONSTRAINT "_testimonials_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_testimonials_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "milestones_items" ADD CONSTRAINT "milestones_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."milestones"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "milestones_items_locales" ADD CONSTRAINT "milestones_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."milestones_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "milestones" ADD CONSTRAINT "milestones_submitted_by_id_users_id_fk" FOREIGN KEY ("submitted_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "milestones" ADD CONSTRAINT "milestones_reviewed_by_id_users_id_fk" FOREIGN KEY ("reviewed_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_milestones_v_version_items" ADD CONSTRAINT "_milestones_v_version_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_milestones_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_milestones_v_version_items_locales" ADD CONSTRAINT "_milestones_v_version_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_milestones_v_version_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_milestones_v" ADD CONSTRAINT "_milestones_v_parent_id_milestones_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."milestones"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_milestones_v" ADD CONSTRAINT "_milestones_v_version_submitted_by_id_users_id_fk" FOREIGN KEY ("version_submitted_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_milestones_v" ADD CONSTRAINT "_milestones_v_version_reviewed_by_id_users_id_fk" FOREIGN KEY ("version_reviewed_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "partner_logos" ADD CONSTRAINT "partner_logos_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_partner_logos_v" ADD CONSTRAINT "_partner_logos_v_parent_id_partner_logos_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."partner_logos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_partner_logos_v" ADD CONSTRAINT "_partner_logos_v_version_logo_id_media_id_fk" FOREIGN KEY ("version_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cta_blocks" ADD CONSTRAINT "cta_blocks_cross_link_image_id_media_id_fk" FOREIGN KEY ("cross_link_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cta_blocks" ADD CONSTRAINT "cta_blocks_banner_background_image_id_media_id_fk" FOREIGN KEY ("banner_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cta_blocks" ADD CONSTRAINT "cta_blocks_submitted_by_id_users_id_fk" FOREIGN KEY ("submitted_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cta_blocks" ADD CONSTRAINT "cta_blocks_reviewed_by_id_users_id_fk" FOREIGN KEY ("reviewed_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cta_blocks_locales" ADD CONSTRAINT "cta_blocks_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cta_blocks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_cta_blocks_v" ADD CONSTRAINT "_cta_blocks_v_parent_id_cta_blocks_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."cta_blocks"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_cta_blocks_v" ADD CONSTRAINT "_cta_blocks_v_version_cross_link_image_id_media_id_fk" FOREIGN KEY ("version_cross_link_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_cta_blocks_v" ADD CONSTRAINT "_cta_blocks_v_version_banner_background_image_id_media_id_fk" FOREIGN KEY ("version_banner_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_cta_blocks_v" ADD CONSTRAINT "_cta_blocks_v_version_submitted_by_id_users_id_fk" FOREIGN KEY ("version_submitted_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_cta_blocks_v" ADD CONSTRAINT "_cta_blocks_v_version_reviewed_by_id_users_id_fk" FOREIGN KEY ("version_reviewed_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_cta_blocks_v_locales" ADD CONSTRAINT "_cta_blocks_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_cta_blocks_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_content_sections" ADD CONSTRAINT "page_content_sections_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_content_sections" ADD CONSTRAINT "page_content_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_content_sections_locales" ADD CONSTRAINT "page_content_sections_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_content_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_content" ADD CONSTRAINT "page_content_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_content" ADD CONSTRAINT "page_content_submitted_by_id_users_id_fk" FOREIGN KEY ("submitted_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_content" ADD CONSTRAINT "page_content_reviewed_by_id_users_id_fk" FOREIGN KEY ("reviewed_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_content_locales" ADD CONSTRAINT "page_content_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_page_content_v_version_sections" ADD CONSTRAINT "_page_content_v_version_sections_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_page_content_v_version_sections" ADD CONSTRAINT "_page_content_v_version_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_page_content_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_page_content_v_version_sections_locales" ADD CONSTRAINT "_page_content_v_version_sections_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_page_content_v_version_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_page_content_v" ADD CONSTRAINT "_page_content_v_parent_id_page_content_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."page_content"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_page_content_v" ADD CONSTRAINT "_page_content_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_page_content_v" ADD CONSTRAINT "_page_content_v_version_submitted_by_id_users_id_fk" FOREIGN KEY ("version_submitted_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_page_content_v" ADD CONSTRAINT "_page_content_v_version_reviewed_by_id_users_id_fk" FOREIGN KEY ("version_reviewed_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_page_content_v_locales" ADD CONSTRAINT "_page_content_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_page_content_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "static_pages_attachments" ADD CONSTRAINT "static_pages_attachments_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "static_pages_attachments" ADD CONSTRAINT "static_pages_attachments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."static_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "static_pages_attachments_locales" ADD CONSTRAINT "static_pages_attachments_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."static_pages_attachments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "static_pages_locales" ADD CONSTRAINT "static_pages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."static_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_static_pages_v_version_attachments" ADD CONSTRAINT "_static_pages_v_version_attachments_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_static_pages_v_version_attachments" ADD CONSTRAINT "_static_pages_v_version_attachments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_static_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_static_pages_v_version_attachments_locales" ADD CONSTRAINT "_static_pages_v_version_attachments_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_static_pages_v_version_attachments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_static_pages_v" ADD CONSTRAINT "_static_pages_v_parent_id_static_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."static_pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_static_pages_v_locales" ADD CONSTRAINT "_static_pages_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_static_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_submissions_marketing_channels" ADD CONSTRAINT "contact_submissions_marketing_channels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."contact_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_submissions" ADD CONSTRAINT "contact_submissions_followed_up_by_id_users_id_fk" FOREIGN KEY ("followed_up_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_settings" ADD CONSTRAINT "home_settings_submitted_by_id_users_id_fk" FOREIGN KEY ("submitted_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_settings" ADD CONSTRAINT "home_settings_reviewed_by_id_users_id_fk" FOREIGN KEY ("reviewed_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_settings_locales" ADD CONSTRAINT "home_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_settings_v" ADD CONSTRAINT "_home_settings_v_version_submitted_by_id_users_id_fk" FOREIGN KEY ("version_submitted_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_settings_v" ADD CONSTRAINT "_home_settings_v_version_reviewed_by_id_users_id_fk" FOREIGN KEY ("version_reviewed_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_settings_v_locales" ADD CONSTRAINT "_home_settings_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "career_page_hero_images" ADD CONSTRAINT "career_page_hero_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "career_page_hero_images" ADD CONSTRAINT "career_page_hero_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."career_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "career_page_values" ADD CONSTRAINT "career_page_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."career_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "career_page_values_locales" ADD CONSTRAINT "career_page_values_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."career_page_values"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "career_page_benefits" ADD CONSTRAINT "career_page_benefits_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "career_page_benefits" ADD CONSTRAINT "career_page_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."career_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "career_page_benefits_locales" ADD CONSTRAINT "career_page_benefits_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."career_page_benefits"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "career_page_recruitment_steps" ADD CONSTRAINT "career_page_recruitment_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."career_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "career_page_recruitment_steps_locales" ADD CONSTRAINT "career_page_recruitment_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."career_page_recruitment_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "career_page" ADD CONSTRAINT "career_page_submitted_by_id_users_id_fk" FOREIGN KEY ("submitted_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "career_page" ADD CONSTRAINT "career_page_reviewed_by_id_users_id_fk" FOREIGN KEY ("reviewed_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "career_page_locales" ADD CONSTRAINT "career_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."career_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_career_page_v_version_hero_images" ADD CONSTRAINT "_career_page_v_version_hero_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_career_page_v_version_hero_images" ADD CONSTRAINT "_career_page_v_version_hero_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_career_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_career_page_v_version_values" ADD CONSTRAINT "_career_page_v_version_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_career_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_career_page_v_version_values_locales" ADD CONSTRAINT "_career_page_v_version_values_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_career_page_v_version_values"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_career_page_v_version_benefits" ADD CONSTRAINT "_career_page_v_version_benefits_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_career_page_v_version_benefits" ADD CONSTRAINT "_career_page_v_version_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_career_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_career_page_v_version_benefits_locales" ADD CONSTRAINT "_career_page_v_version_benefits_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_career_page_v_version_benefits"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_career_page_v_version_recruitment_steps" ADD CONSTRAINT "_career_page_v_version_recruitment_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_career_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_career_page_v_version_recruitment_steps_locales" ADD CONSTRAINT "_career_page_v_version_recruitment_steps_locales_parent_i_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_career_page_v_version_recruitment_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_career_page_v" ADD CONSTRAINT "_career_page_v_version_submitted_by_id_users_id_fk" FOREIGN KEY ("version_submitted_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_career_page_v" ADD CONSTRAINT "_career_page_v_version_reviewed_by_id_users_id_fk" FOREIGN KEY ("version_reviewed_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_career_page_v_locales" ADD CONSTRAINT "_career_page_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_career_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_social_links" ADD CONSTRAINT "site_settings_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_locales" ADD CONSTRAINT "site_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "articles_cover_idx" ON "articles" USING btree ("cover_id");
  CREATE INDEX "articles_author_idx" ON "articles" USING btree ("author_id");
  CREATE INDEX "articles_approval_status_idx" ON "articles" USING btree ("approval_status");
  CREATE INDEX "articles_submitted_by_idx" ON "articles" USING btree ("submitted_by_id");
  CREATE INDEX "articles_reviewed_by_idx" ON "articles" USING btree ("reviewed_by_id");
  CREATE INDEX "articles_updated_at_idx" ON "articles" USING btree ("updated_at");
  CREATE INDEX "articles_created_at_idx" ON "articles" USING btree ("created_at");
  CREATE INDEX "articles__status_idx" ON "articles" USING btree ("_status");
  CREATE INDEX "articles_slug_idx" ON "articles_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "articles_locales_locale_parent_id_unique" ON "articles_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_articles_v_parent_idx" ON "_articles_v" USING btree ("parent_id");
  CREATE INDEX "_articles_v_version_version_cover_idx" ON "_articles_v" USING btree ("version_cover_id");
  CREATE INDEX "_articles_v_version_version_author_idx" ON "_articles_v" USING btree ("version_author_id");
  CREATE INDEX "_articles_v_version_version_approval_status_idx" ON "_articles_v" USING btree ("version_approval_status");
  CREATE INDEX "_articles_v_version_version_submitted_by_idx" ON "_articles_v" USING btree ("version_submitted_by_id");
  CREATE INDEX "_articles_v_version_version_reviewed_by_idx" ON "_articles_v" USING btree ("version_reviewed_by_id");
  CREATE INDEX "_articles_v_version_version_updated_at_idx" ON "_articles_v" USING btree ("version_updated_at");
  CREATE INDEX "_articles_v_version_version_created_at_idx" ON "_articles_v" USING btree ("version_created_at");
  CREATE INDEX "_articles_v_version_version__status_idx" ON "_articles_v" USING btree ("version__status");
  CREATE INDEX "_articles_v_created_at_idx" ON "_articles_v" USING btree ("created_at");
  CREATE INDEX "_articles_v_updated_at_idx" ON "_articles_v" USING btree ("updated_at");
  CREATE INDEX "_articles_v_snapshot_idx" ON "_articles_v" USING btree ("snapshot");
  CREATE INDEX "_articles_v_published_locale_idx" ON "_articles_v" USING btree ("published_locale");
  CREATE INDEX "_articles_v_latest_idx" ON "_articles_v" USING btree ("latest");
  CREATE INDEX "_articles_v_version_version_slug_idx" ON "_articles_v_locales" USING btree ("version_slug","_locale");
  CREATE UNIQUE INDEX "_articles_v_locales_locale_parent_id_unique" ON "_articles_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "authors_photo_idx" ON "authors" USING btree ("photo_id");
  CREATE INDEX "authors_updated_at_idx" ON "authors" USING btree ("updated_at");
  CREATE INDEX "authors_created_at_idx" ON "authors" USING btree ("created_at");
  CREATE INDEX "authors__status_idx" ON "authors" USING btree ("_status");
  CREATE INDEX "_authors_v_parent_idx" ON "_authors_v" USING btree ("parent_id");
  CREATE INDEX "_authors_v_version_version_photo_idx" ON "_authors_v" USING btree ("version_photo_id");
  CREATE INDEX "_authors_v_version_version_updated_at_idx" ON "_authors_v" USING btree ("version_updated_at");
  CREATE INDEX "_authors_v_version_version_created_at_idx" ON "_authors_v" USING btree ("version_created_at");
  CREATE INDEX "_authors_v_version_version__status_idx" ON "_authors_v" USING btree ("version__status");
  CREATE INDEX "_authors_v_created_at_idx" ON "_authors_v" USING btree ("created_at");
  CREATE INDEX "_authors_v_updated_at_idx" ON "_authors_v" USING btree ("updated_at");
  CREATE INDEX "_authors_v_snapshot_idx" ON "_authors_v" USING btree ("snapshot");
  CREATE INDEX "_authors_v_published_locale_idx" ON "_authors_v" USING btree ("published_locale");
  CREATE INDEX "_authors_v_latest_idx" ON "_authors_v" USING btree ("latest");
  CREATE INDEX "media_outlets_logo_idx" ON "media_outlets" USING btree ("logo_id");
  CREATE INDEX "media_outlets_updated_at_idx" ON "media_outlets" USING btree ("updated_at");
  CREATE INDEX "media_outlets_created_at_idx" ON "media_outlets" USING btree ("created_at");
  CREATE INDEX "media_outlets__status_idx" ON "media_outlets" USING btree ("_status");
  CREATE INDEX "media_outlets_slug_idx" ON "media_outlets_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "media_outlets_locales_locale_parent_id_unique" ON "media_outlets_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_media_outlets_v_parent_idx" ON "_media_outlets_v" USING btree ("parent_id");
  CREATE INDEX "_media_outlets_v_version_version_logo_idx" ON "_media_outlets_v" USING btree ("version_logo_id");
  CREATE INDEX "_media_outlets_v_version_version_updated_at_idx" ON "_media_outlets_v" USING btree ("version_updated_at");
  CREATE INDEX "_media_outlets_v_version_version_created_at_idx" ON "_media_outlets_v" USING btree ("version_created_at");
  CREATE INDEX "_media_outlets_v_version_version__status_idx" ON "_media_outlets_v" USING btree ("version__status");
  CREATE INDEX "_media_outlets_v_created_at_idx" ON "_media_outlets_v" USING btree ("created_at");
  CREATE INDEX "_media_outlets_v_updated_at_idx" ON "_media_outlets_v" USING btree ("updated_at");
  CREATE INDEX "_media_outlets_v_snapshot_idx" ON "_media_outlets_v" USING btree ("snapshot");
  CREATE INDEX "_media_outlets_v_published_locale_idx" ON "_media_outlets_v" USING btree ("published_locale");
  CREATE INDEX "_media_outlets_v_latest_idx" ON "_media_outlets_v" USING btree ("latest");
  CREATE INDEX "_media_outlets_v_version_version_slug_idx" ON "_media_outlets_v_locales" USING btree ("version_slug","_locale");
  CREATE UNIQUE INDEX "_media_outlets_v_locales_locale_parent_id_unique" ON "_media_outlets_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "media_coverage_outlet_idx" ON "media_coverage" USING btree ("outlet_id");
  CREATE INDEX "media_coverage_image_idx" ON "media_coverage" USING btree ("image_id");
  CREATE INDEX "media_coverage_approval_status_idx" ON "media_coverage" USING btree ("approval_status");
  CREATE INDEX "media_coverage_submitted_by_idx" ON "media_coverage" USING btree ("submitted_by_id");
  CREATE INDEX "media_coverage_reviewed_by_idx" ON "media_coverage" USING btree ("reviewed_by_id");
  CREATE INDEX "media_coverage_updated_at_idx" ON "media_coverage" USING btree ("updated_at");
  CREATE INDEX "media_coverage_created_at_idx" ON "media_coverage" USING btree ("created_at");
  CREATE INDEX "media_coverage__status_idx" ON "media_coverage" USING btree ("_status");
  CREATE UNIQUE INDEX "media_coverage_locales_locale_parent_id_unique" ON "media_coverage_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_media_coverage_v_parent_idx" ON "_media_coverage_v" USING btree ("parent_id");
  CREATE INDEX "_media_coverage_v_version_version_outlet_idx" ON "_media_coverage_v" USING btree ("version_outlet_id");
  CREATE INDEX "_media_coverage_v_version_version_image_idx" ON "_media_coverage_v" USING btree ("version_image_id");
  CREATE INDEX "_media_coverage_v_version_version_approval_status_idx" ON "_media_coverage_v" USING btree ("version_approval_status");
  CREATE INDEX "_media_coverage_v_version_version_submitted_by_idx" ON "_media_coverage_v" USING btree ("version_submitted_by_id");
  CREATE INDEX "_media_coverage_v_version_version_reviewed_by_idx" ON "_media_coverage_v" USING btree ("version_reviewed_by_id");
  CREATE INDEX "_media_coverage_v_version_version_updated_at_idx" ON "_media_coverage_v" USING btree ("version_updated_at");
  CREATE INDEX "_media_coverage_v_version_version_created_at_idx" ON "_media_coverage_v" USING btree ("version_created_at");
  CREATE INDEX "_media_coverage_v_version_version__status_idx" ON "_media_coverage_v" USING btree ("version__status");
  CREATE INDEX "_media_coverage_v_created_at_idx" ON "_media_coverage_v" USING btree ("created_at");
  CREATE INDEX "_media_coverage_v_updated_at_idx" ON "_media_coverage_v" USING btree ("updated_at");
  CREATE INDEX "_media_coverage_v_snapshot_idx" ON "_media_coverage_v" USING btree ("snapshot");
  CREATE INDEX "_media_coverage_v_published_locale_idx" ON "_media_coverage_v" USING btree ("published_locale");
  CREATE INDEX "_media_coverage_v_latest_idx" ON "_media_coverage_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_media_coverage_v_locales_locale_parent_id_unique" ON "_media_coverage_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "reports_cover_idx" ON "reports" USING btree ("cover_id");
  CREATE INDEX "reports_approval_status_idx" ON "reports" USING btree ("approval_status");
  CREATE INDEX "reports_submitted_by_idx" ON "reports" USING btree ("submitted_by_id");
  CREATE INDEX "reports_reviewed_by_idx" ON "reports" USING btree ("reviewed_by_id");
  CREATE INDEX "reports_updated_at_idx" ON "reports" USING btree ("updated_at");
  CREATE INDEX "reports_created_at_idx" ON "reports" USING btree ("created_at");
  CREATE INDEX "reports__status_idx" ON "reports" USING btree ("_status");
  CREATE INDEX "reports_slug_idx" ON "reports_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "reports_locales_locale_parent_id_unique" ON "reports_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_reports_v_parent_idx" ON "_reports_v" USING btree ("parent_id");
  CREATE INDEX "_reports_v_version_version_cover_idx" ON "_reports_v" USING btree ("version_cover_id");
  CREATE INDEX "_reports_v_version_version_approval_status_idx" ON "_reports_v" USING btree ("version_approval_status");
  CREATE INDEX "_reports_v_version_version_submitted_by_idx" ON "_reports_v" USING btree ("version_submitted_by_id");
  CREATE INDEX "_reports_v_version_version_reviewed_by_idx" ON "_reports_v" USING btree ("version_reviewed_by_id");
  CREATE INDEX "_reports_v_version_version_updated_at_idx" ON "_reports_v" USING btree ("version_updated_at");
  CREATE INDEX "_reports_v_version_version_created_at_idx" ON "_reports_v" USING btree ("version_created_at");
  CREATE INDEX "_reports_v_version_version__status_idx" ON "_reports_v" USING btree ("version__status");
  CREATE INDEX "_reports_v_created_at_idx" ON "_reports_v" USING btree ("created_at");
  CREATE INDEX "_reports_v_updated_at_idx" ON "_reports_v" USING btree ("updated_at");
  CREATE INDEX "_reports_v_snapshot_idx" ON "_reports_v" USING btree ("snapshot");
  CREATE INDEX "_reports_v_published_locale_idx" ON "_reports_v" USING btree ("published_locale");
  CREATE INDEX "_reports_v_latest_idx" ON "_reports_v" USING btree ("latest");
  CREATE INDEX "_reports_v_version_version_slug_idx" ON "_reports_v_locales" USING btree ("version_slug","_locale");
  CREATE UNIQUE INDEX "_reports_v_locales_locale_parent_id_unique" ON "_reports_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "job_openings_category_idx" ON "job_openings" USING btree ("category_id");
  CREATE INDEX "job_openings_approval_status_idx" ON "job_openings" USING btree ("approval_status");
  CREATE INDEX "job_openings_submitted_by_idx" ON "job_openings" USING btree ("submitted_by_id");
  CREATE INDEX "job_openings_reviewed_by_idx" ON "job_openings" USING btree ("reviewed_by_id");
  CREATE INDEX "job_openings_updated_at_idx" ON "job_openings" USING btree ("updated_at");
  CREATE INDEX "job_openings_created_at_idx" ON "job_openings" USING btree ("created_at");
  CREATE INDEX "job_openings__status_idx" ON "job_openings" USING btree ("_status");
  CREATE INDEX "job_openings_slug_idx" ON "job_openings_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "job_openings_locales_locale_parent_id_unique" ON "job_openings_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_job_openings_v_parent_idx" ON "_job_openings_v" USING btree ("parent_id");
  CREATE INDEX "_job_openings_v_version_version_category_idx" ON "_job_openings_v" USING btree ("version_category_id");
  CREATE INDEX "_job_openings_v_version_version_approval_status_idx" ON "_job_openings_v" USING btree ("version_approval_status");
  CREATE INDEX "_job_openings_v_version_version_submitted_by_idx" ON "_job_openings_v" USING btree ("version_submitted_by_id");
  CREATE INDEX "_job_openings_v_version_version_reviewed_by_idx" ON "_job_openings_v" USING btree ("version_reviewed_by_id");
  CREATE INDEX "_job_openings_v_version_version_updated_at_idx" ON "_job_openings_v" USING btree ("version_updated_at");
  CREATE INDEX "_job_openings_v_version_version_created_at_idx" ON "_job_openings_v" USING btree ("version_created_at");
  CREATE INDEX "_job_openings_v_version_version__status_idx" ON "_job_openings_v" USING btree ("version__status");
  CREATE INDEX "_job_openings_v_created_at_idx" ON "_job_openings_v" USING btree ("created_at");
  CREATE INDEX "_job_openings_v_updated_at_idx" ON "_job_openings_v" USING btree ("updated_at");
  CREATE INDEX "_job_openings_v_snapshot_idx" ON "_job_openings_v" USING btree ("snapshot");
  CREATE INDEX "_job_openings_v_published_locale_idx" ON "_job_openings_v" USING btree ("published_locale");
  CREATE INDEX "_job_openings_v_latest_idx" ON "_job_openings_v" USING btree ("latest");
  CREATE INDEX "_job_openings_v_version_version_slug_idx" ON "_job_openings_v_locales" USING btree ("version_slug","_locale");
  CREATE UNIQUE INDEX "_job_openings_v_locales_locale_parent_id_unique" ON "_job_openings_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "job_categories_updated_at_idx" ON "job_categories" USING btree ("updated_at");
  CREATE INDEX "job_categories_created_at_idx" ON "job_categories" USING btree ("created_at");
  CREATE INDEX "job_categories__status_idx" ON "job_categories" USING btree ("_status");
  CREATE UNIQUE INDEX "job_categories_locales_locale_parent_id_unique" ON "job_categories_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_job_categories_v_parent_idx" ON "_job_categories_v" USING btree ("parent_id");
  CREATE INDEX "_job_categories_v_version_version_updated_at_idx" ON "_job_categories_v" USING btree ("version_updated_at");
  CREATE INDEX "_job_categories_v_version_version_created_at_idx" ON "_job_categories_v" USING btree ("version_created_at");
  CREATE INDEX "_job_categories_v_version_version__status_idx" ON "_job_categories_v" USING btree ("version__status");
  CREATE INDEX "_job_categories_v_created_at_idx" ON "_job_categories_v" USING btree ("created_at");
  CREATE INDEX "_job_categories_v_updated_at_idx" ON "_job_categories_v" USING btree ("updated_at");
  CREATE INDEX "_job_categories_v_snapshot_idx" ON "_job_categories_v" USING btree ("snapshot");
  CREATE INDEX "_job_categories_v_published_locale_idx" ON "_job_categories_v" USING btree ("published_locale");
  CREATE INDEX "_job_categories_v_latest_idx" ON "_job_categories_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_job_categories_v_locales_locale_parent_id_unique" ON "_job_categories_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "product_categories_advantages_order_idx" ON "product_categories_advantages" USING btree ("_order");
  CREATE INDEX "product_categories_advantages_parent_id_idx" ON "product_categories_advantages" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "product_categories_advantages_locales_locale_parent_id_uniqu" ON "product_categories_advantages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "product_categories_icon_idx" ON "product_categories" USING btree ("icon_id");
  CREATE INDEX "product_categories_image_idx" ON "product_categories" USING btree ("image_id");
  CREATE INDEX "product_categories_approval_status_idx" ON "product_categories" USING btree ("approval_status");
  CREATE INDEX "product_categories_submitted_by_idx" ON "product_categories" USING btree ("submitted_by_id");
  CREATE INDEX "product_categories_reviewed_by_idx" ON "product_categories" USING btree ("reviewed_by_id");
  CREATE INDEX "product_categories_updated_at_idx" ON "product_categories" USING btree ("updated_at");
  CREATE INDEX "product_categories_created_at_idx" ON "product_categories" USING btree ("created_at");
  CREATE INDEX "product_categories__status_idx" ON "product_categories" USING btree ("_status");
  CREATE INDEX "product_categories_slug_idx" ON "product_categories_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "product_categories_locales_locale_parent_id_unique" ON "product_categories_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_product_categories_v_version_advantages_order_idx" ON "_product_categories_v_version_advantages" USING btree ("_order");
  CREATE INDEX "_product_categories_v_version_advantages_parent_id_idx" ON "_product_categories_v_version_advantages" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_product_categories_v_version_advantages_locales_locale_pare" ON "_product_categories_v_version_advantages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_product_categories_v_parent_idx" ON "_product_categories_v" USING btree ("parent_id");
  CREATE INDEX "_product_categories_v_version_version_icon_idx" ON "_product_categories_v" USING btree ("version_icon_id");
  CREATE INDEX "_product_categories_v_version_version_image_idx" ON "_product_categories_v" USING btree ("version_image_id");
  CREATE INDEX "_product_categories_v_version_version_approval_status_idx" ON "_product_categories_v" USING btree ("version_approval_status");
  CREATE INDEX "_product_categories_v_version_version_submitted_by_idx" ON "_product_categories_v" USING btree ("version_submitted_by_id");
  CREATE INDEX "_product_categories_v_version_version_reviewed_by_idx" ON "_product_categories_v" USING btree ("version_reviewed_by_id");
  CREATE INDEX "_product_categories_v_version_version_updated_at_idx" ON "_product_categories_v" USING btree ("version_updated_at");
  CREATE INDEX "_product_categories_v_version_version_created_at_idx" ON "_product_categories_v" USING btree ("version_created_at");
  CREATE INDEX "_product_categories_v_version_version__status_idx" ON "_product_categories_v" USING btree ("version__status");
  CREATE INDEX "_product_categories_v_created_at_idx" ON "_product_categories_v" USING btree ("created_at");
  CREATE INDEX "_product_categories_v_updated_at_idx" ON "_product_categories_v" USING btree ("updated_at");
  CREATE INDEX "_product_categories_v_snapshot_idx" ON "_product_categories_v" USING btree ("snapshot");
  CREATE INDEX "_product_categories_v_published_locale_idx" ON "_product_categories_v" USING btree ("published_locale");
  CREATE INDEX "_product_categories_v_latest_idx" ON "_product_categories_v" USING btree ("latest");
  CREATE INDEX "_product_categories_v_version_version_slug_idx" ON "_product_categories_v_locales" USING btree ("version_slug","_locale");
  CREATE UNIQUE INDEX "_product_categories_v_locales_locale_parent_id_unique" ON "_product_categories_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "product_items_use_cases_order_idx" ON "product_items_use_cases" USING btree ("_order");
  CREATE INDEX "product_items_use_cases_parent_id_idx" ON "product_items_use_cases" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "product_items_use_cases_locales_locale_parent_id_unique" ON "product_items_use_cases_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "product_items_category_idx" ON "product_items" USING btree ("category_id");
  CREATE INDEX "product_items_approval_status_idx" ON "product_items" USING btree ("approval_status");
  CREATE INDEX "product_items_submitted_by_idx" ON "product_items" USING btree ("submitted_by_id");
  CREATE INDEX "product_items_reviewed_by_idx" ON "product_items" USING btree ("reviewed_by_id");
  CREATE INDEX "product_items_updated_at_idx" ON "product_items" USING btree ("updated_at");
  CREATE INDEX "product_items_created_at_idx" ON "product_items" USING btree ("created_at");
  CREATE INDEX "product_items__status_idx" ON "product_items" USING btree ("_status");
  CREATE UNIQUE INDEX "product_items_locales_locale_parent_id_unique" ON "product_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_product_items_v_version_use_cases_order_idx" ON "_product_items_v_version_use_cases" USING btree ("_order");
  CREATE INDEX "_product_items_v_version_use_cases_parent_id_idx" ON "_product_items_v_version_use_cases" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_product_items_v_version_use_cases_locales_locale_parent_id_" ON "_product_items_v_version_use_cases_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_product_items_v_parent_idx" ON "_product_items_v" USING btree ("parent_id");
  CREATE INDEX "_product_items_v_version_version_category_idx" ON "_product_items_v" USING btree ("version_category_id");
  CREATE INDEX "_product_items_v_version_version_approval_status_idx" ON "_product_items_v" USING btree ("version_approval_status");
  CREATE INDEX "_product_items_v_version_version_submitted_by_idx" ON "_product_items_v" USING btree ("version_submitted_by_id");
  CREATE INDEX "_product_items_v_version_version_reviewed_by_idx" ON "_product_items_v" USING btree ("version_reviewed_by_id");
  CREATE INDEX "_product_items_v_version_version_updated_at_idx" ON "_product_items_v" USING btree ("version_updated_at");
  CREATE INDEX "_product_items_v_version_version_created_at_idx" ON "_product_items_v" USING btree ("version_created_at");
  CREATE INDEX "_product_items_v_version_version__status_idx" ON "_product_items_v" USING btree ("version__status");
  CREATE INDEX "_product_items_v_created_at_idx" ON "_product_items_v" USING btree ("created_at");
  CREATE INDEX "_product_items_v_updated_at_idx" ON "_product_items_v" USING btree ("updated_at");
  CREATE INDEX "_product_items_v_snapshot_idx" ON "_product_items_v" USING btree ("snapshot");
  CREATE INDEX "_product_items_v_published_locale_idx" ON "_product_items_v" USING btree ("published_locale");
  CREATE INDEX "_product_items_v_latest_idx" ON "_product_items_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_product_items_v_locales_locale_parent_id_unique" ON "_product_items_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "hero_slides_image_idx" ON "hero_slides" USING btree ("image_id");
  CREATE INDEX "hero_slides_approval_status_idx" ON "hero_slides" USING btree ("approval_status");
  CREATE INDEX "hero_slides_submitted_by_idx" ON "hero_slides" USING btree ("submitted_by_id");
  CREATE INDEX "hero_slides_reviewed_by_idx" ON "hero_slides" USING btree ("reviewed_by_id");
  CREATE INDEX "hero_slides_updated_at_idx" ON "hero_slides" USING btree ("updated_at");
  CREATE INDEX "hero_slides_created_at_idx" ON "hero_slides" USING btree ("created_at");
  CREATE INDEX "hero_slides__status_idx" ON "hero_slides" USING btree ("_status");
  CREATE UNIQUE INDEX "hero_slides_locales_locale_parent_id_unique" ON "hero_slides_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_hero_slides_v_parent_idx" ON "_hero_slides_v" USING btree ("parent_id");
  CREATE INDEX "_hero_slides_v_version_version_image_idx" ON "_hero_slides_v" USING btree ("version_image_id");
  CREATE INDEX "_hero_slides_v_version_version_approval_status_idx" ON "_hero_slides_v" USING btree ("version_approval_status");
  CREATE INDEX "_hero_slides_v_version_version_submitted_by_idx" ON "_hero_slides_v" USING btree ("version_submitted_by_id");
  CREATE INDEX "_hero_slides_v_version_version_reviewed_by_idx" ON "_hero_slides_v" USING btree ("version_reviewed_by_id");
  CREATE INDEX "_hero_slides_v_version_version_updated_at_idx" ON "_hero_slides_v" USING btree ("version_updated_at");
  CREATE INDEX "_hero_slides_v_version_version_created_at_idx" ON "_hero_slides_v" USING btree ("version_created_at");
  CREATE INDEX "_hero_slides_v_version_version__status_idx" ON "_hero_slides_v" USING btree ("version__status");
  CREATE INDEX "_hero_slides_v_created_at_idx" ON "_hero_slides_v" USING btree ("created_at");
  CREATE INDEX "_hero_slides_v_updated_at_idx" ON "_hero_slides_v" USING btree ("updated_at");
  CREATE INDEX "_hero_slides_v_snapshot_idx" ON "_hero_slides_v" USING btree ("snapshot");
  CREATE INDEX "_hero_slides_v_published_locale_idx" ON "_hero_slides_v" USING btree ("published_locale");
  CREATE INDEX "_hero_slides_v_latest_idx" ON "_hero_slides_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_hero_slides_v_locales_locale_parent_id_unique" ON "_hero_slides_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "stats_icon_idx" ON "stats" USING btree ("icon_id");
  CREATE INDEX "stats_approval_status_idx" ON "stats" USING btree ("approval_status");
  CREATE INDEX "stats_submitted_by_idx" ON "stats" USING btree ("submitted_by_id");
  CREATE INDEX "stats_reviewed_by_idx" ON "stats" USING btree ("reviewed_by_id");
  CREATE INDEX "stats_updated_at_idx" ON "stats" USING btree ("updated_at");
  CREATE INDEX "stats_created_at_idx" ON "stats" USING btree ("created_at");
  CREATE INDEX "stats__status_idx" ON "stats" USING btree ("_status");
  CREATE UNIQUE INDEX "stats_locales_locale_parent_id_unique" ON "stats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_stats_v_parent_idx" ON "_stats_v" USING btree ("parent_id");
  CREATE INDEX "_stats_v_version_version_icon_idx" ON "_stats_v" USING btree ("version_icon_id");
  CREATE INDEX "_stats_v_version_version_approval_status_idx" ON "_stats_v" USING btree ("version_approval_status");
  CREATE INDEX "_stats_v_version_version_submitted_by_idx" ON "_stats_v" USING btree ("version_submitted_by_id");
  CREATE INDEX "_stats_v_version_version_reviewed_by_idx" ON "_stats_v" USING btree ("version_reviewed_by_id");
  CREATE INDEX "_stats_v_version_version_updated_at_idx" ON "_stats_v" USING btree ("version_updated_at");
  CREATE INDEX "_stats_v_version_version_created_at_idx" ON "_stats_v" USING btree ("version_created_at");
  CREATE INDEX "_stats_v_version_version__status_idx" ON "_stats_v" USING btree ("version__status");
  CREATE INDEX "_stats_v_created_at_idx" ON "_stats_v" USING btree ("created_at");
  CREATE INDEX "_stats_v_updated_at_idx" ON "_stats_v" USING btree ("updated_at");
  CREATE INDEX "_stats_v_snapshot_idx" ON "_stats_v" USING btree ("snapshot");
  CREATE INDEX "_stats_v_published_locale_idx" ON "_stats_v" USING btree ("published_locale");
  CREATE INDEX "_stats_v_latest_idx" ON "_stats_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_stats_v_locales_locale_parent_id_unique" ON "_stats_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "testimonials_logo_idx" ON "testimonials" USING btree ("logo_id");
  CREATE INDEX "testimonials_approval_status_idx" ON "testimonials" USING btree ("approval_status");
  CREATE INDEX "testimonials_submitted_by_idx" ON "testimonials" USING btree ("submitted_by_id");
  CREATE INDEX "testimonials_reviewed_by_idx" ON "testimonials" USING btree ("reviewed_by_id");
  CREATE INDEX "testimonials_updated_at_idx" ON "testimonials" USING btree ("updated_at");
  CREATE INDEX "testimonials_created_at_idx" ON "testimonials" USING btree ("created_at");
  CREATE INDEX "testimonials__status_idx" ON "testimonials" USING btree ("_status");
  CREATE UNIQUE INDEX "testimonials_locales_locale_parent_id_unique" ON "testimonials_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_testimonials_v_parent_idx" ON "_testimonials_v" USING btree ("parent_id");
  CREATE INDEX "_testimonials_v_version_version_logo_idx" ON "_testimonials_v" USING btree ("version_logo_id");
  CREATE INDEX "_testimonials_v_version_version_approval_status_idx" ON "_testimonials_v" USING btree ("version_approval_status");
  CREATE INDEX "_testimonials_v_version_version_submitted_by_idx" ON "_testimonials_v" USING btree ("version_submitted_by_id");
  CREATE INDEX "_testimonials_v_version_version_reviewed_by_idx" ON "_testimonials_v" USING btree ("version_reviewed_by_id");
  CREATE INDEX "_testimonials_v_version_version_updated_at_idx" ON "_testimonials_v" USING btree ("version_updated_at");
  CREATE INDEX "_testimonials_v_version_version_created_at_idx" ON "_testimonials_v" USING btree ("version_created_at");
  CREATE INDEX "_testimonials_v_version_version__status_idx" ON "_testimonials_v" USING btree ("version__status");
  CREATE INDEX "_testimonials_v_created_at_idx" ON "_testimonials_v" USING btree ("created_at");
  CREATE INDEX "_testimonials_v_updated_at_idx" ON "_testimonials_v" USING btree ("updated_at");
  CREATE INDEX "_testimonials_v_snapshot_idx" ON "_testimonials_v" USING btree ("snapshot");
  CREATE INDEX "_testimonials_v_published_locale_idx" ON "_testimonials_v" USING btree ("published_locale");
  CREATE INDEX "_testimonials_v_latest_idx" ON "_testimonials_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_testimonials_v_locales_locale_parent_id_unique" ON "_testimonials_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "milestones_items_order_idx" ON "milestones_items" USING btree ("_order");
  CREATE INDEX "milestones_items_parent_id_idx" ON "milestones_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "milestones_items_locales_locale_parent_id_unique" ON "milestones_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "milestones_approval_status_idx" ON "milestones" USING btree ("approval_status");
  CREATE INDEX "milestones_submitted_by_idx" ON "milestones" USING btree ("submitted_by_id");
  CREATE INDEX "milestones_reviewed_by_idx" ON "milestones" USING btree ("reviewed_by_id");
  CREATE INDEX "milestones_updated_at_idx" ON "milestones" USING btree ("updated_at");
  CREATE INDEX "milestones_created_at_idx" ON "milestones" USING btree ("created_at");
  CREATE INDEX "milestones__status_idx" ON "milestones" USING btree ("_status");
  CREATE INDEX "_milestones_v_version_items_order_idx" ON "_milestones_v_version_items" USING btree ("_order");
  CREATE INDEX "_milestones_v_version_items_parent_id_idx" ON "_milestones_v_version_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_milestones_v_version_items_locales_locale_parent_id_unique" ON "_milestones_v_version_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_milestones_v_parent_idx" ON "_milestones_v" USING btree ("parent_id");
  CREATE INDEX "_milestones_v_version_version_approval_status_idx" ON "_milestones_v" USING btree ("version_approval_status");
  CREATE INDEX "_milestones_v_version_version_submitted_by_idx" ON "_milestones_v" USING btree ("version_submitted_by_id");
  CREATE INDEX "_milestones_v_version_version_reviewed_by_idx" ON "_milestones_v" USING btree ("version_reviewed_by_id");
  CREATE INDEX "_milestones_v_version_version_updated_at_idx" ON "_milestones_v" USING btree ("version_updated_at");
  CREATE INDEX "_milestones_v_version_version_created_at_idx" ON "_milestones_v" USING btree ("version_created_at");
  CREATE INDEX "_milestones_v_version_version__status_idx" ON "_milestones_v" USING btree ("version__status");
  CREATE INDEX "_milestones_v_created_at_idx" ON "_milestones_v" USING btree ("created_at");
  CREATE INDEX "_milestones_v_updated_at_idx" ON "_milestones_v" USING btree ("updated_at");
  CREATE INDEX "_milestones_v_snapshot_idx" ON "_milestones_v" USING btree ("snapshot");
  CREATE INDEX "_milestones_v_published_locale_idx" ON "_milestones_v" USING btree ("published_locale");
  CREATE INDEX "_milestones_v_latest_idx" ON "_milestones_v" USING btree ("latest");
  CREATE INDEX "partner_logos_logo_idx" ON "partner_logos" USING btree ("logo_id");
  CREATE INDEX "partner_logos_updated_at_idx" ON "partner_logos" USING btree ("updated_at");
  CREATE INDEX "partner_logos_created_at_idx" ON "partner_logos" USING btree ("created_at");
  CREATE INDEX "partner_logos__status_idx" ON "partner_logos" USING btree ("_status");
  CREATE INDEX "_partner_logos_v_parent_idx" ON "_partner_logos_v" USING btree ("parent_id");
  CREATE INDEX "_partner_logos_v_version_version_logo_idx" ON "_partner_logos_v" USING btree ("version_logo_id");
  CREATE INDEX "_partner_logos_v_version_version_updated_at_idx" ON "_partner_logos_v" USING btree ("version_updated_at");
  CREATE INDEX "_partner_logos_v_version_version_created_at_idx" ON "_partner_logos_v" USING btree ("version_created_at");
  CREATE INDEX "_partner_logos_v_version_version__status_idx" ON "_partner_logos_v" USING btree ("version__status");
  CREATE INDEX "_partner_logos_v_created_at_idx" ON "_partner_logos_v" USING btree ("created_at");
  CREATE INDEX "_partner_logos_v_updated_at_idx" ON "_partner_logos_v" USING btree ("updated_at");
  CREATE INDEX "_partner_logos_v_snapshot_idx" ON "_partner_logos_v" USING btree ("snapshot");
  CREATE INDEX "_partner_logos_v_published_locale_idx" ON "_partner_logos_v" USING btree ("published_locale");
  CREATE INDEX "_partner_logos_v_latest_idx" ON "_partner_logos_v" USING btree ("latest");
  CREATE INDEX "cta_blocks_cross_link_cross_link_image_idx" ON "cta_blocks" USING btree ("cross_link_image_id");
  CREATE INDEX "cta_blocks_banner_banner_background_image_idx" ON "cta_blocks" USING btree ("banner_background_image_id");
  CREATE INDEX "cta_blocks_approval_status_idx" ON "cta_blocks" USING btree ("approval_status");
  CREATE INDEX "cta_blocks_submitted_by_idx" ON "cta_blocks" USING btree ("submitted_by_id");
  CREATE INDEX "cta_blocks_reviewed_by_idx" ON "cta_blocks" USING btree ("reviewed_by_id");
  CREATE INDEX "cta_blocks_updated_at_idx" ON "cta_blocks" USING btree ("updated_at");
  CREATE INDEX "cta_blocks_created_at_idx" ON "cta_blocks" USING btree ("created_at");
  CREATE INDEX "cta_blocks__status_idx" ON "cta_blocks" USING btree ("_status");
  CREATE UNIQUE INDEX "cta_blocks_locales_locale_parent_id_unique" ON "cta_blocks_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_cta_blocks_v_parent_idx" ON "_cta_blocks_v" USING btree ("parent_id");
  CREATE INDEX "_cta_blocks_v_version_cross_link_version_cross_link_imag_idx" ON "_cta_blocks_v" USING btree ("version_cross_link_image_id");
  CREATE INDEX "_cta_blocks_v_version_banner_version_banner_background_i_idx" ON "_cta_blocks_v" USING btree ("version_banner_background_image_id");
  CREATE INDEX "_cta_blocks_v_version_version_approval_status_idx" ON "_cta_blocks_v" USING btree ("version_approval_status");
  CREATE INDEX "_cta_blocks_v_version_version_submitted_by_idx" ON "_cta_blocks_v" USING btree ("version_submitted_by_id");
  CREATE INDEX "_cta_blocks_v_version_version_reviewed_by_idx" ON "_cta_blocks_v" USING btree ("version_reviewed_by_id");
  CREATE INDEX "_cta_blocks_v_version_version_updated_at_idx" ON "_cta_blocks_v" USING btree ("version_updated_at");
  CREATE INDEX "_cta_blocks_v_version_version_created_at_idx" ON "_cta_blocks_v" USING btree ("version_created_at");
  CREATE INDEX "_cta_blocks_v_version_version__status_idx" ON "_cta_blocks_v" USING btree ("version__status");
  CREATE INDEX "_cta_blocks_v_created_at_idx" ON "_cta_blocks_v" USING btree ("created_at");
  CREATE INDEX "_cta_blocks_v_updated_at_idx" ON "_cta_blocks_v" USING btree ("updated_at");
  CREATE INDEX "_cta_blocks_v_snapshot_idx" ON "_cta_blocks_v" USING btree ("snapshot");
  CREATE INDEX "_cta_blocks_v_published_locale_idx" ON "_cta_blocks_v" USING btree ("published_locale");
  CREATE INDEX "_cta_blocks_v_latest_idx" ON "_cta_blocks_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_cta_blocks_v_locales_locale_parent_id_unique" ON "_cta_blocks_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "page_content_sections_order_idx" ON "page_content_sections" USING btree ("_order");
  CREATE INDEX "page_content_sections_parent_id_idx" ON "page_content_sections" USING btree ("_parent_id");
  CREATE INDEX "page_content_sections_image_idx" ON "page_content_sections" USING btree ("image_id");
  CREATE UNIQUE INDEX "page_content_sections_locales_locale_parent_id_unique" ON "page_content_sections_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "page_content_page_idx" ON "page_content" USING btree ("page");
  CREATE INDEX "page_content_hero_image_idx" ON "page_content" USING btree ("hero_image_id");
  CREATE INDEX "page_content_approval_status_idx" ON "page_content" USING btree ("approval_status");
  CREATE INDEX "page_content_submitted_by_idx" ON "page_content" USING btree ("submitted_by_id");
  CREATE INDEX "page_content_reviewed_by_idx" ON "page_content" USING btree ("reviewed_by_id");
  CREATE INDEX "page_content_updated_at_idx" ON "page_content" USING btree ("updated_at");
  CREATE INDEX "page_content_created_at_idx" ON "page_content" USING btree ("created_at");
  CREATE INDEX "page_content__status_idx" ON "page_content" USING btree ("_status");
  CREATE UNIQUE INDEX "page_content_locales_locale_parent_id_unique" ON "page_content_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_page_content_v_version_sections_order_idx" ON "_page_content_v_version_sections" USING btree ("_order");
  CREATE INDEX "_page_content_v_version_sections_parent_id_idx" ON "_page_content_v_version_sections" USING btree ("_parent_id");
  CREATE INDEX "_page_content_v_version_sections_image_idx" ON "_page_content_v_version_sections" USING btree ("image_id");
  CREATE UNIQUE INDEX "_page_content_v_version_sections_locales_locale_parent_id_un" ON "_page_content_v_version_sections_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_page_content_v_parent_idx" ON "_page_content_v" USING btree ("parent_id");
  CREATE INDEX "_page_content_v_version_version_page_idx" ON "_page_content_v" USING btree ("version_page");
  CREATE INDEX "_page_content_v_version_version_hero_image_idx" ON "_page_content_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_page_content_v_version_version_approval_status_idx" ON "_page_content_v" USING btree ("version_approval_status");
  CREATE INDEX "_page_content_v_version_version_submitted_by_idx" ON "_page_content_v" USING btree ("version_submitted_by_id");
  CREATE INDEX "_page_content_v_version_version_reviewed_by_idx" ON "_page_content_v" USING btree ("version_reviewed_by_id");
  CREATE INDEX "_page_content_v_version_version_updated_at_idx" ON "_page_content_v" USING btree ("version_updated_at");
  CREATE INDEX "_page_content_v_version_version_created_at_idx" ON "_page_content_v" USING btree ("version_created_at");
  CREATE INDEX "_page_content_v_version_version__status_idx" ON "_page_content_v" USING btree ("version__status");
  CREATE INDEX "_page_content_v_created_at_idx" ON "_page_content_v" USING btree ("created_at");
  CREATE INDEX "_page_content_v_updated_at_idx" ON "_page_content_v" USING btree ("updated_at");
  CREATE INDEX "_page_content_v_snapshot_idx" ON "_page_content_v" USING btree ("snapshot");
  CREATE INDEX "_page_content_v_published_locale_idx" ON "_page_content_v" USING btree ("published_locale");
  CREATE INDEX "_page_content_v_latest_idx" ON "_page_content_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_page_content_v_locales_locale_parent_id_unique" ON "_page_content_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "static_pages_attachments_order_idx" ON "static_pages_attachments" USING btree ("_order");
  CREATE INDEX "static_pages_attachments_parent_id_idx" ON "static_pages_attachments" USING btree ("_parent_id");
  CREATE INDEX "static_pages_attachments_file_idx" ON "static_pages_attachments" USING btree ("file_id");
  CREATE UNIQUE INDEX "static_pages_attachments_locales_locale_parent_id_unique" ON "static_pages_attachments_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "static_pages_key_idx" ON "static_pages" USING btree ("key");
  CREATE INDEX "static_pages_updated_at_idx" ON "static_pages" USING btree ("updated_at");
  CREATE INDEX "static_pages_created_at_idx" ON "static_pages" USING btree ("created_at");
  CREATE INDEX "static_pages__status_idx" ON "static_pages" USING btree ("_status");
  CREATE UNIQUE INDEX "static_pages_locales_locale_parent_id_unique" ON "static_pages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_static_pages_v_version_attachments_order_idx" ON "_static_pages_v_version_attachments" USING btree ("_order");
  CREATE INDEX "_static_pages_v_version_attachments_parent_id_idx" ON "_static_pages_v_version_attachments" USING btree ("_parent_id");
  CREATE INDEX "_static_pages_v_version_attachments_file_idx" ON "_static_pages_v_version_attachments" USING btree ("file_id");
  CREATE UNIQUE INDEX "_static_pages_v_version_attachments_locales_locale_parent_id" ON "_static_pages_v_version_attachments_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_static_pages_v_parent_idx" ON "_static_pages_v" USING btree ("parent_id");
  CREATE INDEX "_static_pages_v_version_version_key_idx" ON "_static_pages_v" USING btree ("version_key");
  CREATE INDEX "_static_pages_v_version_version_updated_at_idx" ON "_static_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_static_pages_v_version_version_created_at_idx" ON "_static_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_static_pages_v_version_version__status_idx" ON "_static_pages_v" USING btree ("version__status");
  CREATE INDEX "_static_pages_v_created_at_idx" ON "_static_pages_v" USING btree ("created_at");
  CREATE INDEX "_static_pages_v_updated_at_idx" ON "_static_pages_v" USING btree ("updated_at");
  CREATE INDEX "_static_pages_v_snapshot_idx" ON "_static_pages_v" USING btree ("snapshot");
  CREATE INDEX "_static_pages_v_published_locale_idx" ON "_static_pages_v" USING btree ("published_locale");
  CREATE INDEX "_static_pages_v_latest_idx" ON "_static_pages_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_static_pages_v_locales_locale_parent_id_unique" ON "_static_pages_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "contact_submissions_marketing_channels_order_idx" ON "contact_submissions_marketing_channels" USING btree ("order");
  CREATE INDEX "contact_submissions_marketing_channels_parent_idx" ON "contact_submissions_marketing_channels" USING btree ("parent_id");
  CREATE INDEX "contact_submissions_email_idx" ON "contact_submissions" USING btree ("email");
  CREATE INDEX "contact_submissions_phone_idx" ON "contact_submissions" USING btree ("phone");
  CREATE INDEX "contact_submissions_ip_address_idx" ON "contact_submissions" USING btree ("ip_address");
  CREATE INDEX "contact_submissions_followed_up_by_idx" ON "contact_submissions" USING btree ("followed_up_by_id");
  CREATE INDEX "contact_submissions_updated_at_idx" ON "contact_submissions" USING btree ("updated_at");
  CREATE INDEX "contact_submissions_created_at_idx" ON "contact_submissions" USING btree ("created_at");
  CREATE INDEX "audit_log_action_idx" ON "audit_log" USING btree ("action");
  CREATE INDEX "audit_log_collection_slug_idx" ON "audit_log" USING btree ("collection_slug");
  CREATE INDEX "audit_log_document_id_idx" ON "audit_log" USING btree ("document_id");
  CREATE INDEX "audit_log_user_idx" ON "audit_log" USING btree ("user_id");
  CREATE INDEX "audit_log_updated_at_idx" ON "audit_log" USING btree ("updated_at");
  CREATE INDEX "audit_log_created_at_idx" ON "audit_log" USING btree ("created_at");
  CREATE INDEX "home_settings_approval_status_idx" ON "home_settings" USING btree ("approval_status");
  CREATE INDEX "home_settings_submitted_by_idx" ON "home_settings" USING btree ("submitted_by_id");
  CREATE INDEX "home_settings_reviewed_by_idx" ON "home_settings" USING btree ("reviewed_by_id");
  CREATE INDEX "home_settings__status_idx" ON "home_settings" USING btree ("_status");
  CREATE UNIQUE INDEX "home_settings_locales_locale_parent_id_unique" ON "home_settings_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_settings_v_version_version_approval_status_idx" ON "_home_settings_v" USING btree ("version_approval_status");
  CREATE INDEX "_home_settings_v_version_version_submitted_by_idx" ON "_home_settings_v" USING btree ("version_submitted_by_id");
  CREATE INDEX "_home_settings_v_version_version_reviewed_by_idx" ON "_home_settings_v" USING btree ("version_reviewed_by_id");
  CREATE INDEX "_home_settings_v_version_version__status_idx" ON "_home_settings_v" USING btree ("version__status");
  CREATE INDEX "_home_settings_v_created_at_idx" ON "_home_settings_v" USING btree ("created_at");
  CREATE INDEX "_home_settings_v_updated_at_idx" ON "_home_settings_v" USING btree ("updated_at");
  CREATE INDEX "_home_settings_v_snapshot_idx" ON "_home_settings_v" USING btree ("snapshot");
  CREATE INDEX "_home_settings_v_published_locale_idx" ON "_home_settings_v" USING btree ("published_locale");
  CREATE INDEX "_home_settings_v_latest_idx" ON "_home_settings_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_home_settings_v_locales_locale_parent_id_unique" ON "_home_settings_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "career_page_hero_images_order_idx" ON "career_page_hero_images" USING btree ("_order");
  CREATE INDEX "career_page_hero_images_parent_id_idx" ON "career_page_hero_images" USING btree ("_parent_id");
  CREATE INDEX "career_page_hero_images_image_idx" ON "career_page_hero_images" USING btree ("image_id");
  CREATE INDEX "career_page_values_order_idx" ON "career_page_values" USING btree ("_order");
  CREATE INDEX "career_page_values_parent_id_idx" ON "career_page_values" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "career_page_values_locales_locale_parent_id_unique" ON "career_page_values_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "career_page_benefits_order_idx" ON "career_page_benefits" USING btree ("_order");
  CREATE INDEX "career_page_benefits_parent_id_idx" ON "career_page_benefits" USING btree ("_parent_id");
  CREATE INDEX "career_page_benefits_icon_idx" ON "career_page_benefits" USING btree ("icon_id");
  CREATE UNIQUE INDEX "career_page_benefits_locales_locale_parent_id_unique" ON "career_page_benefits_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "career_page_recruitment_steps_order_idx" ON "career_page_recruitment_steps" USING btree ("_order");
  CREATE INDEX "career_page_recruitment_steps_parent_id_idx" ON "career_page_recruitment_steps" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "career_page_recruitment_steps_locales_locale_parent_id_uniqu" ON "career_page_recruitment_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "career_page_approval_status_idx" ON "career_page" USING btree ("approval_status");
  CREATE INDEX "career_page_submitted_by_idx" ON "career_page" USING btree ("submitted_by_id");
  CREATE INDEX "career_page_reviewed_by_idx" ON "career_page" USING btree ("reviewed_by_id");
  CREATE INDEX "career_page__status_idx" ON "career_page" USING btree ("_status");
  CREATE UNIQUE INDEX "career_page_locales_locale_parent_id_unique" ON "career_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_career_page_v_version_hero_images_order_idx" ON "_career_page_v_version_hero_images" USING btree ("_order");
  CREATE INDEX "_career_page_v_version_hero_images_parent_id_idx" ON "_career_page_v_version_hero_images" USING btree ("_parent_id");
  CREATE INDEX "_career_page_v_version_hero_images_image_idx" ON "_career_page_v_version_hero_images" USING btree ("image_id");
  CREATE INDEX "_career_page_v_version_values_order_idx" ON "_career_page_v_version_values" USING btree ("_order");
  CREATE INDEX "_career_page_v_version_values_parent_id_idx" ON "_career_page_v_version_values" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_career_page_v_version_values_locales_locale_parent_id_uniqu" ON "_career_page_v_version_values_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_career_page_v_version_benefits_order_idx" ON "_career_page_v_version_benefits" USING btree ("_order");
  CREATE INDEX "_career_page_v_version_benefits_parent_id_idx" ON "_career_page_v_version_benefits" USING btree ("_parent_id");
  CREATE INDEX "_career_page_v_version_benefits_icon_idx" ON "_career_page_v_version_benefits" USING btree ("icon_id");
  CREATE UNIQUE INDEX "_career_page_v_version_benefits_locales_locale_parent_id_uni" ON "_career_page_v_version_benefits_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_career_page_v_version_recruitment_steps_order_idx" ON "_career_page_v_version_recruitment_steps" USING btree ("_order");
  CREATE INDEX "_career_page_v_version_recruitment_steps_parent_id_idx" ON "_career_page_v_version_recruitment_steps" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_career_page_v_version_recruitment_steps_locales_locale_pare" ON "_career_page_v_version_recruitment_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_career_page_v_version_version_approval_status_idx" ON "_career_page_v" USING btree ("version_approval_status");
  CREATE INDEX "_career_page_v_version_version_submitted_by_idx" ON "_career_page_v" USING btree ("version_submitted_by_id");
  CREATE INDEX "_career_page_v_version_version_reviewed_by_idx" ON "_career_page_v" USING btree ("version_reviewed_by_id");
  CREATE INDEX "_career_page_v_version_version__status_idx" ON "_career_page_v" USING btree ("version__status");
  CREATE INDEX "_career_page_v_created_at_idx" ON "_career_page_v" USING btree ("created_at");
  CREATE INDEX "_career_page_v_updated_at_idx" ON "_career_page_v" USING btree ("updated_at");
  CREATE INDEX "_career_page_v_snapshot_idx" ON "_career_page_v" USING btree ("snapshot");
  CREATE INDEX "_career_page_v_published_locale_idx" ON "_career_page_v" USING btree ("published_locale");
  CREATE INDEX "_career_page_v_latest_idx" ON "_career_page_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_career_page_v_locales_locale_parent_id_unique" ON "_career_page_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_settings_social_links_order_idx" ON "site_settings_social_links" USING btree ("_order");
  CREATE INDEX "site_settings_social_links_parent_id_idx" ON "site_settings_social_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "site_settings_locales_locale_parent_id_unique" ON "site_settings_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_authors_fk" FOREIGN KEY ("authors_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_outlets_fk" FOREIGN KEY ("media_outlets_id") REFERENCES "public"."media_outlets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_coverage_fk" FOREIGN KEY ("media_coverage_id") REFERENCES "public"."media_coverage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_reports_fk" FOREIGN KEY ("reports_id") REFERENCES "public"."reports"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_job_openings_fk" FOREIGN KEY ("job_openings_id") REFERENCES "public"."job_openings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_job_categories_fk" FOREIGN KEY ("job_categories_id") REFERENCES "public"."job_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_product_categories_fk" FOREIGN KEY ("product_categories_id") REFERENCES "public"."product_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_product_items_fk" FOREIGN KEY ("product_items_id") REFERENCES "public"."product_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_hero_slides_fk" FOREIGN KEY ("hero_slides_id") REFERENCES "public"."hero_slides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_stats_fk" FOREIGN KEY ("stats_id") REFERENCES "public"."stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_milestones_fk" FOREIGN KEY ("milestones_id") REFERENCES "public"."milestones"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_partner_logos_fk" FOREIGN KEY ("partner_logos_id") REFERENCES "public"."partner_logos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_cta_blocks_fk" FOREIGN KEY ("cta_blocks_id") REFERENCES "public"."cta_blocks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_page_content_fk" FOREIGN KEY ("page_content_id") REFERENCES "public"."page_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_static_pages_fk" FOREIGN KEY ("static_pages_id") REFERENCES "public"."static_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contact_submissions_fk" FOREIGN KEY ("contact_submissions_id") REFERENCES "public"."contact_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_audit_log_fk" FOREIGN KEY ("audit_log_id") REFERENCES "public"."audit_log"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_articles_id_idx" ON "payload_locked_documents_rels" USING btree ("articles_id");
  CREATE INDEX "payload_locked_documents_rels_authors_id_idx" ON "payload_locked_documents_rels" USING btree ("authors_id");
  CREATE INDEX "payload_locked_documents_rels_media_outlets_id_idx" ON "payload_locked_documents_rels" USING btree ("media_outlets_id");
  CREATE INDEX "payload_locked_documents_rels_media_coverage_id_idx" ON "payload_locked_documents_rels" USING btree ("media_coverage_id");
  CREATE INDEX "payload_locked_documents_rels_reports_id_idx" ON "payload_locked_documents_rels" USING btree ("reports_id");
  CREATE INDEX "payload_locked_documents_rels_job_openings_id_idx" ON "payload_locked_documents_rels" USING btree ("job_openings_id");
  CREATE INDEX "payload_locked_documents_rels_job_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("job_categories_id");
  CREATE INDEX "payload_locked_documents_rels_product_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("product_categories_id");
  CREATE INDEX "payload_locked_documents_rels_product_items_id_idx" ON "payload_locked_documents_rels" USING btree ("product_items_id");
  CREATE INDEX "payload_locked_documents_rels_hero_slides_id_idx" ON "payload_locked_documents_rels" USING btree ("hero_slides_id");
  CREATE INDEX "payload_locked_documents_rels_stats_id_idx" ON "payload_locked_documents_rels" USING btree ("stats_id");
  CREATE INDEX "payload_locked_documents_rels_testimonials_id_idx" ON "payload_locked_documents_rels" USING btree ("testimonials_id");
  CREATE INDEX "payload_locked_documents_rels_milestones_id_idx" ON "payload_locked_documents_rels" USING btree ("milestones_id");
  CREATE INDEX "payload_locked_documents_rels_partner_logos_id_idx" ON "payload_locked_documents_rels" USING btree ("partner_logos_id");
  CREATE INDEX "payload_locked_documents_rels_cta_blocks_id_idx" ON "payload_locked_documents_rels" USING btree ("cta_blocks_id");
  CREATE INDEX "payload_locked_documents_rels_page_content_id_idx" ON "payload_locked_documents_rels" USING btree ("page_content_id");
  CREATE INDEX "payload_locked_documents_rels_static_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("static_pages_id");
  CREATE INDEX "payload_locked_documents_rels_contact_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("contact_submissions_id");
  CREATE INDEX "payload_locked_documents_rels_audit_log_id_idx" ON "payload_locked_documents_rels" USING btree ("audit_log_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "articles" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "articles_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_articles_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_articles_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "authors" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_authors_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "media_outlets" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "media_outlets_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_media_outlets_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_media_outlets_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "media_coverage" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "media_coverage_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_media_coverage_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_media_coverage_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "reports" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "reports_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_reports_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_reports_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "job_openings" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "job_openings_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_job_openings_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_job_openings_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "job_categories" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "job_categories_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_job_categories_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_job_categories_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "product_categories_advantages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "product_categories_advantages_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "product_categories" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "product_categories_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_product_categories_v_version_advantages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_product_categories_v_version_advantages_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_product_categories_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_product_categories_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "product_items_use_cases" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "product_items_use_cases_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "product_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "product_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_product_items_v_version_use_cases" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_product_items_v_version_use_cases_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_product_items_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_product_items_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "hero_slides" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "hero_slides_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_hero_slides_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_hero_slides_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "stats_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_stats_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_stats_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "testimonials" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "testimonials_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_testimonials_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_testimonials_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "milestones_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "milestones_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "milestones" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_milestones_v_version_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_milestones_v_version_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_milestones_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "partner_logos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_partner_logos_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cta_blocks" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cta_blocks_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_cta_blocks_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_cta_blocks_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_content_sections" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_content_sections_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_content" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_content_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_page_content_v_version_sections" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_page_content_v_version_sections_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_page_content_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_page_content_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "static_pages_attachments" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "static_pages_attachments_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "static_pages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "static_pages_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_static_pages_v_version_attachments" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_static_pages_v_version_attachments_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_static_pages_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_static_pages_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "contact_submissions_marketing_channels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "contact_submissions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "audit_log" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_settings" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_settings_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_settings_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_settings_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "career_page_hero_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "career_page_values" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "career_page_values_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "career_page_benefits" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "career_page_benefits_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "career_page_recruitment_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "career_page_recruitment_steps_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "career_page" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "career_page_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_career_page_v_version_hero_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_career_page_v_version_values" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_career_page_v_version_values_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_career_page_v_version_benefits" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_career_page_v_version_benefits_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_career_page_v_version_recruitment_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_career_page_v_version_recruitment_steps_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_career_page_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_career_page_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_social_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "articles" CASCADE;
  DROP TABLE "articles_locales" CASCADE;
  DROP TABLE "_articles_v" CASCADE;
  DROP TABLE "_articles_v_locales" CASCADE;
  DROP TABLE "authors" CASCADE;
  DROP TABLE "_authors_v" CASCADE;
  DROP TABLE "media_outlets" CASCADE;
  DROP TABLE "media_outlets_locales" CASCADE;
  DROP TABLE "_media_outlets_v" CASCADE;
  DROP TABLE "_media_outlets_v_locales" CASCADE;
  DROP TABLE "media_coverage" CASCADE;
  DROP TABLE "media_coverage_locales" CASCADE;
  DROP TABLE "_media_coverage_v" CASCADE;
  DROP TABLE "_media_coverage_v_locales" CASCADE;
  DROP TABLE "reports" CASCADE;
  DROP TABLE "reports_locales" CASCADE;
  DROP TABLE "_reports_v" CASCADE;
  DROP TABLE "_reports_v_locales" CASCADE;
  DROP TABLE "job_openings" CASCADE;
  DROP TABLE "job_openings_locales" CASCADE;
  DROP TABLE "_job_openings_v" CASCADE;
  DROP TABLE "_job_openings_v_locales" CASCADE;
  DROP TABLE "job_categories" CASCADE;
  DROP TABLE "job_categories_locales" CASCADE;
  DROP TABLE "_job_categories_v" CASCADE;
  DROP TABLE "_job_categories_v_locales" CASCADE;
  DROP TABLE "product_categories_advantages" CASCADE;
  DROP TABLE "product_categories_advantages_locales" CASCADE;
  DROP TABLE "product_categories" CASCADE;
  DROP TABLE "product_categories_locales" CASCADE;
  DROP TABLE "_product_categories_v_version_advantages" CASCADE;
  DROP TABLE "_product_categories_v_version_advantages_locales" CASCADE;
  DROP TABLE "_product_categories_v" CASCADE;
  DROP TABLE "_product_categories_v_locales" CASCADE;
  DROP TABLE "product_items_use_cases" CASCADE;
  DROP TABLE "product_items_use_cases_locales" CASCADE;
  DROP TABLE "product_items" CASCADE;
  DROP TABLE "product_items_locales" CASCADE;
  DROP TABLE "_product_items_v_version_use_cases" CASCADE;
  DROP TABLE "_product_items_v_version_use_cases_locales" CASCADE;
  DROP TABLE "_product_items_v" CASCADE;
  DROP TABLE "_product_items_v_locales" CASCADE;
  DROP TABLE "hero_slides" CASCADE;
  DROP TABLE "hero_slides_locales" CASCADE;
  DROP TABLE "_hero_slides_v" CASCADE;
  DROP TABLE "_hero_slides_v_locales" CASCADE;
  DROP TABLE "stats" CASCADE;
  DROP TABLE "stats_locales" CASCADE;
  DROP TABLE "_stats_v" CASCADE;
  DROP TABLE "_stats_v_locales" CASCADE;
  DROP TABLE "testimonials" CASCADE;
  DROP TABLE "testimonials_locales" CASCADE;
  DROP TABLE "_testimonials_v" CASCADE;
  DROP TABLE "_testimonials_v_locales" CASCADE;
  DROP TABLE "milestones_items" CASCADE;
  DROP TABLE "milestones_items_locales" CASCADE;
  DROP TABLE "milestones" CASCADE;
  DROP TABLE "_milestones_v_version_items" CASCADE;
  DROP TABLE "_milestones_v_version_items_locales" CASCADE;
  DROP TABLE "_milestones_v" CASCADE;
  DROP TABLE "partner_logos" CASCADE;
  DROP TABLE "_partner_logos_v" CASCADE;
  DROP TABLE "cta_blocks" CASCADE;
  DROP TABLE "cta_blocks_locales" CASCADE;
  DROP TABLE "_cta_blocks_v" CASCADE;
  DROP TABLE "_cta_blocks_v_locales" CASCADE;
  DROP TABLE "page_content_sections" CASCADE;
  DROP TABLE "page_content_sections_locales" CASCADE;
  DROP TABLE "page_content" CASCADE;
  DROP TABLE "page_content_locales" CASCADE;
  DROP TABLE "_page_content_v_version_sections" CASCADE;
  DROP TABLE "_page_content_v_version_sections_locales" CASCADE;
  DROP TABLE "_page_content_v" CASCADE;
  DROP TABLE "_page_content_v_locales" CASCADE;
  DROP TABLE "static_pages_attachments" CASCADE;
  DROP TABLE "static_pages_attachments_locales" CASCADE;
  DROP TABLE "static_pages" CASCADE;
  DROP TABLE "static_pages_locales" CASCADE;
  DROP TABLE "_static_pages_v_version_attachments" CASCADE;
  DROP TABLE "_static_pages_v_version_attachments_locales" CASCADE;
  DROP TABLE "_static_pages_v" CASCADE;
  DROP TABLE "_static_pages_v_locales" CASCADE;
  DROP TABLE "contact_submissions_marketing_channels" CASCADE;
  DROP TABLE "contact_submissions" CASCADE;
  DROP TABLE "audit_log" CASCADE;
  DROP TABLE "home_settings" CASCADE;
  DROP TABLE "home_settings_locales" CASCADE;
  DROP TABLE "_home_settings_v" CASCADE;
  DROP TABLE "_home_settings_v_locales" CASCADE;
  DROP TABLE "career_page_hero_images" CASCADE;
  DROP TABLE "career_page_values" CASCADE;
  DROP TABLE "career_page_values_locales" CASCADE;
  DROP TABLE "career_page_benefits" CASCADE;
  DROP TABLE "career_page_benefits_locales" CASCADE;
  DROP TABLE "career_page_recruitment_steps" CASCADE;
  DROP TABLE "career_page_recruitment_steps_locales" CASCADE;
  DROP TABLE "career_page" CASCADE;
  DROP TABLE "career_page_locales" CASCADE;
  DROP TABLE "_career_page_v_version_hero_images" CASCADE;
  DROP TABLE "_career_page_v_version_values" CASCADE;
  DROP TABLE "_career_page_v_version_values_locales" CASCADE;
  DROP TABLE "_career_page_v_version_benefits" CASCADE;
  DROP TABLE "_career_page_v_version_benefits_locales" CASCADE;
  DROP TABLE "_career_page_v_version_recruitment_steps" CASCADE;
  DROP TABLE "_career_page_v_version_recruitment_steps_locales" CASCADE;
  DROP TABLE "_career_page_v" CASCADE;
  DROP TABLE "_career_page_v_locales" CASCADE;
  DROP TABLE "site_settings_social_links" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "site_settings_locales" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_articles_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_authors_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_media_outlets_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_media_coverage_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_reports_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_job_openings_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_job_categories_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_product_categories_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_product_items_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_hero_slides_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_stats_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_testimonials_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_milestones_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_partner_logos_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_cta_blocks_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_page_content_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_static_pages_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_contact_submissions_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_audit_log_fk";
  
  DROP INDEX "payload_locked_documents_rels_articles_id_idx";
  DROP INDEX "payload_locked_documents_rels_authors_id_idx";
  DROP INDEX "payload_locked_documents_rels_media_outlets_id_idx";
  DROP INDEX "payload_locked_documents_rels_media_coverage_id_idx";
  DROP INDEX "payload_locked_documents_rels_reports_id_idx";
  DROP INDEX "payload_locked_documents_rels_job_openings_id_idx";
  DROP INDEX "payload_locked_documents_rels_job_categories_id_idx";
  DROP INDEX "payload_locked_documents_rels_product_categories_id_idx";
  DROP INDEX "payload_locked_documents_rels_product_items_id_idx";
  DROP INDEX "payload_locked_documents_rels_hero_slides_id_idx";
  DROP INDEX "payload_locked_documents_rels_stats_id_idx";
  DROP INDEX "payload_locked_documents_rels_testimonials_id_idx";
  DROP INDEX "payload_locked_documents_rels_milestones_id_idx";
  DROP INDEX "payload_locked_documents_rels_partner_logos_id_idx";
  DROP INDEX "payload_locked_documents_rels_cta_blocks_id_idx";
  DROP INDEX "payload_locked_documents_rels_page_content_id_idx";
  DROP INDEX "payload_locked_documents_rels_static_pages_id_idx";
  DROP INDEX "payload_locked_documents_rels_contact_submissions_id_idx";
  DROP INDEX "payload_locked_documents_rels_audit_log_id_idx";
  ALTER TABLE "users" DROP COLUMN "name";
  ALTER TABLE "users" DROP COLUMN "role";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "articles_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "authors_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "media_outlets_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "media_coverage_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "reports_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "job_openings_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "job_categories_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "product_categories_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "product_items_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "hero_slides_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "stats_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "testimonials_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "milestones_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "partner_logos_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "cta_blocks_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "page_content_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "static_pages_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "contact_submissions_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "audit_log_id";
  DROP TYPE "public"."enum_articles_approval_status";
  DROP TYPE "public"."enum_articles_status";
  DROP TYPE "public"."enum__articles_v_version_approval_status";
  DROP TYPE "public"."enum__articles_v_version_status";
  DROP TYPE "public"."enum__articles_v_published_locale";
  DROP TYPE "public"."enum_authors_status";
  DROP TYPE "public"."enum__authors_v_version_status";
  DROP TYPE "public"."enum__authors_v_published_locale";
  DROP TYPE "public"."enum_media_outlets_status";
  DROP TYPE "public"."enum__media_outlets_v_version_status";
  DROP TYPE "public"."enum__media_outlets_v_published_locale";
  DROP TYPE "public"."enum_media_coverage_approval_status";
  DROP TYPE "public"."enum_media_coverage_status";
  DROP TYPE "public"."enum__media_coverage_v_version_approval_status";
  DROP TYPE "public"."enum__media_coverage_v_version_status";
  DROP TYPE "public"."enum__media_coverage_v_published_locale";
  DROP TYPE "public"."enum_reports_type";
  DROP TYPE "public"."enum_reports_approval_status";
  DROP TYPE "public"."enum_reports_status";
  DROP TYPE "public"."enum__reports_v_version_type";
  DROP TYPE "public"."enum__reports_v_version_approval_status";
  DROP TYPE "public"."enum__reports_v_version_status";
  DROP TYPE "public"."enum__reports_v_published_locale";
  DROP TYPE "public"."enum_job_openings_approval_status";
  DROP TYPE "public"."enum_job_openings_status";
  DROP TYPE "public"."enum__job_openings_v_version_approval_status";
  DROP TYPE "public"."enum__job_openings_v_version_status";
  DROP TYPE "public"."enum__job_openings_v_published_locale";
  DROP TYPE "public"."enum_job_categories_status";
  DROP TYPE "public"."enum__job_categories_v_version_status";
  DROP TYPE "public"."enum__job_categories_v_published_locale";
  DROP TYPE "public"."enum_product_categories_approval_status";
  DROP TYPE "public"."enum_product_categories_status";
  DROP TYPE "public"."enum__product_categories_v_version_approval_status";
  DROP TYPE "public"."enum__product_categories_v_version_status";
  DROP TYPE "public"."enum__product_categories_v_published_locale";
  DROP TYPE "public"."enum_product_items_product_status";
  DROP TYPE "public"."enum_product_items_approval_status";
  DROP TYPE "public"."enum_product_items_status";
  DROP TYPE "public"."enum__product_items_v_version_product_status";
  DROP TYPE "public"."enum__product_items_v_version_approval_status";
  DROP TYPE "public"."enum__product_items_v_version_status";
  DROP TYPE "public"."enum__product_items_v_published_locale";
  DROP TYPE "public"."enum_hero_slides_approval_status";
  DROP TYPE "public"."enum_hero_slides_status";
  DROP TYPE "public"."enum__hero_slides_v_version_approval_status";
  DROP TYPE "public"."enum__hero_slides_v_version_status";
  DROP TYPE "public"."enum__hero_slides_v_published_locale";
  DROP TYPE "public"."enum_stats_approval_status";
  DROP TYPE "public"."enum_stats_status";
  DROP TYPE "public"."enum__stats_v_version_approval_status";
  DROP TYPE "public"."enum__stats_v_version_status";
  DROP TYPE "public"."enum__stats_v_published_locale";
  DROP TYPE "public"."enum_testimonials_approval_status";
  DROP TYPE "public"."enum_testimonials_status";
  DROP TYPE "public"."enum__testimonials_v_version_approval_status";
  DROP TYPE "public"."enum__testimonials_v_version_status";
  DROP TYPE "public"."enum__testimonials_v_published_locale";
  DROP TYPE "public"."enum_milestones_approval_status";
  DROP TYPE "public"."enum_milestones_status";
  DROP TYPE "public"."enum__milestones_v_version_approval_status";
  DROP TYPE "public"."enum__milestones_v_version_status";
  DROP TYPE "public"."enum__milestones_v_published_locale";
  DROP TYPE "public"."enum_partner_logos_group";
  DROP TYPE "public"."enum_partner_logos_status";
  DROP TYPE "public"."enum__partner_logos_v_version_group";
  DROP TYPE "public"."enum__partner_logos_v_version_status";
  DROP TYPE "public"."enum__partner_logos_v_published_locale";
  DROP TYPE "public"."enum_cta_blocks_page";
  DROP TYPE "public"."enum_cta_blocks_approval_status";
  DROP TYPE "public"."enum_cta_blocks_status";
  DROP TYPE "public"."enum__cta_blocks_v_version_page";
  DROP TYPE "public"."enum__cta_blocks_v_version_approval_status";
  DROP TYPE "public"."enum__cta_blocks_v_version_status";
  DROP TYPE "public"."enum__cta_blocks_v_published_locale";
  DROP TYPE "public"."enum_page_content_page";
  DROP TYPE "public"."enum_page_content_approval_status";
  DROP TYPE "public"."enum_page_content_status";
  DROP TYPE "public"."enum__page_content_v_version_page";
  DROP TYPE "public"."enum__page_content_v_version_approval_status";
  DROP TYPE "public"."enum__page_content_v_version_status";
  DROP TYPE "public"."enum__page_content_v_published_locale";
  DROP TYPE "public"."enum_static_pages_key";
  DROP TYPE "public"."enum_static_pages_status";
  DROP TYPE "public"."enum__static_pages_v_version_key";
  DROP TYPE "public"."enum__static_pages_v_version_status";
  DROP TYPE "public"."enum__static_pages_v_published_locale";
  DROP TYPE "public"."enum_contact_submissions_marketing_channels";
  DROP TYPE "public"."enum_contact_submissions_interested_in";
  DROP TYPE "public"."enum_contact_submissions_hear_about_us";
  DROP TYPE "public"."enum_contact_submissions_marketing_preference";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_home_settings_approval_status";
  DROP TYPE "public"."enum_home_settings_status";
  DROP TYPE "public"."enum__home_settings_v_version_approval_status";
  DROP TYPE "public"."enum__home_settings_v_version_status";
  DROP TYPE "public"."enum__home_settings_v_published_locale";
  DROP TYPE "public"."enum_career_page_approval_status";
  DROP TYPE "public"."enum_career_page_status";
  DROP TYPE "public"."enum__career_page_v_version_approval_status";
  DROP TYPE "public"."enum__career_page_v_version_status";
  DROP TYPE "public"."enum__career_page_v_published_locale";
  DROP TYPE "public"."enum_site_settings_social_links_platform";
  DROP TYPE IF EXISTS "public"."_locales";
`)
}
