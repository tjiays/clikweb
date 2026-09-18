import styles from './ShareBar.module.css'

/**
 * Share to X, Facebook, WhatsApp and LinkedIn using each platform's standard
 * share URL with this page's address and title (intent/04 §3).
 */
export function ShareBar({
  url,
  title,
  label,
}: {
  url: string
  title: string
  label: string
}) {
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const targets = [
    { name: 'X', href: `https://x.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`, path: 'M4 4l16 16M20 4L4 20' },
    { name: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, path: 'M15 3h-3a4 4 0 00-4 4v3H5v4h3v7h4v-7h3l1-4h-4V7a1 1 0 011-1h3z' },
    { name: 'WhatsApp', href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`, path: 'M21 12a9 9 0 01-13.4 7.8L3 21l1.2-4.6A9 9 0 1121 12z' },
    { name: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, path: 'M6 9v10M6 6v.01M11 19v-5a3 3 0 016 0v5' },
  ]

  return (
    <div className={styles.share}>
      <span className={styles.label}>{label}</span>
      <ul className={styles.list}>
        {targets.map((target) => (
          <li key={target.name}>
            <a
              href={target.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={target.name}
              className={styles.button}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d={target.path}
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
