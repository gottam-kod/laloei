// navigation/MainTabs.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import BottomTabBar, { TabName } from '../components/BottomTabBar';

import DashboardLaloei from '../screens/HomeDashboard';
import LeaveRequestScreen from '../screens/LeaveRequestScreen';
import TeamScreen from '../screens/TeamScreen';
import PerksScreen from '../screens/PerksScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LeaveHistoryScreen from '../screens/LeaveHistoryScreen';
import LeaveApprovals from '../screens/LeaveApprovals';

import { MainTabParamList } from './RootStackParamList';

const Tab = createBottomTabNavigator<MainTabParamList>();
export default function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="HomeTab" component={DashboardLaloei} options={{ title: 'หน้าหลัก' }} />
      <Tab.Screen name="HistoryTab" component={LeaveHistoryScreen} options={{ title: 'ประวัติ' }} />
      <Tab.Screen name="TeamTab" component={TeamScreen} options={{ title: 'ทีม' }} />
      <Tab.Screen name="PerksTab" component={PerksScreen} options={{ title: 'สิทธิพิเศษ' }} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ title: 'โปรไฟล์' }} />
    </Tab.Navigator>
  );
}
