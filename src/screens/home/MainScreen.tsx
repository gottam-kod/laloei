import { useQuickActions } from '@/src/hooks/quicks/useQuickActions';
import { useAuthStore, useUserRole } from '@/src/store/useAuthStore';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
// import FabAll from '../../components/home/FabAll';
import ArticlesList from '../../components/home/ArticlesList';
import GreetingInsight from '../../components/home/GreetingInsight';
import HeaderBar from '../../components/home/HeaderBar';
import PromosCarousel from '../../components/home/PromosCarousel';
import QuickAllModal from '../../components/home/QuickAllModal';
import QuickGrid, { QuickItem } from '../../components/home/QuickGrid';
import ScoreBar from '../../components/home/ScoreBar';
import UpcomingCard from '../../components/home/UpcomingCard';
import { COLOR, SP } from '../../theme/token';
import { useTranslation } from 'react-i18next';
import { useGetInsights } from '@/src/hooks/home/useGetInsights';
import { resetToLogin } from '@/src/navigation/navigationRef';
import { QuickKey, Role, ROLE_QUICK_MAP } from '@/src/auth/roles';
import { useGetLeaveSummary } from '@/src/hooks/home/useGetLeaveSummary';
import { BackgroundFX } from '@/src/components/Background';
import { useGetLeaveHistory } from '@/src/hooks/leave/useLeaveHistory';

// table menu 
// == Quick สำหรับหน้า Home (MVP ตามที่แนะนำ) == 
const QUICK: QuickItem[] = [
  { key: 'MENU_LEAVE', label: 'ขอลา', icon: 'pencil', color: '#0EA5E9' },   // ฟ้า
  { key: 'MENU_HISTORY', label: 'ประวัติลา', icon: 'calendar-outline', color: '#6366F1' },   // ม่วง
  { key: 'MENU_CALENDAR', label: 'ปฏิทิน', icon: 'calendar-outline', color: '#F59E0B' },   // ส้ม
  { key: 'MENU_APPROVE', label: 'อนุมัติ', icon: 'checkmark-done-circle', color: '#10B981' },   // เขียว (เฉพาะหัวหน้า/HR)
  { key: 'MENU_PROFILE', label: 'โปรไฟล์', icon: 'person-circle-outline', color: '#8B5CF6' },
  { key: 'MENU_NOTIFICATION', label: 'แจ้งเตือน', icon: 'notifications-outline', color: '#64748B' },
  // อื่นๆ (policy/report/summary/setting) ไปอยู่ใน All Menu (Modal)
];


const PROMOS = [
  { id: 'p1', title: 'ตั้งสิทธิ์ลาองค์กรยืดหยุ่น', cover: 'https://picsum.photos/seed/l9a/420/240' },
  { id: 'p2', title: 'รายงานสรุปทันใจ', cover: 'https://picsum.photos/seed/l9b/420/240' },
];

const ARTICLES = [
  { id: 'a1', title: 'จัดตารางลาให้ทีมไม่สะดุด', cover: 'https://picsum.photos/seed/l9c/640/360' },
  { id: 'a2', title: 'เริ่มต้น HR Analytics ยังไง', cover: 'https://picsum.photos/seed/l9d/640/360' },
];

function useGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'AM';
  if (h < 18) return 'PM';
  if (h < 20) return 'EVENING';
  return 'NIGHT';
}

export default function LaloeiHome() {
  const { t: translate, i18n } = useTranslation();
  const insets = useSafeAreaInsets();

  const profile = useAuthStore(s => s.profile);
  const role = useUserRole();

  if (!profile) {
    resetToLogin();
    return null;
  }

  const [stats, setStats] = useState({
    annualRemaining: translate('dashboard.stats.annualRemaining'),
    sickRemaining: translate('dashboard.stats.sickRemaining'),
    daysUsed: translate('dashboard.stats.daysUsed'),
  });

  const visibleQuick = useMemo(() => {
    const keys = ROLE_QUICK_MAP[role as Role] ?? [];
    return QUICK.filter(q => keys.includes(q.key));
  }, [role]);

  const greetTime = useMemo(() => {
    const g = useGreeting();
    if (g === 'AM') return translate('dashboard.greetingMorning');
    if (g === 'PM') return translate('dashboard.greetingAfternoon');
    if (g === 'EVENING') return translate('dashboard.greetingEvening');
    return translate('dashboard.greetingNight');
  }, [i18n.language]);

  useEffect(() => {
    const id = setTimeout(() => {
      setStats({
        annualRemaining: translate('dashboard.stats.annualRemaining'),
        sickRemaining: translate('dashboard.stats.sickRemaining'),
        daysUsed: translate('dashboard.stats.daysUsed'),
      });
    }, 600);
    return () => clearTimeout(id);
  }, [i18n.language, translate]);

  const { data: leave } = useGetLeaveHistory(profile.id, { enabled: !!profile.id });
  const { data: leaveSummaryApi } = useGetLeaveSummary({ enabled: true });
  const { data: INSIGHTS = [] } = useGetInsights({ enabled: true });
  const leaveSummary = leaveSummaryApi ?? { left: 0, used: 0, total: 0 };

  const leaveHistoryTop1 = leave?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

  // BG animation
  const animT = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const looper = Animated.loop(
      Animated.sequence([
        Animated.timing(animT, { toValue: 1, duration: 5200, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(animT, { toValue: 0, duration: 5200, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    );
    looper.start();
    return () => looper.stop();
  }, [animT]);

  const blob1 = {
    transform: [
      { translateX: animT.interpolate({ inputRange: [0, 1], outputRange: [0, 18] }) },
      { translateY: animT.interpolate({ inputRange: [0, 1], outputRange: [0, -12] }) },
    ]
  };
  const blob2 = {
    transform: [
      { translateX: animT.interpolate({ inputRange: [0, 1], outputRange: [0, -14] }) },
      { translateY: animT.interpolate({ inputRange: [0, 1], outputRange: [0, 14] }) },
    ]
  };

  // scroll-driven
  const scrollY = useRef(new Animated.Value(0)).current;
  const COLLAPSE = 90;
  const headerHeight = scrollY.interpolate({ inputRange: [0, COLLAPSE], outputRange: [260, 180], extrapolate: 'clamp' });
  const headerTranslateY = scrollY.interpolate({ inputRange: [0, 300], outputRange: [0, -90], extrapolate: 'clamp' });
  const titleOpacity = scrollY.interpolate({ inputRange: [0, COLLAPSE * 0.6, COLLAPSE], outputRange: [1, 0.4, 0], extrapolate: 'clamp' });
  const greetOpacity = scrollY.interpolate({ inputRange: [0, COLLAPSE * 0.6, COLLAPSE], outputRange: [1, 0.3, 0], extrapolate: 'clamp' });

  // modal
  const [modalOpen, setModalOpen] = useState(false);
  const modalScale = useRef(new Animated.Value(0.9)).current;
  const modalOpacity = useRef(new Animated.Value(0)).current;

  const openModal = () => {
    setModalOpen(true);
    Animated.parallel([
      Animated.timing(modalOpacity, { toValue: 1, duration: 160, useNativeDriver: true }),
      Animated.spring(modalScale, { toValue: 1, useNativeDriver: true, friction: 8 }),
    ]).start();
  };
  const closeModal = () => {
    Animated.parallel([
      Animated.timing(modalOpacity, { toValue: 0, duration: 140, useNativeDriver: true }),
      Animated.timing(modalScale, { toValue: 0.9, duration: 140, useNativeDriver: true }),
    ]).start(({ finished }) => finished && setModalOpen(false));
  };

  const insight = useMemo(() => {
    if (!INSIGHTS || INSIGHTS.length === 0) return '';
    return INSIGHTS[Math.floor(Math.random() * INSIGHTS.length)];
  }, [INSIGHTS]);

  const { onQuickPress } = useQuickActions({ openAllMenu: openModal });

  return (
    <View style={{ flex: 1 }}>
      <BackgroundFX />
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
      >
        <LinearGradient
          colors={[COLOR.gradA, COLOR.gradB]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        <Animated.View style={[styles.blob, { top: -60, left: -70, backgroundColor: '#D7F1FF' }, blob1]} />
        <Animated.View style={[styles.blob, { top: 10, right: -80, backgroundColor: '#D9FFF1' }, blob2]} />
      </Animated.View>


      <SafeAreaView style={{ flex: 1 }}>
        <Animated.ScrollView
          contentContainerStyle={{
            paddingHorizontal: SP.lg,
            paddingTop: SP.lg,
            paddingBottom: Math.max(SP.lg, insets.bottom + 8),
            rowGap: SP.lg,
          }}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
          scrollEventThrottle={16}
        >
          {/* Header + Greeting */}
          <HeaderBar
            titleOpacity={titleOpacity}
            organizationName={profile?.org?.name ?? 'องค์กรของฉัน'}
            subtitle={translate('subtitle')}
            avatar={profile?.avatarUri ?? ''}
            onPressAvatar={() => onQuickPress('MENU_PROFILE')}
            onPressNotification={() => onQuickPress('MENU_NOTIFICATION')}
          />

          <GreetingInsight
            greetTime={greetTime}
            name={profile?.name ?? 'ผู้ใช้'}
            insight={insight}
            opacity={greetOpacity}
          />

          {/* Scorebar */}
          <ScoreBar
            left={leaveSummary.left}
            used={leaveSummary.used}
            total={leaveSummary.total}
            stats={stats}
          />

          {/* Quick — เรียงตามที่แนะนำ */}
          <QuickGrid
            title={translate('common.quickActions')}
            items={visibleQuick}
            onPressItem={(k) => onQuickPress(k as QuickKey)}
          />

          {/* Upcoming */}
          {(() => {
            const s = leaveHistoryTop1?.status;
            const allowed = ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'] as const;
            const upcomingStatus = typeof s === 'string' && allowed.includes(s as any)
              ? s as 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED'
              : undefined;
            return (
              <UpcomingCard
                status={upcomingStatus}
                date={leaveHistoryTop1?.createdAt ?? '01 Jun 2024 - 01 Jun 2024'}
                // time={'09:00'}
                detail={leaveHistoryTop1?.note ?? 'ลาป่วย'}
                approver={'รออนุมัติโดย หัวหน้างาน'} time={''}              />
            );
          })()}

          {/* Promos + Articles */}
          <PromosCarousel items={PROMOS} />
          <ArticlesList items={ARTICLES} onPressAll={() => { }} />
        </Animated.ScrollView>
      </SafeAreaView>

      {/* All Menu (ปุ่ม 9 จุด) */}
      {/* <FabAll onPress={openModal} /> */}

      <QuickAllModal
        visible={modalOpen}
        items={QUICK}
        onClose={closeModal}
        opacity={modalOpacity}
        scale={modalScale}
        onPressItem={(k) => {
          onQuickPress(k as QuickKey);
          closeModal();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerBG: { position: 'absolute', top: 0, left: 0, right: 0 },
  blob: { position: 'absolute', width: 320, height: 320, borderRadius: 400, opacity: 0.35 },
  headerWrap: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    overflow: 'hidden',       // สำคัญ: ให้คลิปมุม gradient/blobs
    opacity: 0.9,             // ใส่ opacity ที่ wrapper
  },
});
