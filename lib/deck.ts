import type { ReactNode } from "react";

/** Visual backdrop applied behind a slide's content. */
export type SlideBackground = "plain" | "grid" | "glow";

/** A single authored slide. `node` is composed from the design kit. */
export interface SlideEntry {
  /** Stable id (used for keys and deep links). */
  id: string;
  /** Short label shown in the navigation dots tooltip. */
  label: string;
  /** The rendered slide, typically a <Slide> from the kit. */
  node: ReactNode;
}

/** Deck-level metadata shown on the home index and cover. */
export interface DeckMeta {
  slug: string;
  title: string;
  subtitle?: string;
  client?: string;
  /** e.g. "تیر ۱۴۰۴" */
  date?: string;
  /** Cover image URL for the home card. */
  cover?: string;
  /** One-line description for the home card. */
  summary?: string;
}

/** A full presentation: metadata plus an ordered list of slides. */
export interface Deck {
  meta: DeckMeta;
  slides: SlideEntry[];
}
