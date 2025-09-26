import { StyleSheet } from 'react-native';
import { Platform } from 'react-native';
import { DefaultTheme } from 'react-native-paper'
import { Tone } from '../interface/tone';

export const toneColor = (t: Tone) =>
  t === 'ok' ? COLOR.ok : t === 'warn' ? COLOR.warn : t === 'danger' ? COLOR.danger : COLOR.brand;

export const COLOR_HISTORY = {
  bgTopA: '#E8F3FF',
  bgTopB: '#F4FBFF',
  brand:  '#2AA5E1',
  dark:   '#0F172A',
  dim:    '#607089',
  card:   '#FFFFFF',
  line:   '#EAF0F6',
  success:'#20C997',
  warn:   '#FFB020',
  danger: '#F05252',
  muted:  '#95A2B3',
};


export const COLOR = {
  backgroundColor: '#FFFFFF',
  bgTopA: '#8bb4dfff',
  bgTopB: '#2e6382ff',
  brand: '#2AA5E1',
  dark: '#0F172A',
  dim: '#607089',
  card: '#FFFFFF',
  line: '#EAF0F6',
  success: '#20C997',
  warn: '#FFB020',
  textPrimary: '#1F2937',
  primary: '#2AA5E1',
  primary2: '#1479FF',
  accent: '#E0F2FF',
  textMain: '#1F2937',
  brandSoft: '#E0F2FF',
  orange: '#F6A21A',
  teal: '#2A9DA9',
  text: '#1F2A33',
  bgTop: '#FEFDFC',
  bgBottom: '#F4FAFF',
  appleBlack: '#000000',
  ok: '#22C55E',
  danger: '#EF4444',
  bg: '#F7FAFD',
};
export const RADIUS = {
  sm: 6,
  md: 12,
  lg: 18,
  xl: 24,
};

export const SHADOW = (e = 6) => Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: e,
    shadowOffset: { width: 0, height: 2 * e / 3 },
    elevation: 6,
  },
  android: { 
    elevation: 4 
  },
});

export const headerHeight = StyleSheet.create({
  header: {
    height: Platform.select({ ios: 88, android: 64 }),
    paddingTop: Platform.select({ ios: 44, android: 20 }),
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLOR.line,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    zIndex: 10,
  },
}).header;