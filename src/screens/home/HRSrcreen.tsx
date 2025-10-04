// src/screens/home/HrScreen.tsx
import React from 'react';
import HomeBase, { QA, News, Balance, Upcoming } from './HomeScreen';

export default function HrScreen() {
  const qa: QA[] = [
    { key:'req',  icon:'calendar-outline',         label:'Request' },
    { key:'hist', icon:'time-outline',              label:'History' },
    { key:'appr', icon:'checkmark-done-outline',    label:'Approvals', badge:3 },
    { key:'team', icon:'people-outline',            label:'Team' },
    { key:'pol',  icon:'document-text-outline',     label:'Policy' },
  ];

  const balances: Balance[] = [
    { label:'Vacation', used:7, total:10, grad:['#0EA5A5','#83cdcdff'] },
    { label:'Sick',     used:5, total:10, grad:['#2563EB','#60A5FA'] },
    { label:'Personal', used:3, total:10, grad:['#F59E0B','#FDE68A'] },
  ];

  const news: News[] = [
    { title:'Updated Leave Policy', date:'2025-09-15' },
    { title:'Quarterly Townhall',   date:'2025-10-04' },
  ];

  const upcoming: Upcoming[] = [
    { title:'Annual Leave', date:'2025-10-20', days:'5', type:'VAC' },
    { title:'Sick Leave',   date:'2025-11-02', days:'2', type:'SICK' },
  ];

  return (
    <HomeBase
      variant="premium"
      userName="โยธารักษ์ ผลาโชติ"
      userRole="HR"
      avatar={require('@/assets/icon1.png')}
      qa={qa}
      news={news}
      balances={balances}
      upcoming={upcoming}
    />
  );
}
