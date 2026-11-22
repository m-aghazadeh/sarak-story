# Design System — Sarak Story (Presentation)

A minimal, professional, light design system for web‑native report decks
built in Next.js. Engine and kit come from narian-story; only the tokens
changed for Sarak. Every deck is one presentation; every slide is a
full‑viewport section with soft motion and optional subtle sound.

The system is intentionally small and token‑driven so that adding a new
report later means **writing content, not re‑designing**.

---

## 1. Principles

1. **Calm over clever.** Motion is soft and short; sound is a whisper.
2. **One idea per slide.** Long slides scroll internally; when scrolling
   ends, the next swipe advances.
3. **Token‑first.** Colors, type, spacing, radius, motion, and shadow are
   CSS variables. Components never hard‑code a hex value.
4. **One red.** The deck uses a single red — `#72000E`, the site's
   `--color-brand` and the logo fill — plus its own tint `#8E333E` and
   10 % wash. No second red exists anywhere, not even for status. Everything
   else is warm neutral. This is the deck's answer to «Stylish By Harmony».
   The only other reds on screen are the audited swatches, shown as evidence.
5. **Accessible by default.** Respects `prefers-reduced-motion`, keeps
   contrast ≥ 4.5:1 for body text, and never encodes meaning in color alone:
   severity, status and estimates always carry a text label.

---

## 2. Color

Defined in `app/globals.css` under `:root` and exposed to Tailwind v4 via `@theme`.

### Brand (sarak-co.com CSS tokens)

| Token                    | Value     | Source                          |
| ------------------------ | --------- | ------------------------------- |
| `--primary`              | `#72000e` | `--color-brand` / brand-500, logo |
| `--secondary`            | `#8e333e` | `--color-brand-400`             |
| `--primary-foreground`   | `#ffffff` |                                 |
| `--secondary-foreground` | `#ffffff` |                                 |

### Surfaces & ink (warm neutrals, from `--color-brandGray #DDDAD9`)

| Token           | Value                 | Contrast on white |
| --------------- | --------------------- | ----------------- |
| `--bg`          | `#ffffff`             |                   |
| `--surface`     | `#faf9f8`             |                   |
| `--surface-2`   | `#f2f0ef`             |                   |
| `--line`        | `rgba(28,26,26,.10)`  |                   |
| `--line-strong` | `rgba(28,26,26,.20)`  |                   |
| `--ink`         | `#1c1a1a`             | 17.3 : 1          |
| `--ink-2`       | `#55504f`             | 7.9 : 1           |
| `--ink-3`       | `#736d6c`             | 5.1 : 1           |

### Accent

| Token           | Value                    | Use                              |
| --------------- | ------------------------ | -------------------------------- |
| `--accent`      | `#72000e`                | The one red (12.2 : 1 on white)  |
| `--accent-2`    | `#8e333e`                | Tint for gradients               |
| `--accent-soft` | `rgba(114, 0, 14, 0.10)` | Washes, highlighted rows         |
| `--accent-ink`  | `#ffffff`                | Text on solid accent             |

### Data / chart series (validated)

Run through the dataviz validator (`validate_palette.js`, light mode,
surface `#ffffff`, adjacent and all-pairs). Slot 1 is the brand red; no
other slot is red. Assign in fixed order, never cycled.

| Slot | Hue   | Hex       |
| ---- | ----- | --------- |
| 1    | red   | `#72000e` |
| 2    | blue  | `#2f72b8` |
| 3    | ochre | `#a8740f` |
| 4    | teal  | `#078a6e` |

Result: chroma floor PASS, CVD separation PASS (worst adjacent ΔE 9.5
protan, all-pairs 9.5), normal-vision floor PASS (worst all-pairs ΔE 15.6),
contrast ≥ 3:1 PASS. Slot 1 sits below the validator's lightness band
(OKLCH L 0.35 vs 0.43): it is fixed by the brand, so slot‑1 marks
always get a direct label.

### Status

`--good #3d6b4f`, `--warn #8a6414`, `--bad #72000e`. `--bad` is the brand
red on purpose (no second red); it is never used without a text label.
Severity in the deck: «اولویت بالا» = solid red pill, «اولویت متوسط» =
red outline, «اولویت پایین» = neutral outline. «تخمین» and «جمع‌آوری نشده»
are dashed neutral pills.

---

## 3. Typography

- **Persian / UI:** Alibaba (self‑hosted static weights) via `next/font/local`,
  loaded from `public/fonts/alibaba/`.
- **Numerals / mono:** Geist Mono for figures, KPIs, and code.
- Base direction is **RTL** (`dir="rtl"`, `lang="fa"`).

### Scale (fluid, `clamp`)

| Token          | Size (clamp)                          | Role              |
| -------------- | ------------------------------------- | ----------------- |
| `--fs-display` | `clamp(2.5rem, 1.5rem + 4vw, 5rem)`   | Cover titles      |
| `--fs-h1`      | `clamp(2rem, 1.3rem + 2.6vw, 3.25rem)`| Slide titles      |
| `--fs-h2`      | `clamp(1.5rem, 1.1rem + 1.4vw, 2rem)` | Section headings  |
| `--fs-lead`    | `clamp(1.1rem, 1rem + .5vw, 1.4rem)`  | Lead paragraphs   |
| `--fs-body`    | `1rem`                                | Body              |
| `--fs-small`   | `.875rem`                             | Captions / meta   |

- Weights: Alibaba ships three static cuts — 400 (regular), 700 (bold),
  900 (black). The `font-300`/`font-500`/`font-600` utilities still exist for
  layout rhythm, but the browser resolves them to the nearest shipped cut
  (300/500 → 400, 600 → 700) rather than a true intermediate weight — treat
  400/700/900 as the only weights with real glyphs. Titles use 700 (or 900
  for cover/display), body uses 400.
- Line height: 1.65 body, 1.15 display. Headings use `text-wrap: balance`.
- Eyebrow / kicker: uppercase, `letter-spacing: .16em`, `--ink-3`, mono.

---

## 4. Spacing, radius, shadow

- **Spacing scale** (rem): `4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96`.
- Slides pad to a max content width of `--content-max: 72rem`, centered,
  with `--slide-pad: clamp(1.5rem, 5vw, 5rem)` gutters.
- **Radius:** `--r-sm 8px`, `--r-md 14px`, `--r-lg 22px`, `--r-pill 999px`.
- **Shadow:** soft, low‑contrast only — `--shadow: 0 20px 60px -20px rgba(0,0,0,.6)`.
  No hard drop shadows. Depth comes from surface steps and hairlines.

---

## 5. Motion

Soft, short, purposeful. All easing uses `--ease: cubic-bezier(.22,1,.36,1)`
(a gentle "out" curve). Durations: `--t-fast 180ms`, `--t 420ms`, `--t-slow 680ms`.

- **Slide transition:** vertical translate of the deck track, `--t-slow`.
- **On‑enter:** content fades + rises 12–16px, staggered ≤ 80ms per group.
  Enter animations run only for the active slide.
- **Hover:** 1–2px lift or a border/color shift within `--t-fast`.
- **Never:** parallax pile‑ups, spin, elastic bounce, or looping attention loops.
- `prefers-reduced-motion: reduce` → all transitions collapse to opacity
  only (or none), and the deck jumps instead of sliding.

---

## 6. Sound

Sound is **synthesized at runtime** (Web Audio), so there are no audio
assets to ship and the palette stays tasteful and quiet.

- A short, soft cue (~90–140ms, low gain) on slide change; a fainter tick on
  boundary/blocked navigation.
- **Off by default is not required, but always mutable.** A persistent mute
  toggle stores its state in `localStorage`; audio only ever starts after a
  user gesture (browser autoplay policy).
- Master gain kept low (≤ 0.12). Nothing melodic or repetitive.

---

## 7. Layout & navigation model

- **Deck = vertical stack of slides.** Each slide is `100dvh`.
- Each slide has an internal scroll area. Wheel/touch/keyboard first scroll
  the slide's content; **only at the content boundary** does the next
  gesture advance (swipe) to the neighbouring slide.
- A single gesture never skips more than one slide (animation lock + cooldown).
- **Chrome:** slide dots (jump), a thin top progress bar, prev/next arrows,
  a slide counter, and mute/fullscreen controls. Chrome is quiet and edge‑anchored.
- **Keyboard:** `↓ / ↑ / Space / PageUp / PageDown / Home / End`, plus
  `←/→` mirrored for RTL. `m` toggles mute.

---

## 8. Component kit

Located in `components/kit`. Every component consumes tokens only.

| Component      | Purpose                                             |
| -------------- | --------------------------------------------------- |
| `Slide`        | Full‑viewport frame: kicker, title, lead, alignment |
| Typography     | `Kicker`, `Title`, `Lead`, `Body`, `Eyebrow`        |
| `Stat`/`Stats` | KPI tiles (big number + label + delta)              |
| `Card`         | Bordered surface panel                              |
| `Callout`      | Accent‑bordered highlight / note                    |
| `Bullets`      | Icon bullet list, staggered enter                   |
| `Quote`        | Pull quote with attribution                         |
| `ImageBlock`   | `next/image` with caption + aspect frame            |
| `VideoBlock`   | Direct‑link `<video>` with poster + controls        |
| `BarChart`     | Categorical magnitude (validated palette)           |
| `DonutChart`   | Part‑to‑whole                                        |
| `LineChart`    | Change over time                                    |
| `Timeline`     | Ordered milestones                                  |
| `Columns`      | 2/3‑column responsive layout                        |
| `Badge`/`Tag`  | Small status / label pills                          |
| `Logo`         | Sarak wordmark (`public/brand/sarak/logo-red.svg`)  |

---

## 9. Authoring a deck

A deck is a static module in `content/decks/<slug>.tsx` that exports a
`meta` object and a `slides` array of React nodes composed from the kit.
Register it in `content/decks/index.ts`. The route
`app/decks/[slug]/page.tsx` renders any registered deck via the
presentation engine — no per‑deck wiring needed.

Keep each slide to one idea, prefer the kit over ad‑hoc markup, and lean on
the tokens so a new report inherits the whole system for free.
