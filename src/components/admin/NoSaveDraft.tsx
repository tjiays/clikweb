'use client'

/**
 * Nothing, in place of Save draft.
 *
 * There is no Draft any more: saving submits for review, and the published
 * state is derived from the approval status rather than from Payload's own
 * draft flag. The button still worked, it just did exactly what Publish did,
 * under a name that suggested otherwise.
 */
export default function NoSaveDraft() {
  return null
}
