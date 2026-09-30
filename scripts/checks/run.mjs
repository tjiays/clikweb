/**
 * Repeatable checks for the security, reliability and functionality fixes of
 * September 2026. Run from the project root on a staging server:
 *
 *   node --env-file=.env --import tsx scripts/checks/run.mjs
 *   BASE=http://127.0.0.1:8080 node --env-file=.env --import tsx scripts/checks/run.mjs
 *
 * It creates its own accounts and content, all named ZZCHK, and removes them
 * — and their audit entries and emails — when it finishes, pass or fail.
 * Never run it against production: it creates users and submits enquiries.
 *
 * Each line is PASS, FAIL or SKIP; the exit code is the number of failures.
 * What each check guards, and why, is in docs/operations.md and the commit
 * that fixed it.
 */
import { getPayload } from 'payload'
import config from '../../src/payload.config.ts'

const BASE = process.env.BASE || 'http://127.0.0.1:8080'
const APP = process.env.APP || 'http://127.0.0.1:3000'
const MAILPIT = process.env.MAILPIT || 'http://127.0.0.1:8025/mailpit'
const PW = 'ZzchkProbe!2026'
const payload = await getPayload({ config })

// ---------------------------------------------------------------- helpers
const results = []
const check = async (group, name, fn) => {
  try {
    const r = await fn()
    const status = r === 'skip' || r?.skip ? 'SKIP' : r === true || r?.ok ? 'PASS' : 'FAIL'
    results.push({ group, name, status, note: typeof r === 'object' ? r.note ?? '' : '' })
  } catch (e) {
    results.push({ group, name, status: 'FAIL', note: String(e?.message ?? e).slice(0, 140) })
  }
}
const ok = (cond, note = '') => ({ ok: Boolean(cond), note })
const text = (t) => ({ root: { type: 'root', format: '', indent: 0, version: 1, direction: 'ltr',
  children: [{ type: 'paragraph', format: '', indent: 0, version: 1, direction: 'ltr', textFormat: 0,
    children: t ? [{ type: 'text', text: t, format: 0, detail: 0, mode: 'normal', style: '', version: 1 }] : [] }] } })
const png = () => {
  // A tiny valid PNG, built rather than stored.
  const crc = (buf) => { let c, t = []; for (let n = 0; n < 256; n++) { c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0 } let x = 0xffffffff; for (const b of buf) x = t[(x ^ b) & 0xff] ^ (x >>> 8); return (x ^ 0xffffffff) >>> 0 }
  const chunk = (type, data) => { const len = Buffer.alloc(4); len.writeUInt32BE(data.length); const td = Buffer.concat([Buffer.from(type), data]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([len, td, c]) }
  const w = 1200, h = 800, ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 2
  const raw = Buffer.alloc((w * 3 + 1) * h, 0x60); for (let y = 0; y < h; y++) raw[y * (w * 3 + 1)] = 0
  return Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), chunk('IHDR', ihdr), chunk('IDAT', require_zlib().deflateSync(raw)), chunk('IEND', Buffer.alloc(0))])
}
import zlib from 'node:zlib'
const require_zlib = () => zlib
const login = async (who) => {
  const r = await fetch(`${BASE}/api/users/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: `zzchk.${who}@cbclik.com`, password: PW }) })
  return r.headers.getSetCookie().map((c) => c.split(';')[0]).join('; ')
}
const api = async (path, { who, method = 'GET', body, headers = {}, base = BASE } = {}) => {
  const h = { ...headers }
  if (who) h.Cookie = jar[who]
  if (body && !(body instanceof FormData)) h['Content-Type'] = 'application/json'
  const r = await fetch(base + path, { method, headers: h, body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined, redirect: 'manual' })
  let json = null; const raw = await r.text(); try { json = JSON.parse(raw) } catch {}
  return { status: r.status, json, raw, headers: r.headers }
}
const anonReport = async (slug) => (await api(`/api/reports?where[slug][equals]=${slug}&depth=0`)).json?.totalDocs

// ---------------------------------------------------------------- setup
const ROLES = { super: 'super_admin', news: 'news_admin', hr: 'hr_admin', sales: 'sales_admin', approver: 'approver' }
const users = {}
for (const [who, role] of Object.entries(ROLES)) {
  users[who] = await payload.create({ collection: 'users', overrideAccess: true,
    data: { name: 'ZZCHK Probe', email: `zzchk.${who}@cbclik.com`, password: PW, role, _verified: true } })
}
const jar = {}
for (const who of Object.keys(ROLES)) jar[who] = await login(who)
const su = users.super
const future = new Date(Date.now() + 30 * 864e5).toISOString()
const past = new Date(Date.now() - 864e5).toISOString()

try {
  // ============================================================ SECURITY
  const embargoed = await payload.create({ collection: 'reports', user: su, overrideAccess: false, data: {
    titleId: 'ZZCHK Laporan Embargo', titleEn: 'ZZCHK Embargoed Report', type: 'annual_report',
    bodyId: text('RAHASIA'), bodyEn: text('SECRET'), publishDate: future, approvalStatus: 'approved' } })

  await check('security', 'publish-date embargo holds on REST', async () => ok((await anonReport(embargoed.slug)) === 0))
  await check('security', 'publish-date embargo holds on GraphQL', async () => {
    const r = await api('/api/graphql', { method: 'POST', body: { query: `{ Reports(where:{slug:{equals:"${embargoed.slug}"}}){ totalDocs } }` } })
    return ok(r.json?.data?.Reports?.totalDocs === 0)
  })
  await check('security', 'embargoed report page is 404 for the public', async () => ok((await api(`/laporan/${embargoed.slug}`)).status === 404))

  await check('security', 'no secret in the admin edit page', async () => {
    const r = await api(`/admin/collections/reports/${embargoed.id}`, { who: 'news' })
    return ok(!r.raw.includes(process.env.PAYLOAD_SECRET) && !r.raw.includes('previewSecret'))
  })
  const P = `/preview?path=${encodeURIComponent('/laporan/' + embargoed.slug)}&collection=reports`
  await check('security', 'preview refused when not signed in', async () => ok((await api(P)).status === 403))
  await check('security', 'preview refused to another module (Sales)', async () => ok((await api(P, { who: 'sales' })).status === 403))
  await check('security', 'preview allowed to the module editor', async () => ok((await api(P, { who: 'news' })).status === 307))
  await check('security', 'preview refuses an off-site path', async () =>
    ok((await api(`/preview?path=${encodeURIComponent('//example.com')}&collection=reports`, { who: 'news' })).status === 400))

  await check('security', 'version history refused to another module (HR)', async () => ok((await api('/api/reports/versions?limit=1', { who: 'hr' })).status === 403))
  await check('security', 'version history refused when not signed in', async () => ok((await api('/api/reports/versions?limit=1')).status === 403))

  await check('security', 'auto-translate refuses a non-content collection', async () =>
    ok((await api('/api/auto-translate', { who: 'sales', method: 'POST', body: { collection: 'users', id: su.id } })).status === 400))
  await check('security', 'auto-translate refuses another module (HR on reports)', async () =>
    ok((await api('/api/auto-translate', { who: 'hr', method: 'POST', body: { collection: 'reports', id: embargoed.id } })).status === 403))

  const enquiry = (email, company) => ({ firstName: 'ZZCHK', lastName: 'Probe', email, phone: '+628999000111', companyName: company,
    interestedIn: 'General Enquiries', hearAboutUs: 'Referral', message: 'check', consent: true, marketingChannels: [], marketingPreference: '', locale: 'id', pageUrl: '/hubungi-kami' })
  await check('security', 'enquiries cannot be created through the REST API', async () =>
    ok((await api('/api/contact-submissions', { method: 'POST', body: { firstName: 'ZZCHK', lastName: 'x', email: 'zzchk.direct@example.com', phone: '+628999', companyName: 'ZZCHK direct', interestedIn: 'General Enquiries', consent: true } })).status === 403))
  await check('security', 'enquiries cannot be created through GraphQL', async () => {
    const r = await api('/api/graphql', { method: 'POST', body: { query: 'mutation { createContactSubmission(data:{firstName:"ZZCHK",lastName:"x",email:"zzchk.gql@example.com",phone:"+628999",companyName:"ZZCHK gql",interestedIn:GeneralEnquiries,consent:true,followUpStatus:new}) { id } }' } })
    return ok(Array.isArray(r.json?.errors) && !r.json?.data?.createContactSubmission)
  })
  await check('security', 'contact limit holds for simultaneous sends (3 per contact)', async () => {
    const email = `zzchk.race.${Date.now()}@example.com`
    await Promise.all(Array.from({ length: 8 }, (_, i) =>
      api('/api/contact', { method: 'POST', headers: { 'X-Forwarded-For': `10.77.0.${i}` }, body: { ...enquiry(email, 'ZZCHK race') } })))
    const stored = await payload.find({ collection: 'contact-submissions', where: { email: { equals: email } }, overrideAccess: true, limit: 20 })
    const ips = [...new Set(stored.docs.map((d) => d.ipAddress))]
    return ok(stored.totalDocs === 3 && !ips.some((ip) => String(ip).startsWith('10.77.')), `stored ${stored.totalDocs}, addresses ${ips.join(',')}`)
  })

  await check('security', 'last Super Admin cannot be demoted', async () => {
    const supers = (await payload.find({ collection: 'users', where: { role: { equals: 'super_admin' } }, overrideAccess: true, limit: 50 })).docs
    const txn = await payload.db.beginTransaction()
    const req = { transactionID: txn, user: su, payload }
    try {
      for (const u of supers.filter((u) => u.id !== su.id)) await payload.update({ collection: 'users', id: u.id, data: { role: 'news_admin' }, overrideAccess: true, req })
      await payload.update({ collection: 'users', id: su.id, data: { role: 'news_admin' }, user: su, overrideAccess: false, req })
      return ok(false, 'demotion was accepted')
    } catch (e) { return ok(/satu-satunya Super Admin/.test(e.message), e.message.slice(0, 60)) }
    finally { await payload.db.rollbackTransaction(txn) }
  })
  await check('security', 'approval refused with a language missing', async () => {
    try {
      await payload.create({ collection: 'articles', user: su, overrideAccess: false, data: { titleId: 'ZZCHK tanpa inggris', titleEn: 'ZZCHK no english', publishDate: past, bodyId: text('Isi'), bodyEn: text(''), approvalStatus: 'approved' } })
      return ok(false, 'accepted')
    } catch (e) { return ok(/Belum bisa disetujui/.test(e.message)) }
  })
  await check('security', 'rejection refused without a reason', async () => {
    const a = await payload.create({ collection: 'articles', user: su, overrideAccess: false, data: { titleId: 'ZZCHK tolak', titleEn: 'ZZCHK reject', publishDate: past, bodyId: text('Isi'), bodyEn: text('Body') } })
    try { await payload.update({ collection: 'articles', id: a.id, user: su, overrideAccess: false, data: { approvalStatus: 'rejected', rejectionReason: '' } }); return ok(false, 'accepted') }
    catch (e) { return ok(/reason/.test(e.message)) }
  })

  await check('security', 'SVG uploads are refused', async () => {
    const fd = new FormData()
    fd.append('file', new Blob(['<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"/>'], { type: 'image/svg+xml' }), 'zzchk.svg')
    fd.append('_payload', JSON.stringify({ alt: 'ZZCHK svg' }))
    return ok((await api('/api/media', { who: 'news', method: 'POST', body: fd })).status === 400)
  })
  await check('security', 'uploaded files are served sandboxed', async () => {
    const m = (await payload.find({ collection: 'media', limit: 1, overrideAccess: true, where: { mimeType: { equals: 'image/png' } } })).docs[0]
    if (!m) return 'skip'
    const r = await fetch(`${BASE}${m.url}`)
    return ok(/sandbox/.test(r.headers.get('content-security-policy') ?? '') && (r.headers.get('x-content-type-options') ?? '').includes('nosniff'))
  })
  await check('security', 'pages carry nosniff and frame protection', async () => {
    const r = await fetch(`${BASE}/`)
    return ok(r.headers.get('x-content-type-options')?.includes('nosniff') && r.headers.get('x-frame-options'))
  })
  await check('security', 'reset email link uses SITE_URL, even with a forged Host', async () => {
    const mp = await fetch(`${MAILPIT}/api/v1/info`).then((r) => r.ok).catch(() => false)
    if (!mp) return { skip: true }
    await fetch(`${MAILPIT}/api/v1/search?query=to:zzchk.news@cbclik.com`, { method: 'DELETE' })
    await fetch(`${APP}/api/users/forgot-password`, { method: 'POST', headers: { 'Content-Type': 'application/json', Host: 'attacker.example', 'X-Forwarded-Host': 'attacker.example' }, body: JSON.stringify({ email: 'zzchk.news@cbclik.com' }) })
    await new Promise((r) => setTimeout(r, 1500))
    const list = await (await fetch(`${MAILPIT}/api/v1/search?query=to:zzchk.news@cbclik.com`)).json()
    const id = list.messages?.[0]?.ID; if (!id) return ok(false, 'no email arrived')
    const html = (await (await fetch(`${MAILPIT}/api/v1/message/${id}`)).json()).HTML ?? ''
    const site = (process.env.SITE_URL ?? '').replace(/\/$/, '')
    return ok(html.includes(`${site}/admin/reset/`) && !html.includes('attacker.example'))
  })

  // ============================================================ RELIABILITY
  await check('reliability', '30 simultaneous saves finish and the site stays up', async () => {
    const e = await payload.create({ collection: 'contact-submissions', overrideAccess: true, data: { ...enquiry(`zzchk.load@example.com`, 'ZZCHK load'), marketingPreference: undefined } })
    const started = Date.now()
    const saves = Promise.all(Array.from({ length: 30 }, (_, i) =>
      api(`/api/contact-submissions/${e.id}`, { who: 'super', method: 'PATCH', body: { followUpStatus: i % 2 ? 'follow_up' : 'new' } })))
    const home = await Promise.race([fetch(`${BASE}/`).then((r) => r.status), new Promise((r) => setTimeout(() => r('timeout'), 10000))])
    const codes = (await Promise.race([saves, new Promise((r) => setTimeout(() => r('timeout'), 20000))]))
    const ms = Date.now() - started
    if (codes === 'timeout') return ok(false, 'saves still pending after 20 s — the site may be frozen; restart it')
    return ok(codes.every((c) => c.status === 200) && home === 200, `${ms} ms, home ${home}`)
  })

  // ============================================================ FUNCTIONALITY
  await check('functionality', 'a live page stays live while its edit is reviewed', async () => {
    const a = await payload.create({ collection: 'articles', user: su, overrideAccess: false, data: { titleId: 'ZZCHK Tayang', titleEn: 'ZZCHK Live', excerptId: 'LAMA', excerptEn: 'OLD', publishDate: past, bodyId: text('Isi'), bodyEn: text('Body'), approvalStatus: 'approved' } })
    const pub = async () => (await api(`/api/articles/${a.id}?depth=0`)).json?.excerptId
    const e = await api(`/api/articles/${a.id}?depth=0&draft=true`, { who: 'news', method: 'PATCH', body: { excerptId: 'BARU', _status: 'draft' } })
    const during = await pub()
    const approve = await api(`/api/articles/${a.id}?depth=0`, { who: 'approver', method: 'PATCH', body: { approvalStatus: 'approved', _status: 'published' } })
    const after = await pub()
    return ok(e.status === 200 && during === 'LAMA' && approve.status === 200 && after === 'BARU', `during review: ${during}, after approval: ${after}`)
  })
  await check('functionality', 'slugs are unique (a clash gets -2)', async () => {
    const mk = () => api('/api/articles?depth=0&draft=true', { who: 'news', method: 'POST', body: { titleId: 'ZZCHK Judul Kembar', titleEn: 'ZZCHK Twin', publishDate: past, bodyId: text('x'), bodyEn: text('x'), _status: 'draft' } })
    const a = await mk(), b = await mk()
    return ok(a.json?.doc?.slug && b.json?.doc?.slug === `${a.json.doc.slug}-2`, `${a.json?.doc?.slug} / ${b.json?.doc?.slug}`)
  })
  await check('functionality', 'only Super Admin replaces an image file', async () => {
    const upload = (who, method, id = '') => { const fd = new FormData(); fd.append('file', new Blob([png()], { type: 'image/png' }), `zzchk-${who}-${Date.now()}.png`); fd.append('_payload', JSON.stringify({ alt: 'ZZCHK image' })); return api(`/api/media${id ? '/' + id : ''}`, { who, method, body: fd }) }
    const up = await upload('news', 'POST')
    const id = up.json?.doc?.id
    const byEditor = await upload('news', 'PATCH', id)
    const bySuper = await upload('super', 'PATCH', id)
    return ok(up.status === 201 && byEditor.status === 403 && bySuper.status === 200, `upload ${up.status}, editor replace ${byEditor.status}, super replace ${bySuper.status}`)
  })
} finally {
  // ---------------------------------------------------------------- teardown
  const del = async (collection, where, extra = {}) => {
    const r = await payload.find({ collection, where, limit: 500, overrideAccess: true, depth: 0, ...extra })
    for (const d of r.docs) { try { await payload.delete({ collection, id: d.id, overrideAccess: true }) } catch {} }
    return r.docs.length
  }
  const n = {
    articles: await del('articles', { titleId: { like: 'ZZCHK' } }, { draft: true }),
    reports: await del('reports', { titleId: { like: 'ZZCHK' } }, { draft: true }),
    enquiries: await del('contact-submissions', { companyName: { like: 'ZZCHK' } }),
    media: await del('media', { alt: { like: 'ZZCHK' } }),
    users: await del('users', { email: { like: 'zzchk.' } }),
  }
  n.audit = await del('audit-log', { or: [{ documentTitle: { like: 'ZZCHK' } }, { documentTitle: { like: 'zzchk' } }, { userEmail: { like: 'zzchk.' } }] })
  await fetch(`${MAILPIT}/api/v1/search?query=to:zzchk.`, { method: 'DELETE' }).catch(() => {})

  // ---------------------------------------------------------------- report
  let fails = 0
  for (const group of ['security', 'reliability', 'functionality']) {
    console.log(`\n${group.toUpperCase()}`)
    for (const r of results.filter((x) => x.group === group)) {
      if (r.status === 'FAIL') fails++
      console.log(`  ${r.status.padEnd(4)}  ${r.name}${r.note ? `  — ${r.note}` : ''}`)
    }
  }
  const pass = results.filter((r) => r.status === 'PASS').length
  console.log(`\n${pass} passed, ${fails} failed, ${results.length - pass - fails} skipped. Cleaned up: ${Object.entries(n).map(([k, v]) => `${v} ${k}`).join(', ')}.`)
  process.exit(fails)
}
