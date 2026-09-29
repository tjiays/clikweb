# 03 — CMS

The CMS runs inside the website application at `/admin`: one codebase, one database, one deployment. It uses the same fonts and colors as the website.

**Revised 28 September 2026.** The CMS was deliberately made smaller during the build. It now holds only what the team publishes on its own schedule — **news, reports, product items and job vacancies** — plus contact enquiries, users and the audit log. Everything else on the website (hero slides, stats, testimonials, timeline, logos, CTA blocks, page copy, policy pages, contact details) lives in code under `src/content/` and is changed by a developer. See the decision log in `00-README.md` for what changed and why.

## 1. Roles

| Role | Type | Scope |
|---|---|---|
| **Super Admin** | Full access | Everything, including users and the audit log. Can approve in the same save that creates or edits an item. |
| **HR Admin** | Editor | Karir (job vacancies) |
| **News Admin** | Editor | Berita (news) and Laporan (reports) |
| **Marketing Admin** | Editor | Produk (product items) |
| **Sales Admin** | Viewer | Data Masuk (contact enquiries): read, and set the follow-up status |
| **Approver** | Reviewer (one role for all modules) | Approves or rejects items in review. Cannot edit content. Rejection **requires a reason**. |

A user has exactly one role. Only Super Admin creates, edits and deletes users, and no one can change their own role.

## 2. Permission matrix

| Module | Super Admin | HR Admin | News Admin | Marketing Admin | Sales Admin | Approver |
|---|---|---|---|---|---|---|
| Berita (news) | Full | — | Create, edit, delete | — | — | Approve / Reject |
| Laporan (reports) | Full | — | Create, edit, delete | — | — | Approve / Reject |
| Produk (product items) | Full | — | — | Create, edit, delete | — | Approve / Reject |
| Karir (job vacancies) | Full | Create, edit, delete | — | — | — | Approve / Reject |
| Images (inside the image fields) | Upload, delete | Upload | Upload | Upload | — | View |
| Data Masuk (enquiries) | View, follow-up status | — | — | — | View, follow-up status | — |
| Log Audit | View | — | — | — | — | — |
| Pengguna (users) | Full | — | — | — | — | — |
| Dashboard (website analytics) | View | View | View | View | View | View |

- Every create and edit by an editor goes through approval (§3).
- **Deleting is not a request.** An editor deletes their own module's items directly, and the deletion is recorded in the audit log. This differs from the original intent, which had deletion wait for approval; that was never built.
- Nobody may edit or delete a contact enquiry's content, including Super Admin. Only its follow-up status changes.

## 3. Approval workflow

Three statuses, and only one of them is on the website.

| Status | Meaning | On the website |
|---|---|---|
| **In Review** | Saved, waiting for a decision | No |
| **Approved** | Signed off | Yes |
| **Rejected** | Sent back, with a reason | No |

```
 editor saves ──▶ In Review ──approve──▶ Approved
                     │  ▲                   │
                     │  └────── any edit ───┘
                     └──reject (reason)──▶ Rejected ──any edit──▶ In Review
```

Rules:
- **Saving is submitting.** An editor has no status control; their save always lands on In Review. They see the status as a read-only label.
- **No Draft.** Work in progress is an item in review that nobody has decided on yet; its author can keep editing it.
- **Editing approved or rejected work sends it back to In Review**, whoever edits it. An approved page leaves the website until the edit is approved. Nothing unreviewed reaches a reader; the cost is that a typo fix takes the page down until someone approves it.
- **Super Admin** may set Approved in the same save, which publishes immediately.
- **Locking:** an item in review is locked to everyone except the person who submitted it.
- **Both languages** must be filled in before an item can be approved (§4).
- The **Approver** gets two buttons instead of a form: **Setujui & tayangkan** and **Tolak**. Tolak asks for the reason, which the editor sees on the item. Once decided, the buttons are replaced by a note saying so.
- **Publish date:** news and reports with a future date stay off the site until 00:00 WIB on that day, even when approved.
- After saving, the editor is taken back to the list.
- **Revision history:** up to 25 versions per item.
- **Notifications:** none. The Approver finds work by filtering a list for In Review (open item O3).

## 4. Bilingual content

- Each text field exists twice on the same page, **Indonesian and English side by side** (`titleId` / `titleEn`, and so on). There is no language switcher on these forms.
- Both are required before approval.
- **Auto-translate** (news and reports only) fills empty English fields from the Indonesian ones. The result is saved like any other change and still needs approval. Products and Karir have no auto-translate.
- **Slugs** are shared by both languages and made from the Indonesian title, automatically. They are hidden from the form.
- Image alt text is stored in both languages.
- The admin interface itself can be used in Indonesian or English.

## 5. Content models

Every content model carries: `approvalStatus`, `rejectionReason`, who submitted and reviewed it and when, `publishedAt`, a hidden `isSample` flag, and timestamps.

### Berita (News Admin) — `articles`
- Gambar sampul (cover; recommended 1140×650px, 7:4)
- Gambar banner for the article page (recommended 1300×372px, 3.5:1; falls back to the cover)
- Judul, Ringkasan, Isi artikel — each in Indonesian and English. Title required in both.
- Anda mungkin juga tertarik dengan — up to 3 related articles; empty means the newest
- SEO title and description, both languages
- Penulis — filled with the editor's name, editable
- Tanggal publikasi — required, filled with today, date only

### Laporan (News Admin) — `reports`
- Jenis laporan: Laporan Tahunan or Laporan Perkembangan Usaha
- Gambar sampul (3:2)
- Judul, Ringkasan, Isi laporan — both languages; title and body required in both
- Penulis, Tanggal publikasi (optional), Urutan

### Produk (Marketing Admin) — `product-items`
- Nama produk, Deskripsi singkat, Deskripsi — both languages
- Fitur utama, Cocok untuk, Kegunaan — repeating lists, both languages
- Status — any of **Live**, **Ready to Sell**, **NEW**, **at most two**, or none
- Kategori — one of five fixed categories (Credit Scoring, Analytics, Decisioning, Business Intelligence, Consulting), defined in code
- Urutan

### Karir (HR Admin) — `job-openings`
- Nama posisi — both languages
- Kategori — IT, Analytics, Sales / Business Development, Operations, Finance (defined in code)
- Tanggung jawab, Persyaratan — rich text, both languages
- Tautan lamaran (JobStreet) — where Lamar goes; empty uses the company page
- Lowongan masih dibuka — only open vacancies are listed
- Urutan

### Urutan (sort order), everywhere
Left at 0, a list orders itself newest first. A lower number pins an item above the rest.

### Data Masuk (Sales Admin) — `contact-submissions`
Fields as in `04` §1. Read-only, never deleted. `followUpStatus` is **Baru** or **Ditindaklanjuti**; setting Ditindaklanjuti records who and when, and setting it back to Baru clears that record.

### Pengguna (Super Admin) — `users`
Name, email, password, role — all required at creation. See §8.

### Log Audit (Super Admin) — `audit-log`
Written by the system only. See §9.

### Images — `media`
The store behind every image field. Alt text in both languages. Upload limit **5 MB**. No menu of its own (§10).

### In code, not in the CMS
Hero slides, stats, section headings, testimonials, milestones, partner and member logos, CTA blocks, About / Layanan / Business Solution / Credit Scoring copy, Karir page sections, media outlets and coverage, policy and how-to pages, contact details and social links. Files and how to change them: `docs/editing-content.md`.

## 6. Admin navigation

The sidebar shows each user only what their role can reach, with no group headings. Account and sign-out are pinned at the bottom.

| Menu (ID / EN) | Who sees it |
|---|---|
| Dashboard | Everyone |
| Berita / News | News Admin, Approver, Super Admin |
| Laporan / Reports | News Admin, Approver, Super Admin |
| Produk / Products | Marketing Admin, Approver, Super Admin |
| Karir / Careers | HR Admin, Approver, Super Admin |
| Data Masuk / Enquiries | Sales Admin, Super Admin |
| Log Audit / Audit Log | Super Admin |
| Pengguna / Users | Super Admin |

Lists have no "Columns" chooser; each list shows a fixed set of columns.

## 7. Dashboard

The CMS opens on **website analytics** for the last 7 days, drawn from a self-hosted Umami (see `04` §6):
- Visitors, page views, bounce rate and average visit length, each with the change against the previous week
- **Page speed** — five measurements explained in plain words, each with a Baik / Perlu perbaikan / Buruk rating and its target
- **Top pages** — views, visitors, average time on page, bounce rate and load time per page
- **Traffic sources**

If analytics is unreachable, the dashboard says so and the rest of the CMS works normally.

## 8. Users and accounts

- Super Admin creates an account with name, email, password and role.
- The account is **inactive until its owner clicks the verification link** emailed to them. While mail is not configured, Super Admin can read the link from the user's page.
- Super Admin can delete a user from the list (two-step confirmation) or from the user's page. Nobody can delete their own account, and the last Super Admin cannot be deleted.
- Five wrong passwords lock an account for 10 minutes. "Forgot password" sends a reset link by email.

## 9. Audit log

Every create, update and delete on news, reports, products, vacancies, enquiries, images and users, plus every submit, approval and rejection. Each entry names the **item** and the **person**; the person's email is stored as text so it survives their account being deleted. Entries written by scripts show **Sistem**. The detail names the fields that changed without ever showing their values, and a save that changed nothing is not recorded. Nobody can edit or delete an entry.

## 10. Images

Images are managed where they are used: the cover and banner fields on news and reports can upload a new file, pick an existing one from the whole library, swap it, and edit its alt text in both languages. There is no Media menu for any role. The only thing the fields cannot do is delete a file; Super Admin can do that at `/admin/collections/media`.

Each image field states its recommended size and the 5 MB limit. It refuses files over 5 MB, narrower than the slot's minimum width, or outside its ratio range.

## 11. Seed data

Figma text was imported as published seed content. Placeholder items (WebbyFrames, Zoomerr, SHELLS, lorem ipsum testimonials, author "gvezenzcha" and similar) carry a hidden `isSample` flag so they can be found and replaced.
