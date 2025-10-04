// src/theme/shadow.ts
import { Platform } from 'react-native';
import { ColorTokens } from './tokens';

export const mapShadow = (t: ColorTokens, key: 'soft'|'float'|'neon') => {
  if (key === 'neon') {
    return Platform.select({
      ios:   { shadowColor: t.accentA, shadowOpacity: 0.25, shadowRadius: 16, shadowOffset: { width: 0, height: 8 } },
      android: { elevation: 10 }
    });
  }
  if (key === 'float') {
    return Platform.select({
      ios:   { shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 12, shadowOffset: { width: 0, height: 6 } },
      android: { elevation: 6 }
    });
  }
  // soft
  return Platform.select({
    ios:   { shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 3 } },
    android: { elevation: 3 }
  });
};
