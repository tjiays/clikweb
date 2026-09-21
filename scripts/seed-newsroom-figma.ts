import fs from 'fs'
import os from 'os'
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * Puts the Newsroom in exactly the state the Figma design shows, and nothing
 * else. Sources (Figma file, Page 1):
 *
 *  - Newsroom 305:1082, cards 1661:8960 / 8973 / 8997 / 8985 / 9021 / 9009,
 *    read row by row, left then right: title, byline, date, excerpt, image.
 *  - Featured News "Group 42" 1783:10696: eight titles, top to bottom. Four
 *    of them appear nowhere else in the design, so their pages carry only the
 *    title (see "Featured only" below). "Apa Itu Risiko Kredit…" is listed
 *    twice, at places 2 and 8.
 *  - Detail Berita 556:2721: the one full article (text 559:2820, line by
 *    line, with its bullet and numbered lines), its banner (image 556:2805,
 *    cropped as Figma crops it) and its three "Anda mungkin juga tertarik
 *    dengan" cards.
 *
 * Articles whose full text is not in the design have the card text as their
 * body, without the closing "...". English is a translation of the same text.
 *
 * Everything is flagged `isSample`. Any other article that is flagged
 * `isSample` is deleted; articles that are not samples are never touched.
 *
 * Images are committed in scripts/seed-assets/newsroom/ (already cropped to
 * what Figma shows) and uploaded to the Media library once; re-running finds
 * them by file name. Safe to run again and again:
 *
 *   npx payload run scripts/seed-newsroom-figma.ts
 *
 * The collection fields it relies on (banner, featuredPositions, hideFromList,
 * relatedArticles) come from migration 20260921_072117_newsroom_figma_fields,
 * so run `npm run migrate` first.
 */

const dirname = path.dirname(fileURLToPath(import.meta.url))
const ASSETS = path.resolve(dirname, 'seed-assets/newsroom')

type Block = { p: string } | { ul: string[] } | { ol: string[] }
type Loc = { id: string; en: string }

/* ---------- Lexical rich text ---------- */

const text = (t: string) => ({
  type: 'text',
  text: t,
  mode: 'normal',
  style: '',
  detail: 0,
  format: 0,
  version: 1,
})

// Figma line separators (U+2028) inside a line become a soft line break.
const inline = (t: string) =>
  t.split(' ').flatMap((part, i) => [
    ...(i > 0 ? [{ type: 'linebreak', version: 1 }] : []),
    ...(part ? [text(part)] : []),
  ])

const paragraph = (t: string) => ({
  type: 'paragraph',
  format: '',
  indent: 0,
  version: 1,
  direction: 'ltr',
  textFormat: 0,
  children: inline(t),
})

const list = (items: string[], ordered: boolean) => ({
  type: 'list',
  listType: ordered ? 'number' : 'bullet',
  tag: ordered ? 'ol' : 'ul',
  start: 1,
  format: '',
  indent: 0,
  version: 1,
  direction: 'ltr',
  children: items.map((t, i) => ({
    type: 'listitem',
    value: i + 1,
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr',
    children: inline(t),
  })),
})

const richText = (blocks: Block[]) =>
  blocks.length === 0
    ? null
    : {
        root: {
          type: 'root',
          format: '',
          indent: 0,
          version: 1,
          direction: 'ltr',
          children: blocks.map((b) =>
            'p' in b ? paragraph(b.p) : 'ul' in b ? list(b.ul, false) : list(b.ol, true),
          ),
        },
      }

const P = (p: string): Block => ({ p })

/** The card text as the body: the same words, minus the closing "...". */
const fromCard = (card: Loc): { id: Block[]; en: Block[] } => ({
  id: [P(card.id.replace(/\.\.\.$/, ''))],
  en: [P(card.en.replace(/\.\.\.$/, ''))],
})

/* ---------- Detail Berita 556:2721 — text 559:2820, verbatim ---------- */

const propensityBodyId: Block[] = [
  P("Mengapa sebagian lembaga keuangan mampu memperoleh tingkat konversi lebih tinggi, meski menjalankan kampanye\u00a0cross-sell\u00a0lebih kecil? Apakah anggaran marketing bisa difokuskan hanya kepada nasabah yang memiliki kemungkinan tinggi untuk mengambil pinjaman tanpa mengorbankan kualitas portofolio? Dan bagaimana cara mengidentifikasi nasabah yang tepat di antara jutaan pelanggan?"),
  P("Jawabannya terletak pada kemampuan memahami\u00a0borrowing intent. Banyak institusi kini memanfaatkan\u00a0propensity score\u00a0untuk mengidentifikasi nasabah yang paling berpotensi mengambil pinjaman baru, sehingga kampanye dapat dijalankan dengan lebih tepat sasaran."),
  P("Apa Itu Propensity Score?"),
  P("Propensity score adalah model prediktif yang mengukur probabilitas seorang nasabah mengambil pinjaman tanpa agunan (unsecured loan) dalam periode tertentu berdasarkan riwayat perilaku kreditnya serta pola perilaku nasabah lain yang memiliki karakteristik serupa. Berbeda dengan credit risk score yang memprediksi kemungkinan seorang nasabah membayar kembali pinjamannya, propensity score memprediksi kemungkinan seorang nasabah mengajukan pinjaman."),
  P("CLIK Propensity Score dikembangkan menggunakan data biro kredit Indonesia yang memberikan gambaran menyeluruh mengenai aktivitas kredit seseorang di seluruh ekosistem jasa keuangan, mulai dari perbankan, multifinance, Buy Now Pay Later (BNPL), hingga Peer-to-Peer (P2P) Lending. Model ini berfokus pada produk kredit tanpa agunan, seperti kartu kredit, pinjaman tunai, BNPL, dan P2P Lending. Dengan memanfaatkan data perilaku kredit lintas institusi, model mampu mengidentifikasi sinyal yang sering kali tidak terlihat apabila analisis hanya menggunakan data internal dari satu lembaga keuangan."),
  P("Secara sederhana, CLIK Propensity Score dirancang untuk menjawab satu pertanyaan penting:\u00a0“Seberapa besar kemungkinan seorang nasabah akan mengambil pinjaman tanpa agunan baru dalam 90 hari ke depan?”"),
  P("\u00a0"),
  P("Mengapa Banyak Kampanye\u00a0Cross-Sell\u00a0Tidak Efektif?"),
  P("Salah satu tantangan terbesar dalam strategi\u00a0cross-sell\u00a0adalah anggapan bahwa seluruh nasabah memiliki peluang yang sama untuk mengambil pinjaman. Padahal, permintaan kredit sebenarnya terkonsentrasi pada kelompok nasabah tertentu."),
  P("Analisis CLIK menunjukkan bahwa sekitar 70% pengambilan pinjaman tanpa agunan baru berasal dari kurang dari sepertiga populasi yang dapat dinilai (scorable population). Sebaliknya, nasabah yang tidak memiliki aktivitas kredit tanpa agunan dalam beberapa waktu terakhir cenderung memiliki kemungkinan yang jauh lebih rendah untuk mengambil pinjaman baru."),
  P("Akibatnya, banyak anggaran pemasaran terpakai untuk menjangkau nasabah yang belum memiliki kebutuhan pembiayaan, sementara nasabah yang memang sedang siap mengajukan pinjaman justru berpotensi terlewat. Dalam praktiknya, hal ini dapat menurunkan tingkat konversi sekaligus meningkatkan biaya akuisisi."),
  P("Tantangan lainnya adalah keterbatasan data internal. Aktivitas seperti membuka fasilitas BNPL menggunakan kartu kredit baru, atau mengambil pinjaman dari institusi lain sering kali menjadi sinyal bahwa kebutuhan pembiayaan sedang meningkat. Namun, informasi tersebut hanya dapat terlihat melalui data biro kredit yang mencakup seluruh ekosistem jasa keuangan."),
  P("Inilah yang membuat CLIK Propensity Score mampu mengidentifikasi peluang yang sering kali tidak terlihat oleh model yang hanya mengandalkan data internal."),
  P("\u00a0"),
  P("Apa Perbedaan\u00a0Propensity Score\u00a0dan\u00a0Credit Risk Score?"),
  P("Perbedaan keduanya terletak pada pertanyaan yang ingin dijawab."),
  { ul: [
    "Credit risk score\u00a0menjawab:\u00a0“Jika nasabah menerima pinjaman, seberapa besar kemungkinan pinjaman tersebut akan dibayar kembali?”",
    "Sementara itu,\u00a0propensity score\u00a0menjawab:“Seberapa besar kemungkinan nasabah akan mengajukan pinjaman dalam waktu dekat?”",
  ] },
  P("Dengan kata lain,\u00a0credit risk score\u00a0mengukur risiko, sedangkan\u00a0propensity score\u00a0mengukur potensi. Keduanya saling melengkapi.\u00a0Credit risk score\u00a0membantu menentukan nasabah yang layak diberikan pinjaman, sementara\u00a0propensity score\u00a0membantu mengidentifikasi nasabah yang paling mungkin merespons penawaran. Melalui kombinasi keduanya, lembaga keuangan dapat mengembangkan portofolio pinjaman secara lebih efektif tanpa mengabaikan kualitas kredit."),
  P("\u00a0"),
  P("Bagaimana Praktik Penerapan Propensity Score?"),
  P("Berikut beberapa contoh penerapan\u00a0propensity score\u00a0di industri jasa keuangan."),
  { ol: [
    "Bank yang ingin mengembangkan portofolio Kredit Tanpa Agunan (KTA).\u2028Daripada menawarkan produk kepada seluruh nasabah payroll, bank dapat menggunakan\u00a0propensity score\u00a0untuk mengidentifikasi nasabah dengan potensi tertinggi, kemudian memfokuskan kampanye telemarketing maupun digital kepada segmen tersebut. Hasilnya, jumlah nasabah yang dihubungi lebih sedikit, tingkat konversi lebih tinggi, dan biaya akuisisi per pinjaman menjadi lebih efisien.",
    "Perusahaan multifinance yang melakukan\u00a0cross-sell\u00a0pinjaman tunai.\u2028Perusahaan memiliki ribuan nasabah yang telah menyelesaikan pembiayaan kendaraan dengan riwayat pembayaran yang baik.\u00a0Propensity score\u00a0membantu mengidentifikasi nasabah yang saat ini sedang berada dalam fase membutuhkan pembiayaan, sehingga penawaran pinjaman tunai dapat diberikan pada waktu yang tepat.",
    "Platform BNPL atau P2P Lending yang ingin meningkatkan keterlibatan nasabah.",
  ] },
  P("Propensity score\u00a0membantu mengidentifikasi pengguna yang memiliki kemungkinan tinggi untuk meningkatkan penggunaan kredit tanpa agunan dalam 90 hari ke depan. Dengan demikian, platform dapat memprioritaskan penawaran kenaikan limit atau produk baru sebelum nasabah beralih ke kompetitor."),
  P("\u00a0"),
  P("Bagaimana Proses Implementasi CLIK Propensity Score?"),
  P("Penerapan\u00a0CLIK Propensity Score\u00a0cukup sederhana."),
  { ol: [
    "Mulai dari tujuan kampanye,\u00a0baik untuk\u00a0cross-sell, aktivasi kartu kredit, maupun peluncuran produk BNPL baru, tujuan kampanye akan menentukan bagaimana\u00a0propensity score",
    "CLIK melakukan\u00a0scoring\u00a0terhadap portofolio nasabah menggunakan\u00a0propensity model\u00a0berdasarkan data biro kredit terbaru.",
    "Terima hasil\u00a0scoring\u00a0berupa daftar nasabah yang diurutkan berdasarkan kemungkinan mengambil pinjaman tanpa agunan dalam tiga bulan ke depan.",
    "Terapkan kriteria internal.\u00a0Propensity score\u00a0menunjukkan siapa yang paling mungkin merespons, sementara kebijakan kredit dan\u00a0risk appetite\u00a0institusi menentukan siapa yang akan disetujui. Hasilnya adalah daftar target kampanye.",
    "Jalankan kampanye\u00a0dengan fokus kepada target yang telah diprioritaskan, lalu ukur peningkatan hasilnya dibandingkan kampanye sebelumnya.",
  ] },
  P("CLIK Propensity Score tersedia melalui batch file, API, atau kombinasi keduanya, sehingga mudah diintegrasikan dengan proses pemasaran maupun pengambilan keputusan secara\u00a0real-time."),
  P("\u00a0"),
  P("Apa yang Membuat Sebuah\u00a0Propensity Model\u00a0Efektif?"),
  P("Tidak semua\u00a0propensity model\u00a0memberikan hasil yang sama. Ada empat hal yang menjadi pembeda."),
  { ol: [
    "Berbasis perilaku, bukan asumsi\u2028Data demografis hanya menunjukkan siapa nasabah, sedangkan perilaku kredit menunjukkan apa yang benar-benar dilakukan. CLIK Propensity Score dibangun berdasarkan riwayat peminjaman dan pembayaran di seluruh ekosistem biro kredit untuk memberikan prediksi yang lebih akurat.",
    "Berfokus pada hasil yang relevan\u2028Model ini memprediksi kemungkinan nasabah mengambil pinjaman tanpa agunan dalam tiga bulan ke depan, sehingga hasilnya selaras dengan tujuan utama kampanye: mendorong realisasi pinjaman, bukan sekadar menunjukkan minat.",
    "Mudah dipahami dan dijelaskan\u2028Model yang baik harus mudah dipahami oleh berbagai pemangku kepentingan, mulai dari tim pemasaran, tim risiko, hingga manajemen. Karena menggunakan indikator perilaku yang jelas, hasil\u00a0scoring\u00a0lebih mudah diinterpretasikan dan dijadikan dasar pengambilan keputusan.",
    "Mudah diintegrasikan\u2028CLIK Propensity Score tersedia melalui batch file maupun API, sehingga dapat diintegrasikan dengan proses pemasaran dan pengambilan keputusan yang sudah berjalan.",
  ] },
  P("\u00a0"),
  P("Kesimpulan"),
  P("Di tengah persaingan industri jasa keuangan yang semakin ketat, kemampuan mengidentifikasi nasabah yang siap mengajukan pinjaman menjadi faktor penting dalam meningkatkan efektivitas kampanye. Dengan CLIK Propensity Score, lembaga keuangan dapat memprioritaskan nasabah yang memiliki potensi tertinggi untuk merespons penawaran, sehingga kampanye menjadi lebih tepat sasaran, konversi meningkat, dan pertumbuhan portofolio dapat dicapai dengan tetap menjaga kualitas kredit."),]

/* English: the same lines, translated. */
const propensityBodyEn: Block[] = [
  P('Why are some financial institutions able to achieve higher conversion rates, even while running smaller cross-sell campaigns? Can the marketing budget be focused only on customers who are highly likely to take out a loan, without sacrificing portfolio quality? And how do you identify the right customers among millions of customers?'),
  P('The answer lies in the ability to understand borrowing intent. Many institutions now use a propensity score to identify the customers most likely to take out a new loan, so that campaigns can be run in a more targeted way.'),
  P('What Is a Propensity Score?'),
  P('A propensity score is a predictive model that measures the probability of a customer taking out an unsecured loan within a given period, based on their credit behaviour history and the behaviour patterns of other customers with similar characteristics. Unlike a credit risk score, which predicts the likelihood of a customer repaying their loan, a propensity score predicts the likelihood of a customer applying for a loan.'),
  P('CLIK Propensity Score is developed using Indonesian credit bureau data, which gives a complete picture of a person’s credit activity across the entire financial services ecosystem, from banking, multifinance and Buy Now Pay Later (BNPL) to Peer-to-Peer (P2P) Lending. The model focuses on unsecured credit products, such as credit cards, cash loans, BNPL and P2P Lending. By using credit behaviour data across institutions, the model can identify signals that are often invisible when the analysis uses only the internal data of a single financial institution.'),
  P('Put simply, CLIK Propensity Score is designed to answer one important question: “How likely is a customer to take out a new unsecured loan in the next 90 days?”'),
  P(' '),
  P('Why Are So Many Cross-Sell Campaigns Ineffective?'),
  P('One of the biggest challenges in a cross-sell strategy is the assumption that all customers are equally likely to take out a loan. In reality, credit demand is concentrated in particular groups of customers.'),
  P('CLIK analysis shows that around 70% of new unsecured loans come from less than a third of the scorable population. Conversely, customers with no recent unsecured credit activity tend to be far less likely to take out a new loan.'),
  P('As a result, much of the marketing budget is spent reaching customers who do not yet need financing, while customers who are ready to apply for a loan may be missed. In practice, this can lower conversion rates while raising acquisition costs.'),
  P('Another challenge is the limits of internal data. Activities such as opening a BNPL facility using a new credit card, or taking a loan from another institution, are often signals that a financing need is growing. However, that information is only visible through credit bureau data that covers the entire financial services ecosystem.'),
  P('This is what enables CLIK Propensity Score to identify opportunities that are often invisible to models relying only on internal data.'),
  P(' '),
  P('What Is the Difference Between a Propensity Score and a Credit Risk Score?'),
  P('The difference lies in the question each one seeks to answer.'),
  {
    ul: [
      'A credit risk score answers: “If the customer receives a loan, how likely is the loan to be repaid?”',
      'Meanwhile, a propensity score answers: “How likely is the customer to apply for a loan in the near future?”',
    ],
  },
  P('In other words, a credit risk score measures risk, while a propensity score measures potential. The two complement each other. A credit risk score helps determine which customers are eligible for a loan, while a propensity score helps identify the customers most likely to respond to an offer. By combining the two, financial institutions can grow their loan portfolios more effectively without neglecting credit quality.'),
  P(' '),
  P('How Is a Propensity Score Applied in Practice?'),
  P('Here are some examples of how a propensity score is applied in the financial services industry.'),
  {
    ol: [
      'A bank that wants to grow its Unsecured Loan (KTA) portfolio. Instead of offering the product to all payroll customers, the bank can use a propensity score to identify the customers with the highest potential, then focus its telemarketing and digital campaigns on that segment. As a result, fewer customers are contacted, the conversion rate is higher, and the acquisition cost per loan becomes more efficient.',
      'A multifinance company cross-selling cash loans. The company has thousands of customers who have completed vehicle financing with a good payment history. A propensity score helps identify the customers who are currently in a phase of needing financing, so that a cash loan offer can be made at the right time.',
      'A BNPL or P2P Lending platform that wants to increase customer engagement.',
    ],
  },
  P('A propensity score helps identify users who are highly likely to increase their use of unsecured credit in the next 90 days. This way, the platform can prioritise offers of limit increases or new products before customers switch to a competitor.'),
  P(' '),
  P('How Is CLIK Propensity Score Implemented?'),
  P('Implementing CLIK Propensity Score is quite simple.'),
  {
    ol: [
      'Start from the campaign goal, whether for cross-selling, credit card activation or launching a new BNPL product; the campaign goal will determine how the propensity score',
      'CLIK scores the customer portfolio using the propensity model based on the latest credit bureau data.',
      'Receive the scoring results as a list of customers ranked by their likelihood of taking out an unsecured loan in the next three months.',
      'Apply internal criteria. The propensity score shows who is most likely to respond, while the institution’s credit policy and risk appetite determine who will be approved. The result is the campaign target list.',
      'Run the campaign focused on the prioritised targets, then measure the improvement in results compared with previous campaigns.',
    ],
  },
  P('CLIK Propensity Score is available via batch file, API, or a combination of both, so it is easy to integrate with marketing processes and real-time decision-making.'),
  P(' '),
  P('What Makes a Propensity Model Effective?'),
  P('Not every propensity model delivers the same results. Four things make the difference.'),
  {
    ol: [
      'Based on behaviour, not assumptions Demographic data only shows who the customer is, while credit behaviour shows what they actually do. CLIK Propensity Score is built on borrowing and repayment history across the entire credit bureau ecosystem to deliver more accurate predictions.',
      'Focused on relevant outcomes The model predicts the likelihood of a customer taking out an unsecured loan in the next three months, so its results are aligned with the main goal of the campaign: driving loan disbursement, not merely showing interest.',
      'Easy to understand and explain A good model must be easy to understand for a range of stakeholders, from the marketing team and the risk team to management. Because it uses clear behavioural indicators, the scoring results are easier to interpret and to use as a basis for decisions.',
      'Easy to integrate CLIK Propensity Score is available via batch file or API, so it can be integrated with existing marketing and decision-making processes.',
    ],
  },
  P(' '),
  P('Conclusion'),
  P('Amid increasingly tight competition in the financial services industry, the ability to identify customers who are ready to apply for a loan is an important factor in making campaigns more effective. With CLIK Propensity Score, financial institutions can prioritise the customers with the highest potential to respond to an offer, so that campaigns are better targeted, conversion rises, and portfolio growth can be achieved while maintaining credit quality.'),
]

/* ---------- The articles ---------- */

type Seed = {
  slug: string
  /** Noon in Jakarta (05:00 UTC), minus a minute per place, so articles on the same day keep Figma's order. */
  publishDate: string
  author: string | null
  /** File in scripts/seed-assets/newsroom/, or null when Figma shows no image. */
  cover: string | null
  banner: string | null
  featuredPositions: number[]
  hideFromList: boolean
  related: string[]
  title: Loc
  excerpt: Loc | null
  body: { id: Block[]; en: Block[] }
}

const SLUG = {
  propensity: 'temukan-nasabah-berikutnya-sebelum-kompetitor',
  creditRisk: 'apa-itu-risiko-kredit-dan-cara-menghindarinya',
  capital: '8-cara-mendapatkan-modal-usaha-minim-risiko',
  decline: 'penyebab-kredit-turun-di-indonesia',
  portfolio: 'cara-mengukur-risiko-portofolio-kredit-2026',
  umkm: 'majukan-perekonomian-nasional-clik-biro-kredit-dan-kemenkop-riset-ekosistem-pinjaman-umkm',
  crif: 'penguatan-kolaborasi-antara-clik-dan-crif-group-dalam-mengawali-tahun-2026',
  mastercard: 'mastercard-dan-clik-biro-kredit-menjalin-kerjasama',
  astra: 'workshop-clik-x-astra-integrasi-digital-strategi-manajemen-risiko',
  kk: 'apakah-skor-kredit-bi-checking-berdampak-pada-satu-kartu-keluarga',
}

/* Card texts, verbatim from the Newsroom cards (and their translation). */
const cards = {
  propensity: {
    id: 'Mengapa sebagian lembaga keuangan mampu memperoleh tingkat konversi lebih tinggi, meski menjalankan kampanye cross-sell lebih kecil? Apakah...',
    en: 'Why are some financial institutions able to achieve higher conversion rates, even while running smaller cross-sell campaigns? Can...',
  },
  creditRisk: {
    id: 'Risiko kredit merupakan salah satu aspek penting dalam dunia keuangan yang sering kali diabaikan oleh masyarakat. Padahal, memahami risiko kredit...',
    en: 'Credit risk is one of the important aspects of finance that is often overlooked by the public. Yet understanding credit risk...',
  },
  capital: {
    id: 'Memulai dan mengembangkan usaha membutuhkan modal yang tidak sedikit. Namun, memilih sumber modal yang salah justru dapat menimbulkan risiko...',
    en: 'Starting and growing a business takes considerable capital. However, choosing the wrong source of capital can actually create risks...',
  },
  decline: {
    id: 'Banyak masyarakat Indonesia merasakan bahwa pengajuan kredit baik untuk modal usaha, kendaraan, maupun kebutuhan pribadi tidak semudah sebelumnya. Penurunan...',
    en: 'Many Indonesians feel that applying for credit, whether for business capital, a vehicle or personal needs, is not as easy as it used to be. The decline...',
  },
  portfolio: {
    id: 'Mengukur risiko portofolio kredit menjadi semakin penting, karena peminjam kini memiliki aktivitas kredit di berbagai lembaga, sehingga potensi...',
    en: 'Measuring credit portfolio risk is becoming increasingly important, because borrowers now have credit activity at many institutions, so the potential...',
  },
  umkm: {
    id: 'Sebagai bagian dari upaya membangun sistem pembiayaan yang inklusif dan berkelanjutan, PT CRIF Lembaga Informasi Keuangan (CLIK Biro Kredit) terus...',
    en: 'As part of its efforts to build an inclusive and sustainable financing system, PT CRIF Lembaga Informasi Keuangan (CLIK Biro Kredit) continues...',
  },
} satisfies Record<string, Loc>

/*
 * The Home card for this article (156:1119) carries a longer cut of the same
 * text; being the most the design shows, it is the body.
 */
const creditRiskHomeCard: Loc = {
  id: 'Risiko kredit merupakan salah satu aspek penting dalam dunia keuangan yang sering kali diabaikan oleh masyarakat. Padahal, memahami risiko kredit sangat membantu dalam mengelola pinjaman, cicilan, dan kondisi keuangan agar tetap sehat. Dengan pemahaman yang tepat, Anda dapat...',
  en: 'Credit risk is one of the important aspects of finance that is often overlooked by the public. Yet understanding credit risk is a great help in managing loans, instalments and your finances so they stay healthy. With the right understanding, you can...',
}

const at = (day: string, minutesBeforeNoon: number) =>
  new Date(Date.parse(`${day}T05:00:00.000Z`) - minutesBeforeNoon * 60_000).toISOString()

const listed = (s: Omit<Seed, 'banner' | 'hideFromList' | 'related'> & Partial<Seed>): Seed => ({
  banner: null,
  hideFromList: false,
  related: [],
  ...s,
})

/*
 * Featured only: Figma gives nothing but the title in the Featured News list,
 * so there is no card, byline, image or text. publishDate is required by the
 * CMS; they take January 23, 2026, the date Figma gives every article but the
 * first. They stay off the cards, Home and the related list.
 */
const featuredOnly = (slug: string, minutes: number, position: number, title: Loc): Seed => ({
  slug,
  publishDate: at('2026-01-23', minutes),
  author: null,
  cover: null,
  banner: null,
  featuredPositions: [position],
  hideFromList: true,
  related: [],
  title,
  excerpt: null,
  body: { id: [], en: [] },
})

const seeds: Seed[] = [
  // Page 1, row 1 left — 1661:8960 (detail: 556:2721)
  listed({
    slug: SLUG.propensity,
    publishDate: at('2026-06-25', 0),
    author: 'gvezenzcha',
    cover: 'temukan-nasabah-card.png',
    banner: 'temukan-nasabah-banner.png',
    featuredPositions: [1],
    // 556:2721 "Anda mungkin juga tertarik dengan", left to right
    related: [SLUG.portfolio, SLUG.capital, SLUG.decline],
    title: {
      id: 'Temukan Nasabah Berikutnya Sebelum Kompetitor: Mengenal CLIK Propensity Score',
      // As written on the article's own artwork (image 755ebf2a…)
      en: 'Find Your Next Borrower Before Your Competitor Does: Introducing the CLIK Propensity Score',
    },
    excerpt: cards.propensity,
    body: { id: propensityBodyId, en: propensityBodyEn },
  }),
  // Row 1 right — 1661:8973
  listed({
    slug: SLUG.creditRisk,
    publishDate: at('2026-01-23', -5),
    author: 'gvezenzcha',
    cover: 'apa-itu-risiko-kredit-card.png',
    featuredPositions: [2, 8],
    title: {
      id: 'Apa Itu Risiko Kredit dan Cara Menghindarinya',
      en: 'What Is Credit Risk and How to Avoid It',
    },
    excerpt: cards.creditRisk,
    body: fromCard(creditRiskHomeCard),
  }),
  // Row 2 left — 1661:8997
  listed({
    slug: SLUG.capital,
    publishDate: at('2026-01-23', -4),
    author: 'gvezenzcha',
    cover: '8-cara-modal-usaha-card.png',
    featuredPositions: [],
    title: {
      id: '8 Cara Mendapatkan Modal Usaha yang Minim Risiko',
      en: '8 Low-Risk Ways to Get Business Capital',
    },
    excerpt: cards.capital,
    body: fromCard(cards.capital),
  }),
  // Row 2 right — 1661:8985
  listed({
    slug: SLUG.decline,
    publishDate: at('2026-01-23', -3),
    author: 'gvezenzcha',
    cover: 'penyebab-kredit-turun-card.png',
    featuredPositions: [],
    title: {
      id: 'Penyebab Kredit Turun di Indonesia',
      en: 'Why Credit Is Declining in Indonesia',
    },
    excerpt: cards.decline,
    body: fromCard(cards.decline),
  }),
  // Row 3 left — 1661:9021
  listed({
    slug: SLUG.portfolio,
    publishDate: at('2026-01-23', -2),
    author: 'gvezenzcha',
    cover: 'cara-mengukur-risiko-portofolio-card.png',
    featuredPositions: [],
    title: {
      id: 'Cara Mengukur Risiko Portofolio Kredit Secara Akurat Tahun 2026',
      en: 'How to Measure Credit Portfolio Risk Accurately in 2026',
    },
    excerpt: cards.portfolio,
    body: fromCard(cards.portfolio),
  }),
  // Row 3 right — 1661:9009
  listed({
    slug: SLUG.umkm,
    publishDate: at('2026-01-23', -1),
    author: 'gvezenzcha',
    cover: 'majukan-perekonomian-nasional-card.png',
    featuredPositions: [6],
    title: {
      id: 'Majukan Perekonomian Nasional, CLIK Biro Kredit dan Kemenkop Lakukan Riset Ekosistem Pinjaman UMKM',
      en: 'Advancing the National Economy, CLIK Biro Kredit and the Ministry of Cooperatives Research the MSME Lending Ecosystem',
    },
    excerpt: cards.umkm,
    body: fromCard(cards.umkm),
  }),
  // Featured News 1783:10696, places 3, 4, 5 and 7
  featuredOnly(SLUG.crif, 0, 3, {
    id: 'Penguatan Kolaborasi antara CLIK dan CRIF Group dalam Mengawali Tahun 2026',
    en: 'Strengthening Collaboration between CLIK and CRIF Group to Begin 2026',
  }),
  featuredOnly(SLUG.mastercard, 1, 4, {
    id: 'Mastercard dan CLIK Biro Kredit Menjalin Kerjasama untuk Membantu Pertumbuhan Lembaga Keuangan',
    en: 'Mastercard and CLIK Biro Kredit Join Forces to Help Financial Institutions Grow',
  }),
  featuredOnly(SLUG.astra, 2, 5, {
    id: 'Workshop CLIK x Astra Integrasi Digital: Strategi Manajemen Risiko Hadapi Tantangan Ekonomi 2025',
    en: 'CLIK x Astra Integrasi Digital Workshop: Risk Management Strategies for the Economic Challenges of 2025',
  }),
  featuredOnly(SLUG.kk, 3, 7, {
    id: 'Apakah Skor Kredit (BI Checking) Berdampak pada Satu Kartu Keluarga? Ini Faktanya',
    en: 'Does a Credit Score (BI Checking) Affect Everyone on the Same Family Card? Here Are the Facts',
  }),
]

/** Media files are named newsroom-<asset> in the library. */
const MEDIA_PREFIX = 'newsroom-'

/* ---------- Run ---------- */

const run = async () => {
  const payload = await getPayload({ config })
  const log = (msg: string) => payload.logger.info(`[newsroom] ${msg}`)

  // 1. Images: upload once, find by file name afterwards.
  const alt = new Map<string, Loc>()
  for (const s of seeds) {
    if (s.cover) alt.set(s.cover, s.title)
    if (s.banner) alt.set(s.banner, s.title)
  }
  const mediaIds = new Map<string, number>()
  for (const [asset, title] of alt) {
    const filename = MEDIA_PREFIX + asset
    const filePath = path.join(ASSETS, asset)
    const found = await payload.find({
      collection: 'media',
      where: { filename: { equals: filename } },
      limit: 1,
      depth: 0,
    })
    let doc = found.docs[0]
    if (!doc) {
      const tmp = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'newsroom-seed-')), filename)
      fs.copyFileSync(filePath, tmp)
      try {
        doc = await payload.create({
          collection: 'media',
          locale: 'id',
          data: { alt: title.id, isSample: true },
          filePath: tmp,
          overrideAccess: true,
        })
      } finally {
        fs.rmSync(path.dirname(tmp), { recursive: true, force: true })
      }
      log(`uploaded ${filename}`)
    } else {
      await payload.update({
        collection: 'media',
        id: doc.id,
        locale: 'id',
        data: { alt: title.id, isSample: true },
        overrideAccess: true,
      })
    }
    await payload.update({
      collection: 'media',
      id: doc.id,
      locale: 'en',
      data: { alt: title.en },
      overrideAccess: true,
    })
    mediaIds.set(asset, doc.id)
  }

  // 2. Articles, matched by slug. Relations are filled in a second pass.
  const findBySlug = async (slug: string) =>
    (
      await payload.find({
        collection: 'articles',
        where: { slug: { equals: slug } },
        locale: 'id',
        limit: 1,
        depth: 0,
        draft: true,
        overrideAccess: true,
      })
    ).docs[0]

  const ids = new Map<string, number>()
  for (const s of seeds) {
    const shared = {
      slug: s.slug,
      publishDate: s.publishDate,
      author: s.author,
      cover: s.cover ? mediaIds.get(s.cover) : null,
      banner: s.banner ? mediaIds.get(s.banner) : null,
      isFeatured: s.featuredPositions.length > 0,
      featuredPositions: s.featuredPositions,
      hideFromList: s.hideFromList,
      relatedArticles: [],
      isSample: true,
      approvalStatus: 'approved',
      _status: 'published',
    }
    const lang = (l: 'id' | 'en') => ({
      ...shared,
      title: s.title[l],
      excerpt: s.excerpt ? s.excerpt[l] : null,
      body: richText(s.body[l]),
    })
    const existing = await findBySlug(s.slug)
    const doc = existing
      ? await payload.update({
          collection: 'articles',
          id: existing.id,
          locale: 'id',
          data: lang('id') as never,
          overrideAccess: true,
        })
      : await payload.create({
          collection: 'articles',
          locale: 'id',
          data: lang('id') as never,
          overrideAccess: true,
        })
    await payload.update({
      collection: 'articles',
      id: doc.id,
      locale: 'en',
      data: lang('en') as never,
      overrideAccess: true,
    })
    ids.set(s.slug, doc.id as number)
    log(`${existing ? 'updated' : 'created'} ${s.slug}`)
  }

  for (const s of seeds) {
    if (s.related.length === 0) continue
    await payload.update({
      collection: 'articles',
      id: ids.get(s.slug)!,
      data: { relatedArticles: s.related.map((slug) => ids.get(slug)!) } as never,
      overrideAccess: true,
    })
  }

  // 3. Every other sample article goes; real articles are left alone.
  const keep = new Set(ids.values())
  const all = await payload.find({
    collection: 'articles',
    limit: 1000,
    depth: 0,
    draft: true,
    locale: 'id',
    overrideAccess: true,
  })
  for (const a of all.docs) {
    if (keep.has(a.id as number)) continue
    if (a.isSample) {
      await payload.delete({ collection: 'articles', id: a.id, overrideAccess: true })
      log(`deleted sample article ${a.id} "${a.title}"`)
    } else {
      log(`KEPT non-sample article ${a.id} "${a.title}" (not in Figma — review by hand)`)
    }
  }

  // 4. Newsroom sample images no longer used by anything are removed.
  const wanted = new Set([...mediaIds.values()])
  const stale = await payload.find({
    collection: 'media',
    where: {
      and: [{ filename: { like: MEDIA_PREFIX } }, { isSample: { equals: true } }],
    },
    limit: 1000,
    depth: 0,
    overrideAccess: true,
  })
  for (const m of stale.docs) {
    if (wanted.has(m.id as number) || !m.filename?.startsWith(MEDIA_PREFIX)) continue
    const uses = await Promise.all(
      (['articles', 'reports'] as const).map((collection) =>
        payload.count({
          collection,
          where: { or: [{ cover: { equals: m.id } }, ...(collection === 'articles' ? [{ banner: { equals: m.id } }] : [])] },
          overrideAccess: true,
        }),
      ),
    )
    if (uses.some((u) => u.totalDocs > 0)) continue
    await payload.delete({ collection: 'media', id: m.id, overrideAccess: true })
    log(`deleted unused image ${m.filename}`)
  }

  process.exit(0)
}

// Top-level await: `payload run` exits as soon as the import settles.
await run().catch((error) => {
  console.error(error)
  process.exit(1)
})
