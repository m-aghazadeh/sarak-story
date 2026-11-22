import Image from "next/image";
import type { ReactNode } from "react";

/** Framed remote/local image with an aspect box and optional caption. */
export function ImageBlock({
  src,
  alt,
  caption,
  ratio = "16 / 9",
  priority = false,
  className = "",
}: {
  src: string;
  alt: string;
  caption?: ReactNode;
  ratio?: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <figure className={className}>
      <div
        className="relative w-full overflow-hidden rounded-[var(--r-lg)] border border-line bg-surface shadow-[var(--shadow)]"
        style={{ aspectRatio: ratio }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, 80vw"
          className="object-cover"
        />
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-ink-3">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/**
 * Direct-link video (mp4/webm) with poster and native controls. Not a
 * YouTube/embed — pass a direct file URL. Does not autoplay.
 */
export function VideoBlock({
  src,
  poster,
  caption,
  ratio = "16 / 9",
  className = "",
}: {
  src: string;
  poster?: string;
  caption?: ReactNode;
  ratio?: string;
  className?: string;
}) {
  return (
    <figure className={className}>
      <div
        className="relative w-full overflow-hidden rounded-[var(--r-lg)] border border-line bg-surface-2 shadow-[var(--shadow)]"
        style={{ aspectRatio: ratio }}
      >
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={src}
          poster={poster}
          controls
          preload="metadata"
          playsInline
        />
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-ink-3">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
