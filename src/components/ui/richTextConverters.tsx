import type { CSSProperties, JSX } from 'react'
import {
  defaultJSXConverters,
  type JSXConvertersFunction,
} from '@payloadcms/richtext-lexical/react'
import styles from './RichText.module.css'

/*
 * Payload's stock converters drop three things the editor toolbar can produce,
 * so each one is replaced here:
 *
 *  - Alignment. ParagraphJSXConverter and HeadingJSXConverter ignore
 *    node.format, so a centred paragraph came out left-aligned on the live
 *    page. Same for indent.
 *  - Table borders. The stock cell converter hardcodes an inline
 *    `border: 1px solid #ccc`, and an inline style beats the stylesheet — so
 *    CLIK tables rendered in generic grey. These emit classes instead and let
 *    RichText.module.css own the look.
 *  - Image captions. The `caption` field added to inserted images in
 *    src/fields/editor.ts had nowhere to render.
 */

type AlignableNode = { format?: string | number; indent?: number }

/** Turns a Lexical node's alignment and indent into a style object. */
function layoutStyle(node: AlignableNode): CSSProperties | undefined {
  const style: CSSProperties = {}

  // Block nodes carry the alignment as a word; text nodes use a bitmask, which
  // is not alignment at all, so only strings are read here.
  const align = typeof node.format === 'string' ? node.format : ''
  if (align) style.textAlign = align as CSSProperties['textAlign']

  if (node.indent && node.indent > 0) style.paddingInlineStart = `${node.indent * 32}px`

  return Object.keys(style).length ? style : undefined
}

type UploadValue = {
  url?: string
  filename?: string
  mimeType?: string
  width?: number
  height?: number
  alt?: string
}

export const richTextConverters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,

  paragraph: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({ nodes: node.children })
    // An empty paragraph is a deliberate blank line; keep it visible.
    if (!children?.length) return <p><br /></p>
    return <p style={layoutStyle(node as AlignableNode)}>{children}</p>
  },

  heading: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({ nodes: node.children })
    const Tag = node.tag as keyof JSX.IntrinsicElements
    return <Tag style={layoutStyle(node as AlignableNode)}>{children}</Tag>
  },

  table: ({ node, nodesToJSX }) => (
    <div className={styles.tableScroll}>
      <table>
        <tbody>{nodesToJSX({ nodes: node.children })}</tbody>
      </table>
    </div>
  ),

  tablerow: ({ node, nodesToJSX }) => <tr>{nodesToJSX({ nodes: node.children })}</tr>,

  tablecell: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({ nodes: node.children })
    const Tag = node.headerState > 0 ? 'th' : 'td'
    return (
      <Tag
        colSpan={node.colSpan && node.colSpan > 1 ? node.colSpan : undefined}
        rowSpan={node.rowSpan && node.rowSpan > 1 ? node.rowSpan : undefined}
        style={node.backgroundColor ? { backgroundColor: node.backgroundColor } : undefined}
      >
        {children}
      </Tag>
    )
  },

  upload: ({ node }) => {
    if (typeof node.value !== 'object' || !node.value) return null
    const doc = node.value as UploadValue
    const fields = (node.fields ?? {}) as { alt?: string; caption?: string }
    const alt = fields.alt || doc.alt || ''
    const caption = fields.caption?.trim()

    if (!doc.url) return null

    // Anything that is not an image (a PDF attached to a report, say) becomes
    // a download link rather than a broken image.
    if (!doc.mimeType?.startsWith('image')) {
      return (
        <a href={doc.url} rel="noopener noreferrer" target="_blank">
          {doc.filename ?? doc.url}
        </a>
      )
    }

    /*
     * A plain <img>, not next/image. The editor drops these anywhere in the
     * flow, so there is no layout to size them against, and the URL is the
     * Payload media route — which the optimiser would need an entry in
     * next.config.ts localPatterns for. See docs/editing-content.md.
     */
    const img = <img alt={alt} src={doc.url} width={doc.width} height={doc.height} />

    if (!caption) return img
    return (
      <figure className={styles.figure}>
        {img}
        <figcaption>{caption}</figcaption>
      </figure>
    )
  },
})

export { defaultJSXConverters }
