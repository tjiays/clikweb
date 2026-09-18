import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { isLocale, type Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n'
import { matchRoute, type RouteKey } from '@/i18n/routes'
import { HomePage } from '@/components/pages/HomePage'
import { AboutPage } from '@/components/pages/AboutPage'
import { ProductsPage } from '@/components/pages/ProductsPage'
import { BusinessSolutionPage } from '@/components/pages/BusinessSolutionPage'
import { CreditScoringPage } from '@/components/pages/CreditScoringPage'
import { StaticContentPage } from '@/components/pages/StaticContentPage'

/**
 * One catch-all route serves every page, because the Indonesian and English
 * slugs differ (open item O6). The path is matched against the route map in
 * src/i18n/routes.ts rather than mirrored as two folder trees.
 */

type Params = { locale: string; slug?: string[] }

const pathOf = (slug?: string[]) => `/${(slug ?? []).join('/')}`.replace(/\/$/, '') || '/'

/** Pages built in Phase 3. The rest arrive with their own phases. */
const PAGES: Partial<Record<RouteKey, (props: { locale: Locale }) => Promise<React.ReactElement>>> =
  {
    home: HomePage,
    about: AboutPage,
    products: ProductsPage,
    businessSolution: BusinessSolutionPage,
    creditScoring: CreditScoringPage,
  }

const STATIC_PAGES: Partial<Record<RouteKey, string>> = {
  infoSecurityPolicy: 'information_security_policy',
  privacyPolicy: 'privacy_policy',
  howToGetReport: 'how_to_get_credit_report',
  complaintResolution: 'complaint_resolution',
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const key = matchRoute(pathOf(slug), locale)
  if (!key) return {}
  const dict = await getDictionary(locale)
  const titles: Partial<Record<RouteKey, string>> = {
    home: dict.nav.home,
    about: dict.dropdown.aboutClik,
    products: dict.dropdown.products,
    businessSolution: dict.dropdown.businessSolution,
    creditScoring: dict.dropdown.creditScoring,
    infoSecurityPolicy: dict.dropdown.infoSecurityPolicy,
    privacyPolicy: dict.dropdown.privacyPolicy,
  }
  return titles[key] ? { title: titles[key] } : {}
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()

  const key = matchRoute(pathOf(slug), locale)
  if (!key) notFound()

  const staticKey = STATIC_PAGES[key]
  if (staticKey) {
    return <StaticContentPage locale={locale} pageKey={staticKey} routeKey={key} />
  }

  const Component = PAGES[key]
  if (!Component) notFound()

  return Component({ locale })
}
