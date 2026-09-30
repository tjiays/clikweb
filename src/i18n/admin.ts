import { en } from '@payloadcms/translations/languages/en'
import { id } from '@payloadcms/translations/languages/id'

/**
 * The admin in both languages.
 *
 * Payload ships full Indonesian translations and they were simply never
 * switched on, which is why the chrome was English while half our own labels
 * were Indonesian. Turning them on makes the whole panel follow whichever
 * language the signed-in user picked in their account.
 *
 * `clik` holds the labels Payload has no opinion about — our own menu. The
 * sidebar reads them through the same t() the rest of the admin uses, so a
 * user switching language moves the menu with everything else.
 */
export const clikAdminStrings = {
  en: {
    dashboard: 'Dashboard',
    news: 'News',
    reports: 'Reports',
    products: 'Products',
    careers: 'Careers',
    enquiries: 'Enquiries',
    auditLog: 'Audit Log',
    media: 'Media',
    users: 'Users',
    account: 'Account',
    signOut: 'Sign out',
    menu: 'Main menu',
  },
  id: {
    // Dasbor is the formal translation, but Indonesian business software
    // keeps "Dashboard" and the team will read that faster.
    dashboard: 'Dashboard',
    news: 'Berita',
    reports: 'Laporan',
    products: 'Produk',
    // The glossary in intent/04 fixes Karir <-> Careers.
    careers: 'Karir',
    enquiries: 'Data Masuk',
    auditLog: 'Log Audit',
    media: 'Media',
    users: 'Pengguna',
    account: 'Akun',
    signOut: 'Keluar',
    menu: 'Menu utama',
  },
} as const

export const adminI18n = {
  // Indonesian by default: everyone editing this site works in it.
  fallbackLanguage: 'id' as const,
  supportedLanguages: { en, id },
  translations: {
    en: { clik: clikAdminStrings.en },
    id: { clik: clikAdminStrings.id },
  },
}

/** Both languages of a label, for Payload's own collection titles. */
export const bothLanguages = (key: keyof typeof clikAdminStrings.en) => ({
  en: clikAdminStrings.en[key],
  id: clikAdminStrings.id[key],
})
