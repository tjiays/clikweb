/**
 * Homepage content (Figma frame 156:1049).
 *
 * Page content lives in code, not the CMS: it changes rarely and a developer
 * edits it alongside the layout. Change the wording here and redeploy.
 * Images are in public/images/home/.
 *
 * Indonesian copy is the Figma text verbatim (two typos fixed: "Bureu" and
 * "CRIF Blobal"); English is a translation.
 */

/** Hero (Figma 177:390). Only the images slide; the title and subtitle are one
 *  static layer above them (911:5989 / 911:5990). */
export const homeHero = {
  title: { id: "Leading Indonesia's Intelligence Credit Bureau", en: "Leading Indonesia's Intelligence Credit Bureau" },
  subtitle: { id: 'Data, Insights, and Recommendation', en: 'Data, Insights, and Recommendation' },
  images: ['/images/home/hero-1.jpeg', '/images/home/hero-2.jpeg', '/images/home/hero-3.jpeg'],
}

/** Stats cards (266:465 / 473 / 482) with their hover descriptions (266:467 / 475 / 484). */
export const stats = [
  {
    icon: '/images/home/icon-stat-countries.svg',
    iconWidth: 50,
    iconHeight: 50,
    value: { id: '37', en: '37' },
    label: { id: 'Negara jaringan CRIF', en: 'Countries in the CRIF network' },
    description: {
      id: 'Sebagai bagian dari CRIF S.p.A, CLIK terhubung dengan jaringan credit bureau dan analitik data yang telah beroperasi di 37 negara, menghadirkan standar dan praktik terbaik dunia ke pasar Indonesia.',
      en: 'As part of CRIF S.p.A, CLIK is connected to a credit bureau and data analytics network that operates in 37 countries, bringing global standards and best practices to the Indonesian market.',
    },
  },
  {
    icon: '/images/home/icon-stat-institutions.svg',
    iconWidth: 50,
    iconHeight: 50,
    value: { id: '10.500+', en: '10,500+' },
    label: { id: 'Lembaga keuangan', en: 'Financial institutions' },
    description: {
      id: 'Lebih dari 10.500 lembaga keuangan di seluruh dunia mempercayakan pengelolaan data kredit dan analitik risiko mereka kepada jaringan CRIF, termasuk CLIK di Indonesia.',
      en: 'More than 10,500 financial institutions around the world entrust the management of their credit data and risk analytics to the CRIF network, including CLIK in Indonesia.',
    },
  },
  {
    icon: '/images/home/icon-stat-consumers.svg',
    iconWidth: 60,
    iconHeight: 45,
    value: { id: '1jt+', en: '1M+' },
    label: { id: 'Konsumen tercakup', en: 'Consumers covered' },
    description: {
      id: 'Melalui ekosistem data CRIF Global, lebih dari satu juta profil konsumen tercakup dalam jaringan analitik dan pelaporan kredit yang mendukung keputusan bisnis yang lebih akurat',
      en: 'Through the CRIF Global data ecosystem, more than one million consumer profiles are covered by an analytics and credit reporting network that supports more accurate business decisions',
    },
  },
]

/** Solution cards on Home (Component 28, 1780:10846). Keyed by product-category
 *  slug; name and link still come from content/products.ts. Figma writes these
 *  descriptions in English on the Indonesian page as well. */
export const homeSolutions: Record<
  string,
  { icon: string; iconWidth: number; iconHeight: number; text: { id: string; en: string } }
> = {
  'credit-scoring': {
    icon: '/images/home/solution-credit-scoring.png',
    iconWidth: 108,
    iconHeight: 111,
    text: { id: 'Financial & alternative data for smarter credit decisions.', en: 'Financial & alternative data for smarter credit decisions.' },
  },
  analytics: {
    icon: '/images/home/solution-analytics.png',
    iconWidth: 124,
    iconHeight: 110,
    text: { id: 'Custom AI models across the customer lifecycle.', en: 'Custom AI models across the customer lifecycle.' },
  },
  decisioning: {
    icon: '/images/home/solution-decisioning.png',
    iconWidth: 124,
    iconHeight: 110,
    text: { id: 'Data & AI-powered decisions at industrial scale.', en: 'Data & AI-powered decisions at industrial scale.' },
  },
  'business-intelligence': {
    icon: '/images/home/solution-business-intelligence.png',
    iconWidth: 137,
    iconHeight: 110,
    text: { id: 'Corporate credit risk scoring for better business decisions.', en: 'Corporate credit risk scoring for better business decisions.' },
  },
  consulting: {
    icon: '/images/home/solution-consulting.png',
    iconWidth: 110,
    iconHeight: 110,
    text: { id: 'Strategic consulting for better business decisions.', en: 'Strategic consulting for better business decisions.' },
  },
}

export const home = {
  aboutTitle: { id: 'Tentang Kami', en: 'About Us' },
  aboutText: {
    id: 'PT CLIK (CRIF Indonesia) adalah biro kredit swasta berizin OJK yang didukung oleh 2.688+ lembaga keuangan dan non-keuangan di Indonesia. Dengan teknologi global CRIF, kami menghadirkan solusi skor kredit, analitik, dan manajemen risiko untuk keputusan kredit yang lebih cepat, akurat, dan inklusif — memperluas akses finansial bagi masyarakat dan UMKM.',
    en: 'PT CLIK (CRIF Indonesia) is an OJK-licensed private credit bureau backed by 2,688+ financial and non-financial institutions in Indonesia. With CRIF’s global technology, we deliver credit scoring, analytics and risk management solutions for faster, more accurate and more inclusive credit decisions — widening financial access for individuals and MSMEs.',
  },
  aboutButton: { id: 'Pelajari selengkapnya', en: 'Learn more' },

  /** Trust bar (266:584) and its hover text (266:497). */
  trust: {
    registered: { id: 'TERDAFTAR & DIAWASI OLEH OJK', en: 'REGISTERED & SUPERVISED BY OJK' },
    network: { id: 'Bagian dari jaringan CRIF Global', en: 'Part of the global CRIF network' },
    licenseLabel: { id: 'LICENSE', en: 'LICENSE' },
    licenseNumber: 'NO. KEP-179/D.03/2019',
    description: {
      id: 'CLIK terdaftar resmi sebagai Lembaga Pengelola Informasi Perkreditan (LPIP) di bawah pengawasan Otoritas Jasa Keuangan, memastikan setiap layanan kami beroperasi sesuai regulasi yang berlaku di Indonesia.',
      en: 'CLIK is officially registered as a Credit Information Management Institution (LPIP) under the supervision of the Financial Services Authority, ensuring that every one of our services operates in line with the regulations in force in Indonesia.',
    },
  },

  solutionsTitle: { id: 'Solusi Lengkap untuk Setiap Kebutuhan Bisnis Anda', en: 'Complete Solutions for Every Business Need' },
  solutionsSubtitle: {
    id: 'Dari credit scoring, analitik risiko, hingga solusi pengambilan dirancang untuk mendukung pertumbuhan bisnis lembaga keuangan Anda.',
    en: 'From credit scoring and risk analytics to decisioning solutions, designed to support the business growth of your financial institution.',
  },
  /** Solution card button (890:11024). */
  solutionsButton: { id: 'Lihat Selengkapnya', en: 'See More' },
  previousLabel: { id: 'Sebelumnya', en: 'Previous' },
  nextLabel: { id: 'Berikutnya', en: 'Next' },

  testimonialsTitle: { id: 'Apa Kata Mitra Kami', en: 'What Our Partners Say' },
  testimonialsSubtitle: {
    id: 'Kepercayaan lebih dari 2.688 lembaga keuangan dan non-keuangan di Indonesia terhadap solusi CLIK.',
    en: 'The trust of more than 2,688 financial and non-financial institutions in Indonesia in CLIK’s solutions.',
  },

  newsTitle: { id: 'Berita Terbaru Kami', en: 'Our Latest News' },
  newsSubtitle: {
    id: 'Dapatkan informasi, wawasan industri, dan pembaruan terkini seputar CLIK serta ekosistem keuangan Indonesia.',
    en: 'Get the latest information, industry insights and updates on CLIK and Indonesia’s financial ecosystem.',
  },
  /** News button (658:3325), typed in capitals in Figma. */
  newsButton: { id: 'LIHAT SELENGKAPNYA', en: 'SEE MORE' },
}
