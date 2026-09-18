import * as migration_20260918_040436_initial from './20260918_040436_initial';
import * as migration_20260918_042845_phase2_cms from './20260918_042845_phase2_cms';
import * as migration_20260918_061951_phase3_is_sample from './20260918_061951_phase3_is_sample';
import * as migration_20260918_063709_phase3_media_a from './20260918_063709_phase3_media_a';
import * as migration_20260918_063750_phase3_media_b from './20260918_063750_phase3_media_b';

export const migrations = [
  {
    up: migration_20260918_040436_initial.up,
    down: migration_20260918_040436_initial.down,
    name: '20260918_040436_initial',
  },
  {
    up: migration_20260918_042845_phase2_cms.up,
    down: migration_20260918_042845_phase2_cms.down,
    name: '20260918_042845_phase2_cms',
  },
  {
    up: migration_20260918_061951_phase3_is_sample.up,
    down: migration_20260918_061951_phase3_is_sample.down,
    name: '20260918_061951_phase3_is_sample',
  },
  {
    up: migration_20260918_063709_phase3_media_a.up,
    down: migration_20260918_063709_phase3_media_a.down,
    name: '20260918_063709_phase3_media_a',
  },
  {
    up: migration_20260918_063750_phase3_media_b.up,
    down: migration_20260918_063750_phase3_media_b.down,
    name: '20260918_063750_phase3_media_b'
  },
];
