import * as migration_20260921_024537_baseline from './20260921_024537_baseline';
import * as migration_20260921_050902_reports_author_financial_tables from './20260921_050902_reports_author_financial_tables';
import * as migration_20260921_050947_product_item_lists from './20260921_050947_product_item_lists';
import * as migration_20260921_072117_newsroom_figma_fields from './20260921_072117_newsroom_figma_fields';
import * as migration_20260921_092132_product_image from './20260921_092132_product_image';
import * as migration_20260921_093000_report_covers_into_cms from './20260921_093000_report_covers_into_cms';
import * as migration_20260921_094500_annual_report_cover from './20260921_094500_annual_report_cover';
import * as migration_20260921_095500_report_tables_into_body from './20260921_095500_report_tables_into_body';

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
    name: '20260921_092132_product_image'
  },
  {
    up: migration_20260921_093000_report_covers_into_cms.up,
    down: migration_20260921_093000_report_covers_into_cms.down,
    name: '20260921_093000_report_covers_into_cms'
  },
  {
    up: migration_20260921_094500_annual_report_cover.up,
    down: migration_20260921_094500_annual_report_cover.down,
    name: '20260921_094500_annual_report_cover'
  },
  {
    up: migration_20260921_095500_report_tables_into_body.up,
    down: migration_20260921_095500_report_tables_into_body.down,
    name: '20260921_095500_report_tables_into_body'
  },
];
