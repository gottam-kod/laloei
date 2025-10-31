// src/navigation/RootTabs.tsx
import HomeStack from '@/src/navigation/HomeStack';
import ProfileStack from '@/src/navigation/ProfileStack';
import PerksScreen from '@/src/screens/PerksScreen';
import { useAuthStore } from '@/src/store/useAuthStore';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { JSX, useEffect, useMemo } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LeaveRequestPro from '../screens/leave/LeaveRequestScreen';
import { resetToLogin } from './navigationRef';
import CheckinScreen from '../screens/CheckinScreen';
import TasksScreen from '../screens/tasks/TasksScreen';
import TeamScreen from '../screens/team/TeamScreen';

export type RootTabParamList = {
  HomeTab: undefined;
  RequestTab: undefined;
  HistoryTab: undefined;
  TeamTab: undefined;
  PerksTab: undefined;
  ProfileTab: undefined;
  Notifications: undefined;
  TasksScreen: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

// 1) ตาราง mapping MENU_* → TabKey + component + icon
const MENU_TO_TAB: Record<
  string,
  { tab: keyof RootTabParamList; component: () => JSX.Element; icon: string; title?: string }
> = {
  MENU_HOME:     { tab: 'HomeTab',    component: () => <HomeStack />,      icon: 'home-outline',       title: 'Home' },
  MENU_LEAVE:    { tab: 'HistoryTab', component: () => <LeaveRequestPro />,icon: 'time-outline',       title: 'ลา'  }, // หรือใช้ RequestTab ตาม flow ของคุณ
  MENU_TEAM:     { tab: 'TeamTab',    component: () => <TeamScreen />,     icon: 'people-outline',     title: 'ทีม' },
  MENU_PROFILE:  { tab: 'ProfileTab', component: () => <ProfileStack />,   icon: 'person-outline',     title: 'โปรไฟล์' },
  MENU_REPORTS:  { tab: 'PerksTab',   component: () => <PerksScreen />,    icon: 'stats-chart-outline',title: 'สถิติ' }, // ชั่วคราว: map รายงานไป PerksTab หรือสร้าง ReportTab ให้ตรงก็ได้
  MENU_CHECKIN:  { tab: 'RequestTab', component: () => <CheckinScreen />, icon: 'location-outline',  title: 'เช็คอิน' }, // ตัวอย่างถ้าจะเพิ่ม
  MENU_TASKS:    { tab: 'TasksScreen', component: () => <TasksScreen />,   icon: 'checkmark-circle-outline', title: 'งาน' },
};

export default function MainTabs(): JSX.Element {
  const profile = useAuthStore((s) => s.profile);
  useEffect(() => {
    if (!profile) resetToLogin();
  }, [profile]);
  if (!profile) return <></>;

  const rootMenus = useMemo(
    () => (profile.menus || []).filter((m) => m.parent_key == null),
    [profile.menus]
  );

  const tabs = useMemo(() => {
    const acc: Array<{ key: string; tab: keyof RootTabParamList; component: () => JSX.Element; title: string; icon: string }> = [];
    const used = new Set<keyof RootTabParamList>();

    for (const m of rootMenus) {
      const map = MENU_TO_TAB[m.key];
      if (!map) continue; // ไม่มี mapping ก็ข้าม
      if (used.has(map.tab)) continue; // กันซ้ำ (เผื่อมีหลาย MENU map ไป tab เดียว)
      used.add(map.tab);
      acc.push({
        key: m.key,
        tab: map.tab,
        component: map.component,
        title: m.title || map.title || m.key, // ใช้ title จาก profile ถ้ามี
        icon: map.icon,
      });
    }

    return acc;
  }, [rootMenus]);

  const initialRouteName: keyof RootTabParamList = tabs.find(t => t.tab === 'HomeTab')?.tab || (tabs[0]?.tab ?? 'HomeTab');

  return (
    <Tab.Navigator initialRouteName={initialRouteName} screenOptions={{ headerShown: false }}>
      {tabs.map((t) => (
        <Tab.Screen
          key={t.key}
          name={t.tab}
          component={t.component as any}
          options={{
            title: t.title,
            tabBarIcon: ({ color, size }) => <Ionicons name={t.icon as any} color={color} size={size} />,
          }}
        />
      ))}
    </Tab.Navigator>
  );
}
