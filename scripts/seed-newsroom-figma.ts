import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * Figma-parity sample content for the Newsroom (Figma 305:1082, 1661:8648,
 * 556:2721): adds the design's sample articles so the list fills two pages of
 * six cards, and flags eight articles as Featured News (the sidebar shows 8).
 *
 * Everything written here is marked `isSample` so the team can find and
 * replace it before launch. Safe to run repeatedly: articles are matched by
 * slug and updated in place.
 *
 *   npx payload run scripts/seed-newsroom-figma.ts
 *
 * Covers reuse the three article images already in the Media library
 * (article-7/8/9.png); nothing is uploaded.
 */

type Block = { p: string } | { ul: string[] } | { ol: string[] }
type Loc = { id: string; en: string }

const text = (t: string) => ({
  type: 'text',
  text: t,
  mode: 'normal',
  style: '',
  detail: 0,
  format: 0,
  version: 1,
})

const paragraph = (t: string) => ({
  type: 'paragraph',
  format: '',
  indent: 0,
  version: 1,
  direction: 'ltr',
  textFormat: 0,
  children: t ? [text(t)] : [],
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
    children: [text(t)],
  })),
})

const richText = (blocks: Block[]) => ({
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
})

const P = (p: string): Block => ({ p })

type Seed = {
  slug: string
  publishDate: string
  author: string
  cover: string // media filename
  featured: boolean
  title: Loc
  excerpt: Loc
  body: { id: Block[]; en: Block[] }
}

/* Detail Berita 556:2721 — body copied from the Figma text 559:2820. */
const propensity: Seed = {
  slug: 'temukan-nasabah-berikutnya-sebelum-kompetitor',
  publishDate: '2026-06-25',
  author: 'gvezenzcha',
  cover: 'article-7.png',
  featured: true,
  title: {
    id: 'Temukan Nasabah Berikutnya Sebelum Kompetitor: Mengenal CLIK Propensity Score',
    en: 'Find Your Next Borrower Before Your Competitors Do: Introducing CLIK Propensity Score',
  },
  excerpt: {
    id: 'Mengapa sebagian lembaga keuangan mampu memperoleh tingkat konversi lebih tinggi, meski menjalankan kampanye cross-sell lebih kecil? Apakah anggaran marketing bisa difokuskan hanya kepada nasabah yang memiliki kemungkinan tinggi untuk mengambil pinjaman?',
    en: 'Why do some financial institutions achieve higher conversion rates while running smaller cross-sell campaigns? Can a marketing budget be focused only on customers who are most likely to take out a loan?',
  },
  body: {
    id: [
      P('Mengapa sebagian lembaga keuangan mampu memperoleh tingkat konversi lebih tinggi, meski menjalankan kampanye cross-sell lebih kecil? Apakah anggaran marketing bisa difokuskan hanya kepada nasabah yang memiliki kemungkinan tinggi untuk mengambil pinjaman tanpa mengorbankan kualitas portofolio? Dan bagaimana cara mengidentifikasi nasabah yang tepat di antara jutaan pelanggan?'),
      P('Jawabannya terletak pada kemampuan memahami borrowing intent. Banyak institusi kini memanfaatkan propensity score untuk mengidentifikasi nasabah yang paling berpotensi mengambil pinjaman baru, sehingga kampanye dapat dijalankan dengan lebih tepat sasaran.'),
      P('Apa Itu Propensity Score?'),
      P('Propensity score adalah model prediktif yang mengukur probabilitas seorang nasabah mengambil pinjaman tanpa agunan (unsecured loan) dalam periode tertentu berdasarkan riwayat perilaku kreditnya serta pola perilaku nasabah lain yang memiliki karakteristik serupa. Berbeda dengan credit risk score yang memprediksi kemungkinan seorang nasabah membayar kembali pinjamannya, propensity score memprediksi kemungkinan seorang nasabah mengajukan pinjaman.'),
      P('CLIK Propensity Score dikembangkan menggunakan data biro kredit Indonesia yang memberikan gambaran menyeluruh mengenai aktivitas kredit seseorang di seluruh ekosistem jasa keuangan, mulai dari perbankan, multifinance, Buy Now Pay Later (BNPL), hingga Peer-to-Peer (P2P) Lending. Model ini berfokus pada produk kredit tanpa agunan, seperti kartu kredit, pinjaman tunai, BNPL, dan P2P Lending. Dengan memanfaatkan data perilaku kredit lintas institusi, model mampu mengidentifikasi sinyal yang sering kali tidak terlihat apabila analisis hanya menggunakan data internal dari satu lembaga keuangan.'),
      P('Secara sederhana, CLIK Propensity Score dirancang untuk menjawab satu pertanyaan penting: “Seberapa besar kemungkinan seorang nasabah akan mengambil pinjaman tanpa agunan baru dalam 90 hari ke depan?”'),
      P('Mengapa Banyak Kampanye Cross-Sell Tidak Efektif?'),
      P('Salah satu tantangan terbesar dalam strategi cross-sell adalah anggapan bahwa seluruh nasabah memiliki peluang yang sama untuk mengambil pinjaman. Padahal, permintaan kredit sebenarnya terkonsentrasi pada kelompok nasabah tertentu.'),
      P('Analisis CLIK menunjukkan bahwa sekitar 70% pengambilan pinjaman tanpa agunan baru berasal dari kurang dari sepertiga populasi yang dapat dinilai (scorable population). Sebaliknya, nasabah yang tidak memiliki aktivitas kredit tanpa agunan dalam beberapa waktu terakhir cenderung memiliki kemungkinan yang jauh lebih rendah untuk mengambil pinjaman baru.'),
      P('Akibatnya, banyak anggaran pemasaran terpakai untuk menjangkau nasabah yang belum memiliki kebutuhan pembiayaan, sementara nasabah yang memang sedang siap mengajukan pinjaman justru berpotensi terlewat. Dalam praktiknya, hal ini dapat menurunkan tingkat konversi sekaligus meningkatkan biaya akuisisi.'),
      P('Tantangan lainnya adalah keterbatasan data internal. Aktivitas seperti membuka fasilitas BNPL menggunakan kartu kredit baru, atau mengambil pinjaman dari institusi lain sering kali menjadi sinyal bahwa kebutuhan pembiayaan sedang meningkat. Namun, informasi tersebut hanya dapat terlihat melalui data biro kredit yang mencakup seluruh ekosistem jasa keuangan.'),
      P('Inilah yang membuat CLIK Propensity Score mampu mengidentifikasi peluang yang sering kali tidak terlihat oleh model yang hanya mengandalkan data internal.'),
      P('Apa Perbedaan Propensity Score dan Credit Risk Score?'),
      P('Perbedaan keduanya terletak pada pertanyaan yang ingin dijawab.'),
      {
        ul: [
          'Credit risk score menjawab: “Jika nasabah menerima pinjaman, seberapa besar kemungkinan pinjaman tersebut akan dibayar kembali?”',
          'Sementara itu, propensity score menjawab: “Seberapa besar kemungkinan nasabah akan mengajukan pinjaman dalam waktu dekat?”',
        ],
      },
      P('Dengan kata lain, credit risk score mengukur risiko, sedangkan propensity score mengukur potensi. Keduanya saling melengkapi. Credit risk score membantu menentukan nasabah yang layak diberikan pinjaman, sementara propensity score membantu mengidentifikasi nasabah yang paling mungkin merespons penawaran. Melalui kombinasi keduanya, lembaga keuangan dapat mengembangkan portofolio pinjaman secara lebih efektif tanpa mengabaikan kualitas kredit.'),
      P('Bagaimana Praktik Penerapan Propensity Score?'),
      P('Berikut beberapa contoh penerapan propensity score di industri jasa keuangan.'),
      {
        ol: [
          'Bank yang ingin mengembangkan portofolio Kredit Tanpa Agunan (KTA). Daripada menawarkan produk kepada seluruh nasabah payroll, bank dapat menggunakan propensity score untuk mengidentifikasi nasabah dengan potensi tertinggi, kemudian memfokuskan kampanye telemarketing maupun digital kepada segmen tersebut. Hasilnya, jumlah nasabah yang dihubungi lebih sedikit, tingkat konversi lebih tinggi, dan biaya akuisisi per pinjaman menjadi lebih efisien.',
          'Perusahaan multifinance yang melakukan cross-sell pinjaman tunai. Perusahaan memiliki ribuan nasabah yang telah menyelesaikan pembiayaan kendaraan dengan riwayat pembayaran yang baik. Propensity score membantu mengidentifikasi nasabah yang saat ini sedang berada dalam fase membutuhkan pembiayaan, sehingga penawaran pinjaman tunai dapat diberikan pada waktu yang tepat.',
          'Platform BNPL atau P2P Lending yang ingin meningkatkan keterlibatan nasabah. Propensity score membantu mengidentifikasi pengguna yang memiliki kemungkinan tinggi untuk meningkatkan penggunaan kredit tanpa agunan dalam 90 hari ke depan. Dengan demikian, platform dapat memprioritaskan penawaran kenaikan limit atau produk baru sebelum nasabah beralih ke kompetitor.',
        ],
      },
      P('Bagaimana Proses Implementasi CLIK Propensity Score?'),
      P('Penerapan CLIK Propensity Score cukup sederhana.'),
      {
        ol: [
          'Mulai dari tujuan kampanye, baik untuk cross-sell, aktivasi kartu kredit, maupun peluncuran produk BNPL baru, tujuan kampanye akan menentukan bagaimana propensity score digunakan.',
          'CLIK melakukan scoring terhadap portofolio nasabah menggunakan propensity model berdasarkan data biro kredit terbaru.',
          'Terima hasil scoring berupa daftar nasabah yang diurutkan berdasarkan kemungkinan mengambil pinjaman tanpa agunan dalam tiga bulan ke depan.',
          'Terapkan kriteria internal. Propensity score menunjukkan siapa yang paling mungkin merespons, sementara kebijakan kredit dan risk appetite institusi menentukan siapa yang akan disetujui. Hasilnya adalah daftar target kampanye.',
          'Jalankan kampanye dengan fokus kepada target yang telah diprioritaskan, lalu ukur peningkatan hasilnya dibandingkan kampanye sebelumnya.',
        ],
      },
      P('CLIK Propensity Score tersedia melalui batch file, API, atau kombinasi keduanya, sehingga mudah diintegrasikan dengan proses pemasaran maupun pengambilan keputusan secara real-time.'),
      P('Apa yang Membuat Sebuah Propensity Model Efektif?'),
      P('Tidak semua propensity model memberikan hasil yang sama. Ada empat hal yang menjadi pembeda.'),
      {
        ol: [
          'Berbasis perilaku, bukan asumsi. Data demografis hanya menunjukkan siapa nasabah, sedangkan perilaku kredit menunjukkan apa yang benar-benar dilakukan. CLIK Propensity Score dibangun berdasarkan riwayat peminjaman dan pembayaran di seluruh ekosistem biro kredit untuk memberikan prediksi yang lebih akurat.',
          'Berfokus pada hasil yang relevan. Model ini memprediksi kemungkinan nasabah mengambil pinjaman tanpa agunan dalam tiga bulan ke depan, sehingga hasilnya selaras dengan tujuan utama kampanye: mendorong realisasi pinjaman, bukan sekadar menunjukkan minat.',
          'Mudah dipahami dan dijelaskan. Model yang baik harus mudah dipahami oleh berbagai pemangku kepentingan, mulai dari tim pemasaran, tim risiko, hingga manajemen. Karena menggunakan indikator perilaku yang jelas, hasil scoring lebih mudah diinterpretasikan dan dijadikan dasar pengambilan keputusan.',
          'Mudah diintegrasikan. CLIK Propensity Score tersedia melalui batch file maupun API, sehingga dapat diintegrasikan dengan proses pemasaran dan pengambilan keputusan yang sudah berjalan.',
        ],
      },
      P('Kesimpulan'),
      P('Di tengah persaingan industri jasa keuangan yang semakin ketat, kemampuan mengidentifikasi nasabah yang siap mengajukan pinjaman menjadi faktor penting dalam meningkatkan efektivitas kampanye. Dengan CLIK Propensity Score, lembaga keuangan dapat memprioritaskan nasabah yang memiliki potensi tertinggi untuk merespons penawaran, sehingga kampanye menjadi lebih tepat sasaran, konversi meningkat, dan pertumbuhan portofolio dapat dicapai dengan tetap menjaga kualitas kredit.'),
    ],
    en: [
      P('Why do some financial institutions achieve higher conversion rates even while running smaller cross-sell campaigns? Can a marketing budget be focused only on customers who are highly likely to take out a loan, without sacrificing portfolio quality? And how do you identify the right customers among millions?'),
      P('The answer lies in understanding borrowing intent. Many institutions now use a propensity score to identify the customers most likely to take out a new loan, so that campaigns can be run with far better targeting.'),
      P('What Is a Propensity Score?'),
      P('A propensity score is a predictive model that measures the probability that a customer will take out an unsecured loan within a given period, based on their credit behaviour history and the behaviour patterns of other customers with similar characteristics. Unlike a credit risk score, which predicts how likely a customer is to repay a loan, a propensity score predicts how likely a customer is to apply for one.'),
      P('CLIK Propensity Score is built on Indonesian credit bureau data, which gives a complete picture of a person’s credit activity across the financial services ecosystem, from banking and multifinance to Buy Now Pay Later (BNPL) and Peer-to-Peer (P2P) Lending. The model focuses on unsecured credit products such as credit cards, cash loans, BNPL and P2P Lending. By using credit behaviour data across institutions, the model can pick up signals that are often invisible when analysis relies only on one institution’s internal data.'),
      P('Put simply, CLIK Propensity Score is designed to answer one important question: “How likely is this customer to take out a new unsecured loan in the next 90 days?”'),
      P('Why Are So Many Cross-Sell Campaigns Ineffective?'),
      P('One of the biggest challenges in a cross-sell strategy is the assumption that every customer is equally likely to take out a loan. In reality, credit demand is concentrated in particular groups of customers.'),
      P('CLIK analysis shows that around 70% of new unsecured loans come from less than a third of the scorable population. Conversely, customers with no recent unsecured credit activity tend to be far less likely to take out a new loan.'),
      P('As a result, a large share of the marketing budget is spent reaching customers who have no financing need yet, while customers who are ready to apply may be missed. In practice, this can lower conversion rates and raise acquisition costs at the same time.'),
      P('Another challenge is the limits of internal data. Activities such as opening a BNPL facility, getting a new credit card or taking a loan from another institution are often signals that a financing need is growing. But that information is only visible through credit bureau data that covers the whole financial services ecosystem.'),
      P('This is what allows CLIK Propensity Score to spot opportunities that models relying only on internal data often miss.'),
      P('How Is a Propensity Score Different from a Credit Risk Score?'),
      P('The difference lies in the question each one answers.'),
      {
        ul: [
          'A credit risk score answers: “If this customer receives a loan, how likely is it to be repaid?”',
          'A propensity score, meanwhile, answers: “How likely is this customer to apply for a loan in the near future?”',
        ],
      },
      P('In other words, a credit risk score measures risk, while a propensity score measures potential. The two complement each other. A credit risk score helps decide which customers are eligible for a loan, while a propensity score helps identify the customers most likely to respond to an offer. By combining them, financial institutions can grow their loan portfolios more effectively without compromising credit quality.'),
      P('How Is a Propensity Score Used in Practice?'),
      P('Here are some examples of how propensity scores are used in the financial services industry.'),
      {
        ol: [
          'A bank that wants to grow its unsecured personal loan (KTA) portfolio. Instead of offering the product to every payroll customer, the bank can use a propensity score to identify the customers with the highest potential and focus its telemarketing and digital campaigns on that segment. The result: fewer customers contacted, a higher conversion rate and a lower acquisition cost per loan.',
          'A multifinance company cross-selling cash loans. The company has thousands of customers who have paid off vehicle financing with a good payment record. A propensity score helps identify which of them are currently in a phase of needing financing, so a cash loan offer can be made at the right time.',
          'A BNPL or P2P Lending platform that wants to increase customer engagement. A propensity score helps identify users who are highly likely to increase their use of unsecured credit in the next 90 days, so the platform can prioritise limit increases or new products before customers move to a competitor.',
        ],
      },
      P('How Is CLIK Propensity Score Implemented?'),
      P('Putting CLIK Propensity Score to work is straightforward.'),
      {
        ol: [
          'Start from the campaign goal, whether it is cross-selling, credit card activation or launching a new BNPL product; the goal determines how the propensity score is used.',
          'CLIK scores the customer portfolio with the propensity model, using the latest credit bureau data.',
          'Receive the scoring results as a list of customers ranked by their likelihood of taking out an unsecured loan in the next three months.',
          'Apply your internal criteria. The propensity score shows who is most likely to respond, while the institution’s credit policy and risk appetite decide who will be approved. The result is the campaign target list.',
          'Run the campaign focused on the prioritised targets, then measure the improvement against previous campaigns.',
        ],
      },
      P('CLIK Propensity Score is available by batch file, API or a combination of both, so it integrates easily with marketing processes and real-time decision making.'),
      P('What Makes a Propensity Model Effective?'),
      P('Not every propensity model delivers the same results. Four things set them apart.'),
      {
        ol: [
          'Based on behaviour, not assumptions. Demographic data only shows who a customer is, while credit behaviour shows what they actually do. CLIK Propensity Score is built on borrowing and repayment history across the credit bureau ecosystem to give more accurate predictions.',
          'Focused on the outcome that matters. The model predicts the likelihood of a customer taking out an unsecured loan in the next three months, so the results line up with the campaign’s main goal: loans actually disbursed, not just expressions of interest.',
          'Easy to understand and explain. A good model must be easy for every stakeholder to understand, from marketing and risk teams to management. Because it uses clear behavioural indicators, the scoring results are easier to interpret and to base decisions on.',
          'Easy to integrate. CLIK Propensity Score is available by batch file or API, so it can be integrated with existing marketing and decision-making processes.',
        ],
      },
      P('Conclusion'),
      P('As competition in financial services grows ever tighter, the ability to identify customers who are ready to apply for a loan is a key factor in making campaigns more effective. With CLIK Propensity Score, financial institutions can prioritise the customers with the highest potential to respond to an offer, so campaigns are better targeted, conversion rises, and the portfolio grows while credit quality is maintained.'),
    ],
  },
}

const short = (
  slug: string,
  publishDate: string,
  cover: string,
  featured: boolean,
  title: Loc,
  excerpt: Loc,
  more: Loc,
): Seed => ({
  slug,
  publishDate,
  author: 'gvezenzcha',
  cover,
  featured,
  title,
  excerpt,
  body: { id: [P(excerpt.id), P(more.id)], en: [P(excerpt.en), P(more.en)] },
})

const seeds: Seed[] = [
  propensity,
  short(
    'apa-itu-risiko-kredit-dan-cara-menghindarinya',
    '2026-01-23',
    'article-9.png',
    true,
    {
      id: 'Apa Itu Risiko Kredit dan Cara Menghindarinya',
      en: 'What Credit Risk Is and How to Avoid It',
    },
    {
      id: 'Risiko kredit merupakan salah satu aspek penting dalam dunia keuangan yang sering kali diabaikan oleh masyarakat. Padahal, memahami risiko kredit membantu kita mengelola pinjaman dengan lebih bijak.',
      en: 'Credit risk is an important part of personal finance that people often overlook. Yet understanding credit risk helps us manage borrowing more wisely.',
    },
    {
      id: 'Risiko kredit dapat dikurangi dengan membayar tagihan tepat waktu, menjaga rasio utang terhadap pendapatan, dan memeriksa laporan kredit secara berkala untuk memastikan datanya akurat.',
      en: 'Credit risk can be reduced by paying bills on time, keeping the debt-to-income ratio in check, and reviewing your credit report regularly to make sure its data is accurate.',
    },
  ),
  short(
    '8-cara-mendapatkan-modal-usaha-minim-risiko',
    '2026-01-20',
    'article-8.png',
    true,
    {
      id: '8 Cara Mendapatkan Modal Usaha yang Minim Risiko',
      en: '8 Low-Risk Ways to Get Business Capital',
    },
    {
      id: 'Memulai dan mengembangkan usaha membutuhkan modal yang tidak sedikit. Namun, memilih sumber modal yang salah justru dapat menimbulkan risiko bagi keberlangsungan usaha.',
      en: 'Starting and growing a business takes considerable capital. But choosing the wrong source of funding can put the business itself at risk.',
    },
    {
      id: 'Kenali pilihan pendanaan yang tersedia, mulai dari tabungan pribadi hingga pembiayaan dari lembaga keuangan resmi, dan pastikan riwayat kredit usaha Anda tercatat dengan baik.',
      en: 'Get to know the funding options available, from personal savings to financing from licensed institutions, and make sure your business credit history is well recorded.',
    },
  ),
  short(
    'penyebab-kredit-turun-di-indonesia',
    '2026-01-16',
    'article-7.png',
    true,
    {
      id: 'Penyebab Kredit Turun di Indonesia',
      en: 'Why Lending Is Slowing in Indonesia',
    },
    {
      id: 'Banyak masyarakat Indonesia merasakan bahwa pengajuan kredit baik untuk modal usaha, kendaraan, maupun kebutuhan pribadi tidak semudah sebelumnya. Penurunan penyaluran kredit dipengaruhi oleh beberapa faktor.',
      en: 'Many Indonesians feel that applying for credit, whether for business capital, a vehicle or personal needs, is not as easy as it used to be. Several factors are behind the slowdown in lending.',
    },
    {
      id: 'Lembaga keuangan kini lebih selektif dalam menilai calon debitur. Data kredit yang lengkap dan akurat membantu proses penilaian berjalan lebih cepat dan adil.',
      en: 'Financial institutions are now more selective when assessing applicants. Complete and accurate credit data helps that assessment happen faster and more fairly.',
    },
  ),
  short(
    'cara-mengukur-risiko-portofolio-kredit-2026',
    '2026-01-09',
    'article-9.png',
    true,
    {
      id: 'Cara Mengukur Risiko Portofolio Kredit Secara Akurat Tahun 2026',
      en: 'How to Measure Credit Portfolio Risk Accurately in 2026',
    },
    {
      id: 'Mengukur risiko portofolio kredit menjadi semakin penting, karena peminjam kini memiliki aktivitas kredit di berbagai lembaga, sehingga potensi risikonya tidak selalu terlihat dari data internal.',
      en: 'Measuring credit portfolio risk matters more than ever, because borrowers now have credit activity across many institutions, so the potential risk is not always visible in internal data.',
    },
    {
      id: 'Pemantauan portofolio berbasis data biro kredit membantu lembaga keuangan mendeteksi perubahan perilaku debitur lebih awal dan mengambil langkah mitigasi yang tepat.',
      en: 'Portfolio monitoring based on credit bureau data helps lenders detect changes in borrower behaviour early and take the right mitigating action.',
    },
  ),
]

/** Existing sample articles that also appear in Featured News (8 in total). */
const alsoFeatured = ['clik-perluas-jaringan-anggota', 'memahami-skor-kredit', 'kolaborasi-clik-crif-global']

const run = async () => {
  const payload = await getPayload({ config })

  const media = await payload.find({ collection: 'media', limit: 100, depth: 0 })
  const mediaId = (filename: string) => media.docs.find((m) => m.filename === filename)?.id

  for (const seed of seeds) {
    const base = {
      slug: seed.slug,
      publishDate: seed.publishDate,
      author: seed.author,
      cover: mediaId(seed.cover) ?? null,
      isFeatured: seed.featured,
      isSample: true,
      approvalStatus: 'approved',
      _status: 'published',
    }
    const existing = await payload.find({
      collection: 'articles',
      where: { slug: { equals: seed.slug } },
      locale: 'id',
      limit: 1,
      depth: 0,
      draft: true,
    })
    const id = existing.docs[0]?.id
    const idData = { ...base, title: seed.title.id, excerpt: seed.excerpt.id, body: richText(seed.body.id) }
    const enData = { ...base, title: seed.title.en, excerpt: seed.excerpt.en, body: richText(seed.body.en) }

    const doc = id
      ? await payload.update({ collection: 'articles', id, locale: 'id', data: idData as never, overrideAccess: true })
      : await payload.create({ collection: 'articles', locale: 'id', data: idData as never, overrideAccess: true })
    await payload.update({ collection: 'articles', id: doc.id, locale: 'en', data: enData as never, overrideAccess: true })
    payload.logger.info(`${id ? 'Updated' : 'Created'} ${seed.slug}`)
  }

  for (const slug of alsoFeatured) {
    const found = await payload.find({ collection: 'articles', where: { slug: { equals: slug } }, limit: 1, depth: 0 })
    const doc = found.docs[0]
    if (doc && !doc.isFeatured) {
      await payload.update({ collection: 'articles', id: doc.id, data: { isFeatured: true } as never, overrideAccess: true })
      payload.logger.info(`Featured ${slug}`)
    }
  }

  process.exit(0)
}

// Top-level await: `payload run` exits as soon as the import settles.
await run().catch((error) => {
  console.error(error)
  process.exit(1)
})
