import * as migration_20260918_040436_initial from './20260918_040436_initial';
import * as migration_20260918_042845_phase2_cms from './20260918_042845_phase2_cms';

export const migrations = [
  {
    up: migration_20260918_040436_initial.up,
    down: migration_20260918_040436_initial.down,
    name: '20260918_040436_initial',
  },
  {
    up: migration_20260918_042845_phase2_cms.up,
    down: migration_20260918_042845_phase2_cms.down,
    name: '20260918_042845_phase2_cms'
  },
];
