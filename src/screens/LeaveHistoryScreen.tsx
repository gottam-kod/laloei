import React, { useMemo, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, Platform, StatusBar,
  TouchableOpacity, FlatList, RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLOR_HISTORY as COLOR } from '../theme/theme'

type LeaveStatus = 'approved' | 'pending' | 'rejected' | 'cancelled';

type LeaveItem = {
  id: string;
  type: 'ลาป่วย' | 'ลาพักผ่อน' | 'ลากิจ' | 'อื่น ๆ';
  range: string;        // เช่น 12–14 ก.ย. 2025
  days: number;         // จำนวนวัน
  status: LeaveStatus;
  note?: string;
  createdAt: string;    // วันที่ยื่นคำขอ
};

type Props = {
  onBack?: () => void;
  onCreateRequest?: () => void;
  onOpenDetail?: (id: string) => void;
};

const SHADOW = Platform.select({
  ios: { shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 6 } },
  android: { elevation: 4 },
});

const mockData: LeaveItem[] = [
  { id: '1', type: 'ลาพักผ่อน', range: '12–14 ก.ย. 2025', days: 3, status: 'approved', createdAt: '10 ก.ย. 2025', note: 'ท่องเที่ยวครอบครัว' },
  { id: '2', type: 'ลาป่วย',   range: '9 ก.ย. 2025',       days: 1, status: 'pending',  createdAt: '9 ก.ย. 2025', note: 'ไข้หวัด' },
  { id: '3', type: 'ลากิจ',     range: '3–4 ก.ย. 2025',     days: 2, status: 'rejected', createdAt: '2 ก.ย. 2025', note: 'ธุระส่วนตัว' },
  { id: '4', type: 'ลาพักผ่อน', range: '22–23 ส.ค. 2025',   days: 2, status: 'approved', createdAt: '20 ส.ค. 2025' },
];

const FILTERS: Array<{ key: 'all' | LeaveStatus; label: string }> = [
  { key: 'all',      label: 'ทั้งหมด' },
  { key: 'pending',  label: 'รออนุมัติ' },
  { key: 'approved', label: 'อนุมัติแล้ว' },
  { key: 'rejected', label: 'ไม่อนุมัติ' },
  { key: 'cancelled',label: 'ยกเลิก' },
];

const LeaveHistoryScreen: React.FC<Props> = ({ onBack, onCreateRequest, onOpenDetail }) => {
  const [active, setActive] = useState<(typeof FILTERS)[number]['key']>('all');
  const [refreshing, setRefreshing] = useState(false);

  const list = useMemo(() => {
    if (active === 'all') return mockData;
    return mockData.filter(i => i.status === active);
  }, [active]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {/* Header */}
      <LinearGradient colors={[COLOR.bgTopA, COLOR.bgTopB]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.headerWrap}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={onBack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={styles.backChevron}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>ประวัติการลา</Text>
          <View style={{ width: 24 }} />
        </View>
        {/* Filter chips */}
        <View style={[styles.filterRow, SHADOW]}>
          {FILTERS.map(f => {
            const isActive = f.key === active;
            return (
              <TouchableOpacity
                key={f.key}
                onPress={() => setActive(f.key)}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                activeOpacity={0.9}
              >
                <Text style={[styles.filterText, isActive && styles.filterTextActive]}>{f.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </LinearGradient>

      {/* List */}
      <FlatList
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
        data={list}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={[styles.card, { alignItems: 'center' }]}>
            <Text style={styles.emptyTitle}>ยังไม่มีรายการลา</Text>
            <Text style={styles.emptySub}>เริ่มคำขอใหม่ได้ที่ปุ่มด้านล่างขวา</Text>
          </View>
        }
        renderItem={({ item }) => (
          <LeaveItemCard item={item} onPress={() => onOpenDetail?.(item.id)} />
        )}
      />

      {/* Floating Action (ขอลา) */}
      <TouchableOpacity style={[styles.fab, SHADOW]} onPress={onCreateRequest} activeOpacity={0.9}>
        <Text style={styles.fabPlus}>＋</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LeaveHistoryScreen;

/* ============== Sub Components ============== */

const LeaveItemCard: React.FC<{ item: LeaveItem; onPress?: () => void }> = ({ item, onPress }) => {
  return (
    <TouchableOpacity style={[styles.card, SHADOW]} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.cardHeadRow}>
        <Text style={styles.cardTitle}>{item.type}</Text>
        <StatusBadge status={item.status} />
      </View>
      <View style={styles.divider} />
      <View style={styles.rowBetween}>
        <Text style={styles.metaText}>ช่วงลา</Text>
        <Text style={styles.valueText}>{item.range} · {item.days} วัน</Text>
      </View>
      {!!item.note && (
        <View style={styles.rowBetween}>
          <Text style={styles.metaText}>หมายเหตุ</Text>
          <Text style={styles.valueText} numberOfLines={1}>{item.note}</Text>
        </View>
      )}
      <View style={styles.rowBetween}>
        <Text style={styles.metaText}>ยื่นคำขอ</Text>
        <Text style={styles.valueText}>{item.createdAt}</Text>
      </View>
    </TouchableOpacity>
  );
};

const StatusBadge: React.FC<{ status: LeaveStatus }> = ({ status }) => {
  const map = {
    approved:  { bg: '#E9FBF4', fg: '#0A7C66', label: 'อนุมัติแล้ว' },
    pending:   { bg: '#FFF6E5', fg: '#9A6400', label: 'รออนุมัติ' },
    rejected:  { bg: '#FCE9E9', fg: '#9A1B1B', label: 'ไม่อนุมัติ' },
    cancelled: { bg: '#EEF2F6', fg: '#5B6878', label: 'ยกเลิก' },
  } as const;
  const s = map[status];
  return (
    <View style={[styles.badge, { backgroundColor: s.bg }]}>
      <Text style={[styles.badgeText, { color: s.fg }]}>{s.label}</Text>
    </View>
  );
};

/* ============== Styles ============== */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafaff' },

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
  filterText: { fontSize: 12.5, color: COLOR.dim, fontWeight: '600' },
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
  valueText: { fontSize: 13.5, color: COLOR.dark, fontWeight: '600' },

  badge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  badgeText: { fontSize: 12, fontWeight: '700' },

  emptyTitle: { fontSize: 16, fontWeight: '800', color: COLOR.dark, marginBottom: 6, textAlign: 'center' },
  emptySub: { fontSize: 13, color: COLOR.dim, textAlign: 'center' },

  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLOR.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabPlus: { color: '#fff', fontSize: 28, lineHeight: 28, fontWeight: '700' },
});
