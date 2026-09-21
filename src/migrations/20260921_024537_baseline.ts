import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Baseline schema for the seven collections the CMS keeps.
 *
 * This replaces the earlier migration history. Those migrations built and
 * then dismantled fourteen collections that now live in src/content/, and
 * their schema snapshot was 118 tables out of date — which made the migration
 * generator offer to rename enums that had already been dropped.
 *
 * On the existing staging database this migration is recorded as applied
 * without being run: the schema already matches. A fresh database runs it
 * normally.
 */

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('id', 'en');
  CREATE TYPE "public"."enum_articles_approval_status" AS ENUM('draft', 'in_review', 'approved', 'rejected');
  CREATE TYPE "public"."enum_articles_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__articles_v_version_approval_status" AS ENUM('draft', 'in_review', 'approved', 'rejected');
  CREATE TYPE "public"."enum__articles_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__articles_v_published_locale" AS ENUM('id', 'en');
  CREATE TYPE "public"."enum_reports_type" AS ENUM('annual_report', 'business_development');
  CREATE TYPE "public"."enum_reports_approval_status" AS ENUM('draft', 'in_review', 'approved', 'rejected');
  CREATE TYPE "public"."enum_reports_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__reports_v_version_type" AS ENUM('annual_report', 'business_development');
  CREATE TYPE "public"."enum__reports_v_version_approval_status" AS ENUM('draft', 'in_review', 'approved', 'rejected');
  CREATE TYPE "public"."enum__reports_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__reports_v_published_locale" AS ENUM('id', 'en');
  CREATE TYPE "public"."enum_job_openings_category" AS ENUM('information-technology', 'analysis-reporting', 'sales-business-development');
  CREATE TYPE "public"."enum_job_openings_approval_status" AS ENUM('draft', 'in_review', 'approved', 'rejected');
  CREATE TYPE "public"."enum_job_openings_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__job_openings_v_version_category" AS ENUM('information-technology', 'analysis-reporting', 'sales-business-development');
  CREATE TYPE "public"."enum__job_openings_v_version_approval_status" AS ENUM('draft', 'in_review', 'approved', 'rejected');
  CREATE TYPE "public"."enum__job_openings_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__job_openings_v_published_locale" AS ENUM('id', 'en');
  CREATE TYPE "public"."enum_product_items_category" AS ENUM('credit-scoring', 'analytics', 'decisioning', 'business-intelligence', 'consulting');
  CREATE TYPE "public"."enum_product_items_product_status" AS ENUM('live', 'ready_to_sell');
  CREATE TYPE "public"."enum_product_items_approval_status" AS ENUM('draft', 'in_review', 'approved', 'rejected');
  CREATE TYPE "public"."enum_product_items_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__product_items_v_version_category" AS ENUM('credit-scoring', 'analytics', 'decisioning', 'business-intelligence', 'consulting');
  CREATE TYPE "public"."enum__product_items_v_version_product_status" AS ENUM('live', 'ready_to_sell');
  CREATE TYPE "public"."enum__product_items_v_version_approval_status" AS ENUM('draft', 'in_review', 'approved', 'rejected');
  CREATE TYPE "public"."enum__product_items_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__product_items_v_published_locale" AS ENUM('id', 'en');
  CREATE TYPE "public"."enum_contact_submissions_marketing_channels" AS ENUM('SMS/WhatsApp', 'Telephone', 'Email', 'Newsletter');
  CREATE TYPE "public"."enum_contact_submissions_interested_in" AS ENUM('Business Information', 'Business Analytics', 'Business Solutions', 'Market Research', 'CRIF PLUS Membership Programme', 'Credit Bureau', 'General Enquiries');
  CREATE TYPE "public"."enum_contact_submissions_hear_about_us" AS ENUM('Conference/Exhibition', 'Flyer/Leaflet', 'Google Search', 'Magazine', 'Referral', 'Social Media', 'Webinar', 'Other');
  CREATE TYPE "public"."enum_contact_submissions_marketing_preference" AS ENUM('opt_in', 'opt_out');
  CREATE TYPE "public"."enum_users_role" AS ENUM('super_admin', 'hr_admin', 'news_admin', 'marketing_admin', 'sales_admin', 'approver');
  CREATE TABLE "articles" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"cover_id" integer,
  	"author" varchar,
  	"publish_date" timestamp(3) with time zone,
  	"is_featured" boolean,
  	"is_sample" boolean DEFAULT false,
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
  	"version_author" varchar,
  	"version_publish_date" timestamp(3) with time zone,
  	"version_is_featured" boolean,
  	"version_is_sample" boolean DEFAULT false,
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
  
  CREATE TABLE "reports" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum_reports_type" DEFAULT 'annual_report',
  	"year" numeric,
  	"cover_id" integer,
  	"publish_date" timestamp(3) with time zone,
  	"sort_order" numeric DEFAULT 0,
  	"is_sample" boolean DEFAULT false,
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
  	"version_is_sample" boolean DEFAULT false,
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
  	"category" "enum_job_openings_category",
  	"apply_email" varchar DEFAULT 'talent@cbclik.com',
  	"is_open" boolean DEFAULT true,
  	"posted_date" timestamp(3) with time zone,
  	"sort_order" numeric DEFAULT 0,
  	"is_sample" boolean DEFAULT false,
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
  	"version_category" "enum__job_openings_v_version_category",
  	"version_apply_email" varchar DEFAULT 'talent@cbclik.com',
  	"version_is_open" boolean DEFAULT true,
  	"version_posted_date" timestamp(3) with time zone,
  	"version_sort_order" numeric DEFAULT 0,
  	"version_is_sample" boolean DEFAULT false,
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
  	"category" "enum_product_items_category",
  	"product_status" "enum_product_items_product_status" DEFAULT 'live',
  	"is_new" boolean,
  	"sort_order" numeric DEFAULT 0,
  	"is_sample" boolean DEFAULT false,
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
  	"version_category" "enum__product_items_v_version_category",
  	"version_product_status" "enum__product_items_v_version_product_status" DEFAULT 'live',
  	"version_is_new" boolean,
  	"version_sort_order" numeric DEFAULT 0,
  	"version_is_sample" boolean DEFAULT false,
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
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" "enum_users_role" DEFAULT 'news_admin' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"is_sample" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_wide_url" varchar,
  	"sizes_wide_width" numeric,
  	"sizes_wide_height" numeric,
  	"sizes_wide_mime_type" varchar,
  	"sizes_wide_filesize" numeric,
  	"sizes_wide_filename" varchar
  );
  
  CREATE TABLE "media_locales" (
  	"alt" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"articles_id" integer,
  	"reports_id" integer,
  	"job_openings_id" integer,
  	"product_items_id" integer,
  	"contact_submissions_id" integer,
  	"audit_log_id" integer,
  	"users_id" integer,
  	"media_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "articles" ADD CONSTRAINT "articles_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_submitted_by_id_users_id_fk" FOREIGN KEY ("submitted_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_reviewed_by_id_users_id_fk" FOREIGN KEY ("reviewed_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles_locales" ADD CONSTRAINT "articles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_parent_id_articles_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."articles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_submitted_by_id_users_id_fk" FOREIGN KEY ("version_submitted_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_reviewed_by_id_users_id_fk" FOREIGN KEY ("version_reviewed_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v_locales" ADD CONSTRAINT "_articles_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "reports" ADD CONSTRAINT "reports_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "reports" ADD CONSTRAINT "reports_submitted_by_id_users_id_fk" FOREIGN KEY ("submitted_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "reports" ADD CONSTRAINT "reports_reviewed_by_id_users_id_fk" FOREIGN KEY ("reviewed_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "reports_locales" ADD CONSTRAINT "reports_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."reports"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_reports_v" ADD CONSTRAINT "_reports_v_parent_id_reports_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."reports"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_reports_v" ADD CONSTRAINT "_reports_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_reports_v" ADD CONSTRAINT "_reports_v_version_submitted_by_id_users_id_fk" FOREIGN KEY ("version_submitted_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_reports_v" ADD CONSTRAINT "_reports_v_version_reviewed_by_id_users_id_fk" FOREIGN KEY ("version_reviewed_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_reports_v_locales" ADD CONSTRAINT "_reports_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_reports_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "job_openings" ADD CONSTRAINT "job_openings_submitted_by_id_users_id_fk" FOREIGN KEY ("submitted_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "job_openings" ADD CONSTRAINT "job_openings_reviewed_by_id_users_id_fk" FOREIGN KEY ("reviewed_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "job_openings_locales" ADD CONSTRAINT "job_openings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."job_openings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_job_openings_v" ADD CONSTRAINT "_job_openings_v_parent_id_job_openings_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."job_openings"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_job_openings_v" ADD CONSTRAINT "_job_openings_v_version_submitted_by_id_users_id_fk" FOREIGN KEY ("version_submitted_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_job_openings_v" ADD CONSTRAINT "_job_openings_v_version_reviewed_by_id_users_id_fk" FOREIGN KEY ("version_reviewed_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_job_openings_v_locales" ADD CONSTRAINT "_job_openings_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_job_openings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_items_use_cases" ADD CONSTRAINT "product_items_use_cases_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_items_use_cases_locales" ADD CONSTRAINT "product_items_use_cases_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_items_use_cases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_items" ADD CONSTRAINT "product_items_submitted_by_id_users_id_fk" FOREIGN KEY ("submitted_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "product_items" ADD CONSTRAINT "product_items_reviewed_by_id_users_id_fk" FOREIGN KEY ("reviewed_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "product_items_locales" ADD CONSTRAINT "product_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_product_items_v_version_use_cases" ADD CONSTRAINT "_product_items_v_version_use_cases_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_product_items_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_product_items_v_version_use_cases_locales" ADD CONSTRAINT "_product_items_v_version_use_cases_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_product_items_v_version_use_cases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_product_items_v" ADD CONSTRAINT "_product_items_v_parent_id_product_items_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."product_items"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_product_items_v" ADD CONSTRAINT "_product_items_v_version_submitted_by_id_users_id_fk" FOREIGN KEY ("version_submitted_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_product_items_v" ADD CONSTRAINT "_product_items_v_version_reviewed_by_id_users_id_fk" FOREIGN KEY ("version_reviewed_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_product_items_v_locales" ADD CONSTRAINT "_product_items_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_product_items_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_submissions_marketing_channels" ADD CONSTRAINT "contact_submissions_marketing_channels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."contact_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_submissions" ADD CONSTRAINT "contact_submissions_followed_up_by_id_users_id_fk" FOREIGN KEY ("followed_up_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_reports_fk" FOREIGN KEY ("reports_id") REFERENCES "public"."reports"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_job_openings_fk" FOREIGN KEY ("job_openings_id") REFERENCES "public"."job_openings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_product_items_fk" FOREIGN KEY ("product_items_id") REFERENCES "public"."product_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contact_submissions_fk" FOREIGN KEY ("contact_submissions_id") REFERENCES "public"."contact_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_audit_log_fk" FOREIGN KEY ("audit_log_id") REFERENCES "public"."audit_log"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "articles_cover_idx" ON "articles" USING btree ("cover_id");
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
  CREATE INDEX "job_openings_approval_status_idx" ON "job_openings" USING btree ("approval_status");
  CREATE INDEX "job_openings_submitted_by_idx" ON "job_openings" USING btree ("submitted_by_id");
  CREATE INDEX "job_openings_reviewed_by_idx" ON "job_openings" USING btree ("reviewed_by_id");
  CREATE INDEX "job_openings_updated_at_idx" ON "job_openings" USING btree ("updated_at");
  CREATE INDEX "job_openings_created_at_idx" ON "job_openings" USING btree ("created_at");
  CREATE INDEX "job_openings__status_idx" ON "job_openings" USING btree ("_status");
  CREATE INDEX "job_openings_slug_idx" ON "job_openings_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "job_openings_locales_locale_parent_id_unique" ON "job_openings_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_job_openings_v_parent_idx" ON "_job_openings_v" USING btree ("parent_id");
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
  CREATE INDEX "product_items_use_cases_order_idx" ON "product_items_use_cases" USING btree ("_order");
  CREATE INDEX "product_items_use_cases_parent_id_idx" ON "product_items_use_cases" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "product_items_use_cases_locales_locale_parent_id_unique" ON "product_items_use_cases_locales" USING btree ("_locale","_parent_id");
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
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_wide_sizes_wide_filename_idx" ON "media" USING btree ("sizes_wide_filename");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_articles_id_idx" ON "payload_locked_documents_rels" USING btree ("articles_id");
  CREATE INDEX "payload_locked_documents_rels_reports_id_idx" ON "payload_locked_documents_rels" USING btree ("reports_id");
  CREATE INDEX "payload_locked_documents_rels_job_openings_id_idx" ON "payload_locked_documents_rels" USING btree ("job_openings_id");
  CREATE INDEX "payload_locked_documents_rels_product_items_id_idx" ON "payload_locked_documents_rels" USING btree ("product_items_id");
  CREATE INDEX "payload_locked_documents_rels_contact_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("contact_submissions_id");
  CREATE INDEX "payload_locked_documents_rels_audit_log_id_idx" ON "payload_locked_documents_rels" USING btree ("audit_log_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "articles" CASCADE;
  DROP TABLE "articles_locales" CASCADE;
  DROP TABLE "_articles_v" CASCADE;
  DROP TABLE "_articles_v_locales" CASCADE;
  DROP TABLE "reports" CASCADE;
  DROP TABLE "reports_locales" CASCADE;
  DROP TABLE "_reports_v" CASCADE;
  DROP TABLE "_reports_v_locales" CASCADE;
  DROP TABLE "job_openings" CASCADE;
  DROP TABLE "job_openings_locales" CASCADE;
  DROP TABLE "_job_openings_v" CASCADE;
  DROP TABLE "_job_openings_v_locales" CASCADE;
  DROP TABLE "product_items_use_cases" CASCADE;
  DROP TABLE "product_items_use_cases_locales" CASCADE;
  DROP TABLE "product_items" CASCADE;
  DROP TABLE "product_items_locales" CASCADE;
  DROP TABLE "_product_items_v_version_use_cases" CASCADE;
  DROP TABLE "_product_items_v_version_use_cases_locales" CASCADE;
  DROP TABLE "_product_items_v" CASCADE;
  DROP TABLE "_product_items_v_locales" CASCADE;
  DROP TABLE "contact_submissions_marketing_channels" CASCADE;
  DROP TABLE "contact_submissions" CASCADE;
  DROP TABLE "audit_log" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_articles_approval_status";
  DROP TYPE "public"."enum_articles_status";
  DROP TYPE "public"."enum__articles_v_version_approval_status";
  DROP TYPE "public"."enum__articles_v_version_status";
  DROP TYPE "public"."enum__articles_v_published_locale";
  DROP TYPE "public"."enum_reports_type";
  DROP TYPE "public"."enum_reports_approval_status";
  DROP TYPE "public"."enum_reports_status";
  DROP TYPE "public"."enum__reports_v_version_type";
  DROP TYPE "public"."enum__reports_v_version_approval_status";
  DROP TYPE "public"."enum__reports_v_version_status";
  DROP TYPE "public"."enum__reports_v_published_locale";
  DROP TYPE "public"."enum_job_openings_category";
  DROP TYPE "public"."enum_job_openings_approval_status";
  DROP TYPE "public"."enum_job_openings_status";
  DROP TYPE "public"."enum__job_openings_v_version_category";
  DROP TYPE "public"."enum__job_openings_v_version_approval_status";
  DROP TYPE "public"."enum__job_openings_v_version_status";
  DROP TYPE "public"."enum__job_openings_v_published_locale";
  DROP TYPE "public"."enum_product_items_category";
  DROP TYPE "public"."enum_product_items_product_status";
  DROP TYPE "public"."enum_product_items_approval_status";
  DROP TYPE "public"."enum_product_items_status";
  DROP TYPE "public"."enum__product_items_v_version_category";
  DROP TYPE "public"."enum__product_items_v_version_product_status";
  DROP TYPE "public"."enum__product_items_v_version_approval_status";
  DROP TYPE "public"."enum__product_items_v_version_status";
  DROP TYPE "public"."enum__product_items_v_published_locale";
  DROP TYPE "public"."enum_contact_submissions_marketing_channels";
  DROP TYPE "public"."enum_contact_submissions_interested_in";
  DROP TYPE "public"."enum_contact_submissions_hear_about_us";
  DROP TYPE "public"."enum_contact_submissions_marketing_preference";
  DROP TYPE "public"."enum_users_role";`)
}
