import { postgresAdapter } from '@payloadcms/db-postgres'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { contentEditor } from './fields/editor'
import { MAX_UPLOAD_MB } from './fields/common'
import { adminI18n } from './i18n/admin'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import {
  Articles,
  Reports,
  JobOpenings,
  ProductItems,
  ContactSubmissions,
  Users,
  AuditLog,
  Media,
} from './collections'
import { autoTranslateEndpoint } from './endpoints/autoTranslate'
import { verificationLinkEndpoint } from './endpoints/verificationLink'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '— CLIK CMS',
    },
    components: {
      graphics: {
        // Payload's own mark replaced with the CLIK logo.
        Logo: '@/components/admin/Logo#default',
        Icon: '@/components/admin/Icon#default',
      },
      // The whole sidebar is ours: real icon elements, and a Dashboard entry
      // that is the same kind of item as the rest.
      Nav: '@/components/admin/Nav#default',
      views: {
        // Replaces the default flat list of collections with grouped,
        // colour-coded cards that open each module's list directly.
        dashboard: {
          Component: '@/components/admin/Dashboard#default',
        },
      },
    },
  },

  // Indonesian is the source language; English is produced by translation
  // and reviewed by the team. Every localised field carries both.
  // The admin panel in Indonesian or English, per user. See src/i18n/admin.ts.
  i18n: adminI18n,

  localization: {
    locales: [
      { label: 'Bahasa Indonesia', code: 'id' },
      { label: 'English', code: 'en' },
    ],
    defaultLocale: 'id',
    fallback: true,
  },

  /*
   * Document locking is off for every collection. Before a save, Payload's
   * lock check reads the locked-documents table *outside* the save's
   * transaction (payload.db.find without req, still so in 3.90.2), so it
   * needs a second pooled connection while the save holds its first. Twenty
   * saves at once took all ten connections, each waiting for an eleventh, and
   * every request on the site — the public pages too — hung until a restart.
   *
   * What goes is the "someone else is editing this" notice. The approval
   * workflow already locks an item in review to everyone but its author,
   * which is the conflict that matters here.
   */
  collections: [
    // Newsroom
    Articles,
    // Report
    Reports,
    // Karir
    JobOpenings,
    // Product
    ProductItems,
    // Data
    ContactSubmissions,
    AuditLog,
    // Pengaturan
    Users,
    // Shared — needed for article, report and product images
    Media,
  ].map((collection) => ({ ...collection, lockDocuments: false as const })),
  // One editor everywhere: fixed toolbar, headings, alignment, lists,
  // links, inline images and tables. See src/fields/editor.ts.
  editor: contentEditor,
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  /*
   * The upload ceiling, from MAX_UPLOAD_MB. Enforced here at the parser so an oversized file is
   * refused before anything is written to disk; Media adds the readable
   * message. nginx allows 25M, so the limit an editor meets is this one.
   */
  upload: {
    limits: { fileSize: MAX_UPLOAD_MB * 1024 * 1024 },
    abortOnLimit: true,
    responseOnLimit: `Ukuran file melebihi ${MAX_UPLOAD_MB}MB. Perkecil gambar lalu unggah lagi.`,
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
      /*
       * A query that cannot get a connection within 10 seconds fails instead
       * of waiting for ever. If anything again holds a connection while
       * asking for another, one request errors and releases what it held;
       * without this, the whole site stopped answering and stayed stopped.
       */
      connectionTimeoutMillis: 10_000,
    },
    // Schema changes go through committed migrations, never an implicit dev
    // push. A stray push leaves a "dev" marker that makes `payload migrate`
    // stop and ask whether to risk data loss.
    push: false,
  }),
  /*
   * On staging SMTP points at Mailpit, which captures every message instead of
   * delivering it, so testing never reaches a real inbox. Production swaps in
   * the corporate SMTP values through the same environment variables.
   */
  email: nodemailerAdapter({
    defaultFromAddress: process.env.EMAIL_FROM_ADDRESS || 'no-reply@cbclik.com',
    defaultFromName: process.env.EMAIL_FROM_NAME || 'CLIK Website',
    transportOptions: {
      host: process.env.SMTP_HOST || '127.0.0.1',
      port: Number(process.env.SMTP_PORT || 1025),
      secure: process.env.SMTP_SECURE === 'true',
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
    },
  }),

  endpoints: [autoTranslateEndpoint, verificationLinkEndpoint],

  sharp,
  plugins: [],
})
