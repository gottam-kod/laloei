// src/screens/home/EmpScreen.tsx
import React from 'react';
import HomeBase, { QA, News, Balance, Upcoming } from './HomeScreen';
import { useAuthStore } from '@/src/store/useAuthStore';

export default function EmpScreen() {
const profile = useAuthStore(s => s.profile);
const qa: QA[] = [
  { key:'req',  icon:'calendar-outline',       label:'Request' },
  { key:'hist', icon:'time-outline',            label:'History' },
  { key:'pol',  icon:'document-text-outline',   label:'Policy' },
];

const balances: Balance[] = [
  { label:'Vacation', used:2, total:10, grad:['#0EA5A5','#83cdcdff'] },
  { label:'Sick',     used:1, total:10, grad:['#2563EB','#60A5FA'] },
  { label:'Personal', used:0, total:10, grad:['#F59E0B','#FDE68A'] },
];

const news: News[] = [
  { title:'Wellness Program', date:'2025-10-10' },
];

const upcoming: Upcoming[] = [
  { title:'ลาพักร้อน', date:'20–22 ต.ค. 2025', days:'3 วัน', type:'VAC' },
];

  return (
    <HomeBase
      variant="premium"
      userName={profile?.name || "พนักงาน"}
      userRole="Employee"
      avatar={require('@/assets/icon1.png')}
      qa={qa}
      news={news}
      balances={balances}
      upcoming={upcoming}
    />
  );
}
