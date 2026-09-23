import type { CollectionConfig } from 'payload'
import { contentCollection } from './factory'
import { MODULE_OWNERS } from '@/access'
import { slugField, sortOrderField } from '@/fields/common'
import { lockedForApprover } from '@/fields/approval'
import { bothLanguages } from '@/i18n/admin'
import { jobCategories } from '@/content/careers'

const owners = MODULE_OWNERS.karir

export const JobOpenings: CollectionConfig = contentCollection({
  slug: 'job-openings',
  labels: { singular: bothLanguages('careers'), plural: bothLanguages('careers') },
  group: 'Karir',
  owners,
  preview: { id: '/karir', en: '/en/careers' },
  // The sidebar is down to what a job actually needs, so the two language
  // helpers would be most of what is left on it.
  autoTranslate: false,
  languageStatus: false,
  useAsTitle: 'titleId',
  defaultColumns: ['titleId', 'category', 'isOpen', 'approvalStatus'],
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'titleId',
          type: 'text',
          label: 'Nama posisi (Bahasa Indonesia)',
          required: true,
          access: lockedForApprover,
          admin: { width: '50%' },
        },
        {
          name: 'titleEn',
          type: 'text',
          label: 'Position (English)',
          required: true,
          access: lockedForApprover,
          admin: { width: '50%' },
        },
      ],
    },
    slugField('titleId', false),
    {
      /*
       * Built from jobCategories in src/content/careers.ts, which is also
       * what the site reads to label a job card. Two hand-kept lists had
       * already started to disagree on wording.
       */
      name: 'category',
      type: 'select',
      label: 'Kategori',
      required: true,
      access: lockedForApprover,
      options: jobCategories.map((c) => ({ label: c.name.en, value: c.slug })),
    },
    {
      name: 'responsibilitiesId',
      type: 'richText',
      label: 'Tanggung jawab (Bahasa Indonesia)',
      access: lockedForApprover,
    },
    {
      name: 'responsibilitiesEn',
      type: 'richText',
      label: 'Key Responsibilities (English)',
      access: lockedForApprover,
    },
    {
      name: 'minimumQualificationsId',
      type: 'richText',
      label: 'Persyaratan (Bahasa Indonesia)',
      access: lockedForApprover,
    },
    {
      name: 'minimumQualificationsEn',
      type: 'richText',
      label: 'Minimum Qualifications (English)',
      access: lockedForApprover,
    },
    {
      /*
       * The Lamar button sends applicants here instead of opening a mail
       * client. One company page rather than a link per role: the roles
       * listed on JobStreet are not the ones seeded here, so a deep link
       * per job would point at nothing.
       */
      name: 'applyUrl',
      type: 'text',
      label: 'Tautan lamaran (JobStreet)',
      access: lockedForApprover,
      admin: {
        description: {
          en: 'Where the Apply button goes. Leave empty to use the careers page default.',
          id: 'Tujuan tombol Lamar. Kosongkan untuk memakai tautan bawaan.',
        },
      },
    },
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
    sortOrderField,
  ],
})
