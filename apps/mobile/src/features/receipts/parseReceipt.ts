/**
 * Receipt parser — extracts structured data from OCR text blocks.
 *
 * Heuristics tuned for UK supermarket receipts (Tesco, Aldi, Lidl,
 * Sainsbury's, Morrisons, M&S, Co-op, Waitrose, Asda).
 */

import type { OcrBlock } from '@/modules/ocr';

/** A parsed line item from the receipt */
export interface ParsedItem {
  rawName: string;
  qty: number;
  unit: 'each' | 'kg' | 'g' | 'l' | 'ml';
  pricePence: number;
  position: number;
}

/** The full parsed result */
export interface ParsedReceipt {
  retailerName: string | null;
  purchasedAt: Date | null;
  totalPence: number | null;
  items: ParsedItem[];
  rawText: string;
}

// ── Known retailers ──

const RETAILERS: { pattern: RegExp; name: string }[] = [
  { pattern: /tesco/i, name: 'Tesco' },
  { pattern: /sainsbury/i, name: "Sainsbury's" },
  { pattern: /\baldi\b/i, name: 'Aldi' },
  { pattern: /\blidl\b/i, name: 'Lidl' },
  { pattern: /morrisons?/i, name: 'Morrisons' },
  { pattern: /marks?\s*[&+]\s*spencer|m\s*&\s*s\b/i, name: 'M&S' },
  { pattern: /co[\s-]?op\b/i, name: 'Co-op' },
  { pattern: /waitrose/i, name: 'Waitrose' },
  { pattern: /\basda\b/i, name: 'Asda' },
  { pattern: /iceland/i, name: 'Iceland' },
  { pattern: /spar\b/i, name: 'Spar' },
];

// ── Lines to skip ──

const SKIP_PATTERNS = [
  /^(sub)?total/i,
  /^vat/i,
  /^change\b/i,
  /^cash\b/i,
  /^card\b/i,
  /^visa\b/i,
  /^mastercard/i,
  /^contactless/i,
  /^balance/i,
  /^tender/i,
  /^saving/i,
  /^clubcard/i,
  /^nectar/i,
  /^points?\b/i,
  /^receipt\s*no/i,
  /^store\s*#/i,
  /^\*+/,
  /^-+$/,
  /^=+$/,
  /^thank\s*you/i,
  /^tel[:\s]/i,
  /^www\./i,
  /^http/i,
  /^vat\s*reg/i,
  /^served\s*by/i,
  /^opening\s*hours/i,
];

// ── Price extraction ──

/** Matches £1.23 or 1.23 at the end of a line */
const PRICE_RE = /[£]?\s*(\d+[.,]\d{2})\s*$/;

/** Matches a qty prefix like "2 x " or "2x" */
const QTY_PREFIX_RE = /^(\d+)\s*[xX×]\s*/;

/** Matches weight like "0.450 kg @" */
const WEIGHT_RE = /(\d+[.,]\d+)\s*(kg|g)\s*@/i;

// ── Date extraction ──

/** DD/MM/YYYY or DD-MM-YYYY with optional time */
const DATE_RE = /(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})(?:\s+(\d{1,2}):(\d{2}))?/;

// ──────────────────────────────────────────────────────────────────────

export function parseReceipt(blocks: OcrBlock[]): ParsedReceipt {
  const rawText = blocks.map((b) => b.text).join('\n');
  const lines = blocks.map((b) => b.text.trim()).filter((l) => l.length > 0);

  const retailerName = detectRetailer(lines);
  const purchasedAt = detectDate(lines);
  const totalPence = detectTotal(lines);
  const items = extractItems(lines);

  return { retailerName, purchasedAt, totalPence, items, rawText };
}

function detectRetailer(lines: string[]): string | null {
  // Check the first 5 lines for a known retailer name
  const header = lines.slice(0, 5).join(' ');
  for (const r of RETAILERS) {
    if (r.pattern.test(header)) return r.name;
  }
  // Fallback: check full text
  const full = lines.join(' ');
  for (const r of RETAILERS) {
    if (r.pattern.test(full)) return r.name;
  }
  return null;
}

function detectDate(lines: string[]): Date | null {
  for (const line of lines) {
    const m = DATE_RE.exec(line);
    if (m) {
      const day = parseInt(m[1]!, 10);
      const month = parseInt(m[2]!, 10) - 1;
      let year = parseInt(m[3]!, 10);
      if (year < 100) year += 2000;
      const hours = m[4] ? parseInt(m[4], 10) : 0;
      const minutes = m[5] ? parseInt(m[5], 10) : 0;
      const date = new Date(year, month, day, hours, minutes);
      if (!isNaN(date.getTime()) && day <= 31 && month <= 11) {
        return date;
      }
    }
  }
  return null;
}

function detectTotal(lines: string[]): number | null {
  // Scan from bottom up for the first "TOTAL" with a price
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i]!;
    if (/total/i.test(line) && !/sub\s*total/i.test(line)) {
      const priceMatch = PRICE_RE.exec(line);
      if (priceMatch) {
        return priceToPence(priceMatch[1]!);
      }
    }
  }
  return null;
}

function extractItems(lines: string[]): ParsedItem[] {
  const items: ParsedItem[] = [];
  let position = 0;

  for (const line of lines) {
    // Skip non-item lines
    if (shouldSkip(line)) continue;

    // Must have a price
    const priceMatch = PRICE_RE.exec(line);
    if (!priceMatch) continue;

    const pricePence = priceToPence(priceMatch[1]!);

    // Strip the price from the line to get the description
    let description = line.slice(0, priceMatch.index).trim();

    // Detect quantity prefix (e.g. "2 x Coca Cola")
    let qty = 1;
    let unit: ParsedItem['unit'] = 'each';

    const qtyMatch = QTY_PREFIX_RE.exec(description);
    if (qtyMatch) {
      qty = parseInt(qtyMatch[1]!, 10);
      description = description.slice(qtyMatch[0].length).trim();
    }

    // Detect weight (e.g. "0.450 kg @ £3.00/kg")
    const weightMatch = WEIGHT_RE.exec(description);
    if (weightMatch) {
      qty = parseFloat(weightMatch[1]!.replace(',', '.'));
      unit = weightMatch[2]!.toLowerCase() as 'kg' | 'g';
      // Strip the weight/@ portion
      description = description.slice(0, weightMatch.index).trim();
    }

    // Clean up the description
    description = cleanDescription(description);

    if (description.length < 2) continue;

    items.push({
      rawName: description,
      qty,
      unit,
      pricePence,
      position: position++,
    });
  }

  return items;
}

function shouldSkip(line: string): boolean {
  return SKIP_PATTERNS.some((p) => p.test(line));
}

function priceToPence(priceStr: string): number {
  const cleaned = priceStr.replace(',', '.');
  return Math.round(parseFloat(cleaned) * 100);
}

function cleanDescription(desc: string): string {
  return desc
    .replace(/\*+/g, '') // strip asterisks (multi-buy markers)
    .replace(/\s+/g, ' ') // collapse whitespace
    .replace(/^[#\-\s]+/, '') // strip leading dashes/hashes
    .replace(/[#\-\s]+$/, '') // strip trailing dashes/hashes
    .trim();
}
