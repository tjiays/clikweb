/**
 * Partner testimonials shown on the homepage (Figma Component 4, 627:5394).
 *
 * Page content lives in code, not the CMS: it changes rarely and a developer
 * edits it alongside the layout. Change the wording here and redeploy.
 * Logos are in public/images/home/partners/ (exported from Figma).
 *
 * The design uses nine cards (three pages of three) with placeholder partner
 * logos and lorem-ipsum quotes — replace them with real partners and quotes
 * when they are available.
 *
 * logo: width/height are the logo's size in px, and x/y its position inside
 * the 454x216 card, as drawn in Figma.
 */

const placeholderQuote =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat'

type Logo = { src: string; width: number; height: number; x: number; y: number }

const logos: Record<string, Logo> = {
  WebbyFrames: { src: '/images/home/partners/webbyframes.svg', width: 181, height: 39, x: 25, y: 21 },
  Zoomerr: { src: '/images/home/partners/zoomerr.svg', width: 133, height: 32, x: 26, y: 18 },
  SHELLS: { src: '/images/home/partners/shells.svg', width: 125, height: 32, x: 27, y: 27 },
  kontrastr: { src: '/images/home/partners/kontrastr.svg', width: 131, height: 30, x: 30, y: 30 },
  SmartFinder: { src: '/images/home/partners/smartfinder.svg', width: 177, height: 32, x: 27, y: 27 },
  ArtVenue: { src: '/images/home/partners/artvenue.svg', width: 166, height: 32, x: 27, y: 27 },
}

/** Card order as in Figma (Group 2327). */
const order = ['WebbyFrames', 'Zoomerr', 'SHELLS', 'kontrastr', 'SmartFinder', 'ArtVenue', 'Zoomerr', 'SHELLS', 'kontrastr']

export const testimonials: {
  partnerName: string
  logo?: Logo
  quote: { id: string; en: string }
}[] = order.map((partnerName) => ({
  partnerName,
  logo: logos[partnerName],
  quote: { id: placeholderQuote, en: placeholderQuote },
}))
