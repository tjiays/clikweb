/**
 * Seed content taken from the Figma design.
 *
 * Confirmed decision 8: placeholder text and dummy names are kept as sample
 * content and flagged `isSample`, so the team can find and replace them.
 * Known design errors are fixed here rather than copied (intent/01 §6).
 */

/** Builds a Lexical rich text value from plain paragraphs. */
export const rich = (...paragraphs: string[]) => ({
  root: {
    type: 'root',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr' as const,
    children: paragraphs.map((text) => ({
      type: 'paragraph',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr' as const,
      textFormat: 0,
      children: [
        { type: 'text', text, format: 0, style: '', mode: 'normal', detail: 0, version: 1 },
      ],
    })),
  },
})

export const heroSlides = [
  {
    // Figma reads "Bureu"; corrected per intent/01 §6.
    title: { id: 'Leading Indonesia’s Intelligence Credit Bureau', en: 'Leading Indonesia’s Intelligence Credit Bureau' },
    subtitle: { id: 'Data, Insights, and Recommendation', en: 'Data, Insights, and Recommendation' },
    buttonLabel: { id: 'Hubungi Kami', en: 'Contact Us' },
    buttonLink: '/hubungi-kami',
    sortOrder: 0,
  },
  {
    title: { id: 'Keputusan Kredit yang Lebih Cerdas', en: 'Smarter Credit Decisions' },
    subtitle: { id: 'Didukung data biro kredit yang lengkap dan tepercaya', en: 'Backed by complete and trusted credit bureau data' },
    buttonLabel: { id: 'Lihat Layanan Kami', en: 'See Our Services' },
    buttonLink: '/layanan-dan-produk',
    sortOrder: 1,
  },
  {
    title: { id: 'Bagian dari Jaringan CRIF Global', en: 'Part of the Global CRIF Network' },
    subtitle: { id: 'Hadir di 37 negara, melayani lebih dari 2.688 lembaga', en: 'Present in 37 countries, serving more than 2,688 institutions' },
    buttonLabel: { id: 'Tentang Kami', en: 'About Us' },
    buttonLink: '/tentang-kami',
    sortOrder: 2,
  },
]

export const stats = [
  { value: '37', label: { id: 'Negara jaringan CRIF', en: 'Countries in the CRIF network' }, sortOrder: 0 },
  // Figma shows 10.500+ here and 2.688 elsewhere; both are kept as seed data
  // per intent/01 §6 and come from the CMS.
  { value: '10.500+', label: { id: 'Lembaga keuangan', en: 'Financial institutions' }, sortOrder: 1 },
  { value: '1jt+', label: { id: 'Konsumen tercakup', en: 'Consumers covered' }, sortOrder: 2 },
]

export const homeSettings = {
  aboutTitle: { id: 'Tentang Kami', en: 'About Us' },
  aboutText: {
    id: 'PT CLIK (CRIF Indonesia) adalah biro kredit swasta berizin dan diawasi oleh Otoritas Jasa Keuangan, menghadirkan data, analitik, dan rekomendasi untuk mendukung keputusan kredit yang lebih baik.',
    en: 'PT CLIK (CRIF Indonesia) is a private credit bureau licensed and supervised by the Financial Services Authority, providing data, analytics and recommendations that support better credit decisions.',
  },
  trustBarText: {
    id: 'TERDAFTAR & DIAWASI OLEH OJK • Bagian dari jaringan CRIF Global',
    en: 'REGISTERED & SUPERVISED BY OJK • Part of the global CRIF network',
  },
  solutionsTitle: { id: 'Solusi Lengkap untuk Setiap Kebutuhan Bisnis Anda', en: 'Complete Solutions for Every Business Need' },
  solutionsSubtitle: {
    id: 'Dari data kredit hingga analitik lanjutan, CLIK menghadirkan ekosistem solusi berbasis data.',
    en: 'From credit data to advanced analytics, CLIK delivers a data-driven ecosystem of solutions.',
  },
  testimonialsTitle: { id: 'Apa Kata Mitra Kami', en: 'What Our Partners Say' },
  testimonialsSubtitle: {
    id: 'Kepercayaan lebih dari 2.688 lembaga keuangan dan non-keuangan di Indonesia.',
    en: 'Trusted by more than 2,688 financial and non-financial institutions in Indonesia.',
  },
  newsTitle: { id: 'Berita Terbaru Kami', en: 'Our Latest News' },
  newsSubtitle: {
    id: 'Perkembangan, wawasan, dan pencapaian terbaru dari CLIK.',
    en: 'The latest developments, insights and achievements from CLIK.',
  },
}

/** Lorem ipsum from the design, kept and flagged. */
export const testimonials = [
  { partnerName: 'WebbyFrames', quote: { id: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer eget aliquet nibh.', en: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer eget aliquet nibh.' }, sortOrder: 0, isSample: true },
  { partnerName: 'Zoomerr', quote: { id: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', en: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' }, sortOrder: 1, isSample: true },
  { partnerName: 'SHELLS', quote: { id: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.', en: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.' }, sortOrder: 2, isSample: true },
  { partnerName: 'ArtVenue', quote: { id: 'Duis aute irure dolor in reprehenderit in voluptate velit esse.', en: 'Duis aute irure dolor in reprehenderit in voluptate velit esse.' }, sortOrder: 3, isSample: true },
]

export const partnerLogos = [
  { name: 'AFPI', group: 'member', sortOrder: 0, file: 'logo-afpi.png' },
  { name: 'BIIA', group: 'member', sortOrder: 1, file: 'logo-biia.png' },
  { name: 'Fintech Indonesia (AFTECH)', group: 'member', sortOrder: 2, file: 'logo-aftech.png' },
  { name: 'APPI', group: 'member', sortOrder: 3, file: 'logo-appi.png' },
  { name: 'OJK', group: 'regulator', sortOrder: 0, file: 'logo-ojk.png' },
]

export const milestones = [
  { year: 2019, sortOrder: 0, items: [{ text: { id: 'Pendirian PT CRIF Lembaga Informasi Keuangan', en: 'PT CRIF Lembaga Informasi Keuangan founded' } }] },
  { year: 2020, sortOrder: 1, items: [{ text: { id: 'Memperoleh izin usaha sebagai LPIP dari OJK', en: 'Licensed as an LPIP by OJK' } }] },
  { year: 2021, sortOrder: 2, items: [{ text: { id: 'Peluncuran layanan credit report pertama', en: 'First credit report service launched' } }] },
  {
    year: 2022,
    sortOrder: 3,
    items: [
      // Figma reads "Full CB Rerport"; corrected per intent/01 §6.
      { text: { id: 'Full CB Report tersedia untuk anggota', en: 'Full CB Report available to members' } },
      { text: { id: 'Laporan Perkembangan Usaha pertama diterbitkan', en: 'First business development report published' } },
    ],
  },
  { year: 2023, sortOrder: 4, items: [{ text: { id: 'Perluasan jaringan anggota lembaga keuangan', en: 'Financial institution member network expanded' } }] },
  { year: 2024, sortOrder: 5, items: [{ text: { id: 'Peluncuran layanan credit scoring', en: 'Credit scoring service launched' } }] },
  { year: 2025, sortOrder: 6, items: [{ text: { id: 'Lebih dari 2.688 lembaga terhubung', en: 'More than 2,688 institutions connected' } }] },
]

export const productCategories = [
  {
    name: { id: 'Credit Scoring', en: 'Credit Scoring' },
    slug: 'credit-scoring',
    shortDescription: { id: 'Skor kredit dan laporan yang akurat untuk keputusan yang lebih cepat.', en: 'Accurate credit scores and reports for faster decisions.' },
    lead: { id: 'Satu skor, satu laporan, satu keputusan.', en: 'One score, one report, one decision.' },
    description: rich('CLIK Credit Scoring memberikan penilaian risiko kredit berbasis data biro kredit yang lengkap, membantu lembaga keuangan mengambil keputusan yang lebih cepat dan lebih tepat.'),
    advantages: [
      { title: { id: 'Terdaftar & Diawasi oleh OJK', en: 'Registered & Supervised by OJK' }, description: { id: 'Beroperasi sepenuhnya sesuai ketentuan yang berlaku.', en: 'Operating fully in line with applicable regulations.' } },
      { title: { id: 'Model Skor Kredit Proprietary', en: 'Proprietary Credit Scoring Model' }, description: { id: 'Skala A sampai J yang dikembangkan untuk pasar Indonesia.', en: 'An A to J scale developed for the Indonesian market.' } },
      { title: { id: 'Keamanan Data Terjamin', en: 'Guaranteed Data Security' }, description: { id: 'Perlindungan data sesuai standar industri.', en: 'Data protection to industry standards.' } },
      { title: { id: 'Real-Time Processing', en: 'Real-Time Processing' }, description: { id: 'Hasil skor tersedia dalam hitungan detik melalui API.', en: 'Scores returned within seconds through the API.' } },
    ],
    sortOrder: 0,
  },
  {
    name: { id: 'Analytics', en: 'Analytics' },
    slug: 'analytics',
    shortDescription: { id: 'Analisis portofolio dan wawasan pasar berbasis data.', en: 'Portfolio analysis and market insight from data.' },
    lead: { id: 'Memahami portofolio Anda lebih dalam.', en: 'Understand your portfolio more deeply.' },
    description: rich('Layanan analitik CLIK membantu lembaga keuangan memahami perilaku portofolio, mengenali risiko lebih awal, dan menemukan peluang pertumbuhan.'),
    advantages: [
      { title: { id: 'Menurunkan Rasio NPL/NPF', en: 'Lower NPL/NPF Ratios' }, description: { id: 'Identifikasi risiko lebih awal dalam siklus kredit.', en: 'Identify risk earlier in the credit cycle.' } },
      { title: { id: 'Efisiensi Operasional', en: 'Operational Efficiency' }, description: { id: 'Mengurangi pekerjaan analisis manual.', en: 'Reduce manual analysis work.' } },
    ],
    sortOrder: 1,
  },
  {
    name: { id: 'Decisioning', en: 'Decisioning' },
    slug: 'decisioning',
    shortDescription: { id: 'Otomatisasi kebijakan kredit dan alur keputusan.', en: 'Automate credit policy and decision flows.' },
    lead: { id: 'Keputusan yang konsisten, setiap saat.', en: 'Consistent decisions, every time.' },
    description: rich('Decisioning menghubungkan data, skor, dan kebijakan kredit Anda dalam satu alur keputusan yang dapat diatur tanpa pengembangan ulang.'),
    advantages: [
      { title: { id: 'Mempercepat Proses Underwriting', en: 'Faster Underwriting' }, description: { id: 'Keputusan otomatis untuk pengajuan yang memenuhi kriteria.', en: 'Automatic decisions for applications that meet the criteria.' } },
    ],
    sortOrder: 2,
  },
  {
    name: { id: 'Business Intelligence', en: 'Business Intelligence' },
    slug: 'business-intelligence',
    shortDescription: { id: 'Dasbor dan pelaporan untuk memantau kinerja.', en: 'Dashboards and reporting to monitor performance.' },
    lead: { id: 'Melihat gambaran besar dan detailnya sekaligus.', en: 'See the whole picture and the detail at once.' },
    description: rich('Business Intelligence menyajikan kinerja portofolio dalam dasbor yang mudah dibaca, sehingga tim bisnis dapat memantau tanpa bergantung pada tim teknis.'),
    advantages: [
      { title: { id: 'Memperluas Jangkauan Segmen', en: 'Reach More Segments' }, description: { id: 'Menemukan segmen yang sebelumnya sulit dinilai.', en: 'Find segments that were previously hard to assess.' } },
    ],
    sortOrder: 3,
  },
  {
    name: { id: 'Consulting', en: 'Consulting' },
    slug: 'consulting',
    shortDescription: { id: 'Pendampingan ahli untuk kebutuhan khusus.', en: 'Expert support for specialist needs.' },
    lead: { id: 'Dukungan profesional dari tim CLIK dan CRIF.', en: 'Professional support from the CLIK and CRIF teams.' },
    description: rich('Tim konsultan CLIK bekerja bersama lembaga keuangan untuk merancang model skor khusus, melakukan analisis retrospektif, dan menyusun strategi portofolio.'),
    advantages: [
      { title: { id: 'Dukungan Profesional', en: 'Professional Support' }, description: { id: 'Akses ke keahlian global jaringan CRIF.', en: 'Access to the global expertise of the CRIF network.' } },
    ],
    sortOrder: 4,
  },
]

type Item = { name: string; category: string; status: 'live' | 'ready_to_sell'; isNew?: boolean }

/** The full product list from Figma text node 1331:4307. */
export const productItems: Item[] = [
  { name: 'Dashboard', category: 'business-intelligence', status: 'live' },
  { name: 'General Dashboard', category: 'business-intelligence', status: 'ready_to_sell' },
  { name: 'Credit Card Static Report', category: 'business-intelligence', status: 'ready_to_sell' },
  { name: 'Credit Card Interactive Report', category: 'business-intelligence', status: 'ready_to_sell' },
  { name: 'Portfolio Alert', category: 'business-intelligence', status: 'live' },

  { name: 'Full Report', category: 'credit-scoring', status: 'live' },
  { name: 'Slim Report', category: 'credit-scoring', status: 'live' },
  { name: 'Soft Pull Report', category: 'credit-scoring', status: 'live' },
  { name: 'Compliance Report', category: 'credit-scoring', status: 'live' },
  { name: 'Unified Report', category: 'credit-scoring', status: 'live' },
  { name: 'Aggregated Variable Calculation (AVC)', category: 'credit-scoring', status: 'ready_to_sell' },
  { name: 'Fintech Bureau (FDC)', category: 'credit-scoring', status: 'ready_to_sell', isNew: true },
  { name: 'Generic CB Score (CBG)', category: 'credit-scoring', status: 'live' },
  { name: 'CLIK SKAI Score', category: 'credit-scoring', status: 'live', isNew: true },
  { name: 'CLIK Spectrum Score (CSS)', category: 'credit-scoring', status: 'live', isNew: true },
  { name: 'Fintech CB Score', category: 'credit-scoring', status: 'live' },
  { name: 'Application Score', category: 'credit-scoring', status: 'live' },
  { name: 'Score Factor', category: 'credit-scoring', status: 'live' },

  { name: 'Scoremart', category: 'analytics', status: 'live', isNew: true },
  { name: 'Portfolio Risk Insight (PRI / InsightCollect)', category: 'analytics', status: 'live' },
  { name: 'Custom Industry Reports', category: 'analytics', status: 'live' },

  { name: 'Credit Policy / Simple Decision', category: 'decisioning', status: 'ready_to_sell' },
  { name: 'Application Score Hosting', category: 'decisioning', status: 'ready_to_sell' },
  { name: 'Data Connectivity & Orchestration', category: 'decisioning', status: 'ready_to_sell' },
  { name: 'Sandbox', category: 'decisioning', status: 'ready_to_sell', isNew: true },

  { name: 'POC / Trial & Retro Analysis', category: 'consulting', status: 'ready_to_sell', isNew: true },
  { name: 'Portfolio Management / Cross-Sell / Stress Test', category: 'consulting', status: 'ready_to_sell', isNew: true },
  { name: 'Custom Score Development', category: 'consulting', status: 'ready_to_sell', isNew: true },
  { name: 'Solutions in Partnership with CRIF', category: 'consulting', status: 'ready_to_sell', isNew: true },
]

/**
 * Page copy. Legal and procedural text is deliberately NOT invented — rule 1
 * in intent/00-README.md forbids inventing legal text — so the policy pages
 * carry a clearly marked placeholder for the team to replace.
 */
export const TODO_LEGAL = (pageName: string) =>
  `TODO: teks resmi ${pageName} belum tersedia. Halaman ini sengaja dibiarkan kosong sampai tim menyediakan naskah yang sudah ditinjau. Jangan tayangkan ke publik sebelum diganti.`

export const pageContent = [
  {
    page: 'about',
    title: { id: 'Tentang CLIK', en: 'About CLIK' },
    heroFile: 'about.png',
    lead: {
      id: 'PT CRIF Lembaga Informasi Keuangan (CLIK) adalah Biro Kredit Swasta berizin dan diawasi oleh Otoritas Jasa Keuangan.',
      en: 'PT CRIF Lembaga Informasi Keuangan (CLIK) is a private credit bureau licensed and supervised by the Financial Services Authority.',
    },
    sections: [
      {
        key: 'visi',
        title: { id: 'Visi', en: 'Vision' },
        imageFile: 'visi.png',
        body: {
          id: 'Menjadi biro kredit rujukan di Indonesia yang mendorong keputusan kredit lebih cerdas melalui data yang lengkap, akurat, dan tepercaya.',
          en: 'To be the reference credit bureau in Indonesia, driving smarter credit decisions through complete, accurate and trusted data.',
        },
      },
      {
        key: 'misi',
        title: { id: 'Misi', en: 'Mission' },
        imageFile: 'misi.png',
        body: {
          id: 'Menyediakan informasi perkreditan yang andal bagi lembaga keuangan dan non-keuangan, serta mendukung inklusi keuangan yang bertanggung jawab di Indonesia.',
          en: 'To provide reliable credit information to financial and non-financial institutions, and to support responsible financial inclusion in Indonesia.',
        },
      },
      {
        key: 'tentang-crif',
        title: { id: 'Tentang CRIF', en: 'About CRIF' },
        imageFile: 'about.png',
        body: {
          id: 'CLIK adalah bagian dari CRIF, jaringan global penyedia informasi kredit dan solusi manajemen risiko yang hadir di 37 negara.',
          en: 'CLIK is part of CRIF, a global network of credit information and risk management providers present in 37 countries.',
        },
      },
    ],
  },
  {
    page: 'products',
    title: { id: 'Layanan dan Produk', en: 'Products & Services' },
    heroFile: 'products.png',
    lead: {
      id: 'CLIK menghadirkan ekosistem solusi berbasis data untuk mendukung setiap tahap siklus kredit.',
      en: 'CLIK delivers a data-driven ecosystem of solutions supporting every stage of the credit cycle.',
    },
    sections: [
      {
        key: 'data-list',
        title: { id: 'Data yang Kami Kelola', en: 'The Data We Hold' },
        body: {
          id: 'Data Identifikasi dan Rincian Kontak. Obligasi. Data Perusahaan. Surat Kredit. Rincian Pinjaman & Pembayaran Aktif. Data Jaminan. Rincian Kartu Kredit. Informasi Penjamin.',
          en: 'Identification and contact details. Bonds. Company data. Letters of credit. Active loan and payment details. Collateral data. Credit card details. Guarantor information.',
        },
      },
      {
        key: 'apa-itu-skor-kredit',
        title: { id: 'Apa itu skor kredit?', en: 'What is a credit score?' },
        imageFile: 'credit-scoring.png',
        body: {
          id: 'Skor kredit adalah penilaian ringkas atas riwayat kredit seseorang atau badan usaha, yang membantu lembaga keuangan menilai risiko dengan cepat dan konsisten.',
          en: 'A credit score is a concise assessment of an individual or company’s credit history, helping financial institutions assess risk quickly and consistently.',
        },
      },
    ],
  },
  {
    page: 'business-solution',
    title: { id: 'Business Solution', en: 'Business Solution' },
    heroFile: 'business-solution.png',
    lead: {
      id: 'Solusi Informasi Keuangan dan Analisis Risiko untuk mendukung keputusan bisnis yang lebih presisi.',
      en: 'Financial information and risk analysis solutions supporting more precise business decisions.',
    },
    sections: [],
  },
  {
    page: 'credit-scoring',
    title: { id: 'Credit Scoring', en: 'Credit Scoring' },
    heroFile: 'credit-scoring.png',
    lead: {
      id: 'Keputusan Kredit yang Lebih Cerdas, Lebih Cepat, Lebih Terpercaya.',
      en: 'Smarter, Faster, More Trusted Credit Decisions.',
    },
    sections: [
      {
        key: 'apa-itu',
        title: { id: 'Apa Itu CLIK Credit Scoring?', en: 'What Is CLIK Credit Scoring?' },
        body: {
          id: 'CLIK Credit Scoring mengubah data biro kredit menjadi satu skor yang mudah dibaca, sehingga lembaga keuangan dapat menilai risiko pemohon secara konsisten dan cepat.',
          en: 'CLIK Credit Scoring turns credit bureau data into a single readable score, so financial institutions can assess applicant risk consistently and quickly.',
        },
      },
      {
        key: 'cara-kerja',
        title: { id: 'Cara Kerja', en: 'How It Works' },
        body: {
          id: 'Empat langkah, dari integrasi API hingga penerimaan skor kredit.',
          en: 'Four steps, from API integration to receiving the credit score.',
        },
      },
    ],
  },
]

export const ctaBlocks = [
  {
    page: 'home',
    banner: {
      title: { id: 'Siap Mengoptimalkan Keputusan Kredit Bisnis Anda?', en: 'Ready to Optimise Your Business Credit Decisions?' },
      buttonLabel: { id: 'Hubungi Kami', en: 'Contact Us' },
      buttonLink: '/hubungi-kami',
    },
  },
  {
    page: 'about',
    banner: {
      title: { id: 'Siap Membangun Ekosistem Kredit yang Lebih Kuat Bersama Kami?', en: 'Ready to Build a Stronger Credit Ecosystem With Us?' },
      buttonLabel: { id: 'Hubungi Kami', en: 'Contact Us' },
      buttonLink: '/hubungi-kami',
    },
  },
  {
    page: 'products',
    banner: {
      title: { id: 'Temukan Solusi yang Sesuai dengan Kebutuhan Bisnis Anda', en: 'Find the Solution That Fits Your Business' },
      buttonLabel: { id: 'Hubungi Kami', en: 'Contact Us' },
      buttonLink: '/hubungi-kami',
    },
  },
  {
    page: 'business-solution',
    banner: {
      title: { id: 'Wujudkan Keputusan Bisnis yang Lebih Presisi', en: 'Make More Precise Business Decisions' },
      buttonLabel: { id: 'Hubungi Kami', en: 'Contact Us' },
      buttonLink: '/hubungi-kami',
    },
  },
  {
    page: 'credit-scoring',
    crossLink: {
      label: { id: 'Layanan dan Produk', en: 'Products & Services' },
      title: { id: 'Business Solution', en: 'Business Solution' },
      targetUrl: '/layanan-dan-produk/business-solution',
      imageFile: 'business-solution.png',
    },
    banner: {
      title: { id: 'Siap Meningkatkan Akurasi dan Kecepatan Keputusan Kredit Anda?', en: 'Ready to Improve the Accuracy and Speed of Your Credit Decisions?' },
      buttonLabel: { id: 'Hubungi Kami', en: 'Contact Us' },
      buttonLink: '/hubungi-kami',
    },
  },
]

export const staticPages = [
  { key: 'information_security_policy', title: { id: 'Kebijakan Keamanan Informasi', en: 'Information Security Policy' }, name: 'Kebijakan Keamanan Informasi' },
  { key: 'privacy_policy', title: { id: 'Kebijakan Privasi', en: 'Privacy Policy' }, name: 'Kebijakan Privasi' },
  { key: 'how_to_get_credit_report', title: { id: 'Cara mendapat laporan kredit Anda', en: 'How to Get Your Credit Report' }, name: 'Cara mendapat laporan kredit' },
  { key: 'complaint_resolution', title: { id: 'Penyelesaian Pengaduan', en: 'Complaint Resolution' }, name: 'Penyelesaian Pengaduan' },
]

/* ---------------------------------------------------------------------------
 * Phase 4 seed: Newsroom, Laporan, Karir
 * Placeholder author "gvezenzcha" and lorem text are kept and flagged as
 * sample, per confirmed decision 8.
 * ------------------------------------------------------------------------- */

export const authors = [
  { name: 'gvezenzcha', isSample: true },
  { name: 'Tim Komunikasi CLIK', isSample: false },
]

export const mediaOutlets = [
  { name: 'Kumparan', slug: 'kumparan', file: 'logo-kumparan.png', sortOrder: 0 },
  { name: 'Bisnis Indonesia', slug: 'bisnis-indonesia', file: 'logo-bisnis.png', sortOrder: 1 },
  { name: 'Kontan', slug: 'kontan', file: 'logo-kontan.png', sortOrder: 2 },
  { name: 'Katadata', slug: 'katadata', file: 'logo-katadata.png', sortOrder: 3 },
]

export const articles = [
  {
    title: { id: 'CLIK Perluas Jaringan Anggota Lembaga Keuangan', en: 'CLIK Expands Its Financial Institution Member Network' },
    slug: 'clik-perluas-jaringan-anggota',
    excerpt: {
      id: 'CLIK mencatat pertumbuhan jumlah lembaga yang terhubung ke layanan biro kredit sepanjang tahun ini.',
      en: 'CLIK recorded growth in the number of institutions connected to its credit bureau services this year.',
    },
    body: {
      id: 'PT CRIF Lembaga Informasi Keuangan (CLIK) mencatat pertumbuhan jumlah lembaga keuangan dan non-keuangan yang terhubung ke layanan biro kredit sepanjang tahun berjalan. Pertumbuhan ini didorong oleh kebutuhan industri akan data kredit yang lebih lengkap dan tepercaya.',
      en: 'PT CRIF Lembaga Informasi Keuangan (CLIK) recorded growth in the number of financial and non-financial institutions connected to its credit bureau services during the year. The growth is driven by industry demand for more complete and trusted credit data.',
    },
    isFeatured: true,
    publishDate: '2026-08-20',
  },
  {
    title: { id: 'Memahami Skor Kredit dan Manfaatnya bagi Konsumen', en: 'Understanding Credit Scores and Their Benefits for Consumers' },
    slug: 'memahami-skor-kredit',
    excerpt: {
      id: 'Skor kredit membantu konsumen memahami posisi kreditnya sebelum mengajukan pembiayaan.',
      en: 'A credit score helps consumers understand their credit position before applying for financing.',
    },
    body: {
      id: 'Skor kredit merangkum riwayat pembayaran seseorang menjadi satu angka yang mudah dibaca. Bagi konsumen, memahami skor kredit membantu mempersiapkan pengajuan pembiayaan dengan lebih baik.',
      en: 'A credit score summarises a person’s payment history into a single readable number. For consumers, understanding it helps them prepare better before applying for financing.',
    },
    isFeatured: true,
    publishDate: '2026-07-14',
  },
  {
    title: { id: 'CLIK Luncurkan Layanan Credit Scoring Terbaru', en: 'CLIK Launches Its Latest Credit Scoring Service' },
    slug: 'clik-luncurkan-credit-scoring',
    excerpt: {
      id: 'Layanan baru ini dirancang untuk mempercepat proses underwriting lembaga keuangan.',
      en: 'The new service is designed to speed up underwriting for financial institutions.',
    },
    body: {
      id: 'Layanan credit scoring terbaru CLIK dirancang untuk membantu lembaga keuangan mempercepat proses underwriting tanpa mengorbankan ketelitian penilaian risiko.',
      en: 'CLIK’s latest credit scoring service is designed to help financial institutions speed up underwriting without sacrificing the rigour of their risk assessment.',
    },
    isFeatured: false,
    publishDate: '2026-06-02',
  },
  {
    title: { id: 'Kolaborasi CLIK dan CRIF Global dalam Analitik Kredit', en: 'CLIK and CRIF Global Collaborate on Credit Analytics' },
    slug: 'kolaborasi-clik-crif-global',
    excerpt: {
      id: 'Kolaborasi ini membawa praktik analitik kredit global ke pasar Indonesia.',
      en: 'The collaboration brings global credit analytics practice to the Indonesian market.',
    },
    body: {
      id: 'Sebagai bagian dari jaringan CRIF yang hadir di 37 negara, CLIK membawa praktik analitik kredit global ke pasar Indonesia melalui rangkaian solusi yang disesuaikan dengan kebutuhan lokal.',
      en: 'As part of the CRIF network present in 37 countries, CLIK brings global credit analytics practice to the Indonesian market through solutions adapted to local needs.',
    },
    isFeatured: false,
    publishDate: '2026-05-11',
  },
  {
    title: { id: 'Tips Menjaga Riwayat Kredit yang Sehat', en: 'Tips for Keeping a Healthy Credit History' },
    slug: 'tips-riwayat-kredit-sehat',
    excerpt: {
      id: 'Beberapa kebiasaan sederhana dapat membantu menjaga riwayat kredit tetap baik.',
      en: 'A few simple habits can help keep your credit history in good shape.',
    },
    body: {
      id: 'Membayar tepat waktu, menjaga rasio penggunaan kredit, dan memeriksa laporan kredit secara berkala adalah tiga kebiasaan yang membantu menjaga riwayat kredit tetap sehat.',
      en: 'Paying on time, keeping your credit utilisation in check, and reviewing your credit report regularly are three habits that help keep a credit history healthy.',
    },
    isFeatured: false,
    publishDate: '2026-04-08',
  },
  {
    title: { id: 'Peran Biro Kredit dalam Inklusi Keuangan', en: 'The Role of Credit Bureaus in Financial Inclusion' },
    slug: 'peran-biro-kredit-inklusi-keuangan',
    excerpt: {
      id: 'Data kredit yang lengkap membuka akses pembiayaan bagi segmen yang sebelumnya sulit dinilai.',
      en: 'Complete credit data opens financing access for segments that were previously hard to assess.',
    },
    body: {
      id: 'Dengan data kredit yang lengkap, lembaga keuangan dapat menilai calon debitur yang sebelumnya tidak memiliki rekam jejak formal, sehingga memperluas akses pembiayaan secara bertanggung jawab.',
      en: 'With complete credit data, financial institutions can assess borrowers who previously had no formal track record, responsibly widening access to financing.',
    },
    isFeatured: false,
    publishDate: '2026-03-19',
  },
  {
    title: { id: 'CLIK Dukung Penguatan Tata Kelola Data Kredit', en: 'CLIK Supports Stronger Credit Data Governance' },
    slug: 'clik-dukung-tata-kelola-data',
    excerpt: {
      id: 'Tata kelola data yang kuat menjadi fondasi kepercayaan industri keuangan.',
      en: 'Strong data governance is the foundation of trust in the financial industry.',
    },
    body: {
      id: 'Sebagai LPIP yang diawasi OJK, CLIK menempatkan tata kelola dan keamanan data sebagai fondasi utama layanan biro kredit yang dijalankan.',
      en: 'As an LPIP supervised by OJK, CLIK places governance and data security at the foundation of the credit bureau services it operates.',
    },
    isFeatured: false,
    publishDate: '2026-02-25',
  },
]

export const mediaCoverage = [
  { outlet: 'kumparan', title: { id: 'CLIK dan Pertumbuhan Biro Kredit Swasta', en: 'CLIK and the Growth of Private Credit Bureaus' }, url: 'https://kumparan.com/', publishDate: '2026-08-22' },
  { outlet: 'kumparan', title: { id: 'Menakar Peran Data Kredit di Industri Keuangan', en: 'Weighing the Role of Credit Data in Finance' }, url: 'https://kumparan.com/', publishDate: '2026-06-10' },
  { outlet: 'bisnis-indonesia', title: { id: 'Biro Kredit Swasta Perluas Layanan', en: 'Private Credit Bureaus Widen Their Services' }, url: 'https://bisnis.com/', publishDate: '2026-07-01' },
  { outlet: 'kontan', title: { id: 'Skor Kredit Jadi Andalan Lembaga Pembiayaan', en: 'Credit Scores Become a Mainstay for Lenders' }, url: 'https://kontan.co.id/', publishDate: '2026-05-18' },
  { outlet: 'katadata', title: { id: 'Data Kredit dan Inklusi Keuangan Indonesia', en: 'Credit Data and Financial Inclusion in Indonesia' }, url: 'https://katadata.co.id/', publishDate: '2026-04-02' },
]

export const reports = [
  { type: 'annual_report', title: { id: 'Laporan Tahunan 2025', en: 'Annual Report 2025' }, slug: 'laporan-tahunan-2025', year: 2025, sortOrder: 0 },
  { type: 'annual_report', title: { id: 'Laporan Tahunan 2024', en: 'Annual Report 2024' }, slug: 'laporan-tahunan-2024', year: 2024, sortOrder: 1 },
  { type: 'annual_report', title: { id: 'Laporan Tahunan 2023', en: 'Annual Report 2023' }, slug: 'laporan-tahunan-2023', year: 2023, sortOrder: 2 },
  { type: 'business_development', title: { id: 'Laporan Perkembangan Usaha PT CLIK', en: 'PT CLIK Business Development Report' }, slug: 'laporan-perkembangan-usaha', year: 2022, sortOrder: 3 },
]

export const jobCategories = [
  { name: { id: 'Information Technology', en: 'Information Technology' } },
  { name: { id: 'Analysis & Reporting', en: 'Analysis & Reporting' } },
  { name: { id: 'Sales & Business Development', en: 'Sales & Business Development' } },
]

export const jobOpenings = [
  {
    title: { id: 'Backend Engineer', en: 'Backend Engineer' },
    slug: 'backend-engineer',
    category: 0,
    responsibilities: { id: 'Membangun dan memelihara layanan API yang digunakan oleh mitra lembaga keuangan. Menjaga kualitas kode melalui review dan dokumentasi.', en: 'Build and maintain the API services used by financial institution partners. Keep code quality high through review and documentation.' },
    minimumQualifications: { id: 'Pengalaman minimal 3 tahun membangun layanan backend. Menguasai basis data relasional.', en: 'At least 3 years building backend services. Strong with relational databases.' },
    education: { id: 'S1 Teknik Informatika atau bidang terkait.', en: 'Bachelor’s degree in Informatics or a related field.' },
  },
  {
    title: { id: 'Credit Risk Analyst', en: 'Credit Risk Analyst' },
    slug: 'credit-risk-analyst',
    category: 1,
    responsibilities: { id: 'Menganalisis portofolio kredit dan menyusun laporan berkala untuk mitra.', en: 'Analyse credit portfolios and prepare regular reports for partners.' },
    minimumQualifications: { id: 'Pengalaman di analisis risiko kredit. Terbiasa dengan pengolahan data berskala besar.', en: 'Experience in credit risk analysis. Comfortable working with large datasets.' },
    education: { id: 'S1 Statistika, Matematika, Ekonomi, atau bidang terkait.', en: 'Bachelor’s degree in Statistics, Mathematics, Economics or a related field.' },
  },
  {
    title: { id: 'Business Development Manager', en: 'Business Development Manager' },
    slug: 'business-development-manager',
    category: 2,
    responsibilities: { id: 'Mengembangkan hubungan dengan lembaga keuangan dan memperluas jangkauan layanan CLIK.', en: 'Develop relationships with financial institutions and widen the reach of CLIK services.' },
    minimumQualifications: { id: 'Pengalaman penjualan B2B di industri keuangan minimal 5 tahun.', en: 'At least 5 years of B2B sales experience in the financial industry.' },
    education: { id: 'S1 semua jurusan.', en: 'Bachelor’s degree in any field.' },
  },
]

export const careerPage = {
  heroTitle: { id: 'Bertumbuh Bersama CLIK Membangun Ekosistem Kredit Indonesia', en: 'Grow With CLIK, Building Indonesia’s Credit Ecosystem' },
  heroSubtitle: { id: 'Bergabunglah dengan tim yang membangun infrastruktur informasi kredit Indonesia.', en: 'Join the team building Indonesia’s credit information infrastructure.' },
  values: [
    { title: { id: 'Supporting Trust & Passion', en: 'Supporting Trust & Passion' }, subtitle: { id: 'Kepercayaan sebagai fondasi', en: 'Trust as the foundation' }, description: { id: 'Kami membangun kepercayaan melalui keterbukaan dan konsistensi dalam bekerja.', en: 'We build trust through openness and consistency in how we work.' } },
    { title: { id: 'Thinking Outside the Box', en: 'Thinking Outside the Box' }, subtitle: { id: 'Mencari cara yang lebih baik', en: 'Looking for a better way' }, description: { id: 'Kami mendorong cara pandang baru untuk menyelesaikan persoalan lama.', en: 'We encourage fresh perspectives on long-standing problems.' } },
    { title: { id: 'Pursuing Excellence', en: 'Pursuing Excellence' }, subtitle: { id: 'Kualitas dalam setiap detail', en: 'Quality in every detail' }, description: { id: 'Kami menjaga standar tinggi dalam setiap layanan yang kami berikan.', en: 'We hold a high standard in every service we deliver.' } },
    { title: { id: 'Embracing Diversity', en: 'Embracing Diversity' }, subtitle: { id: 'Beragam latar, satu tujuan', en: 'Many backgrounds, one goal' }, description: { id: 'Kami percaya keberagaman memperkuat cara kami mengambil keputusan.', en: 'We believe diversity strengthens how we make decisions.' } },
  ],
  benefits: [
    { title: { id: 'Asuransi Kesehatan', en: 'Health Insurance' } },
    { title: { id: 'Pengembangan Skill', en: 'Skill Development' } },
    { title: { id: 'Jenjang Karir', en: 'Career Progression' } },
    { title: { id: 'Jam Kerja Fleksibel', en: 'Flexible Working Hours' } },
  ],
  recruitmentSteps: [
    { title: { id: 'Screening CV', en: 'CV Screening' }, description: { id: 'Tim HR meninjau kecocokan pengalaman Anda.', en: 'The HR team reviews how your experience fits.' } },
    { title: { id: 'Interview HR', en: 'HR Interview' }, description: { id: 'Perkenalan dan pembahasan ekspektasi.', en: 'An introduction and a discussion of expectations.' } },
    { title: { id: 'Interview User', en: 'User Interview' }, description: { id: 'Diskusi teknis bersama tim terkait.', en: 'A technical discussion with the relevant team.' } },
    { title: { id: 'Pengecekan Credit Score', en: 'Credit Score Check' }, description: { id: 'Sesuai ketentuan industri keuangan.', en: 'In line with financial industry requirements.' } },
    { title: { id: 'Penawaran', en: 'Offer' }, description: { id: 'Penyampaian penawaran kerja resmi.', en: 'A formal offer is made.' } },
  ],
  cvNote: { id: 'Tidak menemukan posisi yang sesuai? Kirimkan CV Anda ke', en: 'Not finding the right position? Send your CV to' },
}
