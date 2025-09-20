// navigation/MainTabs.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import BottomTabBar, { TabName } from '../components/BottomTabBar';

import DashboardLaloei from '../screens/HomeDashboard';
import LeaveRequestScreen from '../screens/LeaveRequestScreen';
import TeamScreen from '../screens/TeamScreen';
import PerksScreen from '../screens/PerksScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LeaveHistoryScreen from '../screens/LeaveHistoryScreen';
import ProfileStack from '../navigation/ProfileStack';

import { MainTabParamList } from './RootStackParamList';
import { useTranslation } from 'react-i18next';

const Tab = createBottomTabNavigator<MainTabParamList>();
export default function MainTabs() {
  const { t } = useTranslation();

  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="HomeTab"
        component={DashboardLaloei}
        options={{
          title: t('tabs.home'),
          tabBarIcon: () => <Text>🏠</Text>
        }} />
      <Tab.Screen
        name="HistoryTab"
        component={LeaveHistoryScreen}
        options={{
          title: t('tabs.requests'),
          tabBarIcon: () => <Text>📜</Text>
        }}
      />
      <Tab.Screen
        name="TeamTab"
        component={TeamScreen}
        options={{
          title: t('tabs.team'),
          tabBarIcon: () => <Text>👥</Text>
        }} />
      <Tab.Screen
        name="PerksTab"
        component={PerksScreen}
        options={{
          title: t('tabs.perks'),
          tabBarIcon: () => <Text>🎁</Text>
        }} />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{
          title: t('tabs.profile'),
          tabBarIcon: () => <Text>👤</Text>
        }} />
    </Tab.Navigator>
  );
}
