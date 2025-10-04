// src/navigation/HomeStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '@/src/navigation/RootStackParamList';

// ✅ หน้าต่าง ๆ
import LeaveRequestList from '@/src/screens/LeaveRequestScreen';
import LeaveRequestForm from '@/src/screens/LeaveRequestScreen';
import LeaveHistoryScreen from '@/src/screens/LeaveHistoryScreen';
// import ApprovalList from '@/src/screens/ApprovalList';        // ถ้ายังไม่มี ใช้ placeholder ชั่วคราว
// import HRNews from '@/src/screens/HRNews';                    // ถ้ายังไม่มี ใช้ placeholder ชั่วคราว
// import CheckInScreen from '@/src/screens/CheckInScreen';      // ถ้ายังไม่มี ใช้ placeholder ชั่วคราว
import HomeRole from '../screens/home/Home';
import NotificationsScreen from '../screens/NotificationsScreen';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStack() {
  return (
    <Stack.Navigator initialRouteName="HomeDashboard" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeDashboard" component={HomeRole} />
      <Stack.Screen name="Requests" component={LeaveRequestList} options={{ headerShown: false, title: 'คำขอลา' }} />
      <Stack.Screen name="LeaveRequest" component={LeaveRequestForm} options={{ headerShown: false, title: 'สร้างคำขอ' }} />
      <Stack.Screen name="LeaveSummary" component={LeaveHistoryScreen} options={{ headerShown: false, title: 'ประวัติการลา' }} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ headerShown: false, title: 'การแจ้งเตือน' }} />
      {/* <Stack.Screen name="ApprovalList" component={ApprovalList} options={{ headerShown: true, title: 'อนุมัติ' }} /> */}
      {/* <Stack.Screen name="HRNews" component={HRNews} options={{ headerShown: true, title: 'ข่าวสาร HR' }} /> */}
      {/* <Stack.Screen name="CheckInScreen" component={CheckInScreen} options={{ headerShown: true, title: 'เช็คอิน' }} /> */}
    </Stack.Navigator>
  );
}
