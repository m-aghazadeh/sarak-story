import type { ReactNode } from "react";
import { Reveal } from "./Slide";

/* --------------------------------- Card --------------------------------- */

export function Card({
  children,
  className = "",
  hover = false,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={`rounded-[var(--r-lg)] border border-line bg-surface/60 p-6 backdrop-blur-sm ${
        hover
          ? "transition-all duration-200 hover:border-line-strong hover:bg-surface"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

/* ------------------------------- Callout -------------------------------- */

const calloutTone = {
  accent: "border-accent/30 bg-accent/[0.06]",
  good: "border-good/30 bg-good/[0.06]",
  warn: "border-warn/30 bg-warn/[0.06]",
  bad: "border-bad/30 bg-bad/[0.06]",
} as const;

export function Callout({
  children,
  title,
  tone = "accent",
}: {
  children: ReactNode;
  title?: ReactNode;
  tone?: keyof typeof calloutTone;
}) {
  return (
    <div
      className={`rounded-[var(--r-md)] border-s-2 ${calloutTone[tone]} px-5 py-4`}
    >
      {title && <div className="mb-1 font-600 text-ink">{title}</div>}
      <div className="text-ink-2">{children}</div>
    </div>
  );
}

/* -------------------------------- Badge --------------------------------- */

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "accent" | "good" | "warn" | "bad";
}) {
  const tones = {
    neutral: "border-line text-ink-2",
    accent: "border-accent/40 text-accent",
    good: "border-good/40 text-good",
    warn: "border-warn/40 text-warn",
    bad: "border-bad/40 text-bad",
  } as const;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-[var(--r-pill)] border ${tones[tone]} bg-bg-elev/60 px-3 py-1 text-xs font-500`}
    >
      {children}
    </span>
  );
}

/* ------------------------------- Bullets -------------------------------- */

export function Bullets({
  items,
  startDelay = 0,
}: {
  items: ReactNode[];
  startDelay?: number;
}) {
  return (
    <ul className="flex flex-col gap-4">
      {items.map((item, i) => (
        <Reveal as="li" key={i} delay={startDelay + i * 70}>
          <div className="flex items-start gap-3">
            <span className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            <span className="leading-[1.7] text-ink-2">{item}</span>
          </div>
        </Reveal>
      ))}
    </ul>
  );
}

/* -------------------------------- Quote --------------------------------- */

export function Quote({
  children,
  author,
  role,
}: {
  children: ReactNode;
  author?: string;
  role?: string;
}) {
  return (
    <figure className="mx-auto max-w-[46ch] text-center">
      <span className="mb-4 block text-5xl leading-none text-accent/40">”</span>
      <blockquote
        className="font-300 leading-[1.5] text-ink [text-wrap:balance]"
        style={{ fontSize: "var(--fs-h2)" }}
      >
        {children}
      </blockquote>
      {(author || role) && (
        <figcaption className="mt-6 text-sm text-ink-2">
          {author && <span className="font-600 text-ink">{author}</span>}
          {role && <span className="text-ink-3"> — {role}</span>}
        </figcaption>
      )}
    </figure>
  );
}

/* -------------------------------- Stats --------------------------------- */

export interface StatItem {
  value: string;
  label: string;
  delta?: string;
  tone?: "good" | "bad" | "neutral";
}

export function Stats({ items }: { items: StatItem[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((s, i) => (
        <Reveal key={i} delay={i * 90}>
          <Card className="h-full">
            <div className="flex items-baseline gap-2">
              <span
                className="tnum font-700 leading-none text-ink"
                style={{ fontSize: "clamp(2rem, 1.4rem + 1.6vw, 2.75rem)" }}
              >
                {s.value}
              </span>
              {s.delta && (
                <span
                  className={`tnum text-sm font-600 ${
                    s.tone === "bad"
                      ? "text-bad"
                      : s.tone === "neutral"
                        ? "text-ink-3"
                        : "text-good"
                  }`}
                >
                  {s.delta}
                </span>
              )}
            </div>
            <div className="mt-2 text-sm text-ink-2">{s.label}</div>
          </Card>
        </Reveal>
      ))}
    </div>
  );
}
