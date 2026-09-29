# Translation process

Indonesian is the source language. English is drafted by AI and **reviewed by a
person** — the intent files are explicit that the team fixes the wording
afterwards (intent/04 §4).

## Two kinds of text

**Interface strings** — buttons, labels, form errors, navigation. These live in
`src/i18n/dictionaries/id.json` and `en.json` and are translated once, in code.
All 87 keys are present in both files.

**Content** — everything editors write, in both languages side by side on the
same form. On news and reports the **Auto-translate** button fills English
fields that are still empty; on products and Karir editors write the English
themselves. Either way an item cannot be approved until both languages are
complete.

**Page copy in code** — `src/content/*.ts` holds every other piece of wording as
`{ id, en }` pairs, translated once by a developer.

## Glossary

The same Indonesian term always becomes the same English term. Full table in
[auto-translate and glossary](./auto-translate-and-glossary.md).

Never translated: CLIK, CRIF, OJK, AFPI, AFTECH, APPI, BIIA, the company's
legal name, and every product name (Full Report, CLIK SKAI Score, Scoremart,
and the rest).

## Routes

English pages use English slugs, not the Indonesian ones (open item O6):

| Indonesian | English |
| --- | --- |
| `/tentang-kami` | `/en/about-us` |
| `/layanan-dan-produk` | `/en/products-and-services` |
| `/hubungi-kami` | `/en/contact-us` |
| `/karir` | `/en/careers` |
| `/laporan` | `/en/reports` |

Two exceptions, both deliberate:

- **`/newsroom`** is the same word in both languages.
- **Content slugs are shared.** An article, report or vacancy has one slug in
  both languages, made from its Indonesian title: `/newsroom/<slug>` and
  `/en/newsroom/<slug>`. Media outlet slugs are shared the same way. (Earlier
  builds kept a slug per language; that ended when both languages moved onto
  one form.)

## Legal pages need a person, not a model

Kebijakan Privasi, Kebijakan Keamanan Informasi and Penyelesaian Pengaduan must
be marked **needs legal review** after translation.

These pages now hold the text from the Figma design, in `src/content/policies.ts`.
**No legal review of either language is recorded yet** — it is listed as CLIK's to do in [deferred items](./deferred-items.md). An AI translation of
regulated text is a starting point for a reviewer, never something to
publish — and for a company OJK supervises, publishing unreviewed procedural
text is a compliance risk.

## Checking coverage

Compare the two dictionaries to confirm no key is missing and no Indonesian has
been left in the English file. Checked on 28 September: 87 keys each, none
missing from either file.
