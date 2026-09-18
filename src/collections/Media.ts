import type { CollectionConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'
import { isSuperAdmin, isApprover, isSalesAdmin } from '@/access'

const dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Shared media library. Editors upload and reuse; the Approver may look but
 * not change; Sales Admin has no reason to be here (intent/03-cms.md §2).
 *
 * Files live on disk, not in the database, and are backed up separately.
 */
export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Media', plural: 'Media Library' },
  admin: { group: 'Shared', useAsTitle: 'filename' },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user) && !isApprover(user) && !isSalesAdmin(user),
    update: ({ req: { user } }) => Boolean(user) && !isApprover(user) && !isSalesAdmin(user),
    delete: ({ req: { user } }) => isSuperAdmin(user),
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description:
          'Describes the image for readers using a screen reader, and shows if the image fails to load.',
      },
    },
    {
      name: 'isSample',
      type: 'checkbox',
      label: 'Sample content',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Placeholder from the design. Replace before launch.',
      },
    },
  ],
  upload: {
    staticDir: path.resolve(dirname, '../../public/media'),
    mimeTypes: ['image/*', 'application/pdf'],
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 768, height: 512, position: 'centre' },
      { name: 'wide', width: 1440, position: 'centre' },
    ],
  },
}
