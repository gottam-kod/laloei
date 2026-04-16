// screens/LaloeiHome.tsx
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Animated, Easing, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import ArticlesList from '@/src/components/home/ArticlesList';
import GreetingInsight from '@/src/components/home/GreetingInsight';
import HeaderBar from '@/src/components/home/HeaderBar';
import PromosCarousel from '@/src/components/home/PromosCarousel';
import QuickAllModal from '@/src/components/home/QuickAllModal';
import QuickGrid, { QuickItem } from '@/src/components/home/QuickGrid';
import ScoreBar from '@/src/components/home/ScoreBar';

import { useGetInsights } from '@/src/hooks/home/useGetInsights';
import { useGetLeaveSummary } from '@/src/hooks/home/useGetLeaveSummary';
import { useGetLeaveHistory } from '@/src/hooks/leave/useLeaveHistory';
import { useQuickActions } from '@/src/hooks/quicks/useQuickActions';

import { QuickKey, Role, ROLE_QUICK_MAP } from '@/src/auth/roles';
import { resetToLogin } from '@/src/navigation/navigationRef';
import { useAuthStore, useUserRole } from '@/src/store/useAuthStore';

import { COLOR, SP } from '@/src/theme/token';
import LeaveSmartCard, { SmartLeave } from './components/LeaveSmartCard';

/* =========================
 * Config / Constants
 * ========================= */
const UI = {
  header: {
    maxH: 260,
    minH: 180,
    collapseAt: 90,
    translateMax: -90,
  },
  anim: {
    loopMs: 5200,
    modalInMs: 160,
    modalOutMs: 140,
  },
} as const;

const QUICK_BASE: QuickItem[] = [
  { key: 'MENU_LEAVE', label: 'ขอลา', icon: 'pencil', color: '#0EA5E9' },
  { key: 'MENU_HISTORY', label: 'ประวัติลา', icon: 'calendar-outline', color: '#6366F1' },
  { key: 'MENU_CALENDAR', label: 'ปฏิทิน', icon: 'calendar-outline', color: '#F59E0B' },
  { key: 'MENU_APPROVE', label: 'อนุมัติ', icon: 'checkmark-done-circle', color: '#10B981' },
  { key: 'MENU_PROFILE', label: 'โปรไฟล์', icon: 'person-circle-outline', color: '#8B5CF6' },
  { key: 'MENU_NOTIFICATION', label: 'แจ้งเตือน', icon: 'notifications-outline', color: '#64748B' },
];

const PROMOS = [
  { id: 'p1', title: 'ตั้งสิทธิ์ลาองค์กรยืดหยุ่น', cover: 'https://picsum.photos/seed/l9a/420/240' },
  { id: 'p2', title: 'รายงานสรุปทันใจ', cover: 'https://picsum.photos/seed/l9b/420/240' },
];

const ARTICLES = [
  { id: 'a1', title: 'จัดตารางลาให้ทีมไม่สะดุด', cover: 'https://picsum.photos/seed/l9c/640/360' },
  { id: 'a2', title: 'เริ่มต้น HR Analytics ยังไง', cover: 'https://picsum.photos/seed/l9d/640/360' },
];

/* =========================
 * Utils
 * ========================= */
function dayPart(): 'AM' | 'PM' | 'EVENING' | 'NIGHT' {
  const h = new Date().getHours();
  if (h < 12) return 'AM';
  if (h < 18) return 'PM';
  if (h < 20) return 'EVENING';
  return 'NIGHT';
}

/* =========================
 * Screen
 * ========================= */
export default function LaloeiHome() {
  const insets = useSafeAreaInsets();
  const { t, i18n } = useTranslation();

  const profile = useAuthStore((s) => s.profile);
  const role = useUserRole();

  // ถ้า token/profile หลุด ส่งกลับหน้า login
  if (!profile) {
    resetToLogin();
    return null;
  }

  /* ---------- i18n labels (reactive) ---------- */
  const statsLabels = useMemo(() => ({
    annualRemaining: t('dashboard.stats.annualRemaining'), // เหลือ
    sickRemaining: t('dashboard.stats.sickRemaining'),   // ลาป่วยคงเหลือ
    daysUsed: t('dashboard.stats.daysUsed'),        // ใช้ไป
    totalLabel: t('dashboard.stats.total'),           // รวม (เพิ่มคีย์นี้ใน i18n)
  }), [t, i18n.language]);

  /* ---------- API data ---------- */
  const { data: leaveHistory = [] } = useGetLeaveHistory(profile.id, { enabled: !!profile.id });
  const { data: leaveSummaryApi } = useGetLeaveSummary({ enabled: true });
  const { data: insights = [] } = useGetInsights({ enabled: true });

  const leaveSummary = leaveSummaryApi ?? { left: 0, used: 0, total: 0 };

  // last created leave (safe sort)
  const leaveHistoryTop1 = useMemo(() => {
    if (!Array.isArray(leaveHistory) || leaveHistory.length === 0) return undefined;
    const sorted = [...leaveHistory].sort((a, b) => {
      const at = new Date(a.createdAt).getTime() || 0;
      const bt = new Date(b.createdAt).getTime() || 0;
      return bt - at;
    });
    return sorted[0];
  }, [leaveHistory]);

  /* ---------- Quick (filtered by Role) ---------- */
  const visibleQuick = useMemo<QuickItem[]>(() => {
    const keys = (ROLE_QUICK_MAP[role as Role] ?? []) as QuickKey[];
    return QUICK_BASE.filter(q => keys.includes(q.key as QuickKey));
  }, [role]);

  /* ---------- Greeting / Insight ---------- */
  const greetText = useMemo(() => {
    const g = dayPart();
    if (g === 'AM') return t('dashboard.greetingMorning');
    if (g === 'PM') return t('dashboard.greetingAfternoon');
    if (g === 'EVENING') return t('dashboard.greetingEvening');
    return t('dashboard.greetingNight');
  }, [t, i18n.language]);

  const randomInsight = useMemo(() => {
    if (!insights || insights.length === 0) return '';
    const idx = Math.floor(Math.random() * insights.length);
    return insights[idx];
  }, [insights]);

  /* ---------- Actions (รวมทุกปุ่ม) ---------- */
  const { onQuickPress: quickActionFromHook } = useQuickActions({ openAllMenu: () => openModal() });

  const handleQuick = useCallback((k: QuickKey) => {
    // จุดเดียวสำหรับ map เพิ่มเติม ก่อนส่งให้ hook
    // ถ้าต้องการ intercept route/param ใส่ได้ที่นี่
    quickActionFromHook(k);
  }, [quickActionFromHook]);

  const goLeaveDetail = useCallback((id: string) => {
    handleQuick('MENU_HISTORY');
  }, [handleQuick]);

  /* ---------- Header BG animation (loop) ---------- */
  const animT = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    let isMounted = true;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(animT, { toValue: 1, duration: UI.anim.loopMs, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(animT, { toValue: 0, duration: UI.anim.loopMs, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => {
      if (isMounted) loop.stop();
      isMounted = false;
    };
  }, [animT]);

  const blob1Style = useMemo(() => ([
    styles.blob,
    { top: -60, left: -70, backgroundColor: '#D7F1FF' },
    {
      transform: [
        { translateX: animT.interpolate({ inputRange: [0, 1], outputRange: [0, 18] }) },
        { translateY: animT.interpolate({ inputRange: [0, 1], outputRange: [0, -12] }) },
      ],
    },
  ]), [animT]);

  const blob2Style = useMemo(() => ([
    styles.blob,
    { top: 10, right: -80, backgroundColor: '#D9FFF1' },
    {
      transform: [
        { translateX: animT.interpolate({ inputRange: [0, 1], outputRange: [0, -14] }) },
        { translateY: animT.interpolate({ inputRange: [0, 1], outputRange: [0, 14] }) },
      ],
    },
  ]), [animT]);

  /* ---------- Scroll-driven header ---------- */
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerHeight = scrollY.interpolate({
    inputRange: [0, UI.header.collapseAt],
    outputRange: [UI.header.maxH, UI.header.minH],
    extrapolate: 'clamp',
  });
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 300],
    outputRange: [0, UI.header.translateMax],
    extrapolate: 'clamp',
  });
  const titleOpacity = scrollY.interpolate({
    inputRange: [0, UI.header.collapseAt * 0.6, UI.header.collapseAt],
    outputRange: [1, 0.4, 0],
    extrapolate: 'clamp',
  });
  const greetOpacity = scrollY.interpolate({
    inputRange: [0, UI.header.collapseAt * 0.6, UI.header.collapseAt],
    outputRange: [1, 0.3, 0],
    extrapolate: 'clamp',
  });

  /* ---------- All Menu (modal) ---------- */
  const [modalOpen, setModalOpen] = useState(false);
  const modalScale = useRef(new Animated.Value(0.9)).current;
  const modalOpacity = useRef(new Animated.Value(0)).current;

  const openModal = useCallback(() => {
    setModalOpen(true);
    Animated.parallel([
      Animated.timing(modalOpacity, { toValue: 1, duration: UI.anim.modalInMs, useNativeDriver: true }),
      Animated.spring(modalScale, { toValue: 1, useNativeDriver: true, friction: 8 }),
    ]).start();
  }, [modalOpacity, modalScale]);

  const closeModal = useCallback(() => {
    Animated.parallel([
      Animated.timing(modalOpacity, { toValue: 0, duration: UI.anim.modalOutMs, useNativeDriver: true }),
      Animated.timing(modalScale, { toValue: 0.9, duration: UI.anim.modalOutMs, useNativeDriver: true }),
    ]).start(({ finished }) => finished && setModalOpen(false));
  }, [modalOpacity, modalScale]);

  /* ---------- Render ---------- */
  return (
    <View style={{ flex: 1 }}>
      {/* <BackgroundFX /> */}

      {/* Header BG + blobs */}
      <Animated.View
        style={[
          styles.headerWrap,
          {
            paddingTop: insets.top + 8,
            height: headerHeight,
            transform: [{ translateY: headerTranslateY }],
          },
        ]}
        accessibilityRole="header"
        accessibilityLabel="Gradient header"
      >
        <LinearGradient
          colors={[COLOR.gradA, COLOR.gradB]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <Animated.View style={blob1Style as any} />
        <Animated.View style={blob2Style as any} />
      </Animated.View>

      <SafeAreaView style={{ flex: 1 }}>
        <Animated.ScrollView
          contentContainerStyle={{
            paddingHorizontal: SP.lg,
            paddingTop: SP.lg,
            paddingBottom: Math.max(SP.lg, insets.bottom + 8),
            rowGap: SP.lg,
          }}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
          accessibilityLabel="Home content"
        >
          {/* Header + Greeting */}
          <HeaderBar
            titleOpacity={titleOpacity}
            organizationName={profile?.org?.name ?? t('dashboard.defaultOrgName', { defaultValue: 'องค์กรของฉัน' })}
            subtitle={t('subtitle')}
            avatar={profile?.avatarUri ?? ''}
            onPressAvatar={() => handleQuick('MENU_PROFILE')}
            onPressNotification={() => handleQuick('MENU_NOTIFICATION')}
          />

          <GreetingInsight
            greetTime={greetText}
            name={profile?.name ?? t('dashboard.defaultUser', { defaultValue: 'ผู้ใช้' })}
            insight={randomInsight}
            opacity={greetOpacity}
          />

          {/* Scorebar */}
          <ScoreBar
            left={leaveSummary.left}
            used={leaveSummary.used}
            total={leaveSummary.total}
            stats={{
              annualRemaining: statsLabels.annualRemaining,
              sickRemaining: statsLabels.sickRemaining,
              daysUsed: statsLabels.daysUsed,
              totalLabel: statsLabels.totalLabel,
            }}
            loading={false}
          />

          {/* Quick (เรียงตาม role) */}
          <QuickGrid
            title={t('common.quickActions')}
            items={visibleQuick}
            onPressItem={(k) => handleQuick(k as QuickKey)}
          />

          {/* Upcoming */}
          {(() => {
              console.log('leaveHistoryTop1', leaveHistoryTop1);

            return (
              // <UpcomingCard
              //   status={upcomingStatus}
              //   date={leaveHistoryTop1?.createdAt ?? '2024-06-01'}
              //   detail={leaveHistoryTop1?.note ?? t('leave.defaultNote', { defaultValue: 'ลาป่วย' })}
              //   approver={t('leave.waitingApprover', { defaultValue: 'รออนุมัติโดย หัวหน้างาน' })}
              //   time={''}
              // />
              <LeaveSmartCard
                role={role as any}
                latest={leaveHistoryTop1 as SmartLeave | undefined}
                approvalsCount={2}
                onCreate={() => handleQuick('MENU_LEAVE')}
                onOpenDetail={(id) => goLeaveDetail(id)}
                onOpenApprovals={() => handleQuick('MENU_APPROVE')}
                onOpenCalendar={() => handleQuick('MENU_CALENDAR')}
                onResubmit={() => handleQuick('MENU_LEAVE')}
              />
            );
          })()}

          {/* Promos + Articles */}
          <PromosCarousel items={PROMOS} />
          <ArticlesList items={ARTICLES} onPressAll={() => { }} />

          {/* Open All */}
          <Pressable
            onPress={openModal}
            android_ripple={{ color: '#00000011', borderless: true }}
            style={{ height: 1, width: 1 }} // ไม่กินพื้นที่ UI แต่รองรับการเรียก openAll จาก hook ได้
            accessibilityLabel="Open all menu"
          />
        </Animated.ScrollView>
      </SafeAreaView>

      {/* All Menu (ปุ่ม 9 จุด) */}
      <QuickAllModal
        visible={modalOpen}
        items={QUICK_BASE}
        onClose={closeModal}
        opacity={modalOpacity}
        scale={modalScale}
        onPressItem={(k) => {
          handleQuick(k as QuickKey);
          closeModal();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  blob: { position: 'absolute', width: 320, height: 320, borderRadius: 400, opacity: 0.35 },
  headerWrap: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    overflow: 'hidden',
    opacity: 0.9,
  },
});
