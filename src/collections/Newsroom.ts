import type { CollectionConfig } from 'payload'
import { contentCollection } from './factory'
import { MODULE_OWNERS } from '@/access'
import {
  imageField,
  localisedText,
  localisedTextarea,
  richText,
  seoFields,
  slugField,
  sortOrderField,
} from '@/fields/common'
import { lockedForApprover } from '@/fields/approval'

const owners = MODULE_OWNERS.newsroom

export const Authors: CollectionConfig = contentCollection({
  slug: 'authors',
  labels: { singular: 'Author', plural: 'Author' },
  group: 'Newsroom',
  owners,
  useAsTitle: 'name',
  defaultColumns: ['name', 'updatedAt'],
  approval: false,
  fields: [
    { name: 'name', type: 'text', required: true },
    imageField('photo', 'Photo'),
  ],
})

export const MediaOutlets: CollectionConfig = contentCollection({
  slug: 'media-outlets',
  labels: { singular: 'Media Outlet', plural: 'Partner Logo (Media)' },
  group: 'Newsroom',
  owners,
  useAsTitle: 'name',
  defaultColumns: ['name', 'websiteUrl', 'sortOrder'],
  approval: false,
  fields: [
    { name: 'name', type: 'text', required: true },
    // An outlet's name reads the same in both languages, so its slug is not
    // localised — one URL per outlet, whichever language the reader is in.
    slugField('name', false),
    imageField('logo', 'Logo', true),
    {
      name: 'websiteUrl',
      type: 'text',
      admin: { description: 'The outlet’s own website. Opens in a new tab.' },
    },
    sortOrderField,
  ],
})

export const Articles: CollectionConfig = contentCollection({
  slug: 'articles',
  labels: { singular: 'Artikel', plural: 'Artikel' },
  group: 'Newsroom',
  owners,
  defaultColumns: ['title', 'publishDate', 'isFeatured', 'approvalStatus'],
  fields: [
    localisedText('title', 'Judul', true),
    slugField(),
    localisedTextarea('excerpt', 'Ringkasan'),
    richText('body', 'Isi artikel', true),
    imageField('cover', 'Gambar sampul'),
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'authors',
      access: lockedForApprover,
    },
    {
      name: 'publishDate',
      type: 'date',
      required: true,
      access: lockedForApprover,
      admin: { position: 'sidebar' },
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      label: 'Featured News',
      access: lockedForApprover,
      admin: {
        position: 'sidebar',
        description: 'Shows in the Featured News list on the Newsroom page.',
      },
    },
    seoFields,
  ],
})

export const MediaCoverage: CollectionConfig = contentCollection({
  slug: 'media-coverage',
  labels: { singular: 'Liputan Media', plural: 'Liputan Media' },
  group: 'Newsroom',
  owners,
  defaultColumns: ['title', 'outlet', 'publishDate', 'approvalStatus'],
  fields: [
    localisedText('title', 'Judul', true),
    {
      name: 'outlet',
      type: 'relationship',
      relationTo: 'media-outlets',
      required: true,
      access: lockedForApprover,
    },
    localisedTextarea('excerpt', 'Ringkasan'),
    imageField('image', 'Gambar'),
    {
      name: 'externalUrl',
      type: 'text',
      required: true,
      access: lockedForApprover,
      admin: { description: 'The article on the outlet’s site. Opens in a new tab.' },
    },
    {
      name: 'publishDate',
      type: 'date',
      required: true,
      access: lockedForApprover,
      admin: { position: 'sidebar' },
    },
  ],
})
