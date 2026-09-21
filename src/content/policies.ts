/**
 * The four policy and how-to pages.
 *
 * Lives in code, not the CMS. Change the wording here and redeploy.
 */
import type { ProseBlock } from '@/components/ui/Prose'

type Pair = { id: string; en: string }

/*
 * ============================================================================
 *  LEGAL REVIEW REQUIRED BEFORE PUBLISHING
 * ============================================================================
 *  The text below is SEED content copied verbatim from the Figma design
 *  (Indonesian) with developer-written English translations, so the pages
 *  match the design 1:1. It has NOT been approved by Legal / Compliance.
 *
 *  Every page carries `needsLegalReview: true`. Before these pages go live,
 *  the team must replace (or approve) the wording and the English
 *  translations, then set the flag to false. Nothing is shown on the page
 *  itself — the flag is for reviewers and tooling (grep "needsLegalReview").
 * ============================================================================
 */

/**
 * TODO(owner): no "Formulir Permintaan Data" file exists yet. Put the real
 * form at this path in public/ (or replace this with the CMS media URL).
 * Until then the link on "Cara mendapat laporan kredit" 404s.
 */
export const DATA_REQUEST_FORM_HREF = '/documents/formulir-permintaan-data.pdf'

/** "Terakhir Diperbarui: dd/mm/yyyy" under the Kebijakan Privasi heading. */
export const lastUpdatedLabel: Pair = { id: 'Terakhir Diperbarui', en: 'Last Updated' }

export type HowToItem = { text: Pair; href?: string }
export type HowToColumn = {
  image: string
  heading: Pair
  items: HowToItem[]
}

export type PolicyPage = {
  key: string
  /** True while the wording is Figma seed text, not approved copy. */
  needsLegalReview: boolean
  /** The h1. */
  title: Pair
  /** Current breadcrumb label, when it differs from the h1. */
  crumb?: Pair
  /** ISO date; rendered as "Terakhir Diperbarui: dd/mm/yyyy" after the first heading. */
  lastUpdated?: string
  /**
   * 'sections' — Kebijakan Keamanan Informasi: separate 24/600 headings,
   *              8px under each heading, 32px before the next.
   * 'notice'   — Kebijakan Privasi: one text flow, 24/700 headings with one
   *              empty line above, paragraphs line to line.
   * 'relaxed'  — Penyelesaian Pengaduan: 16/30 prose, empty line between paragraphs.
   * 'howTo'    — Cara mendapat laporan kredit: intro, two columns, note.
   */
  layout: 'sections' | 'notice' | 'relaxed' | 'howTo'
  body: ProseBlock[]
  howTo?: {
    intro: { lead: Pair; company: Pair; address: Pair }
    columns: HowToColumn[]
    note: Pair
  }
}

const p = (id: string, en: string): ProseBlock => ({ type: 'p', text: { id, en } })
const h = (id: string, en: string): ProseBlock => ({ type: 'heading', text: { id, en } })
const ul = (...items: Pair[]): { type: 'ul'; items: Pair[] } => ({ type: 'ul', items })
const li = (id: string, en: string): Pair => ({ id, en })

/* ---------------------------------------------------------------------------
 * Kebijakan Keamanan Informasi — Figma 743:3483
 * ------------------------------------------------------------------------- */
// LEGAL REVIEW: Figma seed text, not approved copy.
const informationSecurity: PolicyPage = {
  key: 'information_security_policy',
  needsLegalReview: true,
  title: { id: 'Kebijakan Keamanan Informasi', en: 'Information Security Policy' },
  layout: 'sections',
  body: [
    h('Tujuan', 'Purpose'),
    ul(
      li(
        'Kebijakan ini ditetapkan untuk memastikan bahwa seluruh aset informasi yang dimiliki, dikelola, atau diproses oleh PT CRIF Lembaga Informasi Keuangan (PT CLIK) dilindungi dari ancaman yang disengaja maupun tidak disengaja, baik yang berasal dari sisi internal maupun eksternal.',
        'This policy is established to ensure that all information assets owned, managed, or processed by PT CRIF Lembaga Informasi Keuangan (PT CLIK) are protected against intentional and unintentional threats, whether internal or external.',
      ),
      li(
        'Kebijakan ini bertujuan untuk menjaga dan meningkatkan tingkat keamanan informasi melalui pelindungan terhadap aspek kerahasiaan (confidentiality), integritas (integrity), dan ketersediaan (availability) dari seluruh informasi yang menjadi tanggung jawab Perusahaan.',
        'This policy aims to maintain and improve the level of information security by protecting the confidentiality, integrity, and availability of all information for which the Company is responsible.',
      ),
    ),
    h('Ruang Lingkup', 'Scope'),
    ul(
      li(
        'Kebijakan ini berlaku bagi seluruh personel PT CRIF Lembaga Informasi Keuangan (PT CLIK), termasuk namun tidak terbatas pada manajemen, karyawan, tenaga alih daya, serta pihak ketiga yang memiliki akses terhadap informasi, sistem aplikasi, infrastruktur teknologi informasi, dan data informasi perkreditan yang dikelola oleh PT CLIK.',
        'This policy applies to all personnel of PT CRIF Lembaga Informasi Keuangan (PT CLIK), including but not limited to management, employees, outsourced staff, and third parties with access to the information, application systems, information technology infrastructure, and credit information data managed by PT CLIK.',
      ),
      li(
        'Ruang lingkup kebijakan ini mencakup seluruh aktivitas yang berkaitan dengan pengelolaan, pemrosesan, penyimpanan, penyampaian, dan pengamanan data informasi perkreditan.',
        'The scope of this policy covers all activities related to the management, processing, storage, delivery, and security of credit information data.',
      ),
    ),
    h('Komitmen Manajemen Puncak', 'Top Management Commitment'),
    p(
      'Manajemen Puncak PT CLIK berkomitmen penuh dalam penerapan kebijakan keamanan informasi ini dengan cara sebagai berikut :',
      'The Top Management of PT CLIK is fully committed to implementing this information security policy in the following ways:',
    ),
    ul(
      li(
        'Menyetujui dan mendukung penuh kebijakan, prosedur dan sasaran keamanan informasi yang sejalan dengan visi, misi, dan konteks Perusahaan.',
        "Approving and fully supporting information security policies, procedures and objectives that are aligned with the Company's vision, mission, and context.",
      ),
      li(
        'Menyediakan sumber daya yang memadai, termasuk satuan kerja implementasi ISO 27001 beserta tanggung jawabnya (pada lampiran), teknologi, pelatihan, serta anggaran yang diperlukan untuk mengembangkan dan memelihara efektivitas SMKI.',
        'Providing adequate resources, including the ISO 27001 implementation work unit and its responsibilities (in the appendix), technology, training, and the budget needed to develop and maintain the effectiveness of the ISMS.',
      ),
      li(
        'Menunjuk Satuan Kerja Implementasi ISO 27001 serta memastikan mereka memiliki wewenang, kompetensi dan dukungan yang cukup dalam menjalankan tanggung jawabnya.',
        'Appointing the ISO 27001 Implementation Work Unit and ensuring it has sufficient authority, competence and support to carry out its responsibilities.',
      ),
      li(
        'Melaksanakan peninjauan berkala terhadap efektivitas penerapan SMKI melalui audit internal, tinjauan manajemen serta tindakan perbaikan dan peningkatan berkelanjutan.',
        'Periodically reviewing the effectiveness of the ISMS through internal audits, management reviews, and corrective and continual improvement actions.',
      ),
      li(
        'Mendorong budaya kesadaran keamanan informasi di seluruh tingkat Perusahaan, serta memastikan setiap karyawan memahami perannya dalam melindungi data pribadi dan informasi sensitif Perusahaan.',
        "Fostering a culture of information security awareness at every level of the Company, and ensuring every employee understands their role in protecting personal data and the Company's sensitive information.",
      ),
      li(
        'Menegakkan kepatuhan terhadap seluruh peraturan perundang-undangan dan persyaratan kontraktual yang berkaitan dengan keamanan informasi dan peraturan relevan lainnya.',
        'Enforcing compliance with all laws, regulations and contractual requirements related to information security and other relevant regulations.',
      ),
    ),
    h('Kebijakan', 'Policy'),
    {
      type: 'ol',
      items: [
        {
          text: { id: 'Prinsip', en: 'Principles' },
          children: ul(
            li(
              'Menetapkan dan memelihara sistem manajemen keamanan informasi sesuai dengan ISO/IEC 27001:2022.',
              'Establish and maintain an information security management system in accordance with ISO/IEC 27001:2022.',
            ),
            li(
              'Menjamin bahwa seluruh aktivitas pengelolaan informasi dilakukan dengan mengedepankan prinsip Confidentiality, Integrity, dan Availability.',
              'Ensure that all information management activities are carried out with priority given to the principles of Confidentiality, Integrity, and Availability.',
            ),
            li(
              'Menetapkan kontrol keamanan yang proporsional terhadap nilai, risiko, dan sensitivitas informasi yang dikelola.',
              'Establish security controls proportionate to the value, risk, and sensitivity of the information managed.',
            ),
            li(
              'Menetapkan tanggung jawab dan peran yang jelas bagi seluruh karyawan dan pihak ketiga yang mengelola atau mengakses informasi.',
              'Establish clear responsibilities and roles for all employees and third parties who manage or access information.',
            ),
            li(
              'Meningkatkan kesadaran dan kompetensi keamanan informasi melalui pelatihan, komunikasi, dan program awareness secara berkelanjutan.',
              'Continuously improve information security awareness and competence through training, communication, and awareness programmes.',
            ),
            li(
              'Menjamin bahwa setiap insiden keamanan informasi dilaporkan, dianalisis, dan ditangani dengan cepat serta efektif untuk mencegah terulangnya kejadian serupa.',
              'Ensure that every information security incident is reported, analysed, and handled quickly and effectively to prevent similar incidents from recurring.',
            ),
            li(
              'Melaksanakan audit internal dan tinjauan manajemen secara berkala untuk memastikan efektivitas implementasi kebijakan ini.',
              'Conduct internal audits and management reviews periodically to ensure this policy is implemented effectively.',
            ),
          ),
        },
      ],
    },
  ],
}

/* ---------------------------------------------------------------------------
 * Kebijakan Privasi — Figma 955:5948
 * The Figma text node uses textCase TITLE, which is a design artefact; the
 * characters (sentence case) are the intended copy.
 * ------------------------------------------------------------------------- */
// LEGAL REVIEW: Figma seed text, not approved copy.
const privacy: PolicyPage = {
  key: 'privacy_policy',
  needsLegalReview: true,
  title: { id: 'Kebijakan Privasi', en: 'Privacy Policy' },
  // LEGAL REVIEW: date from Figma; update when the approved notice is published.
  lastUpdated: '2026-08-14',
  layout: 'notice',
  body: [
    h('Pemberitahuan Privasi', 'Privacy Notice'),
    // "Terakhir Diperbarui: …" is inserted here from `lastUpdated`.
    p(
      'Di PT CRIF Lembaga Informasi Keuangan (“CLIK”), kami berkomitmen untuk melindungi privasi Anda dan memastikan keamanan informasi pribadi Anda. Pemberitahuan Privasi ini menjelaskan bagaimana CLIK (disebut sebagai “kami,” “kita,” atau “milik kami”) mengumpulkan, menggunakan, dan melindungi data Anda. Kami mematuhi hukum dan peraturan perlindungan data yang berlaku di Indonesia, dan pemberitahuan ini berlaku untuk individu atau badan hukum (“Anda” atau “milik Anda”) yang berinteraksi dengan layanan kami.',
      'At PT CRIF Lembaga Informasi Keuangan (“CLIK”), we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Notice explains how CLIK (referred to as “we,” “us,” or “our”) collects, uses, and protects your data. We comply with the data protection laws and regulations in force in Indonesia, and this notice applies to individuals or legal entities (“you” or “your”) who interact with our services.',
    ),
    p(
      'Pemberitahuan pada Saat Pengumpulan Data Kami mengumpulkan informasi pribadi seperti yang dijelaskan dalam pemberitahuan ini. Kategori informasi pribadi yang kami kumpulkan dapat dilihat di bagian “Informasi pribadi yang kami kumpulkan”, dan tujuan pengumpulan serta penggunaannya dapat ditemukan di bagian “Tujuan pengumpulan dan penggunaan informasi pribadi”.',
      'Notice at Collection We collect personal information as described in this notice. The categories of personal information we collect can be found in the section “Personal information we collect”, and the purposes for which it is collected and used can be found in the section “Purposes for collecting and using personal information”.',
    ),
    p(
      'Untuk memahami lebih lanjut mengenai hak privasi Anda, termasuk hak Anda untuk memilih keluar dari penjualan atau berbagi informasi pribadi Anda, silakan lihat bagian “Hak privasi dan pilihan Anda” di bawah ini. Praktik penyimpanan data kami dijelaskan lebih lanjut dalam bagian “Penyimpanan informasi pribadi”.',
      'To learn more about your privacy rights, including your right to opt out of the sale or sharing of your personal information, please see the section “Your privacy rights and choices” below. Our data retention practices are described further in the section “Retention of personal information”.',
    ),

    h('1. Ruang Lingkup Pemberitahuan Privasi Ini', '1. Scope of This Privacy Notice'),
    p(
      'Pemberitahuan Privasi ini berlaku untuk semua layanan yang disediakan oleh PT CRIF Lembaga Informasi Keuangan (“CLIK”), di mana kami dapat bertindak sebagai Pengendali Data (Data Controller) atau Pengolah Data (Data Processor), tergantung pada konteksnya:',
      'This Privacy Notice applies to all services provided by PT CRIF Lembaga Informasi Keuangan (“CLIK”), in which we may act as a Data Controller or a Data Processor, depending on the context:',
    ),
    ul(
      li(
        'Pengendali Data (Data Controller): Kami bertindak sebagai Pengendali Data ketika kami mengumpulkan data langsung dari pelanggan atau debitur, seperti ketika individu atau badan hukum mengajukan pertanyaan tentang layanan kami.',
        'Data Controller: We act as a Data Controller when we collect data directly from customers or debtors, such as when individuals or legal entities submit enquiries about our services.',
      ),
      li(
        'Pengolah Data (Data Processor): Kami bertindak sebagai Pengolah Data ketika kami memproses data yang diberikan kepada kami oleh lembaga keuangan, lembaga non-keuangan, atau lembaga lain atas nama pelanggan, debitur, atau pihak terkait lainnya.',
        'Data Processor: We act as a Data Processor when we process data provided to us by financial institutions, non-financial institutions, or other institutions on behalf of customers, debtors, or other related parties.',
      ),
    ),
    p(
      'Dengan memahami peran kami sebagai baik Pengendali Data maupun Pengolah Data, kami berkomitmen untuk selalu menjaga kerahasiaan, keamanan, dan kepatuhan terhadap hukum perlindungan data yang berlaku.',
      'Understanding our role as both Data Controller and Data Processor, we are committed to always maintaining confidentiality, security, and compliance with applicable data protection laws.',
    ),

    h('2. Informasi yang Kami Kumpulkan', '2. Information We Collect'),
    p('Kami dapat mengumpulkan jenis informasi berikut dari Anda:', 'We may collect the following types of information from you:'),
    ul(
      li(
        'informasi Pribadi: Seperti nama, tanggal lahir, jenis kelamin, nomor identitas, nama ibu, tempat lahir, agama, tempat tinggal, status pernikahan, email, nomor telepon.',
        "Personal Information: Such as name, date of birth, gender, identity number, mother's name, place of birth, religion, place of residence, marital status, email, phone number.",
      ),
      li(
        'Informasi Keuangan: Informasi terkait dengan riwayat kredit, perbankan, atau keuangan Anda.',
        'Financial Information: Information related to your credit, banking, or financial history.',
      ),
      li(
        'informasi Transaksional: Catatan transaksi atau layanan yang telah Anda akses melalui CLIK.',
        'Transactional Information: Records of transactions or services you have accessed through CLIK.',
      ),
      li(
        'Data Teknis: Data dari cookie, alamat IP, dan perilaku browsing Anda di situs web atau layanan kami (tidak diperlukan).',
        'Technical Data: Data from cookies, IP addresses, and your browsing behaviour on our website or services (not required).',
      ),
    ),

    h('3. Cara Kami Mengumpulkan Informasi Anda', '3. How We Collect Your Information'),
    p('Kami mengumpulkan informasi dari berbagai sumber, termasuk:', 'We collect information from a variety of sources, including:'),
    ul(
      li(
        'Langsung dari Anda: Kami mengumpulkan data pribadi melalui interaksi kami ketika Anda menghubungi kami, mengajukan pertanyaan, atau memberikan informasi melalui situs web atau layanan pelanggan kami. Kami juga mengumpulkan data pribadi dari Anda melalui produk kami, seperti saat Anda mendaftar untuk membuat akun. Beberapa informasi ini dikumpulkan tentang interaksi, penggunaan, dan pengalaman Anda dengan produk dan komunikasi kami.',
        'Directly from You: We collect personal data through our interactions when you contact us, submit enquiries, or provide information through our website or customer service. We also collect personal data from you through our products, such as when you register to create an account. Some of this information is collected about your interactions, usage, and experience with our products and communications.',
      ),
      li(
        'Dari Pihak Ketiga: Kami dapat menerima informasi Anda dari lembaga keuangan, lembaga non-keuangan, atau entitas lain yang berwenang untuk membagikan data Anda kepada kami.',
        'From Third Parties: We may receive your information from financial institutions, non-financial institutions, or other entities authorised to share your data with us.',
      ),
      li(
        'Secara Otomatis: Kami mengumpulkan data pribadi melalui teknologi seperti cookie atau alat pelacakan saat Anda berinteraksi dengan situs web, layanan online, dan aplikasi seluler kami.',
        'Automatically: We collect personal data through technologies such as cookies or tracking tools when you interact with our websites, online services, and mobile applications.',
      ),
    ),

    h('4. Cara Kami Menggunakan Informasi Anda', '4. How We Use Your Information'),
    p('Kami menggunakan informasi Anda untuk tujuan berikut:', 'We use your information for the following purposes:'),
    ul(
      li(
        'Penyediaan Layanan: Untuk menyediakan informasi kredit yang akurat dan layanan yang sesuai dengan kebutuhan Anda. Misalnya, jika Anda memberikan data pribadi untuk mengajukan keberatan atas informasi dalam laporan konsumen Anda, kami dapat menggunakan informasi tersebut untuk memperbarui laporan konsumen Anda.',
        'Service Provision: To provide accurate credit information and services that suit your needs. For example, if you provide personal data to dispute information in your consumer report, we may use that information to update your consumer report.',
      ),
      li(
        'Verifikasi: Untuk memverifikasi identitas, kelayakan kredit, dan menilai risiko untuk transaksi keuangan.',
        'Verification: To verify identity and creditworthiness, and to assess risk for financial transactions.',
      ),
      li(
        'Layanan Lain: Untuk mendukung aktivitas operasional yang memungkinkan penjelajahan halaman situs web dan pemrosesan statistik data yang dihasilkan. Kebijakan Privasi ini hanya berlaku untuk layanan dan situs web kami, dan tidak mencakup situs, halaman, atau layanan lain yang dapat diakses melalui hyperlink yang dipublikasikan di situs web kami.',
        'Other Services: To support operational activities that enable browsing of website pages and statistical processing of the data generated. This Privacy Policy applies only to our services and websites, and does not cover other sites, pages, or services that can be accessed through hyperlinks published on our website.',
      ),
      li(
        'Kepatuhan Hukum: Untuk mematuhi hukum, peraturan, atau perintah pengadilan yang berlaku. Melaksanakan kewajiban dan menegakkan hak kami yang timbul dari kontrak apa pun antara Anda dan kami, termasuk untuk penagihan dan pengumpulan.',
        'Legal Compliance: To comply with applicable laws, regulations, or court orders. To carry out our obligations and enforce our rights arising from any contract between you and us, including for billing and collection.',
      ),
      li(
        'Pemasaran: Untuk menawarkan layanan atau produk yang relevan, dengan persetujuan Anda jika diperlukan. Kami dapat mengiklankan dan memasarkan produk dan layanan, baik dari entitas yang berafiliasi maupun tidak berafiliasi, yang mencakup pengiriman komunikasi promosi, iklan yang ditargetkan, dan penawaran yang relevan.',
        'Marketing: To offer relevant services or products, with your consent where required. We may advertise and market products and services, from both affiliated and non-affiliated entities, including by sending promotional communications, targeted advertising, and relevant offers.',
      ),
    ),

    h('5. Cara Kami Membagikan Informasi Anda', '5. How We Share Your Information'),
    p('Kami dapat membagikan informasi pribadi Anda dengan:', 'We may share your personal information with:'),
    ul(
      li(
        'Lembaga Keuangan dan Non-Keuangan: Untuk mendukung manajemen risiko, kualitas debitur, sistem kontrol internal, kepatuhan, evaluasi kredit, dan layanan terkait lainnya.',
        'Financial and Non-Financial Institutions: To support risk management, debtor quality, internal control systems, compliance, credit evaluation, and other related services.',
      ),
      li(
        'Badan Regulasi: Jika diwajibkan oleh hukum, seperti untuk menanggapi pertanyaan regulasi atau proses hukum.',
        'Regulatory Bodies: Where required by law, such as to respond to regulatory enquiries or legal proceedings.',
      ),
      li(
        'Penyedia Layanan: Vendor pihak ketiga yang menyediakan layanan atas nama kami, seperti dukungan TI, analitik, penyedia platform, konsultan, outsourcing proses bisnis, layanan pelanggan, dan lainnya.',
        'Service Providers: Third-party vendors that provide services on our behalf, such as IT support, analytics, platform providers, consultants, business process outsourcing, customer service, and others.',
      ),
    ),

    h('6. Cara Kami Melindungi Informasi Anda', '6. How We Protect Your Information'),
    p(
      'Kami menerapkan langkah-langkah keamanan ketat untuk melindungi informasi Anda. Kami berkomitmen untuk melindungi keamanan data pribadi Anda dan menggunakan berbagai teknologi serta prosedur keamanan untuk membantu melindungi data pribadi Anda dari akses, penggunaan, atau pengungkapan yang tidak sah. Namun, tidak ada transmisi atau penyimpanan data yang dapat dijamin 100% aman. Dengan demikian, meskipun kami berupaya melindungi data pribadi yang kami kelola, kami tidak dapat memastikan atau menjamin keamanan informasi yang Anda kirimkan kepada kami, termasuk:',
      'We apply strict security measures to protect your information. We are committed to protecting the security of your personal data and use a variety of security technologies and procedures to help protect your personal data from unauthorised access, use, or disclosure. However, no data transmission or storage can be guaranteed to be 100% secure. Accordingly, although we strive to protect the personal data we manage, we cannot ensure or guarantee the security of the information you send to us, including:',
    ),
    ul(
      li('Enkripsi: Pengiriman data Anda yang aman menggunakan teknologi enkripsi.', 'Encryption: Secure transmission of your data using encryption technology.'),
      li('Kontrol Akses: Membatasi akses ke data Anda hanya kepada personel yang berwenang.', 'Access Control: Limiting access to your data to authorised personnel only.'),
      li('Audit Rutin: Melakukan audit dan pemantauan rutin terhadap praktik pemrosesan data kami.', 'Regular Audits: Conducting regular audits and monitoring of our data processing practices.'),
    ),
    p(
      'CLIK mematuhi undang-undang perlindungan data yang berlaku, termasuk undang-undang pemberitahuan pelanggaran keamanan.',
      'CLIK complies with applicable data protection laws, including security breach notification laws.',
    ),

    h('7. Hak dan Pilihan Anda', '7. Your Rights and Choices'),
    p(
      'Secara umum, pilihan terkait pengumpulan, penggunaan, dan pengungkapan informasi kami terbatas pada yang diatur oleh hukum. Anda memiliki hak-hak berikut terkait informasi pribadi Anda:',
      'In general, choices regarding our collection, use, and disclosure of information are limited to those provided by law. You have the following rights regarding your personal information:',
    ),
    ul(
      li('Akses: Anda dapat meminta akses ke informasi pribadi yang kami miliki tentang Anda.', 'Access: You may request access to the personal information we hold about you.'),
      li(
        'Koreksi: Anda dapat meminta kami untuk memperbaiki atau memperbarui informasi Anda jika tidak akurat atau sudah kadaluwarsa. CLIK memilih untuk menghapus informasi pribadi yang tidak akurat dari sistem dan aplikasi kami daripada memperbaikinya.',
        'Correction: You may ask us to correct or update your information if it is inaccurate or out of date. CLIK chooses to delete inaccurate personal information from our systems and applications rather than correct it.',
      ),
      li(
        'Keberatan: Anda dapat menolak pemrosesan data pribadi Anda untuk tujuan tertentu, seperti pemasaran langsung.',
        'Objection: You may object to the processing of your personal data for certain purposes, such as direct marketing.',
      ),
    ),
    p('Untuk menggunakan hak-hak ini, silakan hubungi kami melalui:', 'To exercise these rights, please contact us via:'),
    ul(
      li('Email: dpo@cbclik.com', 'Email: dpo@cbclik.com'),
      li('Telepon: (021) 80604228', 'Phone: (021) 80604228'),
      li('WhatsApp: +62 818-889-023', 'WhatsApp: +62 818-889-023'),
    ),
    p(
      'Untuk memastikan keamanan informasi pribadi dan mencegah permintaan yang tidak sah, kami mungkin perlu mengumpulkan data pribadi dan informasi lainnya, seperti nama, NIK, jenis kelamin, alamat, dan tanggal lahir Anda.',
      'To keep personal information secure and prevent unauthorised requests, we may need to collect personal data and other information, such as your name, national identity number (NIK), gender, address, and date of birth.',
    ),
    p(
      'Beberapa peramban mengirimkan sinyal “jangan lacak” ke situs web dan layanan online lainnya yang dikomunikasikan pengguna. Saat ini, kami tidak mengambil tindakan sebagai respons terhadap sinyal-sinyal ini.',
      'Some browsers send “do not track” signals, communicated by users, to websites and other online services. We currently do not take action in response to these signals.',
    ),

    h('8. Cookie dan Teknologi Pelacakan', '8. Cookies and Tracking Technologies'),
    p(
      'Situs web kami menggunakan cookie dan teknologi pelacakan serupa untuk meningkatkan pengalaman Anda. Anda dapat mengatur preferensi cookie melalui pengaturan browser Anda. Cookie adalah file teks yang disimpan oleh peramban perangkat yang menyimpan informasi. Informasi tersebut dapat diakses kembali ketika peramban kembali ke salah satu situs web kami.',
      'Our website uses cookies and similar tracking technologies to improve your experience. You can set your cookie preferences in your browser settings. Cookies are text files stored by a device’s browser that hold information. That information can be accessed again when the browser returns to one of our websites.',
    ),

    h('9. Perubahan pada Pemberitahuan Privasi Ini', '9. Changes to This Privacy Notice'),
    p(
      'Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Ketika kami melakukan perubahan, kami akan memposting pemberitahuan yang diperbarui di situs web kami dan memperbarui tanggal “Terakhir Diperbarui” pada awal kebijakan ini.',
      'We may update this Privacy Policy from time to time. When we make changes, we will post the updated notice on our website and update the “Last Updated” date at the beginning of this policy.',
    ),

    h('10. Hubungi Kami', '10. Contact Us'),
    // Figma breaks the address after "No. 1-2," and sets the contact lines
    // unbulleted, one per line.
    p(
      'Jika Anda memiliki pertanyaan atau kekhawatiran terkait Kebijakan Privasi ini atau praktik data kami, silakan hubungi kami di: PT CRIF Lembaga Informasi Keuangan Menara Dea Tower 2, Jl. Mega Kuningan Barat Blok E4.3 No. 1-2,',
      'If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at: PT CRIF Lembaga Informasi Keuangan Menara Dea Tower 2, Jl. Mega Kuningan Barat Blok E4.3 No. 1-2,',
    ),
    p('Kuningan Timur, Setiabudi, Jakarta 12950', 'Kuningan Timur, Setiabudi, Jakarta 12950'),
    p('Email: dpo@cbclik.com', 'Email: dpo@cbclik.com'),
    p('Telepon: (021) 80604228', 'Phone: (021) 80604228'),
    p('WhatsApp: +62 818-889-023', 'WhatsApp: +62 818-889-023'),
  ],
}

/* ---------------------------------------------------------------------------
 * Bagaimana cara mendapat laporan kredit Anda? — Figma 418:2433
 * ------------------------------------------------------------------------- */
// LEGAL REVIEW: Figma seed text (procedural), not approved copy.
const howToGetReport: PolicyPage = {
  key: 'how_to_get_credit_report',
  needsLegalReview: true,
  // Figma text has textCase TITLE: the h1 renders in Title Case, the
  // breadcrumb keeps the sentence-case characters.
  title: { id: 'Bagaimana Cara Mendapat Laporan Kredit Anda?', en: 'How Do You Get Your Credit Report?' },
  crumb: { id: 'Bagaimana cara mendapat laporan kredit Anda?', en: 'How do you get your credit report?' },
  layout: 'howTo',
  body: [],
  howTo: {
    intro: {
      lead: { id: 'Silakan datang langsung ke kantor kami ', en: 'Please come in person to our office, ' },
      company: { id: 'PT CRIF Lembaga Informasi Keuangan', en: 'PT CRIF Lembaga Informasi Keuangan' },
      // Figma reads "No 1-2,Kuningan"; the missing space after the comma is fixed.
      address: {
        id: 'di Menara Dea Tower II, Lantai 8, suite 803, Jl. Mega Kuningan Barat Blok E4.3 No 1-2, Kuningan Timur, Setiabudi, Jakarta 12950',
        en: 'at Menara Dea Tower II, 8th Floor, Suite 803, Jl. Mega Kuningan Barat Blok E4.3 No 1-2, Kuningan Timur, Setiabudi, Jakarta 12950',
      },
    },
    columns: [
      {
        image: '/images/policies/individual.png',
        heading: { id: 'Individual', en: 'Individual' },
        items: [
          { text: { id: 'KTP asli, atau Passport untuk Warga Negara Asing.', en: 'Original KTP (identity card), or Passport for foreign nationals.' } },
          { text: { id: 'Formulir Permintaan Data', en: 'Data Request Form' }, href: DATA_REQUEST_FORM_HREF },
        ],
      },
      {
        image: '/images/policies/badan-usaha.png',
        heading: { id: 'Badan Usaha', en: 'Business Entity' },
        items: [
          { text: { id: 'NPWP.', en: 'NPWP (Tax ID number).' } },
          { text: { id: 'Dokumen Legalitas berusaha lainnya.', en: 'Other business legal documents.' } },
          { text: { id: 'Formulir Permintaan Data', en: 'Data Request Form' }, href: DATA_REQUEST_FORM_HREF },
        ],
      },
    ],
    note: {
      id: 'Pada pengecekkan laporan kredit secara individu harus dilakukan oleh individu sendiri untuk datang ke kantor kami. Dan bagi perusahaan, harus dilakukan oleh pengurus sesuai yang tertera pada Akte Perusahaan.',
      en: "An individual credit report check must be made by the individual in person at our office. For companies, it must be made by an officer listed in the company's Deed of Establishment.",
    },
  },
}

/* ---------------------------------------------------------------------------
 * Penyelesaian Pengaduan — Figma 418:2844
 * ------------------------------------------------------------------------- */
// LEGAL REVIEW: Figma seed text (regulatory commitments incl. the 20-day SLA), not approved copy.
const complaintResolution: PolicyPage = {
  key: 'complaint_resolution',
  needsLegalReview: true,
  title: { id: 'Penyelesaian Pengaduan', en: 'Complaint Resolution' },
  layout: 'relaxed',
  body: [
    p(
      'Debitur dapat menyampaikan pengaduan mengenai ketidak-akuratan data pada Informasi Perkreditan atas nama dirinya sendiri yang dihasilkan oleh PT CRIF Lembaga Informasi Keuangan.',
      'Debtors may submit complaints about inaccurate data in the Credit Information in their own name produced by PT CRIF Lembaga Informasi Keuangan.',
    ),
    p(
      'Dalam menindak-lanjuti pengaduan Debitur atau Nasabah, PT CRIF Lembaga Informasi Keuangan akan melakukan langkah-langkah sebagai berikut:',
      'In following up a complaint from a Debtor or Customer, PT CRIF Lembaga Informasi Keuangan will take the following steps:',
    ),
    {
      type: 'ol',
      items: [
        li(
          'Penelitian atas permasalahan yang diadukan berdasarkan dokumen dan/atau data yang dimiliki,',
          'Examining the issue raised in the complaint based on the documents and/or data held,',
        ),
        li(
          'Berkoordinasi dengan pihak yang memberikan data apabila terdapat indikasi ketidak-akuratan data,',
          'Coordinating with the party that provided the data if there is an indication of inaccurate data,',
        ),
        li(
          'Melakukan koreksi atas ketidak-akuratan data atau hasil olahan data.',
          'Correcting the inaccurate data or processed data results.',
        ),
      ],
    },
    p(
      'Dalam ketidak-akuratan data disebabkan kesalahan pengolahan data yang dilakukan PT CRIF Lembaga Informasi Keuangan, maka jangka waktu penyelesaian pengaduan ditetapkan paling lambat 20 (dua puluh) hari kerja sejak tanggal diterimanya pengaduan. Apabila penyelesaian pengaduan dalam jangka waktu tersebut diperkirakan tidak dapat dilaksanakan, PT CRIF Lembaga Informasi Keuangan berhak meminta perpanjangan jangka waktu penyelesaian pengaduan kepada Debitur atau Nasabah.',
      'Where the inaccuracy is caused by a data processing error made by PT CRIF Lembaga Informasi Keuangan, the complaint will be resolved no later than 20 (twenty) working days from the date the complaint is received. If the complaint is not expected to be resolved within that period, PT CRIF Lembaga Informasi Keuangan is entitled to ask the Debtor or Customer for an extension of the resolution period.',
    ),
    p(
      'Dalam hal ketidak-akuratan data yang berasal dari Lembaga Keuangan Sumber Data, maka jangka waktu yang diberikan kepada Lembaga Keuangan untuk melakukan koreksi data tunduk pada ketentuan yang dikeluarkan oleh masing-masing otoritas yang berwenang mengatur Lembaga Keuangan tersebut.',
      'Where the inaccurate data originates from the Data Source Financial Institution, the time given to the Financial Institution to correct the data is subject to the provisions issued by the respective authority that regulates that Financial Institution.',
    ),
    p(
      'Untuk pengaduan dan penyelesaian masalah, debitur dapat datang langsung ke kantor PT CRIF Lembaga Informasi Keuangan di:',
      'For complaints and problem resolution, debtors may come in person to the office of PT CRIF Lembaga Informasi Keuangan at:',
    ),
    {
      type: 'p',
      italic: true,
      text: {
        id: 'Menara Dea, Tower II, Lantai 8, suite 803, Jl. Mega Kuningan Barat Blok E4.3 No 1-2, Kuningan Timur, Setiabudi, Jakarta 12950',
        en: 'Menara Dea, Tower II, 8th Floor, Suite 803, Jl. Mega Kuningan Barat Blok E4.3 No 1-2, Kuningan Timur, Setiabudi, Jakarta 12950',
      },
    },
    p(
      'Dengan diwajibkan mempersiapkan dan mengisi dokumen sebagai berikut:',
      'They are required to prepare and complete the following documents:',
    ),
    ul(
      li(
        'Debitur Perorangan: KTP asli atau Passport Asli untuk Warga Negara Asing',
        'Individual Debtors: Original KTP (identity card), or original Passport for foreign nationals',
      ),
      li(
        'Debitur Badan Usaha: NPWP dan dokumen legalitas Badan Usaha',
        'Business Entity Debtors: NPWP (Tax ID number) and the business entity’s legal documents',
      ),
      li('Mengisi formulir pengaduan dengan lengkap', 'A fully completed complaint form'),
    ),
  ],
}

export const policyPages: PolicyPage[] = [informationSecurity, privacy, howToGetReport, complaintResolution]
