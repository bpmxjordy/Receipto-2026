/**
 * OCR module — wraps Apple Vision's VNRecognizeTextRequest.
 *
 * Usage:
 *   import { recognizeText } from '@/modules/ocr';
 *   const blocks = await recognizeText('file:///path/to/image.jpg');
 */

import { requireNativeModule } from 'expo-modules-core';

/** A single recognised text block from the OCR engine. */
export interface OcrBlock {
  /** The recognised text string */
  text: string;
  /** Confidence score 0..1 */
  confidence: number;
  /** Bounding box (normalised 0..1, origin bottom-left per Vision convention) */
  x: number;
  y: number;
  width: number;
  height: number;
}

const OcrNative = requireNativeModule('Ocr');

/**
 * Run OCR on an image file.
 * @param imageUri - file:// URI pointing to a JPEG or PNG image.
 * @returns Array of text blocks sorted top-to-bottom (y descending in Vision coords).
 */
export async function recognizeText(imageUri: string): Promise<OcrBlock[]> {
  const blocks: OcrBlock[] = await OcrNative.recognizeText(imageUri);

  // Vision's y-axis is bottom-up; sort top-to-bottom for receipt reading order
  return blocks.sort((a, b) => b.y - a.y);
}
