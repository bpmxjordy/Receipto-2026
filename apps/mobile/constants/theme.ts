/**
 * Receipto design system tokens.
 *
 * Colours extracted from the design deck screens:
 * - Primary greens from the backgrounds, cards, and buttons
 * - CO₂ indicator colours (green/amber/coral) from receipt cards
 * - Neutrals for text and backgrounds
 */

import { Platform } from 'react-native';

// ── Colour tokens ──

export const Colors = {
  // Receipto brand greens
  green: {
    50: '#EAF5EC',   // lightest bg, splash background
    100: '#D5EBDA',  // card backgrounds
    200: '#B8DCC0',  // input borders, dividers
    300: '#7FB582',  // primary brand green — buttons, tab bar icons
    400: '#6AA36E',  // darker accent, pressed buttons
    500: '#558A58',  // deep green for contrast text on light
    600: '#3D6B40',  // headers on light backgrounds
  },

  // CO₂ indicator colours (from receipt card right-edge strips)
  co2: {
    low: '#7FB582',     // green — good
    medium: '#E8C76B',  // amber — moderate
    high: '#E88B8B',    // coral — high impact
    veryHigh: '#D45D5D', // red — very high
  },

  // UI backgrounds
  bg: {
    primary: '#FFFFFF',
    secondary: '#F5FAF6',   // very faint green tint
    card: '#EAF5EC',        // green-tinted cards
    cardDark: '#1A2E1C',    // dark mode card
  },

  // Text colours
  text: {
    primary: '#1A1A1A',
    secondary: '#6B7280',
    muted: '#9CA3AF',
    inverse: '#FFFFFF',
    link: '#7FB582',
  },

  // Borders
  border: {
    light: '#E5E7EB',
    green: '#B8DCC0',
  },

  // Semantic
  error: '#DC2626',
  success: '#16A34A',
  warning: '#D97706',

  // Light/dark theme presets for react-navigation
  light: {
    text: '#1A1A1A',
    background: '#FFFFFF',
    tint: '#7FB582',
    icon: '#6B7280',
    tabIconDefault: '#9CA3AF',
    tabIconSelected: '#7FB582',
  },
  dark: {
    text: '#ECEDEE',
    background: '#0A0F0A',
    tint: '#7FB582',
    icon: '#9BA1A6',
    tabIconDefault: '#6B7280',
    tabIconSelected: '#7FB582',
  },
} as const;

// ── Font families ──

export const Fonts = Platform.select({
  ios: {
    sans: 'Inter',
    sansDefault: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'Inter',
    sansDefault: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    sansDefault: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  },
});

// ── Type scale ──

export const TypeScale = {
  /** 28pt — screen titles */
  heading: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700' as const,
  },
  /** 22pt — section headers */
  subheading: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '600' as const,
  },
  /** 17pt — body text */
  body: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '400' as const,
  },
  /** 15pt — secondary body text */
  bodySmall: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '400' as const,
  },
  /** 13pt — labels and tags */
  label: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500' as const,
  },
  /** 11pt — captions and metadata */
  caption: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '400' as const,
  },
} as const;

// ── Spacing scale ──

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

// ── Border radii ──

export const Radii = {
  sm: 6,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;
