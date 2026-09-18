# Auto-translate and glossary

Indonesian is the source language. English is drafted by AI and **reviewed by a
person afterwards** — the intent files are explicit that the team fixes the
wording manually (intent/04 §4).

## How the action behaves

Open any item and press **Auto-translate to English** in the sidebar.

- It reads the Indonesian version and fills **only the English fields that are
  still empty**. Text someone has already written or corrected is never
  overwritten.
- The result is saved as a **draft**, so it goes through the same approval as
  any other change. Nothing reaches the public site without review.
- It translates plain text and rich text, including text inside repeated rows.
- It leaves slugs, URLs, email addresses, dates and numbers alone.

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

Kebijakan Privasi, Kebijakan Keamanan Informasi and Penyelesaian Pengaduan must
be marked **needs legal review** after translation. An AI translation of
regulated text is a starting point, not a publishable document.

## Configuration

The action needs `ANTHROPIC_API_KEY` in `.env`. Without it the button returns a
plain message saying so, and nothing else in the CMS is affected.

Model and prompt live in `src/lib/translate.ts`; the glossary and the
do-not-translate list are at the top of that file.
