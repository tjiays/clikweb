import type { GlobalConfig } from 'payload'
import { superAdminOnly, authenticated } from '@/access'
import { localisedTextarea } from '@/fields/common'

/** Contact details, emails, social links and licence number (Super Admin only). */
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Pengaturan Umum',
  admin: { group: 'Pengaturan' },
  access: { read: () => true, update: superAdminOnly },
  fields: [
    { name: 'companyName', type: 'text', required: true, defaultValue: 'PT CRIF Lembaga Informasi Keuangan' },
    localisedTextarea('address', 'Alamat'),
    { name: 'phone', type: 'text', defaultValue: '(+62) 21 8060 4228' },
    {
      type: 'collapsible',
      label: 'Email addresses',
      fields: [
        { name: 'generalEmail', type: 'email', defaultValue: 'info@cbclik.com' },
        { name: 'salesEmail', type: 'email', defaultValue: 'sales@cbclik.com', admin: { description: 'Contact form submissions are sent here.' } },
        { name: 'careersEmail', type: 'email', defaultValue: 'talent@cbclik.com' },
      ],
    },
    { name: 'websiteUrl', type: 'text', defaultValue: 'https://www.cbclik.com' },
    { name: 'mapEmbedUrl', type: 'textarea', admin: { description: 'Google Maps embed URL for the Contact page.' } },
    { name: 'ojkLicenceNumber', type: 'text' },
    { name: 'crifUrl', type: 'text', admin: { description: 'Official CRIF Global website.' } },
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: ['LinkedIn', 'Instagram', 'Facebook', 'X', 'WhatsApp', 'YouTube'].map((v) => ({ label: v, value: v.toLowerCase() })),
        },
        { name: 'url', type: 'text', required: true },
      ],
    },
    {
      name: 'defaultSeo',
      type: 'group',
      fields: [
        { name: 'title', type: 'text', localized: true },
        { name: 'description', type: 'textarea', localized: true },
      ],
    },
  ],
}
