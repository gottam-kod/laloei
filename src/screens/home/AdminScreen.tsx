// src/screens/home/MgScreen.tsx
import React from 'react';
import HomeBase, { QA, News, Balance, Upcoming } from './HomeScreen';
import DashboardOverview from './DashboardOverview';

export default function AdminScreen() {
  const qa: QA[] = [
    { key:'req',  icon:'calendar-outline',         label:'Request' },
    { key:'hist', icon:'time-outline',              label:'History' },
    { key:'appr', icon:'checkmark-done-outline',    label:'Approvals', badge:1 },
    { key:'team', icon:'people-outline',            label:'Team' },
  ];

  const balances: Balance[] = [
    { label:'Vacation', used:4, total:10, grad:['#0EA5A5','#83cdcdff'] },
    { label:'Sick',     used:2, total:10, grad:['#2563EB','#60A5FA'] },
    { label:'Personal', used:1, total:10, grad:['#F59E0B','#FDE68A'] },
  ];

  const news: News[] = [
    { title:'New OKR Cycle', date:'2025-10-10' },
  ];

  const upcoming: Upcoming[] = [
    { title:'ลาพักร้อน', date:'12–14 ต.ค. 2025', days:'3 วัน', type:'VAC' },
  ];


  


  return (
    <DashboardOverview
      userName="Admin User"
      orgName="บริษัท A"
      role="owner"
      monthlyUsedDays={[
        { monthLabel: 'ต.ค.', used: 6 },
        { monthLabel: 'พ.ย.', used: 8 },
        { monthLabel: 'ธ.ค.', used: 10 },
        { monthLabel: 'ม.ค.', used: 12 },
        { monthLabel: 'ก.พ.', used: 16 },
        { monthLabel: 'มี.ค.', used: 24 },
      ]}
      leaveBreakdown={[
        { name: 'พักร้อน', value: 12.5 },
        { name: 'ลาป่วย', value: 8.0 },
        { name: 'ลากิจ', value: 4.5 },
      ]}
      totalThisMonth={6}
      totalSummary={45}
      mostLeaveDateLabel="12–14 ต.ค. 2025"
    />
  );
}
