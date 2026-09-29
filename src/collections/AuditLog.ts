import type { CollectionConfig } from 'payload'
import { superAdminOnly } from '@/access'
import { bothLanguages } from '@/i18n/admin'

/**
 * Who did what, and when. Written by hooks, never by hand.
 * Readable only by Super Admin (intent/03-cms.md §3).
 */
export const AuditLog: CollectionConfig = {
  slug: 'audit-log',
  labels: { singular: bothLanguages('auditLog'), plural: bothLanguages('auditLog') },
  admin: {
    group: 'Data',
    /*
     * Who and what, not just when. The relationship column alone went blank
     * the moment an account was deleted, which is the one row you most want
     * to read, and nothing named the record that was acted on.
     */
    defaultColumns: ['action', 'collectionSlug', 'documentTitle', 'actor', 'detail', 'createdAt'],
    useAsTitle: 'action',
  },
  access: {
    read: superAdminOnly,
    create: () => false,
    update: () => false,
    delete: () => false,
  },
  fields: [
    { name: 'action', type: 'text', required: true, index: true, label: { en: 'Action', id: 'Aksi' } },
    { name: 'collectionSlug', type: 'text', index: true, label: { en: 'Menu', id: 'Menu' } },
    { name: 'documentId', type: 'text', index: true, label: { en: 'Item ID', id: 'ID Item' } },
    { name: 'documentTitle', type: 'text', label: { en: 'Item', id: 'Item' } },
    { name: 'user', type: 'relationship', relationTo: 'users', label: { en: 'Account', id: 'Akun' } },
    { name: 'userEmail', type: 'text', label: { en: 'Email', id: 'Email' } },
    { name: 'detail', type: 'textarea', label: { en: 'Detail', id: 'Detail' } },
    {
      /*
       * Reads the stored address rather than the link, so the name survives
       * the account being deleted. See AuditActorCell.
       */
      name: 'actor',
      type: 'ui',
      label: { en: 'By', id: 'Oleh' },
      admin: { components: { Cell: '@/components/admin/AuditActorCell#default' } },
    },
  ],
  timestamps: true,
}
