import type { Deck } from "@/lib/deck";
import { sarak } from "./sarak";

/**
 * Registry of all report decks. Add a new deck module here and it becomes
 * available at /decks/<slug> automatically.
 */
export const decks: Deck[] = [sarak];

export function getDeck(slug: string): Deck | undefined {
  return decks.find((d) => d.meta.slug === slug);
}

export function allDeckSlugs(): string[] {
  return decks.map((d) => d.meta.slug);
}
