/* eslint-disable @next/next/no-img-element */
import type { ReactNode } from "react";
import type { Deck } from "@/lib/deck";
import { faDigits } from "@/lib/format";
import {
  Slide,
  Reveal,
  Display,
  Card,
  Callout,
  Stats,
  Timeline,
  Screenshot,
  ScreenshotGallery,
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
 * The only text authored here is structural: slide titles, column headers and
 * status labels (اولویت / تخمین / جمع‌آوری نشده).
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
  return /^[−~]/.test(s) ? `\u2066${s}\u2069` : s;
}

const mono = { fontFamily: "var(--font-geist-mono), ui-monospace, monospace" };

function shot(file: string) {
  const s = screenshots.find((x) => x.src.endsWith(`/${file}`));
  if (!s) throw new Error(`screenshot not in sarak-data: ${file}`);
  return { src: s.src, alt: s.caption, caption: s.caption, lowRes: "lowRes" in s && s.lowRes === true };
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

/** "todo — …" strings from the data file → text without the marker. */
function parseTodo(v: string): { todo: boolean; text: string } {
  if (!v.startsWith("todo")) return { todo: false, text: v };
  return { todo: true, text: v.replace(/^todo\s*(—\s*)?/, "") };
}

/* ------------------------------------------------------------------ */
/* Small deck-level parts (composed from kit tokens)                   */
/* ------------------------------------------------------------------ */

const SEV_LABEL: Record<Severity, string> = {
  high: "اولویت بالا",
  medium: "اولویت متوسط",
  low: "اولویت پایین",
};

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

const SEV_ORDER: Record<Severity, number> = { high: 0, medium: 1, low: 2 };

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

/** Contiguous colour strip — adjacent chips make shade drift visible. */
function SwatchStrip({ items }: { items: Swatch[] }) {
  return (
    <div className="flex h-16 overflow-hidden rounded-[var(--r-md)] border border-line" dir="ltr">
      {items.map((s) => (
        <div
          key={s.hex + s.where}
          className="flex-1"
          title={`${s.hex} — ${s.where}`}
          style={swatchFill(s.hex)}
        />
      ))}
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

function SwatchList({ items }: { items: Swatch[] }) {
  return (
    <ul className="mt-3 grid gap-x-6 gap-y-2.5 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((s) => (
        <li key={s.hex + s.where} className="flex items-start gap-2.5 text-xs leading-[1.7]">
          <span
            className="mt-0.5 h-4 w-4 shrink-0 rounded-[4px] border border-line"
            style={swatchFill(s.hex)}
          />
          <span className="min-w-0">
            <span className="inline-block" dir="ltr" style={mono}>
              <span className="font-700 text-ink">{s.hex}</span>
              {s.hsl && <span className="text-ink-3"> · {s.hsl}</span>}
            </span>
            <span className="block text-ink-2" dir="auto">
              {s.where}
            </span>
            {s.note && <span className="block text-ink-3">{s.note}</span>}
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Low-resolution screenshots: shown small, never enlarged. */
function SmallShots({ files }: { files: string[] }) {
  return (
    <div className="flex flex-wrap gap-3">
      {files.map((f) => {
        const s = shot(f);
        return (
          <figure key={f} className="w-[132px]">
            <img
              src={s.src}
              alt={s.alt}
              loading="lazy"
              className="block h-auto w-full rounded-[var(--r-sm)] border border-line bg-white"
            />
            <figcaption className="mt-1.5 text-[11px] leading-[1.6] text-ink-3">{s.caption}</figcaption>
          </figure>
        );
      })}
    </div>
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
} satisfies Deck["meta"];

/* ------------------------------------------------------------------ */
/* 1. Cover                                                            */
/* ------------------------------------------------------------------ */

const cover = (
  <Slide align="center">
    <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 text-center">
      <Reveal delay={0}>
        <div className="flex flex-col items-center gap-4">
          <LogoMark size={52} className="h-auto w-[min(234px,60vw)]" />
          <span className="text-sm tracking-[0.2em] text-ink-3" dir="ltr">
            {brand.slogan}
          </span>
        </div>
      </Reveal>
      <Reveal delay={120}>
        <Display>{meta.title}</Display>
      </Reveal>
      <Reveal delay={240}>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-ink-2">
          <span className="font-700 text-ink">{brand.auditor}</span>
          <span className="hidden h-4 w-px bg-line-strong sm:block" />
          <span className="tnum">{brand.auditDate}</span>
        </div>
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
  <Slide kicker={brand.positioning} title="سارک در یک نگاه" wide>
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
/* 3. Colour harmony                                                   */
/* ------------------------------------------------------------------ */

const identity = duties.find((d) => d.id === "identity")!;
const ctaShot = shot("product-cta-snapppay.jpg");

const harmony = (
  <Slide kicker={brand.slogan} title="هارمونی رنگ" wide>
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="flex min-w-0 flex-col gap-8">
        <Reveal delay={0}>
          <SectionLabel>{identity.findings[0]}</SectionLabel>
          <SwatchStrip items={brandRedsInUse} />
          <SwatchList items={brandRedsInUse} />
        </Reveal>
        <Reveal delay={120}>
          <SectionLabel>{identity.findings[1]}</SectionLabel>
          <SwatchStrip items={offBrandColors} />
          <SwatchList items={offBrandColors} />
        </Reveal>
        <Findings
          startDelay={240}
          items={[...harmonyFindings].sort((a, b) => SEV_ORDER[a.severity] - SEV_ORDER[b.severity])}
        />
      </div>
      <Reveal delay={160} className="flex flex-col gap-5">
        <Screenshot src={ctaShot.src} alt={ctaShot.alt} caption={ctaShot.caption} ratio="750 / 820" />
        <SmallShots files={["faq-blue-icons.jpg", "add-to-cart-toast.jpg"]} />
      </Reveal>
    </div>
  </Slide>
);

/* ------------------------------------------------------------------ */
/* 4. Instagram                                                        */
/* ------------------------------------------------------------------ */

const igShot = shot("instagram-profile.png");
const igFollowers = kpis.find((k) => k.label === "فالوور اینستاگرام")!;
const igPosts = kpis.find((k) => k.label === "پست اینستاگرام")!;
const igEngagement = kpis.find((k) => k.label === "نرخ تعامل اینستاگرام")!;
const related = instagram.relatedAccounts[0];

const igSlide = (
  <Slide kicker={<span dir="ltr">@{instagram.handle}</span>} title="اینستاگرام" wide>
    <div className="flex flex-col gap-8">
      <Reveal delay={0}>
        <div className="flex flex-wrap gap-3">
          {[
            [faNum(igFollowers.value), "فالوور"],
            [faNum(igPosts.value), "پست"],
            [faNum(instagram.following), "فالووینگ"],
          ].map(([v, l]) => (
            <div key={l} className="flex items-baseline gap-2 rounded-[var(--r-md)] border border-line bg-surface/60 px-4 py-2.5">
              <span className="tnum text-2xl font-700 text-ink">{v}</span>
              <span className="text-sm text-ink-2">{l}</span>
            </div>
          ))}
          <div className="flex flex-wrap items-center gap-2 rounded-[var(--r-md)] border border-line bg-surface/60 px-4 py-2.5 text-sm">
            <span className="text-ink-2">{igEngagement.label}</span>
            <Todo />
          </div>
        </div>
      </Reveal>

      <div className="grid gap-6 lg:grid-cols-2">
        <Reveal delay={180} className="flex flex-col gap-4">
          <Screenshot src={igShot.src} alt={igShot.alt} caption={igShot.caption} ratio="1919 / 858" />
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
          <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-2 text-sm">
            <dt className="text-ink-3">بیو</dt>
            <dd className="text-ink-2">
              <span dir="ltr">{instagram.bio}</span> · {instagram.bioLanguage}
            </dd>
            <dt className="text-ink-3">لینک بیو</dt>
            <dd className="text-ink-2">{instagram.link.note}</dd>
            <dt className="text-ink-3">پست اخیر</dt>
            <dd className="text-ink-2">{instagram.latestPost}</dd>
            <dt className="text-ink-3" dir="ltr">
              @{related.handle}
            </dt>
            <dd className="flex flex-wrap items-center gap-2 text-ink-2">
              <span>
                {related.title} · {faNum(`${related.followers / 1000}K`)} فالوور ·{" "}
                {faNum(related.posts.toLocaleString("en-US"))} پست
              </span>
              <Estimate />
            </dd>
          </dl>
        </Reveal>
        <div className="flex flex-col gap-4">
          <Findings startDelay={260} items={instagram.findings} />
          <Reveal delay={420}>
            <Callout tone="accent">{siteToInstagram.note}</Callout>
          </Reveal>
        </div>
      </div>
    </div>
  </Slide>
);

/* ------------------------------------------------------------------ */
/* 5. Branches                                                         */
/* ------------------------------------------------------------------ */

const tehran = branches.filter((b) => b.onSite);
const otherCities = branches.filter((b) => !b.onSite);
const totalBranches = kpis.find((k) => k.label === "تعداد شعب")!;
const siteBranches = kpis.find((k) => k.label === "شعب نمایش‌داده‌شده در سایت")!;
const MAPS_NOT_FOUND = "در جست‌وجوی گوگل‌مپ پیدا نشد";

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

function Phone({ value }: { value: string | null | undefined }) {
  if (!value) return <span className="text-ink-3">—</span>;
  return (
    <span dir="ltr" className="whitespace-nowrap text-ink" style={mono}>
      {value}
    </span>
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

const branchSlide = (
  <Slide kicker="شعب" title={`${faNum(totalBranches.value)} در برابر ${faNum(siteBranches.value)}`} wide>
    <div className="flex flex-col gap-10">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex flex-col gap-6">
          <Reveal delay={0}>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="tnum text-4xl font-900 text-ink">{faNum(totalBranches.value)}</span>
              <span className="text-ink-2">{totalBranches.label}</span>
              <span className="text-sm text-ink-3">({totalBranches.source} · {totalBranches.note})</span>
            </div>
            <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="tnum text-4xl font-900 text-accent">{faNum(siteBranches.value)}</span>
              <span className="text-ink-2">{siteBranches.label}</span>
              <span className="text-sm text-ink-3">(<span dir="ltr">{siteBranches.source}</span> · {siteBranches.note})</span>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <SectionLabel>تهران — سایت + اینستاگرام</SectionLabel>
            <div className="flex flex-wrap gap-2">
              {tehran.map((b) => (
                <BranchChip key={b.id} text={b.name} onSite />
              ))}
            </div>
          </Reveal>
          <Reveal delay={180}>
            <SectionLabel>شهرستان — فقط اینستاگرام</SectionLabel>
            <div className="flex flex-wrap gap-2">
              {otherCities.map((b) => (
                <BranchChip key={b.id} text={`${b.city} · ${b.name}`} onSite={false} />
              ))}
            </div>
          </Reveal>
        </div>
        <Reveal delay={140}>
          <ScreenshotGallery
            cols={2}
            ratio="435 / 594"
            shots={["branches-tehran.png", "branches-other-cities.png"].map((f) => {
              const s = shot(f);
              return { src: s.src, alt: s.alt, caption: s.caption };
            })}
          />
        </Reveal>
      </div>

      <Findings
        startDelay={200}
        items={branchFindings.filter((f) => f.severity === "high")}
      />

      {/* Phone / Maps consistency table (Tehran branches exist on both channels) */}
      <Reveal delay={260}>
        <div className="overflow-hidden rounded-[var(--r-lg)] border border-line">
          <div className="hidden grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1.2fr)_auto_minmax(0,1.3fr)] gap-4 border-b border-line bg-surface-2 px-4 py-2.5 text-xs font-700 text-ink-2 lg:grid">
            <span>شعبه</span>
            <span>تلفن اینستاگرام</span>
            <span>تلفن سایت</span>
            <span>تطابق</span>
            <span>گوگل‌مپ</span>
          </div>
          <ul className="divide-y divide-line">
            {tehran.map((b) => (
              <li
                key={b.id}
                className={`grid grid-cols-1 gap-x-4 gap-y-1.5 px-4 py-3 text-sm lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1.2fr)_auto_minmax(0,1.3fr)] lg:items-center ${
                  b.phoneMatch === false ? "bg-[var(--accent-soft)]" : ""
                }`}
              >
                <span className="font-700 text-ink">{b.name}</span>
                <span className="flex gap-2">
                  <span className="text-xs text-ink-3 lg:hidden">اینستاگرام</span>
                  <Phone value={b.phoneInstagram} />
                </span>
                <span className="flex gap-2">
                  <span className="text-xs text-ink-3 lg:hidden">سایت</span>
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
                <span className="text-xs leading-[1.7] text-ink-2">
                  {b.maps ? (
                    <>
                      <Rating rating={b.maps.rating} reviews={b.maps.reviews} />
                      {b.maps.issue && <span className="block text-accent">{b.maps.issue}</span>}
                    </>
                  ) : (
                    <span className="text-ink-3">{b.issues?.find((i) => i === MAPS_NOT_FOUND)}</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <Findings startDelay={320} items={branchFindings.filter((f) => f.severity !== "high")} />
        <Reveal delay={360}>
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
/* 6. Purchase flow                                                    */
/* ------------------------------------------------------------------ */

const flowSlide = (
  <Slide kicker="موبایل ۳۷۵px" title="فلوی خرید" wide>
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
      <Timeline
        items={purchaseFlow.map((s, i) => ({
          date: `${faDigits(i + 1)} · ${s.ok ? "روان" : "مشکل‌دار"}`,
          title: s.ok ? s.step : <span className="text-accent">{s.step}</span>,
          body: s.finding,
          done: !s.ok,
        }))}
      />
      <div className="flex flex-col gap-8">
        <Reveal delay={200}>
          <SectionLabel>نقطه قوت</SectionLabel>
          <ul className="flex flex-col gap-2.5">
            {flowStrengths.map((s) => (
              <li key={s} className="flex items-start gap-2.5 text-sm leading-[1.75] text-ink-2">
                <span className="mt-[0.1rem] shrink-0 font-700 text-good" aria-hidden>
                  ✓
                </span>
                {s}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={320}>
          <SmallShots files={["home-hero.jpg", "mini-cart-overlap.jpg", "login-otp.jpg"]} />
        </Reveal>
      </div>
    </div>
  </Slide>
);

/* ------------------------------------------------------------------ */
/* 7. SEO & technical                                                  */
/* ------------------------------------------------------------------ */

const productTop = shot("product-top.jpg");

const seoSlide = (
  <Slide kicker="sarak-co.com" title="سئو و فنی" wide>
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_260px]">
      <ul className="flex flex-col divide-y divide-line rounded-[var(--r-lg)] border border-line bg-surface/60">
        {[...techSeo]
          .sort((a, b) => SEV_ORDER[a.severity] - SEV_ORDER[b.severity])
          .map((t, i) => (
            <Reveal
              as="li"
              key={t.topic}
              delay={i * 55}
              className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-1 px-4 py-3 sm:grid-cols-[11rem_minmax(0,1fr)_auto] sm:items-center"
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
      <Reveal delay={200}>
        <Screenshot src={productTop.src} alt={productTop.alt} caption={productTop.caption} ratio="750 / 1100" />
      </Reveal>
    </div>
  </Slide>
);

/* ------------------------------------------------------------------ */
/* 8. Traffic (estimate)                                               */
/* ------------------------------------------------------------------ */

const trafficItems: StatItem[] = [
  { value: faNum(traffic.visits.toLocaleString("en-US")), label: "بازدید ماهانه" },
  { value: faNum(`${traffic.momChange}%`), label: "تغییر بازدید نسبت به ماه قبل" },
  { value: faNum(`${traffic.bounceRate}%`), label: "بانس ریت" },
  { value: faNum(traffic.pagesPerVisit), label: "صفحه در هر بازدید" },
  { value: faNum(traffic.avgVisitDuration), label: "میانگین مدت بازدید (دقیقه:ثانیه)" },
  { value: faNum(`${traffic.organicSearchShareDesktop}%`), label: "سهم جست‌وجوی ارگانیک (دسکتاپ)" },
  { value: faNum(`${traffic.paidKeywordShare}%`), label: "سهم کلمات پولی" },
];

const trafficSlide = (
  <Slide kicker={`${traffic.source} · ${traffic.period}`} title="ترافیک" wide>
    <div className="flex flex-col gap-6">
      <Reveal delay={0}>
        <Estimate source={`${traffic.source}، ${traffic.period}`} />
      </Reveal>
      <Stats items={trafficItems} />
      <Reveal delay={700} className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2 text-sm text-ink-2">
          <span className="text-ink-3">سایت‌های مشابه</span>
          {traffic.similarSites.map((s) => (
            <span key={s} dir="ltr" className="rounded-[var(--r-pill)] border border-line px-2.5 py-0.5 text-xs" style={mono}>
              {s}
            </span>
          ))}
        </div>
        <Callout tone="warn">{traffic.caveat}</Callout>
      </Reveal>
    </div>
  </Slide>
);

/* ------------------------------------------------------------------ */
/* 9. Tools: stack, SMS, ads                                           */
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
  <Slide kicker="مارتک" title="ابزارها" wide>
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
      <div>
        <SectionLabel>اسکریپت‌های بارگذاری‌شده در sarak-co.com</SectionLabel>
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
/* 10. Findings by job duty                                            */
/* ------------------------------------------------------------------ */

function DutyLine({ text }: { text: string }) {
  const todoMark = ": todo (سؤال از تیم)";
  const isTodo = text.includes(todoMark);
  const body = isTodo ? text.replace(todoMark, "") : text;
  const isEstimate =
    text.includes("Similarweb") || text.includes(`@${related.handle}`);
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
          <Card className="flex h-full flex-col !p-5">
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
/* 11. Questions for the meeting                                       */
/* ------------------------------------------------------------------ */

// The last todo item is a note for the deck author (Narian achievements for an
// experience slide), not a question for Sarak, so it stays off this slide.
const questions = todo.filter((t) => !t.includes("ناریان"));

const todoSlide = (
  <Slide kicker="جلسه" title="داده‌هایی که در جلسه می‌پرسم">
    <ol className="flex flex-col gap-3">
      {questions.map((q, i) => (
        <Reveal as="li" key={q} delay={i * 80}>
          <div className="flex items-start gap-4 rounded-[var(--r-md)] border border-line bg-surface/60 px-5 py-4">
            <span className="tnum font-900 text-accent">{faDigits(i + 1)}</span>
            <span className="text-ink">{q}</span>
          </div>
        </Reveal>
      ))}
    </ol>
  </Slide>
);

/* ------------------------------------------------------------------ */

export const sarak: Deck = {
  meta,
  slides: [
    { id: "cover", label: "کاور", node: cover },
    { id: "glance", label: "سارک در یک نگاه", node: glance },
    { id: "harmony", label: "هارمونی رنگ", node: harmony },
    { id: "instagram", label: "اینستاگرام", node: igSlide },
    { id: "branches", label: "شعب", node: branchSlide },
    { id: "flow", label: "فلوی خرید", node: flowSlide },
    { id: "seo", label: "سئو و فنی", node: seoSlide },
    { id: "traffic", label: "ترافیک", node: trafficSlide },
    { id: "tools", label: "ابزارها", node: toolsSlide },
    { id: "duties", label: "یافته‌ها به تفکیک شرح وظایف", node: dutiesSlide },
    { id: "todo", label: "داده‌هایی که در جلسه می‌پرسم", node: todoSlide },
  ],
};
