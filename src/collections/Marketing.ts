import type { CollectionConfig, Field } from 'payload'
import { contentCollection } from './factory'
import { MODULE_OWNERS } from '@/access'
import {
  richText,
  slugField,
  sortOrderField,
} from '@/fields/common'
import { lockedForApprover } from '@/fields/approval'
import { bothLanguages } from '@/i18n/admin'

const owners = MODULE_OWNERS.marketing
const group = 'Konten Website'

/**
 * One of the four lists on a product row, in one language.
 *
 * These used to be localised arrays behind the language switcher. They are a
 * visible pair now, like the reports and news: both languages on the page, so
 * an editor can see that one of them is empty.
 */
const productList = (name: string, label: string, itemLabel: string): Field => ({
  name,
  type: 'array',
  label,
  access: lockedForApprover,
  labels: { singular: itemLabel, plural: label },
  admin: { width: '50%' },
  fields: [{ name: 'label', type: 'text', label: itemLabel, required: true }],
})

/** The same list in both languages, side by side. */
const productListPair = (base: string, id: string, en: string, itemId: string, itemEn: string): Field => ({
  type: 'row',
  fields: [
    productList(`${base}Id`, id, itemId),
    productList(`${base}En`, en, itemEn),
  ],
})

/** The old localised list shape, retained for one migration only. */
const legacyList = (name: string, label: string): Field => ({
  name,
  type: 'array',
  label,
  localized: true,
  access: lockedForApprover,
  fields: [{ name: 'label', type: 'text', required: true }],
})

/** One short field in both languages, side by side. */
const textPair = (base: string, id: string, en: string, required = false): Field => ({
  type: 'row',
  fields: [
    { name: `${base}Id`, type: 'text', label: id, required, access: lockedForApprover, admin: { width: '50%' } },
    { name: `${base}En`, type: 'text', label: en, required, access: lockedForApprover, admin: { width: '50%' } },
  ],
})

const textareaPair = (base: string, id: string, en: string): Field => ({
  type: 'row',
  fields: [
    { name: `${base}Id`, type: 'textarea', label: id, access: lockedForApprover, admin: { width: '50%' } },
    { name: `${base}En`, type: 'textarea', label: en, access: lockedForApprover, admin: { width: '50%' } },
  ],
})

export const ProductItems: CollectionConfig = contentCollection({
  slug: 'product-items',
  labels: { singular: bothLanguages('products'), plural: bothLanguages('products') },
  group: 'Product',
  owners,
  /*
   * No Auto-translate here. It reads the Indonesian side of a title, excerpt
   * or body and writes the English one; a product has a name, a short
   * description and three lists instead, so the button found nothing to do
   * and reported that it had translated nothing.
   */
  autoTranslate: false,
  // Products have no page of their own; they appear in What We Offer.
  previewPath: {
    id: '/layanan-dan-produk/credit-scoring',
    en: '/en/products-and-services/credit-scoring',
  },
  useAsTitle: 'nameId',
  defaultColumns: ['nameId', 'category', 'statuses', 'approvalStatus'],
  fields: [
    textPair('name', 'Nama produk (Bahasa Indonesia)', 'Product name (English)', true),
    textareaPair(
      'shortDescription',
      'Deskripsi singkat (Bahasa Indonesia)',
      'Short description (English)',
    ),
    {
      /*
       * One control instead of a status plus a NEW tick. A product is either
       * Live or Ready to Sell, and may also be NEW, which is two badges at
       * most — the same two the design draws.
       */
      /*
       * Named statuses, not status: Payload reserves enum_<table>_status for
       * its own draft/published state, and the two collide outright — the
       * insert fails with "invalid input value for enum ... live".
       */
      name: 'statuses',
      type: 'select',
      hasMany: true,
      required: true,
      label: 'Status',
      defaultValue: ['live'],
      access: lockedForApprover,
      options: [
        { label: 'Live', value: 'live' },
        { label: 'Ready to Sell', value: 'ready_to_sell' },
        { label: 'NEW', value: 'new' },
      ],
      admin: {
        description: 'Pilih Live atau Ready to Sell. Tambahkan NEW bila produk baru.',
      },
      validate: (value: unknown) => {
        const picked = Array.isArray(value) ? (value as string[]) : []
        const sellable = picked.filter((v) => v === 'live' || v === 'ready_to_sell')
        if (sellable.length === 0) return 'Pilih Live atau Ready to Sell.'
        if (sellable.length > 1) return 'Pilih salah satu: Live atau Ready to Sell, tidak keduanya.'
        return true
      },
    },
    {
      name: 'descriptionId',
      type: 'richText',
      label: 'Deskripsi (Bahasa Indonesia)',
      access: lockedForApprover,
    },
    {
      name: 'descriptionEn',
      type: 'richText',
      label: 'Description (English)',
      access: lockedForApprover,
    },
    // The three lists, in the order the expanded card draws them.
    productListPair('features', 'Fitur utama (Bahasa Indonesia)', 'Key features (English)', 'Fitur', 'Feature'),
    productListPair('suitableFor', 'Cocok untuk (Bahasa Indonesia)', 'Suitable for (English)', 'Segmen', 'Segment'),
    productListPair('useCases', 'Kegunaan (Bahasa Indonesia)', 'Use cases (English)', 'Kasus', 'Use case'),
    {
      // The five categories are fixed and live in src/content/products.ts.
      name: 'category',
      type: 'select',
      label: 'Kategori',
      required: true,
      access: lockedForApprover,
      admin: { position: 'sidebar' },
      options: [
        { label: 'Credit Scoring', value: 'credit-scoring' },
        { label: 'Analytics', value: 'analytics' },
        { label: 'Decisioning', value: 'decisioning' },
        { label: 'Business Intelligence', value: 'business-intelligence' },
        { label: 'Consulting', value: 'consulting' },
      ],
    },
    sortOrderField,
  ],
})

/**
 * The closing block used on most pages: a cross-link card and a "Siap…"
 * banner. One reusable component, editable per page (confirmed decision 7).
 * Either half is optional.
 */
