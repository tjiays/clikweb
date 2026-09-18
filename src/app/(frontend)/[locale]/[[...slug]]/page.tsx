import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { isLocale, type Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n'
import { matchRoute, routes, type RouteKey } from '@/i18n/routes'
import { HomePage } from '@/components/pages/HomePage'
import { AboutPage } from '@/components/pages/AboutPage'
import { ProductsPage } from '@/components/pages/ProductsPage'
import { BusinessSolutionPage } from '@/components/pages/BusinessSolutionPage'
import { CreditScoringPage } from '@/components/pages/CreditScoringPage'
import { StaticContentPage } from '@/components/pages/StaticContentPage'
import { NewsroomPage } from '@/components/pages/NewsroomPage'
import { ArticleDetailPage } from '@/components/pages/ArticleDetailPage'
import { MediaCoveragePage } from '@/components/pages/MediaCoveragePage'
import { ReportsPage, ReportDetailPage } from '@/components/pages/ReportsPage'
import { CareersPage, JobDetailPage } from '@/components/pages/CareersPage'
import { ContactPage } from '@/components/pages/ContactPage'
import { matchDynamicRoute } from '@/i18n/routes'

/**
 * One catch-all route serves every page, because the Indonesian and English
 * slugs differ (open item O6). The path is matched against the route map in
 * src/i18n/routes.ts rather than mirrored as two folder trees.
 */

type Params = { locale: string; slug?: string[] }
type Search = Promise<Record<string, string | string[] | undefined>>

/** ?page=n, defaulting to the first page. */
const pageNumber = (value: string | string[] | undefined): number => {
  const raw = Array.isArray(value) ? value[0] : value
  const parsed = Number.parseInt(raw ?? '1', 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1
}

const pathOf = (slug?: string[]) => `/${(slug ?? []).join('/')}`.replace(/\/$/, '') || '/'

/** Pages built in Phase 3. The rest arrive with their own phases. */
const PAGES: Partial<Record<RouteKey, (props: { locale: Locale }) => Promise<React.ReactElement>>> =
  {
    home: HomePage,
    about: AboutPage,
    products: ProductsPage,
    businessSolution: BusinessSolutionPage,
    creditScoring: CreditScoringPage,
    careers: CareersPage,
    contact: ContactPage,
  }

/** Pages that read ?page=n. */
const PAGINATED: Partial<
  Record<RouteKey, (props: { locale: Locale; page: number }) => Promise<React.ReactElement>>
> = {
  newsroom: NewsroomPage,
  reports: ReportsPage,
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
  // hreflang: tells search engines these two URLs are the same page in
  // different languages, so the right one is served to the right reader.
  const idPath = routes[key].id
  const enPath = routes[key].en === '/' ? '/en' : `/en${routes[key].en}`
  const alternates = {
    canonical: locale === 'id' ? idPath : enPath,
    languages: {
      'id-ID': idPath,
      'en': enPath,
      'x-default': idPath,
    },
  }

  const titles: Partial<Record<RouteKey, string>> = {
    home: dict.nav.home,
    newsroom: dict.nav.newsroom,
    reports: dict.dropdown.reports,
    careers: dict.nav.careers,
    contact: dict.contact.title,
    about: dict.dropdown.aboutClik,
    products: dict.dropdown.products,
    businessSolution: dict.dropdown.businessSolution,
    creditScoring: dict.dropdown.creditScoring,
    infoSecurityPolicy: dict.dropdown.infoSecurityPolicy,
    privacyPolicy: dict.dropdown.privacyPolicy,
  }
  return titles[key] ? { title: titles[key], alternates } : { alternates }
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<Params>
  searchParams: Search
}) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()

  const path = pathOf(slug)

  // Detail pages first: /newsroom/<slug>, /laporan/<slug>, /karir/<slug>
  // and /newsroom/media/<outlet>.
  const dynamic = matchDynamicRoute(path, locale)
  if (dynamic) {
    const query = await searchParams
    switch (dynamic.kind) {
      case 'article':
        return <ArticleDetailPage locale={locale} slug={dynamic.slug} />
      case 'mediaOutlet':
        return (
          <MediaCoveragePage
            locale={locale}
            slug={dynamic.slug}
            page={pageNumber(query.page)}
          />
        )
      case 'report':
        return <ReportDetailPage locale={locale} slug={dynamic.slug} />
      case 'job':
        return <JobDetailPage locale={locale} slug={dynamic.slug} />
    }
  }

  const key = matchRoute(path, locale)
  if (!key) notFound()

  const Paginated = PAGINATED[key]
  if (Paginated) {
    const query = await searchParams
    return Paginated({ locale, page: pageNumber(query.page) })
  }

  const staticKey = STATIC_PAGES[key]
  if (staticKey) {
    return <StaticContentPage locale={locale} pageKey={staticKey} routeKey={key} />
  }

  const Component = PAGES[key]
  if (!Component) notFound()

  return Component({ locale })
}
