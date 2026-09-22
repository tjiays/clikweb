'use client'

import { SaveDraftButton, useAuth } from '@payloadcms/ui'

/** Hides "Save draft" from the Approver, who only ever decides. */
export default function SaveDraftUnlessApprover() {
  const { user } = useAuth()
  if ((user as { role?: string } | null)?.role === 'approver') return null
  return <SaveDraftButton />
}
