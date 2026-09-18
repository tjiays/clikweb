import type { Metadata } from 'next'
import { Nunito_Sans } from 'next/font/google'
import { notFound } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BackToTop } from '@/components/ui/BackToTop'
import { getDictionary } from '@/i18n'
import { isLocale, locales } from '@/i18n/config'
import '@/styles/globals.css'

/*
 * Nunito Sans everywhere, replacing the Roboto / Inter / Open Sans /
 * Plus Jakarta Sans found in Figma (confirmed decision 1). next/font
 * self-hosts the files, so no request goes to Google at page load.
 */
const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-nunito-sans',
})

// SITE_URL is read at runtime; NEXT_PUBLIC_SERVER_URL is inlined at build
// time. Using the runtime value first means the canonical and hreflang tags
// are right without rebuilding for each environment.
const siteUrl = (
  process.env.SITE_URL ||
  process.env.NEXT_PUBLIC_SERVER_URL ||
  'https://cbclik.com'
).replace(/\/$/, '')

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'CLIK — PT CRIF Lembaga Informasi Keuangan',
    template: '%s — CLIK',
  },
  description:
    'PT CRIF Lembaga Informasi Keuangan (CLIK) adalah biro kredit swasta berizin dan diawasi OJK.',
  robots: {
    // Staging must never be indexed. SITE_ENV=production opens it at go-live,
    // so a deployment missing the variable stays closed rather than opening
    // by accident.
    index: process.env.SITE_ENV === 'production',
    follow: process.env.SITE_ENV === 'production',
  },
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const dict = await getDictionary(locale)

  return (
    <html lang={locale} className={nunitoSans.variable}>
      <body>
        <a href="#main" className="sr-only">
          {dict.common.skipToContent}
        </a>
        <Header locale={locale} dict={dict} />
        <main id="main">{children}</main>
        <Footer locale={locale} dict={dict} />
        <BackToTop label={dict.common.backToTop} />
      </body>
    </html>
  )
}
