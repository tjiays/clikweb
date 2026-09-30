'use client'

import { RefreshRouteOnSave } from '@payloadcms/live-preview-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

/**
 * Re-renders the page inside the Live Preview pane whenever the editor saves.
 *
 * The pages are server-rendered from the database, so there is nothing on the
 * client to patch field by field; asking Next to refetch the route is both
 * simpler and shows exactly what a reader would get.
 *
 * The origin comes from the browser rather than from an environment variable
 * because staging answers on more than one address, and this has to match
 * whichever one the editor is on or the message is rejected as cross-origin.
 */
export function RefreshOnSave() {
  const router = useRouter()
  const [origin, setOrigin] = useState('')

  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  if (!origin) return null

  return <RefreshRouteOnSave refresh={() => router.refresh()} serverURL={origin} />
}
