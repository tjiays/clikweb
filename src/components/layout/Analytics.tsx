import Script from 'next/script'

/**
 * Umami, self-hosted on this same server at /analytics.
 *
 * Only the public site loads this. The CMS lives under a different layout and
 * is deliberately left out: editor traffic would otherwise drown out the
 * visitors, and what staff do all day is already in the audit log.
 *
 * data-performance turns on real-user Core Web Vitals — LCP, INP, CLS, FCP
 * and TTFB — which Umami reports per page on its Performance view. It needs
 * no extra code in the pages themselves.
 *
 * Nothing renders unless the website id is configured, so a developer running
 * the site locally sends no events anywhere.
 */
export function Analytics({ disabled = false }: { disabled?: boolean }) {
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID
  const src = process.env.NEXT_PUBLIC_UMAMI_SRC || '/analytics/script.js'

  if (disabled || !websiteId) return null

  return (
    <Script
      src={src}
      data-website-id={websiteId}
      data-performance="true"
      strategy="afterInteractive"
    />
  )
}
