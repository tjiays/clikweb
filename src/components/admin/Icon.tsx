/**
 * Payload puts a mark at the start of the breadcrumb trail, top-left of the
 * main area, linking back to the dashboard.
 *
 * It is removed: the sidebar carries the CLIK logo and a Dashboard entry a
 * few centimetres to its left, so this was a second logo and a second link to
 * the same place. On list views the trail holds nothing else, so it was
 * usually anchoring an empty breadcrumb.
 *
 * Returning null leaves Payload's wrapper behind as an empty box, so
 * `.step-nav__home` is hidden in custom.scss to close the gap.
 */
export default function Icon() {
  return null
}
