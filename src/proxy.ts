import { NextResponse, type NextRequest } from 'next/server'
import { defaultLocale } from './i18n/config'

/** Anything with a file extension is an asset, not a page. */
const HAS_EXTENSION = /\.[^/]+$/

/**
 * Paths owned by Payload, Next or the preview flow, which must never be
 * rewritten into a language segment.
 */
const RESERVED = ['/admin', '/api', '/_next', '/media', '/preview', '/images']

/**
 * Next 16 renamed this convention from `middleware` to `proxy`.
 *
 * Indonesian is the default language and carries no prefix in the URL, so
 * `/tentang-kami` is rewritten internally to `/id/tentang-kami`. English is
 * already prefixed and passes through untouched. The visitor's address bar
 * never shows the `/id` segment.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (RESERVED.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return NextResponse.next()
  }
  if (HAS_EXTENSION.test(pathname)) {
    return NextResponse.next()
  }
  if (pathname === '/en' || pathname.startsWith('/en/')) {
    return NextResponse.next()
  }

  const url = request.nextUrl.clone()
  url.pathname = `/${defaultLocale}${pathname === '/' ? '' : pathname}`
  return NextResponse.rewrite(url)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
