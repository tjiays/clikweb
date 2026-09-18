import type { CollectionConfig } from 'payload'
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

export const HeroSlides: CollectionConfig = contentCollection({
  slug: 'hero-slides',
  labels: { singular: 'Hero Slide', plural: 'Homepage Hero' },
  group,
  owners,
  defaultColumns: ['title', 'sortOrder', 'approvalStatus'],
  fields: [
    imageField('image', 'Gambar latar', true),
    localisedText('title', 'Judul', true),
    localisedText('subtitle', 'Sub-judul'),
    localisedText('buttonLabel', 'Teks tombol'),
    { name: 'buttonLink', type: 'text', access: lockedForApprover },
    sortOrderField,
  ],
})

export const Stats: CollectionConfig = contentCollection({
  slug: 'stats',
  labels: { singular: 'Statistik', plural: 'Homepage Stats' },
  group,
  owners,
  useAsTitle: 'value',
  defaultColumns: ['value', 'sortOrder', 'approvalStatus'],
  fields: [
    imageField('icon', 'Ikon'),
    {
      name: 'value',
      type: 'text',
      required: true,
      access: lockedForApprover,
      admin: { description: 'For example 37, 10.500+ or 1jt+' },
    },
    localisedText('label', 'Keterangan', true),
    sortOrderField,
  ],
})

export const Testimonials: CollectionConfig = contentCollection({
  slug: 'testimonials',
  labels: { singular: 'Testimoni', plural: 'Testimoni Mitra' },
  group,
  owners,
  useAsTitle: 'partnerName',
  defaultColumns: ['partnerName', 'sortOrder', 'approvalStatus'],
  fields: [
    { name: 'partnerName', type: 'text', required: true, access: lockedForApprover },
    imageField('logo', 'Logo mitra'),
    localisedTextarea('quote', 'Kutipan', true),
    sortOrderField,
  ],
})

export const Milestones: CollectionConfig = contentCollection({
  slug: 'milestones',
  labels: { singular: 'Pencapaian', plural: 'Timeline Pencapaian' },
  group,
  owners,
  useAsTitle: 'year',
  defaultColumns: ['year', 'sortOrder', 'approvalStatus'],
  fields: [
    { name: 'year', type: 'number', required: true, access: lockedForApprover },
    {
      name: 'items',
      type: 'array',
      access: lockedForApprover,
      labels: { singular: 'Item', plural: 'Items' },
      fields: [localisedText('text', 'Teks', true)],
    },
    sortOrderField,
  ],
})

export const PartnerLogos: CollectionConfig = contentCollection({
  slug: 'partner-logos',
  labels: { singular: 'Partner Logo', plural: 'Partner Logo' },
  group,
  owners,
  useAsTitle: 'name',
  defaultColumns: ['name', 'group', 'sortOrder'],
  approval: false,
  fields: [
    { name: 'name', type: 'text', required: true },
    imageField('logo', 'Logo', true),
    { name: 'url', type: 'text', admin: { description: 'Opens in a new tab.' } },
    {
      name: 'group',
      type: 'select',
      required: true,
      defaultValue: 'member',
      options: [
        { label: 'Anggota dari (footer)', value: 'member' },
        { label: 'Regulator (OJK)', value: 'regulator' },
        { label: 'Member CLIK (About Us)', value: 'clik_member' },
      ],
    },
    sortOrderField,
  ],
})

export const ProductCategories: CollectionConfig = contentCollection({
  slug: 'product-categories',
  labels: { singular: 'Kategori Produk', plural: 'Kategori Produk' },
  group: 'Produk & Layanan',
  owners,
  useAsTitle: 'name',
  defaultColumns: ['name', 'sortOrder', 'approvalStatus'],
  fields: [
    localisedText('name', 'Nama kategori', true),
    slugField('name'),
    imageField('icon', 'Ikon'),
    imageField('image', 'Gambar'),
    localisedTextarea('shortDescription', 'Deskripsi singkat'),
    localisedTextarea('lead', 'Kalimat pembuka'),
    richText('description', 'Deskripsi'),
    {
      name: 'advantages',
      type: 'array',
      label: 'Keunggulan Utama',
      access: lockedForApprover,
      fields: [
        localisedText('title', 'Judul', true),
        localisedTextarea('description', 'Deskripsi'),
      ],
    },
    sortOrderField,
  ],
})

export const ProductItems: CollectionConfig = contentCollection({
  slug: 'product-items',
  labels: { singular: 'Item Produk', plural: 'Item Produk' },
  group: 'Produk & Layanan',
  owners,
  useAsTitle: 'name',
  defaultColumns: ['name', 'category', 'productStatus', 'approvalStatus'],
  fields: [
    localisedText('name', 'Nama produk', true),
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'product-categories',
      required: true,
      access: lockedForApprover,
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
    {
      name: 'useCases',
      type: 'array',
      label: 'Use cases per segmen',
      access: lockedForApprover,
      fields: [
        localisedText('segment', 'Segmen', true),
        localisedTextarea('use', 'Penggunaan'),
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
export const CTABlocks: CollectionConfig = contentCollection({
  slug: 'cta-blocks',
  labels: { singular: 'CTA Block', plural: 'CTA Blocks' },
  group,
  owners,
  useAsTitle: 'page',
  defaultColumns: ['page', 'isActive', 'approvalStatus'],
  fields: [
    {
      name: 'page',
      type: 'select',
      required: true,
      access: lockedForApprover,
      options: [
        { label: 'Home', value: 'home' },
        { label: 'Tentang CLIK', value: 'about' },
        { label: 'Layanan dan Produk', value: 'products' },
        { label: 'Business Solution', value: 'business-solution' },
        { label: 'Credit Scoring', value: 'credit-scoring' },
      ],
    },
    {
      name: 'crossLink',
      type: 'group',
      label: 'Cross-link card (optional)',
      access: lockedForApprover,
      fields: [
        localisedText('label', 'Label kecil'),
        localisedText('title', 'Judul'),
        imageField('image', 'Gambar'),
        { name: 'targetUrl', type: 'text' },
      ],
    },
    {
      name: 'banner',
      type: 'group',
      label: 'CTA banner (optional)',
      access: lockedForApprover,
      fields: [
        imageField('backgroundImage', 'Gambar latar'),
        localisedText('title', 'Judul'),
        localisedTextarea('text', 'Teks'),
        localisedText('buttonLabel', 'Teks tombol'),
        { name: 'buttonLink', type: 'text' },
      ],
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      access: lockedForApprover,
      admin: { position: 'sidebar' },
    },
  ],
})
