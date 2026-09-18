import { RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import styles from './RichText.module.css'

/** Renders CMS rich text: headings, lists, links, images and tables. */
export function RichText({
  data,
  className,
}: {
  data: unknown
  className?: string
}) {
  if (!data) return null
  return (
    <div className={className ? `${styles.prose} ${className}` : styles.prose}>
      <LexicalRichText data={data as SerializedEditorState} />
    </div>
  )
}
