/**
 * The five solution categories, plus the Layanan dan Produk, Business Solution
 * and Credit Scoring page copy.
 *
 * Page content lives in code, not the CMS. Change the wording here and
 * redeploy. Images are in public/images/products/. The products inside each
 * category (the "What We Offer" accordions) stay in the CMS (product-items).
 *
 * Indonesian is Figma verbatim; obvious Figma typos are corrected and noted.
 */

type Text = { id: string; en: string }

export type ProductAdvantage = { title: Text; description: Text }

export type ProductCategory = {
  slug: 'credit-scoring' | 'analytics' | 'decisioning' | 'business-intelligence' | 'consulting'
  name: Text
  /** Small icon, still used by the Home solutions carousel as a fallback. */
  icon: string
  /** 160px navy illustration on the Layanan Kami card (Component 17). */
  illustration: string
  illustrationWidth: number
  image: string
  /** Layanan Kami card text (Figma writes it in English on both pages). */
  shortDescription: Text
  /** Layanan Kami card button label (the BI card reads "Pelajari selengkapnya"). */
  cardButton: Text
  /** Business Solution section. */
  lead: Text | null
  description: Text
  /** Which side the photo sits on at desktop (Figma alternates). */
  imageSide: 'left' | 'right'
  advantages: ProductAdvantage[]
  /** Subtitle under "What We Offer". */
  offerSubtitle: Text | null
}

const DATA_DRIVEN: ProductAdvantage = {
  title: { id: 'Data-Driven Insights', en: 'Data-Driven Insights' },
  description: {
    id: 'Menghadirkan rekomendasi strategis berbasis data untuk mendukung pengambilan keputusan bisnis.',
    en: 'Delivers data-driven strategic recommendations to support business decisions.',
  },
}

const SEE_MORE: Text = { id: 'Lihat Selengkapnya', en: 'See More' }

export const productCategories: ProductCategory[] = [
  {
    slug: 'credit-scoring',
    name: { id: 'Credit Scoring', en: 'Credit Scoring' },
    icon: '/images/products/icon-credit-scoring.svg',
    illustration: '/images/products/services/credit-scoring.png',
    illustrationWidth: 180,
    image: '/images/products/credit-scoring.png',
    shortDescription: {
      id: 'Financial & alternative data for smarter credit decisions.',
      en: 'Financial & alternative data for smarter credit decisions.',
    },
    cardButton: SEE_MORE,
    lead: null,
    description: {
      id: 'Credit Scoring dari CLIK menilai profil risiko calon peminjam secara akurat melalui model skoring berbasis data yang komprehensif dan tervalidasi, membantu institusi Anda membuat keputusan kredit yang lebih objektif sejak awal proses evaluasi.',
      en: 'CLIK Credit Scoring accurately assesses the risk profile of prospective borrowers through comprehensive, validated data-driven scoring models, helping your institution make more objective credit decisions from the very start of the evaluation.',
    },
    imageSide: 'left',
    advantages: [],
    offerSubtitle: {
      id: 'Satu skor, satu laporan, satu keputusan yang lebih tepat.',
      en: 'One score, one report, one better decision.',
    },
  },
  {
    slug: 'analytics',
    name: { id: 'Analytics', en: 'Analytics' },
    icon: '/images/products/icon-analytics.svg',
    illustration: '/images/products/services/analytics.png',
    illustrationWidth: 180,
    image: '/images/products/analytics.png',
    shortDescription: {
      id: 'Custom AI models across the customer lifecycle.',
      en: 'Custom AI models across the customer lifecycle.',
    },
    cardButton: SEE_MORE,
    lead: {
      id: 'Optimalkan pengelolaan portofolio dan pemetaan risiko dengan analisis data yang mendalam dan prediktif.',
      en: 'Optimise portfolio management and risk mapping with in-depth, predictive data analysis.',
    },
    description: {
      id: 'Solusi Analytics CLIK mengolah data mentah menjadi wawasan prediktif yang dapat diandalkan untuk mendukung manajemen portofolio dan strategi mitigasi risiko. Dengan pendekatan berbasis model statistik dan machine learning, institusi Anda dapat memahami pola perilaku debitur, mengidentifikasi potensi risiko lebih dini, serta merancang strategi bisnis yang lebih adaptif terhadap dinamika pasar.',
      en: 'CLIK Analytics turns raw data into reliable predictive insight that supports portfolio management and risk mitigation strategy. With an approach built on statistical models and machine learning, your institution can understand borrower behaviour, spot potential risks earlier, and design business strategies that adapt better to market dynamics.',
    },
    imageSide: 'right',
    advantages: [
      {
        title: { id: 'Predictive Modeling', en: 'Predictive Modeling' },
        description: {
          id: 'Memprediksi kemungkinan risiko dan peluang bisnis berdasarkan pola data historis.',
          en: 'Predicts likely risks and business opportunities from historical data patterns.',
        },
      },
      {
        title: { id: 'Risk Segmentation', en: 'Risk Segmentation' },
        description: {
          id: 'Mengelompokkan profil nasabah berdasarkan tingkat risiko untuk strategi penanganan yang lebih tepat sasaran.',
          en: 'Groups customer profiles by risk level for better-targeted handling strategies.',
        },
      },
      {
        title: { id: 'Portfolio Monitoring', en: 'Portfolio Monitoring' },
        description: {
          id: 'Memantau kualitas dan performa portofolio kredit secara berkelanjutan.',
          en: 'Continuously monitors the quality and performance of the credit portfolio.',
        },
      },
      DATA_DRIVEN,
    ],
    offerSubtitle: {
      id: 'Optimalkan pengelolaan portofolio dan pemetaan risiko dengan analisis data yang mendalam dan prediktif.',
      en: 'Optimise portfolio management and risk mapping with in-depth, predictive data analysis.',
    },
  },
  {
    slug: 'decisioning',
    name: { id: 'Decisioning', en: 'Decisioning' },
    icon: '/images/products/icon-decisioning.svg',
    illustration: '/images/products/services/decisioning.png',
    illustrationWidth: 180,
    image: '/images/products/decisioning.png',
    shortDescription: {
      id: 'Data & AI-powered decisions at industrial scale.',
      en: 'Data & AI-powered decisions at industrial scale.',
    },
    cardButton: SEE_MORE,
    lead: {
      id: 'Percepat proses evaluasi dan persetujuan kredit tanpa mengorbankan akurasi maupun kepatuhan terhadap kebijakan risiko.',
      en: 'Speed up credit evaluation and approval without compromising accuracy or compliance with risk policy.',
    },
    description: {
      id: 'Sistem Decisioning CLIK dirancang untuk mengotomatiskan alur kerja persetujuan kredit secara fleksibel, memungkinkan institusi Anda menerapkan kebijakan risiko yang konsisten sekaligus responsif terhadap kebutuhan bisnis yang terus berkembang. Dengan mesin aturan (rule engine) yang dapat dikonfigurasi, proses evaluasi menjadi lebih cepat, transparan, dan minim intervensi manual.',
      en: 'CLIK Decisioning is built to automate credit approval workflows flexibly, letting your institution apply risk policies consistently while staying responsive to evolving business needs. With a configurable rule engine, evaluation becomes faster, more transparent and needs little manual intervention.',
    },
    imageSide: 'left',
    advantages: [
      {
        title: { id: 'Automated Credit Approval', en: 'Automated Credit Approval' },
        description: {
          id: 'Mempercepat proses persetujuan kredit melalui otomatisasi alur kerja end-to-end.',
          en: 'Speeds up credit approval through end-to-end workflow automation.',
        },
      },
      {
        title: { id: 'Rule Engine Optimization', en: 'Rule Engine Optimization' },
        description: {
          id: 'Menyesuaikan kebijakan dan aturan keputusan secara fleksibel sesuai strategi risiko perusahaan.',
          en: 'Flexibly adjusts decision policies and rules to the company’s risk strategy.',
        },
      },
      {
        title: { id: 'Operational Efficiency', en: 'Operational Efficiency' },
        description: {
          id: 'Mengurangi beban kerja manual dan mempercepat waktu respons kepada nasabah.',
          en: 'Reduces manual workload and speeds up response times to customers.',
        },
      },
      DATA_DRIVEN,
    ],
    offerSubtitle: {
      id: 'Percepat proses evaluasi dan persetujuan kredit tanpa mengorbankan akurasi maupun kepatuhan kebijakan.',
      en: 'Speed up credit evaluation and approval without compromising accuracy or policy compliance.',
    },
  },
  {
    slug: 'business-intelligence',
    name: { id: 'Business Intelligence', en: 'Business Intelligence' },
    icon: '/images/products/icon-business-intelligence.svg',
    illustration: '/images/products/services/business-intelligence.png',
    illustrationWidth: 180,
    image: '/images/products/business-intelligence.jpeg',
    shortDescription: {
      id: 'Corporate credit risk scoring for better business decisions.',
      en: 'Corporate credit risk scoring for better business decisions.',
    },
    cardButton: { id: 'Pelajari selengkapnya', en: 'Learn more' },
    lead: {
      id: 'Pantau performa bisnis dan tren pasar secara real-time melalui dashboard analitik yang komprehensif.',
      en: 'Monitor business performance and market trends in real time through comprehensive analytics dashboards.',
    },
    description: {
      id: 'Solusi Business Intelligence dari CLIK menghadirkan dashboard analitik real-time yang memudahkan manajemen dalam memantau performa bisnis, mengidentifikasi tren pasar, dan merumuskan keputusan strategis dengan lebih percaya diri. Data yang tersaji secara visual dan mudah dipahami memungkinkan seluruh level organisasi bergerak selaras dalam satu arah strategi yang berbasis fakta.',
      en: 'CLIK Business Intelligence provides real-time analytics dashboards that make it easy for management to monitor business performance, identify market trends and make strategic decisions with more confidence. Data presented visually and clearly lets every level of the organisation move together in one fact-based strategic direction.',
    },
    imageSide: 'right',
    advantages: [
      {
        title: { id: 'Real-time Dashboard', en: 'Real-time Dashboard' },
        description: {
          // Figma repeats the Predictive Modeling text here.
          id: 'Memprediksi kemungkinan risiko dan peluang bisnis berdasarkan pola data historis.',
          en: 'Predicts likely risks and business opportunities from historical data patterns.',
        },
      },
      {
        title: { id: 'Market Insights', en: 'Market Insights' },
        description: {
          id: 'Mengidentifikasi tren dan peluang pasar untuk mendukung perencanaan strategis.',
          en: 'Identifies market trends and opportunities to support strategic planning.',
        },
      },
      {
        title: { id: 'Strategic Performance Tracking', en: 'Strategic Performance Tracking' },
        description: {
          id: 'Memantau pencapaian target bisnis secara terukur dan berkelanjutan.',
          en: 'Tracks business targets in a measurable, continuous way.',
        },
      },
      DATA_DRIVEN,
    ],
    offerSubtitle: {
      id: 'Pantau performa bisnis dan tren pasar secara real-time melalui dashboard analitik yang komprehensif.',
      en: 'Monitor business performance and market trends in real time through comprehensive analytics dashboards.',
    },
  },
  {
    slug: 'consulting',
    name: { id: 'Consulting', en: 'Consulting' },
    icon: '/images/products/icon-consulting.svg',
    illustration: '/images/products/services/consulting.png',
    illustrationWidth: 180,
    image: '/images/products/consulting.jpeg',
    shortDescription: {
      id: 'Strategic consulting for better business decisions.',
      en: 'Strategic consulting for better business decisions.',
    },
    cardButton: SEE_MORE,
    lead: {
      id: 'Manfaatkan keahlian tim CLIK dan jaringan global CRIF untuk memvalidasi, mengoptimalkan, dan mengembangkan strategi risiko bisnis Anda secara terukur.',
      en: 'Draw on the expertise of the CLIK team and CRIF’s global network to validate, optimise and develop your business risk strategy in a measurable way.',
    },
    description: {
      id: 'Layanan Consulting CLIK menghadirkan pendampingan strategis berbasis data bagi institusi yang ingin memvalidasi ide, mengoptimalkan portofolio, hingga membangun scoring model yang benar-benar sesuai dengan karakter bisnisnya. Didukung keahlian modelling CRIF secara global dan kekayaan data biro CLIK di Indonesia, tim Consulting kami bekerja bersama institusi Anda untuk mengubah data menjadi keputusan bisnis yang lebih terarah dan berbasis bukti — mulai dari tahap uji coba hingga implementasi penuh.',
      en: 'CLIK Consulting offers data-driven strategic support for institutions that want to validate ideas, optimise their portfolio, or build a scoring model that truly fits their business. Backed by CRIF’s global modelling expertise and CLIK’s rich bureau data in Indonesia, our Consulting team works with your institution to turn data into more focused, evidence-based business decisions — from trial through to full implementation.',
    },
    imageSide: 'left',
    advantages: [
      {
        title: { id: 'Evidence-Based Evaluation', en: 'Evidence-Based Evaluation' },
        description: {
          id: 'Validasi value produk dan score secara objektif sebelum implementasi penuh.',
          en: 'Objectively validates product and score value before full implementation.',
        },
      },
      {
        title: { id: 'Portfolio Growth & Risk Optimization', en: 'Portfolio Growth & Risk Optimization' },
        description: {
          id: 'Mengidentifikasi peluang cross-sell dan memperkuat mitigasi risiko melalui stress testing.',
          en: 'Identifies cross-sell opportunities and strengthens risk mitigation through stress testing.',
        },
      },
      {
        title: { id: 'Bespoke Scoring Model', en: 'Bespoke Scoring Model' },
        description: {
          id: 'Model skoring yang dirancang khusus sesuai portofolio dan segmen nasabah Anda.',
          en: 'A scoring model designed specifically for your portfolio and customer segments.',
        },
      },
      DATA_DRIVEN,
    ],
    offerSubtitle: {
      // Figma repeats the Business Intelligence subtitle here.
      id: 'Pantau performa bisnis dan tren pasar secara real-time melalui dashboard analitik yang komprehensif.',
      en: 'Monitor business performance and market trends in real time through comprehensive analytics dashboards.',
    },
  },
]

/** Labels shared by the product accordions and carousels. */
export const productUi = {
  whatWeOffer: { id: 'What We Offer', en: 'What We Offer' },
  keyAdvantages: { id: 'Keunggulan Utama:', en: 'Key Advantages:' },
  accordion: {
    description: { id: 'Deskripsi', en: 'Description' },
    features: { id: 'Fitur Utama', en: 'Key Features' },
    suitableFor: { id: 'Cocok Untuk', en: 'Suitable For' },
    useCases: { id: 'Kasus Penggunaan', en: 'Use Cases' },
    expand: { id: 'Tampilkan detail', en: 'Show details' },
    collapse: { id: 'Sembunyikan detail', en: 'Hide details' },
  },
  carousel: {
    previous: { id: 'Sebelumnya', en: 'Previous' },
    next: { id: 'Berikutnya', en: 'Next' },
    goTo: { id: 'Tampilkan bagian', en: 'Show page' },
  },
}

/* ------------------------------------------------------------------ */
/* Layanan dan Produk (Figma 427:2795)                                  */
/* ------------------------------------------------------------------ */

export const productsPage = {
  heroImage: '/images/products/hero.png',
  title: { id: 'Layanan dan Produk', en: 'Products & Services' },
  lead: {
    id: 'CLIK menghadirkan ekosistem solusi berbasis data untuk membantu institusi keuangan dan pelaku bisnis mengambil keputusan kredit yang lebih presisi, cepat, dan aman.',
    en: 'CLIK offers an ecosystem of data-driven solutions that help financial institutions and businesses make more precise, faster and safer credit decisions.',
  },
  intro: {
    id: 'Di tengah persaingan industri keuangan yang semakin kompleks, keputusan yang tepat harus didukung oleh data yang akurat dan analisis yang andal. CLIK hadir sebagai mitra strategis bagi lembaga keuangan, perbankan, multifinance, hingga korporasi dalam mengelola risiko kredit secara menyeluruh.',
    en: 'As competition in the financial industry grows more complex, the right decisions need accurate data and reliable analysis behind them. CLIK is a strategic partner for financial institutions, banks, multifinance companies and corporations in managing credit risk end to end.',
  },
  servicesTitle: { id: 'Layanan Kami', en: 'Our Services' },
  /** The 4x2 icon grid on the white band. `id` keeps the Figma line breaks. */
  dataItems: [
    { icon: '/images/products/data/identification.webp', size: 130, label: { id: 'Data Identifikasi\ndan Rincian\nKontak', en: 'Identification Data and Contact Details' } },
    { icon: '/images/products/data/company.webp', size: 120, label: { id: 'Data Perusahaan dengan\nInformasi Manajemen dan\nKepemilikan', en: 'Company Data with Management and Ownership Information' } },
    { icon: '/images/products/data/loan.webp', size: 130, label: { id: 'Rincian Pinjaman\n& Pembayaran\nAktif', en: 'Active Loan & Payment Details' } },
    { icon: '/images/products/data/credit-card.webp', size: 130, label: { id: 'Rincian Kartu\nKredit &\nPembayaran Aktif', en: 'Active Credit Card & Payment Details' } },
    { icon: '/images/products/data/bond.webp', size: 130, label: { id: 'Obligasi', en: 'Bonds' } },
    { icon: '/images/products/data/letter-of-credit.webp', size: 130, label: { id: 'Surat Kredit', en: 'Letters of Credit' } },
    { icon: '/images/products/data/collateral.webp', size: 130, label: { id: 'Data Jaminan', en: 'Collateral Data' } },
    { icon: '/images/products/data/guarantor.webp', size: 130, label: { id: 'Informasi Penjamin', en: 'Guarantor Information' } },
  ],
  creditScore: {
    title: { id: 'Apa itu skor kredit?', en: 'What is a credit score?' },
    body: [
      {
        // Figma: "pengkasesan", corrected to "pengaksesan".
        id: 'Skor kredit adalah angka numerik yang memberi peringkat kepada individu atau bisnis berdasarkan kinerja historis dalam memenuhi kewajiban pembayaran. Skor kredit juga memungkinkan lembaga keuangan untuk membuat keputusan yang lebih akurat dan memfasilitasi individu atau bisnis dalam pengaksesan kredit.',
        en: 'A credit score is a number that ranks individuals or businesses by their track record in meeting payment obligations. Credit scores also let financial institutions make more accurate decisions and make it easier for individuals and businesses to access credit.',
      },
      {
        id: 'Skor kredit pada PT CRIF Lembaga Informasi Keuangan (CLIK) merupakan tiga digit angka yang memperkirakan kelayakan kredit dan kemungkinan individu atau bisnis untuk membayar kembali pinjaman dan pembayaran cicilan secara tepat waktu.',
        en: 'The credit score at PT CRIF Lembaga Informasi Keuangan (CLIK) is a three-digit number that estimates the creditworthiness of an individual or business and how likely they are to repay loans and instalments on time.',
      },
    ],
    gauge: '/images/products/cb-score-gauge.webp',
    gaugeAlt: {
      id: 'Contoh CB Score: skor 525, risk grade E, medium risk, pada skala A sampai J',
      en: 'Sample CB Score: score 525, risk grade E, medium risk, on an A to J scale',
    },
  },
  routes: {
    title: {
      id: 'Ingin Mengecek atau Melaporkan Data Kredit Anda?',
      en: 'Want to Check or Report Your Credit Data?',
    },
    subtitle: {
      id: 'Kami berkomitmen menjaga akurasi dan transparansi data Anda.',
      en: 'We are committed to keeping your data accurate and transparent.',
    },
    link: { id: 'Pelajari Caranya →', en: 'Learn How →' },
    cards: [
      {
        route: 'howToGetReport' as const,
        icon: 'document' as const,
        title: { id: 'Cek Laporan Kredit Anda', en: 'Check Your Credit Report' },
        text: {
          id: 'Pelajari cara mendapatkan laporan kredit pribadi maupun badan usaha Anda.',
          en: 'Find out how to get your personal or business credit report.',
        },
      },
      {
        route: 'complaintResolution' as const,
        icon: 'shield' as const,
        title: { id: 'Penyelesaian Pengaduan', en: 'Complaint Resolution' },
        text: {
          id: 'Sampaikan pengaduan Anda dan kami akan menindaklanjuti sesuai prosedur yang berlaku.',
          en: 'Submit your complaint and we will follow it up in line with the applicable procedure.',
        },
      },
    ],
  },
}

/* ------------------------------------------------------------------ */
/* Business Solution (Figma 859:4457)                                   */
/* ------------------------------------------------------------------ */

export const businessSolutionPage = {
  heroImage: '/images/about/office.png',
  title: { id: 'Business Solution', en: 'Business Solution' },
  heading: {
    id: 'Solusi Informasi Keuangan dan Analisis Risiko Terpercaya untuk Keputusan Bisnis yang Lebih Cerdas',
    en: 'Trusted Financial Information and Risk Analysis Solutions for Smarter Business Decisions',
  },
  intro: {
    id: 'Untuk mendukung setiap tahapan pengambilan keputusan bisnis Anda, CLIK mengembangkan empat pilar solusi utama yang saling terintegrasi: Credit Scoring, Analytics, Decisioning, dan Business Intelligence. Simak bagaimana masing-masing solusi dapat membantu institusi Anda tumbuh lebih percaya diri dan berbasis data.',
    en: 'To support every stage of your business decision-making, CLIK has developed four integrated solution pillars: Credit Scoring, Analytics, Decisioning and Business Intelligence. See how each one can help your institution grow with more confidence, driven by data.',
  },
}

/* ------------------------------------------------------------------ */
/* Credit Scoring (Figma 859:4489)                                      */
/* ------------------------------------------------------------------ */

type FeatureIcon = 'clock' | 'database' | 'shield' | 'people' | 'document'

export const creditScoringPage = {
  heroImage: '/images/products/credit-scoring.png',
  title: { id: 'Credit Scoring', en: 'Credit Scoring' },
  lead: {
    id: 'Keputusan Kredit yang Lebih Cerdas, Lebih Cepat, Lebih Terpercaya.',
    en: 'Smarter, Faster, More Trusted Credit Decisions.',
  },
  what: {
    title: { id: 'Apa Itu CLIK Credit Scoring?', en: 'What Is CLIK Credit Scoring?' },
    body: [
      {
        id: 'CLIK Credit Scoring adalah solusi penilaian risiko kredit berbasis teknologi dari PT Credit Bureau Indonesia (CLIK), Lembaga Pengelola Informasi Perkreditan (LPIP) yang telah berlisensi resmi dari Otoritas Jasa Keuangan (OJK).',
        en: 'CLIK Credit Scoring is a technology-based credit risk assessment solution from PT Credit Bureau Indonesia (CLIK), a Credit Information Management Institution (LPIP) officially licensed by the Financial Services Authority (OJK).',
      },
      {
        id: 'Kami menggabungkan data kredit tradisional dan data alternatif dengan algoritma pembelajaran mesin (machine learning) untuk menghasilkan skor kredit yang akurat, objektif, dan dapat diandalkan.',
        en: 'We combine traditional credit data and alternative data with machine learning algorithms to produce credit scores that are accurate, objective and reliable.',
      },
      {
        id: 'Setiap proses pengolahan data dijalankan dengan mengacu pada regulasi perlindungan data pribadi dan tata kelola informasi perkreditan yang berlaku di Indonesia, sehingga lembaga keuangan dapat mengambil keputusan dengan tenang dan percaya diri.',
        en: 'All data processing follows the personal data protection regulations and credit information governance in force in Indonesia, so financial institutions can make decisions calmly and with confidence.',
      },
    ],
    illustration: '/images/products/credit-scoring/credit-risk-assessment.webp',
  },
  featuresTitle: { id: 'Fitur Utama & Keunggulan', en: 'Key Features & Advantages' },
  features: {
    ojk: {
      logo: '/images/products/credit-scoring/ojk-logo.webp',
      title: { id: 'Terdaftar & Diawasi oleh OJK', en: 'Registered & Supervised by OJK' },
      text: {
        // Figma: "sesuaidengan", corrected.
        id: 'Kami berkomitmen penuh terhadap kepatuhan regulasi dan perlindungan data pengguna sesuai dengan ketentuan OJK.',
        en: 'We are fully committed to regulatory compliance and user data protection in line with OJK regulations.',
      },
    },
    model: {
      title: { id: 'Model Skor Kredit Proprietary', en: 'Proprietary Credit Scoring Model' },
      text: {
        id: 'Algoritma canggih dengan 10 grade skor (A–J) untuk penilaian risiko yang presisi.',
        en: 'Advanced algorithms with 10 score grades (A–J) for precise risk assessment.',
      },
      scoreLabel: { id: 'Score', en: 'Score' },
      gradeLabel: { id: 'Risk Grade', en: 'Risk Grade' },
      scale: '/images/products/credit-scoring/score-scale.webp',
      scaleAlt: { id: 'Medium Risk pada skala grade A sampai J', en: 'Medium Risk on the A to J grade scale' },
      high: { id: 'Risiko Tinggi', en: 'High Risk' },
      low: { id: 'Risiko Rendah', en: 'Low Risk' },
    },
    small: [
      {
        key: 'realtime',
        icon: 'clock' as FeatureIcon,
        tile: '#EEF2FF',
        title: { id: 'Real-Time Processing', en: 'Real-Time Processing' },
        text: {
          id: 'Skor kredit dihasilkan secara instan melalui integrasi API, mendukung proses persetujuan yang cepat tanpa mengorbankan akurasi.',
          en: 'Credit scores are generated instantly through API integration, supporting fast approvals without sacrificing accuracy.',
        },
      },
      {
        key: 'coverage',
        icon: 'database' as FeatureIcon,
        tile: '#EFFAF1',
        title: { id: 'Cakupan Data yang Luas', en: 'Broad Data Coverage' },
        text: {
          id: 'Menggunakan berbagai sumber data terpercaya untuk hasil analisis yang komprehensif dan akurat.',
          en: 'Uses a range of trusted data sources for comprehensive, accurate analysis.',
        },
      },
    ],
    side: [
      {
        key: 'security',
        icon: 'shield' as FeatureIcon,
        tile: '#EAF1FF',
        title: { id: 'Keamanan Data\nTerjamin', en: 'Guaranteed Data\nSecurity' },
        text: {
          id: 'Enkripsi end-to-end dan sistem keamanan berlapis untuk melindungi data Anda.',
          en: 'End-to-end encryption and layered security systems to protect your data.',
        },
      },
      {
        key: 'support',
        icon: 'people' as FeatureIcon,
        tile: '#E6F7F4',
        title: { id: 'Dukungan Profesional', en: 'Professional Support' },
        text: {
          id: 'Tim ahli siap membantu Anda dengan layanan terbaik setiap saat.',
          en: 'Our experts are ready to help you with the best service at all times.',
        },
      },
      {
        key: 'compliance',
        icon: 'document' as FeatureIcon,
        tile: '#FFF4E0',
        title: { id: 'Kepatuhan Regulasi', en: 'Regulatory Compliance' },
        text: {
          id: 'Selaras dengan peraturan perlindungan data dan privasi yang berlaku.',
          en: 'Aligned with applicable data protection and privacy regulations.',
        },
      },
    ],
  },
  stepsTitle: { id: 'Cara Kerja', en: 'How It Works' },
  steps: [
    {
      image: '/images/products/credit-scoring/step-1.webp',
      width: 292,
      height: 201,
      title: { id: 'Integrasi API', en: 'API Integration' },
      text: {
        // Figma ends with "baik.." — the double full stop is dropped.
        id: 'Tim teknis CLIK membantu lembaga keuangan menghubungkan sistem melalui API yang aman dan terdokumentasi dengan baik.',
        en: 'CLIK’s technical team helps financial institutions connect their systems through a secure, well-documented API.',
      },
    },
    {
      image: '/images/products/credit-scoring/step-2.webp',
      width: 299,
      height: 175,
      title: { id: 'Pengiriman Data Permohonan', en: 'Application Data Submission' },
      text: {
        id: 'Lembaga keuangan mengirimkan data calon debitur (sesuai persetujuan dan regulasi yang berlaku) melalui sistem terintegrasi',
        en: 'The financial institution sends the applicant’s data (with consent and in line with applicable regulations) through the integrated system',
      },
    },
    {
      image: '/images/products/credit-scoring/step-3.webp',
      width: 310,
      height: 178,
      title: { id: 'Pemrosesan & Analisis', en: 'Processing & Analysis' },
      text: {
        id: 'Algoritma CLIK memproses data tradisional dan alternatif secara real-time untuk menghasilkan skor kredit serta insight pendukung.',
        en: 'CLIK’s algorithms process traditional and alternative data in real time to produce a credit score and supporting insight.',
      },
    },
    {
      image: '/images/products/credit-scoring/step-4.webp',
      width: 267,
      height: 189,
      title: { id: 'Penerimaan Skor Kredit', en: 'Receiving the Credit Score' },
      text: {
        id: 'Hasil skor dan analisis risiko diterima secara instan, siap digunakan sebagai dasar pengambilan keputusan kredit.',
        en: 'The score and risk analysis arrive instantly, ready to use as the basis for credit decisions.',
      },
    },
  ],
  benefitsTitle: { id: 'Manfaat untuk Lembaga Keuangan', en: 'Benefits for Financial Institutions' },
  benefits: [
    {
      image: '/images/products/credit-scoring/benefit-1.webp',
      title: { id: 'Menurunkan Rasio NPL/NPF', en: 'Lower NPL/NPF Ratios' },
      text: {
        id: 'Deteksi risiko lebih awal membantu menyaring calon debitur berisiko tinggi sebelum pencairan kredit.',
        en: 'Detecting risk earlier helps filter out high-risk applicants before credit is disbursed.',
      },
    },
    {
      image: '/images/products/credit-scoring/benefit-2.webp',
      title: { id: 'Mempercepat Proses Underwriting', en: 'Faster Underwriting' },
      text: {
        id: 'Skor kredit real-time memangkas waktu analisis manual, mempercepat waktu keputusan dari hari menjadi hitungan menit.',
        en: 'Real-time credit scores cut manual analysis time, shortening decisions from days to minutes.',
      },
    },
    {
      image: '/images/products/credit-scoring/benefit-3.webp',
      title: { id: 'Memperluas Jangkauan Segmen', en: 'Reach More Segments' },
      text: {
        // Figma starts with a lower-case "lembaga".
        id: 'Lembaga keuangan dapat menilai kelayakan kredit nasabah yang belum memiliki riwayat perbankan formal, membuka peluang pasar baru secara bertanggung jawab.',
        en: 'Financial institutions can assess the creditworthiness of customers with no formal banking history, opening new markets responsibly.',
      },
    },
    {
      image: '/images/products/credit-scoring/benefit-4.webp',
      title: { id: 'Efisiensi Operasional', en: 'Operational Efficiency' },
      text: {
        id: 'Mengurangi ketergantungan pada proses manual sehingga tim analis dapat fokus pada kasus-kasus yang benar-benar memerlukan penilaian mendalam.',
        en: 'Less reliance on manual processes lets analysts focus on the cases that really need in-depth assessment.',
      },
    },
  ],
}
