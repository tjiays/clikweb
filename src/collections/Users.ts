import type { CollectionConfig, PayloadRequest } from 'payload'
import { ROLE_OPTIONS, ROLES, isSuperAdmin } from '@/access'
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
    defaultColumns: ['name', 'email', 'role', '_verified'],
  },
  auth: {
    /*
     * A new account is inactive until the person proves the address is
     * theirs. Payload holds the flag and refuses the login itself, so there
     * is no window where an unverified account can reach the CMS.
     */
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
