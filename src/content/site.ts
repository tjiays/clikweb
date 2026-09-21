/**
 * Company details, shown in the footer and on the Contact page.
 *
 * Lives in code, not the CMS. Change the wording here and redeploy.
 */

export const site = {
  companyName: 'PT CRIF Lembaga Informasi Keuangan',
  /** One-line address (Contact page, Figma 295:1638 area). */
  address: {
    id: 'Menara Dea Tower 2, Lantai 2, suite 203, Jl. Mega Kuningan Barat Blok E4.3 No 1-2, Kuningan Timur, Setiabudi, Jakarta 12950',
    en: 'Menara Dea Tower 2, 2nd Floor, Suite 203, Jl. Mega Kuningan Barat Blok E4.3 No 1-2, Kuningan Timur, Setiabudi, Jakarta 12950',
  },
  /** The same address as the footer breaks it (Figma 99:50). */
  addressLines: {
    id: ['Menara Dea Tower 2, Lantai 2, suite 203,', 'Jl. Mega Kuningan Barat Blok E4.3 No 1-2, Kuningan Timur, Setiabudi, Jakarta 12950'],
    en: ['Menara Dea Tower 2, 2nd Floor, Suite 203,', 'Jl. Mega Kuningan Barat Blok E4.3 No 1-2, Kuningan Timur, Setiabudi, Jakarta 12950'],
  },
  /** Contact page format. */
  phone: '(+62) 21 8060 4228',
  /** Footer format (Figma 99:50). */
  footerPhone: '(021) 80604228',
  generalEmail: 'info@cbclik.com',
  salesEmail: 'sales@cbclik.com',
  careersEmail: 'talent@cbclik.com',
  websiteUrl: 'https://www.cbclik.com',
  crifUrl: 'https://www.crif.com',
  /** Caption beside the OJK logo in the footer (Figma 101:107). */
  ojkLicenceLabel: 'LICENSE',
  ojkLicenceNumber: 'NO. KEP-179/D.03/2019',
  /** Menara Dea Tower 2, Mega Kuningan — keyless Google Maps embed. */
  mapEmbedUrl: 'https://www.google.com/maps?q=Menara+Dea+Tower+2,+Jl.+Mega+Kuningan+Barat,+Jakarta+12950&z=17&output=embed',
  /** Footer order follows Figma 99:42: WhatsApp, Instagram, LinkedIn. */
  socialLinks: [
    { platform: 'whatsapp', url: 'https://wa.me/622180604228', icon: '/images/shared/icon-social-whatsapp.svg' },
    { platform: 'instagram', url: 'https://www.instagram.com/clik.indonesia/', icon: '/images/shared/icon-social-instagram.svg' },
    { platform: 'linkedin', url: 'https://www.linkedin.com/company/clik-indonesia/', icon: '/images/shared/icon-social-linkedin.svg' },
  ],
}
