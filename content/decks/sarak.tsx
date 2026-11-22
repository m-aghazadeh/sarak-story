/* eslint-disable @next/next/no-img-element */
import type { ReactNode } from "react";
import type { Deck } from "@/lib/deck";
import { faDigits } from "@/lib/format";
import {
  Slide,
  Reveal,
  Display,
  Lead,
  Badge,
  Card,
  Stats,
  Screenshot,
  ScreenshotGallery,
  BarChart,
  DonutChart,
  LogoMark,
  type StatItem,
} from "@/components/kit";
import {
  brand,
  kpis,
  instagram,
  branches,
  mapsOrphans,
  branchFindings,
  brandRedsInUse,
  offBrandColors,
  harmonyFindings,
  purchaseFlow,
  flowStrengths,
  techSeo,
  siteToInstagram,
  traffic,
  stack,
  sms,
  ads,
  duties,
  todo,
  screenshots,
  type Severity,
  type Swatch,
} from "./sarak-data";

/*
 * Every number and sentence on these slides is read from ./sarak-data.ts.
 * The only text authored here is structural: slide titles, column headers,
 * chart axis/legend names and status labels (اولویت / تخمین / جمع‌آوری نشده).
 */

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

/**
 * Latin figures → Persian digits, separators and percent sign. Values that
 * start with a sign (−, ~) are isolated left-to-right so the sign stays in
 * front of the number inside RTL text.
 */
function faNum(input: string | number): string {
  const s = faDigits(String(input))
    .replace(/,/g, "٬")
    .replace(/([۰-۹])\.(?=[۰-۹])/g, "$1/")
    .replace(/%/g, "٪")
    .replace(/^-/, "−");
  return /^[−~]/.test(s) ? `⁦${s}⁩` : s;
}

/** Persian digits → number. */
function enNum(fa: string): number {
  return Number(fa.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d))));
}

const mono = { fontFamily: "var(--font-geist-mono), ui-monospace, monospace" };

function shot(file: string) {
  const s = screenshots.find((x) => x.src.endsWith(`/${file}`));
  if (!s) throw new Error(`screenshot not in sarak-data: ${file}`);
  return { src: s.src, alt: s.caption, caption: s.caption, lowRes: "lowRes" in s && s.lowRes === true };
}

/** "todo — …" strings from the data file → text without the marker. */
function parseTodo(v: string): { todo: boolean; text: string } {
  if (!v.startsWith("todo")) return { todo: false, text: v };
  return { todo: true, text: v.replace(/^todo\s*(—\s*)?/, "") };
}

/** Keeps @handles and hex codes left-to-right inside Persian sentences. */
function Bidi({ text }: { text: string }) {
  const parts = text.split(/(@[A-Za-z0-9_.]+[A-Za-z0-9_]|#[0-9A-Fa-f]{6})/);
  return (
    <>
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          <bdi key={i} dir="ltr">
            {p}
          </bdi>
        ) : (
          p
        ),
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Small deck-level parts (composed from kit tokens)                   */
/* ------------------------------------------------------------------ */

const SEV_LABEL: Record<Severity, string> = {
  high: "اولویت بالا",
  medium: "اولویت متوسط",
  low: "اولویت پایین",
};
const SEV_ORDER: Record<Severity, number> = { high: 0, medium: 1, low: 2 };
const bySeverity = <T extends { severity: Severity }>(items: T[]) =>
  [...items].sort((a, b) => SEV_ORDER[a.severity] - SEV_ORDER[b.severity]);

/** Severity is carried by text first; the one red only grows in weight. */
function Sev({ level }: { level: Severity }) {
  const cls =
    level === "high"
      ? "border-accent bg-accent text-[var(--accent-ink)]"
      : level === "medium"
        ? "border-accent/50 bg-bg-elev text-accent"
        : "border-line bg-bg-elev text-ink-3";
  return (
    <span
      className={`inline-flex h-6 shrink-0 items-center whitespace-nowrap rounded-[var(--r-pill)] border px-2.5 text-[11px] font-700 ${cls}`}
    >
      {SEV_LABEL[level]}
    </span>
  );
}

function Estimate({ source }: { source?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-[var(--r-pill)] border border-dashed border-ink-3/60 px-2.5 py-0.5 text-[11px] font-700 text-ink-2">
      تخمین
      {source && <span className="font-400 text-ink-3">· {source}</span>}
    </span>
  );
}

function Todo({ children = "جمع‌آوری نشده" }: { children?: ReactNode }) {
  return (
    <span className="inline-flex items-center whitespace-nowrap rounded-[var(--r-pill)] border border-dashed border-line-strong bg-surface-2 px-2.5 py-0.5 text-[11px] font-700 text-ink-3">
      {children}
    </span>
  );
}

function Findings({
  items,
  startDelay = 0,
}: {
  items: { severity: Severity; text: string }[];
  startDelay?: number;
}) {
  return (
    <ul className="flex flex-col divide-y divide-line rounded-[var(--r-lg)] border border-line bg-surface/60">
      {items.map((f, i) => (
        <Reveal as="li" key={i} delay={startDelay + i * 60} className="flex items-start gap-3 px-4 py-3">
          <Sev level={f.severity} />
          <span className="min-w-0 text-sm leading-[1.8] text-ink-2">
            <Bidi text={f.text} />
          </span>
        </Reveal>
      ))}
    </ul>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return <div className="mb-3 text-sm font-700 text-ink">{children}</div>;
}

/** Bordered panel with a small heading — the deck's chart frame. */
function Panel({ title, children, className = "" }: { title?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-[var(--r-lg)] border border-line bg-surface/50 p-5 ${className}`}>
      {title && <div className="mb-4 text-sm text-ink-3">{title}</div>}
      {children}
    </div>
  );
}

function swatchFill(hex: string) {
  // The data records the Toastify progress bar as "gradient" without values,
  // so it is drawn as a neutral hatch instead of invented colours.
  if (hex === "gradient")
    return {
      backgroundImage:
        "repeating-linear-gradient(135deg, var(--surface-2) 0 6px, var(--line-strong) 6px 7px)",
    };
  return { background: hex };
}

function HexLine({ s }: { s: Swatch }) {
  return (
    <span className="flex flex-col items-start" dir="ltr" style={mono}>
      <span className="font-700 text-ink">{s.hex}</span>
      {s.hsl && <span className="text-ink-3">{s.hsl}</span>}
    </span>
  );
}

/** Paint chips side by side — the shade drift is visible without reading. */
function SwatchChips({
  items,
  highlight,
  compact = false,
}: {
  items: Swatch[];
  highlight?: string;
  compact?: boolean;
}) {
  return (
    <div className={`grid grid-cols-2 gap-3 sm:grid-cols-4 ${compact ? "" : "lg:grid-cols-7"}`}>
      {items.map((s, i) => (
        <Reveal key={s.hex + s.where} delay={i * 70}>
          <figure
            className={`flex h-full flex-col overflow-hidden rounded-[var(--r-md)] border bg-bg-elev ${
              s.hex === highlight ? "border-accent" : "border-line"
            }`}
          >
            <div className={compact ? "h-16" : "h-28 lg:h-40"} style={swatchFill(s.hex)} />
            <figcaption className="flex flex-1 flex-col gap-1 p-3 text-xs leading-[1.7]">
              <HexLine s={s} />
              <span className="text-ink-2" dir="auto">
                {s.where}
              </span>
              {s.note && <span className="text-ink-3">{s.note}</span>}
            </figcaption>
          </figure>
        </Reveal>
      ))}
    </div>
  );
}

/** Low-resolution screenshots: shown at or below native size, never enlarged. */
function SmallShot({ file, className = "" }: { file: string; className?: string }) {
  const s = shot(file);
  return (
    <figure className={className}>
      <img
        src={s.src}
        alt={s.alt}
        loading="lazy"
        className="block h-auto w-full max-w-[239px] rounded-[var(--r-md)] border border-line bg-white shadow-[var(--shadow-sm)]"
      />
      <figcaption className="mt-2 text-xs leading-[1.6] text-ink-3">{s.caption}</figcaption>
    </figure>
  );
}

/**
 * Horizontal bars in HTML (long Persian labels stay readable in RTL).
 * Single series → no legend; value text is ink, the bar carries the red.
 */
function HBars({
  rows,
  max,
}: {
  rows: { label: ReactNode; value: number | null; display: ReactNode; muted?: boolean }[];
  max: number;
}) {
  return (
    <ul className="flex flex-col gap-3">
      {rows.map((r, i) => (
        <Reveal as="li" key={i} delay={i * 60} className="grid grid-cols-[minmax(0,9rem)_minmax(0,1fr)] items-center gap-3 sm:grid-cols-[minmax(0,13rem)_minmax(0,1fr)]">
          <span className="text-sm leading-[1.5] text-ink">{r.label}</span>
          {r.value == null ? (
            <span className="text-xs text-ink-3">{r.display}</span>
          ) : (
            <span className="flex items-center gap-3">
              <span className="h-3 min-w-0 flex-1 overflow-hidden rounded-[var(--r-pill)] bg-surface-2">
                <span
                  className={`block h-full rounded-[var(--r-pill)] ${r.muted ? "bg-ink-3" : "bg-accent"}`}
                  style={{ width: `${(r.value / max) * 100}%` }}
                />
              </span>
              <span className="shrink-0 text-xs text-ink-2">{r.display}</span>
            </span>
          )}
        </Reveal>
      ))}
    </ul>
  );
}

function Rating({ rating, reviews }: { rating: number; reviews: number }) {
  return (
    <span className="tnum whitespace-nowrap">
      <bdi className="font-700 text-ink">★ {faNum(rating.toFixed(1))}</bdi>
      <span className="text-ink-3">
        {" "}
        · <bdi>{faNum(reviews)}</bdi> نظر
      </span>
    </span>
  );
}

function Phone({ value }: { value: string | null | undefined }) {
  if (!value) return <span className="text-ink-3">—</span>;
  return (
    <span dir="ltr" className="whitespace-nowrap text-ink" style={mono}>
      {value}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Meta                                                                */
/* ------------------------------------------------------------------ */

const meta = {
  slug: "sarak",
  title: "سارک از نگاه داده",
  subtitle: brand.auditor,
  client: brand.name,
  date: brand.auditDate,
  summary: `${brand.auditor} · ${brand.auditDate}`,
  cover: shot("product-cta-snapppay.jpg").src,
} satisfies Deck["meta"];

/* ------------------------------------------------------------------ */
/* 1. Cover                                                            */
/* ------------------------------------------------------------------ */

const cover = (
  <Slide background="glow" align="center">
    <div className="mx-auto flex max-w-3xl flex-col items-center gap-7 text-center">
      <Reveal delay={0}>
        <LogoMark size={52} className="h-auto w-[min(220px,56vw)]" />
      </Reveal>
      <Reveal delay={60}>
        <Badge tone="accent">
          <span dir="ltr">{brand.slogan}</span>
        </Badge>
      </Reveal>
      <Reveal delay={90}>
        <Display>
          سارک از نگاه <span className="text-gradient">داده</span>
        </Display>
      </Reveal>
      <Reveal delay={200}>
        <Lead>{brand.positioning}</Lead>
      </Reveal>
      <Reveal delay={320} className="mt-2">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-ink-2">
          <span className="font-700 text-ink">{brand.auditor}</span>
          <span className="hidden h-4 w-px bg-line-strong sm:block" />
          <span className="tnum">{brand.auditDate}</span>
        </div>
      </Reveal>
      <Reveal delay={440} className="mt-6">
        <span className="flex flex-col items-center gap-2 text-xs text-ink-3">
          <span>برای شروع، اسکرول یا کلید ↓</span>
          <span className="h-8 w-5 rounded-[var(--r-pill)] border border-line-strong p-1">
            <span className="mx-auto block h-2 w-1 animate-pulse rounded-full bg-accent" />
          </span>
        </span>
      </Reveal>
    </div>
  </Slide>
);

/* ------------------------------------------------------------------ */
/* 2. At a glance                                                      */
/* ------------------------------------------------------------------ */

const kpiVerified = kpis.filter((k) => k.status === "verified");
const kpiEstimate = kpis.filter((k) => k.status === "estimate");
const kpiTodo = kpis.filter((k) => k.status === "todo");

const kpiItems: StatItem[] = [
  ...kpiVerified.map((k) => ({
    value: faNum(k.value),
    label: k.note ? `${k.label} (${k.note})` : k.label,
  })),
  ...kpiEstimate.map((k) => ({
    value: faNum(k.value),
    label: `${k.label} · منبع: ${k.source}`,
    delta: "تخمین",
    tone: "neutral" as const,
  })),
];

const glance = (
  <Slide
    kicker="تصویر کلی"
    title="سارک در یک نگاه"
    lead={`${brand.experience} · ${brand.segments.join("، ")}`}
    wide
  >
    <div className="flex flex-col gap-5">
      <Stats items={kpiItems} />
      <Reveal delay={900} className="flex flex-col gap-2 text-sm text-ink-3">
        {kpiEstimate
          .filter((k) => k.note)
          .map((k) => (
            <div key={k.label} className="flex flex-wrap items-center gap-2">
              <Estimate source={k.source} />
              <span>{k.note}</span>
            </div>
          ))}
        {kpiTodo.map((k) => (
          <div key={k.label} className="flex flex-wrap items-center gap-2">
            <Todo />
            <span className="font-700 text-ink-2">{k.label}</span>
            <span>{k.source}</span>
          </div>
        ))}
      </Reveal>
    </div>
  </Slide>
);

/* ------------------------------------------------------------------ */
/* 3. Colour harmony — one brand red, seven shades                     */
/* ------------------------------------------------------------------ */

const identity = duties.find((d) => d.id === "identity")!;
const hf = (i: number) => harmonyFindings[i];

const reds = (
  <Slide
    kicker={<span dir="ltr">{brand.slogan}</span>}
    title={identity.findings[0]}
    lead={<Bidi text={hf(0).text} />}
    wide
  >
    <div className="flex flex-col gap-8">
      <SwatchChips items={brandRedsInUse} highlight="#72000E" />
      <Findings startDelay={500} items={[hf(3), hf(4)]} />
    </div>
  </Slide>
);

/* ------------------------------------------------------------------ */
/* 4. Colour harmony — off-brand colours in the purchase flow          */
/* ------------------------------------------------------------------ */

const ctaShot = shot("product-cta-snapppay.jpg");

const offBrand = (
  <Slide
    kicker="هارمونی رنگ"
    title={identity.findings[1]}
    lead={<Bidi text={hf(1).text} />}
    wide
  >
    <div className="grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)]">
      <Reveal delay={0}>
        <Screenshot src={ctaShot.src} alt={ctaShot.alt} caption={ctaShot.caption} ratio="750 / 820" />
      </Reveal>
      <div className="flex min-w-0 flex-col gap-6">
        <Reveal delay={100}>
          <SwatchChips items={offBrandColors} compact />
        </Reveal>
        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_auto]">
          <Findings startDelay={300} items={[hf(2), hf(5)]} />
          <Reveal delay={400} className="flex gap-3">
            <SmallShot file="faq-blue-icons.jpg" className="w-[120px]" />
            <SmallShot file="add-to-cart-toast.jpg" className="w-[120px]" />
          </Reveal>
        </div>
      </div>
    </div>
  </Slide>
);

/* ------------------------------------------------------------------ */
/* 5. Instagram                                                        */
/* ------------------------------------------------------------------ */

const igShot = shot("instagram-profile.png");
const igFollowers = kpis.find((k) => k.label === "فالوور اینستاگرام")!;
const igPosts = kpis.find((k) => k.label === "پست اینستاگرام")!;
const igEngagement = kpis.find((k) => k.label === "نرخ تعامل اینستاگرام")!;
const related = instagram.relatedAccounts[0];

const igSlide = (
  <Slide kicker={<span dir="ltr">@{instagram.handle}</span>} title="اینستاگرام" lead={siteToInstagram.note} wide>
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
      <div className="flex min-w-0 flex-col gap-5">
        <Reveal delay={0}>
          <Screenshot src={igShot.src} alt={igShot.alt} caption={igShot.caption} ratio="1919 / 858" />
        </Reveal>
        <Reveal delay={120}>
          <div className="grid gap-3 sm:grid-cols-2">
            {instagram.highlights.map((h) => (
              <Card key={h.title} className="!p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-700 text-ink">{h.title}</span>
                  <span className="text-xs text-ink-3" dir="ltr" style={mono}>
                    {h.coverText}
                  </span>
                </div>
                <div className="mt-1 text-xs leading-[1.7] text-ink-2">{h.coverStyle}</div>
              </Card>
            ))}
          </div>
        </Reveal>
        <Reveal delay={180}>
          <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-2 text-sm">
            <dt className="text-ink-3">بیو</dt>
            <dd className="text-ink-2">
              <span dir="ltr">{instagram.bio}</span> · {instagram.bioLanguage}
            </dd>
            <dt className="text-ink-3">لینک بیو</dt>
            <dd className="text-ink-2">{instagram.link.note}</dd>
            <dt className="text-ink-3">پست اخیر</dt>
            <dd className="text-ink-2">{instagram.latestPost}</dd>
          </dl>
        </Reveal>
      </div>
      <div className="flex min-w-0 flex-col gap-5">
        <Reveal delay={100}>
          <Panel title="فالوور">
            <HBars
              max={instagram.followers}
              rows={[
                {
                  label: <span dir="ltr">@{instagram.handle}</span>,
                  value: instagram.followers,
                  display: <span className="tnum font-700 text-ink">{faNum(igFollowers.value)}</span>,
                },
                {
                  label: (
                    <span className="flex flex-col">
                      <span dir="ltr" className="text-start">
                        @{related.handle}
                      </span>
                      <span className="text-xs text-ink-3">{related.title}</span>
                    </span>
                  ),
                  value: related.followers,
                  muted: true,
                  display: (
                    <span className="flex items-center gap-2">
                      <span className="tnum font-700 text-ink">{faNum(`${related.followers / 1000}K`)}</span>
                      <Estimate />
                    </span>
                  ),
                },
              ]}
            />
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-line pt-3 text-sm text-ink-2">
              <span>
                <b className="tnum text-ink">{faNum(igPosts.value)}</b> پست
              </span>
              <span>
                <b className="tnum text-ink">{faNum(instagram.following)}</b> فالووینگ
              </span>
              <span className="flex items-center gap-2">
                {igEngagement.label} <Todo />
              </span>
            </div>
          </Panel>
        </Reveal>
        <Findings startDelay={260} items={instagram.findings} />
      </div>
    </div>
  </Slide>
);

/* ------------------------------------------------------------------ */
/* 6. Branches — 18 vs 9                                               */
/* ------------------------------------------------------------------ */

const tehran = branches.filter((b) => b.onSite);
const otherCities = branches.filter((b) => !b.onSite);
const totalBranches = kpis.find((k) => k.label === "تعداد شعب")!;
const siteBranches = kpis.find((k) => k.label === "شعب نمایش‌داده‌شده در سایت")!;
const MAPS_NOT_FOUND = "در جست‌وجوی گوگل‌مپ پیدا نشد";
const ON_SITE = "تهران — سایت + اینستاگرام";
const IG_ONLY = "شهرستان — فقط اینستاگرام";

function BranchChip({ text, onSite }: { text: string; onSite: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-[var(--r-pill)] border px-3 py-1 text-xs leading-[1.6] ${
        onSite
          ? "border-accent/40 bg-[var(--accent-soft)] text-ink"
          : "border-dashed border-line-strong bg-bg-elev text-ink-2"
      }`}
    >
      {text}
    </span>
  );
}

const branchOverview = (
  <Slide
    kicker="شعب"
    title={`${faNum(totalBranches.value)} در برابر ${faNum(siteBranches.value)}`}
    lead={branchFindings[0].text}
    wide
  >
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
      <Reveal delay={0}>
        <Panel>
          <DonutChart
            centerValue={faNum(totalBranches.value)}
            centerLabel={totalBranches.source}
            data={[
              { label: ON_SITE, value: tehran.length, color: "var(--accent)" },
              { label: IG_ONLY, value: otherCities.length, color: "var(--line-strong)" },
            ]}
          />
          <div className="mt-4 border-t border-line pt-3 text-xs leading-[1.7] text-ink-3">
            {siteBranches.label}: <b className="text-ink">{faNum(siteBranches.value)}</b> ·{" "}
            <span dir="ltr">{siteBranches.source}</span> · {siteBranches.note}
          </div>
        </Panel>
      </Reveal>
      <div className="flex min-w-0 flex-col gap-6">
        <Reveal delay={100}>
          <SectionLabel>{ON_SITE}</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {tehran.map((b) => (
              <BranchChip key={b.id} text={b.name} onSite />
            ))}
          </div>
        </Reveal>
        <Reveal delay={180}>
          <SectionLabel>{IG_ONLY}</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {otherCities.map((b) => (
              <BranchChip key={b.id} text={`${b.city} · ${b.name}`} onSite={false} />
            ))}
          </div>
        </Reveal>
        <Reveal delay={260}>
          <ScreenshotGallery
            cols={2}
            ratio="435 / 420"
            shots={["branches-tehran.png", "branches-other-cities.png"].map((f) => {
              const s = shot(f);
              return { src: s.src, alt: s.alt, caption: s.caption };
            })}
          />
        </Reveal>
      </div>
    </div>
  </Slide>
);

/* ------------------------------------------------------------------ */
/* 7. Branches — phones and Google Maps                                */
/* ------------------------------------------------------------------ */

const branchConsistency = (
  <Slide kicker="شعب" title="تلفن و گوگل‌مپ" lead={branchFindings[1].text} wide>
    <div className="flex flex-col gap-8">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        {/* Phone consistency (Tehran branches exist on both channels) */}
        <Reveal delay={0}>
          <div className="overflow-hidden rounded-[var(--r-lg)] border border-line">
            <div className="hidden grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1.2fr)_auto] gap-3 border-b border-line bg-surface-2 px-4 py-2.5 text-xs font-700 text-ink-2 sm:grid">
              <span>شعبه</span>
              <span>تلفن اینستاگرام</span>
              <span>تلفن سایت</span>
              <span>تطابق</span>
            </div>
            <ul className="divide-y divide-line">
              {tehran.map((b) => (
                <li
                  key={b.id}
                  className={`grid grid-cols-1 gap-x-3 gap-y-1 px-4 py-2.5 text-sm sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1.2fr)_auto] sm:items-center ${
                    b.phoneMatch === false ? "bg-[var(--accent-soft)]" : ""
                  }`}
                >
                  <span className="font-700 text-ink">{b.name}</span>
                  <span className="flex gap-2 text-xs">
                    <span className="text-ink-3 sm:hidden">اینستاگرام</span>
                    <Phone value={b.phoneInstagram} />
                  </span>
                  <span className="flex gap-2 text-xs">
                    <span className="text-ink-3 sm:hidden">سایت</span>
                    <Phone value={b.phoneSite} />
                  </span>
                  <span>
                    {b.phoneMatch === false ? (
                      <span className="inline-flex rounded-[var(--r-pill)] bg-accent px-2.5 py-0.5 text-[11px] font-700 text-[var(--accent-ink)]">
                        متفاوت
                      </span>
                    ) : (
                      <span className="inline-flex rounded-[var(--r-pill)] border border-line px-2.5 py-0.5 text-[11px] font-700 text-ink-3">
                        یکسان
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        {/* Google Maps rating per Tehran branch */}
        <Reveal delay={120}>
          <Panel title="امتیاز گوگل‌مپ شعب تهران (از ۵)">
            <HBars
              max={5}
              rows={tehran.map((b) => ({
                label: b.name,
                value: b.maps ? b.maps.rating : null,
                display: b.maps ? (
                  <Rating rating={b.maps.rating} reviews={b.maps.reviews} />
                ) : (
                  b.issues?.find((i) => i === MAPS_NOT_FOUND)
                ),
              }))}
            />
            <div className="mt-4 flex flex-col gap-1 border-t border-line pt-3 text-xs leading-[1.7] text-ink-2">
              {tehran
                .filter((b) => b.maps?.issue)
                .map((b) => (
                  <span key={b.id}>
                    <b className="text-ink">{b.name}:</b> {b.maps!.issue}
                  </span>
                ))}
            </div>
          </Panel>
        </Reveal>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <Findings startDelay={200} items={branchFindings.slice(2)} />
        <Reveal delay={260}>
          <SectionLabel>لیستینگ‌های گوگل‌مپ بدون شعبه‌ی متناظر</SectionLabel>
          <div className="flex flex-col gap-3">
            {mapsOrphans.map((o) => (
              <Card key={o.listing} className="!p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="font-700 text-ink">{o.listing}</span>
                  <span className="text-xs">
                    <Rating rating={o.rating} reviews={o.reviews} />
                  </span>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 text-xs text-ink-3">
                  {o.phone && <Phone value={o.phone} />}
                  <span>{o.note}</span>
                </div>
              </Card>
            ))}
          </div>
        </Reveal>
      </div>
    </div>
  </Slide>
);

/* ------------------------------------------------------------------ */
/* 8. Purchase flow — storyboard timeline                              */
/* ------------------------------------------------------------------ */

/** Each funnel step with the screenshot that documents it. */
const FLOW_SHOTS: Record<string, string> = {
  "صفحه اصلی": "home-hero.jpg",
  "صفحه محصول": "product-top.jpg",
  "افزودن به سبد": "add-to-cart-toast.jpg",
  "سبد کشویی": "mini-cart-overlap.jpg",
  "ورود با موبایل (OTP)": "login-otp.jpg",
};

const lastStep = purchaseFlow[purchaseFlow.length - 1];

const flowSlide = (
  <Slide kicker="موبایل ۳۷۵px" title="فلوی خرید" lead={`${lastStep.step}: ${lastStep.finding}`} wide>
    <div className="flex flex-col gap-8">
      <ol className="relative grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 lg:grid-cols-7">
        <span className="absolute inset-x-0 top-[7px] hidden h-px bg-line lg:block" />
        {purchaseFlow.map((s, i) => {
          const file = FLOW_SHOTS[s.step];
          const sh = file ? shot(file) : null;
          return (
            <Reveal as="li" key={s.step} delay={i * 80} className="relative flex flex-col gap-2">
              <span
                className={`relative z-10 h-3.5 w-3.5 rounded-full ${
                  s.ok ? "border-2 border-line-strong bg-bg" : "bg-accent"
                }`}
              />
              <span className="tnum text-xs text-ink-3">
                {faDigits(i + 1)} · {s.ok ? "روان" : <b className="text-accent">مشکل‌دار</b>}
              </span>
              <span className={`font-700 leading-[1.4] ${s.ok ? "text-ink" : "text-accent"}`}>{s.step}</span>
              <div
                className={`overflow-hidden rounded-[var(--r-md)] border bg-white ${
                  s.ok ? "border-line" : "border-accent/50"
                }`}
                style={{ aspectRatio: "239 / 516", maxWidth: 239 }}
              >
                {sh ? (
                  <img src={sh.src} alt={sh.alt} title={sh.caption} loading="lazy" className="h-full w-full object-contain" />
                ) : (
                  <div className="flex h-full items-center justify-center bg-surface-2 text-3xl font-900 text-ink-3/40">
                    {faDigits(i + 1)}
                  </div>
                )}
              </div>
              <span className="text-xs leading-[1.75] text-ink-2">{s.finding}</span>
            </Reveal>
          );
        })}
      </ol>
      <Reveal delay={700}>
        <Panel title="نقطه قوت">
          <ul className="grid gap-x-6 gap-y-2 md:grid-cols-2">
            {flowStrengths.map((s) => (
              <li key={s} className="flex items-start gap-2.5 text-sm leading-[1.75] text-ink-2">
                <span className="mt-[0.1rem] shrink-0 font-700 text-good" aria-hidden>
                  ✓
                </span>
                {s}
              </li>
            ))}
          </ul>
        </Panel>
      </Reveal>
    </div>
  </Slide>
);

/* ------------------------------------------------------------------ */
/* 9. SEO & technical                                                  */
/* ------------------------------------------------------------------ */

const altRow = techSeo.find((t) => t.topic === "alt تصاویر")!;
// "۲۵ از ۳۷ در صفحه اصلی، ۱۴ از ۲۸ در صفحه محصول بدون alt"
const altPairs = [...altRow.finding.matchAll(/([۰-۹]+) از ([۰-۹]+) در (صفحه [^،]+?)(?:،| بدون|$)/g)].map((m) => ({
  missing: enNum(m[1]),
  total: enNum(m[2]),
  page: m[3].trim(),
}));
const metaRow = techSeo.find((t) => t.severity === "high")!;

const seoSlide = (
  <Slide kicker="sarak-co.com" title="سئو و فنی" lead={`${metaRow.topic}: ${metaRow.finding}`} wide>
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
      <ul className="flex flex-col divide-y divide-line rounded-[var(--r-lg)] border border-line bg-surface/60">
        {bySeverity(techSeo).map((t, i) => (
          <Reveal
            as="li"
            key={t.topic}
            delay={i * 55}
            className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-1 px-4 py-3 sm:grid-cols-[10rem_minmax(0,1fr)_auto] sm:items-center"
          >
            <span className="font-700 text-ink">{t.topic}</span>
            <span className="col-span-2 row-start-2 text-sm leading-[1.75] text-ink-2 sm:col-span-1 sm:row-start-auto">
              {t.finding}
              {t.finding.includes(traffic.source) && (
                <span className="ms-2 inline-block align-middle">
                  <Estimate />
                </span>
              )}
            </span>
            <span className="col-start-2 row-start-1 sm:col-start-auto sm:row-start-auto">
              <Sev level={t.severity} />
            </span>
          </Reveal>
        ))}
      </ul>
      <Reveal delay={200} className="flex flex-col gap-5">
        <Panel title={`${altRow.topic} — تعداد تصاویر`}>
          <BarChart
            categories={altPairs.map((p) => p.page)}
            series={[
              { name: "کل تصاویر", data: altPairs.map((p) => p.total), color: "var(--ink-3)" },
              { name: "بدون alt", data: altPairs.map((p) => p.missing), color: "var(--series-1)" },
            ]}
          />
        </Panel>
      </Reveal>
    </div>
  </Slide>
);

/* ------------------------------------------------------------------ */
/* 10. Traffic (estimate)                                              */
/* ------------------------------------------------------------------ */

const trafficItems: StatItem[] = [
  { value: faNum(traffic.visits.toLocaleString("en-US")), label: "بازدید ماهانه" },
  { value: faNum(`${traffic.momChange}%`), label: "تغییر بازدید نسبت به ماه قبل" },
  { value: faNum(`${traffic.bounceRate}%`), label: "بانس ریت" },
  { value: faNum(traffic.pagesPerVisit), label: "صفحه در هر بازدید" },
  { value: faNum(traffic.avgVisitDuration), label: "میانگین مدت بازدید (دقیقه:ثانیه)" },
  { value: faNum(`${traffic.paidKeywordShare}%`), label: "سهم کلمات پولی" },
];
const brandKeywords = techSeo.find((t) => t.finding.includes(traffic.source))!;

const trafficSlide = (
  <Slide kicker={`${traffic.source} · ${traffic.period}`} title="ترافیک" lead={traffic.caveat} wide>
    <div className="flex flex-col gap-6">
      <Reveal delay={0}>
        <Estimate source={`${traffic.source}، ${traffic.period}`} />
      </Reveal>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
        <Reveal delay={80}>
          <Panel title="سهم جست‌وجوی ارگانیک (دسکتاپ)">
            <DonutChart
              centerValue={faNum(`${traffic.organicSearchShareDesktop}%`)}
              centerLabel="ارگانیک"
              data={[
                { label: "جست‌وجوی ارگانیک", value: traffic.organicSearchShareDesktop, color: "var(--accent)" },
                {
                  label: "سایر ورودی‌ها",
                  value: 100 - traffic.organicSearchShareDesktop,
                  color: "var(--line-strong)",
                },
              ]}
            />
            <div className="mt-4 border-t border-line pt-3 text-xs leading-[1.7] text-ink-2">{brandKeywords.finding}</div>
          </Panel>
        </Reveal>
        <div className="flex min-w-0 flex-col gap-5">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {trafficItems.map((s, i) => (
              <Reveal key={s.label} delay={120 + i * 70}>
                <Card className="h-full !p-5">
                  <div className="tnum font-700 leading-none text-ink" style={{ fontSize: "clamp(1.6rem, 1.2rem + 1vw, 2.25rem)" }}>
                    {s.value}
                  </div>
                  <div className="mt-2 text-sm text-ink-2">{s.label}</div>
                </Card>
              </Reveal>
            ))}
          </div>
          <Reveal delay={600} className="flex flex-wrap items-center gap-2 text-sm text-ink-2">
            <span className="text-ink-3">سایت‌های مشابه</span>
            {traffic.similarSites.map((s) => (
              <span key={s} dir="ltr" className="rounded-[var(--r-pill)] border border-line px-2.5 py-0.5 text-xs" style={mono}>
                {s}
              </span>
            ))}
          </Reveal>
        </div>
      </div>
    </div>
  </Slide>
);

/* ------------------------------------------------------------------ */
/* 11. Tools: stack, SMS, ads                                          */
/* ------------------------------------------------------------------ */

function KeyVal({ k, v, estimate }: { k: string; v: string; estimate?: string }) {
  const t = parseTodo(v);
  return (
    <div className="flex flex-col gap-1 border-b border-line py-2.5 last:border-0">
      <span className="text-xs text-ink-3">{k}</span>
      <span className="flex flex-wrap items-center gap-2 text-sm text-ink-2">
        {t.todo && <Todo />}
        {t.text && <span>{t.text}</span>}
        {estimate && <Estimate source={estimate} />}
      </span>
    </div>
  );
}

const toolsSlide = (
  <Slide kicker="مارتک" title="ابزارها" lead={flowStrengths[flowStrengths.length - 1]} wide>
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
      <div>
        <SectionLabel>
          اسکریپت‌های بارگذاری‌شده در <span dir="ltr">sarak-co.com</span>
        </SectionLabel>
        <div className="grid gap-3 sm:grid-cols-2">
          {stack.map((s, i) => (
            <Reveal key={s.tool} delay={i * 50}>
              <div className="flex h-full flex-col rounded-[var(--r-md)] border border-line bg-surface/60 px-4 py-3">
                <span dir="ltr" className="text-start font-700 text-ink">
                  {s.tool}
                </span>
                <span className="text-sm text-ink-2">{s.use}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-6">
        <Reveal delay={200}>
          <Card className="!py-3">
            <div className="text-lg font-700 text-ink">SMS</div>
            <div className="mt-2">
              <KeyVal k="سایت" v={sms.siteCapture} />
              <KeyVal k="ورود" v={sms.phoneCapture} />
              <KeyVal k="شعب" v={sms.storeCapture} />
              <KeyVal k="کمپین‌های مشاهده‌شده" v={sms.observedCampaigns} />
            </div>
          </Card>
        </Reveal>
        <Reveal delay={300}>
          <Card className="!py-3">
            <div className="text-lg font-700 text-ink">تبلیغات</div>
            <div className="mt-2">
              <KeyVal k="پیکسل‌ها" v={ads.pixels.join(" · ")} />
              <KeyVal k="کلمات پولی گوگل" v={ads.googlePaidKeywords} estimate="Similarweb" />
              <KeyVal k="جست‌وجوی برند" v={ads.brandSearch} />
            </div>
          </Card>
        </Reveal>
      </div>
    </div>
  </Slide>
);

/* ------------------------------------------------------------------ */
/* 12. Findings by job duty                                            */
/* ------------------------------------------------------------------ */

function DutyLine({ text }: { text: string }) {
  const todoMark = ": todo (سؤال از تیم)";
  const isTodo = text.includes(todoMark);
  const body = isTodo ? text.replace(todoMark, "") : text;
  const isEstimate = text.includes("Similarweb") || text.includes(`@${related.handle}`);
  return (
    <li className="flex items-start gap-2 text-sm leading-[1.75] text-ink-2">
      <span className="mt-[0.7rem] h-1 w-1 shrink-0 rounded-full bg-ink-3" />
      <span className="min-w-0">
        <Bidi text={body} />
        {isTodo && (
          <span className="ms-2 inline-block align-middle">
            <Todo>سؤال از تیم</Todo>
          </span>
        )}
        {isEstimate && (
          <span className="ms-2 inline-block align-middle">
            <Estimate />
          </span>
        )}
      </span>
    </li>
  );
}

const dutiesSlide = (
  <Slide kicker="شرح وظایف" title="یافته‌ها به تفکیک شرح وظایف" wide>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {duties.map((d, i) => (
        <Reveal key={d.id} delay={i * 70}>
          <Card className="flex h-full flex-col !p-5" hover>
            <div className="flex items-start gap-2.5">
              <span className="tnum font-900 text-accent">{faDigits(i + 1)}</span>
              <span className="font-700 leading-[1.5] text-ink">{d.title}</span>
            </div>
            <ul className="mt-3 flex flex-col gap-1.5">
              {d.findings.map((f) => (
                <DutyLine key={f} text={f} />
              ))}
            </ul>
          </Card>
        </Reveal>
      ))}
    </div>
  </Slide>
);

/* ------------------------------------------------------------------ */
/* 13. Questions for the meeting (closing)                             */
/* ------------------------------------------------------------------ */

// The last todo item is a note for the deck author (Narian achievements for an
// experience slide), not a question for Sarak, so it stays off this slide.
const questions = todo.filter((t) => !t.includes("ناریان"));

const todoSlide = (
  <Slide kicker="جلسه" title="داده‌هایی که در جلسه می‌پرسم" background="glow" align="center">
    <div className="mx-auto flex max-w-3xl flex-col items-center gap-10">
      <Reveal delay={200} className="w-full">
        <ol className="grid gap-3 text-start sm:grid-cols-2">
          {questions.map((q, i) => (
            <li
              key={q}
              className={`flex gap-3 rounded-[var(--r-md)] border border-line bg-surface/70 px-4 py-3 ${
                i === questions.length - 1 && questions.length % 2 === 1 ? "sm:col-span-2" : ""
              }`}
            >
              <span className="tnum font-700 text-accent">{faDigits(i + 1)}</span>
              <span className="text-ink">{q}</span>
            </li>
          ))}
        </ol>
      </Reveal>
      <Reveal delay={600} className="flex flex-col items-center gap-3">
        <LogoMark size={36} className="h-auto w-[160px]" />
        <span className="text-sm tracking-[0.2em] text-ink-3" dir="ltr">
          {brand.slogan}
        </span>
      </Reveal>
    </div>
  </Slide>
);

/* ------------------------------------------------------------------ */

export const sarak: Deck = {
  meta,
  slides: [
    { id: "cover", label: "کاور", node: cover },
    { id: "glance", label: "سارک در یک نگاه", node: glance },
    { id: "reds", label: "هارمونی رنگ · قرمز برند", node: reds },
    { id: "off-brand", label: "هارمونی رنگ · رنگ‌های خارج از برند", node: offBrand },
    { id: "instagram", label: "اینستاگرام", node: igSlide },
    { id: "branches", label: "شعب · ۱۸ در برابر ۹", node: branchOverview },
    { id: "branches-data", label: "شعب · تلفن و گوگل‌مپ", node: branchConsistency },
    { id: "flow", label: "فلوی خرید", node: flowSlide },
    { id: "seo", label: "سئو و فنی", node: seoSlide },
    { id: "traffic", label: "ترافیک", node: trafficSlide },
    { id: "tools", label: "ابزارها", node: toolsSlide },
    { id: "duties", label: "یافته‌ها به تفکیک شرح وظایف", node: dutiesSlide },
    { id: "todo", label: "داده‌هایی که در جلسه می‌پرسم", node: todoSlide },
  ],
};
