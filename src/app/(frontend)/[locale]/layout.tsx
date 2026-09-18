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

export const metadata: Metadata = {
  title: {
    default: 'CLIK — PT CRIF Lembaga Informasi Keuangan',
    template: '%s — CLIK',
  },
  description:
    'PT CRIF Lembaga Informasi Keuangan (CLIK) adalah biro kredit swasta berizin dan diawasi OJK.',
  robots: {
    // Staging must never be indexed. Relaxed at go-live in Phase 6.
    index: false,
    follow: false,
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
