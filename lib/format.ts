/** Convert Latin digits in a string/number to Persian digits. */
export function faDigits(input: string | number): string {
  return String(input).replace(/[0-9]/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
}

/** Integer with Persian digits and Persian thousands separators. */
export function faInt(n: number): string {
  return faDigits(Math.round(n).toLocaleString("en-US")).replace(/,/g, "٬");
}

/** Toman → million Toman (rounded), Persian digits + thousands separators. */
export function faSalesMT(toman: number): string {
  return faInt(Math.round(toman / 1e6));
}

/** Signed percentage change between two values; null when undefined. */
export function pctChange(cur: number | null, prev: number | null | undefined) {
  if (cur == null || prev == null || prev === 0) return null;
  return ((cur - prev) / Math.abs(prev)) * 100;
}
