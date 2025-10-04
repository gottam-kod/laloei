// src/screens/home/HomeBase.tsx
import React, { useCallback, memo } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View, Pressable, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { BackgroundFX } from '@/src/components/Background';
import QuoteFloat from '@/src/components/QuoteFloat';
import { HeaderBar } from '@/src/components/HeaderProfile';
import { SectionTitle, BalanceCard } from '@/src/components';
import { QuickActions } from '@/src/components/QuickAction';
import UpcomingCard from '@/src/components/UpcomingCard';
import { UI } from '@/src/theme/theme';
import { HomeStackParamList, RootStackParamList } from '@/src/navigation/RootStackParamList';
import { NewsCarousel } from '@/src/components/NewsCarousel';

export type QA = { key:string; icon:string; label:string; badge?:number };
export type News = { title:string; date:string };
export type Balance = { label:string; used:number; total:number; grad?:[string,string] };
export type Upcoming = { title:string; date:string; days:string; type:'VAC'|'SICK'|'OTHER' };

type Props = {
  // presentation
  variant?: 'modern' | 'premium';
  userName: string;
  userRole: string;
  avatar: any;

  // data
  qa: QA[];
  news: News[];
  balances: Balance[];
  upcoming: Upcoming[];

  // hooks (optional)
  onRequestLeave?: ()=>void;
  onSeeAllNews?: ()=>void;
  onSeeAllUpcoming?: ()=>void;
  onTapQA?: (key:string)=>void;
};

export default function HomeScreen({
  variant='premium',
  userName,
  userRole,
  avatar,
  qa,
  news,
  balances,
  upcoming,
  onRequestLeave,
  onSeeAllNews,
  onSeeAllUpcoming,
  onTapQA,
}: Props) {
  const nav = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const rootNav = useNavigation<NavigationProp<RootStackParamList>>();

  const handleQuickAction = useCallback((k: string) => {
    switch (k) {
      case 'req':             // คำขอลา
        onRequestLeave?.();
        nav.navigate('Requests');
        break;
      case 'hist':            // ประวัติการลา
        nav.navigate('LeaveSummary');
        onTapQA?.('hist');
        break;
      case 'appr':            // อนุมัติ (มีสำหรับ HR/Manager)
        nav.navigate('ApprovalList');
        onTapQA?.('appr');
        break;
      case 'team':            // ไปแท็บทีม
        rootNav.navigate('MainTabs', { screen: 'TeamTab' });
        onTapQA?.('team');
        break;
      case 'pol':             // ไปแท็บนโยบาย/โปรไฟล์ (แล้วแต่ระบบคุณเก็บหน้าไว้ที่ไหน)
        rootNav.navigate('MainTabs', { screen: 'ProfileTab' });
        onTapQA?.('pol');
        break;
      default:
        console.warn('Unknown action:', k);
    }
  }, [nav, rootNav, onRequestLeave, onTapQA]);

  return (
    <SafeAreaView style={S.root}>
      <BackgroundFX />
      <HeaderBar avatar={avatar} name={userName} role={userRole} />

      <ScrollView contentContainerStyle={S.wrap} showsVerticalScrollIndicator={false}>
        <QuoteFloat
          th="ความพยายามอยู่ที่ไหน ความสำเร็จอยู่ที่นั้น"
          en="Where there is effort, there is success."
          speed={50}
          gap={40}
        />

        <SectionTitle icon="flash-outline" title="Quick Actions" />
        <QuickActions items={qa.map(q => ({ ...q, badge: q.badge ?? 0 }))} onPress={handleQuickAction} />

        <SectionTitle icon="trail-sign-outline" title="Leave Balance" />
        <BalanceCard variant={variant} items={balances} />

        <SectionTitle icon="calendar-clear-outline" title="กำลังจะลา" rightLink="See all" onRightPress={onSeeAllUpcoming} />
        <UpcomingCard data={upcoming} />

        <SectionTitle icon="newspaper-outline" title="HR News" rightLink="See all" onRightPress={onSeeAllNews} />
        <NewsCarousel list={news} />

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
/* ====== Styles ====== */
const S = StyleSheet.create({
  root:{ flex:1, backgroundColor:UI.color.bg },
  wrap:{ paddingHorizontal:UI.space.lg, paddingTop:UI.space.sm, gap:UI.space.lg },

  newsRow:{ gap:UI.space.md, paddingRight:4, paddingTop:6 },
  newsFloat:{
    width:240,
    backgroundColor:'rgba(255,255,255,0.92)',
    borderRadius:UI.radius.lg,
    padding:UI.space.md,
    borderWidth:1, borderColor:'rgba(255,255,255,0.65)',
    shadowColor:'#0f172a', shadowOpacity:0.08, shadowRadius:12, elevation:2,
  },
  liftIdle:{ transform:[{translateY:0}], shadowOpacity:0.08, elevation:2 },
  liftPressed:{ transform:[{translateY:-1}], shadowOpacity:0.12, elevation:4 },
  newsChip:{ alignSelf:'flex-start', backgroundColor:'#E6F7F5', paddingHorizontal:8, height:22, borderRadius:UI.radius.pill, alignItems:'center', justifyContent:'center', marginBottom:8 },
  newsChipTxt:{ color:UI.color.accentDark, fontWeight:'800', fontSize:UI.font.meta },
  newsTitle:{ color:UI.color.text, fontWeight:'900', fontSize:UI.font.h2, marginBottom:6 },
  newsDate:{ color:'#94A3B8', fontSize:UI.font.meta },
});
