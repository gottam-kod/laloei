import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LeaveItem } from '../interface/leaveHistory';
import { COLOR, FONT } from '../theme/token';

const statusStyle = {
  approved: { left: '#18C4A5', icon: '✔︎', badgeBg: '#E9FBF4', badgeFg: '#0A7C66', label: 'อนุมัติแล้ว' },
  pending: { left: '#F4B740', icon: '…', badgeBg: '#FFF6E5', badgeFg: '#9A6400', label: 'รออนุมัติ' },
  rejected: { left: '#E54343', icon: '✖︎', badgeBg: '#FCE9E9', badgeFg: '#9A1B1B', label: 'ไม่อนุมัติ' },
  cancelled: { left: '#9AA7B7', icon: '–', badgeBg: '#EEF2F6', badgeFg: '#5B6878', label: 'ยกเลิก' },
} as const;

export const LeaveItemCard: React.FC<{ item: LeaveItem; onPress?: () => void }> = ({ item, onPress }) => {
  const st = statusStyle[item.status.toLowerCase() as keyof typeof statusStyle] || statusStyle.pending;
  return (
    <TouchableOpacity
      style={[styles.card, { borderLeftWidth: 4, borderLeftColor: st.left }]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.cardHeadRow}>
        <Text style={[styles.cardTitle, { fontFamily: FONT.bodyBold }]}>{item.type}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text style={{ color: st.left, fontWeight: '900', fontFamily: FONT.bodyBold }}>{st.icon}</Text>
          <View style={[styles.badge, { backgroundColor: st.badgeBg }]}>
            <Text style={[styles.badgeText, { color: st.badgeFg, fontFamily: FONT.body }]}>{st.label}</Text>
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      <RowKV k="ช่วงลา" v={`${item.range} · ${item.days} วัน`} />
      {!!item.note && <RowKV k="หมายเหตุ" v={item.note} />}
      <RowKV k="ยื่นคำขอ" v={item.createdAt} />
    </TouchableOpacity>
  );
};

const RowKV = ({ k, v }: { k: string; v: string }) => (
  <View style={styles.rowBetween}>
    <Text style={[styles.metaText, {fontFamily: FONT.body}]}>{k}</Text>
    <Text style={[styles.valueText,{fontFamily: FONT.bodyBold}]} numberOfLines={1}>{v}</Text>
  </View>
);


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },

  headerWrap: {
    paddingTop: Platform.OS === 'ios' ? 64 : 52,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backChevron: { fontSize: 28, color: COLOR.dim, lineHeight: 28 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: COLOR.dark },

  filterRow: {
    marginTop: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLOR.line,
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 8,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#F3F7FB',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterChipActive: {
    backgroundColor: '#E0F2FF',
    borderColor: '#D4EAFE',
  },
  filterText: { fontSize: 12.5, color: COLOR.dim, fontWeight: '700' },
  filterTextActive: { color: COLOR.brand },

  card: {
    backgroundColor: COLOR.card,
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLOR.line,
  },
  cardHeadRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  cardTitle: { fontSize: 16, fontWeight: '800', color: COLOR.dark },
  divider: { height: 1, backgroundColor: COLOR.line, marginVertical: 10 },

  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
  metaText: { fontSize: 12.5, color: COLOR.dim },
  valueText: { fontSize: 13.5, color: COLOR.dark, fontWeight: '600', marginLeft: 8, flexShrink: 1, textAlign: 'right' },

  badge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  badgeText: { fontSize: 12, fontWeight: '700' },

  emptyTitle: { fontSize: 16, fontWeight: '800', color: COLOR.dark, marginBottom: 6, textAlign: 'center' },
  emptySub: { fontSize: 13, color: COLOR.dim, textAlign: 'center', marginBottom: 10 },
  primary: {
    marginTop: 6,
    backgroundColor: COLOR.brand,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 14,
  },
  primaryTxt: { color: '#fff', fontWeight: '900' },

  fab: {
    position: 'absolute',
    right: 20,
    bottom: 120,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLOR.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabPlus: { color: '#fff', fontSize: 28, lineHeight: 28, fontWeight: '700' },
});
