import type { CollectionConfig } from 'payload'
import { isSalesAdmin, isSuperAdmin } from '@/access'
import { bothLanguages } from '@/i18n/admin'

/** Where an enquiry stands with sales. Nobody has touched it, or somebody has. */
export const FOLLOW_UP_STATUSES = { new: 'new', followUp: 'follow_up' } as const

/**
 * Contact form submissions (intent/04). Stored permanently and never deleted
 * (confirmed decision 19). Viewed by Sales Admin and Super Admin.
 *
 * The form itself is built in Phase 5; this is the record it writes to.
 */
export const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  labels: { singular: bothLanguages('enquiries'), plural: bothLanguages('enquiries') },
  admin: {
    group: 'Data',
    useAsTitle: 'email',
    defaultColumns: ['email', 'companyName', 'interestedIn', 'followUpStatus', 'createdAt'],
  },
  access: {
    // The public contact form creates these.
    create: () => true,
    read: ({ req: { user } }) => isSuperAdmin(user) || isSalesAdmin(user),
    // Only the "followed up" flags may be changed; see field access below.
    update: ({ req: { user } }) => isSuperAdmin(user) || isSalesAdmin(user),
    delete: () => false,
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'firstName', type: 'text', required: true, access: { update: () => false } },
        { name: 'lastName', type: 'text', required: true, access: { update: () => false } },
      ],
    },
    { name: 'email', type: 'email', required: true, index: true, access: { update: () => false } },
    { name: 'phone', type: 'text', required: true, index: true, access: { update: () => false } },
    { name: 'companyName', type: 'text', required: true, access: { update: () => false } },
    {
      name: 'interestedIn',
      type: 'select',
      required: true,
      access: { update: () => false },
      options: [
        'Business Information',
        'Business Analytics',
        'Business Solutions',
        'Market Research',
        'CRIF PLUS Membership Programme',
        'Credit Bureau',
        'General Enquiries',
      ].map((value) => ({ label: value, value })),
    },
    {
      name: 'hearAboutUs',
      type: 'select',
      access: { update: () => false },
      options: [
        'Conference/Exhibition',
        'Flyer/Leaflet',
        'Google Search',
        'Magazine',
        'Referral',
        'Social Media',
        'Webinar',
        'Other',
      ].map((value) => ({ label: value, value })),
    },
    { name: 'message', type: 'textarea', access: { update: () => false } },
    {
      name: 'consent',
      type: 'checkbox',
      required: true,
      label: 'Consent to be contacted',
      access: { update: () => false },
    },
    {
      name: 'marketingChannels',
      type: 'select',
      hasMany: true,
      access: { update: () => false },
      options: ['SMS/WhatsApp', 'Telephone', 'Email', 'Newsletter'].map((value) => ({
        label: value,
        value,
      })),
    },
    {
      name: 'marketingPreference',
      type: 'select',
      access: { update: () => false },
      options: [
        { label: 'Wants marketing information', value: 'opt_in' },
        { label: 'Does not want marketing information', value: 'opt_out' },
      ],
    },

    // --- Context captured with the submission, for rate limiting and audit ---
    {
      type: 'collapsible',
      label: 'Submission context',
      admin: { initCollapsed: true },
      fields: [
        { name: 'locale', type: 'text', access: { update: () => false } },
        { name: 'pageUrl', type: 'text', access: { update: () => false } },
        { name: 'ipAddress', type: 'text', index: true, access: { update: () => false } },
        { name: 'userAgent', type: 'textarea', access: { update: () => false } },
        { name: 'consentTextVersion', type: 'text', access: { update: () => false } },
      ],
    },

    // --- The only fields Sales Admin may change (open item O2) ---
    {
      /*
       * Where the enquiry stands with sales. Two states, because there are
       * only two things anyone needs to know: nobody has touched this yet,
       * or somebody has. It replaced a "sudah ditindaklanjuti" checkbox,
       * which said the same thing but read as a task rather than a state.
       *
       * Not named `status`: Payload reserves enum_<table>_status for the
       * draft/published column it manages itself.
       */
      name: 'followUpStatus',
      type: 'select',
      required: true,
      defaultValue: FOLLOW_UP_STATUSES.new,
      label: { en: 'Status', id: 'Status' },
      options: [
        { label: { en: 'New', id: 'Baru' }, value: FOLLOW_UP_STATUSES.new },
        { label: { en: 'Follow Up', id: 'Ditindaklanjuti' }, value: FOLLOW_UP_STATUSES.followUp },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'followedUpBy',
      type: 'relationship',
      relationTo: 'users',
      admin: { position: 'sidebar', readOnly: true },
      access: { update: () => false },
    },
    {
      name: 'followedUpAt',
      type: 'date',
      admin: { position: 'sidebar', readOnly: true },
      access: { update: () => false },
    },
  ],
  hooks: {
    beforeChange: [
      /*
       * The stamp follows the status rather than being set once. Moving an
       * enquiry back to New clears it, so "followed up by" never names
       * someone for work the record no longer claims happened.
       */
      ({ data, req, originalDoc }) => {
        if (!data) return data
        const next = data.followUpStatus
        const previous = originalDoc?.followUpStatus
        if (next === previous) return data

        if (next === FOLLOW_UP_STATUSES.followUp) {
          data.followedUpBy = req.user?.id
          data.followedUpAt = new Date().toISOString()
        } else {
          data.followedUpBy = null
          data.followedUpAt = null
        }
        return data
      },
    ],
  },
  timestamps: true,
}
