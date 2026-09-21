/**
 * Icons in the Fitur Utama & Keunggulan cards (Figma 1145:4297 clock,
 * 1145:4306 database, 1145:4332 shield, 1145:4352 people, 1145:4342 document).
 */
export type FeatureIconName = 'clock' | 'database' | 'shield' | 'people' | 'document'

export function FeatureIcon({ name }: { name: FeatureIconName }) {
  switch (name) {
    case 'clock':
      return (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
          <circle cx="20" cy="20" r="16.5" fill="#4F46E5" />
          <path d="M20 11v9.5l5.5 4" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'database':
      return (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
          <ellipse cx="20" cy="9.5" rx="15" ry="5.5" fill="#16A34A" />
          <path d="M5 13.5c0 3 6.7 5.5 15 5.5s15-2.5 15-5.5v6c0 3-6.7 5.5-15 5.5S5 22.5 5 19.5v-6Z" fill="#16A34A" />
          <path d="M5 23.5c0 3 6.7 5.5 15 5.5s15-2.5 15-5.5v6c0 3-6.7 5.5-15 5.5S5 32.5 5 29.5v-6Z" fill="#16A34A" />
        </svg>
      )
    case 'shield':
      return (
        <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden="true">
          <path d="M17 3 6 7.3v8.3C6 23 10.7 28.6 17 31c6.3-2.4 11-8 11-15.4V7.3L17 3Z" fill="#3B82F6" />
        </svg>
      )
    case 'people':
      return (
        <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden="true">
          <circle cx="17" cy="12.5" r="3.6" fill="#0D9488" />
          <circle cx="8.2" cy="14.3" r="2.8" fill="#0D9488" />
          <circle cx="25.8" cy="14.3" r="2.8" fill="#0D9488" />
          <path d="M10.6 25.5c0-3.6 2.9-6.4 6.4-6.4s6.4 2.8 6.4 6.4h-12.8Z" fill="#0D9488" />
          <path d="M3 25.5c0-2.8 2.2-5 5-5 1.2 0 2.2.4 3.1 1-.9 1.1-1.5 2.5-1.6 4H3Z" fill="#0D9488" />
          <path d="M31 25.5c0-2.8-2.2-5-5-5-1.2 0-2.2.4-3.1 1 .9 1.1 1.5 2.5 1.6 4H31Z" fill="#0D9488" />
        </svg>
      )
    case 'document':
    default:
      return (
        <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden="true">
          <path d="M9 3h11l7 7v19a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" fill="#F59E0B" />
          <path d="M20 3v7h7" fill="#FCD34D" />
          <path d="M11.5 18h11M11.5 23h11" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
  }
}
