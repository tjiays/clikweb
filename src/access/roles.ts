import type { User } from '@/payload-types'

/**
 * The six roles from intent/03-cms.md.
 *
 * A user has exactly one role. Only Super Admin manages users.
 */
export const ROLES = {
  superAdmin: 'super_admin',
  hrAdmin: 'hr_admin',
  newsAdmin: 'news_admin',
  marketingAdmin: 'marketing_admin',
  salesAdmin: 'sales_admin',
  approver: 'approver',
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

export const ROLE_OPTIONS: { label: string; value: Role }[] = [
  { label: 'Super Admin', value: ROLES.superAdmin },
  { label: 'HR Admin', value: ROLES.hrAdmin },
  { label: 'News Admin', value: ROLES.newsAdmin },
  { label: 'Marketing Admin', value: ROLES.marketingAdmin },
  { label: 'Sales Admin', value: ROLES.salesAdmin },
  { label: 'Approver', value: ROLES.approver },
]

/** The three editor roles. Their changes always go through approval. */
export const EDITOR_ROLES: Role[] = [ROLES.hrAdmin, ROLES.newsAdmin, ROLES.marketingAdmin]

type MaybeUser = Pick<User, 'role'> | null | undefined

export const hasRole = (user: MaybeUser, ...roles: Role[]): boolean =>
  Boolean(user?.role && roles.includes(user.role as Role))

export const isSuperAdmin = (user: MaybeUser) => hasRole(user, ROLES.superAdmin)
export const isApprover = (user: MaybeUser) => hasRole(user, ROLES.approver)
export const isSalesAdmin = (user: MaybeUser) => hasRole(user, ROLES.salesAdmin)
export const isEditor = (user: MaybeUser) => hasRole(user, ...EDITOR_ROLES)
