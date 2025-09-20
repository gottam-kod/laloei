import React, { memo, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform, StatusBar } from 'react-native';
import { COLOR } from '../theme/theme';
import { useNavigation, NavigationProp, CommonActions } from '@react-navigation/native';
import { HomeStackParamList, MainTabParamList, RootStackParamList } from '../navigation/RootStackParamList';
import { useTranslation } from 'react-i18next';
import { Tone } from '../interface/tone';
import StatCard from '../components/StatCard';


const SHADOW = {
    base: {
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 6,
    },
} as const;

export type DashboardProps = {
    onRequestLeave?: () => void;
    onOpenHistory?: () => void;
    onOpenApprovals?: () => void;
    onOpenTeam?: () => void;
    onOpenSummary?: () => void;
    onOpenNews?: () => void;
    onBack?: () => void;
    goToLogin?: () => void;
};


const toneColor = (t: Tone) =>
    t === 'ok' ? COLOR.ok : t === 'warn' ? COLOR.warn : t === 'danger' ? COLOR.danger : COLOR.brand;

/* ===== Helpers ===== */
type ProgressProps = { value: number; tone?: Tone };
const Progress = memo(({ value, tone = 'brand' }: ProgressProps) => {
    const widthPct = Math.min(100, Math.max(0, value));
    return (
        <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${widthPct}%`, backgroundColor: toneColor(tone) }]} />
        </View>
    );
});

type RowItemProps = { title: string; meta: string; statusColor?: string; onPress?: () => void };
const RowItem = memo(({ title, meta, statusColor = COLOR.dim, onPress }: RowItemProps) => (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.rowItem}>
        <View style={[styles.dot, { backgroundColor: statusColor }]} />
        <View style={{ flex: 1 }}>
            <Text numberOfLines={1} style={styles.rowTitle}>{title}</Text>
            <Text style={styles.rowMeta}>{meta}</Text>
        </View>
        <Text style={styles.chev}>›</Text>
    </TouchableOpacity>
));

/* ===== Screen ===== */
const DashboardLaloei: React.FC<DashboardProps> = ({
    onOpenHistory,
    onOpenApprovals,
    onOpenSummary,
    onOpenNews,
    goToLogin,
    onRequestLeave,
    onOpenTeam
}) => {
    const { t } = useTranslation();

    const nav = useNavigation<NavigationProp<MainTabParamList>>();

    const openHistory = onOpenHistory || (() => toHome('Requests'));
    const openApprovals = onOpenApprovals || (() => toHome('ApprovalList'));
    const openLogin = goToLogin || (() => logoutToLogin());

    const toHome = (screen: keyof HomeStackParamList) =>
    nav.navigate('HomeTab', { screen });

    const logoutToLogin = () => {
    const root = nav.getParent();
    root?.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'AuthStack', params: { screen: 'AuthLanding' } }] }));
    };
        const entitlement = useMemo(
        () => ({ annualTotal: 12, annualUsed: 5, sickTotal: 10, sickUsed: 2 }),
        []
    );
    const pctAnnual = useMemo(
        () => (entitlement.annualUsed / entitlement.annualTotal) * 100,
        [entitlement]
    );
    const pctSick = useMemo(
        () => (entitlement.sickUsed / entitlement.sickTotal) * 100,
        [entitlement]
    );

    const waitingApprovals = useMemo(
        () => [
            { id: 'a1', title: 'ลาป่วย 1 วัน', meta: 'ของ กิตติ – 14 ก.ย. 2025', color: COLOR.warn },
            { id: 'a2', title: 'ลากิจครึ่งวัน', meta: 'ของ รัช – 13 ก.ย. 2025', color: COLOR.brand },
        ],
        []
    );

    const lastActivities = useMemo(
        () => [
            { id: 'r1', title: 'คุณลาพักร้อน 2 วัน', meta: 'อนุมัติแล้ว • 10–11 ก.ย. 2025', color: COLOR.ok },
            { id: 'r2', title: 'คำขอลาป่วย 1 วัน', meta: 'รออนุมัติ • 15 ก.ย. 2025', color: COLOR.warn },
        ],
        []
    );

    const newsItems = useMemo(
        () => [
            { id: 'n1', title: 'ประกาศวันหยุดชดเชย', meta: 'HR • 15 ก.ย. 2025' },
            { id: 'n2', title: 'ปรับนโยบายลากะทันหัน', meta: 'HR • 12 ก.ย. 2025' },
        ],
        []
    );

    //   onOpenHistory
    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
           

            {/* HEADER: gradient เป็นพื้นหลัง ไม่กินทัช */}
            <View style={styles.headerContainer}>
              <View style={styles.headerRow}>
                    <Text style={styles.greet}>{t('dashboard.title')}</Text>
                    <View style={styles.badge}><Text style={styles.badgeText}>v1.0</Text></View>
                </View>
                <View style={styles.actionRow}>
                    <TouchableOpacity style={styles.primaryBtn} onPress={onRequestLeave}>
                        <Text style={styles.primaryBtnText}>{t('dashboard.requestLeave')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.ghostBtn} onPress={onOpenTeam}>
                        <Text style={styles.ghostBtnText}>{t('tabs.team')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.ghostBtn} onPress={openLogin}>
                        <Text style={styles.ghostBtnText}>{t('auth.login')}</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                <View style={styles.statsGrid}>
                    <StatCard
                        label={t('dashboard.stats.annualRemaining')}
                        value={`${entitlement.annualTotal - entitlement.annualUsed}/${entitlement.annualTotal} ${t('common.days')}`}
                        hint={t('dashboard.stats.leave_annual')}
                        tone="ok"
                    />
                    <StatCard
                        label={t('dashboard.stats.sickRemaining')}
                        value={`${entitlement.sickTotal - entitlement.sickUsed}/${entitlement.sickTotal} ${t('common.days')}`}
                        hint={t('dashboard.stats.leave_sick')}
                        tone="warn"
                    />
                    <StatCard label={t('dashboard.stats.pending')} value="2 รายการ" hint={t('status.PENDING')} tone="brand" />
                    <StatCard label={t('dashboard.stats.thisMonthUsed')} value="3 วัน" hint={t('dashboard.stats.daysUsed')} tone="brand" />
                </View>

                <View style={[styles.card, SHADOW.base]}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>{t('dashboard.entitlements.title')}</Text>
                        <TouchableOpacity onPress={onOpenSummary}><Text style={styles.link}>{t('dashboard.entitlements.viewDetails')}</Text></TouchableOpacity>
                    </View>
                    <View style={styles.row}>
                        <View style={{ flex: 1, marginRight: 12 }}>
                            <Text style={styles.meta}>{t('dashboard.entitlements.annualUsedOf', { used: entitlement.annualUsed, total: entitlement.annualTotal })}</Text>
                            <Progress value={pctAnnual} tone="ok" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.meta}>{t('dashboard.entitlements.sickUsedOf', { used: entitlement.sickUsed, total: entitlement.sickTotal })}</Text>
                            <Progress value={pctSick} tone="warn" />
                        </View>
                    </View>
                </View>

                <View style={[styles.card, SHADOW.base]}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>{t('dashboard.sections.waitingApprovals')}</Text>
                        <TouchableOpacity onPress={openApprovals}><Text style={styles.link}>{t('dashboard.sections.goToList')}</Text></TouchableOpacity>
                    </View>
                    {waitingApprovals.map(x => (
                        <RowItem key={x.id} title={x.title} meta={x.meta} statusColor={x.color} onPress={onOpenApprovals} />
                    ))}
                </View>

                <View style={[styles.card, SHADOW.base]}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>{t('dashboard.sections.recentActivities')}</Text>
                        <TouchableOpacity onPress={openHistory}><Text style={styles.link}>{t('dashboard.sections.goToList')}</Text></TouchableOpacity>
                    </View>
                    {lastActivities.map(x => (
                        <RowItem key={x.id} title={x.title} meta={x.meta} statusColor={x.color} onPress={onOpenHistory} />
                    ))}
                </View>

                <View style={[styles.card, SHADOW.base]}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>{t('dashboard.sections.hrNews')}</Text>
                        <TouchableOpacity onPress={onOpenNews}><Text style={styles.link}>{t('dashboard.sections.goToList')}</Text></TouchableOpacity>
                    </View>
                    {newsItems.map(x => (
                        <RowItem key={x.id} title={x.title} meta={x.meta} statusColor={COLOR.brand} onPress={onOpenNews} />
                    ))}
                </View>

                <View style={{ height: 28 }} />
            </ScrollView>
        </View>
    );
};

export default DashboardLaloei;

/* ===== Styles ===== */
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLOR.bg },
    headerContainer: {
        paddingTop: Platform.OS === 'ios' ? 64 : 52,
        paddingBottom: 14,
        paddingHorizontal: 16,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        overflow: 'hidden',
        position: 'relative',
    },
    headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    back: { fontSize: 26, color: COLOR.dim, lineHeight: 26 },
    headerTitle: { fontSize: 18, fontWeight: '800', color: COLOR.dark },

    searchWrap: {
        marginTop: 12,
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        borderWidth: 1, borderColor: COLOR.line,
        paddingHorizontal: 12, paddingVertical: 10,
        flexDirection: 'row', alignItems: 'center', gap: 8,
    },
    searchIcon: { fontSize: 16, color: COLOR.dim },
    clearIcon: { fontSize: 16, color: COLOR.dim },
    searchInput: { flex: 1, fontSize: 14, color: COLOR.dark },

    filterRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
    filterChip: {
        paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999,
        backgroundColor: '#F3F7FB', borderWidth: 1, borderColor: 'transparent',
    },

    headerWrap: {
        paddingTop: Platform.OS === 'ios' ? 20 : (StatusBar.currentHeight ?? 0) + 8,
        paddingBottom: 66,
        paddingHorizontal: 16,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    greet: { fontSize: 20, fontWeight: '800', color: COLOR.text },
    badge: { backgroundColor: '#fff', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6, ...SHADOW.base },
    badgeText: { fontSize: 12, color: COLOR.dim, fontWeight: '700' },
    actionRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
    primaryBtn: { backgroundColor: COLOR.brand, paddingVertical: 12, paddingHorizontal: 18, borderRadius: 16 },
    primaryBtnText: { color: '#fff', fontWeight: '800' },
    ghostBtn: { backgroundColor: COLOR.brandSoft, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 16 },
    ghostBtnText: { color: COLOR.brand, fontWeight: '800' },

    scroll: { padding: 16, paddingBottom: 28 },

    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    statCard: { flexBasis: '48%', backgroundColor: COLOR.card, borderRadius: 18, padding: 14 },
    statLabel: { color: COLOR.dim, fontSize: 12, fontWeight: '700' },
    statValue: { fontSize: 20, fontWeight: '900', marginTop: 6 },
    statHint: { color: COLOR.dim, marginTop: 4, fontSize: 12 },

    card: { backgroundColor: COLOR.card, borderRadius: 20, padding: 14, marginTop: 14 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    cardTitle: { fontSize: 16, fontWeight: '800', color: COLOR.text },
    link: { color: COLOR.brand, fontWeight: '800' },

    row: { flexDirection: 'row', gap: 12 },
    meta: { color: COLOR.dim, marginBottom: 8 },
    progressTrack: { height: 10, borderRadius: 999, backgroundColor: '#EEF5F9', overflow: 'hidden' },
    progressFill: { height: 10, borderRadius: 999 },

    rowItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
    dot: { width: 8, height: 8, borderRadius: 999, marginRight: 10 },
    rowTitle: { fontSize: 14, fontWeight: '700', color: COLOR.text },
    rowMeta: { fontSize: 12, color: COLOR.dim, marginTop: 2 },
    chev: { fontSize: 20, color: COLOR.dim, paddingLeft: 10 },
});

