/**
 * Media outlets, the coverage listed under each, and the logo marquee at the
 * top of the Newsroom. Articles stay in the CMS.
 *
 * Lives in code, not the CMS. Change the wording here and redeploy.
 */

export type Logo = {
  name: string
  /** Monochrome #697077 artwork, 32px tall at 1x (Figma "logo" component). */
  src: string
  /** Rendered size in px at desktop, from the Figma frame. */
  width: number
  height: number
}

/**
 * One repeating set of the Newsroom logo marquee — Figma 685:3668 ("Component
 * 6"), left to right. The set is 1454px wide with the 23px gaps, and it scrolls
 * right-to-left one set every 10 s (145.4 px/s), so the list ends with a repeat
 * of the first two logos exactly as in the design.
 *
 * These are the brand marks the design uses. To show the real outlets instead,
 * build this list from `mediaOutlets` (each outlet has the same Logo shape).
 */
const L = (name: string, file: string, width: number, height = 32): Logo => ({
  name,
  src: `/images/newsroom/logos/${file}.svg`,
  width,
  height,
})

export const mediaLogoStrip: Logo[] = [
  L('WAVESMARATHON', 'wavesmarathon', 187),
  L('ArtVenue', 'artvenue', 166),
  L('kontrastr', 'kontrastr', 131, 30),
  L('SHELLS', 'shells', 124),
  L('SmartFinder', 'smartfinder', 176),
  L('Zoomerr', 'zoomerr', 133),
  L('WAVESMARATHON', 'wavesmarathon', 187),
  L('ArtVenue', 'artvenue', 166),
]

/** Figma timer: 1454px per 10 s. */
export const mediaLogoStripSeconds = 10
export const mediaLogoStripGap = 23

export type MediaOutlet = {
  slug: string
  name: string
  logo: Logo
  websiteUrl: string
}

export const mediaOutlets: MediaOutlet[] = [
  {
    slug: 'kumparan',
    name: 'Kumparan',
    logo: { name: 'Kumparan', src: '/images/newsroom/logo-kumparan.png', width: 132, height: 32 },
    websiteUrl: 'https://kumparan.com/',
  },
  {
    slug: 'bisnis-indonesia',
    name: 'Bisnis Indonesia',
    logo: { name: 'Bisnis Indonesia', src: '/images/newsroom/logo-bisnis.svg', width: 168, height: 24 },
    websiteUrl: 'https://bisnis.com/',
  },
  {
    slug: 'kontan',
    name: 'Kontan',
    logo: { name: 'Kontan', src: '/images/newsroom/logo-kontan.png', width: 130, height: 32 },
    websiteUrl: 'https://kontan.co.id/',
  },
  {
    slug: 'katadata',
    name: 'Katadata',
    logo: { name: 'Katadata', src: '/images/newsroom/logo-katadata.png', width: 141, height: 32 },
    websiteUrl: 'https://katadata.co.id/',
  },
]

export type Localised = { id: string; en: string }

export type MediaCoverageItem = {
  outlet: string
  title: Localised
  excerpt: Localised
  /** Byline shown on the left of the card meta row. */
  author: string
  /** 406x232 card image (static asset, 2x). */
  cover: string
  externalUrl: string
  publishDate: string
}

export const mediaCoverage: MediaCoverageItem[] = [
  {
    outlet: 'kumparan',
    title: { id: 'CLIK dan Pertumbuhan Biro Kredit Swasta', en: 'CLIK and the Growth of Private Credit Bureaus' },
    excerpt: {
      id: 'Biro kredit swasta makin berperan dalam membantu lembaga keuangan menilai calon debitur secara lebih cepat dan akurat. CLIK menjadi salah satu pelaku yang tumbuh bersama industri...',
      en: 'Private credit bureaus play a growing role in helping lenders assess applicants faster and more accurately. CLIK is one of the players growing with the industry...',
    },
    author: 'Kumparan',
    cover: '/images/newsroom/coverage/coverage-1.jpg',
    externalUrl: 'https://kumparan.com/',
    publishDate: '2026-08-22',
  },
  {
    outlet: 'bisnis-indonesia',
    title: { id: 'Biro Kredit Swasta Perluas Layanan', en: 'Private Credit Bureaus Widen Their Services' },
    excerpt: {
      id: 'Layanan biro kredit kini tidak hanya berupa laporan kredit, tetapi juga skor, analitik portofolio, dan pemantauan risiko untuk lembaga keuangan...',
      en: 'Credit bureau services now go beyond credit reports to scores, portfolio analytics and risk monitoring for financial institutions...',
    },
    author: 'Bisnis Indonesia',
    cover: '/images/newsroom/coverage/coverage-3.jpg',
    externalUrl: 'https://bisnis.com/',
    publishDate: '2026-07-01',
  },
  {
    outlet: 'kumparan',
    title: { id: 'Menakar Peran Data Kredit di Industri Keuangan', en: 'Weighing the Role of Credit Data in Finance' },
    excerpt: {
      id: 'Data kredit yang lengkap membantu lembaga keuangan mengambil keputusan pembiayaan dengan lebih tepat, sekaligus membuka akses kredit bagi lebih banyak masyarakat...',
      en: 'Complete credit data helps lenders make better financing decisions while opening access to credit for more people...',
    },
    author: 'Kumparan',
    cover: '/images/newsroom/coverage/coverage-2.jpg',
    externalUrl: 'https://kumparan.com/',
    publishDate: '2026-06-10',
  },
  {
    outlet: 'kontan',
    title: { id: 'Skor Kredit Jadi Andalan Lembaga Pembiayaan', en: 'Credit Scores Become a Mainstay for Lenders' },
    excerpt: {
      id: 'Perusahaan pembiayaan semakin mengandalkan skor kredit untuk mempercepat proses persetujuan tanpa mengorbankan kualitas portofolio...',
      en: 'Finance companies increasingly rely on credit scores to speed up approvals without sacrificing portfolio quality...',
    },
    author: 'Kontan',
    cover: '/images/newsroom/coverage/coverage-4.jpg',
    externalUrl: 'https://kontan.co.id/',
    publishDate: '2026-05-18',
  },
  {
    outlet: 'katadata',
    title: { id: 'Data Kredit dan Inklusi Keuangan Indonesia', en: 'Credit Data and Financial Inclusion in Indonesia' },
    excerpt: {
      id: 'Pemanfaatan data kredit alternatif dinilai dapat mendorong inklusi keuangan, terutama bagi pelaku UMKM dan masyarakat yang belum memiliki riwayat kredit...',
      en: 'Using alternative credit data is seen as a way to drive financial inclusion, especially for small businesses and people with no credit history...',
    },
    author: 'Katadata',
    cover: '/images/newsroom/coverage/coverage-5.jpg',
    externalUrl: 'https://katadata.co.id/',
    publishDate: '2026-04-02',
  },
]
