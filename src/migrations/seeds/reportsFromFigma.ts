import type { Payload, PayloadRequest } from 'payload'

/**
 * Sample Laporan content copied from Figma (709:3673 annual report,
 * 716:3800 business development report, 724:3551 list cards).
 *
 * Every report touched here is already flagged `isSample`; the figures in the
 * financial tables are the design's sample numbers, not audited statements.
 * Replace them in the admin before launch. Reports that do not exist (for
 * example on a fresh database) are skipped, so this is safe to replay.
 */

type Pair = { id: string; en: string }

/* ---- minimal Lexical builders ---- */
const text = (value: string) => ({
  type: 'text',
  text: value,
  format: 0,
  detail: 0,
  mode: 'normal',
  style: '',
  version: 1,
})
const block = (type: string, children: unknown[], extra: Record<string, unknown> = {}) => ({
  type,
  format: '',
  indent: 0,
  version: 1,
  direction: 'ltr',
  children,
  ...extra,
})
/** One paragraph; several lines join with line breaks (no blank line between). */
const p = (...lines: string[]) =>
  block(
    'paragraph',
    lines.flatMap((line, index) =>
      index === 0 ? [text(line)] : [{ type: 'linebreak', version: 1 }, text(line)],
    ),
    { textFormat: 0, textStyle: '' },
  )
const h2 = (value: string) => block('heading', [text(value)], { tag: 'h2' })
const ol = (items: string[]) =>
  block(
    'list',
    items.map((item, index) => block('listitem', [text(item)], { value: index + 1 })),
    { listType: 'number', tag: 'ol', start: 1 },
  )
const root = (children: unknown[]) => ({ root: block('root', children) })

/* ---- content ---- */

const annualExcerpt = (year: number): Pair => ({
  id: `Laporan pengembangan bisnis dan manajemen sepanjang tahun ${year}, perusahaan terus memperkuat komitmen dalam menghadirkan inovasi dan solusi berbasis data...`,
  en: `Business development and management report: throughout ${year}, the company continued to strengthen its commitment to delivering data-driven innovation and solutions...`,
})

const annualTitle = (year: number): Pair => ({
  id: `Laporan Tahunan ${year}: Pengungkapan Kondisi Keuangan dan Non Keuangan`,
  en: `Annual Report ${year}: Disclosure of Financial and Non-Financial Condition`,
})

const annual2025Body = {
  id: root([
    h2('Laporan Pengembangan Bisnis dan Manajemen'),
    p(
      'Sepanjang tahun 2025, perusahaan terus memperkuat komitmen dalam menghadirkan inovasi dan solusi berbasis data untuk mendukung kebutuhan industri jasa keuangan. Berbagai pengembangan produk dan kapabilitas baru berhasil diluncurkan sebagai bagian dari upaya perusahaan dalam meningkatkan nilai tambah bagi para mitra dan pengguna layanan.',
      'Salah satu pencapaian penting di tahun 2025 adalah pengembangan dashboard kartu kredit yang dikembangkan bersama Asosiasi Kartu Kredit Indonesia (AKKI) guna mendukung kebutuhan monitoring dan analisis yang lebih komprehensif. Selain itu, perusahaan juga meluncurkan dashboard general berbasis Tableau yang dapat digunakan untuk berbagai jenis produk dan kebutuhan analitik secara lebih fleksibel dan interaktif.',
      'Perusahaan turut memperkenalkan Sandbox Environment sebagai sarana pengembangan statistik dan analytics yang memungkinkan proses eksplorasi data dan pengembangan model dilakukan secara lebih optimal. Di sisi manajemen risiko, perusahaan menghadirkan Portfolio Risk Insight yang dirancang untuk membantu proses profiling risiko serta mendukung mitigasi potensi isu pada aktivitas collection.',
      'Berbagai pengembangan tersebut mencerminkan langkah perusahaan dalam memperkuat kapabilitas digital, memperluas layanan berbasis insight, serta mendukung pengambilan keputusan yang lebih cepat dan tepat bagi para mitra bisnis.',
    ),
    h2('Pemanfaatan Tenaga Kerja'),
    p(
      'Sepanjang tahun 2025, Perusahaan memfokuskan pada peningkatan dan pengembangan sumber daya manusia, dalam rangka meningkatkan kualitas layanan yang lebih baik.',
    ),
    h2('Penerapan Tata Kelola'),
    p(
      "CLIK tetap teguh dalam menjunjung tinggi prinsip-prinsip tata kelola yang baik, dengan mengutamakan transparansi, akuntabilitas, dan keadilan. Pada tahun 2025, CLIK telah melakukan perubahan Governance Structure menjadi lebih baik untuk mendukung perkembangan bisnis yang lebih progresif dan bertanggung jawab. Secara keseluruhan, CLIK telah berhasil meraih peringkat 'Sangat Baik' dalam skala penilaian mandiri GCG.",
    ),
    h2('Financial Report'),
  ]),
  en: root([
    h2('Business Development and Management Report'),
    p(
      'Throughout 2025, the company continued to strengthen its commitment to delivering data-driven innovation and solutions that support the needs of the financial services industry. A range of new products and capabilities was launched as part of the company’s effort to add value for its partners and service users.',
      'One of the key achievements of 2025 was a credit card dashboard developed together with the Indonesian Credit Card Association (AKKI) to support more comprehensive monitoring and analysis. The company also launched a general Tableau-based dashboard that can be used flexibly and interactively across product types and analytics needs.',
      'The company also introduced a Sandbox Environment for statistics and analytics development, allowing data exploration and model development to be carried out more effectively. On the risk management side, the company introduced Portfolio Risk Insight, designed to help with risk profiling and to support the mitigation of potential issues in collection activities.',
      'These developments reflect the company’s steps to strengthen its digital capabilities, broaden its insight-based services and support faster, better-informed decisions for its business partners.',
    ),
    h2('Workforce Utilisation'),
    p(
      'Throughout 2025, the Company focused on improving and developing its human resources in order to deliver better service quality.',
    ),
    h2('Implementation of Governance'),
    p(
      "CLIK remains firmly committed to the principles of good governance, putting transparency, accountability and fairness first. In 2025, CLIK improved its Governance Structure to support more progressive and responsible business growth. Overall, CLIK achieved a 'Very Good' rating on the GCG self-assessment scale.",
    ),
    h2('Financial Report'),
  ]),
}

const businessBody = {
  id: root([
    h2('Progres Pengembangan Usaha LPIP'),
    p('2022 adalah tahun yang menantang namun bermanfaat. Sepanjang tahun CLIK dapat menikmati pertumbuhan bisnisnya yang sangat signifikan.'),
    p('Permintaan bulan ke bulan tumbuh dari ~ lebih dari 400% dari Januari hingga Desember.'),
    p('Sementara Dari perspektif pendapatan, laju pendapatan bulanan CLIK meningkat dari 300% dari Januari hingga Desember. Juni 2022 khususnya merupakan bulan di mana Perseroan akhirnya mampu menghasilkan arus kas bebas. Sehingga per Juni 2022 CLIK sudah mampu menghasilkan arus kas bebas, tidak lagi menguras ekuitasnya.'),
    p('Pertumbuhan substansial dicapai berkat pertumbuhan organik dari keduanya, jumlah anggota aktif yang menggunakan layanan CLIK, dan penggunaan bertahap yang progresif dari basis klien kami yang sudah ada.'),
    h2('Laporan Manajemen'),
    p('"Daya tarik" bisnis perusahaan yang baik tetap terkait erat dengan keunggulan layanan yang dicapai CLIK di tahun-tahun sebelumnya dan kompetensi yang dikembangkan secara progresif di setiap level organisasi. Pendekatan konsultatif CLIK kepada kliennya, tidak hanya bertindak sebagai perusahaan data tetapi sebagai perusahaan pengetahuan di bidang otomatisasi proses untuk pinjaman yang konsumtif dan produktif.'),
    p('Perusahaan terus berinvestasi dalam mengembangkan layanan dan penawaran produknya tetapi juga telah memulai, pada akhir tahun ini, tinjauan substansial terhadap struktur organisasinya yang melibatkan:'),
    ol([
      'Organisasi dan pembagian tugas dengan di CLIK',
      'Jumlah sumber daya keuangan yang dibutuhkan untuk memastikan bahwa setiap fungsi dapat berjalan secara efektif',
      'Sistem kontrol untuk memastikan proses Tata Kelola berjalan efektif.',
    ]),
    p('Memperkuat organisasi dan tata kelola perusahaan dipandang sebagai keharusan strategis untuk dapat mendukung "fase peningkatan" perusahaan yang dimulai pada tahun 2022 dan yang diperkirakan akan dipercepat oleh manajemen pada tahun 2023 dan khususnya 2024.'),
  ]),
  en: root([
    h2('LPIP Business Development Progress'),
    p('2022 was a challenging but rewarding year. Throughout the year CLIK enjoyed very significant business growth.'),
    p('Month-on-month demand grew by more than ~400% from January to December.'),
    p('From a revenue perspective, CLIK’s monthly revenue run rate rose by 300% from January to December. June 2022 in particular was the month in which the Company was finally able to generate free cash flow. As of June 2022 CLIK has been generating free cash flow and no longer draws on its equity.'),
    p('This substantial growth came from organic growth in both the number of active members using CLIK’s services and the progressive, gradual usage of our existing client base.'),
    h2('Management Report'),
    p('The company’s good business "appeal" remains closely tied to the service excellence CLIK achieved in previous years and the competencies developed progressively at every level of the organisation. CLIK takes a consultative approach with its clients, acting not only as a data company but as a knowledge company in process automation for consumer and productive lending.'),
    p('The company continues to invest in developing its services and product offering, and towards the end of the year also began a substantial review of its organisational structure, covering:'),
    ol([
      'Organisation and division of duties within CLIK',
      'The financial resources needed to ensure every function can run effectively',
      'Control systems to ensure the Governance process runs effectively.',
    ]),
    p('Strengthening the organisation and corporate governance is seen as a strategic necessity to support the company’s "scale-up phase", which began in 2022 and which management expects to accelerate in 2023 and especially 2024.'),
  ]),
}

type Row = { label: Pair; value?: string; emphasis: 'none' | 'label' | 'row'; gapBefore?: boolean }
const row = (label: Pair, value: string | undefined, emphasis: Row['emphasis'], gapBefore = false): Row => ({
  label,
  value,
  emphasis,
  gapBefore,
})

const financialTables2025: {
  intro?: Pair
  title?: Pair
  caption?: Pair
  rows: Row[]
}[] = [
  {
    intro: {
      id: 'Laporan Keuangan Posisi Keuangan 31 Desember 2025 (terlampir)\n31 Desember 2025  (Rp)',
      en: 'Statement of Financial Position as of 31 December 2025 (attached)\n31 December 2025 (Rp)',
    },
    rows: [
      row({ id: 'ASET', en: 'ASSETS' }, undefined, 'row'),
      row({ id: 'Aset Lancar', en: 'Current Assets' }, '138,809,715,957', 'row'),
      row({ id: 'Aset Tidak Lancar', en: 'Non-Current Assets' }, '9,231,119,684', 'row'),
      row({ id: 'Jumlah Aset', en: 'Total Assets' }, '148,040,835,641', 'row'),
      row({ id: 'LIABILITAS DAN EKUITAS', en: 'LIABILITIES AND EQUITY' }, undefined, 'row'),
      row({ id: 'Liabilitas', en: 'Liabilities' }, undefined, 'row'),
      row({ id: 'Liabilitas Jangka Pendek', en: 'Current Liabilities' }, '48,963,058,953', 'row'),
      row({ id: 'Liabilitas Jangka Panjang', en: 'Non-Current Liabilities' }, '1,027,856,275', 'row'),
      row({ id: 'Jumlah Liabilitas', en: 'Total Liabilities' }, '49,990,915,228', 'row'),
      row({ id: 'Jumlah Ekuitas', en: 'Total Equity' }, '98,049,920,413', 'row', true),
      row({ id: 'JUMLAH LIABILITAS DAN EKUITAS', en: 'TOTAL LIABILITIES AND EQUITY' }, '148,040,835,641', 'row'),
    ],
  },
  {
    title: { id: 'LAPORAN LABA RUGI', en: 'INCOME STATEMENT' },
    caption: { id: '31 Desember 2025 (Rp)', en: '31 December 2025 (Rp)' },
    rows: [
      row({ id: 'Pendapatan', en: 'Revenue' }, '119,210,480,436', 'label'),
      row({ id: 'Beban Usaha', en: 'Operating Expenses' }, '94,202,638,464', 'none'),
      row({ id: 'Laba/(Rugi) Usaha', en: 'Operating Profit/(Loss)' }, '25,007,841,972', 'row'),
      row({ id: 'Pendapatan Lain-lain', en: 'Other Income' }, '944,964,232', 'none'),
      row({ id: 'Laba/(Rugi) Sebelum Pajak', en: 'Profit/(Loss) Before Tax' }, '25,952,806,204', 'row'),
      row({ id: 'Pajak Penghasilan', en: 'Income Tax' }, '[5,617,943,981]', 'none'),
      row({ id: 'Laba Bersih', en: 'Net Profit' }, '20,334,862,223', 'row'),
      row(
        { id: 'Laba Komprehensif Lain untuk Tahun Berjalan', en: 'Other Comprehensive Income for the Year' },
        '339,595,823',
        'none',
      ),
      row(
        {
          id: 'Total Penghasilan Komprehensif Lain untuk Tahun Berjalan',
          en: 'Total Comprehensive Income for the Year',
        },
        '20,674,458,046',
        'row',
      ),
    ],
  },
]

type Seed = {
  slug: string
  title?: Pair
  excerpt: Pair
  body?: { id: unknown; en: unknown }
  tables?: typeof financialTables2025
}

const seeds: Seed[] = [
  { slug: 'laporan-tahunan-2025', title: annualTitle(2025), excerpt: annualExcerpt(2025), body: annual2025Body, tables: financialTables2025 },
  { slug: 'laporan-tahunan-2024', title: annualTitle(2024), excerpt: annualExcerpt(2024) },
  { slug: 'laporan-tahunan-2023', title: annualTitle(2023), excerpt: annualExcerpt(2023) },
  {
    slug: 'laporan-perkembangan-usaha',
    excerpt: {
      id: 'Proses pengembangan Usaha LPIP 2022 adalah tahun yang menantang namun bermanfaat. sepanjang tahun CLIK dapat menikmati pertumbuhan bisnisnya yang sangat...',
      en: 'LPIP business development: 2022 was a challenging but rewarding year. Throughout the year CLIK enjoyed very significant business growth...',
    },
    body: businessBody,
  },
]

// The list cards in Figma show this byline and date on every report (sample).
const SAMPLE_AUTHOR = 'Gvezenzcha'
const SAMPLE_DATE = '2026-01-23T00:00:00.000Z'

export async function seedReportsFromFigma(payload: Payload, req: PayloadRequest): Promise<void> {
  for (const seed of seeds) {
    const found = await payload.find({
      collection: 'reports',
      where: { slug: { equals: seed.slug } },
      locale: 'id',
      depth: 0,
      limit: 1,
      draft: false,
      req,
    })
    const doc = found.docs[0]
    if (!doc) {
      payload.logger.info(`seedReportsFromFigma: no report "${seed.slug}", skipped`)
      continue
    }
    if (!(doc as { isSample?: boolean }).isSample) {
      payload.logger.info(`seedReportsFromFigma: "${seed.slug}" is real content, left alone`)
      continue
    }

    for (const locale of ['id', 'en'] as const) {
      const data: Record<string, unknown> = {
        // Pinned so the slug hook never re-derives it from the new title.
        slug: seed.slug,
        author: SAMPLE_AUTHOR,
        publishDate: SAMPLE_DATE,
        excerpt: seed.excerpt[locale],
      }
      if (seed.title) data.title = seed.title[locale]
      if (seed.body) data.body = seed.body[locale]
      if (seed.tables) {
        // Row ids from the first (id) pass keep the en labels on the same rows.
        const current =
          locale === 'en'
            ? ((await payload.findByID({ collection: 'reports', id: doc.id, locale: 'id', depth: 0, req })) as {
                financialTables?: { id: string; rows?: { id: string }[] }[]
              })
            : null
        data.financialTables = seed.tables.map((table, t) => ({
          ...(current ? { id: current.financialTables?.[t]?.id } : {}),
          intro: table.intro?.[locale],
          title: table.title?.[locale],
          caption: table.caption?.[locale],
          rows: table.rows.map((r, i) => ({
            ...(current ? { id: current.financialTables?.[t]?.rows?.[i]?.id } : {}),
            label: r.label[locale],
            value: r.value,
            emphasis: r.emphasis,
            gapBefore: r.gapBefore ?? false,
          })),
        }))
      }
      await payload.update({
        collection: 'reports',
        id: doc.id,
        locale,
        data,
        req,
        context: { seed: true },
      })
    }
    payload.logger.info(`seedReportsFromFigma: updated "${seed.slug}"`)
  }
}
