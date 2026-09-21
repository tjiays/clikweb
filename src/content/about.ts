/**
 * Tentang CLIK page content (Figma 333:2672).
 *
 * Page content lives in code, not the CMS: it changes rarely and a developer
 * edits it alongside the layout. Change the wording here and redeploy.
 * Images are in public/images/about/. Indonesian copy is the Figma text
 * verbatim; where Figma itself is in English (milestones, member labels) the
 * Indonesian page keeps the English wording, as designed.
 */
import type { ProseBlock } from '@/components/ui/Prose'

type Pair = { id: string; en: string }

/**
 * "Kenali CLIK Lebih Dekat" video.
 * TODO: the company video URL has not been supplied. Until it is, the section
 * shows the Figma placeholder (grey 1000x600 box with a play icon) and is not
 * clickable. Set a YouTube/Vimeo watch URL here to make the play button link
 * to it (opens in a new tab).
 */
export const ABOUT_VIDEO_URL = ''

export const about = {
  title: { id: 'Tentang CLIK', en: 'About CLIK' },

  /* Intro band (white): text left, illustration right (577:2865). */
  intro: {
    text: {
      id: 'PT CRIF Lembaga Informasi Keuangan (CLIK) adalah Biro Kredit Swasta (PCB) terkemuka di Indonesia, berizin dan beroperasi di bawah pengawasan regulasi Otoritas Jasa Keuangan (OJK) sejak tahun 2019. Sebagai afiliasi dari CRIF S.p.A dan penyedia teknologi serta layanan terkemuka lainnya, CLIK menawarkan rangkaian solusi biro kredit yang komprehensif.',
      en: 'PT CRIF Lembaga Informasi Keuangan (CLIK) is a leading Private Credit Bureau (PCB) in Indonesia, licensed and operating under the regulatory supervision of the Financial Services Authority (OJK) since 2019. As an affiliate of CRIF S.p.A and other leading technology and service providers, CLIK offers a comprehensive range of credit bureau solutions.',
    },
    image: '/images/about/growing-in-asia.png',
  },

  /* "2,688" highlight (400:2313 – 400:2315). */
  highlight: {
    title: {
      id: '2,688 Financing And Non Financing Institutions',
      en: '2,688 Financing And Non-Financing Institutions',
    },
    lead: {
      id: 'Mendorong Keputusan Kredit yang Lebih Cerdas di Seluruh Ekosistem Keuangan Indonesia',
      en: 'Driving Smarter Credit Decisions Across Indonesia’s Financial Ecosystem',
    },
    text: {
      id: 'CLIK menyediakan solusi pelaporan kredit dan analisis berbasis data bagi 2.688 lembaga pembiayaan dan non-pembiayaan di Indonesia — mulai dari bank, perusahaan pembiayaan (multifinance), fintech lending, hingga institusi non-keuangan yang membutuhkan wawasan risiko kredit dalam operasionalnya. Dengan menghubungkan seluruh ekosistem ini, CLIK membantu industri mengambil keputusan kredit yang lebih aman, cepat, dan terukur, sekaligus menegaskan perannya sebagai penghubung data lintas sektor — tidak terbatas pada lembaga keuangan konvensional semata.',
      en: 'CLIK provides credit reporting and data-driven analytics solutions to 2,688 financing and non-financing institutions in Indonesia — from banks, finance companies (multifinance) and fintech lenders to non-financial institutions that need credit risk insight in their operations. By connecting this entire ecosystem, CLIK helps the industry make safer, faster and more measurable credit decisions, and confirms its role as a cross-sector data hub — not limited to conventional financial institutions alone.',
    },
  },

  /* Visi / Misi band (white), zig-zag rows. */
  visi: {
    title: { id: 'Visi', en: 'Vision' },
    image: '/images/about/visi-team.png',
    body: [
      {
        id: 'Menjadi biro kredit terbaik dan pilihan utama bagi semua lembaga di Indonesia — menghadirkan standar layanan dan teknologi kelas dunia yang relevan dengan kebutuhan pasar lokal.',
        en: 'To be the best credit bureau and the first choice for every institution in Indonesia — bringing world-class service and technology standards that are relevant to the needs of the local market.',
      },
      {
        type: 'ul',
        items: [
          { id: 'Biro Kredit Pilihan Utama di Indonesia', en: 'The Credit Bureau of Choice in Indonesia' },
          { id: 'Standar Layanan Kelas Dunia', en: 'World-Class Service Standards' },
        ],
      },
    ] as ProseBlock[],
  },
  misi: {
    title: { id: 'Misi', en: 'Mission' },
    image: '/images/about/misi-target.png',
    items: [
      {
        id: 'Menggunakan teknologi yang canggih dan pengalaman internasional untuk membangun ekosistem layanan biro kredit yang disesuaikan dengan pasar Indonesia.',
        en: 'Using advanced technology and international experience to build a credit bureau service ecosystem tailored to the Indonesian market.',
      },
      {
        id: 'Membantu lembaga keuangan dan non-lembaga keuangan keuangan dalam membuat keputusan manajemen risiko kredit yang efektif.',
        en: 'Helping financial and non-financial institutions make effective credit risk management decisions.',
      },
      {
        id: 'Mendukung pertumbuhan nasional yang berkelanjutan dengan memfasilitasi penetrasi dan demokratisasi di berbagai layanan.',
        en: 'Supporting sustainable national growth by facilitating penetration and democratisation across services.',
      },
    ] as Pair[],
  },

  video: {
    title: { id: 'Kenali CLIK Lebih Dekat', en: 'Get to Know CLIK' },
    url: ABOUT_VIDEO_URL,
    playLabel: { id: 'Putar video profil CLIK', en: 'Play the CLIK profile video' },
  },

  milestonesTitle: { id: 'Pencapaian Perusahaan Kami', en: 'Our Company Milestones' },

  /* Report teaser over a photo (724:3523) → Laporan Perkembangan Usaha. */
  lpip: {
    title: { id: 'Perkembangan Usaha LPIP', en: 'LPIP Business Development' },
    image: '/images/about/lpip-photo.jpg',
    paragraphs: [
      {
        id: '2022 adalah tahun yang menantang namun bermanfaat. Sepanjang tahun CLIK dapat menikmati pertumbuhan bisnisnya yang sangat signifikan.',
        en: '2022 was a challenging but rewarding year. Throughout the year CLIK enjoyed very significant business growth.',
      },
      {
        id: 'Permintaan bulan ke bulan tumbuh dari ~ lebih dari 400% dari Januari hingga Desember.',
        en: 'Month-on-month demand grew by more than ~400% from January to December.',
      },
      {
        id: 'Sementara Dari perspektif pendapatan, laju pendapatan bulanan CLIK meningkat dari 300% dari Januari hingga Desember. Juni 2022 khususnya merupakan bulan di mana Perseroan akhirnya mampu menghasilkan arus kas bebas. Sehingga per Juni 2022 CLIK sudah mampu menghasilkan arus kas bebas, tidak lagi menguras ekuitasnya',
        en: 'From a revenue perspective, CLIK’s monthly revenue run rate rose by 300% from January to December. June 2022 in particular was the month in which the Company was finally able to generate free cash flow. As of June 2022 CLIK has been generating free cash flow and no longer draws on its equity',
      },
    ] as Pair[],
    button: { id: 'Pelajari selengkapnya', en: 'Learn more' },
    reportSlug: 'laporan-perkembangan-usaha',
  },

  /* Tentang CRIF (358:2468) + infographic strip (385:2422). */
  crif: {
    title: { id: 'Tentang CRIF', en: 'About CRIF' },
    image: '/images/about/crif-world.jpg',
    body: [
      {
        id: 'CRIF adalah perusahaan global yang bergerak di bidang biro kredit dan sistem informasi bisnis, analitik, layanan outsourcing dan pemrosesan, serta solusi digital canggih dan perbankan terbuka. Didirikan di Bologna, Italia, pada tahun 1988, saat ini CRIF telah hadir secara internasional, mencakup 37 negara di 4 benua dengan lebih dari 6.400 tenaga profesional.',
        en: 'CRIF is a global company specialising in credit bureau and business information systems, analytics, outsourcing and processing services, and advanced digital and open banking solutions. Founded in Bologna, Italy, in 1988, CRIF now has an international presence spanning 37 countries on 4 continents with more than 6,400 professionals.',
      },
      {
        id: 'CRIF bertujuan untuk menciptakan nilai bagi konsumen, bisnis, dan lembaga keuangan dengan menyediakan informasi dan solusi yang memungkinkan pengambilan keputusan yang lebih baik, meningkatkan akses terhadap kredit, dan mempercepat inovasi digital. CRIF juga menawarkan layanan pencegahan penipuan dan keamanan siber kepada konsumen dan UKM.',
        en: 'CRIF aims to create value for consumers, businesses and financial institutions by providing information and solutions that enable better decision-making, improve access to credit and accelerate digital innovation. CRIF also offers fraud prevention and cyber security services to consumers and SMEs.',
      },
      {
        type: 'ul',
        items: [
          { id: 'Beroperasi di 37 negara', en: 'Operating in 37 countries' },
          { id: '85+ anak perusahaan', en: '85+ subsidiaries' },
          { id: '6.400+ profesional yang siap melayani', en: '6,400+ professionals at your service' },
          {
            id: 'Lebih dari 10.500 lembaga keuangan, 600 perusahaan asuransi, 90.000 klien bisnis, dan 1.000.000 konsumen menggunakan layanan CRIF',
            en: 'More than 10,500 financial institutions, 600 insurance companies, 90,000 business clients and 1,000,000 consumers use CRIF services',
          },
          { id: '500+ instalasi perangkat lunak', en: '500+ software installations' },
        ],
      },
    ] as ProseBlock[],
    button: { id: 'Pelajari selengkapnya', en: 'Learn more' },
    /* The two halves of the CRIF infographic (images 62 and 63). */
    strip: [
      {
        src: '/images/about/crif-stats.jpg',
        width: 952,
        height: 451,
        alt: {
          id: 'CRIF dalam angka: 37 negara, 85+ anak perusahaan, 29 negara dengan proyek sistem pelaporan kredit, 500+ instalasi perangkat lunak, 6.400+ profesional; 10.500+ lembaga keuangan, 600 perusahaan asuransi, 90.000+ klien bisnis, 1.000.000+ konsumen',
          en: 'CRIF in numbers: 37 countries, 85+ subsidiaries, 29 countries with credit reporting system projects, 500+ software installations, 6,400+ professionals; 10,500+ financial institutions, 600 insurance companies, 90,000+ business clients, 1,000,000+ consumers',
        },
      },
      {
        src: '/images/about/crif-countries.jpg',
        width: 355,
        height: 451,
        alt: { id: 'Negara tempat CRIF beroperasi', en: 'Countries where CRIF operates' },
      },
    ],
  },

  members: {
    title: { id: 'Member CLIK', en: 'CLIK Members' },
    financial: { id: 'Financial Institutions', en: 'Financial Institutions' },
    nonFinancial: { id: 'Non-Financial Institutions', en: 'Non-Financial Institutions' },
  },
}

/**
 * Pencapaian Perusahaan Kami (356:2415). Each year is a list of lines:
 *   { text }                  black label ("New Product:")
 *   { text, tone: 'accent' }  orange line without bullet ("Member of AFPI")
 *   { text, bullet: true }    orange bulleted product line
 *   { text, accent }          label with an orange tail (2019, all 700)
 *   gapBefore                 one empty line before it (2024 "New Product:")
 * `width` fixes the text box where Figma wraps a line on purpose (2019: 122).
 * Figma writes these in English on the Indonesian page too.
 */
type MilestoneLine = {
  text: Pair
  accent?: Pair
  tone?: 'accent'
  bullet?: boolean
  strong?: boolean
  gapBefore?: boolean
}
export type Milestone = { year: number; width?: number; lines: MilestoneLine[] }

const same = (value: string): Pair => ({ id: value, en: value })
const newProduct = { text: { id: 'New Product:', en: 'New Product:' } }
const product = (name: string): MilestoneLine => ({ text: same(name), bullet: true })

export const milestones: Milestone[] = [
  {
    year: 2019,
    width: 122,
    lines: [
      {
        text: { id: 'Obtained credit bureau ', en: 'Obtained credit bureau ' },
        accent: same('licensed from OJK'),
        strong: true,
      },
    ],
  },
  {
    year: 2020,
    lines: [
      { text: same('Bureau platform go live') },
      product('Full CB Report'),
      product('CB Score'),
      product('Portfolio Alert'),
    ],
  },
  { year: 2021, lines: [newProduct, product('Slim Report')] },
  {
    year: 2022,
    lines: [
      { text: same('Member of AFPI'), tone: 'accent' },
      newProduct,
      product('Compliance Report'),
      product('Soft Pull Report'),
      product('Score Factor'),
    ],
  },
  { year: 2023, lines: [newProduct, product('CLIK_CC Board'), product('Application Score')] },
  {
    year: 2024,
    lines: [
      { text: same('Member of APPI'), tone: 'accent' },
      { text: same('Member of AFTECH'), tone: 'accent' },
      { ...newProduct, gapBefore: true },
      product('CLIK Spectrum'),
      product('CLIK SKAI'),
      product('Unified Report'),
    ],
  },
  { year: 2025, lines: [newProduct, product('CLIK Strategi Board'), product('Income Estimation*')] },
]
