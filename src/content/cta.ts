/**
 * The closing block at the bottom of each page, rendered by CTASection.
 *
 * Lives in code, not the CMS. Change the wording here and redeploy.
 *
 * A page with no entry here (e.g. Layanan dan Produk, PROD-23) shows no CTA.
 *
 * banner
 *   variant   'image' (default): full-bleed photo + black 50% overlay, white
 *             text, sits directly on the footer (Home 156:1072, Business
 *             Solution 1254:4587, Credit Scoring 1625:10985).
 *             'plain': no image, page background, navy title and black
 *             subtitle (About 407:2319).
 *   title / text        { id, en } — Indonesian verbatim from Figma.
 *   titleWeight         700 | 800 | 900 (Figma differs per page)
 *   titleMaxWidth       px width of the title box in Figma
 *   buttons             1–2 buttons: { label, route (RouteKey) | link, width }
 * crossLink (Credit Scoring, Frame 2427): heading + one bordered card.
 */

import type { RouteKey } from '@/i18n/routes'

export type Pair = { id: string; en: string }

export type CtaButton = {
  label: Pair
  /** A page key from src/i18n/routes.ts (preferred: localised automatically)… */
  route?: RouteKey
  /** …or a raw URL. */
  link?: string
  /** Figma width in px (applied as min-width). */
  width?: number
}

export type CtaBanner = {
  variant?: 'image' | 'plain'
  backgroundImage?: string
  title: Pair
  text?: Pair
  titleWeight?: 700 | 800 | 900
  titleMaxWidth?: number
  textMaxWidth?: number
  /** Title line height in px (default 51.8, Figma "auto" for 38px). */
  titleLineHeight?: number
  /** Band height in px (default 429). */
  height?: number
  /** Space above the title in px (default 57). */
  paddingTop?: number
  /** [title→text, text→buttons] in px (default [31, 31]). */
  gaps?: [number, number]
  /** Horizontal nudge of the content from the 70px column edge (Home: -10). */
  offsetX?: number
  buttons: CtaButton[]
}

export type CtaCrossLink = {
  heading?: Pair
  label: Pair
  title: Pair
  image: string
  route?: RouteKey
  targetUrl?: string
}

export type CtaBlock = {
  page: string
  crossLink?: CtaCrossLink
  banner?: CtaBanner
}

const contactButton: CtaButton = {
  label: { id: 'Hubungi Kami', en: 'Contact Us' },
  route: 'contact',
  width: 135,
}

export const ctaBlocks: CtaBlock[] = [
  {
    // Figma 156:1072: 432 tall, title 38/900 line 48 at x=60, 785 wide.
    page: 'home',
    banner: {
      backgroundImage: '/images/cta/home.jpg',
      title: { id: 'Siap Mengoptimalkan Keputusan Kredit Bisnis Anda?', en: 'Ready to Optimise Your Business Credit Decisions?' },
      titleWeight: 900,
      titleMaxWidth: 785,
      titleLineHeight: 48,
      height: 432,
      paddingTop: 84,
      gaps: [32, 32],
      offsetX: -10,
      buttons: [contactButton],
    },
  },
  {
    // Figma 407:2319 / 407:2321 / 407:2365 / 407:2366: no image.
    page: 'about',
    banner: {
      variant: 'plain',
      title: { id: 'Siap Membangun Ekosistem Kredit yang Lebih Kuat Bersama Kami?', en: 'Ready to Build a Stronger Credit Ecosystem With Us?' },
      text: {
        id: 'Bergabunglah dengan lebih dari 2.688 lembaga yang telah mempercayakan data dan analitik kredit mereka kepada CLIK.',
        en: 'Join more than 2,688 institutions that have entrusted their credit data and analytics to CLIK.',
      },
      titleWeight: 800,
      titleMaxWidth: 1300,
      textMaxWidth: 1147,
      paddingTop: 55,
      gaps: [10, 24],
      buttons: [
        contactButton,
        { label: { id: 'Lihat Layanan Kami', en: 'View Our Services' }, route: 'products', width: 175 },
      ],
    },
  },
  {
    // Figma 1254:4587 (Frame 2393): 429 tall, title 38/700, text 24/600.
    page: 'business-solution',
    banner: {
      backgroundImage: '/images/cta/business-solution.jpg',
      title: {
        id: 'Wujudkan keputusan bisnis yang lebih presisi, efisien, dan berbasis data bersama CLIK.',
        en: 'Make more precise, efficient and data-driven business decisions with CLIK.',
      },
      text: {
        id: 'Tim kami siap mendampingi institusi Anda merancang solusi informasi keuangan dan manajemen risiko yang tepat sesuai kebutuhan bisnis Anda.',
        en: 'Our team is ready to help your institution design the financial information and risk management solutions that fit your business needs.',
      },
      titleWeight: 700,
      titleMaxWidth: 821,
      textMaxWidth: 821,
      buttons: [contactButton],
    },
  },
  {
    page: 'credit-scoring',
    // Figma Frame 2427 (1625:10981)
    crossLink: {
      heading: {
        id: 'Temukan solusi yang sesuai dengan kebutuhan bisnis Anda.',
        en: 'Find the solution that fits your business needs.',
      },
      label: { id: 'Layanan dan Produk', en: 'Products & Services' },
      title: { id: 'Business Solution', en: 'Business Solution' },
      image: '/images/cta/cross-business-solution.jpg',
      route: 'businessSolution',
    },
    // Figma Group 2373 (1625:10985): 429 tall, title 38/700 one line.
    banner: {
      backgroundImage: '/images/cta/credit-scoring.jpg',
      title: {
        id: 'Siap Meningkatkan Akurasi dan Kecepatan Keputusan Kredit Anda?',
        en: 'Ready to Improve the Accuracy and Speed of Your Credit Decisions?',
      },
      text: {
        id: 'Jadwalkan sesi demo dan konsultasi gratis bersama tim CLIK untuk melihat bagaimana Credit Scoring kami dapat disesuaikan dengan kebutuhan bisnis Anda.',
        en: 'Book a free demo and consultation with the CLIK team to see how our Credit Scoring can be tailored to your business needs.',
      },
      titleWeight: 700,
      titleMaxWidth: 1300,
      textMaxWidth: 1096,
      gaps: [17, 20],
      buttons: [contactButton],
    },
  },
]
