// screens/LeaveApprovals.tsx — Revamped UI (Laloei style+)
import { LinearGradient } from 'expo-linear-gradient';
import React, { memo, useCallback, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Platform,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useGetLeaveApprovals, useLeaveApprove } from '@/src/hooks/leave/useLeaveApprove';
import type { LeaveApproval } from '@/src/interface/leave-request';
import type { LeaveStatus } from '@/src/interface/leaveHistory';
import { RootStackParamList } from '@/src/navigation/RootStackParamList';
import { useTranslation } from 'react-i18next';
import ApprovalCard, { SegChip, StatPill } from '@/src/components/approvals/ApprovalCard';
import { resetToLogin } from '@/src/navigation/navigationRef';
import { useAuthStore } from '@/src/store/useAuthStore';

// ===== Design Tokens (fallback ถ้าไม่มี theme) =====
const COLOR = {
  backgroundColor: '#F6FAFF',
  card: '#FFFFFF',
  line: '#E6EDF5',
  text: '#0F172A',
  sub: '#6B7280',
  info: '#2EA8FF',
  primary: '#13C3A3',
  brand: '#13C3A3',
  brand2: '#2EA8FF',
  ok: '#10B981',
  warn: '#F59E0B',
  danger: '#EF4444',
};
const SHADOW = {
  shadowColor: '#0F172A',
  shadowOpacity: 0.06,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 6 },
  elevation: 4,
};

export type LeaveApprovalsProps = {
  data?: LeaveApproval[];
  onBack?: () => void;
  onOpenDetail?: (item: LeaveApproval) => void;
  onApprove?: (item: LeaveApproval) => void;
  onReject?: (item: LeaveApproval) => void;
};

/* -------------------------------- Main View ------------------------------- */
const LeaveApprovals: React.FC<LeaveApprovalsProps> = (props) => {
  const { onBack, onOpenDetail, onApprove, onReject } = props;
  const nav = useNavigation<NavigationProp<RootStackParamList>>();

  const profile = useAuthStore((s) => s.profile);
  if (!profile) {
    resetToLogin();
  }

  const { mutateAsync: approveLeave } = useLeaveApprove();
  const { t, i18n } = useTranslation();
  const lang: 'th' | 'en' = (i18n.language || 'th').startsWith('th') ? 'th' : 'en';

  const { data: dataAlls = [], isFetching, refetch } = useGetLeaveApprovals('all', { enabled: true });

  const handleApprove = onApprove ?? (async (item: LeaveApproval) => { await approveLeave({ id: item.id, approve: true }); });
  const handlerReject = onReject ?? (async (item: LeaveApproval) => { await approveLeave({ id: item.id, approve: false }); });
  const back = useCallback(() => { (onBack ?? nav.goBack)(); }, [nav, onBack]);

  const [q, setQ] = useState('');
  const [tab, setTab] = useState<'ALL' | LeaveStatus>('ALL');

  const counts = useMemo(() => {
    const total = dataAlls.length;
    const p = dataAlls.filter(x => x.status === 'PENDING').length;
    const a = dataAlls.filter(x => x.status === 'APPROVED').length;
    const r = dataAlls.filter(x => x.status === 'REJECTED').length;
    return { total, p, a, r };
  }, [dataAlls]);

  const filtered = useMemo(() => {
    const byTab = tab === 'ALL' ? dataAlls : dataAlls.filter(x => x.status === tab);
    const search = q.trim().toLowerCase();
    const byQ = search
      ? byTab.filter(x => (x.employeeName?.toLowerCase() ?? '').includes(search) || (x.team?.toLowerCase() ?? '').includes(search) || ((x.type ?? x.name_th ?? x.name_en)?.toLowerCase?.() ?? '').includes(search))
      : byTab;
    return byQ.map(x => ({ ...x, type: lang === 'th' ? x.name_th ?? x.name_en : x.name_en ?? x.name_th, requestedAt: x.createdAt || '' }));
  }, [dataAlls, tab, q, lang]);

  const confirmApprove = useCallback((item: LeaveApproval) => {
    Alert.alert(t('confirm.approve_title', 'ยืนยันการอนุมัติ'), `${t('confirm.approve_of', 'อนุมัติคำขอของ')} ${item.employeeName}?`, [
      { text: t('buttons.cancel', 'ยกเลิก'), style: 'cancel' },
      { text: t('buttons.approve', 'อนุมัติ'), style: 'default', onPress: () => handleApprove(item) },
    ]);
  }, [handleApprove, t]);

  const confirmReject = useCallback((item: LeaveApproval) => {
    Alert.alert(t('confirm.reject_title', 'ยืนยันการปฏิเสธ'), `${t('confirm.reject_of', 'ปฏิเสธคำขอของ')} ${item.employeeName}?`, [
      { text: t('buttons.cancel', 'ยกเลิก'), style: 'cancel' },
      { text: t('buttons.reject', 'ปฏิเสธ'), style: 'destructive', onPress: () => handlerReject(item) },
    ]);
  }, [handlerReject, t]);

  const labelAll = `${t('common.viewAll')} (${counts.total})`;
  const labelP = `${t('status.PENDING')} (${counts.p})`;
  const labelA = `${t('status.APPROVED')} (${counts.a})`;
  const labelR = `${t('status.REJECTED')} (${counts.r})`;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <LinearGradient colors={['#EAF7FB', '#FFFFFF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.header, SHADOW]}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={back} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.title}>ขออนุมัติลา</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Summary */}
        <View style={styles.counterRow}>
          <StatPill value={counts.p} label={t('status.PENDING')} tint={COLOR.warn} />
          <StatPill value={counts.a} label={t('status.APPROVED')} tint={COLOR.ok} />
          <StatPill value={counts.r} label={t('status.REJECTED')} tint={COLOR.danger} />
        </View>

        {/* Search */}
        <View style={[styles.searchBox, SHADOW]}>
          <Text style={styles.searchIcon}>🔎</Text>
          <TextInput value={q} onChangeText={setQ} placeholder={t('search.placeholder', 'ค้นหาชื่อ/ทีม/ประเภทลา')} placeholderTextColor={COLOR.sub} style={styles.searchInput} returnKeyType="search" />
        </View>

        {/* Segmented Tabs */}
        <View style={styles.segRow}>
          <SegChip label={labelAll} active={tab === 'ALL'} onPress={() => setTab('ALL')} />
          <SegChip label={labelP} active={tab === 'PENDING'} onPress={() => setTab('PENDING')} />
          <SegChip label={labelA} active={tab === 'APPROVED'} onPress={() => setTab('APPROVED')} />
          <SegChip label={labelR} active={tab === 'REJECTED'} onPress={() => setTab('REJECTED')} />
        </View>
      </LinearGradient>

      {/* List */}
      <FlatList
        refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} tintColor={COLOR.info} />}
        contentContainerStyle={styles.listContent}
        data={filtered as unknown as LeaveApproval[]}
        keyExtractor={(x) => String(x.id)}
        renderItem={({ item }) => (
          <ApprovalCard
            item={item as LeaveApproval}
            onPress={() => props.onOpenDetail?.(item as LeaveApproval)}
            onApprove={() => confirmApprove(item as LeaveApproval)}
            onReject={() => confirmReject(item as LeaveApproval)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyEmoji}>😌</Text>
            <Text style={styles.emptyText}>{t('dashboard.empty', 'ยังไม่มีรายการในสถานะนี้')}</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default LeaveApprovals;

/* --------------------------------- Styles -------------------------------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLOR.backgroundColor },

  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : (StatusBar.currentHeight ?? 0) + 8,
    paddingBottom: 14,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  backText: { fontSize: 28, color: COLOR.text, paddingHorizontal: 4, lineHeight: 28 },
  title: { fontSize: 20, fontWeight: '900', color: COLOR.text },

  counterRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  statPill: { flex: 1, marginHorizontal: 4, paddingVertical: 10, borderRadius: 14, borderWidth: 1, alignItems: 'center' },
  statNum: { fontSize: 18, fontWeight: '900' },
  statLabel: { fontSize: 12, color: COLOR.sub, marginTop: 2, fontWeight: '800' },

  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLOR.card, borderRadius: 14, borderWidth: 1, borderColor: COLOR.line, paddingHorizontal: 12, height: 46, marginBottom: 10 },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, color: COLOR.text, fontWeight: '700' },

  segRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 2 },
  segChip: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 999, backgroundColor: '#fff', borderWidth: 1, borderColor: COLOR.line },
  segChipActive: { backgroundColor: '#E7FFF6', borderColor: COLOR.brand },
  segChipText: { color: COLOR.text, fontWeight: '700', fontSize: 12.5 },
  segChipTextActive: { color: COLOR.brand },

  listContent: { padding: 16, paddingBottom: 22 },

  card: { backgroundColor: COLOR.card, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: COLOR.line, marginBottom: 12, overflow: 'hidden' },
  ribbon: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, borderTopLeftRadius: 16, borderBottomLeftRadius: 16 },

  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  avatar: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 10, backgroundColor: '#E9F4FF' },
  avatarText: { fontWeight: '900', fontSize: 18, color: COLOR.info },
  empName: { fontWeight: '900', color: COLOR.text },
  empTeam: { color: COLOR.sub, fontSize: 12, marginTop: 2, fontWeight: '700' },

  badge: { borderWidth: 1, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  badgeText: { fontSize: 12, fontWeight: '900' },

  divider: { height: 1, backgroundColor: COLOR.line, marginVertical: 10 },

  row: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  rowIcon: { width: 18, textAlign: 'center' },
  rowLabel: { color: COLOR.sub, fontSize: 12, minWidth: 84, fontWeight: '800' },
  rowValue: { color: COLOR.text, fontWeight: '700', flex: 1 },

  actionRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 12 },
  btn: { borderRadius: 12, overflow: 'hidden' },
  btnApprove: { },
  btnApproveGrad: { paddingVertical: 12, paddingHorizontal: 18, alignItems: 'center' },
  btnApproveText: { color: '#fff', fontWeight: '900' },
  btnReject: { backgroundColor: '#FFE9E9', borderWidth: 1, borderColor: COLOR.danger, paddingVertical: 12, paddingHorizontal: 18 },
  btnRejectText: { color: COLOR.danger, fontWeight: '900' },

  emptyBox: { alignItems: 'center', marginTop: 40 },
  emptyEmoji: { fontSize: 24, marginBottom: 6 },
  emptyText: { color: COLOR.sub, fontWeight: '800' },
});
