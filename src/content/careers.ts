/**
 * Karir page content. Job vacancies themselves stay in the CMS.
 *
 * Page content lives in code, not the CMS. Change the wording here and
 * redeploy. Images are in public/images/careers/.
 */

export const careers = {
  heroImages: ['/images/careers/1.png', '/images/careers/2.png', '/images/careers/3.png'],
  heroTitle: { id: 'Bertumbuh Bersama CLIK Membangun Ekosistem Kredit Indonesia', en: 'Grow With CLIK, Building Indonesia’s Credit Ecosystem' },
  heroSubtitle: { id: 'Bergabunglah dengan tim yang membangun infrastruktur informasi kredit Indonesia.', en: 'Join the team building Indonesia’s credit information infrastructure.' },
  cvNote: { id: 'Tidak menemukan posisi yang sesuai? Kirimkan CV Anda ke', en: 'Not finding the right position? Send your CV to' },
  values: [
    { title: { id: 'Supporting Trust & Passion', en: 'Supporting Trust & Passion' }, subtitle: { id: 'Kepercayaan sebagai fondasi', en: 'Trust as the foundation' }, description: { id: 'Kami membangun kepercayaan melalui keterbukaan dan konsistensi dalam bekerja.', en: 'We build trust through openness and consistency in how we work.' } },
    { title: { id: 'Thinking Outside the Box', en: 'Thinking Outside the Box' }, subtitle: { id: 'Mencari cara yang lebih baik', en: 'Looking for a better way' }, description: { id: 'Kami mendorong cara pandang baru untuk menyelesaikan persoalan lama.', en: 'We encourage fresh perspectives on long-standing problems.' } },
    { title: { id: 'Pursuing Excellence', en: 'Pursuing Excellence' }, subtitle: { id: 'Kualitas dalam setiap detail', en: 'Quality in every detail' }, description: { id: 'Kami menjaga standar tinggi dalam setiap layanan yang kami berikan.', en: 'We hold a high standard in every service we deliver.' } },
    { title: { id: 'Embracing Diversity', en: 'Embracing Diversity' }, subtitle: { id: 'Beragam latar, satu tujuan', en: 'Many backgrounds, one goal' }, description: { id: 'Kami percaya keberagaman memperkuat cara kami mengambil keputusan.', en: 'We believe diversity strengthens how we make decisions.' } },
  ],
  benefits: [
    { icon: '/images/shared/icon-benefit-health.svg', title: { id: 'Asuransi Kesehatan', en: 'Health Insurance' } },
    { icon: '/images/shared/icon-benefit-skill.svg', title: { id: 'Pengembangan Skill', en: 'Skill Development' } },
    { icon: '/images/shared/icon-benefit-career.svg', title: { id: 'Jenjang Karir', en: 'Career Progression' } },
    { icon: '/images/shared/icon-benefit-hours.svg', title: { id: 'Jam Kerja Fleksibel', en: 'Flexible Working Hours' } },
  ],
  recruitmentSteps: [
    { title: { id: 'Screening CV', en: 'CV Screening' }, description: { id: 'Tim HR meninjau kecocokan pengalaman Anda.', en: 'The HR team reviews how your experience fits.' } },
    { title: { id: 'Interview HR', en: 'HR Interview' }, description: { id: 'Perkenalan dan pembahasan ekspektasi.', en: 'An introduction and a discussion of expectations.' } },
    { title: { id: 'Interview User', en: 'User Interview' }, description: { id: 'Diskusi teknis bersama tim terkait.', en: 'A technical discussion with the relevant team.' } },
    { title: { id: 'Pengecekan Credit Score', en: 'Credit Score Check' }, description: { id: 'Sesuai ketentuan industri keuangan.', en: 'In line with financial industry requirements.' } },
    { title: { id: 'Penawaran', en: 'Offer' }, description: { id: 'Penyampaian penawaran kerja resmi.', en: 'A formal offer is made.' } },
  ],
}

/** Fixed list; a vacancy picks one of these in the CMS. */
export const jobCategories = [
  { slug: 'information-technology', name: { id: 'Information Technology', en: 'Information Technology' } },
  { slug: 'analysis-reporting', name: { id: 'Analysis & Reporting', en: 'Analysis & Reporting' } },
  { slug: 'sales-business-development', name: { id: 'Sales & Business Development', en: 'Sales & Business Development' } },
]
