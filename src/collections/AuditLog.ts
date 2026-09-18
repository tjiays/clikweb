import type { CollectionConfig } from 'payload'
import { superAdminOnly } from '@/access'

/**
 * Who did what, and when. Written by hooks, never by hand.
 * Readable only by Super Admin (intent/03-cms.md §3).
 */
export const AuditLog: CollectionConfig = {
  slug: 'audit-log',
  labels: { singular: 'Audit Log Entry', plural: 'Audit Log' },
  admin: {
    group: 'Pengaturan',
    defaultColumns: ['action', 'collectionSlug', 'user', 'createdAt'],
    useAsTitle: 'action',
  },
  access: {
    read: superAdminOnly,
    create: () => false,
    update: () => false,
    delete: () => false,
  },
  fields: [
    { name: 'action', type: 'text', required: true, index: true },
    { name: 'collectionSlug', type: 'text', index: true },
    { name: 'documentId', type: 'text', index: true },
    { name: 'documentTitle', type: 'text' },
    { name: 'user', type: 'relationship', relationTo: 'users' },
    { name: 'userEmail', type: 'text' },
    { name: 'detail', type: 'textarea' },
  ],
  timestamps: true,
}
