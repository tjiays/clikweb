/**
 * Homepage content.
 *
 * Page content lives in code, not the CMS: it changes rarely and a developer
 * edits it alongside the layout. Change the wording here and redeploy.
 * Images are in public/images/home/.
 */

export const heroSlides = [
  {
    image: '/images/home/hero-1.jpeg',
    title: { id: 'Leading Indonesia’s Intelligence Credit Bureau', en: 'Leading Indonesia’s Intelligence Credit Bureau' },
    subtitle: { id: 'Data, Insights, and Recommendation', en: 'Data, Insights, and Recommendation' },
    buttonLabel: { id: 'Hubungi Kami', en: 'Contact Us' },
    buttonLink: '/hubungi-kami',
  },
  {
    image: '/images/home/hero-2.jpeg',
    title: { id: 'Keputusan Kredit yang Lebih Cerdas', en: 'Smarter Credit Decisions' },
    subtitle: { id: 'Didukung data biro kredit yang lengkap dan tepercaya', en: 'Backed by complete and trusted credit bureau data' },
    buttonLabel: { id: 'Lihat Layanan Kami', en: 'See Our Services' },
    buttonLink: '/layanan-dan-produk',
  },
  {
    image: '/images/home/hero-3.jpeg',
    title: { id: 'Bagian dari Jaringan CRIF Global', en: 'Part of the Global CRIF Network' },
    subtitle: { id: 'Hadir di 37 negara, melayani lebih dari 2.688 lembaga', en: 'Present in 37 countries, serving more than 2,688 institutions' },
    buttonLabel: { id: 'Tentang Kami', en: 'About Us' },
    buttonLink: '/tentang-kami',
  },
]

export const stats = [
  { icon: '/images/shared/icon-stat-countries.svg', value: '37', label: { id: 'Negara jaringan CRIF', en: 'Countries in the CRIF network' } },
  { icon: '/images/shared/icon-stat-institutions.svg', value: '10.500+', label: { id: 'Lembaga keuangan', en: 'Financial institutions' } },
  { icon: '/images/shared/icon-stat-consumers.svg', value: '1jt+', label: { id: 'Konsumen tercakup', en: 'Consumers covered' } },
]

export const home = {
  aboutTitle: { id: 'Tentang Kami', en: 'About Us' },
  aboutText: { id: 'PT CLIK (CRIF Indonesia) adalah biro kredit swasta berizin dan diawasi oleh Otoritas Jasa Keuangan, menghadirkan data, analitik, dan rekomendasi untuk mendukung keputusan kredit yang lebih baik.', en: 'PT CLIK (CRIF Indonesia) is a private credit bureau licensed and supervised by the Financial Services Authority, providing data, analytics and recommendations that support better credit decisions.' },
  trustBarText: { id: 'TERDAFTAR & DIAWASI OLEH OJK • Bagian dari jaringan CRIF Global', en: 'REGISTERED & SUPERVISED BY OJK • Part of the global CRIF network' },
  solutionsTitle: { id: 'Solusi Lengkap untuk Setiap Kebutuhan Bisnis Anda', en: 'Complete Solutions for Every Business Need' },
  solutionsSubtitle: { id: 'Dari data kredit hingga analitik lanjutan, CLIK menghadirkan ekosistem solusi berbasis data.', en: 'From credit data to advanced analytics, CLIK delivers a data-driven ecosystem of solutions.' },
  testimonialsTitle: { id: 'Apa Kata Mitra Kami', en: 'What Our Partners Say' },
  testimonialsSubtitle: { id: 'Kepercayaan lebih dari 2.688 lembaga keuangan dan non-keuangan di Indonesia.', en: 'Trusted by more than 2,688 financial and non-financial institutions in Indonesia.' },
  newsTitle: { id: 'Berita Terbaru Kami', en: 'Our Latest News' },
  newsSubtitle: { id: 'Perkembangan, wawasan, dan pencapaian terbaru dari CLIK.', en: 'The latest developments, insights and achievements from CLIK.' },
}
