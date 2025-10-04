// src/theme/tokens.ts
// Blue–Green Pastel + Neon Accent (Light/Dark)
// ใช้กับ react-native, react-native-linear-gradient

export type ThemeMode = 'light' | 'dark';

export type ColorTokens = {
    // base
    background: string;
    surface: string;
    surfaceAlt: string;
    border: string;

    // text
    textPrimary: string;
    textSecondary: string;
    textInverse: string;
    textMuted: string;

    // brand
    primary: string;    // base blue
    primaryAlt: string; // mint/green
    accentA: string;    // cyan
    accentB: string;    // lime

    // states
    success: string;
    warning: string;
    error: string;
    info: string;

    // others
    white: string;
    black: string;

    // gradients (สำหรับ LinearGradient)
    gradients: {
        header: readonly [string, string];
        action: readonly [string, string];
        ring: readonly [string, string];
        tabActive: readonly [string, string];
    };

    // shadows (ตั้งไว้เป็น token ชื่อ; mapping จริงทำใน StyleSheet)
    shadows: {
        soft: string;
        floating: string;
        neon: string;
    };
};

export const lightTokens: Readonly<ColorTokens> = {
    background: '#F0FAFF',
    surface: '#FFFFFF',
    surfaceAlt: '#F8FAFC',
    border: '#E2E8F0',

    textPrimary: '#0F172A',
    textSecondary: '#1F2937',
    textInverse: '#FFFFFF',
    textMuted: '#475569',

    primary: '#4FC3F7',     // blue
    primaryAlt: '#4ADE80',  // mint green
    accentA: '#00E5FF',     // cyan
    accentB: '#7CFF7C',     // lime

    success: '#16A34A',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#0EA5E9',

    white: '#FFFFFF',
    black: '#000000',

    gradients: {
        header: ['#4FC3F7', '#4ADE80'] as const,
        action: ['#4FC3F7', '#4ADE80'] as const,
        ring: ['#00E5FF', '#7CFF7C'] as const,
        tabActive: ['#00E5FF', '#7CFF7C'] as const,
    },

    shadows: {
        soft: 'soft',       // use in StyleSheet mapping
        floating: 'float',
        neon: 'neon',
    },
};

export const darkTokens: Readonly<ColorTokens> = {
    background: '#0B1D2A',
    surface: 'rgba(17,27,61,0.6)',
    surfaceAlt: '#0F2027',
    border: 'rgba(124,255,124,0.25)',

    textPrimary: '#E6FFFA',
    textSecondary: '#D1FAE5',
    textInverse: '#0B1D2A',
    textMuted: '#93C5FD',

    primary: '#38BDF8',     // softer blue on dark
    primaryAlt: '#22C55E',  // green
    accentA: '#00E5FF',
    accentB: '#7CFF7C',

    success: '#34D399',
    warning: '#F59E0B',
    error: '#F87171',
    info: '#60A5FA',

    white: '#FFFFFF',
    black: '#000000',

    gradients: {
        header: ['#0F2027', '#2C5364'] as const,
        action: ['#38BDF8', '#22C55E'] as const,
        ring: ['#00E5FF', '#7CFF7C'] as const,
        tabActive: ['#00E5FF', '#7CFF7C'] as const,
    },

    shadows: {
        soft: 'soft',
        floating: 'float',
        neon: 'neon',
    },
};

export const getTheme = (mode: ThemeMode = 'light') =>
    mode === 'dark' ? darkTokens : lightTokens;

// —— ตัวช่วย semantic role —— //
export const semantic = {
    headerGradient: (t: ColorTokens) => t.gradients.header,
    fabGradient: (t: ColorTokens) => t.gradients.action,
    ringGradient: (t: ColorTokens) => t.gradients.ring,
    tabActiveGrad: (t: ColorTokens) => t.gradients.tabActive,
    pillBorder: (t: ColorTokens) => t.border,
    pastelSurface: (t: ColorTokens) => t.surfaceAlt,
    pastelBorder: (t: ColorTokens) => t.border,
};
