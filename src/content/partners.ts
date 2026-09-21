/**
 * Member and regulator logos shown in the footer and on About.
 *
 * Page content lives in code, not the CMS: it changes rarely and a developer
 * edits it alongside the layout. Change the wording here and redeploy.
 * Images are in public/images/shared/ and public/images/about/members/.
 */

export const partnerLogos = [
  { name: 'OJK', logo: '/images/shared/logo-ojk.png', url: '', group: 'regulator' },
  { name: 'AFPI', logo: '/images/shared/logo-afpi.png', url: '', group: 'member' },
  { name: 'BIIA', logo: '/images/shared/logo-biia.jpeg', url: '', group: 'member' },
  { name: 'Fintech Indonesia (AFTECH)', logo: '/images/shared/logo-aftech.png', url: '', group: 'member' },
  { name: 'APPI', logo: '/images/shared/logo-appi.png', url: '', group: 'member' },
]

export type MemberLogo = { name: string; logo: string; width: number; height: number }

/*
 * "Member CLIK" on Tentang CLIK (Figma 564:3710 / 564:3711): two 3-column
 * grids of 8 rows, one per institution type.
 *
 * TODO: these are the Figma placeholder logos (WebbyFrames, ArtVenue, …), the
 * design's stand-ins for real CLIK members. Replace each entry with a real
 * member's name and logo (put the files in public/images/about/members/,
 * about 180x40, transparent background) once the list is approved.
 * Keep 3 logos per row; any count works, the grid simply grows.
 */
const placeholderRow = (name: string, file: string, width: number, height: number): MemberLogo[] =>
  Array.from({ length: 3 }, () => ({ name, logo: `/images/about/members/${file}.svg`, width, height }))

const placeholderGrid = (): MemberLogo[] => [
  ...placeholderRow('WebbyFrames', 'webbyframes', 181, 39),
  ...placeholderRow('WebbyFrames', 'webbyframes-muted', 181, 39),
  ...placeholderRow('WavesMarathon', 'wavesmarathon', 187, 32),
  ...placeholderRow('ArtVenue', 'artvenue', 166, 32),
  ...placeholderRow('SmartFinder', 'smartfinder', 176, 32),
  ...placeholderRow('Shells', 'shells', 124, 32),
  ...placeholderRow('Zoomerr', 'zoomerr', 133, 32),
  ...placeholderRow('Kontrastr', 'kontrastr', 131, 29),
]

export const clikMembers: { financial: MemberLogo[]; nonFinancial: MemberLogo[] } = {
  financial: placeholderGrid(),
  nonFinancial: placeholderGrid(),
}
