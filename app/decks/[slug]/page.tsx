import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Presentation } from "@/components/deck/Presentation";
import { allDeckSlugs, getDeck } from "@/content/decks";

export function generateStaticParams() {
  return allDeckSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata(
  props: PageProps<"/decks/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const deck = getDeck(slug);
  if (!deck) return {};
  return {
    title: `${deck.meta.title} — ${deck.meta.subtitle ?? "گزارش"}`,
    description: deck.meta.summary,
  };
}

export default async function DeckPage(props: PageProps<"/decks/[slug]">) {
  const { slug } = await props.params;
  const deck = getDeck(slug);
  if (!deck) notFound();
  return <Presentation deck={deck} />;
}
