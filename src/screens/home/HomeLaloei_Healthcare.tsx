// src/screens/HomeFinal.tsx
import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function HomeFinal() {
  return (
<>
      {/* HEADER */}
      <LinearGradient
        colors={['#6ECEDB', '#98D9D8', '#E0EAF2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={S.header}
      >
        <View style={S.headerTop}>
          <Image source={require('@/assets/icon1.png')} style={S.avatar} />
          <View style={{ flex: 1 }}>
            <Text style={S.greeting}>Good morning</Text>
            <Text style={S.userName}>โยธารักษ์</Text>
          </View>
          <Ionicons name="notifications-outline" size={22} color="#fff" />
        </View>

        {/* Date Card */}
        <View style={S.glassCard}>
          <View style={S.dayDot} />
          <Text style={S.glassText}>Tue, 30 Sep</Text>
        </View>

        {/* Request CTA */}
        <Pressable style={S.ctaGlass}>
          <Ionicons name="add" size={18} color="#fff" />
          <Text style={S.ctaText}>Request Leave</Text>
        </Pressable>
      </LinearGradient>

      {/* BODY */}
      <ScrollView contentContainerStyle={S.body} showsVerticalScrollIndicator={false}>
        {/* Quick Actions */}
        <View style={S.quickRow}>
          <Quick icon="calendar-outline" label="Request" />
          <Quick icon="time-outline" label="History" />
          <Quick icon="people-outline" label="Team" />
          <Quick icon="document-text-outline" label="Policy" />
        </View>

        {/* Leave Balance */}
        <View style={S.card}>
          <Text style={S.cardTitle}>Leave Balance</Text>

          <BalanceItem label="Vacation" days={8} value={80} />
          <BalanceItem label="Sick" days={5} value={50} />
          <BalanceItem label="Personal" days={3} value={30} />
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
      </>
  );
}

/* ========== Components ========== */
function Quick({ icon, label }: { icon: string; label: string }) {
  return (
    <Pressable style={S.quick}>
      <View style={S.quickIconWrap}>
        <Ionicons name={icon as any} size={20} color="#0F172A" />
      </View>
      <Text style={S.quickText}>{label}</Text>
    </Pressable>
  );
}

function BalanceItem({ label, days, value }: { label: string; days: number; value: number }) {
  return (
    <View style={{ marginTop: 12 }}>
      <View style={S.balanceRow}>
        <Text style={S.balanceLabel}>{label}</Text>
        <Text style={S.balanceVal}>{days} days</Text>
      </View>
      <View style={S.track}>
        <View style={[S.fill, { width: `${value}%` }]} />
      </View>
    </View>
  );
}

/* ========== Styles ========== */
const S = StyleSheet.create({
  header: {
    // paddingTop: 28,
    // paddingHorizontal: 16,
    // paddingBottom: 20,
    // borderBottomLeftRadius: 28,
    // borderBottomRightRadius: 28,
    width: '100%',
    height: 200,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.45)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
  },
  greeting: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  userName: { color: '#FFFFFF', fontSize: 14, opacity: 0.92, marginTop: 2 },

  glassCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderColor: 'rgba(255,255,255,0.45)',
    borderWidth: 1,
    paddingHorizontal: 14,
    height: 48,
    borderRadius: 16,
    marginBottom: 12,
  },
  dayDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#F7D96F',
  },
  glassText: { color: '#FFFFFF', fontWeight: '800' },

  ctaGlass: {
    height: 56,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  ctaText: { color: '#fff', fontSize: 16, fontWeight: '900' },

  body: { paddingHorizontal: 16, paddingTop: 16, gap: 16 },

  quickRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  quick: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E7EEF3',
  },
  quickIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#F1F7F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E7EEF3',
  },
  quickText: { fontSize: 12, fontWeight: '700', color: '#0F172A' },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E7EEF3',
  },
  cardTitle: { fontSize: 18, fontWeight: '900', color: '#0F172A' },

  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  balanceLabel: { color: '#0F172A', fontWeight: '800' },
  balanceVal: { color: '#0EA5A5', fontWeight: '900' },

  track: {
    height: 10,
    backgroundColor: '#E6EDF3',
    borderRadius: 999,
    overflow: 'hidden',
    marginTop: 6,
  },
  fill: { height: '100%', borderRadius: 999, backgroundColor: '#0EA5A5' },
});
