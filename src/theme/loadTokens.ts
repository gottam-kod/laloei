// src/theme/loadTokens.ts
import tokens from './tokens.json';
import type { ThemeMode } from './tokens';

export const getThemeFromJson = (mode: ThemeMode = 'light') =>
  (tokens as any)[mode];
