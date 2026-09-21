import type { ReactNode } from 'react'
import type { Locale } from '@/i18n/config'
import styles from './RichText.module.css'

type Pair = { id: string; en: string }

type ListItem = Pair | { text: Pair; children?: ListBlock }
type ListBlock = { type: 'ul' | 'ol'; items: ListItem[]; start?: number }

/**
 * A block of `src/content` prose. A plain `{ id, en }` pair is a paragraph
 * (the original format, still accepted); the object forms add structure:
 *
 *   { type: 'heading', text: {id, en}, level?: 2 | 3 }
 *   { type: 'p', text: {id, en}, italic?: true }
 *   { type: 'ul' | 'ol', items: [ {id, en} | { text: {id, en}, children: <ul/ol block> } ] }
 */
export type ProseBlock =
  | Pair
  | { type: 'heading'; text: Pair; level?: 2 | 3 }
  | { type: 'p'; text: Pair; italic?: boolean }
  | ListBlock

/**
 * Renders the prose arrays used by src/content. The CMS still returns
 * Lexical rich text for articles and reports — that goes through RichText.
 *
 * `variant`
 *   'dense'   (default) 16/400, line 21.8, black — articles, policies, jobs
 *   'relaxed' 16/400, line 30, black — Penyelesaian Pengaduan, About body
 * Paragraphs are separated by one empty line (one line height), lists are
 * indented 24px with no extra space between items, headings are 24/700 navy
 * (set --prose-heading-weight to change, e.g. 600 on Kebijakan Keamanan).
 */
export function Prose({
  body,
  locale,
  className,
  variant = 'dense',
}: {
  body?: ProseBlock[]
  locale: Locale
  className?: string
  variant?: 'dense' | 'relaxed'
}) {
  if (!body || body.length === 0) return null
  const classes = [styles.prose, variant === 'relaxed' ? styles.relaxed : '', className]
    .filter(Boolean)
    .join(' ')
  return <div className={classes}>{body.map((block, index) => renderBlock(block, locale, index))}</div>
}

function isPair(value: unknown): value is Pair {
  return typeof value === 'object' && value !== null && 'id' in value && 'en' in value && !('type' in value)
}

function renderBlock(block: ProseBlock, locale: Locale, key: number): ReactNode {
  if (isPair(block)) return <p key={key}>{block[locale]}</p>
  switch (block.type) {
    case 'heading': {
      const Tag = block.level === 3 ? 'h3' : 'h2'
      return <Tag key={key}>{block.text[locale]}</Tag>
    }
    case 'p':
      return (
        <p key={key} className={block.italic ? styles.italic : undefined}>
          {block.text[locale]}
        </p>
      )
    case 'ul':
    case 'ol':
      return renderList(block, locale, key)
    default:
      return null
  }
}

function renderList(block: ListBlock, locale: Locale, key: number): ReactNode {
  const Tag = block.type
  return (
    <Tag key={key} start={block.type === 'ol' ? block.start : undefined}>
      {block.items.map((item, index) => {
        if (isPair(item)) return <li key={index}>{item[locale]}</li>
        return (
          <li key={index}>
            {item.text[locale]}
            {item.children && renderList(item.children, locale, index)}
          </li>
        )
      })}
    </Tag>
  )
}
