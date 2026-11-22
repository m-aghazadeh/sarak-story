import type { CSSProperties, ReactNode } from "react";
import { faDigits } from "@/lib/format";

/**
 * Presentation charts — static SVG with dark-/light-validated palette and
 * CSS enter animations that replay when the slide becomes active (driven by
 * the ancestor [data-active="true"]). Rules: fixed categorical order, one hue
 * per series, text in ink tokens (never the series color), a legend only for
 * ≥2 series, recessive grid, rounded data-ends, gaps. See Design.md §2.
 */

const SERIES = [
  "var(--series-1)",
  "var(--series-2)",
  "var(--series-3)",
  "var(--series-4)",
];

interface Series {
  name: string;
  data: number[];
  color?: string;
}

function niceMax(v: number) {
  const pow = Math.pow(10, Math.floor(Math.log10(v || 1)));
  const n = v / pow;
  const step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10;
  return step * pow;
}

function Legend({ series }: { series: Series[] }) {
  if (series.length < 2) return null;
  return (
    <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
      {series.map((s, i) => (
        <span key={i} className="flex items-center gap-2 text-sm text-ink-2">
          <span
            className="h-2.5 w-2.5 rounded-[3px]"
            style={{ background: s.color ?? SERIES[i % SERIES.length] }}
          />
          {s.name}
        </span>
      ))}
    </div>
  );
}

function ChartFrame({
  children,
  caption,
}: {
  children: ReactNode;
  caption?: ReactNode;
}) {
  return (
    <figure className="w-full">
      {children}
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-ink-3">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

const delayVar = (ms: number) => ({ ["--cd" as string]: `${ms}ms` } as CSSProperties);

/* ------------------------------- BarChart ------------------------------- */

export function BarChart({
  categories,
  series,
  unit = "",
  max,
  caption,
}: {
  categories: string[];
  series: Series[];
  unit?: string;
  max?: number;
  caption?: ReactNode;
}) {
  const W = 820;
  const H = 360;
  const pad = { top: 30, right: 16, bottom: 44, left: 48 };
  const plotW = W - pad.left - pad.right;
  const plotH = H - pad.top - pad.bottom;
  const dataMax = max ?? niceMax(Math.max(...series.flatMap((s) => s.data)));
  const groupW = plotW / categories.length;
  const barGap = 8;
  const innerW = groupW * 0.6;
  const barW =
    series.length > 1
      ? (innerW - barGap * (series.length - 1)) / series.length
      : innerW;
  const ticks = 4;
  const y = (v: number) => pad.top + plotH - (v / dataMax) * plotH;
  const showValues = categories.length * series.length <= 8;

  return (
    <ChartFrame caption={caption}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" className="overflow-visible">
        <defs>
          {series.map((s, i) => {
            const color = s.color ?? SERIES[i % SERIES.length];
            return (
              <linearGradient key={i} id={`bar-${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} />
                <stop offset="100%" stopColor={color} stopOpacity="0.72" />
              </linearGradient>
            );
          })}
        </defs>

        {/* gridlines + y labels */}
        {Array.from({ length: ticks + 1 }, (_, i) => {
          const v = (dataMax / ticks) * i;
          const yy = y(v);
          return (
            <g key={i}>
              <line
                x1={pad.left}
                x2={W - pad.right}
                y1={yy}
                y2={yy}
                stroke="var(--line)"
                strokeWidth={i === 0 ? 1.5 : 1}
              />
              <text x={pad.left - 10} y={yy + 4} textAnchor="end" fill="var(--ink-3)" fontSize="12">
                {faDigits(Math.round(v))}
              </text>
            </g>
          );
        })}

        {/* bars */}
        {categories.map((cat, ci) => {
          const gx = pad.left + groupW * ci + (groupW - innerW) / 2;
          return (
            <g key={ci}>
              {series.map((s, si) => {
                const v = s.data[ci] ?? 0;
                const bx = gx + si * (barW + barGap);
                const by = y(v);
                const bh = Math.max(pad.top + plotH - by, 0);
                return (
                  <g key={si}>
                    <rect
                      className="chart-bar"
                      style={delayVar((ci * series.length + si) * 55)}
                      x={bx}
                      y={by}
                      width={barW}
                      height={bh}
                      rx={6}
                      fill={`url(#bar-${si})`}
                    />
                    {showValues && (
                      <text
                        className="chart-label"
                        style={delayVar(500 + (ci * series.length + si) * 55)}
                        x={bx + barW / 2}
                        y={by - 8}
                        textAnchor="middle"
                        fill="var(--ink-2)"
                        fontSize="12"
                        fontWeight="700"
                      >
                        {faDigits(v)}
                        {unit}
                      </text>
                    )}
                  </g>
                );
              })}
              <text
                x={pad.left + groupW * ci + groupW / 2}
                y={H - pad.bottom + 22}
                textAnchor="middle"
                fill="var(--ink-2)"
                fontSize="13"
              >
                {cat}
              </text>
            </g>
          );
        })}
      </svg>
      <Legend series={series} />
    </ChartFrame>
  );
}

/* ------------------------------ LineChart ------------------------------- */

export function LineChart({
  categories,
  series,
  unit = "",
  max,
  area = true,
  caption,
}: {
  categories: string[];
  series: Series[];
  unit?: string;
  max?: number;
  area?: boolean;
  caption?: ReactNode;
}) {
  const W = 820;
  const H = 380;
  const pad = { top: 28, right: 54, bottom: 44, left: 48 };
  const plotW = W - pad.left - pad.right;
  const plotH = H - pad.top - pad.bottom;
  const dataMax = max ?? niceMax(Math.max(...series.flatMap((s) => s.data)));
  const ticks = 4;
  const x = (i: number) =>
    pad.left + (categories.length === 1 ? plotW / 2 : (plotW / (categories.length - 1)) * i);
  const y = (v: number) => pad.top + plotH - (v / dataMax) * plotH;

  return (
    <ChartFrame caption={caption}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" className="overflow-visible">
        <defs>
          {series.map((s, i) => {
            const color = s.color ?? SERIES[i % SERIES.length];
            return (
              <linearGradient key={i} id={`area-${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity="0.24" />
                <stop offset="100%" stopColor={color} stopOpacity="0" />
              </linearGradient>
            );
          })}
        </defs>

        {Array.from({ length: ticks + 1 }, (_, i) => {
          const v = (dataMax / ticks) * i;
          const yy = y(v);
          return (
            <g key={i}>
              <line
                x1={pad.left}
                x2={W - pad.right}
                y1={yy}
                y2={yy}
                stroke="var(--line)"
                strokeWidth={i === 0 ? 1.5 : 1}
              />
              <text x={pad.left - 10} y={yy + 4} textAnchor="end" fill="var(--ink-3)" fontSize="12">
                {faDigits(Math.round(v))}
              </text>
            </g>
          );
        })}

        {series.map((s, si) => {
          const color = s.color ?? SERIES[si % SERIES.length];
          const pts = s.data.map((v, i) => `${x(i)},${y(v)}`).join(" ");
          const areaPath =
            `M ${x(0)},${y(s.data[0])} ` +
            s.data.map((v, i) => `L ${x(i)},${y(v)}`).join(" ") +
            ` L ${x(s.data.length - 1)},${pad.top + plotH} L ${x(0)},${pad.top + plotH} Z`;
          const last = s.data.length - 1;
          return (
            <g key={si}>
              {area && <path className="chart-area" style={delayVar(700)} d={areaPath} fill={`url(#area-${si})`} />}
              <polyline
                className="chart-line"
                pathLength={1}
                points={pts}
                fill="none"
                stroke={color}
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {s.data.map((v, i) => (
                <circle
                  key={i}
                  className="chart-dot"
                  style={delayVar(300 + i * 45)}
                  cx={x(i)}
                  cy={y(v)}
                  r={3.5}
                  fill={color}
                  stroke="var(--bg)"
                  strokeWidth={1.5}
                />
              ))}
              <text
                className="chart-label"
                style={delayVar(900)}
                x={x(last) + 8}
                y={y(s.data[last]) + 4}
                fill="var(--ink-2)"
                fontSize="12"
                fontWeight="700"
              >
                {faDigits(s.data[last])}
                {unit}
              </text>
            </g>
          );
        })}

        {categories.map((cat, i) => (
          <text
            key={i}
            x={x(i)}
            y={H - pad.bottom + 22}
            textAnchor="middle"
            fill="var(--ink-2)"
            fontSize="13"
          >
            {cat}
          </text>
        ))}
      </svg>
      <Legend series={series} />
    </ChartFrame>
  );
}

/* ------------------------------ DonutChart ------------------------------ */

export function DonutChart({
  data,
  centerValue,
  centerLabel,
  caption,
}: {
  data: { label: string; value: number; color?: string }[];
  centerValue?: string;
  centerLabel?: string;
  caption?: ReactNode;
}) {
  const size = 220;
  const stroke = 26;
  const r = (size - stroke) / 2;
  const C = 2 * Math.PI * r;
  const total = data.reduce((a, b) => a + b.value, 0) || 1;
  const offsets = data.map((_, i) =>
    data.slice(0, i).reduce((a, d) => a + (d.value / total) * C, 0),
  );

  return (
    <ChartFrame caption={caption}>
      <div className="flex flex-col items-center justify-center gap-8 sm:flex-row sm:gap-12">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img">
          <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--line)" strokeWidth={stroke} />
            {data.map((d, i) => {
              const frac = d.value / total;
              const len = frac * C;
              const gap = 2;
              const seg = Math.max(len - gap, 0);
              return (
                <circle
                  key={i}
                  cx={size / 2}
                  cy={size / 2}
                  r={r}
                  fill="none"
                  stroke={d.color ?? SERIES[i % SERIES.length]}
                  strokeWidth={stroke}
                  strokeDasharray={`${seg} ${C - seg}`}
                  strokeDashoffset={-offsets[i]}
                  strokeLinecap="butt"
                />
              );
            })}
          </g>
          {(centerValue || centerLabel) && (
            <>
              {centerValue && (
                <text x="50%" y="47%" textAnchor="middle" fill="var(--ink)" fontSize="30" fontWeight="700">
                  {centerValue}
                </text>
              )}
              {centerLabel && (
                <text x="50%" y="60%" textAnchor="middle" fill="var(--ink-3)" fontSize="12">
                  {centerLabel}
                </text>
              )}
            </>
          )}
        </svg>

        <ul className="flex flex-col gap-3">
          {data.map((d, i) => (
            <li key={i} className="flex items-center gap-3 text-sm">
              <span
                className="h-3 w-3 shrink-0 rounded-[3px]"
                style={{ background: d.color ?? SERIES[i % SERIES.length] }}
              />
              <span className="text-ink-2">{d.label}</span>
              <span className="tnum ms-auto font-600 text-ink">
                {faDigits(Math.round((d.value / total) * 100))}٪
              </span>
            </li>
          ))}
        </ul>
      </div>
    </ChartFrame>
  );
}
