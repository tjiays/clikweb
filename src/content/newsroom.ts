/**
 * Media outlets, the coverage listed under each, and the logo marquee at the
 * top of the Newsroom. Articles stay in the CMS.
 *
 * Lives in code, not the CMS. Change the wording here and redeploy.
 */

export type Logo = {
  name: string
  /** Monochrome #697077 artwork, 32px tall at 1x (Figma "logo" component). */
  src: string
  /** Rendered size in px at desktop, from the Figma frame. */
  width: number
  height: number
}

/**
 * One repeating set of the Newsroom logo marquee — Figma 685:3668 ("Component
 * 6"), left to right. The set is 1454px wide with the 23px gaps, and it scrolls
 * right-to-left one set every 10 s (145.4 px/s), so the list ends with a repeat
 * of the first two logos exactly as in the design.
 *
 * These are the brand marks the design uses.
 */
const L = (name: string, file: string, width: number, height = 32): Logo => ({
  name,
  src: `/images/newsroom/logos/${file}.svg`,
  width,
  height,
})

export const mediaLogoStrip: Logo[] = [
  L('WAVESMARATHON', 'wavesmarathon', 187),
  L('ArtVenue', 'artvenue', 166),
  L('kontrastr', 'kontrastr', 131, 30),
  L('SHELLS', 'shells', 124),
  L('SmartFinder', 'smartfinder', 176),
  L('Zoomerr', 'zoomerr', 133),
  L('WAVESMARATHON', 'wavesmarathon', 187),
  L('ArtVenue', 'artvenue', 166),
]

/** Figma timer: 1454px per 10 s. */
export const mediaLogoStripSeconds = 10
export const mediaLogoStripGap = 23

/** A media outlet with a Liputan Media page (Figma 827:5603). */
export type MediaOutlet = {
  slug: string
  name: string
}

/** Figma names one outlet, on its Liputan Media page 827:5603 ("Kumparan"). */
export const mediaOutlets: MediaOutlet[] = [{ slug: 'kumparan', name: 'Kumparan' }]

/**
 * The "Daftar Media" buttons (Figma 825:5491-5498), in reading order: row by
 * row, left then right. Each shows a logo from the design, and every one of
 * them opens the Liputan Media page (Variant2 → 827:5603 in the prototype).
 * `dx` nudges a logo off centre where Figma places it off centre.
 */
export type MediaListButton = { logo: Logo; outlet: string; dx?: number }

export const mediaListButtons: MediaListButton[] = [
  { logo: L('ArtVenue', 'artvenue', 166), outlet: 'kumparan' }, // 825:5492
  { logo: L('WAVESMARATHON', 'wavesmarathon', 187), outlet: 'kumparan', dx: 3 }, // 825:5491
  { logo: L('Zoomerr', 'zoomerr', 133), outlet: 'kumparan', dx: -7 }, // 825:5494
  { logo: L('SHELLS', 'shells', 124), outlet: 'kumparan', dx: -8 }, // 825:5493
  { logo: L('kontrastr', 'kontrastr', 131, 30), outlet: 'kumparan' }, // 825:5495
  { logo: L('SmartFinder', 'smartfinder', 176), outlet: 'kumparan' }, // 825:5496
  { logo: L('SHELLS', 'shells', 124), outlet: 'kumparan' }, // 825:5498
  { logo: L('ArtVenue', 'artvenue', 166), outlet: 'kumparan' }, // 825:5497
]

/**
 * Coverage listed on each outlet's Liputan Media page: Newsroom articles, by
 * slug, in the order of Figma 827:5603 (cards 827:5615, 827:5628).
 */
export const mediaCoverage: { outlet: string; article: string }[] = [
  { outlet: 'kumparan', article: 'temukan-nasabah-berikutnya-sebelum-kompetitor' },
  { outlet: 'kumparan', article: 'apa-itu-risiko-kredit-dan-cara-menghindarinya' },
]
