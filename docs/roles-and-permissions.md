# Roles and permissions

Six roles, from `intent/03-cms.md`. **A user has exactly one role**, and only
Super Admin manages users.

| Role | Type | Scope |
| --- | --- | --- |
| Super Admin | Full access | Everything. Can approve in the same save that creates or edits an item. |
| HR Admin | Editor | Karir (job vacancies) |
| News Admin | Editor | Berita (news) and Laporan (reports) |
| Marketing Admin | Editor | Produk (product items) |
| Sales Admin | Viewer | Data Masuk (contact enquiries) |
| Approver | Reviewer | Every item in review, across all four content modules. Approves or rejects; cannot edit. |

## What each role can reach

| Module | Super Admin | HR | News | Marketing | Sales | Approver |
| --- | --- | --- | --- | --- | --- | --- |
| Dashboard (website analytics) | View | View | View | View | View | View |
| Berita / News | Full | — | Create, edit, delete | — | — | Approve / Reject |
| Laporan / Reports | Full | — | Create, edit, delete | — | — | Approve / Reject |
| Produk / Products | Full | — | — | Create, edit, delete | — | Approve / Reject |
| Karir / Careers | Full | Create, edit, delete | — | — | — | Approve / Reject |
| Images (via the image fields; no menu) | Upload, delete | Upload | Upload | Upload | — | View |
| Data Masuk / Enquiries | View, follow-up status | — | — | — | View, follow-up status | — |
| Log Audit / Audit Log | View | — | — | — | — | — |
| Pengguna / Users | Full | — | — | — | — | — |

Everything else on the website — page copy, logos, testimonials, policy pages,
contact details — is in code, not the CMS, and is changed by a developer.

**Creates and edits go through approval; deletes do not.** An editor deletes
their own module's items directly, and the deletion lands in the audit log.
The original intent had deletion wait for approval; that was never built.

## How it is enforced

Access rules live in `src/access/` and on each collection, not in the admin
interface, because the REST and GraphQL APIs reach the same data. A rule that
only hid a menu item would not be a rule. The sidebar
(`src/components/admin/Nav.tsx`) mirrors these rules so nobody is shown a menu
that leads to an empty or refused page.

Guarantees worth stating plainly:

- **The Approver cannot edit content.** Every content field refuses writes from
  the Approver. They can only record a decision and its reason.
- **An editor cannot approve their own work**, through the form or the API.
- **A user cannot change their own role.** Only Super Admin may write `role`.
- **Contact enquiries cannot be edited or deleted**, by anyone including Super
  Admin. Only the follow-up status changes.
- **Nobody can delete their own account, and the last Super Admin cannot be
  deleted.**

## Adding a user

Super Admin opens **Pengguna → Create new** and fills in name, email, password
and role. The account stays inactive until its owner clicks the verification
link emailed to them. While outgoing mail is caught by Mailpit (staging), the
link reaches no inbox; Super Admin can read it on the user's page and pass it
on.

## Removing a user

On the **Pengguna** list, Super Admin presses **Hapus** on the row, then
confirms. The same button is on the user's own page. The account's audit
entries keep the person's email, so the history survives the account.
