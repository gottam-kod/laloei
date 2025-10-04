// screens/TeamLaloei007.tsx
import React, { useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, Platform, StatusBar,
  TouchableOpacity, TextInput, FlatList,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import useSafeGoBack from '../navigation/useSafeGoBack';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/RootStackParamList';
import { BackgroundFX } from '../components/Background';

type Props = {
  onBack?: () => void;
  onOpenMember?: (id: string) => void;
  onCall?: (phone: string) => void;
  onChat?: (id: string) => void;
};

type Member = {
  id: string;
  name: string;
  role: string;
  dept: string;
  phone?: string;
  isManager?: boolean;
  isOnLeaveToday?: boolean;
};

const COLOR = {
  bgTopA: '#E8F3FF',
  bgTopB: '#F4FBFF',
  brand: '#5491b0ff',
  brandSoft: '#E0F2FF',
  dark: '#0F172A',
  dim: '#607089',
  card: '#FFFFFF',
  line: '#EAF0F6',
  success: '#20C997',
  warn: '#FFB020',
};

const SHADOW = Platform.select({
  ios: { shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 6 } },
  android: { elevation: 4 },
});

const FILTERS = [
  { key: 'all', label: 'ทั้งหมด' },
  { key: 'myteam', label: 'ทีมของฉัน' },
  { key: 'onleave', label: 'ลาวันนี้' },
] as const;
type FilterKey = typeof FILTERS[number]['key'];

const MOCK: Member[] = [
  { id: 'u1', name: 'ธนภพ พรหมอินทร์', role: 'iOS Engineer', dept: 'พัฒนาแอพ', phone: '080-111-2222', isManager: false, isOnLeaveToday: false },
  { id: 'u2', name: 'สิรินาถ จันทร์เพ็ง', role: 'QA', dept: 'ทดสอบระบบ', phone: '081-555-9999', isManager: false, isOnLeaveToday: true },
  { id: 'u3', name: 'วริศรา สมใจ', role: 'Product Manager', dept: 'ผลิตภัณฑ์', phone: '082-333-4444', isManager: true, isOnLeaveToday: false },
  { id: 'u4', name: 'กฤษฎา ดวงดี', role: 'Backend', dept: 'แพลตฟอร์ม', phone: '089-777-0000', isManager: false, isOnLeaveToday: false },
];

const TeamScreen: React.FC<Props> = ({ onOpenMember, onCall, onChat }) => {
  const nav = useNavigation<NavigationProp<RootStackParamList>>();
  const safeGoBack = useSafeGoBack(nav);
  
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<FilterKey>('all');

  const data = useMemo(() => {
    let list = MOCK;
    if (filter === 'myteam') list = list.filter(m => !m.isManager); // สมมุติว่า my team = ลูกทีม
    if (filter === 'onleave') list = list.filter(m => m.isOnLeaveToday);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q) ||
        m.dept.toLowerCase().includes(q)
      );
    }
    return list;
  }, [query, filter]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F7FAFD' }}>
      <BackgroundFX />
      <StatusBar barStyle="dark-content" />

      {/* HEADER: gradient เป็นพื้นหลัง */}
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={[COLOR.bgTopA, COLOR.bgTopB]}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => safeGoBack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={styles.back}>{'‹'}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>ทีมงาน</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Search */}
        <View style={[styles.searchWrap, SHADOW as any]}>
          <Text style={styles.searchIcon}>🔎</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="ค้นหาชื่อ, ตำแหน่ง หรือแผนก"
            value={query}
            onChangeText={setQuery}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Filters */}
        <View style={styles.filterRow}>
          {FILTERS.map(f => {
            const active = filter === f.key;
            return (
              <TouchableOpacity
                key={f.key}
                onPress={() => setFilter(f.key)}
                activeOpacity={0.9}
                style={[styles.filterChip, active && styles.filterChipActive]}
              >
                <Text style={[styles.filterText, active && styles.filterTextActive]}>{f.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <FlatList
        contentContainerStyle={{ padding: 16, paddingBottom: 140 }}
        data={data}
        keyExtractor={(m) => m.id}
        ListEmptyComponent={
          <View style={[styles.card, { alignItems: 'center' }]}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: COLOR.dark }}>ไม่พบสมาชิก</Text>
            <Text style={{ fontSize: 13, color: COLOR.dim, marginTop: 6 }}>ลองเปลี่ยนตัวกรองหรือค้นหาใหม่</Text>
          </View>
        }
        renderItem={({ item }) => (
          <MemberCard
            m={item}
            onPress={() => onOpenMember?.(item.id)}
            onCall={() => item.phone && onCall?.(item.phone)}
            onChat={() => onChat?.(item.id)}
          />
        )}
      />
    </SafeAreaView>
  );
};

export default TeamScreen;

/* ---------------- Sub Components ---------------- */

const MemberCard: React.FC<{
  m: Member;
  onPress?: () => void;
  onCall?: () => void;
  onChat?: () => void;
}> = ({ m, onPress, onCall, onChat }) => {
  return (
    <TouchableOpacity style={[styles.card, SHADOW]} activeOpacity={0.9} onPress={onPress}>
      <View style={styles.memberRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{m.name[0]}</Text>
        </View>

        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.name} numberOfLines={1}>{m.name}</Text>
            {m.isManager && <View style={styles.badge}><Text style={styles.badgeText}>หัวหน้า</Text></View>}
          </View>
          <Text style={styles.role} numberOfLines={1}>{m.role} · {m.dept}</Text>

          {m.isOnLeaveToday && (
            <View style={styles.leavePill}>
              <Text style={styles.leavePillText}>ลาวันนี้</Text>
            </View>
          )}
        </View>

        <View style={styles.actionCol}>
          <TouchableOpacity style={styles.actionBtn} onPress={onChat} activeOpacity={0.9}>
            <Text style={styles.actionEmoji}>💬</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={onCall} activeOpacity={0.9}>
            <Text style={styles.actionEmoji}>📞</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: Platform.OS === 'ios' ? 64 : 52,
    paddingBottom: 14,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  back: { fontSize: 26, color: COLOR.dim, lineHeight: 26 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: COLOR.dark },

  searchWrap: {
    marginTop: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1, borderColor: COLOR.line,
    paddingHorizontal: 12, paddingVertical: 10,
    flexDirection: 'row', alignItems: 'center', gap: 8,
  },
  searchIcon: { fontSize: 16, color: COLOR.dim },
  clearIcon: { fontSize: 16, color: COLOR.dim },
  searchInput: { flex: 1, fontSize: 14, color: COLOR.dark },

  filterRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  filterChip: {
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999,
    backgroundColor: '#F3F7FB', borderWidth: 1, borderColor: 'transparent',
  },
  filterChipActive: { backgroundColor: COLOR.brandSoft, borderColor: '#D4EAFE' },
  filterText: { fontSize: 12.5, color: COLOR.dim, fontWeight: '700' },
  filterTextActive: { color: COLOR.brand },

  card: {
    backgroundColor: COLOR.card,
    borderRadius: 20,
    borderWidth: 1, borderColor: COLOR.line,
    padding: 14,
    marginTop: 14,
  },

  memberRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: '#E3ECFF', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#D7E2FF',
  },
  avatarText: { fontSize: 22, color: '#3556C7', fontWeight: '900' },
  name: { fontSize: 15.5, fontWeight: '900', color: COLOR.dark, marginRight: 8 },
  role: { fontSize: 12.5, color: COLOR.dim, marginTop: 2 },

  badge: {
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999,
    backgroundColor: '#E9FBF4', borderWidth: 1, borderColor: '#CFF3E6',
  },
  badgeText: { fontSize: 11.5, fontWeight: '800', color: '#0A7C66' },

  leavePill: {
    alignSelf: 'flex-start', marginTop: 6,
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999,
    backgroundColor: '#FFF6E5', borderWidth: 1, borderColor: '#FFE1B3',
  },
  leavePillText: { fontSize: 11.5, fontWeight: '800', color: '#9A6400' },

  actionCol: { gap: 8 },
  actionBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#F3F7FB',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: COLOR.line,
  },
  actionEmoji: { fontSize: 16 },
});
