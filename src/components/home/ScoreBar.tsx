// components/home/ScoreBar.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLOR, theme, SP, FONT } from '../../theme/token';
import Ring from './Ring';

type StatsProp = {
  annualRemaining: string; // เหลือ
  sickRemaining: string;   // (เดิมใช้, ถ้าอยากให้เป็น "รวม" ให้ส่ง totalLabel มาแทน)
  daysUsed: string;        // ใช้ไป
  // ทางเลือก: ถ้ามี จะใช้แทน label ของ "รวม"
  totalLabel?: string;
};

type Props = {
  left: number;
  used: number;
  total: number;
  stats: StatsProp;
  loading?: boolean; // option: แสดงสเกเลตันระหว่างโหลด
};

export default function ScoreBar({ left, used, total, stats, loading }: Props) {
  // ป้องกัน division by zero และค่าติดลบ/เกิน 100
  const safePct = (num: number, den: number) => {
    if (!den || den <= 0) return 0;
    const pct = Math.round((num / den) * 100);
    return Math.max(0, Math.min(100, pct));
  };

  const leftPct = safePct(left, total);
  const usedPct = safePct(used, total);

  const fmt = (n: number) => {
    try {
      return n.toLocaleString(); // ใช้ locale ของเครื่อง
    } catch {
      return String(n);
    }
  };

  // เลือก label อย่างมีเหตุผล
  const leftLabel  = stats.annualRemaining;
  const usedLabel  = stats.daysUsed;                 // ✅ “ใช้ไป”
  const totalLabel = stats.totalLabel || 'Total';    // ถ้าอยาก i18n ให้ส่ง totalLabel มาด้วย
  // หมายเหตุ: ถ้าคุณยังอยากให้ใบที่ 3 เป็น “สิทธิ์ป่วยคงเหลือ” ก็ส่ง totalLabel = stats.sickRemaining ตอนเรียกใช้ได้

  if (loading) {
    return (
      <View style={styles.sumRow}>
        {[0, 1, 2].map((i) => (
          <View key={i} style={[styles.sumCard, styles.cardSkeleton]}>
            <View style={styles.ringSkeleton} />
            <View style={{ marginLeft: 10, flex: 1 }}>
              <View style={styles.lineSkeleton} />
              <View style={[styles.lineSkeleton, { width: '70%', marginTop: 6 }]} />
            </View>
          </View>
        ))}
      </View>
    );
  }

  return (
    <View style={styles.sumRow}>
      {/* เหลือ */}
      <View style={styles.sumCard} testID="score-left">
        <Ring size={56} stroke={7} value={leftPct} color={theme.color.teal1} />
        <View style={{ marginLeft: 10 }}>
          <Text style={[styles.sumValue, { fontFamily: FONT.bodyBold }]}>{fmt(left)}</Text>
          <Text style={[styles.sumLabel, { fontFamily: FONT.body }]} numberOfLines={1}>
            {leftLabel}
          </Text>
        </View>
      </View>

      {/* ใช้ไป */}
      <View style={styles.sumCard} testID="score-used">
        <Ring size={56} stroke={7} value={usedPct} color={theme.color.teal2} />
        <View style={{ marginLeft: 10 }}>
          <Text style={[styles.sumValue, { fontFamily: FONT.bodyBold }]}>{fmt(used)}</Text>
          <Text style={[styles.sumLabel, { fontFamily: FONT.body }]} numberOfLines={1}>
            {usedLabel}
          </Text>
        </View>
      </View>

      {/* รวม */}
      <View style={styles.sumCard} testID="score-total">
        <Ring size={56} stroke={7} value={100} color={theme.color.teal3} />
        <View style={{ marginLeft: 10 }}>
          <Text style={[styles.sumValue, { fontFamily: FONT.bodyBold }]}>{fmt(total)}</Text>
          <Text style={[styles.sumLabel, { fontFamily: FONT.body }]} numberOfLines={1}>
            {totalLabel}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sumRow: { flexDirection: 'row', columnGap: SP.md },
  sumCard: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: theme.color.card,
    borderRadius: theme.radius.xl,
    padding: SP.md,
    borderWidth: 1,
    borderColor: theme.color.line,
    minHeight: 72,
  },
  sumValue: { fontSize: 18, fontWeight: '900', color: theme.color.text, lineHeight: 22 },
  sumLabel: { fontSize: 12, color: theme.color.sub },

  /* Skeleton */
  cardSkeleton: {
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  ringSkeleton: {
    width: 58,
    height: 58,
    borderRadius: 58,
    backgroundColor: '#EDF2F7',
  },
  lineSkeleton: {
    height: 12,
    width: '50%',
    borderRadius: 6,
    backgroundColor: '#EDF2F7',
  },
});
