# Design system

Implemented from `intent/01-design-system.md`, which derives from the Figma
page frames.

The local styles inside the Figma file, prefixed `cbclik.com/` and `wp/`, were
auto-imported from the old WordPress site by html.to.design. **They are not
used as tokens.** The tokens below are the source of truth.

## Where it lives

| File | Holds |
| --- | --- |
| `src/styles/tokens.css` | Every design token as a CSS custom property |
| `src/styles/globals.css` | Reset, base element styling, type-scale helper classes |
| `src/components/layout/` | Header, Footer, Breadcrumb, Container, LanguageSwitch |
| `src/components/ui/` | Button, BackToTop |

Components use CSS Modules, so class names are scoped and no utility framework
is needed.

## Typography

Nunito Sans, weights 400, 600, 700, 800 and 900, loaded through `next/font` and
self-hosted — no request reaches Google when a visitor opens a page. Every
other font found in Figma (Roboto, Inter, Open Sans, Plus Jakarta Sans) is
replaced with Nunito Sans at the same size and weight.

Each step in the scale has a helper class:

| Class | Size / weight | Used for |
| --- | --- | --- |
| `.t-display` | 60 / 700 | Home hero title |
| `.t-display-sub` | 38 / 800 | Home hero subtitle |
| `.t-h1` | 38 / 800 | Page titles, section titles |
| `.t-h1-alt` | 38 / 700 | Section titles on About and Business Solution |
| `.t-cta-title` | 38 / 900 | Closing CTA banner |
| `.t-h2` | 30 / 800 | Featured article title |
| `.t-card-title` | 26 / 800 | Article and report cards |
| `.t-h3` | 24 / 700 | Sub-section titles |
| `.t-h3-soft` | 24 / 600 | Lead sentences, feature card titles |
| `.t-lead` | 24 / 400 | Intro paragraphs |
| `.t-h4` | 20 / 700 | Small headings |
| `.t-h5` | 18 / 600 | Step titles |
| `.t-body-strong` | 16 / 700 | Nav items, dates |
| `.t-small` | 14 / 400 | Card descriptions |
| `.t-link-caps` | 14 / 800 caps | READ MORE |
| `.t-caption` | 12 / 400 | Job category, labels |
| `.t-micro` | 10 / 400 | Footer licence text |

Body text is 16px at a line height of 1.8, matching the 30px in Figma.

## Colour

Near-duplicate shades in Figma are merged, per confirmed decision 2.

| Token | Value | Merged from |
| --- | --- | --- |
| `--color-primary` | `#FF7D00` | `#EE7D11` `#FF7D23` `#FF7400` `#ED7B11` |
| `--color-primary-light` | `#FFBB7B` | — |
| `--color-secondary` | `#003A79` | `#003B79` `#123A7A` `#0B2F5C` |
| `--color-text-heading` | `#000000` | `#252525` `#21272A` |
| `--color-text-body` | `#5B6B81` | — |
| `--color-text-muted` | `#697077` | `#64748B` `#4D5358` |
| `--color-bg-page` | `#FAFAFA` | — |
| `--color-bg-surface` | `#FFFFFF` | — |
| `--color-bg-tint` | `#F1FAFF` | `#F2F4F8` |
| `--color-border` | `#DBE4F0` | `#D9D9D9` `#DDE1E6` |
| `--color-disabled` | `#C1C7CD` | `#ACB8C3` |

Open item O4 asked whether a separate darker navy is wanted for the footer or
hover states. Until told otherwise, the darker shades are merged into
`--color-secondary`.

## Layout

The design is 1440px wide with a 1300px content column, so `--container-max` is
1300px with roughly 70px of gutter at that width. The `Container` component
applies it.

Spacing tokens follow the designer's annotations: 60px from header to
breadcrumb, 42px from breadcrumb to page title, 54px from breadcrumb to
content.

`.section-rule` draws the short orange bar (40 × 3px) that sits above each
section title.

## Components

| Component | Notes |
| --- | --- |
| `Header` | Two variants. Transparent white-on-image for the homepage, solid white for inner pages. The variant is derived from the route. Dropdowns open on mouse enter and on keyboard focus. |
| `Footer` | Light blue. Contact details, member organisations, OJK supervision, generated copyright year. Values move to CMS site settings in Phase 2. |
| `Breadcrumb` | `Home > Section > Page`. The last item is the current page and is not a link. |
| `LanguageSwitch` | `ID \| EN`, active language in orange, switching to the same page in the other language. |
| `Button` | `primary`, `outline` and `ghost` variants, each with the hover state Figma shows as "Variant2". Minimum height 44px for comfortable tapping. |
| `BackToTop` | Appears after 600px of scrolling. |

## Accessibility

Not a separate phase — built in from the start:

- A visible focus ring on every interactive element
- A skip link to the main content
- Dropdowns that open on keyboard focus, not hover alone
- 44px minimum touch targets
- `prefers-reduced-motion` honoured
- Navigation landmarks and `aria-current` on the active language and breadcrumb

## Responsive

No mobile or tablet designs exist — every page frame in Figma is 1440px
desktop. Responsive behaviour is therefore designed rather than transcribed,
and the full pass happens in Phase 5. The components delivered in Phase 1
already stack and collapse: the navigation becomes a hamburger menu below
1100px, keeping the same dropdown structure.

## Known design errors, fixed not copied

From `intent/01-design-system.md` §6. Corrected as the affected pages are built:

- Hero title "Bureu" → "Bureau"
- About Us milestone "Rerport" → "Report"
- Kebijakan Privasi breadcrumb showing the wrong page name
- The nav layer named "karis" is "Karir"
- The dark header's "Business Solution" link pointing at Credit Scoring
- "Tentang Kami" having no destination — it only opens the dropdown
- Copyright year hard-coded to 2024 — now generated
