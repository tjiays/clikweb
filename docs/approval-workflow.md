# Approval workflow

Three statuses, and only one of them is on the website.

| Status | Meaning | Public site |
| --- | --- | --- |
| **In Review** | Submitted, waiting for a decision | No |
| **Approved** | Signed off | **Yes — live** |
| **Rejected** | Sent back, reason required | No |

There is no Draft. Saving is what submits an item, so Draft was never a state
anyone chose — and an item in Draft could not be approved either, because the
Approver may only decide on something in review. It was a dead end as well as
a dead state. Work in progress is simply an item in review that nobody has
decided on yet, and its author can keep editing it until they do.

## Who moves what

| Role | On save | Can set |
| --- | --- | --- |
| HR / News / Marketing Admin | **Kirim untuk ditinjau** → In Review | nothing |
| Approver | — | **Setujui & tayangkan** or **Tolak** (reason required), only on an item in review |
| Super Admin | **Kirim untuk ditinjau** → In Review | or **Setujui & tayangkan** in the same save |

Everyone sees the status as a read-only label; decisions are the buttons.
There is no status dropdown: a status chosen there and then saved as a draft
could leave an "Approved" draft that never reached the website.

## Editing settled work

Anything approved or rejected goes back to **In Review** the moment it is
saved, whoever saves it. **The approved page stays on the website meanwhile**,
and is replaced by the reviewed version the moment it is approved.

This works through Payload's draft versions. Every save that is not an
approval — an editor's, a Super Admin's **Kirim untuk ditinjau**, and the
Approver's **Tolak** — is saved as a *draft version*: Payload writes only the
version history and leaves the published document, the one the website reads,
untouched. Only **Setujui & tayangkan** publishes. The admin list and the
Approver's form show the latest draft, so a pending edit shows as In Review
and can be found and read as usual. Verified on 29 September: an edit, a
second edit and a rejection all left the live text in place; the approval
swapped it in.

A Super Admin's **Setujui & tayangkan** on an item that was already approved
counts as the decision even though the status does not change — otherwise it
would read as "no decision" and send the edit back for review through a
publish, taking the page down.

(From 23 to 29 September every save published, so editing an approved page
took it off the website until someone approved the edit. That was replaced at
the product owner's request.)

**One route still takes a page down:** an editor calling the REST API directly
with a non-draft save of their own live item. The admin never does this, and
nothing unreviewed becomes visible — the page goes offline instead. It is not
blocked because editors can already delete their module's items outright,
which is strictly more.

The admin form posts back whatever the status field is showing, so an
unchanged value is not a choice. Reading it as one is what once left a
rejected item rejected however often it was saved, and refused an editor's
save outright on anything rejected or approved.

## Locking

An item in review is locked to everyone except the person who submitted it.
The Approver is not reading a moving target, and an author is not locked out
of their own half-written piece by their first save.

## What the editor sees

One orange button, **Kirim untuk ditinjau**. Pressing it saves a draft and
submits it: the item lands on In Review and the editor is taken back to the
list — only once the save has succeeded. A failed save leaves them on the
page with their work and the reason. Payload's **Revert to published** button
is shown to Super Admin only: for an editor the server refuses it, and for the
Approver it would publish the pending edit rather than revert it.

## What the Approver sees

No form. The Approver opens an item in review, reads both languages — they sit
side by side on the same page — and presses one of two buttons:

- **Setujui & tayangkan** — approves; the item goes live (subject to its
  publish date, below).
- **Tolak** — opens **Alasan penolakan**. The rejection cannot be sent without
  a reason, and the editor sees it on the item.

On an item already decided, the buttons are replaced by a note: "Sudah disetujui
dan tayang di website" or "Sudah ditolak. Menunggu penulis memperbaiki dan
mengirim ulang."

To find waiting work, filter any list by **Approval Status = In Review**. There
are no notifications (open item O3).

## Both languages before approval

An item cannot be approved with a language missing — by the Approver or by
Super Admin, when creating as well as when editing. The check looks at what
the item **will be after the save**: stored content with this save's changes
laid over it. (Until 29 September it read only the stored copy, so a Super
Admin could create an item as Approved with English missing and it went
live, or was refused after filling in the English in the same save.) A
Super Admin's rejection needs a reason, the same as the Approver's. The title is required in
both; a body or description that exists in one language must exist in the
other. The refusal names what is missing. An Indonesian title is required
before an item can even be saved, because without it the item shows as a blank
row in every list.

## Publish date

Approval makes an item eligible; the **publish date** decides when readers see
it. News and reports dated in the future stay off the site — lists, their own
page, related articles, sitemap — until 00:00 WIB on that day. An item with no
date is visible on approval. Preview is exempt, so next week's article can be
checked before it is approved.

## Where it is enforced

In `src/hooks/approval.ts`, as a database-level hook rather than in the
interface, because the REST and GraphQL APIs reach the same data. It refuses,
with a readable message:

| Situation | Message |
| --- | --- |
| An editor tries to approve or reject | Only the Approver can approve or reject. Submit it for review instead. |
| The Approver tries to edit content | The Approver can only approve or reject an item. |
| A decision on something never submitted | Only an item that has been submitted for review can be decided on. |
| A rejection with no reason | A rejection must include a reason. |
| Someone else edits an item in review | This item is locked while it is in review. |
| Approval with a language missing | Belum bisa disetujui — … |

The form always posts back whatever the status field shows, so the hook treats
a status as a decision only when it **changes**. Reading an unchanged value as
a choice is what once left a rejected item rejected however often it was saved.

## Seeing it before approving

**Preview** opens the item on the real site, exactly as a visitor will see it,
while it is still unapproved. **Live Preview** shows the same page beside the
form and refreshes on save. Nothing is published by previewing. The route
checks the signed-in session and whether that person may read unapproved work
in the module, so a draft cannot be read by guessing its URL, and a Sales or HR
Admin cannot open a report that is still in review.

## What is recorded

Every submission, approval, rejection, create, update and delete is written to
the **Log Audit** (menu group Data), with the item, the person and — for a
rejection — the reason. Only Super Admin can read it, and nobody can edit or
delete an entry. See [CMS collections](./cms-collections.md#what-the-audit-trail-covers).

## History

The workflow began as **Draft → In Review → Published**, with the live version
staying online while an edit was reviewed, and deletion as a request. During
the build the product owner asked for saving to submit, and Draft became a
state nothing could reach or leave, so it was removed (21 September). Editing
settled work took the page down until it was re-approved (23 September),
and from 29 September the live version stays online through the review.
Deletion-by-request was never built. The reasoning is in commits `09a2b7e`,
`27e6c9b` and `714ecd8`.
