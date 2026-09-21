import type { MonthPoint, CategoryPoint } from './dashboardData'

/**
 * Two small charts, drawn as inline SVG.
 *
 * Both are magnitude comparisons, so both are bars. The palette was checked
 * with the validator rather than picked by eye: the five category hues clear
 * the lightness, chroma and colour-vision separation thresholds. Several sit
 * under 3:1 against the surface, which obliges a visible label — so every bar
 * carries its value directly, and each has a native tooltip.
 */

/** Validated categorical order. Assigned by position, never cycled. */
export const SERIES = ['#2a6fd0', '#ff7d00', '#1baf7a', '#7b5cd6', '#e87ba4']

/** Articles published per month. One series, so no legend — the title names it. */
export function PublishedChart({ data }: { data: MonthPoint[] }) {
  const width = 640
  const height = 200
  const padLeft = 28
  const padBottom = 26
  const padTop = 12
  const max = Math.max(1, ...data.map((d) => d.count))
  const plotW = width - padLeft
  const plotH = height - padBottom - padTop
  const slot = plotW / data.length
  const barW = Math.min(26, slot * 0.55)

  // Two recessive gridlines are enough to read height against.
  const ticks = [0, Math.ceil(max / 2), max].filter((v, i, a) => a.indexOf(v) === i)

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="clik-chart" role="img"
         aria-label="Artikel terbit per bulan">
      {ticks.map((t) => {
        const y = padTop + plotH - (t / max) * plotH
        return (
          <g key={t}>
            <line x1={padLeft} x2={width} y1={y} y2={y} className="clik-chart__grid" />
            <text x={padLeft - 8} y={y + 4} className="clik-chart__tick" textAnchor="end">
              {t}
            </text>
          </g>
        )
      })}

      {data.map((d, i) => {
        const h = (d.count / max) * plotH
        const x = padLeft + i * slot + (slot - barW) / 2
        const y = padTop + plotH - h
        return (
          <g key={d.month}>
            {d.count > 0 && (
              // 4px rounded data-end, anchored to the baseline.
              <path
                d={`M${x},${padTop + plotH} L${x},${y + 4} Q${x},${y} ${x + 4},${y}
                    L${x + barW - 4},${y} Q${x + barW},${y} ${x + barW},${y + 4}
                    L${x + barW},${padTop + plotH} Z`}
                className="clik-chart__bar"
              >
                <title>{`${d.label}: ${d.count} artikel`}</title>
              </path>
            )}
            {d.count > 0 && (
              <text x={x + barW / 2} y={y - 5} className="clik-chart__value" textAnchor="middle">
                {d.count}
              </text>
            )}
            <text
              x={x + barW / 2}
              y={height - 8}
              className="clik-chart__tick"
              textAnchor="middle"
            >
              {d.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

/** Products per category. Horizontal bars — the labels are long. */
export function CategoryChart({ data }: { data: CategoryPoint[] }) {
  if (data.length === 0) return null
  const max = Math.max(1, ...data.map((d) => d.count))
  return (
    <ul className="clik-bars">
      {data.map((row, i) => (
        <li key={row.slug} className="clik-bars__row">
          <span className="clik-bars__label">{row.label}</span>
          <span className="clik-bars__track">
            <span
              className="clik-bars__fill"
              style={{
                width: `${Math.max(4, (row.count / max) * 100)}%`,
                background: SERIES[i % SERIES.length],
              }}
              title={`${row.label}: ${row.count} produk`}
            />
          </span>
          <span className="clik-bars__value">{row.count}</span>
        </li>
      ))}
    </ul>
  )
}
