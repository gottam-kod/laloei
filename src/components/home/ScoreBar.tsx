import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLOR, UI, SP, FONT } from '../../theme/token';
import Ring from './Ring';

type Props = { 
  left: number; 
  used: number; 
  total: number;
  stats: {
    annualRemaining: string;
    sickRemaining: string;
    daysUsed: string;
  };
 };
export default function ScoreBar({ left, used, total, stats }: Props) {
  const leftPct = Math.round((left / total) * 100);
  const usedPct = Math.round((used / total) * 100);
  return (
    <View style={styles.sumRow}>
      <View style={styles.sumCard}>
        <Ring size={58} stroke={7} value={leftPct} color={COLOR.primary} />
        <View style={{ marginLeft: 10 }}>
          <Text style={[styles.sumValue, { fontFamily: FONT.bodyBold }]}>{left}</Text>
          <Text style={[styles.sumLabel, { fontFamily: FONT.body }]}>{stats.annualRemaining}</Text>
        </View>
      </View>
      <View style={styles.sumCard}>
        <Ring size={58} stroke={7} value={usedPct} color={COLOR.info} />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.sumValue}>{used}</Text>
          <Text style={styles.sumLabel}>{stats.sickRemaining}</Text>
        </View>
      </View>
      <View style={styles.sumCard}>
        <Ring size={58} stroke={7} value={100} color={'#64748B'} />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.sumValue}>{total}</Text>
          <Text style={styles.sumLabel}>{stats.daysUsed}</Text>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  sumRow: { flexDirection: 'row', columnGap: SP.md },
  sumCard: {
    flex: 1, alignItems: 'center', flexDirection: 'row',
    backgroundColor: COLOR.card, borderRadius: UI.radius.xl, padding: SP.md,
    borderWidth: 1, borderColor: COLOR.line,
  },
  sumValue: { fontSize: 18, fontWeight: '900', color: COLOR.text, lineHeight: 22 },
  sumLabel: { fontSize: 12, color: COLOR.sub },
});
