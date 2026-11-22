import type { ReactNode } from "react";
import { Reveal } from "./Slide";

/* ----------------------------- Before / After ---------------------------- *
 * Two-panel qualitative comparison: the old site (muted, ✕) beside the new
 * site (accent, ✓). The core "management comparison" pattern of the deck.    */

function Panel({
  tone,
  title,
  items,
  delay,
}: {
  tone: "before" | "after";
  title: string;
  items: ReactNode[];
  delay: number;
}) {
  const after = tone === "after";
  return (
    <Reveal delay={delay}>
      <div
        className={`h-full rounded-[var(--r-lg)] border p-6 ${
          after
            ? "border-accent/30 bg-accent/[0.05]"
            : "border-line bg-surface/40"
        }`}
      >
        <div className="mb-4 flex items-center gap-2">
          <span
            className={`inline-flex h-6 items-center rounded-[var(--r-pill)] px-2.5 text-xs font-700 ${
              after ? "bg-accent text-[var(--accent-ink)]" : "bg-ink/8 text-ink-3"
            }`}
          >
            {after ? "سایت جدید" : "سایت قبلی"}
          </span>
          <span className="font-600 text-ink">{title}</span>
        </div>
        <ul className="flex flex-col gap-3">
          {items.map((it, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm leading-[1.7]">
              <span
                className={`mt-[0.15rem] shrink-0 ${after ? "text-good" : "text-ink-3"}`}
                aria-hidden
              >
                {after ? "✓" : "✕"}
              </span>
              <span className={after ? "text-ink-2" : "text-ink-3"}>{it}</span>
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}

export function Compare({
  before,
  after,
}: {
  before: { title: string; items: ReactNode[] };
  after: { title: string; items: ReactNode[] };
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Panel tone="before" title={before.title} items={before.items} delay={0} />
      <Panel tone="after" title={after.title} items={after.items} delay={120} />
    </div>
  );
}

/* ------------------------------ Metric shifts ---------------------------- *
 * A row per metric: label · old value (struck) ← new value (emphasized).
 * Used for the SDT automation wins (e.g. 1.5h → under 1 min).               */

export interface Shift {
  label: string;
  before: string;
  after: string;
}

export function MetricShifts({ items }: { items: Shift[] }) {
  return (
    <div className="flex flex-col gap-3">
      {items.map((s, i) => (
        <Reveal key={i} delay={i * 90}>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-[var(--r-md)] border border-line bg-surface/60 px-5 py-4">
            <span className="min-w-40 flex-1 font-500 text-ink">{s.label}</span>
            <span className="tnum text-sm text-ink-3 line-through decoration-ink-3/50">
              {s.before}
            </span>
            <span className="text-accent" aria-hidden>
              ←
            </span>
            <span className="tnum font-700 text-good">{s.after}</span>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
