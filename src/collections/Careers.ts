import type { CollectionConfig } from 'payload'
import { contentCollection } from './factory'
import { MODULE_OWNERS } from '@/access'
import { localisedText, richText, slugField, sortOrderField } from '@/fields/common'
import { lockedForApprover } from '@/fields/approval'
import { bothLanguages } from '@/i18n/admin'

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
  defaultColumns: ['title', 'category', 'isOpen', 'approvalStatus'],
  fields: [
    localisedText('title', 'Nama posisi', true),
    slugField(),
    {
      // The category list is fixed and lives in src/content/careers.ts, so it
      // is a select rather than its own collection.
      name: 'category',
      type: 'select',
      label: 'Kategori',
      required: true,
      access: lockedForApprover,
      options: [
        { label: 'Information Technology', value: 'information-technology' },
        { label: 'Analysis & Reporting', value: 'analysis-reporting' },
        { label: 'Sales & Business Development', value: 'sales-business-development' },
      ],
    },
    richText('responsibilities', 'Key Responsibilities'),
    richText('minimumQualifications', 'Minimum Qualifications'),
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
