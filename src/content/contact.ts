/**
 * Hubungi Kami page copy (Figma 284:1397). The Figma ID frame keeps the form
 * field texts in English; the intro and the DATA PRIVACY block are
 * Indonesian. English versions are faithful translations.
 *
 * Page content lives in code, not the CMS. Change the wording here and
 * redeploy. Company details (address, e-mail, phone, map) are in site.ts.
 */

export const contactPage = {
  /** Two paragraphs, Title Case in Figma (textCase TITLE). */
  intro: {
    id: [
      'Tertarik dengan penawaran kami atau ingin mengetahui lebih lanjut?',
      'Hubungi kami untuk pertanyaan, kekhawatiran, atau bantuan apa pun yang Anda butuhkan.',
    ],
    en: [
      'Interested in what we offer or want to find out more?',
      'Contact us with any question, concern or help you need.',
    ],
  },
  visitUs: { id: 'Visit Us:', en: 'Visit Us:' },
  emailUs: { id: 'E-mail Us', en: 'E-mail Us' },
  callUs: { id: 'Call Us', en: 'Call Us' },

  /** Placeholders inside the pill fields (Figma 295:1615). */
  fields: {
    firstName: { id: 'First name *', en: 'First name *' },
    lastName: { id: 'Last name *', en: 'Last name *' },
    email: { id: 'Business Email *', en: 'Business Email *' },
    companyName: { id: 'Company Name *', en: 'Company Name *' },
    phone: { id: 'Telephone *', en: 'Telephone *' },
    interestedIn: { id: 'Interested in: *', en: 'Interested in: *' },
    hearAboutUs: { id: 'How did you hear about us? *', en: 'How did you hear about us? *' },
    messageLabel: { id: 'Tell us about your business needs. *', en: 'Tell us about your business needs. *' },
    message: { id: 'Message', en: 'Message' },
  },

  /** What each dropdown shows before the visitor picks (Figma 295:1605 / 295:1603). */
  defaults: {
    interestedIn: 'General Enquiries',
    hearAboutUs: 'Conference/Exhibition',
  },

  privacy: {
    title: { id: 'DATA PRIVACY', en: 'DATA PRIVACY' },
    intro: {
      id: 'Dalam rangka merespons permintaan kontak Anda mengenai aktivitas dan layanan yang disediakan oleh CRIF Pte. Ltd. ("CRIF") dan/atau oleh perusahaan afiliasi CRIF. Kontak ini akan dilakukan melalui komunikasi jarak jauh di mana kami meminta persetujuan Anda. Persetujuan Anda untuk tujuan ini bersifat wajib dan, tanpanya, kami tidak akan dapat membalas permintaan kontak Anda. Informasi apa pun yang Anda berikan tentang diri Anda akan digunakan sesuai dengan Pernyataan Privasi, yang tersedia di situs web kami.',
      en: 'In order to respond to your contact request about the activities and services provided by CRIF Pte. Ltd. ("CRIF") and/or by CRIF affiliated companies. This contact will take place through remote communication, for which we ask for your consent. Your consent for this purpose is mandatory and, without it, we will not be able to reply to your contact request. Any information you provide about yourself will be used in accordance with the Privacy Statement, available on our website.',
    },
    consent: {
      id: 'PERSETUJUAN UNTUK MERESPONS PERMINTAAN KONTAK ANDA (WAJIB)',
      en: 'CONSENT TO RESPOND TO YOUR CONTACT REQUEST (MANDATORY)',
    },
    marketingIntro: {
      id: 'Jika Anda berkenan, Anda dapat memberikan persetujuan kepada kami untuk tujuan pengiriman materi iklan, komersial, dan informasi (tujuan pemasaran) yang berkaitan dengan CRIF atau perusahaan afiliasi CRIF. Dalam hal ini, persetujuan Anda tidak bersifat wajib, namun CRIF tidak akan memberikan materi iklan, komersial, dan informasi kepada Anda.',
      en: 'If you wish, you may give us your consent to send advertising, commercial and informational material (marketing purposes) relating to CRIF or CRIF affiliated companies. In this case your consent is not mandatory, but CRIF will not provide you with advertising, commercial and informational material.',
    },
    marketingPrompt: {
      id: 'Silakan centang kotak yang relevan di bawah ini jika Anda setuju untuk menerima materi pemasaran berikut:',
      en: 'Please tick the relevant boxes below if you agree to receive the following marketing material:',
    },
    /** Figma 300:1753 is cut off after "apa" (the text box is too narrow);
        "apa pun" is the full phrase. */
    optOut: {
      id: 'Saya tidak ingin menerima informasi pemasaran apa pun',
      en: 'I do not wish to receive any marketing information',
    },
    optIn: {
      id: 'Saya ingin menerima informasi tentang barang dan layanan yang mungkin disediakan oleh CRIF dan/atau perusahaan afiliasi CRIF, termasuk (tetapi tidak terbatas pada) penawaran, promosi, dan informasi tentang barang dan layanan baru, melalui saluran berikut:',
      en: 'I would like to receive information about goods and services that may be provided by CRIF and/or CRIF affiliated companies, including (but not limited to) offers, promotions and information about new goods and services, through the following channels:',
    },
    /** Figma order. `value` is what is stored with the submission. */
    channels: [
      { value: 'Newsletter', label: { id: 'Buletin (Newsletter)', en: 'Newsletter' } },
      { value: 'Email', label: { id: 'Email', en: 'Email' } },
      { value: 'SMS/WhatsApp', label: { id: 'Pesan teks (SMS/WhatsApp)', en: 'Text message (SMS/WhatsApp)' } },
      { value: 'Telephone', label: { id: 'Panggilan telepon', en: 'Phone call' } },
    ],
  },
}
