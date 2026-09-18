import type { CollectionConfig } from 'payload'
import { isSalesAdmin, isSuperAdmin } from '@/access'

/**
 * Contact form submissions (intent/04). Stored permanently and never deleted
 * (confirmed decision 19). Viewed by Sales Admin and Super Admin.
 *
 * The form itself is built in Phase 5; this is the record it writes to.
 */
export const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  labels: { singular: 'Data Masuk', plural: 'Data Masuk (Hubungi Kami)' },
  admin: {
    group: 'Data',
    useAsTitle: 'email',
    defaultColumns: ['email', 'companyName', 'interestedIn', 'followedUp', 'createdAt'],
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
      name: 'followedUp',
      type: 'checkbox',
      label: 'Sudah ditindaklanjuti',
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
      ({ data, req, originalDoc }) => {
        if (data?.followedUp && !originalDoc?.followedUp) {
          data.followedUpBy = req.user?.id
          data.followedUpAt = new Date().toISOString()
        }
        return data
      },
    ],
  },
  timestamps: true,
}
