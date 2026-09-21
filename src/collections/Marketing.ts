import type { CollectionConfig, Field } from 'payload'
import { contentCollection } from './factory'
import { MODULE_OWNERS } from '@/access'
import {
  imageField,
  localisedText,
  localisedTextarea,
  richText,
  slugField,
  sortOrderField,
} from '@/fields/common'
import { lockedForApprover } from '@/fields/approval'

const owners = MODULE_OWNERS.marketing
const group = 'Konten Website'

/** A short localised list of labels on a product item. */
const productList = (name: string, label: string, itemLabel: string): Field => ({
  name,
  type: 'array',
  label,
  localized: true,
  access: lockedForApprover,
  labels: { singular: itemLabel, plural: label },
  fields: [{ name: 'label', type: 'text', label: itemLabel, required: true }],
})

export const ProductItems: CollectionConfig = contentCollection({
  slug: 'product-items',
  labels: { singular: 'Item Produk', plural: 'Item Produk' },
  group: 'Product',
  owners,
  // Products have no page of their own; they appear in What We Offer.
  previewPath: {
    id: '/layanan-dan-produk/credit-scoring',
    en: '/en/products-and-services/credit-scoring',
  },
  useAsTitle: 'name',
  defaultColumns: ['name', 'category', 'productStatus', 'approvalStatus'],
  fields: [
    localisedText('name', 'Nama produk', true),
    {
      // The five categories are fixed and live in src/content/products.ts.
      name: 'category',
      type: 'select',
      label: 'Kategori',
      required: true,
      access: lockedForApprover,
      options: [
        { label: 'Credit Scoring', value: 'credit-scoring' },
        { label: 'Analytics', value: 'analytics' },
        { label: 'Decisioning', value: 'decisioning' },
        { label: 'Business Intelligence', value: 'business-intelligence' },
        { label: 'Consulting', value: 'consulting' },
      ],
    },
    localisedTextarea('shortDescription', 'Deskripsi singkat'),
    richText('description', 'Deskripsi'),
    {
      // Named productStatus, not status: Payload reserves enum_<table>_status
      // for its own draft/published state and the two would collide.
      name: 'productStatus',
      type: 'select',
      label: 'Status',
      required: true,
      defaultValue: 'live',
      access: lockedForApprover,
      options: [
        { label: 'Live', value: 'live' },
        { label: 'Ready to Sell', value: 'ready_to_sell' },
      ],
    },
    {
      name: 'isNew',
      type: 'checkbox',
      label: 'Tampilkan badge NEW',
      access: lockedForApprover,
      admin: { position: 'sidebar' },
    },
    // The expanded card (Figma 1391:5420): feature chips under "Fitur Utama",
    // then the "Cocok Untuk" and "Kasus Penggunaan" lists. Each language keeps
    // its own list, so the whole array is localised.
    productList('features', 'Fitur utama (chip)', 'Fitur'),
    productList('suitableFor', 'Cocok untuk', 'Segmen'),
    productList('useCases', 'Kasus penggunaan', 'Kasus'),
    sortOrderField,
  ],
})

/**
 * The closing block used on most pages: a cross-link card and a "Siap…"
 * banner. One reusable component, editable per page (confirmed decision 7).
 * Either half is optional.
 */
