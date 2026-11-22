import type { CSSProperties, ReactNode } from "react";
import type { SlideBackground } from "@/lib/deck";

/** Reveal wraps content in the on-enter animation with a staggered delay. */
export function Reveal({
  children,
  delay = 0,
  fade = false,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  fade?: boolean;
  className?: string;
  as?: React.ElementType;
}) {
  return (
    <Tag
      className={`anim ${fade ? "anim-fade" : ""} ${className}`}
      style={{ ["--d" as string]: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

/**
 * Full-viewport slide frame. Centers content in a padded, max-width column
 * and optionally renders a subtle backdrop. Compose the body from kit parts.
 */
export function Slide({
  children,
  kicker,
  title,
  lead,
  background = "plain",
  align = "start",
  wide = false,
  className = "",
}: {
  children?: ReactNode;
  kicker?: ReactNode;
  title?: ReactNode;
  lead?: ReactNode;
  background?: SlideBackground;
  align?: "start" | "center";
  wide?: boolean;
  className?: string;
}) {
  const alignCls =
    align === "center"
      ? "items-center text-center"
      : "items-start text-start";

  return (
    <div
      className={`relative flex min-h-full flex-col justify-center overflow-hidden ${
        background === "glow" ? "bg-glow" : ""
      }`}
      style={{ paddingBlock: "6rem", paddingInline: "var(--slide-pad)" }}
    >
      {background === "grid" && (
        <div className="bg-grid pointer-events-none absolute inset-0" />
      )}

      <div
        className={`relative mx-auto flex w-full flex-col ${alignCls} ${
          wide ? "max-w-[88rem]" : "max-w-[var(--content-max)]"
        } ${className}`}
      >
        {(kicker || title || lead) && (
          <header
            className={`flex flex-col ${
              align === "center" ? "items-center" : "items-start"
            } gap-4`}
          >
            {kicker && (
              <Reveal delay={0}>
                <Kicker>{kicker}</Kicker>
              </Reveal>
            )}
            {title && (
              <Reveal delay={80}>
                <Title>{title}</Title>
              </Reveal>
            )}
            {lead && (
              <Reveal delay={160}>
                <Lead>{lead}</Lead>
              </Reveal>
            )}
          </header>
        )}
        {children && (
          <div className={kicker || title || lead ? "mt-10 w-full" : "w-full"}>
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------ typography ------------------------------ */

export function Kicker({ children }: { children: ReactNode }) {
  return (
    <span className="tnum inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-ink-3">
      <span className="h-px w-6 bg-accent/60" />
      {children}
    </span>
  );
}

export function Title({
  children,
  style,
}: {
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <h2
      className="font-700 leading-[1.12] text-ink [text-wrap:balance]"
      style={{ fontSize: "var(--fs-h1)", ...style }}
    >
      {children}
    </h2>
  );
}

export function Display({ children }: { children: ReactNode }) {
  return (
    <h1
      className="font-700 leading-[1.08] text-ink [text-wrap:balance]"
      style={{ fontSize: "var(--fs-display)" }}
    >
      {children}
    </h1>
  );
}

export function Heading({ children }: { children: ReactNode }) {
  return (
    <h3
      className="font-600 leading-[1.2] text-ink"
      style={{ fontSize: "var(--fs-h2)" }}
    >
      {children}
    </h3>
  );
}

export function Lead({ children }: { children: ReactNode }) {
  return (
    <p
      className="max-w-[52ch] font-300 leading-[1.7] text-ink-2"
      style={{ fontSize: "var(--fs-lead)" }}
    >
      {children}
    </p>
  );
}

export function Body({ children }: { children: ReactNode }) {
  return <p className="max-w-[62ch] leading-[1.75] text-ink-2">{children}</p>;
}

/* -------------------------------- layout -------------------------------- */

export function Columns({
  children,
  count = 2,
  className = "",
}: {
  children: ReactNode;
  count?: 2 | 3;
  className?: string;
}) {
  return (
    <div
      className={`grid gap-6 ${
        count === 3
          ? "md:grid-cols-3"
          : "md:grid-cols-2"
      } ${className}`}
    >
      {children}
    </div>
  );
}
