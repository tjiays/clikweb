import * as migration_20260921_024537_baseline from './20260921_024537_baseline';

export const migrations = [
  {
    up: migration_20260921_024537_baseline.up,
    down: migration_20260921_024537_baseline.down,
    name: '20260921_024537_baseline'
  },
];
