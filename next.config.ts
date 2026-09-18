import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const nextConfig: NextConfig = {
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
