/**
 * The five solution categories, plus the Layanan dan Produk and Business Solution page copy.
 *
 * Page content lives in code, not the CMS. Change the wording here and
 * redeploy. Images are in public/images/products/.
 */

/** The five categories are fixed. Products inside them stay in the CMS. */
export const productCategories = [
  {
    slug: 'credit-scoring',
    name: { id: 'Credit Scoring', en: 'Credit Scoring' },
    icon: '/images/products/icon-credit-scoring.svg',
    image: '/images/products/credit-scoring.png',
    shortDescription: { id: 'Skor kredit dan laporan yang akurat untuk keputusan yang lebih cepat.', en: 'Accurate credit scores and reports for faster decisions.' },
    lead: { id: 'Satu skor, satu laporan, satu keputusan.', en: 'One score, one report, one decision.' },
    description: [
      { id: 'CLIK Credit Scoring memberikan penilaian risiko kredit berbasis data biro kredit yang lengkap, membantu lembaga keuangan mengambil keputusan yang lebih cepat dan lebih tepat.', en: 'CLIK Credit Scoring memberikan penilaian risiko kredit berbasis data biro kredit yang lengkap, membantu lembaga keuangan mengambil keputusan yang lebih cepat dan lebih tepat.' },
    ],
    advantages: [
      { title: { id: 'Terdaftar & Diawasi oleh OJK', en: 'Registered & Supervised by OJK' }, description: { id: 'Beroperasi sepenuhnya sesuai ketentuan yang berlaku.', en: 'Operating fully in line with applicable regulations.' } },
      { title: { id: 'Model Skor Kredit Proprietary', en: 'Proprietary Credit Scoring Model' }, description: { id: 'Skala A sampai J yang dikembangkan untuk pasar Indonesia.', en: 'An A to J scale developed for the Indonesian market.' } },
      { title: { id: 'Keamanan Data Terjamin', en: 'Guaranteed Data Security' }, description: { id: 'Perlindungan data sesuai standar industri.', en: 'Data protection to industry standards.' } },
      { title: { id: 'Real-Time Processing', en: 'Real-Time Processing' }, description: { id: 'Hasil skor tersedia dalam hitungan detik melalui API.', en: 'Scores returned within seconds through the API.' } },
    ],
  },
  {
    slug: 'analytics',
    name: { id: 'Analytics', en: 'Analytics' },
    icon: '/images/products/icon-analytics.svg',
    image: '/images/products/analytics.png',
    shortDescription: { id: 'Analisis portofolio dan wawasan pasar berbasis data.', en: 'Portfolio analysis and market insight from data.' },
    lead: { id: 'Memahami portofolio Anda lebih dalam.', en: 'Understand your portfolio more deeply.' },
    description: [
      { id: 'Layanan analitik CLIK membantu lembaga keuangan memahami perilaku portofolio, mengenali risiko lebih awal, dan menemukan peluang pertumbuhan.', en: 'Layanan analitik CLIK membantu lembaga keuangan memahami perilaku portofolio, mengenali risiko lebih awal, dan menemukan peluang pertumbuhan.' },
    ],
    advantages: [
      { title: { id: 'Menurunkan Rasio NPL/NPF', en: 'Lower NPL/NPF Ratios' }, description: { id: 'Identifikasi risiko lebih awal dalam siklus kredit.', en: 'Identify risk earlier in the credit cycle.' } },
      { title: { id: 'Efisiensi Operasional', en: 'Operational Efficiency' }, description: { id: 'Mengurangi pekerjaan analisis manual.', en: 'Reduce manual analysis work.' } },
    ],
  },
  {
    slug: 'decisioning',
    name: { id: 'Decisioning', en: 'Decisioning' },
    icon: '/images/products/icon-decisioning.svg',
    image: '/images/products/decisioning.png',
    shortDescription: { id: 'Otomatisasi kebijakan kredit dan alur keputusan.', en: 'Automate credit policy and decision flows.' },
    lead: { id: 'Keputusan yang konsisten, setiap saat.', en: 'Consistent decisions, every time.' },
    description: [
      { id: 'Decisioning menghubungkan data, skor, dan kebijakan kredit Anda dalam satu alur keputusan yang dapat diatur tanpa pengembangan ulang.', en: 'Decisioning menghubungkan data, skor, dan kebijakan kredit Anda dalam satu alur keputusan yang dapat diatur tanpa pengembangan ulang.' },
    ],
    advantages: [
      { title: { id: 'Mempercepat Proses Underwriting', en: 'Faster Underwriting' }, description: { id: 'Keputusan otomatis untuk pengajuan yang memenuhi kriteria.', en: 'Automatic decisions for applications that meet the criteria.' } },
    ],
  },
  {
    slug: 'business-intelligence',
    name: { id: 'Business Intelligence', en: 'Business Intelligence' },
    icon: '/images/products/icon-business-intelligence.svg',
    image: '/images/products/business-intelligence.jpeg',
    shortDescription: { id: 'Dasbor dan pelaporan untuk memantau kinerja.', en: 'Dashboards and reporting to monitor performance.' },
    lead: { id: 'Melihat gambaran besar dan detailnya sekaligus.', en: 'See the whole picture and the detail at once.' },
    description: [
      { id: 'Business Intelligence menyajikan kinerja portofolio dalam dasbor yang mudah dibaca, sehingga tim bisnis dapat memantau tanpa bergantung pada tim teknis.', en: 'Business Intelligence menyajikan kinerja portofolio dalam dasbor yang mudah dibaca, sehingga tim bisnis dapat memantau tanpa bergantung pada tim teknis.' },
    ],
    advantages: [
      { title: { id: 'Memperluas Jangkauan Segmen', en: 'Reach More Segments' }, description: { id: 'Menemukan segmen yang sebelumnya sulit dinilai.', en: 'Find segments that were previously hard to assess.' } },
    ],
  },
  {
    slug: 'consulting',
    name: { id: 'Consulting', en: 'Consulting' },
    icon: '/images/products/icon-consulting.svg',
    image: '/images/products/consulting.jpeg',
    shortDescription: { id: 'Pendampingan ahli untuk kebutuhan khusus.', en: 'Expert support for specialist needs.' },
    lead: { id: 'Dukungan profesional dari tim CLIK dan CRIF.', en: 'Professional support from the CLIK and CRIF teams.' },
    description: [
      { id: 'Tim konsultan CLIK bekerja bersama lembaga keuangan untuk merancang model skor khusus, melakukan analisis retrospektif, dan menyusun strategi portofolio.', en: 'Tim konsultan CLIK bekerja bersama lembaga keuangan untuk merancang model skor khusus, melakukan analisis retrospektif, dan menyusun strategi portofolio.' },
    ],
    advantages: [
      { title: { id: 'Dukungan Profesional', en: 'Professional Support' }, description: { id: 'Akses ke keahlian global jaringan CRIF.', en: 'Access to the global expertise of the CRIF network.' } },
    ],
  },
]

export const productsPage = {
  heroImage: '/images/products/hero.png',
  title: { id: 'Layanan dan Produk', en: 'Products & Services' },
  lead: { id: 'CLIK menghadirkan ekosistem solusi berbasis data untuk mendukung setiap tahap siklus kredit.', en: 'CLIK delivers a data-driven ecosystem of solutions supporting every stage of the credit cycle.' },
  sections: [
    {
      key: 'data-list',
      title: { id: 'Data yang Kami Kelola', en: 'The Data We Hold' },
      body: [
        { id: 'Data Identifikasi dan Rincian Kontak. Obligasi. Data Perusahaan. Surat Kredit. Rincian Pinjaman & Pembayaran Aktif. Data Jaminan. Rincian Kartu Kredit. Informasi Penjamin.', en: 'Identification and contact details. Bonds. Company data. Letters of credit. Active loan and payment details. Collateral data. Credit card details. Guarantor information.' },
      ],
    },
    {
      key: 'apa-itu-skor-kredit',
      title: { id: 'Apa itu skor kredit?', en: 'What is a credit score?' },
      body: [
        { id: 'Skor kredit adalah penilaian ringkas atas riwayat kredit seseorang atau badan usaha, yang membantu lembaga keuangan menilai risiko dengan cepat dan konsisten.', en: 'A credit score is a concise assessment of an individual or company’s credit history, helping financial institutions assess risk quickly and consistently.' },
      ],
    },
  ],
}

export const businessSolutionPage = {
  heroImage: '/images/about/office.png',
  title: { id: 'Business Solution', en: 'Business Solution' },
  lead: { id: 'Solusi Informasi Keuangan dan Analisis Risiko untuk mendukung keputusan bisnis yang lebih presisi.', en: 'Financial information and risk analysis solutions supporting more precise business decisions.' },
  sections: [
  ],
}

export const creditScoringPage = {
  heroImage: '/images/products/credit-scoring.png',
  title: { id: 'Credit Scoring', en: 'Credit Scoring' },
  lead: { id: 'Keputusan Kredit yang Lebih Cerdas, Lebih Cepat, Lebih Terpercaya.', en: 'Smarter, Faster, More Trusted Credit Decisions.' },
  sections: [
    {
      key: 'apa-itu',
      title: { id: 'Apa Itu CLIK Credit Scoring?', en: 'What Is CLIK Credit Scoring?' },
      body: [
        { id: 'CLIK Credit Scoring mengubah data biro kredit menjadi satu skor yang mudah dibaca, sehingga lembaga keuangan dapat menilai risiko pemohon secara konsisten dan cepat.', en: 'CLIK Credit Scoring turns credit bureau data into a single readable score, so financial institutions can assess applicant risk consistently and quickly.' },
      ],
    },
    {
      key: 'cara-kerja',
      title: { id: 'Cara Kerja', en: 'How It Works' },
      body: [
        { id: 'Empat langkah, dari integrasi API hingga penerimaan skor kredit.', en: 'Four steps, from API integration to receiving the credit score.' },
      ],
    },
  ],
}

