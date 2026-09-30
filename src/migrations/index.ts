import * as migration_20260921_024537_baseline from './20260921_024537_baseline';
import * as migration_20260921_050902_reports_author_financial_tables from './20260921_050902_reports_author_financial_tables';
import * as migration_20260921_050947_product_item_lists from './20260921_050947_product_item_lists';
import * as migration_20260921_072117_newsroom_figma_fields from './20260921_072117_newsroom_figma_fields';
import * as migration_20260921_092132_product_image from './20260921_092132_product_image';
import * as migration_20260921_093000_report_covers_into_cms from './20260921_093000_report_covers_into_cms';
import * as migration_20260921_094500_annual_report_cover from './20260921_094500_annual_report_cover';
import * as migration_20260921_095500_report_tables_into_body from './20260921_095500_report_tables_into_body';
import * as migration_20260921_101248_drop_report_year from './20260921_101248_drop_report_year';
import * as migration_20260921_104918_drop_draft_status from './20260921_104918_drop_draft_status';
import * as migration_20260922_063014_reports_paired_languages from './20260922_063014_reports_paired_languages';
import * as migration_20260922_074642_articles_paired_languages from './20260922_074642_articles_paired_languages';
import * as migration_20260923_103843_products_add_paired from './20260923_103843_products_add_paired';
import * as migration_20260923_104006_products_drop_legacy from './20260923_104006_products_drop_legacy';
import * as migration_20260923_140000_product_sequences from './20260923_140000_product_sequences';
import * as migration_20260923_142420_careers_apply_url from './20260923_142420_careers_apply_url';
import * as migration_20260923_142545_careers_drop_unused from './20260923_142545_careers_drop_unused';
import * as migration_20260923_144613 from './20260923_144613';
import * as migration_20260923_145206_careers_add_paired from './20260923_145206_careers_add_paired';
import * as migration_20260923_145527_careers_drop_localised from './20260923_145527_careers_drop_localised';
import * as migration_20260923_150000_career_categories from './20260923_150000_career_categories';
import * as migration_20260923_154839_users_email_verification from './20260923_154839_users_email_verification'
import * as migration_20260925_130000_enquiry_follow_up_status from './20260925_130000_enquiry_follow_up_status'
import * as migration_20260925_150000_audit_titles from './20260925_150000_audit_titles'
import * as migration_20260929_120000_unique_slugs from './20260929_120000_unique_slugs';

export const migrations = [
  {
    up: migration_20260921_024537_baseline.up,
    down: migration_20260921_024537_baseline.down,
    name: '20260921_024537_baseline',
  },
  {
    up: migration_20260921_050902_reports_author_financial_tables.up,
    down: migration_20260921_050902_reports_author_financial_tables.down,
    name: '20260921_050902_reports_author_financial_tables',
  },
  {
    up: migration_20260921_050947_product_item_lists.up,
    down: migration_20260921_050947_product_item_lists.down,
    name: '20260921_050947_product_item_lists',
  },
  {
    up: migration_20260921_072117_newsroom_figma_fields.up,
    down: migration_20260921_072117_newsroom_figma_fields.down,
    name: '20260921_072117_newsroom_figma_fields',
  },
  {
    up: migration_20260921_092132_product_image.up,
    down: migration_20260921_092132_product_image.down,
    name: '20260921_092132_product_image',
  },
  {
    up: migration_20260921_093000_report_covers_into_cms.up,
    down: migration_20260921_093000_report_covers_into_cms.down,
    name: '20260921_093000_report_covers_into_cms',
  },
  {
    up: migration_20260921_094500_annual_report_cover.up,
    down: migration_20260921_094500_annual_report_cover.down,
    name: '20260921_094500_annual_report_cover',
  },
  {
    up: migration_20260921_095500_report_tables_into_body.up,
    down: migration_20260921_095500_report_tables_into_body.down,
    name: '20260921_095500_report_tables_into_body',
  },
  {
    up: migration_20260921_101248_drop_report_year.up,
    down: migration_20260921_101248_drop_report_year.down,
    name: '20260921_101248_drop_report_year',
  },
  {
    up: migration_20260921_104918_drop_draft_status.up,
    down: migration_20260921_104918_drop_draft_status.down,
    name: '20260921_104918_drop_draft_status',
  },
  {
    up: migration_20260922_063014_reports_paired_languages.up,
    down: migration_20260922_063014_reports_paired_languages.down,
    name: '20260922_063014_reports_paired_languages',
  },
  {
    up: migration_20260922_074642_articles_paired_languages.up,
    down: migration_20260922_074642_articles_paired_languages.down,
    name: '20260922_074642_articles_paired_languages',
  },
  {
    up: migration_20260923_103843_products_add_paired.up,
    down: migration_20260923_103843_products_add_paired.down,
    name: '20260923_103843_products_add_paired',
  },
  {
    up: migration_20260923_104006_products_drop_legacy.up,
    down: migration_20260923_104006_products_drop_legacy.down,
    name: '20260923_104006_products_drop_legacy',
  },
  {
    up: migration_20260923_140000_product_sequences.up,
    down: migration_20260923_140000_product_sequences.down,
    name: '20260923_140000_product_sequences',
  },
  {
    up: migration_20260923_142420_careers_apply_url.up,
    down: migration_20260923_142420_careers_apply_url.down,
    name: '20260923_142420_careers_apply_url',
  },
  {
    up: migration_20260923_142545_careers_drop_unused.up,
    down: migration_20260923_142545_careers_drop_unused.down,
    name: '20260923_142545_careers_drop_unused',
  },
  {
    up: migration_20260923_144613.up,
    down: migration_20260923_144613.down,
    name: '20260923_144613',
  },
  {
    up: migration_20260923_145206_careers_add_paired.up,
    down: migration_20260923_145206_careers_add_paired.down,
    name: '20260923_145206_careers_add_paired',
  },
  {
    up: migration_20260923_145527_careers_drop_localised.up,
    down: migration_20260923_145527_careers_drop_localised.down,
    name: '20260923_145527_careers_drop_localised',
  },
  {
    up: migration_20260923_150000_career_categories.up,
    down: migration_20260923_150000_career_categories.down,
    name: '20260923_150000_career_categories',
  },
  {
    up: migration_20260923_154839_users_email_verification.up,
    down: migration_20260923_154839_users_email_verification.down,
    name: '20260923_154839_users_email_verification'
  },
  {
    up: migration_20260925_130000_enquiry_follow_up_status.up,
    down: migration_20260925_130000_enquiry_follow_up_status.down,
    name: '20260925_130000_enquiry_follow_up_status'
  },
  {
    up: migration_20260925_150000_audit_titles.up,
    down: migration_20260925_150000_audit_titles.down,
    name: '20260925_150000_audit_titles'
  },
  {
    up: migration_20260929_120000_unique_slugs.up,
    down: migration_20260929_120000_unique_slugs.down,
    name: '20260929_120000_unique_slugs'
  },
];
