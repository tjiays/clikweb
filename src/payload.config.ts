import { postgresAdapter } from '@payloadcms/db-postgres'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
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
  localization: {
    locales: [
      { label: 'Bahasa Indonesia', code: 'id' },
      { label: 'English', code: 'en' },
    ],
    defaultLocale: 'id',
    fallback: true,
  },

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
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
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

  endpoints: [autoTranslateEndpoint],

  sharp,
  plugins: [],
})
