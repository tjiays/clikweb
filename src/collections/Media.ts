import type { CollectionConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'
import { APIError } from 'payload'
import { isSuperAdmin, isApprover, isSalesAdmin } from '@/access'

const dirname = path.dirname(fileURLToPath(import.meta.url))

/** Matches config.upload.limits.fileSize in src/payload.config.ts. */
const MAX_UPLOAD_BYTES = 20 * 1024 * 1024

/**
 * Shared media library. Editors upload and reuse; the Approver may look but
 * not change; Sales Admin has no reason to be here (intent/03-cms.md §2).
 *
 * It sits in its own menu group rather than under Newsroom: articles,
 * reports, products and job openings all draw from the same library, and
 * filing it under one of them suggested it belonged to that one.
 *
 * Files live on disk, not in the database, and are backed up separately.
 */
export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Media', plural: 'Media Library' },
  admin: { group: 'Media', useAsTitle: 'filename' },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user) && !isApprover(user) && !isSalesAdmin(user),
    update: ({ req: { user } }) => Boolean(user) && !isApprover(user) && !isSalesAdmin(user),
    delete: ({ req: { user } }) => isSuperAdmin(user),
  },
  hooks: {
    beforeValidate: [
      ({ req }) => {
        /*
         * The parser already refuses anything over 20MB, but its message is
         * generic. Catching it here names the actual size, which is the
         * difference between an editor resizing the file and an editor
         * filing a bug.
         */
        const size = req?.file?.size
        if (typeof size === 'number' && size > MAX_UPLOAD_BYTES) {
          const mb = (size / 1024 / 1024).toFixed(1)
          throw new APIError(
            `Gambar ini berukuran ${mb}MB, melebihi batas 20MB. Perkecil ukurannya lalu unggah lagi.`,
            413,
          )
        }
      },
    ],
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
      // Hidden like the one on content collections; the seed scripts use it.
      name: 'isSample',
      type: 'checkbox',
      label: 'Sample content',
      defaultValue: false,
      admin: { position: 'sidebar', hidden: true },
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
