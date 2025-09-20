// MainApp.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import BottomTabBar, { TabName } from '../components/BottomTabBar';
import HomeLaloei from './HomeDashboard';



// กำหนด mapping ให้ตรงกับชื่อหน้าที่คุณประกาศใน Stack
const TAB_TO_ROUTE: Record<TabName, string> = {
  Home: 'Home',
  Requests: 'LeaveRequests',
  LeaveHistory: 'LeaveHistory',
  Team: 'Team',
  Perks: 'Perks',
  Profile: 'Profile',
};

const MainApp = ({ navigation }: any) => {
  const goTab = (tab: TabName) => {
    const route = TAB_TO_ROUTE[tab];
    if (route) navigation.navigate(route as never);
  };

  return (
    <View style={{ flex: 1 }}>
      <HomeLaloei
        onRequestLeave={() => navigation.navigate('LeaveRequest')}
        onOpenHistory={() => navigation.navigate('LeaveHistory')}
        onOpenApprovals={() => navigation.navigate('ApprovalList')}
        onOpenTeam={() => navigation.navigate('Team')}
        onOpenSummary={() => navigation.navigate('LeaveSummary')}
        onOpenNews={() => navigation.navigate('HRNews')}
      />

      <View style={styles.bottomTabBarContainer}>
        <BottomTabBar active="Home" onChange={goTab} />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  bottomTabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    // backgroundColor: 'rgba(255, 255, 255, 0.8)', // Optional: Add a semi-transparent background
    paddingBottom: 10, // Optional: Add some padding at the bottom
  },
});

export default MainApp;
