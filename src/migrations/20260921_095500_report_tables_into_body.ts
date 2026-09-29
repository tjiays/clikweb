import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/*
 * Moves each report's financialTables rows into its body rich text as real
 * Lexical tables.
 *
 * The figures were in a field of their own, on a separate tab from the text
 * they belong to, so an editor opening Laporan Tahunan 2025 could not see the
 * balance sheet the website was showing. Afterwards everything the page shows
 * is in the one editor, where it can be read and changed in place.
 *
 * Both reports_locales.body (what the site serves) and the latest
 * _reports_v_locales.version_body (what the admin opens) are written. Older
 * version rows are history and are left as they are. The financialTables rows
 * are left in place too: ReportsPage renders them only while a report's body
 * has no table of its own, so this is reversible.
 */

const text = (t: string, bold = false) => ({
  mode: 'normal', text: t, type: 'text', style: '', detail: 0,
  format: bold ? 1 : 0, version: 1,
})

/** A paragraph, splitting embedded newlines as the existing bodies do. */
const para = (t: string, { align = '', bold = false } = {}) => {
  const children: unknown[] = []
  String(t).split('\n').forEach((line, i) => {
    if (i > 0) children.push({ type: 'linebreak', version: 1 })
    if (line !== '') children.push(text(line, bold))
  })
  return { type: 'paragraph', format: align, indent: 0, version: 1, children, direction: 'ltr' }
}

const cell = (t: string, header: boolean, bold: boolean, width: number) => ({
  type: 'tablecell', format: '', indent: 0, version: 1, direction: 'ltr',
  children: [para(t, { bold })],
  headerState: header ? 1 : 0, colSpan: 1, rowSpan: 1,
  backgroundColor: null, width,
})

// Of the 996px table in Figma: 76/24 where the block has a title, else 60/40.
const W = { wide: [757, 239], normal: [598, 398] } as const

type Row = { label: string | null; value: string | null; emphasis: string | null; gap_before: boolean | null }

const tableNode = (rows: Row[], variant: 'wide' | 'normal') => ({
  type: 'table', format: '', indent: 0, version: 1, direction: 'ltr',
  colWidths: [...W[variant]],
  children: rows.map((r) => ({
    type: 'tablerow', format: '', indent: 0, version: 1, direction: 'ltr',
    children: [
      // The label keeps its row-header role, as the current markup has it.
      cell(r.label ?? '', true, r.emphasis === 'row' || r.emphasis === 'label', W[variant][0]),
      cell(r.value ?? '', false, r.emphasis === 'row', W[variant][1]),
    ],
  })),
})

export async function up({ db, payload }: MigrateUpArgs): Promise<void> {
  const parents = await db.execute(
    sql`select distinct _parent_id as report_id from reports_financial_tables order by 1`)

  for (const { report_id } of parents.rows as { report_id: number }[]) {
    const tables = await db.execute(
      sql`select id from reports_financial_tables where _parent_id = ${report_id} order by _order`)

    for (const locale of ['id', 'en']) {
      const nodes: unknown[] = []

      for (const { id: tableId } of tables.rows as { id: string }[]) {
        const meta = await db.execute(sql`
          select intro, title, caption from reports_financial_tables_locales
           where _parent_id = ${tableId} and _locale = ${locale}`)
        const m = (meta.rows[0] ?? {}) as { intro?: string; title?: string; caption?: string }

        const rws = await db.execute(sql`
          select r.value, r.emphasis, r.gap_before, rl.label
            from reports_financial_tables_rows r
            left join reports_financial_tables_rows_locales rl
              on rl._parent_id = r.id and rl._locale = ${locale}
           where r._parent_id = ${tableId} order by r._order`)

        if (m.intro) nodes.push(para(m.intro))
        if (m.title) nodes.push(para(m.title, { align: 'center', bold: true }))
        if (m.caption) nodes.push(para(m.caption, { align: 'center' }))

        // A row marked "gap before" starts a new block, as the page does.
        const segments: Row[][] = []
        for (const r of rws.rows as unknown as Row[]) {
          if (segments.length === 0 || r.gap_before) segments.push([])
          segments[segments.length - 1].push(r)
        }
        const variant = m.title ? 'wide' : 'normal'
        for (const seg of segments) if (seg.length) nodes.push(tableNode(seg, variant))
      }

      if (!nodes.length) continue

      const targets = [
        { rows: await db.execute(sql`select id, body from reports_locales where _parent_id = ${report_id} and _locale = ${locale}`), table: 'reports_locales' },
        { rows: await db.execute(sql`select l.id, l.version_body as body from _reports_v_locales l join _reports_v v on v.id = l._parent_id where v.parent_id = ${report_id} and v.latest is true and l._locale = ${locale}`), table: '_reports_v_locales' },
      ]

      for (const { rows, table } of targets) {
        const row = rows.rows[0] as { id: number; body: { root?: { children?: unknown[] } } } | undefined
        if (!row) continue
        const body = row.body ?? { root: { type: 'root', format: '', indent: 0, version: 1, children: [], direction: 'ltr' } }
        if (JSON.stringify(body).includes('"type":"table"')) {
          payload.logger.info(`${table} ${locale} report ${report_id}: already has tables, skipped`)
          continue
        }
        body.root!.children = [...(body.root!.children ?? []), ...nodes]
        const json = JSON.stringify(body)
        if (table === 'reports_locales') {
          await db.execute(sql`update reports_locales set body = ${json}::jsonb where id = ${row.id}`)
        } else {
          await db.execute(sql`update _reports_v_locales set version_body = ${json}::jsonb where id = ${row.id}`)
        }
        payload.logger.info(`${table} ${locale} report ${report_id}: +${nodes.length} nodes`)
      }
    }
  }
}

export async function down({ db, payload }: MigrateDownArgs): Promise<void> {
  // Strip the table nodes and the centred title/caption paragraphs back off,
  // leaving the original prose. The financialTables rows were never removed,
  // so the page returns to rendering from them.
  const strip = (body: { root?: { children?: { type?: string }[] } } | null) => {
    if (!body?.root?.children) return null
    const firstTable = body.root.children.findIndex((n) => n?.type === 'table')
    if (firstTable === -1) return null
    // Walk back over the intro/title/caption paragraphs that introduce it.
    let cut = firstTable
    while (cut > 0 && body.root.children[cut - 1]?.type === 'paragraph') cut--
    body.root.children = body.root.children.slice(0, cut)
    return body
  }

  for (const [table, col] of [['reports_locales', 'body'], ['_reports_v_locales', 'version_body']] as const) {
    const rows = await db.execute(sql`select id, ${sql.raw(col)} as body from ${sql.raw(table)}`)
    for (const row of rows.rows as { id: number; body: never }[]) {
      const next = strip(row.body)
      if (!next) continue
      const json = JSON.stringify(next)
      if (table === 'reports_locales') {
        await db.execute(sql`update reports_locales set body = ${json}::jsonb where id = ${row.id}`)
      } else {
        await db.execute(sql`update _reports_v_locales set version_body = ${json}::jsonb where id = ${row.id}`)
      }
      payload.logger.info(`${table} row ${row.id}: tables stripped`)
    }
  }
}
