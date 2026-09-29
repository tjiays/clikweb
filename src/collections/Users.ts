import { APIError } from 'payload'
import type { CollectionConfig, PayloadRequest } from 'payload'
import { ROLE_OPTIONS, ROLES, isSuperAdmin } from '@/access'
import { recordAudit, recordDeletion } from '@/hooks/audit'
import { bothLanguages } from '@/i18n/admin'


/*
 * The link has to be absolute, and staging answers on more than one address
 * — a LAN one and a Tailscale one. Reading it off the request means the link
 * always points at whichever admin actually created the account, rather than
 * at whichever host an environment variable happened to name.
 */
const originOf = (req: PayloadRequest) => {
  const headers = req?.headers
  const forwarded = headers?.get?.('x-forwarded-host')
  const host = forwarded || headers?.get?.('host')
  const proto = headers?.get?.('x-forwarded-proto') || 'http'
  if (host) return `${proto}://${host}`
  return (process.env.SITE_URL || process.env.NEXT_PUBLIC_SERVER_URL || '').replace(/\/$/, '')
}

/** Plain, so it survives every mail client; both languages, as the CMS is. */
const verificationEmail = ({
  origin,
  token,
  name,
}: {
  origin: string
  token: string
  name?: string
}) => {
  const url = `${origin}/admin/verify/${token}`
  return `
<div style="font-family:'Nunito Sans',Arial,sans-serif;color:#000;line-height:1.6">
  <p style="font-size:18px;font-weight:700;color:#003a79;margin:0 0 16px">Aktifkan akun CMS CLIK</p>
  <p style="margin:0 0 12px">Halo${name ? ` ${name}` : ''}, sebuah akun telah dibuat untuk Anda di CMS CLIK.</p>
  <p style="margin:0 0 20px">Klik tombol di bawah untuk mengaktifkannya. Sebelum diaktifkan, akun belum bisa dipakai masuk.</p>
  <p style="margin:0 0 24px">
    <a href="${url}" style="background:#ff7d00;color:#fff;font-weight:700;text-decoration:none;padding:12px 20px;border-radius:6px;display:inline-block">Aktifkan akun</a>
  </p>
  <p style="margin:0 0 24px;font-size:13px;color:#697077">Bila tombol tidak berfungsi, salin tautan ini: <br>${url}</p>
  <hr style="border:none;border-top:1px solid #dbe4f0;margin:24px 0">
  <p style="font-size:18px;font-weight:700;color:#003a79;margin:0 0 16px">Activate your CLIK CMS account</p>
  <p style="margin:0 0 12px">Hello${name ? ` ${name}` : ''}, an account has been created for you in the CLIK CMS.</p>
  <p style="margin:0 0 20px">Use the button above to activate it. The account cannot sign in until you do.</p>
  <p style="margin:0;font-size:12px;color:#697077">Jika Anda tidak mengharapkan email ini, abaikan saja. / If you were not expecting this email, please ignore it.</p>
</div>`
}

/** Only Super Admin manages users (intent/03-cms.md §1). */
export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: bothLanguages('users'), plural: bothLanguages('users') },
  admin: {
    group: 'Pengaturan',
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'role', '_verified', 'deleteRow'],
  },
  auth: {
    /*
     * A new account is inactive until the person proves the address is
     * theirs. Payload holds the flag and refuses the login itself, so there
     * is no window where an unverified account can reach the CMS.
     */
    /*
     * Secure once the site is served over HTTPS, so the login cookie never
     * travels unencrypted — including on the first plain-http request that
     * nginx is about to redirect. Staging is plain http, where a Secure cookie
     * would never be sent back and nobody could log in, so it follows
     * SITE_URL rather than being hard-coded. Read when the server starts.
     */
    cookies: {
      secure: (process.env.SITE_URL ?? '').startsWith('https://'),
      sameSite: 'Lax',
    },
    verify: {
      generateEmailSubject: ({ user }: { user: { name?: string } }) =>
        `Aktifkan akun CMS CLIK Anda${user?.name ? `, ${user.name}` : ''}`,
      generateEmailHTML: ({ req, token, user }: { req: PayloadRequest; token: string; user: any }) =>
        verificationEmail({ origin: originOf(req), token, name: user?.name }),
    },
  },
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
    {
      // The activation link, for a Super Admin, while an account is pending.
      name: 'verificationLink',
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: { Field: '@/components/admin/VerificationLink#default' },
      },
    },
    {
      // Payload's own delete hides behind the three dots; this one is visible.
      name: 'deleteAccount',
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: { Field: '@/components/admin/DeleteUser#default' },
      },
    },
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
    {
      /*
       * A per-row delete on the list. The cell renders nothing unless the
       * viewer is a Super Admin, so the column is present but empty for
       * everyone else. Named in defaultColumns so it is shown by default.
       */
      name: 'deleteRow',
      type: 'ui',
      label: { en: 'Delete', id: 'Hapus' },
      admin: {
        components: { Cell: '@/components/admin/DeleteUserCell#default' },
      },
    },
  ],
  hooks: {
    /*
     * The same rule the delete guard keeps, applied to the role: nothing may
     * leave the CMS without a Super Admin. Deleting the last one was refused,
     * but changing their role was not — one save, and nobody could manage
     * users again short of editing the database.
     */
    beforeChange: [
      async ({ req, data, originalDoc, operation }) => {
        if (operation !== 'update' || !data) return data
        if ((originalDoc as { role?: string })?.role !== ROLES.superAdmin) return data
        if (!data.role || data.role === ROLES.superAdmin) return data

        const others = await req.payload.count({
          collection: 'users',
          where: {
            and: [
              { role: { equals: ROLES.superAdmin } },
              { id: { not_equals: (originalDoc as { id: unknown }).id } },
            ],
          } as never,
          overrideAccess: true,
          req,
        })
        if (others.totalDocs === 0) {
          throw new APIError(
            'Ini satu-satunya Super Admin. Mengubah perannya membuat CMS tidak bisa dikelola lagi. Jadikan pengguna lain Super Admin lebih dulu.',
            400,
          )
        }
        return data
      },
    ],
    // Creating a user, changing a role, verifying an address: all recorded.
    afterChange: [recordAudit],
    /*
     * Deleting a user is permanent and, done to the wrong one, not
     * recoverable from inside the CMS. Payload asks for confirmation, which
     * catches a misclick but not a mistake, so the two that actually lock
     * people out are refused outright.
     *
     * Everything a user is referenced by — audit entries, who submitted or
     * reviewed a document — is SET NULL rather than cascaded, so removing an
     * account unlinks them and destroys no history. The audit log also keeps
     * the address as plain text, so who did what survives the account.
     */
    beforeDelete: [
      async ({ req, id }) => {
        if (String(req.user?.id) === String(id)) {
          throw new APIError(
            'Anda tidak bisa menghapus akun Anda sendiri. Minta Super Admin lain melakukannya.',
            400,
          )
        }

        const target = await req.payload.findByID({
          collection: 'users',
          id,
          overrideAccess: true,
          depth: 0,
          req,
        })

        if ((target as { role?: string })?.role !== ROLES.superAdmin) return

        const supers = await req.payload.count({
          collection: 'users',
          where: { role: { equals: ROLES.superAdmin } },
          overrideAccess: true,
          req,
        })

        if (supers.totalDocs <= 1) {
          throw new APIError(
            'Ini satu-satunya Super Admin. Menghapusnya membuat CMS tidak bisa dikelola lagi. Buat Super Admin lain lebih dulu.',
            400,
          )
        }
      },
    ],
    // A removed account is itself worth recording.
    afterDelete: [recordDeletion],
  },
  timestamps: true,
}
