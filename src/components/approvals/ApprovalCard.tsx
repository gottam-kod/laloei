// src/components/approvals/ApprovalCard.tsx
import React, { memo } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';

import { COLOR } from '@/src/theme/token';
import { LeaveApproval } from '@/src/interface/leave-request';
import { LeaveStatus } from '@/src/interface/leaveHistory';

/* ------------------------------ Helpers ------------------------------ */
const SHADOW = Platform.select({
    ios: {
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
    },
    android: {
        elevation: 4,
    },
});

const statusColor = (s: LeaveStatus) =>
    s === 'APPROVED' ? COLOR.ok : s === 'REJECTED' ? COLOR.danger : COLOR.warn;

const statusEmoji = (s: LeaveStatus) =>
    s === 'APPROVED' ? '✅' : s === 'REJECTED' ? '✖️' : '⏳';

/* ----------------------------- Sub Components ---------------------------- */
export const SegChip = memo(
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
            activeOpacity={0.9}
            style={[S.segChip, active && S.segChipActive]}
        >
            <Text style={[S.segChipText, active && S.segChipTextActive]}>{label}</Text>
        </TouchableOpacity>
    )
);

export const StatPill = ({
    value,
    label,
    tint,
}: {
    value: number;
    label: string;
    tint: string;
}) => (
    <View
        style={[
            S.statPill,
            { backgroundColor: `${tint}1A`, borderColor: `${tint}55` },
        ]}
    >
        <Text style={[S.statNum, { color: tint }]}>{value}</Text>
        <Text style={S.statLabel}>{label}</Text>
    </View>
);

export const Row = ({
    icon,
    label,
    value,
}: {
    icon: string;
    label: string;
    value: string;
}) => (
    <View style={S.row}>
        <Text style={S.rowIcon}>{icon}</Text>
        <Text style={S.rowLabel}>{label}</Text>
        <Text style={S.rowValue} numberOfLines={2}>
            {value}
        </Text>
    </View>
);

/* ------------------------------- Card -------------------------------- */
export const ApprovalCard = memo(
    ({
        item,
        onPress,
        onApprove,
        onReject,
    }: {
        item: LeaveApproval;
        onPress?: () => void;
        onApprove?: () => void;
        onReject?: () => void;
    }) => {
        const { t } = useTranslation();
        const sc = statusColor(item.status);

        return (
            <TouchableOpacity
                onPress={onPress}
                activeOpacity={0.95}
                style={[S.card, SHADOW as any]}
            >
                {/* Ribbon */}
                <View style={[S.ribbonLeft, { backgroundColor: sc }]} />

                {/* Header */}
                <View style={S.cardHeaderRow}>
                    <View style={[S.avatar, { backgroundColor: '#E8F7FF' }]}>
                        <Text style={S.avatarText}>
                            {(item.employeeName || '?').substring(0, 1)}
                        </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={S.empName} numberOfLines={1}>
                            {item.employeeName}
                        </Text>
                        <Text style={S.empTeam} numberOfLines={1}>
                            {item.team || '—'}
                        </Text>
                    </View>
                    <View
                        style={[
                            S.badge,
                            { borderColor: sc, backgroundColor: `${sc}14` },
                        ]}
                    >
                        <Text style={[S.badgeText, { color: sc }]}>
                            {statusEmoji(item.status)} {t(`status.${item.status}`)}
                        </Text>
                    </View>
                </View>

                <View style={S.divider} />

                <Row icon="🏷️" label={t('common.type')} value={String(item.type)} />
                <Row icon="📅" label={t('leave.dateRange')} value={item.range} />
                {!!item.reason && (
                    <Row icon="📝" label={t('common.reason')} value={item.reason} />
                )}
                <Row
                    icon="⏱️"
                    label={t('common.submittedAt')}
                    value={item.requestedAt || '-'}
                />

                {item.status === 'PENDING' && (
                    <View style={S.actionRow}>
                        <TouchableOpacity style={[S.btn, S.btnReject]} onPress={onReject}>
                            <Text style={S.btnRejectText}>{t('buttons.reject')}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[S.btn, S.btnApprove]} onPress={onApprove}>
                            <LinearGradient
                                colors={[COLOR.primary, COLOR.primary]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={S.btnApproveGrad}
                            >
                                <Text style={S.btnApproveText}>{t('buttons.approve')}</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                )}
            </TouchableOpacity>
        );
    }
);

/* -------------------------------- Style -------------------------------- */
const S = StyleSheet.create({
    card: {
        borderRadius: 16,
        backgroundColor: '#fff',
        padding: 14,
        overflow: 'hidden',
        marginVertical: 8,
    },
    ribbon: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: 6,
        width: '100%',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    ribbonLeft: {
         position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  width: 6,
  borderTopLeftRadius: 26,
  borderBottomLeftRadius: 26,
    },
    cardHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0F172A',
    },
    empName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0F172A',
    },
    empTeam: {
        fontSize: 12,
        color: '#64748B',
        marginTop: 2,
    },
    badge: {
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 999,
        borderWidth: 1,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '700',
    },
    divider: {
        height: 1,
        backgroundColor: '#E6EDF5',
        marginVertical: 12,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
        marginBottom: 8,
    },
    rowIcon: {
        width: 22,
        textAlign: 'center',
        fontSize: 14,
    },
    rowLabel: {
        width: 96,
        fontSize: 13,
        color: '#475569',
    },
    rowValue: {
        flex: 1,
        fontSize: 13,
        color: '#0F172A',
    },
    actionRow: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 10,
    },
    btn: {
        flex: 1,
        height: 44,
        borderRadius: 12,
        overflow: 'hidden',
    },
    btnReject: {
        borderWidth: 1,
        borderColor: COLOR.danger,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    btnRejectText: {
        color: COLOR.danger,
        fontWeight: '700',
    },
    btnApprove: {
        overflow: 'hidden',
    },
    btnApproveGrad: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnApproveText: {
        color: '#fff',
        fontWeight: '700',
    },

    /* SegChip */
    segChip: {
        height: 36,
        paddingHorizontal: 14,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: '#CBD5E1',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    segChipActive: {
        borderColor: COLOR.brand,
        backgroundColor: '#EEF6FF',
    },
    segChipText: {
        fontSize: 13,
        color: '#0F172A',
        fontWeight: '600',
    },
    segChipTextActive: {
        color: COLOR.brand,
    },

    /* StatPill */
    statPill: {
        minWidth: 88,
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 12,
        borderWidth: 1,
        alignItems: 'center',
    },
    statNum: {
        fontSize: 18,
        fontWeight: '800',
    },
    statLabel: {
        fontSize: 12,
        color: '#475569',
        marginTop: 2,
    },
});

export default ApprovalCard;
