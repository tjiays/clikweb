import * as migration_20260921_024537_baseline from './20260921_024537_baseline';
import * as migration_20260921_050902_reports_author_financial_tables from './20260921_050902_reports_author_financial_tables';
import * as migration_20260921_050947_product_item_lists from './20260921_050947_product_item_lists';

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
    name: '20260921_050947_product_item_lists'
  },
];
