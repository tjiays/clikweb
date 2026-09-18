import type { Access, FieldAccess } from 'payload'
import { ROLES, isApprover, isSuperAdmin, type Role } from './roles'

export * from './roles'

/** Anyone signed in to the admin panel. */
export const authenticated: Access = ({ req: { user } }) => Boolean(user)

/** Signed-in, or a published document requested by the public website. */
export const authenticatedOrPublished: Access = ({ req: { user } }) => {
  if (user) return true
  return { _status: { equals: 'published' } }
}

export const superAdminOnly: Access = ({ req: { user } }) => isSuperAdmin(user)

/**
 * Who may edit a module: Super Admin, plus the one editor role that owns it.
 * The Approver is deliberately excluded — reviewing is not editing.
 */
export const moduleEditor =
  (...owners: Role[]): Access =>
  ({ req: { user } }) =>
    isSuperAdmin(user) || Boolean(user?.role && owners.includes(user.role as Role))

/**
 * Who may save a change: Super Admin, the owning editors, and the Approver —
 * who needs write access to record a decision. Field-level rules stop the
 * Approver from altering any content field.
 */
export const moduleEditorOrApprover =
  (...owners: Role[]): Access =>
  ({ req: { user } }) =>
    isSuperAdmin(user) ||
    isApprover(user) ||
    Boolean(user?.role && owners.includes(user.role as Role))

/** Who may see a module in the admin panel: its editors, plus the Approver. */
export const moduleReader =
  (...owners: Role[]): Access =>
  ({ req: { user } }) =>
    isSuperAdmin(user) ||
    isApprover(user) ||
    Boolean(user?.role && owners.includes(user.role as Role))

/**
 * Content fields are locked for the Approver, who may only approve or reject.
 * Super Admin and the owning editor keep normal access.
 */
export const contentFieldAccess: FieldAccess = ({ req: { user } }) => !isApprover(user)

/** Only the Approver and Super Admin may record a decision. */
export const decisionFieldAccess: FieldAccess = ({ req: { user } }) =>
  isSuperAdmin(user) || isApprover(user)

export const MODULE_OWNERS = {
  karir: [ROLES.hrAdmin],
  newsroom: [ROLES.newsAdmin],
  laporan: [ROLES.newsAdmin],
  marketing: [ROLES.marketingAdmin],
} satisfies Record<string, Role[]>
