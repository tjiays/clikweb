/**
 * Orange icons on the Layanan dan Produk route cards (Figma 425:2977 document
 * 44x58, 427:2451 shield 54x60).
 */
export function RouteIcon({ name, className }: { name: 'document' | 'shield'; className?: string }) {
  if (name === 'shield') {
    return (
      <svg className={className} width="54" height="60" viewBox="0 0 54 60" fill="none" aria-hidden="true">
        <path
          d="M27 2 4 10.5v17.3C4 43 13.8 53.6 27 58c13.2-4.4 23-15 23-30.2V10.5L27 2Z"
          stroke="#FF7D00"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <path d="M27 16v17" stroke="#FF7D00" strokeWidth="4.5" strokeLinecap="round" />
        <circle cx="27" cy="41.5" r="2.7" fill="#FF7D00" />
      </svg>
    )
  }
  return (
    <svg className={className} width="44" height="58" viewBox="0 0 44 58" fill="none" aria-hidden="true">
      <path d="M2 2h27l13 13v41H2V2Z" stroke="#FF7D00" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M29 2v13h13" stroke="#FF7D00" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M10 27h24M10 34h24M10 41h16" stroke="#FF7D00" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}
