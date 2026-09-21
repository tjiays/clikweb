import type { CSSProperties, ReactNode } from 'react'
import styles from './SectionTitle.module.css'

type Align = 'left' | 'center'

/**
 * Section title as drawn throughout Figma: navy #003A79 text with the orange
 * ornament above it — left: 40x3 bar, 10px gap, 10x3 dash (427:2846);
 * centred: 10 | 40 | 10 (781:3535). Radius 2, 10px above the title.
 *
 * Props
 *   align      'left' (default) | 'center'
 *   size       'lg' 38px (default) | 'md' 24px
 *   weight     800 (default) | 700 | 600
 *   rule       true (default) shows the ornament; false hides it (Home titles)
 *   ruleGap    px between ornament and title (default 10; Newsroom sidebar 5,
 *              Careers 8)
 *   tone       'navy' (default) | 'black'
 *   subtitle   optional text under the title
 *   subtitleVariant
 *              'lead' (default) 23.75/400, line 32.4, #000 — Home section intros
 *              'body' 16/400, line 30, #000
 *              'strong' 23.75/800, line 32.4, #000 — About closing CTA
 *   as         heading tag (default h2)
 *   className  extra class on the <header> (e.g. margins; default margin-bottom 40px)
 *
 *   <SectionTitle>Visi</SectionTitle>
 *   <SectionTitle size="md" align="center">Nilai-Nilai Kami</SectionTitle>
 *   <SectionTitle align="center" rule={false} subtitle="…">Berita Terbaru Kami</SectionTitle>
 */
export function SectionTitle({
  children,
  subtitle,
  align = 'left',
  size = 'lg',
  weight = 800,
  rule = true,
  ruleGap,
  tone = 'navy',
  subtitleVariant = 'lead',
  as: Tag = 'h2',
  className,
}: {
  children: ReactNode
  subtitle?: ReactNode
  align?: Align
  size?: 'lg' | 'md'
  weight?: 800 | 700 | 600
  rule?: boolean
  ruleGap?: number
  tone?: 'navy' | 'black'
  subtitleVariant?: 'lead' | 'body' | 'strong'
  as?: 'h1' | 'h2' | 'h3'
  className?: string
}) {
  const headerClass = [styles.header, align === 'center' ? styles.center : '', className]
    .filter(Boolean)
    .join(' ')
  const titleClass = [
    styles.title,
    styles[size],
    styles[`w${weight}`],
    tone === 'black' ? styles.black : '',
    rule ? 'section-rule' : '',
    rule && align === 'center' ? 'section-rule--center' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <header className={headerClass}>
      <Tag
        className={titleClass}
        style={ruleGap !== undefined ? ({ '--rule-space': `${ruleGap}px` } as CSSProperties) : undefined}
      >
        {children}
      </Tag>
      {subtitle && <p className={`${styles.subtitle} ${styles[subtitleVariant]}`}>{subtitle}</p>}
    </header>
  )
}

/**
 * The orange ornament on its own, e.g. the centred divider above the Home
 * "Tentang Kami" card (269:680). `align="center"` gives dash-bar-dash.
 */
export function SectionRule({ align = 'left', className }: { align?: Align; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={[
        styles.rule,
        'section-rule',
        align === 'center' ? 'section-rule--center' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    />
  )
}
