import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

/*
 * Hosts the admin is reached on. nginx listens on 8080 and proxies to 3000
 * with `Host $host`, which drops the port — so the browser sends
 * `Origin: http://<ip>:8080` while Next sees `Host: <ip>`. Next reads that
 * mismatch as a CSRF attempt and rejects every Server Action with "Invalid
 * Server Actions request", which is what the whole Payload admin runs on:
 * the image drawers silently do nothing and uploads spin for ever.
 *
 * Staging answers on the LAN address and over Tailscale, so both are listed
 * along with anything SITE_URL names.
 */
const adminOrigins = [
  '192.168.50.21:8080',
  '100.77.127.4:8080',
  'localhost:8080',
  '127.0.0.1:8080',
  ...(process.env.SITE_URL ? [new URL(process.env.SITE_URL).host] : []),
  ...(process.env.NEXT_PUBLIC_SERVER_URL ? [new URL(process.env.NEXT_PUBLIC_SERVER_URL).host] : []),
].filter((v, i, a) => v && a.indexOf(v) === i)

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: adminOrigins,
      /*
       * Uploading a picture in the admin goes through a Server Action, and
       * Next caps those at 1MB by default — so a normal photo failed before
       * it ever reached Payload. Sized just above the 20MB the CMS accepts,
       * and matching nginx's client_max_body_size of 25M.
       */
      bodySizeLimit: '25mb',
    },
  },
  images: {
    // Both paths must be listed or the image optimizer answers 400 and the
    // picture silently fails to render. /api/media/file is the CMS media
    // library; /brand is the logo and social icons served from public/.
    localPatterns: [
      // Uploaded media: article, report and product images.
      { pathname: '/api/media/file/**' },
      // Everything in public/images: logos, icons and page photography.
      { pathname: '/images/**' },
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
