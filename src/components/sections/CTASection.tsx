import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/layout/Container'
import type { Locale } from '@/i18n/config'
import { t } from '@/lib/content'
import styles from './CTASection.module.css'

type Pair = { id: string; en: string }

type Block = {
  page: string
  crossLink?: { label: Pair; title: Pair; image: string; targetUrl: string }
  banner?: {
    backgroundImage: string
    title: Pair
    text: Pair
    buttonLabel: Pair
    buttonLink: string
  }
}

/**
 * The closing block at the bottom of most pages: a cross-link card and a
 * "Siap…" banner. Either half is optional (confirmed decision 7).
 *
 * The blocks live in src/content/cta.ts.
 */
export function CTASection({ block, locale }: { block?: Block; locale: Locale }) {
  if (!block) return null

  const cross = block.crossLink
  const banner = block.banner
  const hasBanner = banner && (t(banner.title, locale) || t(banner.buttonLabel, locale))

  return (
    <>
      {cross && (
        <Container>
          <Link href={cross.targetUrl || '#'} className={styles.cross}>
            {cross.image && (
              <Image
                src={cross.image}
                alt=""
                width={480}
                height={320}
                className={styles.crossImage}
              />
            )}
            <span className={styles.crossBody}>
              <span className={styles.crossLabel}>{t(cross.label, locale)}</span>
              <span className="t-h3">{t(cross.title, locale)}</span>
            </span>
          </Link>
        </Container>
      )}

      {hasBanner && banner && (
        <section className={styles.banner}>
          {banner.backgroundImage && (
            <Image
              src={banner.backgroundImage}
              alt=""
              fill
              sizes="100vw"
              className={styles.bannerImage}
            />
          )}
          <div className={styles.bannerOverlay} />
          <Container className={styles.bannerInner}>
            <h2 className="t-cta-title">{t(banner.title, locale)}</h2>
            {t(banner.text, locale) && (
              <p className={styles.bannerText}>{t(banner.text, locale)}</p>
            )}
            {t(banner.buttonLabel, locale) && (
              <Button href={banner.buttonLink || '#'} size="lg">
                {t(banner.buttonLabel, locale)}
              </Button>
            )}
          </Container>
        </section>
      )}
    </>
  )
}
