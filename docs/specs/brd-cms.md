# Business Requirements Document — CLIK CMS

## Document control

| Item | Value |
|---|---|
| Document | Business Requirements Document (BRD) — CLIK Content Management System |
| Product | CMS for the CLIK (PT CRIF Lembaga Informasi Keuangan) website, at `/admin` |
| Version | 1.0 |
| Date | 2026-09-30 |
| Status | Draft for review |
| Owner | To be confirmed |
| Approved by | Not yet approved (see open item OI-01) |
| Companion | `docs/specs/tsd-cms.md` (technical specification of this CMS) |
| Website pair | `docs/specs/brd-website.md`, `docs/specs/tsd-website.md` |
| Based on | `intent/00-README.md`, `intent/03-cms.md`, `intent/05-redesign.md`, `docs/cms-collections.md`, `docs/roles-and-permissions.md`, `docs/approval-workflow.md`, `docs/cms-user-manual.md`, `docs/editor-guide-*.md`, `docs/auto-translate-and-glossary.md`, `docs/translation-process.md`, `docs/analytics.md`, `docs/contact-form.md`, `docs/operations.md`, `docs/deferred-items.md`, and the running code on branch `hardening/security-and-cms-refinement` |

**How to read this document.** It describes what the CMS must do, in business
terms. Every requirement below was checked against the code and the existing
project documents on 30 September 2026. Where the documents and the code
disagree, the difference is listed as an open item (section 8) rather than
decided here. Per `intent/00-README.md`, "where a file and the running system
disagree, the running system is right".

**About priorities.** The project documents do not rank requirements. The
Must / Should / Could priorities below are **proposed** by the author: *Must*
for anything recorded as a confirmed decision in `intent/00-README.md`,
*Should* for supporting behaviour the documents describe, *Could* for items not
built or explicitly optional. They need the owner's confirmation (OI-01).

---

## 1. Purpose and background

CLIK publishes news, reports, product information and job vacancies on its
bilingual (Indonesian and English) website. The CMS is the private back office
where CLIK staff write that content, have it reviewed, and publish it. It also
holds the enquiries visitors send through the website's contact form, the list
of CMS users, and a record of who changed what.

The CMS runs inside the website application — one codebase, one database, one
deployment (`intent/03-cms.md`). It was deliberately made smaller during the
build (revised 28 September 2026): it now holds only what the team publishes
on its own schedule. Everything else on the website (page text, logos,
testimonials, policy pages, contact details) lives in code and is changed by a
developer (`intent/00-README.md` decision 16; `docs/editing-content.md`).

A redesign of the website is being prepared (`intent/05-redesign.md`, status
"waiting for the new design"). Its effect on the CMS has not been decided yet
(OI-04).

## 2. Business objectives

| # | Objective | Where it comes from |
|---|---|---|
| OBJ-1 | Let each team publish its own content without a developer. | `intent/03-cms.md` intro; decision 16 |
| OBJ-2 | Nothing reaches the public website without review by a designated Approver. | Decisions 13, 14 |
| OBJ-3 | Every published item is complete in both Indonesian and English. | Decision 4 |
| OBJ-4 | Keep a permanent, trustworthy record of website enquiries and of every change made in the CMS. | Decisions 19, 25 |
| OBJ-5 | Show staff how the website is doing (visitors, page speed) without sending visitor data to a third party. | Decision 24; `docs/analytics.md` |
| OBJ-6 | Keep the website online and correct while content is being edited. | Decision 22 |

## 3. Scope

### 3.1 In scope

- Four publishing modules: **Berita** (news), **Laporan** (reports),
  **Produk** (product items), **Karir** (job vacancies).
- **Data Masuk** (contact enquiries): viewing and follow-up status.
- **Pengguna** (user accounts) and **Log Audit** (audit log).
- The image store behind the image fields (no menu of its own).
- The approval workflow, publish-date scheduling, preview, revision history.
- Bilingual entry and the Auto-translate helper.
- The analytics dashboard shown when the CMS opens.
- System emails sent by the CMS (account activation, password reset).

### 3.2 Out of scope

- Page copy, hero slides, stats, testimonials, timeline, logos, call-to-action
  blocks, policy and how-to pages, media outlets and coverage, contact details:
  kept in code (`intent/03-cms.md` §5 "In code, not in the CMS").
- The public website itself — see `docs/specs/brd-website.md`.
- Items deferred with the original BRD in `prereq/` (`docs/deferred-items.md`),
  including: CIKA chatbot, JobStreet synchronisation, FAQ module, member
  directory, news category/year filters, one-click rollback in the admin,
  auto-reply email, per-solution PIC email routing, GA4 / Search Console
  dashboards, CAPTCHA.
- Deletion as an approval request (never built; `intent/03-cms.md` §2).
- CSV export of enquiries (not built; open item O2 in `intent/00-README.md`).
- Email notifications about submissions and decisions (open item O3).

## 4. Stakeholders and user roles

### 4.1 Stakeholders

| Stakeholder | Interest |
|---|---|
| Product owner (CLIK) | Decides the rules recorded in `intent/`. Named person: to be confirmed. |
| Newsroom team | Writes news and reports. |
| HR team | Publishes job vacancies. |
| Marketing team | Maintains product items. |
| Sales team | Follows up website enquiries. |
| Approver | Signs off every change before it goes live. |
| IT / system administrators | Run the server, backups and releases (`docs/operations.md`). |
| Developer | Changes page copy in code and maintains the system. |

### 4.2 User roles

Six roles exist (`src/access/roles.ts`). A user has exactly one role.

| Role | Team | What they can do |
|---|---|---|
| **Super Admin** | IT / administration | Everything: all four publishing modules (create, edit, delete, approve and publish in one step), enquiries (view, set follow-up status), audit log (view), users (create, edit, delete). Only role that can replace or delete an image file. |
| **News Admin** | Newsroom | Berita and Laporan: create, edit, delete. Upload images and edit their alt text. Use Auto-translate. |
| **HR Admin** | HR | Karir: create, edit, delete. Upload images and edit alt text. |
| **Marketing Admin** | Marketing | Produk: create, edit, delete. Upload images and edit alt text. |
| **Sales Admin** | Sales | Data Masuk: view enquiries and set their follow-up status. Nothing else. |
| **Approver** | Reviewer, one for all modules | Read every item in the four publishing modules; approve or reject items that are In Review. Cannot change content. |

Everyone can see the Dashboard. The full grid is in the appendix.

---

## 5. Business requirements

### 5.1 Access and accounts

**BR-CMS-01 — Role-based access.**
Each user has exactly one of the six roles, and can reach only the modules
that role allows (appendix).
*Rationale:* each team manages only its own content (decisions 12, 13).
*Priority:* Must.
*Acceptance:* a News Admin cannot open Karir, Produk, Data Masuk, Log Audit or
Pengguna, whether through the menu or by typing the address; an HR Admin
cannot read news version history (checked by `scripts/checks/run.mjs`).

**BR-CMS-02 — Only Super Admin manages users.**
Only a Super Admin creates, edits and deletes accounts. No user can change
their own role. Other users can see and edit only their own account.
*Rationale:* `intent/03-cms.md` §1.
*Priority:* Must.
*Acceptance:* a non-Super-Admin cannot create a user or change any role,
including their own.

**BR-CMS-03 — New accounts must be activated by email.**
A new account cannot sign in until its owner clicks the activation link sent
to their email. While email is not delivered (staging), a Super Admin can read
the activation link on the user's page and pass it on. Accounts that existed
before this rule were marked activated.
*Rationale:* decision 23.
*Priority:* Must.
*Acceptance:* signing in with an unactivated account is refused; after
clicking the link it succeeds.

**BR-CMS-04 — Password reset by email.**
"Forgot password" emails a reset link, valid for one hour, in Indonesian and
English. The link always points at the site's configured address, never at an
address taken from the request.
*Rationale:* staff must recover access themselves; a forged request must not
redirect a reset link (`docs/operations.md` "Known gaps").
*Priority:* Must.
*Acceptance:* the reset email's link starts with the configured site address
even when the request claims another host (checked by `scripts/checks`).

**BR-CMS-05 — Lock-out after repeated wrong passwords.**
Five wrong passwords lock an account for 10 minutes.
*Rationale:* protects accounts against guessing (`intent/03-cms.md` §8).
*Priority:* Should.
*Acceptance:* the sixth attempt within the lock period is refused even with
the right password.

**BR-CMS-06 — The CMS can never lose its last Super Admin.**
Nobody can delete their own account. The last remaining Super Admin can be
neither deleted nor given another role.
*Rationale:* otherwise nobody could manage users again without a database
edit (`docs/roles-and-permissions.md`).
*Priority:* Must.
*Acceptance:* both actions are refused with a readable message (checked by
`scripts/checks` for demotion).

**BR-CMS-07 — Deleting users is visible and deliberate.**
A Super Admin can delete a user from the user list (a two-step "Hapus" button
on each row) or from the user's page. Removing a user keeps their history: the
audit log keeps their email as text.
*Rationale:* decision log 25 Sep; `docs/cms-collections.md` "Pengguna".
*Priority:* Should.
*Acceptance:* after deletion, that person's audit entries still show their
email.

**BR-CMS-08 — The menu shows only what a role can use.**
The sidebar lists only modules the user's role can open. There is no Media
menu for any role. Lists have no "Columns" chooser; each list shows a fixed
set of columns. Account and sign-out are always at the bottom.
*Rationale:* a menu entry that leads to a refused page reads as a fault
(`intent/03-cms.md` §6).
*Priority:* Should.
*Acceptance:* each role sees exactly the menus in the appendix.

**BR-CMS-09 — Admin screens in Indonesian or English.**
Each user can use the admin interface in Indonesian or English.
*Rationale:* decision log 22 Sep.
*Priority:* Should.
*Acceptance:* switching language in the account settings changes the admin
labels.

### 5.2 Content modules

Common to all four publishing modules: both languages side by side on one page;
the approval workflow in the sidebar; a web address (slug) made automatically
from the Indonesian title and hidden from the form (products have no own page
and no slug); an optional **Urutan** (sort order) where present — left at 0 the
list orders itself newest first, a lower number pins an item higher.

**BR-CMS-10 — Berita (news articles).** Owned by News Admin.
Fields: cover image (card image; recommended 1140×650 px, ratio 7:4); banner
image for the article page (optional; recommended 1300×372 px, ratio 3.5:1);
title (required, both languages); summary (both languages, shown on cards);
article body (rich text, both languages); up to 3 related articles ("Anda
mungkin juga tertarik dengan"; empty means the newest); SEO title and
description (both languages); author (pre-filled with the writer's name,
editable); publish date (required, pre-filled with now).
*Rationale:* `intent/03-cms.md` §5; `docs/cms-collections.md`.
*Priority:* Must.
*Acceptance:* an article can be written, reviewed and published with these
fields. Note: the documents say the publish date is "date only", but the form
asks for date and time (OI-08).

**BR-CMS-11 — Laporan (reports).** Owned by News Admin.
Fields: report type (Laporan Tahunan or Laporan Perkembangan Usaha); cover
image (annual report recommended 2000×1333 px; business development report
recommended 1200×800 px; ratio 3:2); title and body (rich text with tables),
both required in both languages; summary (both languages); author; publish
date (optional, date only); sort order.
*Rationale:* decision 15; financial statements need tables (decision log 21 Sep).
*Priority:* Must.
*Acceptance:* a report with a financial table can be published and shows both
languages.

**BR-CMS-12 — Produk (product items).** Owned by Marketing Admin.
Fields: product name (required, both languages); short description; status —
any of Live, Ready to Sell, NEW, **at most two**, or none; description (rich
text); three repeating lists — key features, suitable for, use cases — each in
both languages; category (one of five fixed: Credit Scoring, Analytics,
Decisioning, Business Intelligence, Consulting); sort order.
Products have no page of their own; they appear on the Credit Scoring and
Business Solution pages.
*Rationale:* decision log 23 Sep.
*Priority:* Must.
*Acceptance:* choosing three statuses is refused with "Maksimal pilih 2".

**BR-CMS-13 — Karir (job vacancies).** Owned by HR Admin.
Fields: position name (required, both languages); category (IT, Analytics,
Sales & Business Development, Operations, Finance — fixed in code);
responsibilities and minimum qualifications (rich text, both languages);
application link (JobStreet; empty means the company's JobStreet page); "still
open" tick (default on; only open vacancies appear on the website); sort order.
*Rationale:* decision 9; decision log 23 Sep.
*Priority:* Must.
*Acceptance:* unticking "Lowongan masih dibuka" and approving removes the
vacancy from the website list.

**BR-CMS-14 — One writing editor.**
All long text (article and report bodies, product descriptions, job
responsibilities and qualifications) uses one editor with an always-visible
toolbar: headings (H2–H4), alignment, indent, bulleted, numbered and checklist
lists, quotes, horizontal lines, links (to web addresses or to other news and
reports), inline images with a caption, and tables.
*Rationale:* decision log 21 Sep; `docs/cms-collections.md` "The rich text editor".
*Priority:* Should.
*Acceptance:* a table and an inline image with caption can be added to a report.

**BR-CMS-15 — Unique web addresses.**
Every news, report and vacancy address is unique and made automatically from
the Indonesian title. A clash gets "-2", "-3"… added automatically.
*Rationale:* decision 27 (two reports once shared one address and one could
never be opened).
*Priority:* Must.
*Acceptance:* a second item with the same title gets an address ending "-2"
(checked by `scripts/checks`).

**BR-CMS-16 — Preview before approval.**
News, reports and vacancies have a Preview button that opens the unapproved
item on the real website; products preview the Credit Scoring page. Items
with their own page also show a Live Preview pane beside the form (desktop,
tablet, phone widths) that refreshes on save. (The documents mention Live
Preview for news and reports; the code also enables it for vacancies.) Only people allowed to read unapproved work in
that module can preview it; the link contains no secret.
*Rationale:* reviewers must see what readers will see
(`docs/approval-workflow.md` "Seeing it before approving").
*Priority:* Should.
*Acceptance:* a Sales Admin or HR Admin is refused preview of a report; its
editor is allowed (checked by `scripts/checks`).

**BR-CMS-17 — Revision history.**
Up to 25 earlier versions are kept per item.
*Rationale:* `intent/03-cms.md` §3.
*Priority:* Should.
*Acceptance:* the Versions tab lists earlier saves, up to 25.

### 5.3 Bilingual content and translation

**BR-CMS-18 — Both languages on one page.**
Each text field appears twice, Indonesian and English, side by side. There is
no language switcher on these forms. Image alt text is stored in both
languages.
*Rationale:* decision 4 (revised).
*Priority:* Must.
*Acceptance:* the four publishing forms show paired fields.

**BR-CMS-19 — An Indonesian title is needed to save.**
An editor cannot submit an item without its Indonesian title (products: name).
*Rationale:* Indonesian is the source language; an untitled item shows as a
blank row (`docs/approval-workflow.md`).
*Priority:* Must.
*Acceptance:* saving without it is refused with "Beri judul Bahasa Indonesia
lebih dulu".

**BR-CMS-20 — Both languages before approval.**
An item cannot be approved — by the Approver or by a Super Admin, on create or
edit — while its title is missing in either language, or while its main long
text (body, description or responsibilities) exists in one language but not
the other. The refusal names what is missing.
*Rationale:* decision 4: nothing goes live half-translated.
*Priority:* Must.
*Acceptance:* approving with English missing is refused with "Belum bisa
disetujui — …" (checked by `scripts/checks`).

**BR-CMS-21 — Auto-translate on news and reports.**
A button fills **empty** English fields (title, summary, body, SEO title, SEO
description) from the Indonesian ones, using an agreed glossary and a list of
names that are never translated (CLIK, CRIF, OJK, product names…). Text
already in English is never overwritten. The result is saved like any other
change and still needs approval. Only the module's editors (News Admin) and
Super Admin can use it, at most 30 times per person per hour. Products and
Karir have no Auto-translate.
*Rationale:* decision 4; `docs/auto-translate-and-glossary.md`. The limit
exists because each call is billed and sends text off the server.
*Priority:* Should.
*Acceptance:* an HR Admin using it on a report is refused (checked by
`scripts/checks`); the 31st call in an hour is refused with a message.

### 5.4 Approval and publishing

**BR-CMS-22 — Three statuses; saving is submitting.**
Items are In Review, Approved or Rejected; only Approved is on the website.
There is no Draft. An editor has no status control: their button "Kirim untuk
ditinjau" always puts the item In Review. The status is shown to everyone as a
read-only label.
*Rationale:* decision 14.
*Priority:* Must.
*Acceptance:* an editor's save always results in In Review.

**BR-CMS-23 — The Approver decides, with a reason for rejection.**
On an item In Review, the Approver sees two buttons instead of an editing form:
"Setujui & tayangkan" (approve and publish) and "Tolak" (reject). Rejecting
requires a written reason, which the editor sees on the item. The Approver
cannot change any content, and can decide only on items In Review. On an item
already decided, the buttons are replaced by a note.
*Rationale:* decisions 13, 14.
*Priority:* Must.
*Acceptance:* a rejection without reason is refused; an Approver's attempt to
change content has no effect.

**BR-CMS-24 — Super Admin can approve in the same step.**
A Super Admin has both "Kirim untuk ditinjau" and "Setujui & tayangkan", and
their rejections also need a reason.
*Rationale:* decision 14.
*Priority:* Must.
*Acceptance:* a Super Admin can create and publish an item in one action,
subject to BR-CMS-20.

**BR-CMS-25 — Editors cannot approve their own work.**
An editor (HR, News, Marketing Admin) cannot approve or reject, through the
screen or the API.
*Rationale:* separation of duties (`docs/roles-and-permissions.md`).
*Priority:* Must.
*Acceptance:* the attempt is refused with "Only the Approver can approve or
reject".

**BR-CMS-26 — Live content stays online while its edit is reviewed.**
Editing approved or rejected work sends it back to In Review, whoever edits it.
The approved version stays on the website until the edit is approved, then is
replaced at once. A rejection of the edit also leaves the live version in place.
*Rationale:* decision 22 (revised 29 Sep).
*Priority:* Must.
*Acceptance:* an edit of a live page leaves the old text public; approval swaps
in the new text (checked by `scripts/checks`). Known exception: see OI-10.

**BR-CMS-27 — Items in review are locked to their submitter.**
While an item is In Review, only the person who submitted it can keep editing.
*Rationale:* the Approver should not read a moving target
(`intent/03-cms.md` §3).
*Priority:* Must.
*Acceptance:* another editor's save is refused with "This item is locked while
it is in review".

**BR-CMS-28 — Deleting is direct.**
An editor deletes their own module's items without approval; every deletion is
recorded in the audit log.
*Rationale:* the original "delete as a request" was never built
(`intent/03-cms.md` §2).
*Priority:* Must (as the accepted current behaviour).
*Acceptance:* deletion takes effect immediately and appears in the audit log.

**BR-CMS-29 — Clear outcome after saving.**
After a successful save the user is returned to the list; a failed save keeps
them on the page, with their work and the reason.
*Rationale:* `docs/cms-collections.md` "Back to the list".
*Priority:* Should.
*Acceptance:* a refused approval leaves the form open with the message shown.

### 5.5 Scheduling

**BR-CMS-30 — Publish date holds an item back.**
Approved news and reports dated in the future stay off the website until
00:00 WIB (Jakarta time) on that date. The same rule applies to anyone reading
the content through the site's public data interfaces. Items without a date,
and job vacancies, appear on approval. Preview is exempt.
*Rationale:* decision 21; an embargoed report was once readable through the API.
*Priority:* Must.
*Acceptance:* an approved report dated next month is not found on the website
or through the public API (checked by `scripts/checks`).

### 5.6 Enquiries handling (Data Masuk)

**BR-CMS-31 — Enquiries come only from the website form.**
An enquiry record is created only by the website's contact form, after its
checks and rate limits (see `docs/specs/brd-website.md`). Nobody can create
one inside the CMS or through the API. Each record keeps the visitor's details,
consent, marketing preferences and the context of the submission (language,
page, network address, browser, consent text version).
*Rationale:* decisions 17–19; `docs/contact-form.md`.
*Priority:* Must.
*Acceptance:* creating an enquiry through the API is refused (checked by
`scripts/checks`).

**BR-CMS-32 — Enquiries are permanent and read-only.**
Nobody, including Super Admin, can edit an enquiry's content or delete it.
*Rationale:* decision 19.
*Priority:* Must.
*Acceptance:* an attempt to edit the message leaves it unchanged; a delete is
refused.

**BR-CMS-33 — Follow-up status.**
Each enquiry is **Baru** (new) or **Ditindaklanjuti** (followed up). Setting
Ditindaklanjuti records who did it and when; setting it back to Baru clears
that record. Only Sales Admin and Super Admin can see enquiries and change
this status.
*Rationale:* decision 19 (revised); open item O2.
*Priority:* Must.
*Acceptance:* the "followed up by / at" fields fill and clear with the status.

### 5.7 Media handling

**BR-CMS-34 — Images are managed inside their fields.**
There is no Media menu. The image fields on news and reports let an editor
upload a new image, pick one from the whole library, swap it, and edit its alt
text in both languages. Only a Super Admin can delete a file (at
`/admin/collections/media`).
*Rationale:* decision 26.
*Priority:* Must.
*Acceptance:* no role sees a Media menu item.

**BR-CMS-35 — Only Super Admin replaces an image file.**
The file behind an existing image can be replaced only by a Super Admin.
Editors upload a new image and choose it in their item, which is reviewed like
any other edit.
*Rationale:* images sit outside the approval workflow, so a replaced file
would go straight onto every live page using it (decision 26).
*Priority:* Must.
*Acceptance:* an editor's replacement is refused (checked by `scripts/checks`).

**BR-CMS-36 — Allowed files and sizes.**
Accepted file types: JPEG, PNG, WebP, GIF, AVIF and PDF. SVG is refused.
Maximum 5 MB. Each image field states its recommended size and refuses a newly
chosen image that is too narrow or the wrong shape for its slot, with a message
that says why. Images attached before a rule existed are not re-checked.
*Rationale:* decision log 22 Sep; SVG can carry script (`docs/cms-collections.md`).
*Priority:* Must.
*Acceptance:* an SVG upload is refused (checked by `scripts/checks`); a 6 MB
file is refused with its size named.

**BR-CMS-37 — Uploaded files cannot act as the website.**
Uploaded files are served with protective headers so that, opened directly,
they cannot run anything.
*Rationale:* a second layer behind BR-CMS-36.
*Priority:* Must.
*Acceptance:* checked by `scripts/checks` ("uploaded files are served sandboxed").

### 5.8 Audit and accountability

**BR-CMS-38 — Every change is recorded.**
Every create, update and delete on news, reports, products, vacancies,
enquiries, images and users is written to the audit log, with submissions,
approvals and rejections named as such. Each entry shows the action, the
module, the item's name, the person (their email kept as text, so it survives
the account being deleted; entries by scripts show "Sistem"), the time, and
which fields changed — never their values. A rejection shows its reason; a new
enquiry is marked "Dikirim dari formulir publik". A save that changed nothing
is not recorded.
*Rationale:* decision 25.
*Priority:* Must.
*Acceptance:* editing an article creates one entry naming the article, the
editor and the changed fields.

**BR-CMS-39 — The audit log is protected.**
Only Super Admin can read the audit log. Nobody can create, edit or delete an
entry by hand. If an entry cannot be written, the change it describes is not
saved either.
*Rationale:* `intent/03-cms.md` §9; an unrecorded change is worse than a
refused one (`src/hooks/audit.ts`).
*Priority:* Must.
*Acceptance:* an Approver or editor cannot open the audit log.

### 5.9 Dashboard and analytics

**BR-CMS-40 — The CMS opens on website analytics.**
The first screen shows the last 7 days from CLIK's self-hosted analytics
(Umami): visitors, page views, bounce rate and average visit length (with the
change against the previous period for visitors and page views); page speed —
five measurements in plain words, each rated Baik / Perlu perbaikan / Buruk
against its target; top 10 pages with views, visitors, average time on page,
bounce and load time; and traffic sources. All roles see it.
*Rationale:* decision 24; visitor data never leaves CLIK's server
(`docs/analytics.md`).
*Priority:* Must.
*Acceptance:* after signing in, the dashboard shows these panels.

**BR-CMS-41 — Analytics failure does not affect the CMS.**
If analytics is not configured or unreachable, the dashboard says so in a
sentence and everything else works normally.
*Rationale:* `intent/03-cms.md` §7.
*Priority:* Must.
*Acceptance:* with the analytics service stopped, `/admin` still loads.

### 5.10 Notifications and email

**BR-CMS-42 — System emails in both languages.**
Account-activation and password-reset emails are sent in Indonesian and
English, with absolute links to the site's configured address.
*Rationale:* BR-CMS-03, BR-CMS-04.
*Priority:* Must.
*Acceptance:* both emails appear in the staging mail catcher with working links.

**BR-CMS-43 — Enquiry email to Sales.**
Each enquiry is also emailed to the sales address, with Reply-To set to the
sender; if the email fails the enquiry is still saved. (Website behaviour that
feeds this CMS module; specified in `docs/specs/brd-website.md`.)
*Priority:* Must.
*Acceptance:* see the website BRD.

**BR-CMS-44 — Workflow notifications.**
No email is sent when an item is submitted, approved or rejected; the Approver
finds work by filtering a list for In Review. Whether to add notifications is
open (O3 / OI-03).
*Priority:* Could.
*Acceptance:* to be defined if the owner decides to build it.

---

## 6. Non-functional requirements

| # | Area | Requirement | Source / evidence |
|---|---|---|---|
| NFR-01 | Security | All access rules are enforced on the server, not just by hiding screens, because the same data is reachable through the REST and GraphQL interfaces. | `docs/roles-and-permissions.md` |
| NFR-02 | Security | The sign-in cookie is marked secure when the site is served over HTTPS. | `src/collections/Users.ts` |
| NFR-03 | Security | No secret key appears in admin pages or preview links. | `scripts/checks` "no secret in the admin edit page" |
| NFR-04 | Security | Personal data (enquiries, user records) is never sent to the translation service. | `src/endpoints/autoTranslate.ts`; `scripts/checks` |
| NFR-05 | Reliability | 30 simultaneous saves complete and the public site keeps answering. | `scripts/checks` reliability check; `docs/operations.md` "Database connections" |
| NFR-06 | Reliability | A database request that cannot get a connection within 10 seconds fails instead of hanging the site. | `src/payload.config.ts` |
| NFR-07 | Backup | The site database, analytics database and uploaded files are backed up nightly at 02:00, kept 30 days, readable by root only; restore is scripted and tested. | `docs/operations.md` "Backups", "Restoring" |
| NFR-08 | Releases | A release builds beside the live site, backs up, migrates, switches over and checks the site answers, switching back automatically if not. The last five releases are kept. | `docs/operations.md` "Releasing" |
| NFR-09 | Usability | Refusals are explained in plain language and, where they concern a field, name the problem (size, ratio, missing language). | `src/hooks/approval.ts`, `src/fields/common.ts` |
| NFR-10 | Usability | The admin uses CLIK's fonts and colours; the writing area mirrors the website's article style. | `src/app/(payload)/custom.scss` |
| NFR-11 | Privacy | Visitor analytics stay on CLIK's own server; the CMS itself is not tracked. | `docs/analytics.md` |

No performance targets, uptime targets or monitoring are defined; these were
deferred by the product owner (`docs/deferred-items.md`; OI-09).

## 7. Assumptions, constraints and dependencies

**Assumptions**
- One Approver role covers all modules (decision 13).
- The site runs as a single application process; some protections (Auto-
  translate limit, contact-form queue) rely on that (`docs/contact-form.md`).
- Staff reach the CMS over the office network or the tailnet during staging.

**Constraints**
- Indonesian is the source language; English is produced from it and
  reviewed (decision 4).
- Content that is not news, reports, products or vacancies is changed in code
  by a developer (decision 16).
- Adding a product or job category is a code change (`docs/cms-collections.md`).

**Dependencies**
- **SMTP service** for account activation, password reset and enquiry emails.
  Not yet configured; staging captures mail in Mailpit (O8 / OI-02).
- **Umami** (self-hosted analytics) for the dashboard (`docs/analytics.md`).
- **Anthropic API** for Auto-translate; without its key the button says so and
  nothing else is affected (`docs/auto-translate-and-glossary.md`).
- **PostgreSQL** and **nginx** on the same server (`docs/operations.md`).

## 8. Open items

| # | Item | Why it is open | Source |
|---|---|---|---|
| OI-01 | Owner and sign-off of this BRD; confirmation of the proposed priorities. | No owner is named in the documents. | This document |
| OI-02 | Real SMTP credentials for production. Without them activation, reset and enquiry emails never arrive. | Open item O8. | `intent/00-README.md` |
| OI-03 | Email notifications for submissions and decisions. | Open item O3. | `intent/00-README.md` |
| OI-04 | Redesign impact on the CMS. The CMS module table in `intent/05-redesign.md` §4 (Keep / Change / Remove for Berita, Laporan, Produk, Karir, Data Masuk, Log Audit, Pengguna, Dashboard) is not filled in, and no new design source is recorded. Removing a module needs a migration and a decision about its content. | Status "waiting for the new design". | `intent/05-redesign.md` |
| OI-05 | Separate analytics for staging and production; both currently count into one Umami site. | Open item O9. | `intent/00-README.md`; `docs/analytics.md` |
| OI-06 | CSV export of enquiries. | Not built (O2). | `intent/00-README.md` |
| OI-07 | Image alt text is edited outside the approval workflow: any editor (HR, News, Marketing Admin) can change the alt text of any image, and the change is live at once. Confirm this is acceptable. | Found in code (`src/collections/Media.ts`); not discussed in the documents. | Code review |
| OI-08 | Article publish date: documents say "date only"; the form asks for date and time. Decide which is intended. | Mismatch. | `intent/03-cms.md` §5, `docs/cms-collections.md` vs `src/collections/Newsroom.ts` |
| OI-09 | Automated testing, penetration testing, load testing, performance targets and uptime monitoring. | Deferred by the product owner. | `docs/deferred-items.md` |
| OI-10 | An editor calling the API directly with a non-draft save of their own live item takes it offline (nothing unreviewed becomes visible). Accepted, because editors can already delete their items. Confirm acceptance. | Recorded exception to BR-CMS-26. | `docs/approval-workflow.md` |
| OI-11 | No retention period or data-protection review is recorded for enquiry personal data, which is kept permanently. | Not found in the documents. | `docs/contact-form.md` |
| OI-12 | `docs/deferred-items.md` still lists "Scheduled publishing and content preview" and "Basic analytics" as not built/worth revisiting, but both now exist. Update that register. | Documentation out of date. | `docs/deferred-items.md` |
| OI-13 | Time on page counts idle tabs; measuring visible time only is not built. | Known issue. | `docs/analytics.md` |

## 9. Glossary

| Term | Meaning |
|---|---|
| CMS | Content Management System: the private admin at `/admin`. |
| Module / collection | One kind of content in the CMS, e.g. Berita. |
| Berita / Laporan / Produk / Karir | News / Reports / Product items / Job vacancies. |
| Data Masuk | Enquiries sent through the website's contact form. |
| Log Audit | The record of who changed what, and when. |
| Pengguna | CMS user accounts. |
| In Review / Approved / Rejected | The three approval statuses; only Approved is public. |
| Kirim untuk ditinjau | "Submit for review": the editor's save button. |
| Setujui & tayangkan | "Approve and publish". |
| Tolak | "Reject" (reason required). |
| Baru / Ditindaklanjuti | Enquiry follow-up status: New / Followed up. |
| Slug | The last part of a page's web address, e.g. `/newsroom/<slug>`. |
| Alt text | A short description of an image for screen readers. |
| WIB | Western Indonesia Time (Asia/Jakarta, UTC+7). |
| Embargo | Holding an approved item back until its publish date. |
| Umami | The self-hosted, open-source website analytics tool. |
| Mailpit | A mail catcher used on staging: it keeps every email instead of delivering it. |
| Auto-translate | The button that drafts English text from Indonesian. |
| Preview / Live Preview | Viewing an unapproved item on the real site, in a tab or beside the form. |

---

## Appendix — Role × module permission matrix

Derived from the access rules in code (`src/access/`, `src/collections/`,
`src/components/admin/Nav.tsx`) and consistent with
`docs/roles-and-permissions.md`, except where marked ¹.

| Module | Super Admin | News Admin | HR Admin | Marketing Admin | Sales Admin | Approver |
|---|---|---|---|---|---|---|
| Dashboard (analytics) | View | View | View | View | View | View |
| Berita / News | Full, approve & publish | Create, edit, delete, auto-translate | — | — | — | View, approve / reject |
| Laporan / Reports | Full, approve & publish | Create, edit, delete, auto-translate | — | — | — | View, approve / reject |
| Produk / Products | Full, approve & publish | — | — | Create, edit, delete | — | View, approve / reject |
| Karir / Careers | Full, approve & publish | — | Create, edit, delete | — | — | View, approve / reject |
| Images (inside image fields; no menu) | Upload, edit alt, replace file, delete | Upload, edit alt ¹ | Upload, edit alt ¹ | Upload, edit alt ¹ | — | View ² |
| Data Masuk / Enquiries | View, set follow-up status | — | — | — | View, set follow-up status | — |
| Log Audit / Audit Log | View | — | — | — | — | — |
| Pengguna / Users | Full | Own account only | Own account only | Own account only | Own account only | Own account only |

¹ Any editor can upload and edit the alt text of **any** image, not only images
used in their own module (OI-07).
² Image files are public (the website shows them), so "view" is not a
restriction.
