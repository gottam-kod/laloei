import React, { memo, useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
// ถ้ามีธีมกลางอยู่แล้ว ใช้อันนี้
import { COLOR as THEME_COLOR, SHADOW as THEME_SHADOW } from '../theme/theme';
import useSafeGoBack from '../navigation/useSafeGoBack';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/RootStackParamList';

/** ===== Design Tokens (fallback ถ้าไม่มี theme) ===== */
const COLOR = THEME_COLOR ?? {
  bg: '#F6F9FC',
  card: '#FFFFFF',
  line: '#E7EEF4',
  text: '#1F2A37',
  dim: '#6B7280',
  brand: '#1AA6B7',
  brandSoft: '#E6F7FA',
  ok: '#22C55E',
  warn: '#F59E0B',
  danger: '#EF4444',
};
const SHADOW = THEME_SHADOW ?? {
  shadowColor: '#000',
  shadowOpacity: 0.06,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 6 },
  elevation: 6,
};

/** ===== Types ===== */
export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type LeaveRequest = {
  id: string;
  employeeName: string;
  team?: string;
  type: 'ลาพักร้อน' | 'ลาป่วย' | 'ลากิจ' | string;
  dateFrom: string; // ISO
  dateTo: string;   // ISO
  days: number;
  reason?: string;
  requestedAt: string; // ISO
  status: LeaveStatus;
};

export type LeaveApprovalsProps = {
  data?: LeaveRequest[]; // ถ้าไม่ส่ง จะใช้ mock ภายใน
  onBack?: () => void;
  onOpenDetail?: (item: LeaveRequest) => void;
  onApprove?: (item: LeaveRequest) => void;
  onReject?: (item: LeaveRequest) => void;
};

/** ===== Utils ===== */
const thMonths = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
const toThaiDate = (iso: string) => {
  const d = new Date(iso);
  const dd = d.getDate();
  const mm = thMonths[d.getMonth()];
  const yyyy = d.getFullYear();
  return `${dd} ${mm} ${yyyy}`;
};
const statusColor = (s: LeaveStatus) =>
  s === 'APPROVED' ? COLOR.ok : s === 'REJECTED' ? COLOR.danger : COLOR.warn;

/** ===== Mock (ถ้าไม่ส่ง data เข้ามา) ===== */
const MOCK: LeaveRequest[] = [
  {
    id: '1',
    employeeName: 'กิตติ ตันสุข',
    team: 'ทีมปฏิบัติการ',
    type: 'ลาป่วย',
    dateFrom: '2025-09-14',
    dateTo: '2025-09-14',
    days: 1,
    reason: 'เป็นไข้',
    requestedAt: '2025-09-14T09:20:00',
    status: 'PENDING',
  },
  {
    id: '2',
    employeeName: 'รัช พงศกร',
    team: 'พัฒนาแอพ',
    type: 'ลากิจ',
    dateFrom: '2025-09-13',
    dateTo: '2025-09-13',
    days: 0.5,
    reason: 'ติดต่อหน่วยงาน',
    requestedAt: '2025-09-13T11:05:00',
    status: 'PENDING',
  },
  {
    id: '3',
    employeeName: 'นภา พิชญา',
    team: 'บัญชี',
    type: 'ลาพักร้อน',
    dateFrom: '2025-09-10',
    dateTo: '2025-09-11',
    days: 2,
    reason: 'กลับต่างจังหวัด',
    requestedAt: '2025-09-08T16:45:00',
    status: 'APPROVED',
  },
  {
    id: '4',
    employeeName: 'มินตรา ศรี',
    team: 'สนับสนุน',
    type: 'ลาป่วย',
    dateFrom: '2025-09-12',
    dateTo: '2025-09-12',
    days: 1,
    requestedAt: '2025-09-12T08:10:00',
    status: 'REJECTED',
  },
];

/** ===== Sub Components ===== */
const Chip = memo(
  ({
    label,
    active,
    onPress,
  }: {
    label: string;
    active?: boolean;
    onPress?: () => void;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[
        styles.chip,
        active && { backgroundColor: COLOR.brand, borderColor: COLOR.brand },
      ]}
    >
      <Text style={[styles.chipText, active && { color: '#fff', fontWeight: '800' }]}>{label}</Text>
    </TouchableOpacity>
  )
);

const ApprovalCard = memo(
  ({
    item,
    onPress,
    onApprove,
    onReject,
  }: {
    item: LeaveRequest;
    onPress?: () => void;
    onApprove?: () => void;
    onReject?: () => void;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={[styles.card, SHADOW()]}
    >
      <View style={styles.cardHeaderRow}>
        <View style={[styles.avatar, { backgroundColor: '#E7F7FA' }]}>
          <Text style={styles.avatarText}>
            {item.employeeName.substring(0, 1)}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.empName} numberOfLines={1}>
            {item.employeeName}
          </Text>
          <Text style={styles.empTeam} numberOfLines={1}>
            {item.team || '—'}
          </Text>
        </View>
        <View style={[styles.badge, { backgroundColor: statusColor(item.status) + '22', borderColor: statusColor(item.status) }]}>
          <Text style={[styles.badgeText, { color: statusColor(item.status) }]}>
            {item.status === 'PENDING' ? 'รออนุมัติ' : item.status === 'APPROVED' ? 'อนุมัติแล้ว' : 'ปฏิเสธแล้ว'}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.label}>ประเภท</Text>
        <Text style={styles.value}>{item.type}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>ช่วงวันลา</Text>
        <Text style={styles.value}>
          {toThaiDate(item.dateFrom)} - {toThaiDate(item.dateTo)} ({item.days} วัน)
        </Text>
      </View>
      {!!item.reason && (
        <View style={styles.row}>
          <Text style={styles.label}>เหตุผล</Text>
          <Text style={styles.value} numberOfLines={2}>
            {item.reason}
          </Text>
        </View>
      )}
      <View style={styles.row}>
        <Text style={styles.label}>ยื่นคำขอ</Text>
        <Text style={styles.value}>{toThaiDate(item.requestedAt)}</Text>
      </View>

      {item.status === 'PENDING' && (
        <View style={styles.actionRow}>
          <TouchableOpacity style={[styles.btn, styles.btnReject]} onPress={onReject}>
            <Text style={styles.btnRejectText}>ปฏิเสธ</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.btnApprove]} onPress={onApprove}>
            <Text style={styles.btnApproveText}>อนุมัติ</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  )
);

/** ===== Main Screen ===== */
const LeaveApprovals: React.FC<LeaveApprovalsProps> = ({
  data = MOCK,
  onBack,
  onOpenDetail,
  onApprove,
  onReject,
}) => {
  const [q, setQ] = useState('');
  const [tab, setTab] = useState<'ALL' | LeaveStatus>('ALL');
      const nav = useNavigation<NavigationProp<RootStackParamList>>();
  const safeGoBack = useSafeGoBack(nav);


  const counts = useMemo(() => {
    const total = data.length;
    const p = data.filter((x) => x.status === 'PENDING').length;
    const a = data.filter((x) => x.status === 'APPROVED').length;
    const r = data.filter((x) => x.status === 'REJECTED').length;
    return { total, p, a, r };
  }, [data]);

  const filtered = useMemo(() => {
    const byTab =
      tab === 'ALL' ? data : data.filter((x) => x.status === tab);
    const byQ = q.trim()
      ? byTab.filter(
          (x) =>
            x.employeeName.toLowerCase().includes(q.toLowerCase()) ||
            x.type.toLowerCase().includes(q.toLowerCase()) ||
            (x.team ?? '').toLowerCase().includes(q.toLowerCase())
        )
      : byTab;
    return byQ;
  }, [data, tab, q]);

  const confirmApprove = useCallback(
    (item: LeaveRequest) => {
      Alert.alert('ยืนยันการอนุมัติ', `อนุมัติคำขอของ ${item.employeeName}?`, [
        { text: 'ยกเลิก', style: 'cancel' },
        {
          text: 'อนุมัติ',
          style: 'default',
          onPress: () => onApprove?.(item),
        },
      ]);
    },
    [onApprove]
  );

  const confirmReject = useCallback(
    (item: LeaveRequest) => {
      Alert.alert('ยืนยันการปฏิเสธ', `ปฏิเสธคำขอของ ${item.employeeName}?`, [
        { text: 'ยกเลิก', style: 'cancel' },
        {
          text: 'ปฏิเสธ',
          style: 'destructive',
          onPress: () => onReject?.(item),
        },
      ]);
    },
    [onReject]
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient
        colors={['#EAF7FB', '#FFFFFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={onBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.backText} onPress={() => safeGoBack}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.title}>ขออนุมัติลา</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Summary counters */}
        <View style={styles.counterRow}>
          <View style={styles.counterBox}>
            <Text style={styles.counterNum}>{counts.p}</Text>
            <Text style={styles.counterLabel}>รออนุมัติ</Text>
          </View>
          <View style={styles.counterBox}>
            <Text style={styles.counterNum}>{counts.a}</Text>
            <Text style={styles.counterLabel}>อนุมัติแล้ว</Text>
          </View>
          <View style={styles.counterBox}>
            <Text style={styles.counterNum}>{counts.r}</Text>
            <Text style={styles.counterLabel}>ปฏิเสธแล้ว</Text>
          </View>
        </View>

        {/* Search */}
        <View style={[styles.searchBox, { ...SHADOW }]}>
          <Text style={styles.searchIcon}>🔎</Text>
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder="ค้นหาชื่อ/ทีม/ประเภทลา"
            placeholderTextColor={COLOR.dim}
            style={styles.searchInput}
            returnKeyType="search"
          />
        </View>

        {/* Tabs */}
        <View style={styles.tabRow}>
          <Chip label={`ทั้งหมด (${counts.total})`} active={tab === 'ALL'} onPress={() => setTab('ALL')} />
          <Chip label={`รออนุมัติ (${counts.p})`} active={tab === 'PENDING'} onPress={() => setTab('PENDING')} />
          <Chip label={`อนุมัติแล้ว (${counts.a})`} active={tab === 'APPROVED'} onPress={() => setTab('APPROVED')} />
          <Chip label={`ปฏิเสธแล้ว (${counts.r})`} active={tab === 'REJECTED'} onPress={() => setTab('REJECTED')} />
        </View>
      </LinearGradient>

      <FlatList
        contentContainerStyle={styles.listContent}
        data={filtered}
        keyExtractor={(x) => x.id}
        renderItem={({ item }) => (
          <ApprovalCard
            item={item}
            onPress={() => onOpenDetail?.(item)}
            onApprove={() => confirmApprove(item)}
            onReject={() => confirmReject(item)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyEmoji}>😌</Text>
            <Text style={styles.emptyText}>ไม่มีรายการในมุมมองนี้</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default LeaveApprovals;

/** ===== Styles ===== */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLOR.bg },

  header: {
    paddingTop: Platform.OS === 'ios' ? 18 : (StatusBar.currentHeight ?? 0) + 8,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  backText: { fontSize: 28, color: COLOR.text, paddingHorizontal: 4 },
  title: { fontSize: 18, fontWeight: '800', color: COLOR.text },

  counterRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  counterBox: { alignItems: 'center', flex: 1, paddingVertical: 6, marginHorizontal: 4, backgroundColor: COLOR.brandSoft, borderRadius: 12 },
  counterNum: { fontSize: 18, fontWeight: '900', color: COLOR.brand },
  counterLabel: { fontSize: 12, color: COLOR.dim, marginTop: 2 },

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLOR.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLOR.line,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 10,
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, color: COLOR.text },

  tabRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },

  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: COLOR.line,
  },
  chipText: { color: COLOR.text, fontWeight: '700', fontSize: 12.5 },

  listContent: { padding: 16, paddingBottom: 22 },

  card: {
    backgroundColor: COLOR.card,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLOR.line,
    marginBottom: 12,
  },

  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: { fontWeight: '900', fontSize: 16, color: COLOR.brand },
  empName: { fontWeight: '800', color: COLOR.text },
  empTeam: { color: COLOR.dim, fontSize: 12, marginTop: 2 },

  badge: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeText: { fontSize: 12, fontWeight: '800' },

  divider: { height: 1, backgroundColor: COLOR.line, marginVertical: 10 },

  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  label: { color: COLOR.dim, fontSize: 12 },
  value: { color: COLOR.text, fontWeight: '700' },

  actionRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 10 },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  btnApprove: { backgroundColor: COLOR.ok, borderColor: COLOR.ok },
  btnApproveText: { color: '#fff', fontWeight: '800' },
  btnReject: { backgroundColor: '#FFE9E9', borderColor: COLOR.danger },
  btnRejectText: { color: COLOR.danger, fontWeight: '800' },

  emptyBox: { alignItems: 'center', marginTop: 40 },
  emptyEmoji: { fontSize: 24, marginBottom: 6 },
  emptyText: { color: COLOR.dim },
});
