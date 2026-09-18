import type { CollectionConfig } from 'payload'
import { ROLE_OPTIONS, ROLES, isSuperAdmin } from '@/access'

/** Only Super Admin manages users (intent/03-cms.md §1). */
export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'User', plural: 'Users & Roles' },
  admin: {
    group: 'Pengaturan',
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'role'],
  },
  auth: true,
  access: {
    read: ({ req: { user } }) => {
      if (isSuperAdmin(user)) return true
      // Everyone else may only see their own record.
      return user ? { id: { equals: user.id } } : false
    },
    create: ({ req: { user } }) => isSuperAdmin(user),
    update: ({ req: { user, routeParams } }) => {
      if (isSuperAdmin(user)) return true
      return user ? { id: { equals: user.id } } : false
    },
    delete: ({ req: { user } }) => isSuperAdmin(user),
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: ROLES.newsAdmin,
      options: ROLE_OPTIONS,
      // A user must never be able to promote themselves.
      access: { update: ({ req: { user } }) => isSuperAdmin(user) },
      admin: { description: 'A user has exactly one role.' },
    },
  ],
  timestamps: true,
}
