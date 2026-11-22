"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

export interface Shot {
  src: string;
  alt: string;
  caption?: string;
}

/* eslint-disable @next/next/no-img-element */

/* -------------------------------- Modal --------------------------------- */

function ScreenshotModal({
  shots,
  index,
  setIndex,
  onClose,
}: {
  shots: Shot[];
  index: number;
  setIndex: (i: number) => void;
  onClose: () => void;
}) {
  const many = shots.length > 1;
  const shot = shots[index];

  const prev = useCallback(
    () => setIndex((index - 1 + shots.length) % shots.length),
    [index, shots.length, setIndex],
  );
  const next = useCallback(
    () => setIndex((index + 1) % shots.length),
    [index, shots.length, setIndex],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return onClose();
      if (many && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
        e.stopPropagation();
        // RTL: left = next, right = prev
        if (e.key === "ArrowLeft") next();
        else prev();
        return;
      }
      const nav = ["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " ", "m", "M"];
      if (nav.includes(e.key)) e.stopPropagation();
    };
    window.addEventListener("keydown", onKey, true);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey, true);
      document.body.style.overflow = "";
    };
  }, [onClose, prev, next, many]);

  if (typeof document === "undefined") return null;

  const stop = (e: React.SyntheticEvent) => e.stopPropagation();

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex flex-col bg-ink/50 p-3 backdrop-blur-sm sm:p-6"
      onClick={onClose}
    >
      <div
        className="mx-auto flex h-full w-full max-w-[1100px] flex-col overflow-hidden rounded-[var(--r-lg)] border border-line bg-bg shadow-[var(--shadow)]"
        onClick={stop}
      >
        <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
          <div className="min-w-0 truncate font-600 text-ink">
            {shot.caption ?? shot.alt}
          </div>
          <div className="flex items-center gap-2">
            {many && (
              <>
                <span className="tnum text-xs text-ink-3">
                  {index + 1} / {shots.length}
                </span>
                <button
                  type="button"
                  onClick={prev}
                  aria-label="قبلی"
                  className="flex h-8 w-8 items-center justify-center rounded-[var(--r-md)] border border-line text-ink-2 hover:text-ink"
                >
                  ›
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label="بعدی"
                  className="flex h-8 w-8 items-center justify-center rounded-[var(--r-md)] border border-line text-ink-2 hover:text-ink"
                >
                  ‹
                </button>
              </>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="بستن"
              className="flex h-8 w-8 items-center justify-center rounded-[var(--r-md)] border border-line text-ink-2 hover:text-ink"
            >
              ✕
            </button>
          </div>
        </div>
        {/* scrollable full image */}
        <div className="slide-scroll flex-1 overflow-auto bg-surface-2">
          <img src={shot.src} alt={shot.alt} className="block h-auto w-full" />
        </div>
      </div>
    </div>,
    document.body,
  );
}

/* ------------------------------ Thumbnail ------------------------------- */

function Thumb({
  shot,
  ratio,
  onOpen,
}: {
  shot: Shot;
  ratio: string;
  onOpen: () => void;
}) {
  return (
    <figure className="group overflow-hidden rounded-[var(--r-lg)] border border-line bg-surface shadow-[var(--shadow-sm)]">
      <button
        type="button"
        onClick={onOpen}
        aria-label={`بزرگ‌نمایی ${shot.caption ?? shot.alt}`}
        className="relative block w-full overflow-hidden bg-white"
        style={{ aspectRatio: ratio }}
      >
        <img
          src={shot.src}
          alt={shot.alt}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
        />
        <span className="absolute inset-0 flex items-center justify-center bg-ink/0 transition-colors group-hover:bg-ink/15">
          <span className="rounded-[var(--r-pill)] bg-accent px-4 py-2 text-sm font-600 text-[var(--accent-ink)] opacity-0 shadow-[var(--shadow)] transition-opacity group-hover:opacity-100">
            بزرگ‌نمایی
          </span>
        </span>
      </button>
      {shot.caption && (
        <figcaption className="px-4 py-2.5 text-sm text-ink-2">
          {shot.caption}
        </figcaption>
      )}
    </figure>
  );
}

/* --------------------------- Public components -------------------------- */

/** A single screenshot thumbnail that opens a scrollable modal. */
export function Screenshot({
  src,
  alt,
  caption,
  ratio = "16 / 9",
}: Shot & { ratio?: string }) {
  const [open, setOpen] = useState(false);
  const shot: Shot = { src, alt, caption };
  return (
    <>
      <Thumb shot={shot} ratio={ratio} onOpen={() => setOpen(true)} />
      {open && (
        <ScreenshotModal
          shots={[shot]}
          index={0}
          setIndex={() => {}}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

/** A responsive grid of screenshots sharing one modal (with prev/next). */
export function ScreenshotGallery({
  shots,
  cols = 2,
  ratio = "16 / 10",
}: {
  shots: Shot[];
  cols?: 1 | 2 | 3;
  ratio?: string;
}) {
  const [index, setIndex] = useState<number | null>(null);
  const gridCls =
    cols === 3 ? "sm:grid-cols-2 lg:grid-cols-3" : cols === 1 ? "" : "sm:grid-cols-2";
  return (
    <>
      <div className={`grid gap-5 ${gridCls}`}>
        {shots.map((s, i) => (
          <Thumb key={s.src} shot={s} ratio={ratio} onOpen={() => setIndex(i)} />
        ))}
      </div>
      {index !== null && (
        <ScreenshotModal
          shots={shots}
          index={index}
          setIndex={setIndex}
          onClose={() => setIndex(null)}
        />
      )}
    </>
  );
}
