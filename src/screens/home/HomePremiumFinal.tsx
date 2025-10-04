// src/screens/HomePremiumFinal.tsx
import React from 'react';
import {
  SafeAreaView, View, Text, StyleSheet, ScrollView, Pressable,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

/** ---------- THEME ---------- */
const T = {
  bg: '#F5F7FA',
  text: '#0F172A',
  sub: '#64748B',
  border: 'rgba(15,23,42,0.06)',
  shadow: 'rgba(15,23,42,0.14)',
  teal: '#0EA5A5',
  tealDeep: '#087E7B',
  glass: 'rgba(255,255,255,0.82)',
};

/** ---------- SCREEN ---------- */
export default function HomePremiumFinal() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }}>
      {/* Header (พี่บอกว่า OK แล้ว) */}
      <View style={S.header}>
        <View style={S.hLeft}>
          <View style={S.avatar} />
          <View>
            <Text style={S.name}>โยธารักษ์ ผลาโชติ</Text>
            <Text style={S.role}>HR Manager</Text>
          </View>
        </View>
        <Pressable hitSlop={8}>
          <Ionicons name="notifications-outline" size={22} color={T.text} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={S.body} showsVerticalScrollIndicator={false}>
        {/* HERO — premium gradient + soft glass button */}
        <LinearGradient
          colors={['#18C1B7', '#66D2C7']}
          start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }}
          style={S.hero}
        >
          <View style={S.heroRow}>
            <View>
              <Text style={S.heroDate}>Tue, 30 Sep</Text>
              <Text style={S.heroTitle}>ไม่มีคำขอลาค้างอนุมัติ</Text>
            </View>
            <View style={S.heroBadge}><Text style={S.heroBadgeTxt}>0 Pending</Text></View>
          </View>

          <Pressable
            style={({ pressed }) => [S.heroBtn, pressed && { opacity: 0.9 }]}
            android_ripple={{ color: 'rgba(255,255,255,0.15)' }}
          >
            <Ionicons name="add" size={20} color="#fff" />
            <Text style={S.heroBtnTxt}>Request Leave</Text>
          </Pressable>
        </LinearGradient>

        {/* QUICK ACTIONS — Floating tiles (นูนสวย) */}
        <View style={S.qaGrid}>
          {[
            { key: 'req', icon: 'calendar-outline', label: 'Request' },
            { key: 'hist', icon: 'time-outline', label: 'History' },
            { key: 'team', icon: 'people-outline', label: 'Team' },
            { key: 'policy', icon: 'document-text-outline', label: 'Policy' },
          ].map((it) => (
            <Pressable
              key={it.key}
              style={({ pressed }) => [S.tile, pressed && S.tilePressed]}
            >
              <View style={S.tileIcon}>
                <Ionicons name={it.icon} size={18} color={T.text} />
              </View>
              <Text style={S.tileTxt} numberOfLines={1}>{it.label}</Text>
            </Pressable>
          ))}
        </View>

        {/* LEAVE BALANCE — Gradient bars + number */}
        <View style={S.card}>
          <Text style={S.secTitle}>Leave Balance</Text>
          {[
            { label: 'Vacation', used: 2, total: 10, grad: ['#0EA5A5', '#67E8F9'] },
            { label: 'Sick',     used: 5, total: 10, grad: ['#2563EB', '#60A5FA'] },
            { label: 'Personal', used: 3, total: 10, grad: ['#F59E0B', '#FDE68A'] },
          ].map((x) => {
            const pct = Math.min(100, Math.round((x.used / x.total) * 100));
            return (
              <View key={x.label} style={S.barRow}>
                <View style={S.barHead}>
                  <Text style={S.barLabel}>{x.label}</Text>
                  <Text style={S.barVal}>{x.total - x.used} left</Text>
                </View>
                <View style={S.track}>
                  <LinearGradient
                    colors={x.grad}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                    style={[S.fill, { width: `${pct}%` }]}
                  />
                </View>
              </View>
            );
          })}
        </View>

        {/* HR NEWS — Premium horizontal cards */}
        <View style={S.headRow}>
          <Text style={S.secTitle}>HR News</Text>
          <Pressable><Text style={S.link}>See all</Text></Pressable>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={S.newsRow}>
          {[
            { title: 'Updated Leave Policy', date: '2025-09-15' },
            { title: 'Quarterly Townhall', date: '2025-10-04' },
            { title: 'Wellness Program', date: '2025-10-10' },
          ].map((n) => (
            <Pressable key={n.title} style={({ pressed }) => [S.newsCard, pressed && { transform: [{ scale: 0.98 }] }]} >
              <View style={S.newsChip}><Text style={S.newsChipTxt}>News</Text></View>
              <Text style={S.newsTitle} numberOfLines={2}>{n.title}</Text>
              <Text style={S.newsDate}>{n.date}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={{ height: 28 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

/** ---------- STYLES ---------- */
const S = StyleSheet.create({
  header: {
    paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  hLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#E6EEF5',
    borderWidth: 1, borderColor: 'rgba(15,23,42,0.08)',
  },
  name: { fontSize: 18, fontWeight: '800', color: T.text },
  role: { fontSize: 13, color: T.sub, marginTop: 2 },

  body: { paddingHorizontal: 16, paddingTop: 8, gap: 18 },

  /** HERO */
  hero: {
    borderRadius: 22, padding: 16,
    shadowColor: T.shadow, shadowOpacity: 0.18, shadowRadius: 14, elevation: 2,
  },
  heroRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  heroDate: { color: '#E6FFFB', fontSize: 12, fontWeight: '700' },
  heroTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '900', marginTop: 4 },
  heroBadge: {
    backgroundColor: 'rgba(255,255,255,0.22)', paddingHorizontal: 10,
    height: 26, borderRadius: 999, alignItems: 'center', justifyContent: 'center',
  },
  heroBadgeTxt: { color: '#fff', fontWeight: '800', fontSize: 12 },
  heroBtn: {
    height: 48, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)',
    backgroundColor: 'rgba(0,0,0,0.18)', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  heroBtnTxt: { color: '#fff', fontWeight: '900', fontSize: 15 },

  /** Quick actions */
  qaGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between' },
  tile: {
    width: '48%', paddingVertical: 16, paddingHorizontal: 14,
    backgroundColor: T.glass, borderRadius: 18,
    borderWidth: 1, borderColor: T.border,
    shadowColor: T.shadow, shadowOpacity: 0.10, shadowRadius: 12, elevation: 1,
  },
  tilePressed: { transform: [{ translateY: 1 }], shadowOpacity: 0.06 },
  tileIcon: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: '#F6FAFF',
    alignItems: 'center', justifyContent: 'center', marginBottom: 8,
    borderWidth: 1, borderColor: T.border,
  },
  tileTxt: { fontSize: 14, fontWeight: '800', color: T.text },

  /** Card & bars */
  card: {
    backgroundColor: '#fff', borderRadius: 18, padding: 16,
    borderWidth: 1, borderColor: T.border,
    shadowColor: T.shadow, shadowOpacity: 0.08, shadowRadius: 10, elevation: 1,
  },
  secTitle: { fontSize: 15, fontWeight: '900', color: T.text },
  barRow: { marginTop: 12 },
  barHead: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  barLabel: { color: T.text, fontWeight: '700' },
  barVal: { color: T.tealDeep, fontWeight: '800' },
  track: { height: 10, backgroundColor: '#EEF2F6', borderRadius: 999, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 999 },

  /** News */
  headRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  link: { color: T.teal, fontWeight: '900' },
  newsRow: { gap: 12, paddingRight: 4, paddingTop: 6 },
  newsCard: {
    width: 240, backgroundColor: '#fff', borderRadius: 16, padding: 14,
    borderWidth: 1, borderColor: T.border,
    shadowColor: T.shadow, shadowOpacity: 0.08, shadowRadius: 10, elevation: 1,
  },
  newsChip: {
    alignSelf: 'flex-start', backgroundColor: '#E6F7F5',
    paddingHorizontal: 8, height: 22, borderRadius: 999, alignItems: 'center', justifyContent: 'center', marginBottom: 8,
  },
  newsChipTxt: { color: T.tealDeep, fontWeight: '800', fontSize: 12 },
  newsTitle: { color: T.text, fontWeight: '900', fontSize: 15, marginBottom: 6 },
  newsDate: { color: '#94A3B8', fontSize: 12 },
});
