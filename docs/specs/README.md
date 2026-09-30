# Specifications

Business requirements (what the business needs) and technical specifications
(how the system delivers it), for the public website and the CMS. They describe
the system as built at `baseline-pre-redesign` plus later fixes; the redesign
(`intent/05-redesign.md`) will revise them.

| Document | For | Reader |
|---|---|---|
| [brd-website.md](brd-website.md) | Public website (cbclik.com) — requirements BR-WEB-01… | Business owners, marketing, legal |
| [tsd-website.md](tsd-website.md) | Public website — architecture, routes, APIs, security, operations | Developers, IT operations |
| [brd-cms.md](brd-cms.md) | CMS (/admin) — requirements BR-CMS-01… | Module owners, editors, approver |
| [tsd-cms.md](tsd-cms.md) | CMS — data model, access, workflow, audit, integrations | Developers, IT operations |

Each BRD ends with open items awaiting a decision; each TSD ends with a
traceability table from requirement ids to the section that delivers them.
Priorities (Must/Should/Could) are proposed and await the owner's confirmation.
When code and these documents disagree, the code wins — fix the document in
the same change.
