import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLOR, FONT, SP } from '@/src/theme/token';
import { SectionTitle } from '@/src/components';
import { useTranslation } from 'react-i18next';
import { Badge, Ghost, Primary } from './Badge';
import { daysUntil } from '@/src/utails/calendar';

type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
type RoleKind = 'EMP' | 'MANAGER' | 'HRADMIN' | 'OWNER';

export type SmartLeave = {
  id: string;
  status: LeaveStatus;
  startDate: string;         // YYYY-MM-DD
  endDate: string;           // YYYY-MM-DD
  createdAt: string;
  createdAtISO?: string;
  range: string;
  note?: string;
  approverName?: string;
  rejectReason?: string;
};

type Props = {
  role: RoleKind;
  latest?: SmartLeave;          // คำขอล่าสุดของ “ฉัน”
  approvalsCount?: number;      // ถ้ามีสิทธิ์อนุมัติ ใส่จำนวนคำขอที่รออยู่
  onCreate?: () => void;
  onOpenDetail?: (id: string) => void;
  onOpenApprovals?: () => void;
  onOpenCalendar?: (leave: SmartLeave) => void;
  onResubmit?: (from: SmartLeave) => void;
  onCancel?: (id: string) => void;
  style?: any;
};

export default function LeaveSmartCard({
  role, latest, approvalsCount = 0,
  onCreate, onOpenDetail, onOpenApprovals, onOpenCalendar, onResubmit, onCancel,
  style,
}: Props) {

    const { t } = useTranslation();

  const hasApprovalPower = role === 'MANAGER' || role === 'HRADMIN' || role === 'OWNER';

  // เลือก “สิ่งที่ควรทำถัดไป”
  const view = useMemo(() => {
    if (hasApprovalPower && approvalsCount > 0) {
      return 'APPROVAL_CTA';
    }
    if (!latest) {
      return 'EMPTY';
    }
    if (latest.status === 'PENDING') {
      return 'MY_PENDING';
    }
    if (latest.status === 'APPROVED') {
      const d = daysUntil(latest.startDate);
      if (d >= 0) return 'MY_APPROVED_UPCOMING';
      return 'MY_APPROVED_PAST';
    }
    if (latest.status === 'REJECTED' || latest.status === 'CANCELLED') {
      return 'MY_REJECTED_OR_CANCELLED';
    }
    return 'EMPTY';
  }, [latest, approvalsCount, hasApprovalPower]);

  const Line = ({ label, value }: { label: string; value?: string }) => (
    <View style={styles.line}>
      <Text style={styles.lineLabel}>{label}</Text>
      <Text style={styles.lineValue}>{value ?? '-'}</Text>
    </View>
  );

  // Render
  return (
    <View style={[styles.card, style]}>
      {view === 'APPROVAL_CTA' && (
        <>
          <SectionTitle title={t('dashboard.sections.approvalRequests')} icon="time-outline"></SectionTitle>
          <Text style={styles.desc}>{t('dashboard.sections.newLeaveRequests', { count: approvalsCount })}</Text>
          <View style={styles.actionsRow}>
            <Primary onPress={onOpenApprovals} icon="checkbox-outline" text={t('dashboard.sections.goToApproval')} />
            <Ghost onPress={onOpenDetail ? () => onOpenDetail(latest?.id ?? '') : undefined} icon="list-outline" text={t('dashboard.sections.viewAll')} />
          </View>
        </>
      )}

      {view === 'EMPTY' && (
        <>
          <SectionTitle title={t('dashboard.sections.noRecentLeaveRequests')} icon="time-outline"></SectionTitle>
          <Text style={styles.desc}>{t('dashboard.sections.textstartleave')}</Text>
          <View style={styles.actionsRow}>
            <Primary onPress={onCreate} icon="pencil" text={t('buttons.requestLeave')} />
            <Ghost onPress={onOpenApprovals} icon="calendar-outline" text={t('dashboard.sections.teamCalendar')} />
          </View>
        </>
      )}

      {view === 'MY_PENDING' && latest && (
        <>
          <Badge status={latest.status} />
          <SectionTitle title={t('dashboard.sections.myPendingRequests')} icon="time-outline"></SectionTitle>
          <Line label={t('leave.dateRange')} value={`${latest.range}`} />
          <Line label={t('common.details')} value={latest.note ?? '—'} />
          <Line label={t('common.approver')} value={latest.approverName ?? '—'} />
          <View style={styles.actionsRow}>
            <Primary onPress={onOpenDetail ? () => onOpenDetail(latest.id) : undefined} icon="eye-outline" text={t('buttons.viewDetails')} />
            <Ghost onPress={onCancel ? () => onCancel(latest.id) : undefined} icon="close-outline" text={t('buttons.cancel')} />
          </View>
        </>
      )}

      {view === 'MY_APPROVED_UPCOMING' && latest && (
        <>
          <Badge status={latest.status} />
          <SectionTitle title={`${t('status.APPROVED')} — ${t('common.startsIn')} ${Math.max(0, daysUntil(latest.startDate))} ${t('common.day')}`} icon="time-outline"></SectionTitle>
          <Line label={t('common.from')} value={`${latest.startDate}`} />
          <Line label={t('common.to')} value={`${latest.endDate}`} />
          <Line label={t('common.reason')} value={latest.note ?? '—'} />
          <View style={styles.actionsRow}>
            <Primary onPress={onOpenCalendar ? () => onOpenCalendar(latest) : undefined} icon="calendar-outline" text={t('buttons.addToCalendar')} />
            <Ghost onPress={onOpenDetail ? () => onOpenDetail(latest.id) : undefined} icon="eye-outline" text={t('buttons.viewDetails')} />
          </View>
        </>
      )}

      {view === 'MY_APPROVED_PAST' && latest && (
        <>
          <Badge status={latest.status} />
          <SectionTitle title={t('dashboard.sections.pastLeaves')} icon="time-outline"></SectionTitle>
          <Line label={t('leave.dateRange')} value={`${latest.createdAt}`} />
          <Line label={t('common.details')} value={latest.note ?? '—'} />
          <View style={styles.actionsRow}>
            <Ghost onPress={onCreate} icon="pencil" text={t('common.newRequest')} />
            <Ghost onPress={onOpenDetail ? () => onOpenDetail(latest.id) : undefined} icon="list-outline" text={t('dashboard.sections.history')} />
          </View>
        </>
      )}

      {view === 'MY_REJECTED_OR_CANCELLED' && latest && (
        <>
          <Badge status={latest.status} />
          <SectionTitle title={latest.status === 'REJECTED' ? t('common.rejectedRequest') : t('common.cancelledRequest')} icon="time-outline"></SectionTitle>
          {latest.rejectReason ? <Line label={t('common.reason')} value={latest.rejectReason} /> : null}
          <View style={styles.actionsRow}>
            <Primary onPress={onResubmit ? () => onResubmit(latest) : onCreate} icon="repeat-outline" text={t('common.resubmit')} />
            <Ghost onPress={onOpenDetail ? () => onOpenDetail(latest.id) : undefined} icon="eye-outline" text={t('buttons.viewDetails')} />
          </View>
        </>
      )}
    </View>
  );
}

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    gap: 6,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 2,
  },
  title: { fontFamily: FONT.bodyBold, fontSize: 16, color: '#0F172A' },
  desc: { fontFamily: FONT.body, fontSize: 13, color: '#475569' },
  line: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  lineLabel: { fontFamily: FONT.body, fontSize: 13, color: '#64748B' },
  lineValue: { fontFamily: FONT.bodyMedium, fontSize: 14, color: '#0F172A', marginLeft: 8, flexShrink: 1, textAlign: 'right' },

  badge: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  badgeText: { fontFamily: FONT.body, fontSize: 13, marginLeft: 6 },

  actionsRow: { flexDirection: 'row', gap: 10, marginTop: 10 },
  btnPrimary: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLOR.primary, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  btnPrimaryText: { color: '#fff', fontFamily: FONT.bodyMedium, fontSize: 14 },
  btnGhost: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  btnGhostText: { color: COLOR.primary, fontFamily: FONT.bodyMedium, fontSize: 14 },
});
