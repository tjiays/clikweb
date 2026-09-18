/**
 * The CLIK logo on the admin login screen, replacing Payload's own.
 * Served from public/brand, so it needs no media library lookup.
 */
export default function Logo() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0.5rem 0 1.5rem',
      }}
    >
      {/* A plain img, not next/image: the admin panel renders outside the
          site's image pipeline. */}
      <img
        src="/images/shared/logo-clik.png"
        alt="CLIK — CRIF Lembaga Informasi Keuangan"
        style={{ height: 64, width: 'auto' }}
      />
    </div>
  )
}
