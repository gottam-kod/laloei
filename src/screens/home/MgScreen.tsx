// src/screens/home/MgScreen.tsx
import React from 'react';
import HomeBase, { QA, News, Balance, Upcoming } from './HomeScreen';

export default function MgScreen() {
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
    <HomeBase
      variant="premium"
      userName="ผู้จัดการ"
      userRole="Manager"
      avatar={require('@/assets/icon1.png')}
      qa={qa}
      news={news}
      balances={balances}
      upcoming={upcoming}
    />
  );
}
