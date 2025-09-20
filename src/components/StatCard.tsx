import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SHADOW, COLOR as THEME_COLOR, toneColor } from '../theme/theme';
import { StatCardProps } from '../interface/statcard';

const COLOR =
  THEME_COLOR ?? {
    card: '#FFFFFF',
    text: '#1F2A37',
    dim: '#6B7280',
    brand: '#1AA6B7',
    ok: '#22C55E',
    warn: '#F59E0B',
    danger: '#EF4444',
  };

const StatCard: React.FC<StatCardProps> = ({ label, value, hint, tone = 'brand' }) => (
  <View style={[styles.statCard, SHADOW()]}>
          <Text style={styles.statLabel}>{label}</Text>
          <Text style={[styles.statValue, { color: toneColor(tone) }]}>{value}</Text>
          {!!hint && <Text style={styles.statHint}>{hint}</Text>}
      </View>
);

export default memo(StatCard);

const styles = StyleSheet.create({
    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    statCard: { flexBasis: '48%', backgroundColor: COLOR.card, borderRadius: 18, padding: 14 },
    statLabel: { color: COLOR.dim, fontSize: 12, fontWeight: '700' },
    statValue: { fontSize: 20, fontWeight: '900', marginTop: 6 },
    statHint: { color: COLOR.dim, marginTop: 4, fontSize: 12 },

});
