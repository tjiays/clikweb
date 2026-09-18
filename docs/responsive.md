# Responsive behaviour

**No mobile or tablet designs exist.** Every page frame in the Figma file is
1440px desktop — this was checked by measuring every frame, not assumed. So the
behaviour below is *designed*, not transcribed, following the minimum
expectations in `intent/01-design-system.md` §3.

**This document is therefore the specification for small screens.** If a
designer later produces mobile layouts, they replace what is described here.

## Breakpoints

| Width | Behaviour |
| --- | --- |
| Above 1100px | The design as drawn: full navigation, multi-column grids |
| 1024–1100px | Navigation collapses to a hamburger menu |
| 768–1024px | Section spacing tightens; grids drop to two columns |
| Below 768px | One column throughout; the type scale steps down |

The navigation collapses at 1100px rather than a rounder number because that is
where the seven nav items plus the language switch stop fitting beside the logo.

## What changes

**Navigation.** Becomes a hamburger menu keeping the same dropdown structure.
On a touch screen there is no hover, so sub-items are simply shown rather than
hidden behind one.

**Grids.** Stats, solution cards, news cards, values and benefits all stack to
one column. Two-column layouts with a sidebar (Newsroom, Contact) put the main
content first and the sidebar below it.

**Carousels stay swipeable.** They scroll natively rather than relying on the
arrow buttons, so a finger works as well as a pointer.

**Type scale steps down** below 768px — the 60px hero title becomes 36px. The
hierarchy is preserved; only the absolute sizes change.

**Tables scroll sideways inside their own box**, never forcing the page to
scroll. This matters most for the financial tables in the annual reports.

## Touch targets

Every interactive element is at least 44px tall on a touch device: buttons,
form fields, checkboxes, pagination links and menu items.

## What is not done

No device testing has been carried out. The behaviour is implemented and
reasoned about, but nobody has opened the site on a real phone. That belongs
with the testing work the product owner deferred.
