// src/navigation/HomeStack.tsx
import type { HomeStackParamList } from '@/src/navigation/RootStackParamList';
import LeaveApprovals from '@/src/screens/leave/LeaveApprovals';
import LeaveHistoryScreen from '@/src/screens/leave/LeaveHistoryScreen'; // ถ้ายังไม่มี ใช้ placeholder ชั่วคราว
import LeaveRequestList from '@/src/screens/leave/LeaveRequestScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import NotificationsScreen from '../screens/NotificationsScreen';
import CalendarScreen from '../screens/home/CalendarScreen';
import MainScreen from '../screens/home/MainScreen';
import ProfileStack from './ProfileStack';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStack() {
  return (
    <Stack.Navigator initialRouteName="LaloeiHome" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LaloeiHome" component={MainScreen} />
      <Stack.Screen name="LeaveRequest" component={LeaveRequestList} options={{ headerShown: false, title: 'คำขอลา' }} />
      <Stack.Screen name="LeaveHistory" component={LeaveHistoryScreen} options={{ headerShown: false, title: 'ประวัติการลา' }} />
      <Stack.Screen name="ApproveCenter" component={LeaveApprovals} options={{ headerShown: false, title: 'อนุมัติ' }} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ headerShown: false, title: 'การแจ้งเตือน' }} />
      <Stack.Screen name='ProfileScreen' component={ProfileStack} options={{ headerShown: false, title: 'Profile' }} />
      <Stack.Screen name='CalendarScreen' component={CalendarScreen} options={{ headerShown: false, title: 'ปฏิทิน' }} />
    </Stack.Navigator>
  );
}
