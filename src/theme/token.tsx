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
  // Base / Surfaces
  bg: string;            // พื้นหลังหน้าจอ
  card: string;          // การ์ด/พื้นผิว
  line: string;          // เส้นคั่นอ่อนๆ
  border: string;        // เส้นขอบคอมโพเนนต์
  text: string;          // ข้อความหลัก
  sub: string;           // ข้อความรอง

  // Brand / Semantic
  primary: string;       // สีหลักของแบรนด์
  primaryDark: string;   // เข้มขึ้นสำหรับกด/hover
  info: string;          // ข้อมูล/ลิงก์
  success: string;       // ผ่าน/สำเร็จ
  warn: string;          // คำเตือน
  danger: string;        // ผิดพลาด

  // Accents
  accent: string;        // โทนรอง
  accentDark: string;
  muted: string;         // พื้นหลังจางๆ

  // Chips / Badges (พื้น)
  chipBlue: string;
  chipTeal: string;
  chipGold: string;

  // Gradients / History
  bgTopA: string;
  bgTopB: string;
  brand: string;
  dark: string;
  dim: string;

  // Extra
  brandSoft: string;
  orange: string;
  teal: string;
};

type Typography = {
  h1: number;
  h2: number;
  body: number;
  meta: number;
};

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
  // utility: รวม helper/คอมมอน
  utility: {
    card(): Shadow;
  };
};

/* ----------------------------- BASE TOKENS ------------------------------ */

const radius: Radius = { md: 12, lg: 16, xl: 20, pill: 999 };
const space:  Space  = { xs: 6,  sm: 8,  md: 12, lg: 16, xl: 20, xxl: 28 };
const font:   Typography = { h1: 18, h2: 15, body: 14, meta: 12 };

// shadow helper ให้สัมผัสใกล้เคียงกัน iOS/Android
const makeCardShadow = (mode: ThemeMode): Shadow => ({
  shadowColor: '#0F172A',
  shadowOpacity: Platform.OS === 'ios' ? (mode === 'light' ? 0.10 : 0.14) : 0.08,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 4 },
  elevation: 2,
});

/* ----------------------------- PALETTES --------------------------------- */

const lightPalette: Palette = {
  // Base / Surfaces
  bg: '#F6F8FA',
  card: '#FFFFFF',
  line: 'rgba(15,23,42,0.08)',
  border: '#E2E8F0',
  text: '#0F172A',
  sub: '#5B6B80',

  // Brand / Semantic
  primary:   '#2AA5E1', // รวม primary/brand เป็นโทนเดียว
  primaryDark:'#1479FF',
  info:      '#2EA8FF',
  success:   '#20C997',
  warn:      '#FFB020',
  danger:    '#EF4444',

  // Accents
  accent:     '#0EA5A5',
  accentDark: '#0B8F86',
  muted:      '#EEF2F6',

  // Chips
  chipBlue: '#EAF2FF',
  chipTeal: '#E6FBF4',
  chipGold: '#FFF6E5',

  // Gradients / History
  bgTopA: '#E8F3FF',
  bgTopB: '#F4FBFF',
  brand:  '#2AA5E1',
  dark:   '#0F172A',
  dim:    '#607089',

  // Extra
  brandSoft: '#E0F2FF',
  orange: '#F6A21A',
  teal:   '#2A9DA9',
};

const darkPalette: Palette = {
  ...lightPalette,
  bg: '#0B1220',
  card: '#101826',
  line: 'rgba(255,255,255,0.06)',
  border: 'rgba(255,255,255,0.12)',
  text: '#F8FAFC',
  sub:  '#C6CEDA',
  muted:'#152133',
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
    utility: {
      card() { return makeCardShadow('light'); },
    },
  } as Theme,
  dark: {
    mode: 'dark',
    color: darkPalette,
    radius,
    space,
    font,
    shadowCard: makeCardShadow('dark'),
    utility: {
      card() { return makeCardShadow('dark'); },
    },
  } as Theme,
};

/** ตัวช่วยเลือกธีม (ถ้าวันหลังอยากต่อระบบสลับโหมด) */
export const getTheme = (mode: ThemeMode = 'light'): Theme => THEME[mode];

/* ----------------------- BACKWARD-COMPAT MAPPING ------------------------
   เพื่อ "เจ็บแล้วจบ" คุณยังใช้คีย์เก่าได้ในช่วงทรานสิชัน
   ค่อยๆ ย้ายไปใช้ THEME.light.color.* และ THEME.light.space/radius/font
--------------------------------------------------------------------------*/

// SP (เก่า) → space ใหม่
export const SP = space;


// COLOR (เก่า) → ไปชุดเดียวกับ palette ใหม่
export const COLOR = {
  backgroundColor: lightPalette.card,
  bgTopA: '#8bb4df', // ถ้าจำเป็นต้องคงค่าพิเศษ
  bgTopB: '#2e6382',
  gradA:  '#70d6f5ff',
  gradB:  '#EAFDF6',
  brand:  lightPalette.brand,
  brand2: '#EAFDF6',
  dark:   lightPalette.dark,
  dim:    lightPalette.dim,
  card:   lightPalette.card,
  line:   '#EAF0F6',
  success: lightPalette.success,
  warn:    lightPalette.warn,
  textPrimary: '#1F2937',
  primary:  lightPalette.primary,
  primary2: lightPalette.primaryDark,
  accent:   lightPalette.brandSoft,
  textMain: '#1F2937',
  brandSoft: lightPalette.brandSoft,
  orange:   lightPalette.orange,
  teal:     lightPalette.teal,
  text:     '#1F2A33',
  bgTop:    '#FEFDFC',
  bgBottom: '#F4FAFF',
  appleBlack: '#000000',
  ok:      '#22C55E',
  danger:  lightPalette.danger,
  sub:     lightPalette.sub,
  border:  lightPalette.border,
  shadow:  { color: '#000', s: { width: 0, height: 1 }, o: 0.06, r: 8 },
  info:     lightPalette.info,
  chip:     lightPalette.chipBlue,
  al:     '#05f368ff',
  sl:     '#dff210ff',
  cl:     '#f97316ff',
  ul:     '#ef4444ff',
  chipText: '#0F172A',
};

// UI (เก่า) → โยงเข้าชุดใหม่
export const UI = {
  color: {
    bg: lightPalette.bg,
    card: '#a12525ff', // ถ้าจำเป็นต้องคงค่า card สีแดงสำหรับกรณีพิเศษ
    line: lightPalette.line,
    text: lightPalette.text,
    sub:  '#6B7A90',
    accent: lightPalette.accent,
    accentDark: lightPalette.accentDark,
    muted: lightPalette.muted,
    teal1: '#20C6BA',
    teal2: '#65D3C6',
    chipBlue: lightPalette.chipBlue,
    chipTeal: lightPalette.chipTeal,
    chipGold: lightPalette.chipGold,
  },
  radius,
  space,
  font,
  shadowCard: makeCardShadow('light'),
};

/* --------------------------- EXAMPLE TOKENS ----------------------------- */

// ตัวอย่างสไตล์หน้าที่ใช้ซ้ำได้
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
    backgroundColor: active ? THEME[mode].color.primary : THEME[mode].color.card,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: THEME[mode].radius.md,
  }),
  chipText: (active = false, mode: ThemeMode = 'light') => ({
    color: active ? '#fff' : THEME[mode].color.text,
    fontWeight: '600' as const,
  }),
};
