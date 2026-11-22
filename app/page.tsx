import type { Metadata } from "next";
import { Presentation } from "@/components/deck/Presentation";
import { sarak } from "@/content/decks/sarak";

/** The home page opens the Sarak deck directly. */
export const metadata: Metadata = {
  title: sarak.meta.title,
  description: sarak.meta.summary,
};

export default function Home() {
  return <Presentation deck={sarak} />;
}
