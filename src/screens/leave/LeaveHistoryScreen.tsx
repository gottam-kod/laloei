import { LeaveItemCard } from '@/src/components/ItemCard';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useMemo, useState } from 'react';
import {
  Platform,
  RefreshControl,
  SectionList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackgroundFX } from '../../components/Background';
import { useGetLeaveHistory } from '../../hooks/leave/useLeaveHistory';
import { LeaveItem, LeaveStatus } from '../../interface/leaveHistory';
import { COLOR, FONT } from '../../theme/token';
import { useAuthStore } from '@/src/store/useAuthStore';
import { resetToLogin } from '@/src/navigation/navigationRef';


type Props = {
  onBack?: () => void;
  onCreateRequest?: () => void;
  onOpenDetail?: (id: string) => void;
};

// ====== FILTERS ======
const FILTERS: Array<{ key: 'ALL' | LeaveStatus; label: string }> = [
  { key: 'ALL', label: 'ทั้งหมด' },
  { key: 'PENDING', label: 'รออนุมัติ' },
  { key: 'APPROVED', label: 'อนุมัติแล้ว' },
  { key: 'REJECTED', label: 'ไม่อนุมัติ' },
  { key: 'CANCELLED', label: 'ยกเลิก' },
];

// ====== HELPERS ======
// const SHADOW = Platform.select({
//   ios: { shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 6 } },
//   android: { elevation: 4 },
// });

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



// ===================================================

const LeaveHistoryScreen: React.FC<Props> = ({ onBack, onCreateRequest, onOpenDetail }) => {
  const nav = useNavigation();
    const profile = useAuthStore((s) => s.profile);
    if (!profile) {
      resetToLogin();
    }
  const [active, setActive] = useState<(typeof FILTERS)[number]['key']>('ALL');
  const [refreshing, setRefreshing] = useState(false);
  const lang = 'th'; // TODO: ดึงจาก store หรือ context


  // ทั้งหมด (จริงควรมาจาก API)
  const { data: dataAll = [] } = useGetLeaveHistory('leave-history', { enabled: true });

  const all = dataAll.map((d) => ({
    ...d,
    type: lang === 'th' ? d.name_th || d.name_en || 'ไม่ระบุ' : d.name_en || d.name_th || 'ไม่ระบุ',
    createdAtISO: d.createdAt
  })) as LeaveItem[];


  // นับจำนวนต่อสถานะ (ใช้ all เพื่อบอกภาพรวม)
  const counts = useMemo(() => {
    const acc: Record<'ALL' | LeaveStatus, number> = { ALL: all.length, APPROVED: 0, PENDING: 0, REJECTED: 0, CANCELLED: 0 };
    all.forEach(i => { acc[i.status] += 1; });
    return acc;
  }, [all]);

  // กรองตามฟิลเตอร์ที่เลือก
  const filtered = useMemo(() => {
    if (active === 'ALL') return all;
    return all.filter(i => i.status === active);
  }, [all, active]);

  // จัดกลุ่มเป็นเดือนสำหรับ SectionList
  const sections = useMemo(() => {
    if (filtered.length === 0) return [];
    const map = new Map<string, LeaveItem[]>();
    filtered.forEach(it => {
      const k = toMonthKey(ensureISO(it)); // YYYY-MM
      map.set(k, [...(map.get(k) || []), it]);
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F7FAFD' }} edges={['left', 'right']}>
      {/* <View style={StyleSheet.absoluteFill} pointerEvents="none"> */}
        <BackgroundFX />
      {/* </View> */}
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
          <Text style={[styles.headerTitle, {fontFamily: FONT.headingBold}]}>ประวัติการลา</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Filter chips + count */}
        <View style={[styles.filterRow]}>
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
                <Text style={[styles.filterText, isActive && styles.filterTextActive, { fontFamily: FONT.body }]}>
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
            <Text style={{ fontWeight: '900', color: COLOR.dark, fontFamily: FONT.bodyBold }}>{section.title}</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <LeaveItemCard item={item} onPress={() => onOpenDetail?.(item.id)} />
        )}
        ListEmptyComponent={
          <View style={[styles.card, { alignItems: 'center' }]}>
            <Text style={[styles.emptyTitle, { fontFamily: FONT.bodyBold }]}>ยังไม่มีรายการลา</Text>
            <Text style={[styles.emptySub, { fontFamily: FONT.body }]}>เริ่มคำขอใหม่ได้ที่ปุ่มด้านล่างขวา</Text>
            <TouchableOpacity style={[styles.primary]} onPress={onCreateRequest} activeOpacity={0.9}>
              <Text style={[styles.primaryTxt, { fontFamily: FONT.bodyBold }]}>ขอลา</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Floating Action (สร้างคำขอ) */}
      <TouchableOpacity style={[styles.fab]} onPress={onCreateRequest} activeOpacity={0.9}>
        <Text style={styles.fabPlus}>＋</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default LeaveHistoryScreen;

/* ================= Sub Components ================= */


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
