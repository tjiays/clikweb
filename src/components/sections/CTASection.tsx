import type { CSSProperties } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ChevronRight } from '@/components/ui/icons'
import { Container } from '@/components/layout/Container'
import type { Locale } from '@/i18n/config'
import { href } from '@/i18n/routes'
import type { CtaBlock, CtaButton } from '@/content/cta'
import { t } from '@/lib/content'
import styles from './CTASection.module.css'

/**
 * The closing block at the bottom of a page: an optional cross-link card
 * (Credit Scoring, Frame 2427) and an optional closing banner. Everything —
 * copy, image, 1–2 buttons, sizes — is configured per page in
 * src/content/cta.ts; pass the page's entry (or undefined for none).
 *
 *   const cta = ctaBlocks.find((b) => b.page === 'about')
 *   <CTASection block={cta} locale={locale} />
 *
 * Put it last on the page: the banner sits directly on the footer (the
 * footer's top margin is dropped via the data-flush-footer marker).
 */
export function CTASection({ block, locale }: { block?: CtaBlock; locale: Locale }) {
  if (!block) return null

  const cross = block.crossLink
  const banner = block.banner
  const hasBanner = Boolean(banner && t(banner.title, locale))

  const buttonHref = (button: CtaButton) =>
    button.route ? href(button.route, locale) : button.link || '#'

  return (
    <>
      {cross && (
        <Container className={styles.crossWrap}>
          {cross.heading && <h2 className={styles.crossHeading}>{t(cross.heading, locale)}</h2>}
          <Link
            href={cross.route ? href(cross.route, locale) : cross.targetUrl || '#'}
            className={styles.cross}
          >
            {cross.image && (
              <Image
                src={cross.image}
                alt=""
                width={568}
                height={378}
                className={styles.crossImage}
              />
            )}
            <span className={styles.crossBody}>
              <span className={styles.crossLabel}>
                <ChevronRight className={styles.crossChevron} />
                {t(cross.label, locale)}
              </span>
              <span className={styles.crossTitle}>{t(cross.title, locale)}</span>
            </span>
          </Link>
        </Container>
      )}

      {hasBanner && banner && (
        <section
          data-flush-footer=""
          className={`${styles.banner} ${banner.variant === 'plain' ? styles.plain : styles.image}`}
          style={
            {
              '--cta-height': banner.height ? `${banner.height}px` : undefined,
              '--cta-pad-top': banner.paddingTop !== undefined ? `${banner.paddingTop}px` : undefined,
              '--cta-gap-1': banner.gaps ? `${banner.gaps[0]}px` : undefined,
              '--cta-gap-2': banner.gaps ? `${banner.gaps[1]}px` : undefined,
              '--cta-title-weight': banner.titleWeight,
              '--cta-title-lh': banner.titleLineHeight ? `${banner.titleLineHeight}px` : undefined,
              '--cta-title-max': banner.titleMaxWidth ? `${banner.titleMaxWidth}px` : undefined,
              '--cta-text-max': banner.textMaxWidth ? `${banner.textMaxWidth}px` : undefined,
              '--cta-offset-x': banner.offsetX ? `${banner.offsetX}px` : undefined,
            } as CSSProperties
          }
        >
          {banner.variant !== 'plain' && banner.backgroundImage && (
            <>
              <Image
                src={banner.backgroundImage}
                alt=""
                fill
                sizes="100vw"
                className={styles.bannerImage}
              />
              <div className={styles.bannerOverlay} />
            </>
          )}
          <Container className={styles.bannerInner}>
            <h2 className={styles.bannerTitle}>{t(banner.title, locale)}</h2>
            {banner.text && t(banner.text, locale) && (
              <p className={styles.bannerText}>{t(banner.text, locale)}</p>
            )}
            {banner.buttons.length > 0 && (
              <div className={styles.buttons}>
                {banner.buttons.map((button) => (
                  <Button key={buttonHref(button)} href={buttonHref(button)} width={button.width}>
                    {t(button.label, locale)}
                  </Button>
                ))}
              </div>
            )}
          </Container>
        </section>
      )}
    </>
  )
}
