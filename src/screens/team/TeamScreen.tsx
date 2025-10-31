// screens/TeamLaloei007.tsx
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { BackgroundFX } from '@/src/components/Background';
import { instanceAxios } from '@/src/connections/http';
import { RootStackParamList } from '@/src/navigation/RootStackParamList';
import { useTheme } from '@/src/theme/useTheme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MemberCard from './components/MemberCard';

const { theme, mode, toggleMode, THEME } = useTheme();
type Props = {
  onBack?: () => void;
  onOpenMember?: (id: string) => void;
  onCall?: (phone: string) => void;
  onChat?: (id: string) => void;
  onEmail?: (email: string) => void;
};

// ====== Types (รองรับของที่หน้าทีมต้องใช้) ======
type PresenceState = 'online' | 'away' | 'offline';
type WorkingLocation = 'onsite' | 'wfh';

export type Member = {
  id: string;
  name: string;
  role: string;
  dept: string;
  avatarUrl?: string;

  presence?: { state: PresenceState; lastSeenAt?: string };
  working?: {
    location?: WorkingLocation;
    checkedInAt?: string | null;
    onLeaveToday?: { type: 'AL' | 'SL' | 'CL'; note?: string } | null;
  };

  phone?: string;
  email?: string;
  isManager?: boolean;
};

// const COLOR = {
//   bgTopA: '#E8F3FF',
//   bgTopB: '#F4FBFF',
//   brand: '#5491b0ff',
//   brandSoft: '#E0F2FF',
//   dark: '#0F172A',
//   dim: '#607089',
//   card: '#FFFFFF',
//   line: '#EAF0F6',
// };

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

// MOCK เผื่อ API ล้มเหลว
const MOCK: Member[] = [
  { id: 'u1', name: 'ธนภพ พรหมอินทร์', role: 'iOS Engineer', dept: 'พัฒนาแอพ', phone: '080-111-2222', email: 'u1@example.com', isManager: false, working: { location: 'onsite', checkedInAt: '2025-10-30T09:12:00+07:00' } },
  { id: 'u2', name: 'สิรินาถ จันทร์เพ็ง', role: 'QA', dept: 'ทดสอบระบบ', phone: '081-555-9999', email: 'u2@example.com', isManager: false, working: { onLeaveToday: { type: 'AL' } } },
  { id: 'u3', name: 'วริศรา สมใจ', role: 'Product Manager', dept: 'ผลิตภัณฑ์', phone: '082-333-4444', email: 'u3@example.com', isManager: true, working: { location: 'wfh', checkedInAt: '2025-10-30T09:04:00+07:00' } },
  { id: 'u4', name: 'กฤษฎา ดวงดี', role: 'Backend', dept: 'แพลตฟอร์ม', phone: '089-777-0000', email: 'u4@example.com', isManager: false },
];

// -------- util: debounce --------
function useDebounce<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

const TeamScreen: React.FC<Props> = ({ onOpenMember, onCall, onChat, onEmail }) => {
  const nav = useNavigation<NavigationProp<RootStackParamList>>();

  const [query, setQuery] = useState('');
  const debouncedQ = useDebounce(query, 300);
  const [filter, setFilter] = useState<FilterKey>('all');

  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [firstErrorShown, setFirstErrorShown] = useState<boolean>(false);
  const abortRef = useRef<AbortController | null>(null);

  // เรียก API
  async function fetchMembers(opts?: { showLoader?: boolean; signal?: AbortSignal }) {
    const { showLoader = true, signal } = opts || {};
    try {
      if (showLoader) setLoading(true);
      const res = await instanceAxios.get<{ data: Member[] }>(
        '/teams/members',
        {
          params: { filter, q: debouncedQ || '' },
          signal,
          timeout: 10000,
          headers: { accept: 'application/json' },
        }
      );
      setMembers(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch {
      if (!firstErrorShown) {
        setFirstErrorShown(true);
        Alert.alert('เชื่อมต่อไม่ได้', 'จะแสดงข้อมูลตัวอย่างชั่วคราว', [{ text: 'ตกลง' }]);
      }
      setMembers(MOCK);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  // โหลดครั้งแรก + เมื่อ filter/query เปลี่ยน (ใช้ debounce)
  useEffect(() => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    fetchMembers({ showLoader: true, signal: controller.signal });
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, debouncedQ]);

  const data = useMemo(() => members, [members]);

  return (
  <SafeAreaView style={{ flex: 1, backgroundColor: '#F7FAFD' }}>
    <BackgroundFX />
    <StatusBar barStyle="dark-content" />

    {/* Top App Bar แบบเรียบ */}
    <View style={styles.header}>
                <View style={styles.logoCircle}><Ionicons name="checkbox-outline" size={22} color={theme.color.primary}/></View>
                <Text style={styles.title}>Task List</Text>
                <View style={{ flex:1 }}/>
                {/* <SortButton /> */}
              </View>

    {/* เนื้อหา */}
    {loading && data.length === 0 ? (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        <ActivityIndicator />
        <Text style={{ color: theme.color.dim }}>กำลังโหลดรายชื่อทีม…</Text>
      </View>
    ) : (
      <FlatList
        contentContainerStyle={{ padding: 16, paddingBottom: 140 }}
        data={data}
        keyExtractor={(m) => m.id}
        // ทำให้ Search/Filter ลอยเป็นหัว list (ติดอยู่บนสุดเวลาเลื่อน)
        ListHeaderComponent={
          <View style={{ gap: 10 }}>
            {/* Search */}
            <View style={styles.searchWrap}>
              <Ionicons name="search" size={18} color={theme.color.dim} />
              <TextInput
                style={styles.searchInput}
                placeholder="ค้นหาชื่อ, ตำแหน่ง หรือแผนก"
                value={query}
                onChangeText={setQuery}
                returnKeyType="search"
                placeholderTextColor="#9AA7B2"
              />
              {query.length > 0 && (
                <TouchableOpacity onPress={() => setQuery('')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Ionicons name="close-circle" size={18} color={theme.color.dim} />
                </TouchableOpacity>
              )}
            </View>

            {/* Filters แบบ segmented เบาๆ */}
            <View style={styles.segmentBar}>
              {FILTERS.map(f => {
                const active = filter === f.key;
                return (
                  <TouchableOpacity
                    key={f.key}
                    onPress={() => setFilter(f.key)}
                    style={[styles.segment, active && styles.segmentActive]}
                    activeOpacity={0.9}
                  >
                    <Text style={[styles.segmentTxt, active && styles.segmentTxtActive]}>{f.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              abortRef.current?.abort();
              const controller = new AbortController();
              abortRef.current = controller;
              fetchMembers({ showLoader: false, signal: controller.signal });
            }}
          />
        }
        ListEmptyComponent={
          <View style={[styles.cardEmpty, { alignItems: 'center' }]}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: theme.color.dark }}>ไม่พบสมาชิก</Text>
            <Text style={{ fontSize: 13, color: theme.color.dim, marginTop: 6 }}>ลองเปลี่ยนตัวกรองหรือค้นหาใหม่</Text>
          </View>
        }
        renderItem={({ item }) => (
          <MemberCard
            m={{
              ...item,
              presence: item.presence || { state: 'offline' }
            }}
            onPress={() => onOpenMember?.(item.id)}
            onChat={() => onChat?.(item.id)}
            onCall={() => item.phone && onCall?.(item.phone)}
            onEmail={() => item.email && onEmail?.(item.email)}
          />
        )}
      />
    )}
  </SafeAreaView>
);
}

export default TeamScreen;

const styles = StyleSheet.create({
  // --- Search ---
  header:{ flexDirection:'row', alignItems:'center', gap:10, marginBottom:12 },
  logoCircle:{
    width:36, height:36, borderRadius:18, backgroundColor:'#fff', alignItems:'center', justifyContent:'center',
    shadowColor:'#000', shadowOpacity:0.06, shadowRadius:8, shadowOffset:{ width:0, height:4 }, elevation:2,
  },
  title:{ fontSize:22, fontWeight:'800', color:theme.color.text },
  
  searchWrap: {
    backgroundColor: theme.color.card,
    borderRadius: 14,
    borderWidth: 1, borderColor: theme.color.line,
    paddingHorizontal: 12, paddingVertical: 10,
    flexDirection: 'row', alignItems: 'center', gap: 8,
  },
  searchInput: { flex: 1, fontSize: 14, color: theme.color.dark },

  // --- Segmented filter ---
  segmentBar: {
    backgroundColor: '#EAF2FF',
    borderWidth: 1, borderColor: '#D7E6FF',
    borderRadius: 14,
    padding: 4,
    flexDirection: 'row', gap: 6,
  },
  segment: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingVertical: 8, borderRadius: 10,
  },
  segmentActive: {
    backgroundColor: theme.color.card,
    borderWidth: 1, borderColor: theme.color.line,
  },
  segmentTxt: { fontSize: 12.5, color: theme.color.dim, fontWeight: '700' },
  segmentTxtActive: { color: theme.color.brand },

  // --- Empty state card ---
  cardEmpty: {
    backgroundColor: theme.color.card,
    borderRadius: 20,
    borderWidth: 1, borderColor: theme.color.line,
    padding: 14, marginTop: 14,
  },
});
