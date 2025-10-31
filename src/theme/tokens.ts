// src/theme/tokens.ts
import { Platform } from 'react-native';

/** โหมดสีหลักของแอป */
export type ThemeMode = 'light' | 'dark';

type Shadow = {
  shadowColor: string;
  shadowOpacity: number;
  shadowRadius: number;
  shadowOffset: { width: number; height: number };
  elevation: number;
};

type Palette = {
  /* Base / Surfaces */
  bg: string;
  card: string;
  line: string;
  border: string;
  text: string;
  sub: string;

  /* Brand / Semantic */
  primary: string;
  primaryDark: string;
  info: string;
  success: string;
  warn: string;
  danger: string;

  /* Accents */
  accent: string;
  accentDark: string;
  muted: string;

  /* Chips / Badges */
  chipBlue: string;
  chipTeal: string;
  chipGold: string;
  dangerText: string;

  /* Gradients / History */
  bgTopA: string;
  bgTopB: string;
  brand: string;
  dark: string;
  dim: string;

  /* Extra */
  brandSoft: string;
  orange: string;
  teal: string;
};

type Typography = { h1: number; h2: number; body: number; meta: number };
type Radius = { md: number; lg: number; xl: number; pill: number };
type Space  = { xs: number; sm: number; md: number; lg: number; xl: number; xxl: number };

export const FONT = {
  heading: 'Kanit-SemiBold',
  headingBold: 'Kanit-Bold',
  body: 'Prompt-Regular',
  bodyMedium: 'Prompt-Medium',
  bodyBold: 'Prompt-SemiBold',
};

export type Theme = {
  mode: ThemeMode;
  color: Palette;
  radius: Radius;
  space: Space;
  font: Typography;
  shadowCard: Shadow;
  utility: { card(): Shadow };
};

/* ----------------------------- BASE TOKENS ------------------------------ */

const radius: Radius = { md: 12, lg: 16, xl: 20, pill: 999 };
const space:  Space  = { xs: 6,  sm: 8,  md: 12, lg: 16, xl: 20, xxl: 28 };
const font:   Typography = { h1: 18, h2: 15, body: 14, meta: 12 };

const makeCardShadow = (mode: ThemeMode): Shadow => ({
  shadowColor: '#0F172A',
  shadowOpacity:
    Platform.OS === 'ios' ? (mode === 'light' ? 0.10 : 0.14) : 0.08,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 4 },
  elevation: 2,
});

/* ----------------------------- PALETTES --------------------------------- */

const lightPalette: Palette = {
  // Base
  bg: '#F6F8FA',
  card: '#FFFFFF',
  line: 'rgba(15,23,42,0.08)',
  border: '#E2E8F0',
  text: '#0F172A',
  sub: '#5B6B80',

  // Brand / Semantic
  primary: '#2AA5E1',
  primaryDark: '#1479FF',
  info: '#2EA8FF',
  success: '#20C997',
  warn: '#FFB020',
  danger: '#EF4444',

  // Accents
  accent: '#0EA5A5',
  accentDark: '#0B8F86',
  muted: '#EEF2F6',

  // Chips
  chipBlue: '#EAF2FF',
  chipTeal: '#E6FBF4',
  chipGold: '#FFF6E5',
  dangerText: '#B42334', 

  // Gradients / History
  bgTopA: '#E8F3FF',
  bgTopB: '#F4FBFF',
  brand: '#2AA5E1',
  dark: '#0F172A',
  dim: '#607089',

  // Extra
  brandSoft: '#E0F2FF',
  orange: '#F6A21A',
  teal: '#2A9DA9',
};

const darkPalette: Palette = {
  ...lightPalette,
  bg: '#0B1220',
  card: '#101826',
  line: 'rgba(255,255,255,0.06)',
  border: 'rgba(255,255,255,0.12)',
  text: '#F8FAFC',
  sub: '#C6CEDA',
  muted: '#152133',
  chipBlue: '#152642',
  chipTeal: '#103237',
  chipGold: '#2A220F',
  bgTopA: '#0E1B2C',
  bgTopB: '#0C1A22',
};

/* ----------------------------- THEMES ----------------------------------- */

export const THEME = {
  light: {
    mode: 'light',
    color: lightPalette,
    radius,
    space,
    font,
    shadowCard: makeCardShadow('light'),
    utility: { card: () => makeCardShadow('light') },
  } as Theme,
  dark: {
    mode: 'dark',
    color: darkPalette,
    radius,
    space,
    font,
    shadowCard: makeCardShadow('dark'),
    utility: { card: () => makeCardShadow('dark') },
  } as Theme,
};

/** ตัวช่วยเลือกธีม */
export const getTheme = (mode: ThemeMode = 'light'): Theme => THEME[mode];

/* --------------------------- PRESET STYLES ------------------------------ */

export const stylesPreset = {
  card: (mode: ThemeMode = 'light') => ({
    backgroundColor: THEME[mode].color.card,
    borderRadius: THEME[mode].radius.lg,
    borderWidth: 1,
    borderColor: THEME[mode].color.border,
    padding: THEME[mode].space.lg,
    ...(THEME[mode].utility.card()),
  }),
  sectionTitle: (mode: ThemeMode = 'light') => ({
    fontSize: THEME[mode].font.h2,
    fontWeight: '700' as const,
    color: THEME[mode].color.text,
    marginBottom: THEME[mode].space.sm,
  }),
  chip: (active = false, mode: ThemeMode = 'light') => ({
    borderWidth: 1,
    borderColor: THEME[mode].color.border,
    backgroundColor: active
      ? THEME[mode].color.primary
      : THEME[mode].color.card,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: THEME[mode].radius.md,
  }),
  chipText: (active = false, mode: ThemeMode = 'light') => ({
    color: active ? '#fff' : THEME[mode].color.text,
    fontWeight: '600' as const,
  }),
};
