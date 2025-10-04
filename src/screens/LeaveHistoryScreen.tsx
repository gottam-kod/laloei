import React, { useMemo, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, Platform, StatusBar,
  TouchableOpacity, SectionList, RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { BackgroundFX } from '../components/Background';

// ====== THEME (ปรับตามโปรเจกต์ของคุณได้) ======
const COLOR = {
  bgTopA: '#E8F3FF',
  bgTopB: '#F4FBFF',
  brand:  '#2AA5E1',
  dark:   '#0F172A',
  dim:    '#607089',
  card:   '#FFFFFF',
  line:   '#EAF0F6',
};

type LeaveStatus = 'approved' | 'pending' | 'rejected' | 'cancelled';
type LeaveItem = {
  id: string;
  type: 'ลาป่วย' | 'ลาพักผ่อน' | 'ลากิจ' | 'อื่น ๆ';
  range: string;        // เช่น 12–14 ก.ย. 2025 (เพื่อแสดงผล)
  days: number;         // จำนวนวัน
  status: LeaveStatus;
  note?: string;
  createdAt: string;    // วันที่ยื่น "แบบแสดงผล" (ไทยได้)
  createdAtISO?: string; // ✅ แนะนำเก็บ ISO เพื่อคำนวณ/จัดกลุ่ม
};

type Props = {
  onBack?: () => void;
  onCreateRequest?: () => void;
  onOpenDetail?: (id: string) => void;
};

// ====== MOCK (ตัวอย่างมี ISO เพื่อจัดกลุ่ม) ======
const MOCK: LeaveItem[] = [
  { id: '1', type: 'ลาพักผ่อน', range: '12–14 ก.ย. 2025', days: 3, status: 'approved', createdAt: '10 ก.ย. 2025', createdAtISO: '2025-09-10' },
  { id: '2', type: 'ลาป่วย',   range: '9 ก.ย. 2025',       days: 1, status: 'pending',  createdAt: '9 ก.ย. 2025',  createdAtISO: '2025-09-09', note: 'ไข้หวัด' },
  { id: '3', type: 'ลากิจ',     range: '3–4 ก.ย. 2025',     days: 2, status: 'rejected', createdAt: '2 ก.ย. 2025',  createdAtISO: '2025-09-02', note: 'ธุระส่วนตัว' },
  { id: '4', type: 'ลาพักผ่อน', range: '22–23 ส.ค. 2025',   days: 2, status: 'approved', createdAt: '20 ส.ค. 2025', createdAtISO: '2025-08-20' },
];

// ====== FILTERS ======
const FILTERS: Array<{ key: 'all' | LeaveStatus; label: string }> = [
  { key: 'all',      label: 'ทั้งหมด' },
  { key: 'pending',  label: 'รออนุมัติ' },
  { key: 'approved', label: 'อนุมัติแล้ว' },
  { key: 'rejected', label: 'ไม่อนุมัติ' },
  { key: 'cancelled',label: 'ยกเลิก' },
];

// ====== HELPERS ======
const SHADOW = Platform.select({
  ios: { shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 6 } },
  android: { elevation: 4 },
});

const toMonthKey = (iso: string) => iso.slice(0, 7); // YYYY-MM
const monthLabelTH = (ym: string) => {
  const [y, m] = ym.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString('th-TH', { year: 'numeric', month: 'long' });
};

const ensureISO = (item: LeaveItem) => {
  if (item.createdAtISO) return item.createdAtISO;
  // Fallback: พยายาม parse จาก createdAt (อาจไม่แม่นถ้าเป็นข้อความไทย)
  const d = new Date(item.createdAt);
  if (isNaN(d.getTime())) return new Date().toISOString().slice(0, 10);
  return d.toISOString().slice(0, 10);
};

const statusStyle = {
  approved:  { left: '#18C4A5', icon: '✔︎', badgeBg: '#E9FBF4', badgeFg: '#0A7C66', label: 'อนุมัติแล้ว' },
  pending:   { left: '#F4B740', icon: '…',  badgeBg: '#FFF6E5', badgeFg: '#9A6400', label: 'รออนุมัติ' },
  rejected:  { left: '#E54343', icon: '✖︎', badgeBg: '#FCE9E9', badgeFg: '#9A1B1B', label: 'ไม่อนุมัติ' },
  cancelled: { left: '#9AA7B7', icon: '–',  badgeBg: '#EEF2F6', badgeFg: '#5B6878', label: 'ยกเลิก' },
} as const;

// ===================================================

const LeaveHistoryScreen: React.FC<Props> = ({ onBack, onCreateRequest, onOpenDetail }) => {
  const nav = useNavigation();
  const [active, setActive] = useState<(typeof FILTERS)[number]['key']>('all');
  const [refreshing, setRefreshing] = useState(false);

  // ทั้งหมด (จริงควรมาจาก API)
  const all = MOCK;

  // นับจำนวนต่อสถานะ (ใช้ all เพื่อบอกภาพรวม)
  const counts = useMemo(() => {
    const acc: Record<'all' | LeaveStatus, number> = { all: all.length, approved: 0, pending: 0, rejected: 0, cancelled: 0 };
    all.forEach(i => { acc[i.status] += 1; });
    return acc;
  }, [all]);

  // กรองตามฟิลเตอร์ที่เลือก
  const filtered = useMemo(() => {
    if (active === 'all') return all;
    return all.filter(i => i.status === active);
  }, [all, active]);

  // จัดกลุ่มเป็นเดือนสำหรับ SectionList
  const sections = useMemo(() => {
    if (filtered.length === 0) return [];
    const map = new Map<string, LeaveItem[]>();
    filtered.forEach(it => {
      const k = toMonthKey(ensureISO(it)); // YYYY-MM
      map.set(k, [ ...(map.get(k) || []), it ]);
    });
    // เรียงใหม่ให้เดือนล่าสุดอยู่บน
    const ordered = Array.from(map.entries()).sort(([a], [b]) => (a < b ? 1 : -1));
    return ordered.map(([k, data]) => ({ title: monthLabelTH(k), data }));
  }, [filtered]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // TODO: fetch data จริง
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  const back = useCallback(() => {
    if (onBack) return onBack();
    nav.goBack();
  }, [nav, onBack]);

  return (
    <SafeAreaView style={styles.container}>
      <BackgroundFX />
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <LinearGradient
        colors={[COLOR.bgTopA, COLOR.bgTopB]}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={styles.headerWrap}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={back} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={styles.backChevron}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>ประวัติการลา</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Filter chips + count */}
        <View style={[styles.filterRow, SHADOW as any]}>
          {FILTERS.map(f => {
            const isActive = f.key === active;
            const count = typeof counts[f.key] === 'number' ? counts[f.key] : undefined;
            return (
              <TouchableOpacity
                key={f.key}
                onPress={() => setActive(f.key)}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                activeOpacity={0.9}
              >
                <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                  {f.label}{typeof count === 'number' ? ` ${count}` : ''}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </LinearGradient>

      {/* SectionList */}
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderSectionHeader={({ section }) => (
          <View style={{ paddingHorizontal: 4, paddingTop: 8, paddingBottom: 4 }}>
            <Text style={{ fontWeight: '900', color: COLOR.dark }}>{section.title}</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <LeaveItemCard item={item} onPress={() => onOpenDetail?.(item.id)} />
        )}
        ListEmptyComponent={
          <View style={[styles.card, { alignItems: 'center' }]}>
            <Text style={styles.emptyTitle}>ยังไม่มีรายการลา</Text>
            <Text style={styles.emptySub}>เริ่มคำขอใหม่ได้ที่ปุ่มด้านล่างขวา</Text>
            <TouchableOpacity style={[styles.primary, SHADOW as any]} onPress={onCreateRequest} activeOpacity={0.9}>
              <Text style={styles.primaryTxt}>ขอลา</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Floating Action (สร้างคำขอ) */}
      <TouchableOpacity style={[styles.fab, SHADOW as any]} onPress={onCreateRequest} activeOpacity={0.9}>
        <Text style={styles.fabPlus}>＋</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default LeaveHistoryScreen;

/* ================= Sub Components ================= */

const LeaveItemCard: React.FC<{ item: LeaveItem; onPress?: () => void }> = ({ item, onPress }) => {
  const st = statusStyle[item.status];
  return (
    <TouchableOpacity
      style={[styles.card, { borderLeftWidth: 4, borderLeftColor: st.left }]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.cardHeadRow}>
        <Text style={styles.cardTitle}>{item.type}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text style={{ color: st.left, fontWeight: '900' }}>{st.icon}</Text>
          <View style={[styles.badge, { backgroundColor: st.badgeBg }]}>
            <Text style={[styles.badgeText, { color: st.badgeFg }]}>{st.label}</Text>
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
    <Text style={styles.metaText}>{k}</Text>
    <Text style={styles.valueText} numberOfLines={1}>{v}</Text>
  </View>
);

/* ================= Styles ================= */

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
