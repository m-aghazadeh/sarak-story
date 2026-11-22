import type { ReactNode } from "react";
import { Reveal } from "./Slide";

export interface Milestone {
  date: string;
  title: ReactNode;
  body?: ReactNode;
  done?: boolean;
}

export function Timeline({ items }: { items: Milestone[] }) {
  return (
    <ol className="relative flex flex-col gap-8">
      {/* rail */}
      <span className="absolute bottom-2 top-2 w-px bg-line ltr:left-[7px] rtl:right-[7px]" />
      {items.map((m, i) => (
        <Reveal as="li" key={i} delay={i * 90} className="relative ps-8">
          <span
            className={`absolute top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full ltr:left-0 rtl:right-0 ${
              m.done ? "bg-accent" : "border-2 border-line-strong bg-bg"
            }`}
          />
          <div className="tnum text-xs font-500 uppercase tracking-wide text-ink-3">
            {m.date}
          </div>
          <div className="mt-1 font-600 text-ink">{m.title}</div>
          {m.body && <div className="mt-1 text-sm text-ink-2">{m.body}</div>}
        </Reveal>
      ))}
    </ol>
  );
}
