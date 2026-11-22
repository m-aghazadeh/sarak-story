"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Deck } from "@/lib/deck";
import { sound } from "@/lib/sound";
import { DeckChrome } from "./DeckChrome";

const RELEASE_MS = 820; // lock window matching the slide transition
const WHEEL_THRESHOLD = 40; // accumulated wheel intent before advancing
const TOUCH_THRESHOLD = 48; // px of boundary overscroll before advancing

export function Presentation({ deck }: { deck: Deck }) {
  const total = deck.slides.length;
  const [active, setActive] = useState(0);
  const [muted, setMuted] = useState(false);

  const scrollRefs = useRef<(HTMLDivElement | null)[]>([]);
  const viewportRef = useRef<HTMLDivElement | null>(null);

  const locked = useRef(false);
  const releaseTimer = useRef<number | undefined>(undefined);
  const wheelAccum = useRef(0);
  const wheelIdle = useRef<number | undefined>(undefined);
  const touchY = useRef(0);
  const touchHandled = useRef(false);
  const activeRef = useRef(0);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    // Sync the toggle to the persisted preference after mount. Reading it
    // during render would risk a hydration mismatch (localStorage is
    // client-only), so we deliberately set state once here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMuted(!sound.isEnabled());
  }, []);

  const boundary = useCallback((dir: number) => {
    const sc = scrollRefs.current[activeRef.current];
    if (!sc) return true;
    if (dir > 0) {
      return sc.scrollTop + sc.clientHeight >= sc.scrollHeight - 1;
    }
    return sc.scrollTop <= 0;
  }, []);

  const go = useCallback(
    (dir: number) => {
      if (locked.current) return;
      const from = activeRef.current;
      const next = Math.min(Math.max(from + dir, 0), total - 1);
      if (next === from) {
        sound.blocked();
        return;
      }
      locked.current = true;
      // Enter the neighbouring slide from its top.
      const target = scrollRefs.current[next];
      if (target) target.scrollTop = 0;
      activeRef.current = next;
      setActive(next);
      sound.nav(dir);
      window.clearTimeout(releaseTimer.current);
      releaseTimer.current = window.setTimeout(() => {
        locked.current = false;
      }, RELEASE_MS);
    },
    [total],
  );

  const jumpTo = useCallback(
    (index: number) => {
      const from = activeRef.current;
      if (index === from || locked.current) return;
      locked.current = true;
      const target = scrollRefs.current[index];
      if (target) target.scrollTop = 0;
      const dir = index > from ? 1 : -1;
      activeRef.current = index;
      setActive(index);
      sound.nav(dir);
      window.clearTimeout(releaseTimer.current);
      releaseTimer.current = window.setTimeout(() => {
        locked.current = false;
      }, RELEASE_MS);
    },
    [],
  );

  const toggleMute = useCallback(() => {
    sound.unlock();
    const nowEnabled = sound.toggle();
    setMuted(!nowEnabled);
  }, []);

  // Wheel: scroll content first, advance only at the boundary.
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      sound.unlock();
      const dir = e.deltaY > 0 ? 1 : -1;
      if (!boundary(dir)) {
        wheelAccum.current = 0;
        return; // let the slide's own scroll happen
      }
      e.preventDefault();
      if (locked.current) return;
      wheelAccum.current += Math.abs(e.deltaY);
      window.clearTimeout(wheelIdle.current);
      wheelIdle.current = window.setTimeout(() => {
        wheelAccum.current = 0;
      }, 160);
      if (wheelAccum.current >= WHEEL_THRESHOLD) {
        wheelAccum.current = 0;
        go(dir);
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [boundary, go]);

  // Keyboard.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Don't hijack keys (Space, arrows…) while the user is typing in a field
      // — e.g. the Ask/Feedback modal inputs.
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) {
        return;
      }
      const sc = scrollRefs.current[activeRef.current];
      const step = () => (sc ? sc.clientHeight * 0.85 : 0);
      switch (e.key) {
        case "ArrowDown":
        case "PageDown":
        case " ":
          e.preventDefault();
          if (sc && !boundary(1)) sc.scrollBy({ top: step(), behavior: "smooth" });
          else go(1);
          break;
        case "ArrowUp":
        case "PageUp":
          e.preventDefault();
          if (sc && !boundary(-1)) sc.scrollBy({ top: -step(), behavior: "smooth" });
          else go(-1);
          break;
        case "ArrowLeft": // RTL: content advances leftwards
          e.preventDefault();
          go(1);
          break;
        case "ArrowRight":
          e.preventDefault();
          go(-1);
          break;
        case "Home":
          e.preventDefault();
          jumpTo(0);
          break;
        case "End":
          e.preventDefault();
          jumpTo(total - 1);
          break;
        case "m":
        case "M":
          toggleMute();
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [boundary, go, jumpTo, toggleMute, total]);

  // Touch: advance only when overscrolling past a content boundary.
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    sound.unlock();
    touchY.current = e.touches[0].clientY;
    touchHandled.current = false;
  }, []);

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (locked.current || touchHandled.current) return;
      const dy = touchY.current - e.touches[0].clientY; // >0 => swipe up
      if (dy > TOUCH_THRESHOLD && boundary(1)) {
        touchHandled.current = true;
        go(1);
      } else if (dy < -TOUCH_THRESHOLD && boundary(-1)) {
        touchHandled.current = true;
        go(-1);
      }
    },
    [boundary, go],
  );

  return (
    <div
      ref={viewportRef}
      className="deck-viewport bg-bg"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
    >
      <div
        className="deck-track"
        style={{ ["--active" as string]: active }}
      >
        {deck.slides.map((slide, i) => (
          <section key={slide.id} className="deck-slide" aria-hidden={i !== active}>
            <div
              ref={(el) => {
                scrollRefs.current[i] = el;
              }}
              className="deck-slide-scroll slide-scroll"
              data-active={i === active}
            >
              {slide.node}
            </div>
          </section>
        ))}
      </div>

      <DeckChrome
        deck={deck}
        active={active}
        total={total}
        muted={muted}
        onPrev={() => go(-1)}
        onNext={() => go(1)}
        onJump={jumpTo}
        onToggleMute={toggleMute}
      />
    </div>
  );
}
