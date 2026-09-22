'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useDocumentInfo, useForm, useFormProcessing } from '@payloadcms/ui'

/**
 * Sends the editor back to the list once a save lands.
 *
 * Payload leaves you on the document with a toast, which reads as "did that
 * work?" — especially on a create, where the only visible change is the URL.
 * Going back to the list answers it: the item is there, in its place, with
 * its status.
 *
 * It watches the form rather than replacing the Save button, so Payload keeps
 * its own publish behaviour, its keyboard shortcut and its labels.
 */
export default function BackToListOnSave() {
  const router = useRouter()
  const processing = useFormProcessing()
  const { isValid } = useForm()
  const { collectionSlug } = useDocumentInfo()
  const wasProcessing = useRef(false)

  useEffect(() => {
    const finished = wasProcessing.current && !processing
    wasProcessing.current = processing

    // A save that failed validation leaves the form invalid and the editor on
    // the page, which is where they need to be to fix it.
    if (!finished || !isValid || !collectionSlug) return

    router.push(`/admin/collections/${collectionSlug}`)
    router.refresh()
  }, [processing, isValid, collectionSlug, router])

  return null
}
