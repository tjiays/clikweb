'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useDocumentInfo, useFormProcessing } from '@payloadcms/ui'

/**
 * Sends the editor back to the list once a save has actually succeeded.
 *
 * Payload leaves you on the document with a toast, which reads as "did that
 * work?" — especially on a create, where the only visible change is the URL.
 * Going back to the list answers it: the item is there, in its place, with
 * its status.
 *
 * "Succeeded" is read from lastUpdateTime, which Payload sets only in its
 * success handler, from the saved document's updatedAt. This used to go on
 * "the form finished and is not marked invalid" instead — and an error with
 * no field attached (a 502, an upload over the size limit, or a refusal such
 * as "Belum bisa disetujui") leaves the form valid, so the editor was sent to
 * the list, their unsaved work gone and the reason unread.
 */
export default function BackToListOnSave() {
  const router = useRouter()
  const processing = useFormProcessing()
  const { collectionSlug, lastUpdateTime } = useDocumentInfo()
  const wasProcessing = useRef(false)
  const savedAtStart = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (processing && !wasProcessing.current) savedAtStart.current = lastUpdateTime
    const finished = wasProcessing.current && !processing
    wasProcessing.current = processing
    if (!finished || !collectionSlug) return
    if (lastUpdateTime === savedAtStart.current) return

    router.push(`/admin/collections/${collectionSlug}`)
    router.refresh()
  }, [processing, lastUpdateTime, collectionSlug, router])

  return null
}
