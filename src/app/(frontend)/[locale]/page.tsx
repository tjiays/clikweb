import { Container } from '@/components/layout/Container'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { Button } from '@/components/ui/Button'
import { getDictionary } from '@/i18n'
import { isLocale } from '@/i18n/config'
import { href } from '@/i18n/routes'
import { notFound } from 'next/navigation'
import styles from './page.module.css'

/*
 * Phase 1 deliverable: a specimen page proving the design system, the shared
 * components and the bilingual routing all work together. The real homepage
 * (hero slider, stats, carousels, news) is built in Phase 3 against Figma
 * frame 156:1049.
 */

const TYPE_SCALE = [
  { cls: 't-display', token: 'display', spec: '60 / 700', use: 'Home hero title' },
  { cls: 't-display-sub', token: 'display-sub', spec: '38 / 800', use: 'Home hero subtitle' },
  { cls: 't-h1', token: 'h1', spec: '38 / 800', use: 'Page and section titles' },
  { cls: 't-cta-title', token: 'cta-title', spec: '38 / 900', use: 'Closing CTA banner' },
  { cls: 't-h2', token: 'h2', spec: '30 / 800', use: 'Featured article title' },
  { cls: 't-card-title', token: 'card-title', spec: '26 / 800', use: 'Article and report cards' },
  { cls: 't-h3', token: 'h3', spec: '24 / 700', use: 'Sub-section titles' },
  { cls: 't-lead', token: 'lead', spec: '24 / 400', use: 'Intro paragraphs' },
  { cls: 't-h4', token: 'h4', spec: '20 / 700', use: 'Small headings' },
  { cls: 't-h5', token: 'h5', spec: '18 / 600', use: 'Step titles' },
  { cls: 't-body-strong', token: 'body-strong', spec: '16 / 700', use: 'Nav items, dates' },
  { cls: 't-small', token: 'small', spec: '14 / 400', use: 'Card descriptions' },
  { cls: 't-link-caps', token: 'link-caps', spec: '14 / 800', use: 'READ MORE' },
  { cls: 't-caption', token: 'caption', spec: '12 / 400', use: 'Job category, labels' },
]

const COLORS = [
  { name: 'primary', value: '#FF7D00' },
  { name: 'primary-light', value: '#FFBB7B' },
  { name: 'secondary', value: '#003A79' },
  { name: 'text-body', value: '#5B6B81' },
  { name: 'text-muted', value: '#697077' },
  { name: 'bg-tint', value: '#F1FAFF' },
  { name: 'border', value: '#DBE4F0' },
  { name: 'disabled', value: '#C1C7CD' },
]

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const dict = await getDictionary(locale)

  return (
    <>
      <section className={styles.hero}>
        <Container>
          <p className={styles.phase}>Phase 1 — Foundation and design system</p>
          <h1 className="t-display">CLIK</h1>
          <p className="t-lead">
            Leading Indonesia&apos;s Intelligence Credit Bureau
          </p>
          <div className={styles.actions}>
            <Button href={href('contact', locale)}>{dict.common.contactUs}</Button>
            <Button href={href('about', locale)} variant="outline">
              {dict.common.learnMore}
            </Button>
          </div>
        </Container>
      </section>

      <Container>
        <div className={styles.block}>
          <Breadcrumb
            label={dict.common.breadcrumb}
            items={[
              { label: dict.nav.home, href: href('home', locale) },
              { label: dict.nav.about },
            ]}
          />
        </div>

        <section className={styles.block}>
          <h2 className="t-h1 section-rule">Type scale</h2>
          <p>
            Nunito Sans, self-hosted. Sizes and weights come from the Figma page
            frames, recorded in <code>intent/01-design-system.md</code>.
          </p>
          <div className={styles.specimen}>
            {TYPE_SCALE.map((row) => (
              <div key={row.token} className={styles.specimenRow}>
                <div className={styles.specimenMeta}>
                  <code>{row.token}</code>
                  <span>{row.spec}</span>
                  <span className={styles.specimenUse}>{row.use}</span>
                </div>
                <div className={row.cls}>Keputusan kredit yang lebih cerdas</div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.block}>
          <h2 className="t-h1 section-rule">Colour tokens</h2>
          <p>
            Near-duplicate shades found in Figma are merged into one orange and
            one navy, per confirmed decision 2.
          </p>
          <ul className={styles.swatches}>
            {COLORS.map((color) => (
              <li key={color.name} className={styles.swatch}>
                <span
                  className={styles.swatchChip}
                  style={{ background: color.value }}
                  aria-hidden="true"
                />
                <code>{color.name}</code>
                <span className={styles.swatchValue}>{color.value}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.block}>
          <h2 className="t-h1 section-rule">Buttons</h2>
          <div className={styles.actions}>
            <Button>{dict.common.contactUs}</Button>
            <Button variant="outline">{dict.common.learnMore}</Button>
            <Button variant="ghost">{dict.common.seeMore}</Button>
            <Button disabled>{dict.common.readMore}</Button>
          </div>
        </section>
      </Container>
    </>
  )
}
