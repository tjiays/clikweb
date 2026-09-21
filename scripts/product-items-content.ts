/**
 * Content for the 29 product items, taken verbatim from the Figma product
 * accordions (Credit Scoring 1625:10967; Business Solution 1647:13320,
 * 1653:17920, 1670:13197, 1705:17708) with an English translation.
 *
 * Used by scripts/seed-product-items.ts. Order within a category is the Figma
 * row order and becomes sortOrder.
 */

type L = { id: string; en: string }
type Lists = { id: string[]; en: string[] }

export type ProductSeed = {
  name: string
  category: 'credit-scoring' | 'analytics' | 'decisioning' | 'business-intelligence' | 'consulting'
  status: 'live' | 'ready_to_sell'
  isNew: boolean
  short: L
  description: L
  features: Lists
  suitableFor: Lists
  useCases: Lists
}

const BANK_MF_FINTECH_DL: Lists = {
  id: ['Bank', 'Multifinance', 'Fintech / Digital Lender'],
  en: ['Bank', 'Multifinance', 'Fintech / Digital Lender'],
}

/* The self-service analytics copy that Figma repeats on several rows. */
const SELF_SERVICE_DESC: L = {
  id: 'Platform analytics self-service yang mencakup berbagai jenis fasilitas kredit, dengan peer benchmarking dan filter yang dapat disesuaikan untuk analisis pasar dan portofolio.',
  en: 'A self-service analytics platform covering many types of credit facility, with peer benchmarking and adjustable filters for market and portfolio analysis.',
}
const SELF_SERVICE_FEATURES: Lists = {
  id: ['8 modul', 'Analytics multi-fasilitas', '17 filter kombinasi', 'Analisis historis', 'Benchmarking self vs peer'],
  en: ['8 modules', 'Multi-facility analytics', '17 combinable filters', 'Historical analysis', 'Self vs peer benchmarking'],
}
const SELF_SERVICE_SUITABLE: Lists = {
  id: ['Institusi Keuangan', 'Tim Risk', 'Tim Strategy', 'Analyst'],
  en: ['Financial Institutions', 'Risk Teams', 'Strategy Teams', 'Analysts'],
}
const SELF_SERVICE_USES: Lists = {
  id: ['Analisis pasar', 'Benchmarking portofolio', 'Monitoring industri', 'Perencanaan strategis'],
  en: ['Market analysis', 'Portfolio benchmarking', 'Industry monitoring', 'Strategic planning'],
}
const MARKET_INTEL_DESC: L = {
  id: 'Platform credit market intelligence berbasis web yang mengubah data biro menjadi insight interaktif untuk analisis pasar, benchmarking, dan pengambilan keputusan strategis',
  en: 'A web-based credit market intelligence platform that turns bureau data into interactive insight for market analysis, benchmarking and strategic decision-making',
}
const MARKET_INTEL_FEATURES: Lists = {
  id: ['Tren pasar', 'Benchmarking portofolio', 'Tampilan historis', 'Insight sosio-demografis', 'Analisis interaktif'],
  en: ['Market trends', 'Portfolio benchmarking', 'Historical view', 'Socio-demographic insight', 'Interactive analysis'],
}
const MARKET_INTEL_SUITABLE: Lists = {
  id: ['Institusi Keuangan', 'Business Leaders', 'Tim Risk & Strategy', 'Analyst'],
  en: ['Financial Institutions', 'Business Leaders', 'Risk & Strategy Teams', 'Analysts'],
}
const MARKET_INTEL_USES: Lists = {
  id: ['Analisis pasar', 'Benchmarking portofolio', 'Kalibrasi kebijakan risiko', 'Perencanaan strategis'],
  en: ['Market analysis', 'Portfolio benchmarking', 'Risk policy calibration', 'Strategic planning'],
}

export const productSeeds: ProductSeed[] = [
  /* ---------------- Credit Scoring ---------------- */
  {
    name: 'Full Report',
    category: 'credit-scoring',
    status: 'live',
    isNew: false,
    short: {
      id: 'Lihat gambaran kredit secara menyeluruh sebelum mengambil keputusan.',
      en: 'See the full credit picture before you decide.',
    },
    description: {
      id: 'Laporan biro kredit komprehensif CLIK untuk individu dan perusahaan yang menggabungkan data identifikasi, credit score, fasilitas, histori pembayaran, histori enquiry, dan informasi biro tambahan.',
      en: 'CLIK’s comprehensive credit bureau report for individuals and companies, combining identification data, credit score, facilities, payment history, enquiry history and additional bureau information.',
    },
    features: {
      id: ['CB Score', 'Fasilitas & eksposur kredit', 'Data tambahan', 'Histori enquiry', 'Agunan & penjamin', 'Histori kontrak 24 bulan'],
      en: ['CB Score', 'Credit facilities & exposure', 'Additional data', 'Enquiry history', 'Collateral & guarantors', '24-month contract history'],
    },
    suitableFor: BANK_MF_FINTECH_DL,
    useCases: {
      id: ['Credit underwriting', 'Evaluasi nasabah', 'Monitoring portofolio', 'Dukungan collection'],
      en: ['Credit underwriting', 'Customer evaluation', 'Portfolio monitoring', 'Collection support'],
    },
  },
  {
    name: 'Slim Report',
    category: 'credit-scoring',
    status: 'live',
    isNew: false,
    short: {
      id: 'Dapatkan informasi kredit esensial dengan lebih sederhana.',
      en: 'Get the essential credit information, more simply.',
    },
    description: {
      id: 'Laporan biro ringkas untuk screening yang lebih sederhana, menyediakan detail subjek, CB score, dan ringkasan kontrak dengan informasi institusi yang dianonimkan.',
      en: 'A concise bureau report for simpler screening, providing subject details, CB score and a contract summary with anonymised institution information.',
    },
    features: {
      id: ['CB Score', 'Informasi subjek', 'Ringkasan kontrak', 'Institusi dianonimkan', 'Ringkasan kolektibilitas'],
      en: ['CB Score', 'Subject information', 'Contract summary', 'Anonymised institutions', 'Collectability summary'],
    },
    suitableFor: {
      id: ['Financial Aggregator', 'Marketplace', 'Platform Digital', 'Intermediary'],
      en: ['Financial Aggregators', 'Marketplaces', 'Digital Platforms', 'Intermediaries'],
    },
    useCases: {
      id: ['Pre-screening', 'Lead qualification', 'Product matching', 'Routing ke mitra pembiayaan'],
      en: ['Pre-screening', 'Lead qualification', 'Product matching', 'Routing to financing partners'],
    },
  },
  {
    name: 'Soft Pull Report',
    category: 'credit-scoring',
    status: 'live',
    isNew: false,
    short: {
      id: 'Verifikasi nasabah dan nilai risikonya dalam satu pengecekan.',
      en: 'Verify a customer and assess their risk in a single check.',
    },
    description: {
      id: 'Tool KYC/KYB dan screening kredit ringkas yang mencocokkan data nasabah dengan database CLIK serta memberikan indikator matching dan risiko kredit.',
      en: 'A KYC/KYB and light credit screening tool that matches customer data against the CLIK database and returns matching and credit risk indicators.',
    },
    features: {
      id: ['Pencocokan identitas', 'Match score', 'CB Score', 'Score factors', 'Cakupan individu & perusahaan'],
      en: ['Identity matching', 'Match score', 'CB Score', 'Score factors', 'Individual & company coverage'],
    },
    suitableFor: {
      id: ['Bank', 'Multifinance', 'Fintech', 'Platform Digital'],
      en: ['Bank', 'Multifinance', 'Fintech', 'Digital Platforms'],
    },
    useCases: {
      id: ['Verifikasi nasabah', 'Dukungan KYC/KYB', 'Pre-screening', 'Digital onboarding'],
      en: ['Customer verification', 'KYC/KYB support', 'Pre-screening', 'Digital onboarding'],
    },
  },
  {
    name: 'Compliance Report',
    category: 'credit-scoring',
    status: 'live',
    isNew: false,
    short: {
      id: 'Dukung proses compliance dengan format laporan kredit yang familiar.',
      en: 'Support compliance with a familiar credit report format.',
    },
    description: {
      id: 'Laporan CLIK yang mengikuti format laporan kredit SLIK OJK untuk membantu institusi memigrasikan workflow informasi kredit dengan kebutuhan redevelopment yang minimal.',
      en: 'A CLIK report that follows the OJK SLIK credit report format, helping institutions migrate their credit information workflow with minimal redevelopment.',
    },
    features: {
      id: ['Format selaras SLIK', 'Struktur data familiar', 'Dukungan migrasi integrasi', 'Informasi kredit'],
      en: ['SLIK-aligned format', 'Familiar data structure', 'Integration migration support', 'Credit information'],
    },
    suitableFor: {
      id: ['Bank', 'Institusi Keuangan', 'Multifinance'],
      en: ['Bank', 'Financial Institutions', 'Multifinance'],
    },
    useCases: {
      id: ['Workflow compliance', 'Evaluasi nasabah', 'Migrasi integrasi', 'Credit assessment'],
      en: ['Compliance workflow', 'Customer evaluation', 'Integration migration', 'Credit assessment'],
    },
  },
  {
    name: 'Unified Report',
    category: 'credit-scoring',
    status: 'live',
    isNew: false,
    short: {
      id: 'Satukan pihak terkait dan informasi bisnis dalam satu gambaran yang lebih jelas.',
      en: 'Bring related parties and business information together in one clearer picture.',
    },
    description: {
      id: 'Laporan terintegrasi yang menggabungkan informasi biro kredit dan informasi bisnis untuk promoter dan pihak terkait, dilengkapi ringkasan KPI tingkat tinggi.',
      en: 'An integrated report combining credit bureau and business information for promoters and related parties, with a high-level KPI summary.',
    },
    features: {
      // Figma reads "Tampilan pihak iterate", a typo for "terkait".
      id: ['Tampilan pihak terkait', 'Credit Bureau Report', 'Business Information Report', 'Ringkasan KPI tingkat tinggi'],
      en: ['Related-party view', 'Credit Bureau Report', 'Business Information Report', 'High-level KPI summary'],
    },
    suitableFor: {
      id: ['Bank', 'Multifinance', 'Lender Korporasi / SME'],
      en: ['Bank', 'Multifinance', 'Corporate / SME Lenders'],
    },
    useCases: {
      id: ['Penilaian kredit bisnis', 'Evaluasi pihak terkait', 'Risk assessment', 'Dukungan keputusan'],
      en: ['Business credit assessment', 'Related-party evaluation', 'Risk assessment', 'Decision support'],
    },
  },
  {
    name: 'Aggregated Variable Calculation (AVC)',
    category: 'credit-scoring',
    status: 'ready_to_sell',
    isNew: false,
    short: {
      id: 'Ubah data biro menjadi variabel siap pakai untuk pengambilan keputusan.',
      en: 'Turn bureau data into ready-to-use variables for decision-making.',
    },
    description: {
      id: 'Layanan yang menghasilkan variabel kredit terhitung dari data biro, siap digunakan dalam scoring model, policy engine, dan workflow analytics.',
      en: 'A service that produces calculated credit variables from bureau data, ready for use in scoring models, policy engines and analytics workflows.',
    },
    features: {
      id: ['77 variabel terhitung', 'Indikator biro teragregasi', 'Output terstandardisasi', 'Data siap model'],
      en: ['77 calculated variables', 'Aggregated bureau indicators', 'Standardised output', 'Model-ready data'],
    },
    suitableFor: {
      id: ['Bank', 'Multifinance', 'Fintech', 'Tim Risk & Data'],
      en: ['Bank', 'Multifinance', 'Fintech', 'Risk & Data Teams'],
    },
    useCases: {
      id: ['Pengembangan score', 'Credit policy rules', 'Decisioning', 'Data enrichment'],
      en: ['Score development', 'Credit policy rules', 'Decisioning', 'Data enrichment'],
    },
  },
  {
    name: 'Fintech Bureau (FDC)',
    category: 'credit-scoring',
    status: 'ready_to_sell',
    isNew: true,
    short: {
      id: 'Satukan data kredit fintech dalam satu gambaran yang lebih menyeluruh.',
      en: 'Bring fintech credit data together in one fuller picture.',
    },
    description: {
      id: 'Vertical bureau yang memusatkan dan menstandardisasi data perjanjian kredit dari penyedia fintech untuk memperluas visibilitas atas aktivitas pinjaman fintech nasabah.',
      en: 'A vertical bureau that centralises and standardises credit agreement data from fintech providers to widen visibility of customers’ fintech borrowing.',
    },
    features: SELF_SERVICE_FEATURES,
    suitableFor: {
      id: ['Bank', 'Fintech', 'P2P Lending', 'Digital Lender'],
      en: ['Bank', 'Fintech', 'P2P Lending', 'Digital Lenders'],
    },
    useCases: {
      id: ['Credit assessment', 'Evaluasi eksposur fintech', 'Screening nasabah', 'Analisis risiko kredit'],
      en: ['Credit assessment', 'Fintech exposure evaluation', 'Customer screening', 'Credit risk analysis'],
    },
  },
  {
    name: 'Generic CB Score (CBG)',
    category: 'credit-scoring',
    status: 'live',
    isNew: false,
    short: {
      id: 'Ubah perilaku kredit menjadi gambaran risiko yang konsisten.',
      en: 'Turn credit behaviour into a consistent picture of risk.',
    },
    description: {
      id: 'Risk score terstandardisasi berbasis data biro yang dikembangkan pada populasi kredit Indonesia untuk mendukung keputusan sepanjang credit lifecycle.',
      en: 'A standardised bureau-based risk score developed on the Indonesian credit population to support decisions across the credit lifecycle.',
    },
    features: {
      id: ['Populasi biro besar', 'Penilaian risiko perilaku', 'Ukuran risiko terstandardisasi', 'Dapat digunakan sepanjang lifecycle'],
      en: ['Large bureau population', 'Behavioural risk assessment', 'Standardised risk measure', 'Usable across the lifecycle'],
    },
    suitableFor: BANK_MF_FINTECH_DL,
    useCases: {
      id: ['Underwriting', 'Segmentasi risiko', 'Early warning', 'Pengelolaan limit kredit'],
      en: ['Underwriting', 'Risk segmentation', 'Early warning', 'Credit limit management'],
    },
  },
  {
    name: 'CLIK SKAI Score',
    category: 'credit-scoring',
    status: 'live',
    isNew: true,
    short: {
      id: 'Penilaian risiko yang lebih tepat untuk kredit bernilai kecil dan berjangka pendek.',
      en: 'More accurate risk assessment for small, short-term credit.',
    },
    description: {
      id: 'Score khusus untuk BNPL dan kredit tenor pendek yang dirancang sesuai karakter risiko pinjaman bernilai kecil dengan teknik machine learning dan variabel biro.',
      en: 'A dedicated score for BNPL and short-tenor credit, designed around the risk profile of small loans using machine learning techniques and bureau variables.',
    },
    features: {
      id: ['Fokus short-term & BNPL', 'Kredit bernilai kecil', 'Advanced ML', '1.000+ variabel', 'Intelligence berbasis data biro'],
      en: ['Short-term & BNPL focus', 'Small-value credit', 'Advanced ML', '1,000+ variables', 'Bureau-data intelligence'],
    },
    suitableFor: {
      id: ['Fintech', 'BNPL', 'P2P Lending', 'Digital Lender'],
      en: ['Fintech', 'BNPL', 'P2P Lending', 'Digital Lenders'],
    },
    useCases: {
      id: ['Underwriting BNPL', 'Penilaian kredit jangka pendek', 'Segmentasi risiko', 'Dukungan keputusan kredit'],
      en: ['BNPL underwriting', 'Short-term credit assessment', 'Risk segmentation', 'Credit decision support'],
    },
  },
  {
    name: 'CLIK Spectrum Score (CSS)',
    category: 'credit-scoring',
    status: 'live',
    isNew: true,
    short: {
      id: 'Gabungkan sinyal biro dan telco untuk visibilitas risiko yang lebih luas.',
      en: 'Combine bureau and telco signals for wider risk visibility.',
    },
    description: {
      id: 'Hybrid score yang menggabungkan Credit Bureau Score dengan data perilaku telco untuk memperkuat penilaian pada nasabah no-hit, thin-file, dan medium-risk.',
      en: 'A hybrid score that combines the Credit Bureau Score with telco behaviour data to strengthen assessment of no-hit, thin-file and medium-risk customers.',
    },
    features: {
      id: ['Data biro + telco', 'Dukungan thin-file', 'Dukungan no-hit', 'CSH API', 'Optimasi medium-risk'],
      en: ['Bureau + telco data', 'Thin-file support', 'No-hit support', 'CSH API', 'Medium-risk optimisation'],
    },
    suitableFor: BANK_MF_FINTECH_DL,
    useCases: {
      id: ['Underwriting thin-file', 'Penilaian no-hit', 'Penyempurnaan risiko', 'Digital lending'],
      en: ['Thin-file underwriting', 'No-hit assessment', 'Risk refinement', 'Digital lending'],
    },
  },
  {
    name: 'Fintech CB Score',
    category: 'credit-scoring',
    status: 'live',
    isNew: false,
    short: {
      id: 'Credit risk intelligence yang dirancang untuk digital lending.',
      en: 'Credit risk intelligence designed for digital lending.',
    },
    description: {
      id: 'Score berbasis data biro yang dikembangkan untuk portofolio P2P dan BNPL guna mendukung penilaian risiko dalam proses kredit digital yang cepat.',
      en: 'A bureau-based score developed for P2P and BNPL portfolios to support risk assessment in fast digital credit processes.',
    },
    features: {
      id: ['Fokus P2P & BNPL', 'Scoring berbasis data biro', 'Risk ranking', 'Populasi pengembangan besar'],
      en: ['P2P & BNPL focus', 'Bureau-data scoring', 'Risk ranking', 'Large development population'],
    },
    suitableFor: {
      id: ['Fintech', 'P2P Lending', 'BNPL', 'Digital Lender'],
      en: ['Fintech', 'P2P Lending', 'BNPL', 'Digital Lenders'],
    },
    useCases: {
      id: ['Digital underwriting', 'Screening pemohon', 'Segmentasi risiko', 'Dukungan keputusan kredit'],
      en: ['Digital underwriting', 'Applicant screening', 'Risk segmentation', 'Credit decision support'],
    },
  },
  {
    name: 'Score Factor',
    category: 'credit-scoring',
    status: 'live',
    isNew: false,
    short: {
      id: 'Pahami faktor yang membentuk setiap credit score.',
      en: 'Understand the factors behind every credit score.',
    },
    description: {
      id: 'Layanan penjelasan score yang menunjukkan faktor utama yang memengaruhi CB Score subjek untuk mendukung penilaian kredit yang transparan.',
      en: 'A score explanation service showing the main factors that affect a subject’s CB Score, supporting transparent credit assessment.',
    },
    features: {
      id: ['Faktor pembentuk score', 'Indikator perilaku', 'Penjelasan faktor risiko', 'Interpretasi score'],
      en: ['Score drivers', 'Behavioural indicators', 'Risk factor explanation', 'Score interpretation'],
    },
    suitableFor: BANK_MF_FINTECH_DL,
    useCases: {
      id: ['Analisis kredit', 'Interpretasi score', 'Dukungan underwriting', 'Evaluasi risiko'],
      en: ['Credit analysis', 'Score interpretation', 'Underwriting support', 'Risk evaluation'],
    },
  },
  {
    name: 'Application Score',
    category: 'credit-scoring',
    status: 'live',
    isNew: false,
    short: {
      id: 'Nilai risiko calon nasabah sejak tahap pengajuan.',
      en: 'Assess an applicant’s risk from the application stage.',
    },
    description: {
      id: 'Solusi application scoring ter-host yang menggabungkan data biro dan data aplikasi untuk menghasilkan risk score dan mendukung rekomendasi approval.',
      en: 'A hosted application scoring solution that combines bureau and application data to produce a risk score and support approval recommendations.',
    },
    features: {
      id: ['Data aplikasi + biro', 'Hosted scoring', 'Dukungan rekomendasi approval', 'Risk score'],
      en: ['Application + bureau data', 'Hosted scoring', 'Approval recommendation support', 'Risk score'],
    },
    suitableFor: BANK_MF_FINTECH_DL,
    useCases: {
      id: ['Screening aplikasi', 'Underwriting', 'Strategi approval', 'Risk-based decisioning'],
      en: ['Application screening', 'Underwriting', 'Approval strategy', 'Risk-based decisioning'],
    },
  },

  /* ---------------- Analytics ---------------- */
  {
    name: 'Scoremart',
    category: 'analytics',
    status: 'live',
    isNew: true,
    short: {
      id: 'Eksplorasi, bandingkan, dan pahami performa score di tingkat portofolio.',
      en: 'Explore, compare and understand score performance at portfolio level.',
    },
    description: {
      id: 'Portal berbasis DWH untuk scoring analytics yang memberikan visibilitas atas distribusi score dan benchmarking untuk analisis tingkat portofolio.',
      en: 'A DWH-based portal for scoring analytics, giving visibility of score distribution and benchmarking for portfolio-level analysis.',
    },
    features: {
      id: ['Analisis distribusi score', 'Score benchmarking', 'Portal berbasis DWH', 'Insight tingkat portofolio'],
      en: ['Score distribution analysis', 'Score benchmarking', 'DWH-based portal', 'Portfolio-level insight'],
    },
    suitableFor: {
      id: ['Bank', 'Multifinance', 'Fintech', 'Tim Risk & Analytics'],
      en: ['Bank', 'Multifinance', 'Fintech', 'Risk & Analytics Teams'],
    },
    useCases: {
      id: ['Benchmarking risiko', 'Analisis score', 'Evaluasi portofolio', 'Kalibrasi kebijakan'],
      en: ['Risk benchmarking', 'Score analysis', 'Portfolio evaluation', 'Policy calibration'],
    },
  },
  {
    name: 'Portfolio Risk Insight (PRI / InsightCollect)',
    category: 'analytics',
    status: 'live',
    isNew: false,
    short: {
      id: 'Ubah perilaku kredit di biro menjadi prioritas collection yang actionable.',
      en: 'Turn bureau credit behaviour into actionable collection priorities.',
    },
    description: {
      id: 'Risk categorization engine berbasis data biro yang memberikan risk tier R1-R7, behavioral drivers, dan rekomendasi tindakan collection.',
      en: 'A bureau-based risk categorisation engine that provides R1–R7 risk tiers, behavioural drivers and recommended collection actions.',
    },
    features: {
      id: ['Risk tier R1-R7', 'Behavioral key drivers', 'Rekomendasi tindakan collection', 'Output batch monitoring'],
      en: ['R1-R7 risk tiers', 'Behavioural key drivers', 'Recommended collection actions', 'Batch monitoring output'],
    },
    suitableFor: BANK_MF_FINTECH_DL,
    useCases: {
      id: ['Prioritas collection', 'Early intervention', 'Segmentasi nasabah', 'Strategi collection'],
      en: ['Collection prioritisation', 'Early intervention', 'Customer segmentation', 'Collection strategy'],
    },
  },
  {
    name: 'Custom Industry Reports',
    category: 'analytics',
    status: 'live',
    isNew: false,
    short: {
      id: 'Dapatkan insight pasar dan portofolio yang disesuaikan dengan pertanyaan bisnis Anda.',
      en: 'Get market and portfolio insight tailored to your business questions.',
    },
    description: {
      id: 'Analisis khusus berbasis data biro yang mencakup benchmarking dan market research untuk membantu institusi memahami performa portofolio, tren industri, dan peluang kompetitif.',
      en: 'Bespoke bureau-based analysis covering benchmarking and market research, helping institutions understand portfolio performance, industry trends and competitive opportunities.',
    },
    features: {
      id: ['Benchmark report', 'Market research', 'Perbandingan peer', 'Tren industri', 'Analisis khusus'],
      en: ['Benchmark report', 'Market research', 'Peer comparison', 'Industry trends', 'Bespoke analysis'],
    },
    suitableFor: {
      id: ['Bank', 'Multifinance', 'Fintech', 'Tim Strategy & Analytics'],
      en: ['Bank', 'Multifinance', 'Fintech', 'Strategy & Analytics Teams'],
    },
    useCases: {
      id: ['Market research', 'Industry benchmarking', 'Analisis portofolio', 'Perencanaan bisnis'],
      en: ['Market research', 'Industry benchmarking', 'Portfolio analysis', 'Business planning'],
    },
  },

  /* ---------------- Decisioning ---------------- */
  {
    name: 'Credit Policy / Simple Decision',
    category: 'decisioning',
    status: 'ready_to_sell',
    isNew: false,
    short: {
      id: 'Ubah kebijakan kredit menjadi keputusan yang lebih cepat dan konsisten.',
      en: 'Turn credit policy into faster, more consistent decisions.',
    },
    description: {
      id: 'Decisioning engine berbasis rules yang dapat dikonfigurasi dan di-host di CSH untuk mengotomatisasi kebijakan kredit klien serta menghasilkan keputusan secara real-time.',
      en: 'A configurable rules-based decisioning engine hosted on CSH that automates the client’s credit policy and returns decisions in real time.',
    },
    features: {
      id: ['Rules yang dapat dikonfigurasi', 'Output real-time', 'Logika keputusan konsisten', 'Otomasi kebijakan kredit', 'Hosting CSH'],
      en: ['Configurable rules', 'Real-time output', 'Consistent decision logic', 'Credit policy automation', 'CSH hosting'],
    },
    suitableFor: BANK_MF_FINTECH_DL,
    useCases: {
      id: ['Aturan approval otomatis', 'Eksekusi kebijakan underwriting', 'Risk-based decisioning', 'Standardisasi proses'],
      en: ['Automated approval rules', 'Underwriting policy execution', 'Risk-based decisioning', 'Process standardisation'],
    },
  },
  {
    name: 'Application Score Hosting',
    category: 'decisioning',
    status: 'ready_to_sell',
    isNew: false,
    short: {
      id: 'Implementasikan scoring model Anda dengan data biro terkini dalam satu workflow',
      en: 'Run your scoring model on current bureau data in a single workflow',
    },
    description: {
      id: 'Layanan hosting CSH yang aman untuk proprietary scoring model, menggabungkan model klien dengan data biro terkini melalui satu API call.',
      en: 'A secure CSH hosting service for proprietary scoring models, combining the client’s model with current bureau data in a single API call.',
    },
    features: {
      id: ['Model hosting', 'Data biro terkini', 'Single API call', 'Dukungan integrasi', 'Environment CSH aman'],
      en: ['Model hosting', 'Current bureau data', 'Single API call', 'Integration support', 'Secure CSH environment'],
    },
    suitableFor: {
      id: ['Bank', 'Multifinance', 'Fintech', 'Tim Risk & Data'],
      en: ['Bank', 'Multifinance', 'Fintech', 'Risk & Data Teams'],
    },
    useCases: {
      id: ['Application scoring', 'Deployment model', 'Automated underwriting', 'Integrasi workflow keputusan'],
      en: ['Application scoring', 'Model deployment', 'Automated underwriting', 'Decision workflow integration'],
    },
  },
  {
    name: 'Data Connectivity & Orchestration',
    category: 'decisioning',
    status: 'ready_to_sell',
    isNew: false,
    short: {
      id: 'Hubungkan berbagai sumber data melalui satu workflow yang lebih sederhana.',
      en: 'Connect multiple data sources through one simpler workflow.',
    },
    description: SELF_SERVICE_DESC,
    features: SELF_SERVICE_FEATURES,
    suitableFor: SELF_SERVICE_SUITABLE,
    useCases: SELF_SERVICE_USES,
  },
  {
    name: 'Sandbox',
    category: 'decisioning',
    status: 'ready_to_sell',
    isNew: true,
    short: {
      id: 'Uji, validasi, dan integrasikan sebelum go-live.',
      en: 'Test, validate and integrate before go-live.',
    },
    description: SELF_SERVICE_DESC,
    features: SELF_SERVICE_FEATURES,
    suitableFor: SELF_SERVICE_SUITABLE,
    useCases: SELF_SERVICE_USES,
  },

  /* ---------------- Business Intelligence ---------------- */
  {
    name: 'Dashboard',
    category: 'business-intelligence',
    status: 'live',
    isNew: false,
    short: {
      id: 'Lihat pasar, portofolio, dan tren yang membentuk keduanya.',
      en: 'See the market, your portfolio, and the trends shaping both.',
    },
    description: MARKET_INTEL_DESC,
    features: MARKET_INTEL_FEATURES,
    suitableFor: MARKET_INTEL_SUITABLE,
    useCases: MARKET_INTEL_USES,
  },
  {
    name: 'General Dashboard',
    category: 'business-intelligence',
    status: 'ready_to_sell',
    isNew: false,
    short: {
      id: 'Eksplorasi pasar kredit melalui satu dashboard self-service.',
      en: 'Explore the credit market through one self-service dashboard.',
    },
    description: SELF_SERVICE_DESC,
    features: SELF_SERVICE_FEATURES,
    suitableFor: SELF_SERVICE_SUITABLE,
    useCases: SELF_SERVICE_USES,
  },
  {
    name: 'Credit Card Static Report',
    category: 'business-intelligence',
    status: 'ready_to_sell',
    isNew: false,
    short: {
      id: 'Bandingkan performa kartu kredit dengan gambaran industri yang lebih terarah.',
      en: 'Compare credit card performance against a focused industry view.',
    },
    description: {
      id: 'Laporan statis terkurasi yang membandingkan penerbit kartu kredit dengan industri melalui indikator market share, growth, delinquency, vintage, dan risiko regional.',
      en: 'A curated static report comparing a credit card issuer with the industry on market share, growth, delinquency, vintage and regional risk indicators.',
    },
    features: {
      id: ['Benchmark You vs Industry', '17 bagian laporan', 'Update kuartalan', 'Tanpa filter interaktif', 'Output PDF/Excel'],
      en: ['You vs Industry benchmark', '17 report sections', 'Quarterly updates', 'No interactive filters', 'PDF/Excel output'],
    },
    suitableFor: {
      id: ['Penerbit Kartu Kredit', 'Bank', 'Tim Portfolio & Strategy'],
      en: ['Credit Card Issuers', 'Bank', 'Portfolio & Strategy Teams'],
    },
    useCases: {
      id: ['Evaluasi portofolio', 'Benchmarking industri', 'Analisis performa', 'Perencanaan strategis'],
      en: ['Portfolio evaluation', 'Industry benchmarking', 'Performance analysis', 'Strategic planning'],
    },
  },
  {
    name: 'Credit Card Interactive Report',
    category: 'business-intelligence',
    status: 'ready_to_sell',
    isNew: false,
    short: {
      id: 'Bandingkan portofolio kartu kredit Anda dengan insight peer yang lebih mendalam.',
      en: 'Compare your credit card portfolio with deeper peer insight.',
    },
    description: {
      id: 'Dashboard web interaktif untuk analytics kartu kredit yang memungkinkan institusi membandingkan performa dengan peer terpilih yang dimasking dan mengeksplorasi hasil dengan filter mandiri.',
      en: 'An interactive web dashboard for credit card analytics that lets institutions compare performance with selected masked peers and explore the results with self-service filters.',
    },
    features: {
      id: ['Benchmark You vs Industry', '10 modul', 'Filter mandiri', 'Export PDF/Excel', 'Perbandingan peer yang dimasking'],
      en: ['You vs Industry benchmark', '10 modules', 'Self-service filters', 'PDF/Excel export', 'Masked peer comparison'],
    },
    suitableFor: {
      id: ['Penerbit Kartu Kredit', 'Bank', 'Tim Portfolio & Strategy'],
      en: ['Credit Card Issuers', 'Bank', 'Portfolio & Strategy Teams'],
    },
    useCases: {
      id: ['Benchmarking portofolio', 'Analisis peer', 'Analisis pasar kartu kredit', 'Monitoring performa'],
      en: ['Portfolio benchmarking', 'Peer analysis', 'Credit card market analysis', 'Performance monitoring'],
    },
  },
  {
    name: 'Portfolio Alert',
    category: 'business-intelligence',
    status: 'live',
    isNew: false,
    short: {
      id: 'Ketahui saat kondisi kredit nasabah Anda berubah.',
      en: 'Know when your customers’ credit situation changes.',
    },
    description: MARKET_INTEL_DESC,
    features: MARKET_INTEL_FEATURES,
    suitableFor: MARKET_INTEL_SUITABLE,
    useCases: MARKET_INTEL_USES,
  },

  /* ---------------- Consulting ---------------- */
  {
    name: 'POC / Trial & Retro Analysis',
    category: 'consulting',
    status: 'ready_to_sell',
    isNew: true,
    short: {
      id: 'Buktikan value produk pada portofolio Anda sebelum implementasi penuh.',
      en: 'Prove a product’s value on your portfolio before full implementation.',
    },
    description: {
      id: 'Layanan proof-of-concept yang menggunakan data klien atau data biro anonim untuk memvalidasi performa produk dan score sebelum implementasi komersial.',
      en: 'A proof-of-concept service using client data or anonymised bureau data to validate product and score performance before commercial implementation.',
    },
    features: {
      id: ['POC engagement', 'Retro analysis', 'Validasi score', 'Evaluasi berbasis bukti', 'Testing data klien'],
      en: ['POC engagement', 'Retro analysis', 'Score validation', 'Evidence-based evaluation', 'Client data testing'],
    },
    suitableFor: {
      id: ['Calon Klien', 'Tim Risk', 'Tim Analytics', 'Product Owner'],
      en: ['Prospective Clients', 'Risk Teams', 'Analytics Teams', 'Product Owners'],
    },
    useCases: {
      id: ['Validasi score', 'Pengujian business case', 'Evaluasi pra-kontrak', 'Product trial'],
      en: ['Score validation', 'Business case testing', 'Pre-contract evaluation', 'Product trial'],
    },
  },
  {
    name: 'Portfolio Management / Cross-Sell / Stress Test',
    category: 'consulting',
    status: 'ready_to_sell',
    isNew: true,
    short: {
      id: 'Ubah data portofolio menjadi aksi growth dan risk yang praktis.',
      en: 'Turn portfolio data into practical growth and risk actions.',
    },
    description: {
      id: 'Engagement analytics yang menggunakan data portofolio klien dan parameter biro untuk mengidentifikasi peluang cross-sell, menilai concentration risk, melakukan stress simulation, dan meningkatkan proses underwriting.',
      en: 'An analytics engagement that uses the client’s portfolio data and bureau parameters to identify cross-sell opportunities, assess concentration risk, run stress simulations and improve underwriting.',
    },
    features: {
      id: ['Portfolio analytics', 'Analisis cross-sell', 'Concentration risk', 'Stress testing', 'Peningkatan underwriting'],
      en: ['Portfolio analytics', 'Cross-sell analysis', 'Concentration risk', 'Stress testing', 'Underwriting improvement'],
    },
    suitableFor: {
      id: ['Bank', 'Multifinance', 'Fintech', 'Tim Risk & Analytics'],
      en: ['Bank', 'Multifinance', 'Fintech', 'Risk & Analytics Teams'],
    },
    useCases: {
      id: ['Optimasi portofolio', 'Strategi cross-sell', 'Stress testing', 'Penyempurnaan risk policy'],
      en: ['Portfolio optimisation', 'Cross-sell strategy', 'Stress testing', 'Risk policy refinement'],
    },
  },
  {
    name: 'Custom Score Development',
    category: 'consulting',
    status: 'ready_to_sell',
    isNew: true,
    short: {
      id: 'Bangun scoring model sesuai karakter portofolio dan kebutuhan bisnis Anda.',
      en: 'Build a scoring model that fits your portfolio and business needs.',
    },
    description: {
      id: 'Pengembangan end-to-end scoring model khusus untuk portofolio, produk, atau segmen nasabah tertentu dengan memanfaatkan keahlian modelling CRIF dan data biro CLIK.',
      en: 'End-to-end development of a bespoke scoring model for a specific portfolio, product or customer segment, drawing on CRIF’s modelling expertise and CLIK bureau data.',
    },
    features: {
      id: ['Pengembangan model khusus', 'Framework monitoring', 'Validasi model', 'Data biro', 'Dokumentasi'],
      en: ['Bespoke model development', 'Monitoring framework', 'Model validation', 'Bureau data', 'Documentation'],
    },
    suitableFor: {
      id: ['Bank', 'Multifinance', 'Fintech', 'Portofolio kredit khusus'],
      en: ['Bank', 'Multifinance', 'Fintech', 'Specialised credit portfolios'],
    },
    useCases: {
      id: ['Scoring khusus portofolio', 'Underwriting produk baru', 'Pengembangan ulang model', 'Segmentasi risiko'],
      en: ['Portfolio-specific scoring', 'New product underwriting', 'Model redevelopment', 'Risk segmentation'],
    },
  },
  {
    name: 'Solutions in Partnership with CRIF',
    category: 'consulting',
    status: 'ready_to_sell',
    isNew: true,
    short: {
      id: 'Akses kapabilitas global CRIF melalui kemitraan lokal bersama CLIK.',
      en: 'Access CRIF’s global capabilities through a local partnership with CLIK.',
    },
    description: {
      id: 'Akses ke solusi global CRIF terpilih yang belum dikembangkan secara lokal, disediakan melalui CLIK dan disesuaikan dengan kebutuhan bisnis di Indonesia.',
      en: 'Access to selected CRIF global solutions not yet developed locally, provided through CLIK and adapted to business needs in Indonesia.',
    },
    features: {
      id: ['Portofolio global CRIF', 'Specialized scoring', 'Data management', 'Decisioning', 'Dukungan implementasi lokal'],
      en: ['CRIF global portfolio', 'Specialised scoring', 'Data management', 'Decisioning', 'Local implementation support'],
    },
    suitableFor: {
      id: ['Institusi Keuangan', 'Perusahaan', 'Kebutuhan bisnis khusus'],
      en: ['Financial Institutions', 'Companies', 'Specialised business needs'],
    },
    useCases: {
      id: ['Specialized scoring', 'Decisioning', 'Data management', 'Solusi advanced analytics'],
      en: ['Specialised scoring', 'Decisioning', 'Data management', 'Advanced analytics solutions'],
    },
  },
]
