/**
 * normalise() — Normalises a raw receipt item name for canonical lookup.
 *
 * This is a placeholder for Phase 5. The full implementation will:
 * - Lowercase
 * - Strip qty/weight tokens (e.g. "500G", "x2", "0.450 kg")
 * - Strip retailer SKU codes and prefixes (e.g. "TESCO", "M&S")
 * - Strip non-alphanumerics
 * - Collapse whitespace
 * - Singularise (e.g. "bananas" → "banana")
 *
 * Example: "TESCO BEEF MINCE 500G *MULTI*" → "beef mince"
 */
export function normalise(rawName: string): string {
  // Phase 5 will implement the full normalisation pipeline.
  // For now, just lowercase and trim.
  return rawName.toLowerCase().trim();
}
