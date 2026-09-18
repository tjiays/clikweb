import * as migration_20260918_040436_initial from './20260918_040436_initial';

export const migrations = [
  {
    up: migration_20260918_040436_initial.up,
    down: migration_20260918_040436_initial.down,
    name: '20260918_040436_initial'
  },
];
