# Auto-translate and glossary

Indonesian is the source language. English is drafted by AI and **reviewed by a
person afterwards** — the intent files are explicit that the team fixes the
wording manually (intent/04 §4).

## Where it exists

On **Berita** (news) and **Laporan** (reports) only, in the sidebar. Products
and Karir have no auto-translate, at the product owner's request — editors write
their English themselves.

## How the action behaves

- Both languages sit side by side on the form (`titleId` beside `titleEn`, and
  so on). The action reads each Indonesian field and fills the matching
  **English field only if it is still empty**. Text someone has already written
  or corrected is never overwritten.
- The result is saved like any other change, so it still needs approval.
  Nothing reaches the public site without review.
- It translates plain text and rich text, including text inside repeated rows.
- It leaves slugs, URLs, email addresses, dates and numbers alone.
- An item cannot be approved with a language missing, so the button is the
  quickest way to a first English draft — never the last word on it.

## Glossary

The same Indonesian term always becomes the same English term:

| Indonesian | English |
| --- | --- |
| biro kredit | credit bureau |
| lembaga keuangan | financial institution |
| lembaga non-keuangan | non-financial institution |
| laporan kredit | credit report |
| skor kredit | credit score |
| penyelesaian pengaduan | complaint resolution |
| Layanan dan Produk | Products & Services |
| Tentang Kami | About Us |
| Karir | Careers |
| Hubungi Kami | Contact Us |
| Laporan Tahunan | Annual Report |
| Terdaftar & Diawasi oleh OJK | Registered & Supervised by OJK |

## Never translated

CLIK, CRIF, OJK, AFPI, AFTECH, APPI, BIIA, the company's legal name, and every
product name (Full Report, CLIK SKAI Score, Scoremart, and the rest).

## Legal pages need a person

Kebijakan Privasi, Kebijakan Keamanan Informasi and Penyelesaian Pengaduan are
not in the CMS — they live in `src/content/policies.ts` — so this action never
touches them. Their English must still be reviewed by someone with the
authority to sign it off. An AI translation of regulated text is a starting
point, not a publishable document.

## Configuration

The action needs `ANTHROPIC_API_KEY` in `.env`. Without it the button returns a
plain message saying so, and nothing else in the CMS is affected.

Model (Claude) and prompt live in `src/lib/translate.ts`, and the endpoint in
`src/endpoints/autoTranslate.ts`; the glossary and the
do-not-translate list are at the top of that file.
