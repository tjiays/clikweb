/*
 * Moves each report's financialTables rows into its body rich text as real
 * Lexical tables, so the one editor shows everything the website shows.
 *
 * Writes both reports_locales.body (what the site serves) and the latest
 * _reports_v_locales.version_body (what the admin opens for editing). Older
 * version rows are left alone: they are history.
 */
import pg from 'pg'

const DRY = process.argv.includes('--dry')
const client = new pg.Client({ connectionString: process.env.DATABASE_URI })
await client.connect()

const text = (t, bold = false) => ({
  mode: 'normal', text: t, type: 'text', style: '', detail: 0,
  format: bold ? 1 : 0, version: 1,
})

/** A paragraph, splitting embedded newlines into linebreak nodes as the existing body does. */
const para = (t, { align = '', bold = false } = {}) => {
  const children = []
  String(t).split('\n').forEach((line, i) => {
    if (i > 0) children.push({ type: 'linebreak', version: 1 })
    if (line !== '') children.push(text(line, bold))
  })
  return { type: 'paragraph', format: align, indent: 0, version: 1, children, direction: 'ltr' }
}

const cell = (t, { header, bold, width }) => ({
  type: 'tablecell', format: '', indent: 0, version: 1, direction: 'ltr',
  children: [para(t, { bold })],
  headerState: header ? 1 : 0, colSpan: 1, rowSpan: 1,
  backgroundColor: null, width: width ?? null,
})

const LABEL_W = { wide: 757, normal: 598 }   // of a 996px table: 76% / 60%
const VALUE_W = { wide: 239, normal: 398 }

const tableNode = (rows, variant) => ({
  type: 'table', format: '', indent: 0, version: 1, direction: 'ltr',
  colWidths: [LABEL_W[variant], VALUE_W[variant]],
  children: rows.map((r) => ({
    type: 'tablerow', format: '', indent: 0, version: 1, direction: 'ltr',
    children: [
      // The label keeps its row-header role, as the current markup has it.
      cell(r.label ?? '', { header: true, bold: r.emphasis === 'row' || r.emphasis === 'label', width: LABEL_W[variant] }),
      cell(r.value ?? '', { header: false, bold: r.emphasis === 'row', width: VALUE_W[variant] }),
    ],
  })),
})

const { rows: reports } = await client.query(
  `select distinct ft._parent_id as report_id from reports_financial_tables ft order by 1`)

for (const { report_id } of reports) {
  const { rows: tables } = await client.query(
    `select ft.id, ft._order from reports_financial_tables ft where ft._parent_id=$1 order by ft._order`, [report_id])

  for (const locale of ['id', 'en']) {
    const nodes = []

    for (const t of tables) {
      const { rows: meta } = await client.query(
        `select intro, title, caption from reports_financial_tables_locales where _parent_id=$1 and _locale=$2`, [t.id, locale])
      const m = meta[0] ?? {}
      const { rows: rws } = await client.query(
        `select r._order, r.value, r.emphasis, r.gap_before, rl.label
           from reports_financial_tables_rows r
           left join reports_financial_tables_rows_locales rl
             on rl._parent_id = r.id and rl._locale = $2
          where r._parent_id = $1 order by r._order`, [t.id, locale])

      if (m.intro) nodes.push(para(m.intro))
      if (m.title) nodes.push(para(m.title, { align: 'center', bold: true }))
      if (m.caption) nodes.push(para(m.caption, { align: 'center' }))

      // A row marked "gap before" starts a new block, as the page does today.
      const segments = []
      for (const r of rws) {
        if (segments.length === 0 || r.gap_before) segments.push([])
        segments[segments.length - 1].push(r)
      }
      const variant = m.title ? 'wide' : 'normal'
      for (const seg of segments) if (seg.length) nodes.push(tableNode(seg, variant))
    }

    if (!nodes.length) continue

    for (const [table, col, idCol] of [
      ['reports_locales', 'body', '_parent_id'],
      ['_reports_v_locales', 'version_body', '_parent_id'],
    ]) {
      const where = table === 'reports_locales'
        ? `${idCol} = $1`
        : `${idCol} = (select id from _reports_v where parent_id = $1 and latest is true)`
      const { rows: cur } = await client.query(
        `select id, ${col} as body from ${table} where ${where} and _locale = $2`, [report_id, locale])
      if (!cur.length) { console.log(`  ! ${table} ${locale} report ${report_id}: no row`); continue }

      const body = cur[0].body ?? { root: { type: 'root', format: '', indent: 0, version: 1, children: [], direction: 'ltr' } }
      const already = JSON.stringify(body).includes('"type":"table"')
      if (already) { console.log(`  = ${table} ${locale} report ${report_id}: already has tables, skipped`); continue }

      body.root.children = [...(body.root.children ?? []), ...nodes]
      console.log(`  ${DRY ? '[dry] ' : ''}${table} ${locale} report ${report_id}: +${nodes.length} nodes (${nodes.filter(n=>n.type==='table').length} tables)`)
      if (!DRY) await client.query(`update ${table} set ${col} = $1 where id = $2`, [JSON.stringify(body), cur[0].id])
    }
  }
}

await client.end()
console.log(DRY ? '\nDry run — nothing written.' : '\nDone.')
