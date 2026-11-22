"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Deck } from "@/lib/deck";
import { Brand } from "@/components/kit";
import { faDigits } from "@/lib/format";

interface Props {
  deck: Deck;
  active: number;
  total: number;
  muted: boolean;
  onPrev: () => void;
  onNext: () => void;
  onJump: (i: number) => void;
  onToggleMute: () => void;
}

export function DeckChrome({
  deck,
  active,
  total,
  muted,
  onPrev,
  onNext,
  onJump,
  onToggleMute,
}: Props) {
  const [fs, setFs] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);

  useEffect(() => {
    const onChange = () => setFs(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen?.();
  };

  const progress = total > 1 ? (active / (total - 1)) * 100 : 100;

  return (
    <>
      {/* Top progress bar */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-40 h-[3px] bg-ink/10">
        <div
          className="h-full bg-linear-to-l from-accent to-accent-2 transition-[width] duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Top bar: brand + counter */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-30 flex items-center justify-between px-5 py-4 sm:px-8">
        <Link href="/" className="pointer-events-auto text-sm">
          <Brand size={20} />
        </Link>
        <div className="tnum pointer-events-none rounded-[var(--r-pill)] border border-line bg-bg-elev/70 px-3 py-1 text-xs text-ink-2 backdrop-blur">
          {String(active + 1).padStart(2, "0")}
          <span className="mx-1 text-ink-3">/</span>
          {String(total).padStart(2, "0")}
        </div>
      </div>

      {/* Right-side navigation dots */}
      <nav
        aria-label="اسلایدها"
        className="fixed top-1/2 z-30 hidden -translate-y-1/2 flex-col items-center gap-3 ltr:right-5 rtl:left-5 sm:flex"
        style={{ insetInlineEnd: "1.25rem" }}
      >
        {deck.slides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onJump(i)}
            aria-label={s.label}
            aria-current={i === active}
            className="group relative flex items-center"
          >
            <span
              className={`block rounded-full transition-all duration-300 ${
                i === active
                  ? "h-5 w-[6px] bg-accent"
                  : "h-[6px] w-[6px] bg-ink/20 group-hover:bg-ink/40"
              }`}
            />
            <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-[var(--r-sm)] border border-line bg-bg-elev px-2 py-1 text-xs text-ink-2 opacity-0 shadow-[var(--shadow-sm)] transition-opacity duration-200 group-hover:opacity-100">
              {s.label}
            </span>
          </button>
        ))}
      </nav>

      {/* Bottom controls */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between px-5 py-4 sm:px-8">
        <div className="flex items-center gap-2">
          <ControlButton
            label="اسلاید قبلی"
            onClick={onPrev}
            disabled={active === 0}
          >
            <ChevronUp />
          </ControlButton>
          <ControlButton
            label="اسلاید بعدی"
            onClick={onNext}
            disabled={active === total - 1}
          >
            <ChevronDown />
          </ControlButton>
          <span className="ms-2 hidden items-center gap-1.5 text-xs text-ink-3 md:flex">
            <Kbd>↑</Kbd>
            <Kbd>↓</Kbd>
            <span>برای پیمایش</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <ControlButton
            label={muted ? "روشن کردن صدا" : "قطع صدا"}
            onClick={onToggleMute}
            pressed={!muted}
          >
            {muted ? <SoundOff /> : <SoundOn />}
          </ControlButton>
          <ControlButton
            label={fs ? "خروج از تمام‌صفحه" : "تمام‌صفحه"}
            onClick={toggleFullscreen}
          >
            {fs ? <FsExit /> : <FsEnter />}
          </ControlButton>
        </div>
      </div>

      {/* Floating table-of-contents button */}
      <button
        type="button"
        onClick={() => setTocOpen(true)}
        aria-label="فهرست اسلایدها"
        title="فهرست اسلایدها"
        className="fixed top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-[var(--r-pill)] border border-line bg-bg-elev/85 text-ink-2 shadow-[var(--shadow)] backdrop-blur transition-all duration-200 hover:border-accent/40 hover:text-accent"
        style={{ insetInlineStart: "1.25rem" }}
      >
        <ListIcon />
      </button>

      {/* TOC drawer */}
      {tocOpen && (
        <div
          className="fixed inset-0 z-50"
          onClick={() => setTocOpen(false)}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <div className="absolute inset-0 bg-ink/30 backdrop-blur-sm" />
          <aside
            className="absolute inset-y-0 flex w-[300px] max-w-[85vw] flex-col border-e border-line bg-bg shadow-[var(--shadow)]"
            style={{ insetInlineStart: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <span className="font-700 text-ink">فهرست اسلایدها</span>
              <button
                type="button"
                onClick={() => setTocOpen(false)}
                aria-label="بستن"
                className="flex h-8 w-8 items-center justify-center rounded-[var(--r-md)] border border-line text-ink-2 transition-colors hover:text-ink"
              >
                ✕
              </button>
            </div>
            <ol className="slide-scroll flex-1 overflow-y-auto p-2">
              {deck.slides.map((s, i) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onJump(i);
                      setTocOpen(false);
                    }}
                    aria-current={i === active}
                    className={`flex w-full items-center gap-3 rounded-[var(--r-md)] px-3 py-2 text-start text-sm transition-colors ${
                      i === active
                        ? "bg-accent/10 font-600 text-accent"
                        : "text-ink-2 hover:bg-surface-2"
                    }`}
                  >
                    <span className="tnum w-6 shrink-0 text-xs text-ink-3">
                      {faDigits(i + 1)}
                    </span>
                    <span className="truncate">{s.label}</span>
                  </button>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */

function ControlButton({
  children,
  label,
  onClick,
  disabled,
  pressed,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  pressed?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-pressed={pressed}
      title={label}
      className={`flex h-9 w-9 items-center justify-center rounded-[var(--r-md)] border border-line bg-bg-elev/70 text-ink-2 backdrop-blur transition-all duration-200 hover:border-line-strong hover:text-ink disabled:cursor-not-allowed disabled:opacity-30 ${
        pressed ? "!border-accent/40 !text-accent" : ""
      }`}
    >
      {children}
    </button>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="tnum inline-flex h-5 min-w-5 items-center justify-center rounded-[6px] border border-line bg-surface px-1 text-[11px] text-ink-2">
      {children}
    </kbd>
  );
}

/* ------------------------------- icons ------------------------------ */

function ListIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round">
      <path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" />
    </svg>
  );
}

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function ChevronUp() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" {...stroke}>
      <path d="M6 15l6-6 6 6" />
    </svg>
  );
}
function ChevronDown() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" {...stroke}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}
function SoundOn() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" {...stroke}>
      <path d="M4 9v6h4l5 4V5L8 9H4z" />
      <path d="M16.5 8.5a5 5 0 010 7" />
    </svg>
  );
}
function SoundOff() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" {...stroke}>
      <path d="M4 9v6h4l5 4V5L8 9H4z" />
      <path d="M22 9l-5 5M17 9l5 5" />
    </svg>
  );
}
function FsEnter() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" {...stroke}>
      <path d="M4 9V5a1 1 0 011-1h4M20 9V5a1 1 0 00-1-1h-4M4 15v4a1 1 0 001 1h4M20 15v4a1 1 0 01-1 1h-4" />
    </svg>
  );
}
function FsExit() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" {...stroke}>
      <path d="M9 4v4a1 1 0 01-1 1H4M15 4v4a1 1 0 001 1h4M9 20v-4a1 1 0 00-1-1H4M15 20v-4a1 1 0 011-1h4" />
    </svg>
  );
}
