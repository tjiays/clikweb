/**
 * Media outlets and the coverage listed under each. Articles stay in the CMS.
 *
 * Lives in code, not the CMS. Change the wording here and redeploy.
 */

export const mediaOutlets = [
  { slug: 'kumparan', name: 'Kumparan', logo: '/images/newsroom/logo-kumparan.png', websiteUrl: '' },
  { slug: 'bisnis-indonesia', name: 'Bisnis Indonesia', logo: '/images/newsroom/logo-bisnis.png', websiteUrl: '' },
  { slug: 'kontan', name: 'Kontan', logo: '/images/newsroom/logo-kontan.png', websiteUrl: '' },
  { slug: 'katadata', name: 'Katadata', logo: '/images/newsroom/logo-katadata.png', websiteUrl: '' },
]

export const mediaCoverage = [
  {
    outlet: 'kumparan',
    title: { id: 'CLIK dan Pertumbuhan Biro Kredit Swasta', en: 'CLIK and the Growth of Private Credit Bureaus' },
    externalUrl: 'https://kumparan.com/',
    publishDate: '2026-08-22',
  },
  {
    outlet: 'bisnis-indonesia',
    title: { id: 'Biro Kredit Swasta Perluas Layanan', en: 'Private Credit Bureaus Widen Their Services' },
    externalUrl: 'https://bisnis.com/',
    publishDate: '2026-07-01',
  },
  {
    outlet: 'kumparan',
    title: { id: 'Menakar Peran Data Kredit di Industri Keuangan', en: 'Weighing the Role of Credit Data in Finance' },
    externalUrl: 'https://kumparan.com/',
    publishDate: '2026-06-10',
  },
  {
    outlet: 'kontan',
    title: { id: 'Skor Kredit Jadi Andalan Lembaga Pembiayaan', en: 'Credit Scores Become a Mainstay for Lenders' },
    externalUrl: 'https://kontan.co.id/',
    publishDate: '2026-05-18',
  },
  {
    outlet: 'katadata',
    title: { id: 'Data Kredit dan Inklusi Keuangan Indonesia', en: 'Credit Data and Financial Inclusion in Indonesia' },
    externalUrl: 'https://katadata.co.id/',
    publishDate: '2026-04-02',
  },
]
