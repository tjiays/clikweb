# Translation process

Indonesian is the source language. English is drafted by AI and **reviewed by a
person** — the intent files are explicit that the team fixes the wording
afterwards (intent/04 §4).

## Two kinds of text

**Interface strings** — buttons, labels, form errors, navigation. These live in
`src/i18n/dictionaries/id.json` and `en.json` and are translated once, in code.
All 88 keys are present in both files.

**Content** — everything editors write. Translated per item in the CMS using
the **Auto-translate to English** button, which fills only the English fields
that are still empty and saves the result as a draft.

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
- **Media outlet slugs are shared.** "Kumparan" is Kumparan in either language,
  so one URL serves both. Article, report and job slugs *are* per-language,
  because their titles differ.

## Legal pages need a person, not a model

Kebijakan Privasi, Kebijakan Keamanan Informasi and Penyelesaian Pengaduan must
be marked **needs legal review** after translation.

These pages currently hold a visible TODO rather than text. An AI translation
of regulated text is a starting point for a reviewer, never something to
publish — and for a company OJK supervises, publishing unreviewed procedural
text is a compliance risk.

## Checking coverage

Compare the two dictionaries to confirm no key is missing and no Indonesian has
been left in the English file. Both were verified for this phase: 88 keys each,
no missing keys, no leaked Indonesian.
