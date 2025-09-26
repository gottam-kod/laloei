// src/screens/DashboardLaloei.tsx
import HeaderCompact from '@/src/components/Header';
import { CommonActions, NavigationProp, useNavigation } from '@react-navigation/native';
import React, { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import StatCard from '../../components/StatCard';
import { Tone } from '../../interface/tone';
import { HomeStackParamList, MainTabParamList } from '../../navigation/RootStackParamList';
import { COLOR, headerHeight } from '../../theme/theme';

type Props = {
  onBack?: () => void;
  onRequestLeave?: () => void;
  onOpenHistory?: () => void;
  onOpenApprovals?: () => void;
  onOpenTeam?: () => void;
  onOpenSummary?: () => void;
  onOpenNews?: () => void;
  goToLogin?: () => void;
};


const toneColor = (t: Tone) =>
  t === 'ok' ? COLOR.ok : t === 'warn' ? COLOR.warn : t === 'danger' ? COLOR.danger : COLOR.brand;

const Progress = memo(({ value, tone = 'brand' as Tone }: { value: number; tone?: Tone }) => {
  const w = Math.min(100, Math.max(0, value));
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${w}%`, backgroundColor: toneColor(tone) }]} />
    </View>
  );
});

const RowItem = memo(
  ({ title, meta, tone = 'brand' as Tone, onPress }: { title: string; meta: string; tone?: Tone; onPress?: () => void }) => (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.rowItem}>
      <View style={[styles.rowDot, { backgroundColor: toneColor(tone) }]} />
      <View style={{ flex: 1 }}>
        <Text numberOfLines={1} style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowMeta}>{meta}</Text>
      </View>
      <Text style={styles.chev}>›</Text>
    </TouchableOpacity>
  )
);

const HomeEmpScreen: React.FC<Props> = ({
  onBack,
  onRequestLeave,
  onOpenTeam,
  onOpenSummary,
  onOpenApprovals,
  onOpenHistory,
  onOpenNews,
  goToLogin,
}) => {
  const { t } = useTranslation();
  const nav = useNavigation<NavigationProp<MainTabParamList>>();

  const toHome = (screen: keyof HomeStackParamList) => nav.navigate('HomeTab', { screen });
  const openApprovals = onOpenApprovals || (() => toHome('ApprovalList'));
  const openHistory = onOpenHistory || (() => toHome('Requests'));

  const openLogin = goToLogin || (() => {
    const root = nav.getParent();
    root?.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'AuthStack', params: { screen: 'AuthLanding' } }] }));
  });

  // mock data → ผูก API จริงได้ทันที
  const entitlement = useMemo(() => ({ annualTotal: 12, annualUsed: 5, sickTotal: 10, sickUsed: 2 }), []);
  const pctAnnual = (entitlement.annualUsed / entitlement.annualTotal) * 100;
  const pctSick = (entitlement.sickUsed / entitlement.sickTotal) * 100;

  const waiting = useMemo(
    () => [
      { id: 'a1', title: t('dashboard.items.approvalItem', { type: t('leaveTypes.sick'), days: 1 }), meta: t('dashboard.items.fromPersonOnDate', { person: 'กิตติ', date: '21 ก.ย. 2025' }), tone: 'warn' as Tone },
      { id: 'a2', title: t('dashboard.items.approvalHalfDay', { type: t('leaveTypes.personal') }), meta: t('dashboard.items.fromPersonOnDate', { person: 'รัช', date: '20 ก.ย. 2025' }), tone: 'brand' as Tone },
    ],
    [t]
  );

  const recent = useMemo(
    () => [
      { id: 'r1', title: t('dashboard.items.youTookLeaveDays', { type: t('leaveTypes.annual'), days: 2 }), meta: t('dashboard.items.statusApprovedRange', { start: '10 ก.ย. 2025', end: '11 ก.ย. 2025' }), tone: 'ok' as Tone },
      { id: 'r2', title: t('dashboard.items.requestSickLeave', { days: 1 }), meta: t('dashboard.items.statusPendingOn', { date: '15 ก.ย. 2025' }), tone: 'warn' as Tone },
    ],
    [t]
  );

  const news = useMemo(
    () => [
      { id: 'n1', title: t('dashboard.news.compensatoryHoliday'), meta: t('dashboard.news.meta', { source: 'HR', date: '19 ก.ย. 2025' }) },
      { id: 'n2', title: t('dashboard.news.emergencyLeavePolicy'), meta: t('dashboard.news.meta', { source: 'HR', date: '17 ก.ย. 2025' }) },
    ],
    [t]
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* HERO HEADER */}
      {/* <View style={styles.header}>
        <LinearGradient
          colors={[COLOR.brandSoft, '#FFFFFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.heading}>{t('dashboard.title')}</Text>
            <Text style={styles.subhead}>{t('dashboard.subtitle', 'พร้อมจัดการวันลาของคุณ')}</Text>
          </View>
          <TouchableOpacity onPress={openLogin} style={styles.badge} activeOpacity={0.85}>
            <Text style={styles.badgeText}>v1.0</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.ctaRow}>
          <TouchableOpacity style={styles.primaryBtn} onPress={onRequestLeave}>
            <Text style={styles.primaryBtnText}>{t('dashboard.requestLeave')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ghostBtn} onPress={onOpenTeam}>
            <Text style={styles.ghostBtnText}>{t('tabs.team')}</Text>
          </TouchableOpacity>
        </View>
      </View> */}

      <View style={headerHeight}>
            <HeaderCompact
                title='Dashboard'
                // name="David Andrew"
                // greeting="Good Morning!"
                // avatar={{ uri: 'https://i.pravatar.cc/100?img=5' }}   // เปลี่ยนเป็น require(...) ได้
                // onSearch={() => {}}
                // onBell={() => {}}
                // hasNotification={true}
            />
            </View>



      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {/* KPI STRIP */}
        <View style={styles.kpiStrip}>
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
        </View>

        {/* ENTITLEMENTS */}
        <View style={[styles.card]}>
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

        {/* WAITING APPROVALS */}
        <View style={[styles.card]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{t('dashboard.sections.waitingApprovals')}</Text>
            <TouchableOpacity onPress={openApprovals}><Text style={styles.link}>{t('dashboard.sections.goToList')}</Text></TouchableOpacity>
          </View>
          {waiting.map(x => (
            <RowItem key={x.id} title={x.title} meta={x.meta} tone={x.tone} onPress={openApprovals} />
          ))}
        </View>

        {/* RECENT ACTIVITIES */}
        <View style={[styles.card]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{t('dashboard.sections.recentActivities')}</Text>
            <TouchableOpacity onPress={openHistory}><Text style={styles.link}>{t('dashboard.sections.goToList')}</Text></TouchableOpacity>
          </View>
          {recent.map(x => (
            <RowItem key={x.id} title={x.title} meta={x.meta} tone={x.tone} onPress={openHistory} />
          ))}
        </View>

        {/* HR NEWS */}
        <View style={[styles.card]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{t('dashboard.sections.hrNews')}</Text>
            <TouchableOpacity onPress={onOpenNews}><Text style={styles.link}>{t('dashboard.sections.goToList')}</Text></TouchableOpacity>
          </View>
          {news.map(x => (
            <RowItem key={x.id} title={x.title} meta={x.meta} tone="brand" onPress={onOpenNews} />
          ))}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
};

export default HomeEmpScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLOR.bg },
  header: {
    paddingTop: Platform.OS === 'ios' ? 64 : (StatusBar.currentHeight ?? 0) + 20,
    paddingBottom: 28,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: {
    fontSize: 22,
    fontWeight: '900',
    color: '#fff',
  },
  subGreeting: {
    marginTop: 6,
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  versionBadge: {
    backgroundColor: '#fff',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  versionText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLOR.brand,
  },
  headerActions: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 12,
  },

  btnPrimary: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
  },
  btnPrimaryText: { color: COLOR.brand, fontWeight: '800', fontSize: 15 },
  btnGhost: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 16,
  },
  btnGhostText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  heading: { fontSize: 22, fontWeight: '900', color: COLOR.text },
  subhead: { marginTop: 4, fontSize: 13, color: COLOR.dim },
  badge: { backgroundColor: '#fff', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  badgeText: { fontSize: 12, color: COLOR.dim, fontWeight: '700' },
  ctaRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
  primaryBtn: { backgroundColor: COLOR.brand, paddingVertical: 12, paddingHorizontal: 18, borderRadius: 14 },
  primaryBtnText: { color: '#fff', fontWeight: '800' },
  ghostBtn: { backgroundColor: COLOR.brandSoft, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 14 },
  ghostBtnText: { color: COLOR.brand, fontWeight: '800' },

  body: { padding: 16, paddingBottom: 28 },

  kpiStrip: { flexDirection: 'row', gap: 12 },

  card: {
    backgroundColor: COLOR.card,
    borderRadius: 18,
    padding: 14,
    marginTop: 14,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },

  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  cardTitle: { fontSize: 16, fontWeight: '800', color: COLOR.text },
  link: { color: COLOR.brand, fontWeight: '800' },

  row: { flexDirection: 'row', gap: 12 },
  meta: { color: COLOR.dim, marginBottom: 8 },
  progressTrack: { height: 10, borderRadius: 999, backgroundColor: '#EEF5F9', overflow: 'hidden' },
  progressFill: { height: 10, borderRadius: 999 },

  rowItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  rowDot: { width: 8, height: 8, borderRadius: 999, marginRight: 10 },
  rowTitle: { fontSize: 14, fontWeight: '700', color: COLOR.text },
  rowMeta: { fontSize: 12, color: COLOR.dim, marginTop: 2 },
  chev: { fontSize: 20, color: COLOR.dim, paddingLeft: 10 },
});
