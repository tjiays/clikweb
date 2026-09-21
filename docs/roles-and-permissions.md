# Roles and permissions

Six roles, from `intent/03-cms.md`. **A user has exactly one role**, and only
Super Admin manages users.

| Role | Type | Scope |
| --- | --- | --- |
| Super Admin | Full access | Everything. Changes publish directly, with no approval. |
| HR Admin | Editor | Karir |
| News Admin | Editor | Newsroom and Laporan |
| Marketing Admin | Editor | Sales Admin | Viewer | Contact form submissions only |
| Approver | Reviewer | Sees every submitted change across all modules. Can only approve or reject. |

## What each role can reach

| Module | Super Admin | HR | News | Marketing | Sales | Approver |
| --- | --- | --- | --- | --- | --- | --- |
| Karir (lowongan, kategori, konten halaman) | Full | Edit + submit | — | — | — | Approve / Reject |
| Newsroom (artikel, author, outlet, liputan) | Full | — | Edit + submit | — | — | Approve / Reject |
| Laporan | Full | — | Edit + submit | — | — | Approve / Reject |
| CTA Blocks, Page Content | Full | — | — | Edit + submit | — | Approve / Reject |
| Halaman statis (kebijakan, cara, pengaduan) | Full | — | — | — | — | — |
| Media Library | Full | Upload | Upload | Upload | — | View |
| Data Masuk (Hubungi Kami) | Full | — | — | — | View, mark followed up | — |
| Pengaturan Umum | Full | — | — | — | — | — |
| Users & Roles, Audit Log | Full | — | — | — | — | — |

Policy and how-to pages are Super Admin only, per open item **O7**, until the
product owner says who else should edit them.

## How it is enforced

Access rules live in `src/access/`, not in the admin interface, because the
REST and GraphQL APIs reach the same data. A rule that only hid a menu item
would not be a rule.

Three guarantees worth stating plainly:

- **The Approver cannot edit content.** Every content field carries field-level
  access that refuses writes from the Approver. They may set only the decision
  and its reason.
- **A user cannot change their own role.** The `role` field refuses writes from
  anyone but Super Admin, so an editor cannot promote themselves through the API.
- **Contact submissions cannot be edited or deleted.** Every field is read-only
  after creation except the "followed up" flag, and deletion is refused for
  everyone including Super Admin, because these are permanent records
  (confirmed decision 19).

## Adding a user

Super Admin opens **Pengaturan → Users & Roles → Create**, sets a name, email
and role, and the new user sets their own password through the login screen.
