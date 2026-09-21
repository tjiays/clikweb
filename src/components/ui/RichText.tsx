import { RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import styles from './RichText.module.css'

/**
 * Renders CMS rich text: headings, lists, links, images and tables, with the
 * Figma body style (16/400 black, line 21.8; `variant="relaxed"` for line 30).
 * Headings are 24/700 navy; lists have disc / decimal markers, 24px indent.
 */
export function RichText({
  data,
  className,
  variant = 'dense',
}: {
  data: unknown
  className?: string
  variant?: 'dense' | 'relaxed'
}) {
  if (!data) return null
  const classes = [styles.prose, variant === 'relaxed' ? styles.relaxed : '', className]
    .filter(Boolean)
    .join(' ')
  return (
    <div className={classes}>
      <LexicalRichText data={data as SerializedEditorState} />
    </div>
  )
}
