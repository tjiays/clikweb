import type { CollectionConfig } from 'payload'
import { contentCollection } from './factory'
import { MODULE_OWNERS } from '@/access'
import { localisedText, richText, slugField, sortOrderField } from '@/fields/common'
import { lockedForApprover } from '@/fields/approval'

const owners = MODULE_OWNERS.karir

export const JobCategories: CollectionConfig = contentCollection({
  slug: 'job-categories',
  labels: { singular: 'Kategori Lowongan', plural: 'Kategori Lowongan' },
  group: 'Karir',
  owners,
  useAsTitle: 'name',
  defaultColumns: ['name', 'updatedAt'],
  approval: false,
  fields: [localisedText('name', 'Nama kategori', true)],
})

export const JobOpenings: CollectionConfig = contentCollection({
  slug: 'job-openings',
  labels: { singular: 'Lowongan Pekerjaan', plural: 'Lowongan Pekerjaan' },
  group: 'Karir',
  owners,
  defaultColumns: ['title', 'category', 'isOpen', 'approvalStatus'],
  fields: [
    localisedText('title', 'Nama posisi', true),
    slugField(),
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'job-categories',
      required: true,
      access: lockedForApprover,
    },
    richText('responsibilities', 'Key Responsibilities'),
    richText('minimumQualifications', 'Minimum Qualifications'),
    richText('education', 'Education'),
    {
      name: 'applyEmail',
      type: 'text',
      defaultValue: 'talent@cbclik.com',
      access: lockedForApprover,
      admin: { description: 'The "Lamar" button opens an email to this address.' },
    },
    localisedText(
      'emailSubjectFormat',
      'Format subjek email',
    ),
    {
      name: 'isOpen',
      type: 'checkbox',
      label: 'Lowongan masih dibuka',
      defaultValue: true,
      access: lockedForApprover,
      admin: {
        position: 'sidebar',
        description: 'Only open positions are listed on the website.',
      },
    },
    {
      name: 'postedDate',
      type: 'date',
      access: lockedForApprover,
      admin: { position: 'sidebar' },
    },
    sortOrderField,
  ],
})
