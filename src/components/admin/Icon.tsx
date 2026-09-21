/**
 * The mark at the start of the breadcrumb trail, which links back to the
 * dashboard — on a nested page the trail reads "⌂ › Artikel › Edit".
 *
 * It used to be the full CLIK wordmark, which duplicated the logo already in
 * the sidebar a few centimetres to its left. A home glyph keeps the link
 * working without repeating the branding.
 */
export default function Icon() {
  return (
    <span
      aria-label="Dashboard"
      style={{
        display: 'grid',
        placeItems: 'center',
        width: 26,
        height: 26,
        borderRadius: 6,
        background: '#eef3f9',
        color: '#003a79',
      }}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M3 11l9-8 9 8M6 10v9a1 1 0 001 1h3v-6h4v6h3a1 1 0 001-1v-9"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}
