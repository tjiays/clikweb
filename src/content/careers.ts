/**
 * Karir page content (Figma 415:2692) and the static copy of Detail Lowongan
 * (Figma 571:3858). Job vacancies themselves stay in the CMS.
 *
 * Page content lives in code, not the CMS. Change the wording here and
 * redeploy. Images are in public/images/careers/.
 */

type Text = { id: string; en: string }

export const careers = {
  heroTitle: {
    id: ['Bertumbuh Bersama CLIK', 'Membangun Ekosistem Kredit Indonesia'],
    en: ['Grow With CLIK', 'Building Indonesia’s Credit Ecosystem'],
  },
  heroSubtitle: {
    id: 'jadilah bagian dari tim yang mendorong inklusi keuangan melalui data dan teknologi',
    en: 'be part of the team driving financial inclusion through data and technology',
  },
  /**
   * Photo band (Figma Component 10, 911:5972): six photos in Figma order,
   * each at its Figma size, scrolling left endlessly.
   */
  heroPhotos: [
    { src: '/images/careers/strip-1.jpg', width: 538, height: 299 },
    { src: '/images/careers/strip-2.jpg', width: 487, height: 544 },
    { src: '/images/careers/strip-3.jpg', width: 538, height: 281 },
    { src: '/images/careers/strip-4.jpg', width: 363, height: 544 },
    { src: '/images/careers/strip-5.jpg', width: 584, height: 281 },
    { src: '/images/careers/strip-6.jpg', width: 363, height: 544 },
  ],
  titles: {
    values: { id: 'Nilai-Nilai Kami', en: 'Our Values' },
    openings: { id: 'Lowongan Pekerjaan', en: 'Job Openings' },
    benefits: { id: 'Benefits', en: 'Benefits' },
    process: { id: 'Proses Rekrutmen', en: 'Recruitment Process' },
  },
  /** First sentence bold, the e-mail underlined (Figma 582:3270). */
  cvNote: {
    lead: { id: 'Tidak menemukan posisi yang sesuai?', en: 'Can’t find a suitable position?' },
    before: { id: 'Kirimkan kami CV Anda ke', en: 'Send us your CV at' },
    after: { id: 'untuk pertimbangan kami di masa depan.', en: 'for our future consideration.' },
  },
  /** `width` is the Figma text box width, so the body wraps as drawn. */
  values: [
    {
      title: { id: 'Supporting Trust & Passion', en: 'Supporting Trust & Passion' },
      subtitle: { id: 'Menjaga Integritas, Mendorong Inovasi', en: 'Upholding Integrity, Driving Innovation' },
      description: {
        id: 'Kami menjunjung tinggi integritas, keamanan data, dan kepatuhan dalam setiap langkah. Dengan dedikasi dan keandalan tinggi, kami membangun kepercayaan bersama mitra dan klien demi ekosistem keuangan Indonesia yang transparan.',
        en: 'We uphold integrity, data security and compliance in every step we take. With dedication and a high degree of reliability, we build trust with our partners and clients for a transparent Indonesian financial ecosystem.',
      },
      width: 495,
    },
    {
      title: { id: 'Thinking Outside the Box', en: 'Thinking Outside the Box' },
      subtitle: { id: 'Berani Berpikir Lebih Jauh', en: 'Daring to Think Further' },
      description: {
        id: 'Kami tidak takut untuk menantang batas dan berpikir adaptif. Di tengah dinamisnya industri keuangan, kami terus mencari cara-cara baru yang kreatif untuk menciptakan dampak nyata bagi pertumbuhan ekonomi nasional.',
        en: 'We are not afraid to push boundaries and think adaptively. In a fast-moving financial industry, we keep looking for new, creative ways to make a real impact on national economic growth.',
      },
      width: 475,
    },
    {
      title: { id: 'Pursuing Excellence', en: 'Pursuing Excellence' },
      subtitle: { id: 'Kualitas Terbaik di Setiap Solusi', en: 'The Best Quality in Every Solution' },
      description: {
        id: 'Kami berorientasi pada hasil dan konsisten memberikan kualitas layanan terbaik. Lewat pemanfaatan teknologi dan data canggih, kami bertekad membantu industri jasa keuangan membuat keputusan yang tepat dan efektif.',
        en: 'We are results-oriented and consistently deliver the best quality of service. By making use of advanced technology and data, we are determined to help the financial services industry make sound and effective decisions.',
      },
      width: 471,
    },
    {
      title: { id: 'Embracing Diversity', en: 'Embracing Diversity' },
      subtitle: { id: 'Tumbuh Bersama Keberagaman', en: 'Growing Together Through Diversity' },
      description: {
        id: 'Kami percaya bahwa ide-ide terbaik lahir dari perspektif yang beragam. CLIK menciptakan lingkungan kerja yang inklusif, saling menghargai, dan mendukung setiap individu untuk berkembang secara maksimal.',
        en: 'We believe the best ideas come from diverse perspectives. CLIK creates an inclusive, mutually respectful workplace that supports every individual to grow to their full potential.',
      },
      width: 455,
    },
  ],
  /** Figma order; icon size and top offset inside the 317x201 card as drawn. */
  benefits: [
    { icon: '/images/shared/icon-benefit-health.svg', iconWidth: 69, iconHeight: 56, iconTop: 45, title: { id: 'Asuransi Kesehatan', en: 'Health Insurance' } },
    { icon: '/images/shared/icon-benefit-career.svg', iconWidth: 87, iconHeight: 56, iconTop: 45, title: { id: 'Jenjang Karir', en: 'Career Progression' } },
    { icon: '/images/shared/icon-benefit-skill.svg', iconWidth: 49, iconHeight: 63, iconTop: 38, title: { id: 'Pengembangan Skill', en: 'Skill Development' } },
    { icon: '/images/shared/icon-benefit-hours.svg', iconWidth: 69, iconHeight: 69, iconTop: 38, title: { id: 'Jam Kerja Fleksibel', en: 'Flexible Working Hours' } },
  ],
  /**
   * Proses Rekrutmen: steps 1–3 in the first row, 4–5 in the second
   * (Figma 582:3294 / 582:3319). `width` is the Figma column width;
   * `gap` the space between illustration and the number row.
   */
  recruitmentSteps: [
    {
      image: '/images/careers/step-1.png', imageWidth: 185, imageHeight: 150, gap: 5, width: 369,
      title: { id: 'Screening CV', en: 'CV Screening' },
      description: {
        id: 'Tim rekrutmen akan melakukan seleksi administrasi terhadap CV dan dokumen lamaran yang masuk untuk memastikan kandidat memenuhi kualifikasi dan persyaratan posisi yang dilamar.',
        en: 'The recruitment team screens the CVs and application documents received to make sure candidates meet the qualifications and requirements of the position applied for.',
      },
    },
    {
      image: '/images/careers/step-2.png', imageWidth: 247, imageHeight: 142, gap: 13, width: 392,
      title: { id: 'Interview HR', en: 'HR Interview' },
      description: {
        id: 'Kandidat yang lolos tahap screening akan mengikuti wawancara dengan tim HR untuk menggali informasi lebih dalam terkait latar belakang, pengalaman kerja, kepribadian, motivasi, serta kesesuaian dengan budaya perusahaan.',
        en: 'Candidates who pass the screening are interviewed by the HR team to learn more about their background, work experience, personality, motivation and fit with the company culture.',
      },
    },
    {
      image: '/images/careers/step-3.png', imageWidth: 214, imageHeight: 142, gap: 13, width: 405,
      title: { id: 'Interview User', en: 'User Interview' },
      description: {
        id: 'Kandidat akan diwawancarai oleh user/pihak terkait (calon atasan langsung atau tim terkait) untuk menilai kompetensi teknis, pengalaman kerja yang relevan, serta kesesuaian kandidat dengan kebutuhan dan tanggung jawab posisi yang dilamar.',
        en: 'Candidates are interviewed by the user or the parties concerned (the prospective line manager or team) to assess technical skills, relevant work experience and fit with the needs and responsibilities of the position.',
      },
    },
    {
      image: '/images/careers/step-4.png', imageWidth: 249, imageHeight: 166, gap: 13, width: 493,
      title: { id: 'Pengecekan Credit Score', en: 'Credit Score Check' },
      description: {
        id: 'Perusahaan akan melakukan verifikasi riwayat keuangan/credit score kandidat sebagai bagian dari proses due diligence untuk memastikan kandidat memiliki rekam jejak finansial yang baik.',
        en: 'The company verifies the candidate’s financial history/credit score as part of due diligence, to make sure the candidate has a good financial track record.',
      },
    },
    {
      image: '/images/careers/step-5.png', imageWidth: 268, imageHeight: 166, gap: 13, width: 441,
      title: { id: 'Penawaran', en: 'Offer' },
      description: {
        id: 'Kandidat yang dinyatakan lolos seluruh tahapan seleksi akan menerima penawaran kerja (offering letter) yang berisi detail posisi, gaji, benefit, serta ketentuan kerja lainnya.',
        en: 'Candidates who pass every stage of the selection receive a job offer (offering letter) setting out the position, salary, benefits and other terms of employment.',
      },
    },
  ],
  /** Share control on job cards and the job detail header. */
  share: { id: 'bagikan', en: 'share' },
  linkCopied: { id: 'Tautan disalin', en: 'Link copied' },
}

/** Detail Lowongan static copy (Figma 571:3858; the Figma frame is English). */
export const jobDetail = {
  /** Page title is Title Case; the breadcrumb keeps "Detail pekerjaan". */
  title: { id: 'Detail Pekerjaan', en: 'Job Details' } as Text,
  crumb: { id: 'Detail pekerjaan', en: 'Job details' } as Text,
  responsibilities: { id: 'Key Responsibilities:', en: 'Key Responsibilities:' } as Text,
  qualifications: { id: 'Minimum Qualifications:', en: 'Minimum Qualifications:' } as Text,
  education: { id: 'Education:', en: 'Education:' } as Text,
  emailTo: { id: 'Email to:', en: 'Email to:' } as Text,
  subjectNote: {
    id: 'Please mention on Subject E-mail : Source Vacancy – Position Applied',
    en: 'Please mention on Subject E-mail : Source Vacancy – Position Applied',
  } as Text,
  example: { id: 'Example : Website – Sales Operations', en: 'Example : Website – Sales Operations' } as Text,
}

/** Fixed list; a vacancy picks one of these in the CMS. */
export const jobCategories = [
  { slug: 'information-technology', name: { id: 'Information Technology', en: 'Information Technology' } },
  { slug: 'analysis-reporting', name: { id: 'Analysis & Reporting', en: 'Analysis & Reporting' } },
  { slug: 'sales-business-development', name: { id: 'Sales & Business Development', en: 'Sales & Business Development' } },
]
