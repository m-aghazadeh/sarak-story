import Image from "next/image";

/** Sarak wordmark (public/brand/sarak/logo-red.svg, fill #72000E). */
const LOGO_SRC = "/brand/sarak/logo-red.svg";
const LOGO_RATIO = 404 / 90; // intrinsic viewBox of the SVG

/** `size` is the rendered height in px; width follows the SVG ratio. */
export function LogoMark({
  className = "",
  size = 24,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <Image
      src={LOGO_SRC}
      alt="سارک"
      width={Math.round(size * LOGO_RATIO)}
      height={size}
      className={className}
      priority
    />
  );
}

export function Brand({
  size = 22,
  className = "",
}: {
  size?: number;
  /** Kept for API compatibility with the kit; the wordmark carries its own color. */
  textClass?: string;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center ${className}`} dir="ltr">
      <LogoMark size={Math.round(size * 0.7)} />
    </span>
  );
}
