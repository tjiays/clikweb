import type { SVGProps } from 'react'

/*
 * Orange outline icons of the Hubungi Kami details column (Figma 593:3504
 * building 35x35, 593:3503 envelope 35x31, 593:3502 phone 27x31). Drawn in
 * currentColor; the page sets #FF7D00.
 */

type IconProps = SVGProps<SVGSVGElement>

export function BuildingIcon(props: IconProps) {
  return (
    <svg width="35" height="35" viewBox="0 0 35 35" fill="none" aria-hidden="true" focusable="false" {...props}>
      <g stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round">
        <path d="M8.25 33.75V3.25c0-1.1.9-2 2-2h14.5c1.1 0 2 .9 2 2v30.5" />
        <path d="M8.25 14.75h-4a3 3 0 0 0-3 3v16M26.75 14.75h4a3 3 0 0 1 3 3v16" />
        <path d="M0 33.75h35" strokeLinejoin="miter" />
      </g>
      <g fill="currentColor">
        <rect x="13.1" y="7" width="2.8" height="4.4" />
        <rect x="19.3" y="7" width="2.8" height="4.4" />
        <rect x="13.1" y="14.75" width="2.8" height="4.4" />
        <rect x="19.3" y="14.75" width="2.8" height="4.4" />
        <rect x="13.1" y="22.9" width="2.8" height="4.4" />
        <rect x="19.3" y="22.9" width="2.8" height="4.4" />
      </g>
    </svg>
  )
}

export function EnvelopeIcon(props: IconProps) {
  return (
    <svg width="35" height="31" viewBox="0 0 35 31" fill="none" aria-hidden="true" focusable="false" {...props}>
      <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="1" width="33" height="29" rx="2.5" />
        <path d="M1.8 1.8 17.5 14.8 33.2 1.8" />
      </g>
    </svg>
  )
}

export function PhoneIcon(props: IconProps) {
  return (
    <svg width="27" height="31" viewBox="0 0 27 31" fill="none" aria-hidden="true" focusable="false" {...props}>
      <path
        d="M2.6 1h4.9c.7 0 1.2.5 1.3 1.2l.4 4.4c0 .5-.2.9-.6 1.2L6.3 9.6c1.6 5.5 5.9 10.8 10.6 13.6l1.8-2.2c.3-.4.8-.6 1.3-.5l4.9 1c.6.1 1.1.7 1.1 1.3v5.8c0 .8-.7 1.4-1.5 1.4C11.3 29.4 1.1 17.6 1 2.5 1 1.7 1.8 1 2.6 1Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  )
}
