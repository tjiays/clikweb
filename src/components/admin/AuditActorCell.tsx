'use client'

import './AuditActorCell.scss'

/**
 * Who did it, on the audit log list.
 *
 * The relationship to the user is not enough on its own. Accounts get
 * deleted, and the reference is SET NULL rather than cascaded so the history
 * survives the person — which left the column blank on exactly the rows people
 * most want to read, the ones recording a deletion.
 *
 * So the address is read from the plain-text copy the hook stores alongside
 * the link, and the link is used only for a nicer name while the account still
 * exists. Rows with neither were written by a seed script or a migration, not
 * by a person, and say so.
 */
export default function AuditActorCell({
  rowData,
}: {
  rowData?: {
    user?: { name?: string | null; email?: string | null } | number | string | null
    userEmail?: string | null
  }
}) {
  const linked = rowData?.user
  const name =
    linked && typeof linked === 'object' ? (linked.name ?? linked.email ?? null) : null
  const email = rowData?.userEmail ?? null

  if (name && email && name !== email) {
    return (
      <span className="clik-actor">
        <span className="clik-actor__name">{name}</span>
        <span className="clik-actor__email">{email}</span>
      </span>
    )
  }

  if (name || email) {
    return <span className="clik-actor__name">{name ?? email}</span>
  }

  return <span className="clik-actor__system">Sistem</span>
}
