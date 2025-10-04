// src/navigation/RootTabs.tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { JSX, useMemo } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/src/store/useAuthStore';
import HomeStack from '@/src/navigation/HomeStack';
import TeamScreen from '@/src/screens/TeamScreen';
import PerksScreen from '@/src/screens/PerksScreen';
import ProfileStack from '@/src/navigation/ProfileStack';
import { Role, TAB_POLICY, TabKey } from '@/src/auth/roles';
import { navigationRef, resetToLogin } from './navigationRef';
import NotificationsScreen from '../screens/NotificationsScreen';

// Tab type (คงแบบเดิมของคุณ)
export type RootTabParamList = {
  HomeTab: undefined;
  HistoryTab: undefined;
  TeamTab: undefined;
  PerksTab: undefined;
  ProfileTab: undefined;
  Notifications: undefined;
};
const Tab = createBottomTabNavigator<RootTabParamList>();

export default function MainTabs(): JSX.Element {


  const profile = useAuthStore(s => s.profile); // คาดว่ามี role + menus
  if (!profile){
    resetToLogin();
  } 

  // ป้องกันกรณีข้อมูลยังไม่มา
  const role = (profile?.role as unknown as Role) ?? 'EMP';

  // 1) สิทธิ์ขั้นแรกจาก role
  const allowedByRole = TAB_POLICY[role];

  // 2) ถ้ามี menus จากเซิร์ฟเวอร์ (server-driven), ซ้อนเงื่อนไขอีกชั้น
  const hasMenu = (key: string) => profile?.menus?.some((m: any) => m.key === key);
  // map Tab → menuKey ในระบบของคุณ
  const tabToMenuKey: Record<TabKey, string> = {
    HomeTab: 'home',
    HistoryTab: 'leave-history',
    TeamTab: 'team',
    PerksTab: 'perks',
    ProfileTab: 'profile',
  };

  console.log('MainTabsbbbbbbbb: role=', role, ' menus=', profile?.menus, ' allowedTabs=', allowedByRole);

  // 3) คัดแท็บสุดท้ายที่จะโชว์ (intersect ระหว่าง policy กับเมนูจริง)
  const enabledTabs = allowedByRole.filter(tab => hasMenu(tabToMenuKey[tab]));
  if (enabledTabs.length === 0) enabledTabs.push('ProfileTab');

  // 4) initialRouteName ต้องเป็นแท็บที่มีจริง
  const initial = enabledTabs.includes('HomeTab') ? 'HomeTab' : enabledTabs[0];

  // 5) re-mount เมื่อรายการแท็บเปลี่ยน
  const navKey = enabledTabs.join('|');

  return (
    <Tab.Navigator key={navKey} initialRouteName={initial} screenOptions={{ headerShown: false }}>
      {enabledTabs.includes('HomeTab') && (
        <Tab.Screen
          name="HomeTab"
          component={HomeStack}
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" color={color} size={size} />,
          }}
        />
      )}

      {enabledTabs.includes('HistoryTab') && (
        <Tab.Screen
          name="HistoryTab"
          component={HomeStack /* หรือ HistoryStack ของคุณ */}
          options={{
            title: 'Requests',
            tabBarIcon: ({ color, size }) => <Ionicons name="time-outline" color={color} size={size} />,
          }}
        />
      )}

      {enabledTabs.includes('TeamTab') && (
        <Tab.Screen
          name="TeamTab"
          component={TeamScreen}
          options={{
            title: 'Team',
            tabBarIcon: ({ color, size }) => <Ionicons name="people-outline" color={color} size={size} />,
          }}
        />
      )}

      {enabledTabs.includes('PerksTab') && (
        <Tab.Screen
          name="PerksTab"
          component={PerksScreen}
          options={{
            title: 'Perks',
            tabBarIcon: ({ color, size }) => <Ionicons name="star-outline" color={color} size={size} />,
          }}
        />
      )}

      {enabledTabs.includes('ProfileTab') && (
        <Tab.Screen
          name="ProfileTab"
          component={ProfileStack}
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" color={color} size={size} />,
          }}
        />
      )}
      {/* <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        // options={{
        //   title: 'Dashboard',
        //   tabBarIcon: ({ color, size }) => <Ionicons name="grid-outline" color={color} size={size} />,
        // }}
      /> */}
    </Tab.Navigator>
  );
}
