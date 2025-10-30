import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useMemo, useState } from 'react';
import {
  Platform,
  RefreshControl,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
// ใช้ธีมของคุณเอง
import { UI } from '@/src/theme/token';
import { useNavigation } from '@react-navigation/native';
// ไอคอน (เปลี่ยนตามโปรเจกต์)
import Ionicons from 'react-native-vector-icons/Ionicons';

// ---------- Types ----------
type NotiType = 'approval' | 'system' | 'team' | 'news';
type NotiItem = {
  id: string;
  title: string;
  body?: string;
  createdAt: Date;
  type: NotiType;
  read?: boolean;
  target?: { screen: string; params?: any }; // สำหรับ navigate ต่อ
};

type FilterKey = 'all' | NotiType;

// ---------- Mock Data ----------
const MOCK: NotiItem[] = [
  {
    id: 'n1',
    title: 'มีคำขอลาใหม่จาก สุชาดา',
    body: 'ลาพักร้อน 2 วัน (12–13 ต.ค.)',
    createdAt: new Date(),
    type: 'approval',
    read: false,
    target: { screen: 'Requests' },
  },
  {
    id: 'n2',
    title: 'ระบบอัปเดตคืนนี้ 23:00–23:30',
    body: 'โปรดบันทึกงานก่อนเวลา',
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    type: 'system',
    read: false,
  },
  {
    id: 'n3',
    title: 'ประกาศ: ปรับสิทธิ์วันลา 2025',
    body: 'อ่านรายละเอียดนโยบายฉบับปรับปรุง',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26),
    type: 'news',
    read: true,
    target: { screen: 'HRNews' },
  },
  {
    id: 'n4',
    title: 'สมาชิกใหม่เข้าทีม: รัชนี',
    body: 'ตำแหน่ง iOS Engineer',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    type: 'team',
    read: true,
    target: { screen: 'TeamTab' },
  },
];

// ---------- Component ----------
export default function NotificationsScreen() {
  const nav = useNavigation();
  const [filter, setFilter] = useState<FilterKey>('all');
  const [items, setItems] = useState<NotiItem[]>(MOCK);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // กรองตามประเภท
  const filtered = useMemo(() => {
    if (filter === 'all') return items;
    return items.filter(i => i.type === filter);
  }, [filter, items]);

  // จัดกลุ่ม Today / Earlier
  const sections = useMemo(() => {
    const today = new Date(); today.setHours(0,0,0,0);
    const isToday = (d: Date) => d >= today;
    const s1 = filtered.filter(i => isToday(i.createdAt));
    const s2 = filtered.filter(i => !isToday(i.createdAt));
    const out = [];
    if (s1.length) out.push({ title: 'Today', data: s1 });
    if (s2.length) out.push({ title: 'Earlier', data: s2 });
    if (!out.length) out.push({ title: '', data: [] });
    return out;
  }, [filtered]);

  // Pull to refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      // ตัวอย่าง: สมมุติว่ามี noti ใหม่เข้ามา
      setItems(prev => prev.map((x, idx) => idx < 1 ? { ...x, read: false } : x));
      setRefreshing(false);
    }, 800);
  }, []);

  // โหลดเพิ่ม (infinite)
  const onEndReached = useCallback(() => {
    if (loadingMore) return;
    setLoadingMore(true);
    setTimeout(() => {
      const more: NotiItem[] = [
        {
          id: 'n' + (items.length + 1),
          title: 'สรุปรายงานประจำสัปดาห์พร้อมดูแล้ว',
          body: 'Tap เพื่อเปิดรายงาน',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
          type: 'news',
          read: true,
        },
      ];
      setItems(prev => [...prev, ...more]);
      setLoadingMore(false);
    }, 700);
  }, [loadingMore, items.length]);

  // ทำเครื่องหมายว่าอ่าน
  const markRead = (id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, read: true } : i));
  };

  // Mark all
  const markAllRead = () => {
    setItems(prev => prev.map(i => ({ ...i, read: true })));
  };

  // แตะรายการ → ไปหน้าเป้าหมาย
  const openTarget = (n: NotiItem) => {
    markRead(n.id);
    if (n.target?.screen) {
      // ถ้าเป็นหน้าภายใต้ Tab อื่น อาจใช้ rootNav.navigate('MainTabs', { screen: 'TeamTab' })
      // ที่นี่ตัวอย่างเรียกโดยตรง
      // @ts-ignore
      nav.navigate(n.target.screen as never);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: UI.color.bg }}>
      {/* Header */}
      <LinearGradient
        colors={['#E9F4FF', '#F4FFFD']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={styles.headerWrap}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => nav.goBack()} hitSlop={HIT}>
            <Ionicons name="chevron-back" size={22} color={UI.color.sub} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>การแจ้งเตือน</Text>
          <TouchableOpacity onPress={markAllRead} hitSlop={HIT} style={styles.hRight}>
            <Ionicons name="checkmark-done-outline" size={18} color={UI.color.accent} />
            <Text style={styles.markAll}>Mark all</Text>
          </TouchableOpacity>
        </View>

        {/* Filters */}
        <View style={styles.filterRow}>
          {FILTERS.map(f => {
            const active = filter === f.key;
            return (
              <TouchableOpacity
                key={f.key}
                onPress={() => setFilter(f.key)}
                style={[styles.filterChip, active && styles.filterChipActive]}
                activeOpacity={0.9}
              >
                <Text style={[styles.filterTxt, active && styles.filterTxtActive]}>{f.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </LinearGradient>

      {/* List */}
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
        stickySectionHeadersEnabled={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        onEndReachedThreshold={0.2}
        onEndReached={onEndReached}
        ListEmptyComponent={
          <View style={[styles.card, { alignItems: 'center' }]}>
            <Ionicons name="notifications-off-outline" size={24} color={UI.color.sub} />
            <Text style={[styles.emptyTitle, { marginTop: 6 }]}>ยังไม่มีการแจ้งเตือน</Text>
            <Text style={styles.emptySub}>เมื่อมีเหตุการณ์ใหม่ ๆ จะแสดงที่นี่</Text>
          </View>
        }
        renderSectionHeader={({ section: { title, data } }) =>
          title ? <Text style={[styles.sectionTitle, { opacity: data.length ? 1 : 0 }]}>{title}</Text> : null
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => openTarget(item)}
            activeOpacity={0.9}
            style={[
              styles.notiCard,
              !item.read && styles.unread,
            ]}
          >
            <View style={styles.nLeft}>
              <View
                style={[
                  styles.iconWrap,
                  {
                    backgroundColor: iconTone(item.type).bg,
                    borderColor: iconTone(item.type).border,
                  },
                ]}
              >
                <Ionicons name={iconName(item.type)} size={16} color={iconTone(item.type).color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.nTitle} numberOfLines={1}>{item.title}</Text>
                {!!item.body && <Text style={styles.nBody} numberOfLines={2}>{item.body}</Text>}
                <Text style={styles.nTime}>{timeSince(item.createdAt)}</Text>
              </View>
            </View>

            {/* จุดสถานะยังไม่อ่าน */}
            {!item.read && <View style={styles.unreadDot} />}
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

// ---------- Helpers ----------
const FILTERS: Array<{ key: FilterKey; label: string }> = [
  { key: 'all',      label: 'All' },
  { key: 'approval', label: 'Approvals' },
  { key: 'system',   label: 'System' },
  { key: 'team',     label: 'Team' },
];

const iconName = (t: NotiType) =>
  t === 'approval' ? 'checkmark-done' :
  t === 'system'   ? 'hardware-chip-outline' :
  t === 'team'     ? 'people-outline' :
                     'newspaper-outline';

const iconTone = (t: NotiType) => {
  if (t === 'approval') return { bg:'#E6FBF4', color:'#0B8F86', border:'#C8F5EA' };
  if (t === 'system')   return { bg:'#EAF2FF', color:'#2563EB', border:'#D8E7FF' };
  if (t === 'team')     return { bg:'#FFF5E6', color:'#C7811F', border:'#FFE7C2' };
  return { bg:'#F4F8FF', color:'#374151', border:'#E5EDFF' };
};

const timeSince = (d: Date) => {
  const diff = Math.max(1, Math.floor((Date.now() - d.getTime()) / 1000));
  if (diff < 60) return `${diff}s ago`;
  const m = Math.floor(diff/60); if (m < 60) return `${m}m ago`;
  const h = Math.floor(m/60); if (h < 24) return `${h}h ago`;
  const day = Math.floor(h/24); return `${day}d ago`;
};

// ---------- Styles ----------
const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

const styles = StyleSheet.create({
  headerWrap: {
    paddingTop: Platform.OS === 'ios' ? 64 : 52,
    paddingBottom: 12, paddingHorizontal: 16,
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
  },
  headerRow: { flexDirection:'row', alignItems:'center', justifyContent:'space-between' },
  headerTitle: { fontSize: 18, fontWeight: '900', color: UI.color.text },
  hRight: { flexDirection:'row', alignItems:'center', gap:6 },
  markAll: { color: UI.color.accent, fontWeight: '800' },

  filterRow:{
    marginTop: 12, backgroundColor:'#fff', borderRadius: 18, borderWidth:1, borderColor: UI.color.line,
    flexDirection:'row', paddingVertical:8, paddingHorizontal:8, gap:8,
    shadowColor:'#0f172a', shadowOpacity:0.06, shadowRadius:10, elevation:1
  },
  filterChip:{
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999,
    backgroundColor:'#F3F7FB', borderWidth:1, borderColor:'transparent'
  },
  filterChipActive:{ backgroundColor:'#E6FBF4', borderColor:'#C8F5EA' },
  filterTxt:{ color: UI.color.sub, fontWeight:'700', fontSize:12.5 },
  filterTxtActive:{ color: UI.color.accent, fontWeight:'800' },

  sectionTitle:{ marginTop: 18, marginBottom: 8, color: UI.color.sub, fontWeight:'900', fontSize:12 },

  notiCard:{
    backgroundColor:'#fff', borderRadius:16, borderWidth:1, borderColor: UI.color.line,
    padding:12, marginBottom:10,
    shadowColor:'#0f172a', shadowOpacity:0.06, shadowRadius:10, elevation:1,
    flexDirection:'row', alignItems:'center', justifyContent:'space-between'
  },
  unread:{ backgroundColor:'rgba(14,165,165,0.04)', borderColor:'rgba(14,165,165,0.20)' },
  nLeft:{ flexDirection:'row', alignItems:'flex-start', gap:12, flex:1 },
  iconWrap:{
    width:36, height:36, borderRadius:10, alignItems:'center', justifyContent:'center',
    borderWidth:1, marginTop:2
  },
  nTitle:{ color: UI.color.text, fontWeight:'900' },
  nBody:{ color: UI.color.text, opacity:0.8, marginTop:2 },
  nTime:{ color: UI.color.sub, fontSize:12, marginTop:6 },

  unreadDot:{ width:8, height:8, borderRadius:4, backgroundColor:'#10B981' },

  card:{
    backgroundColor:'#fff', borderRadius:18, padding:16, borderWidth:1, borderColor: UI.color.line,
    shadowColor:'#0f172a', shadowOpacity:0.06, shadowRadius:10, elevation:1
  },
  emptyTitle:{ color: UI.color.text, fontWeight:'900' },
  emptySub:{ color: UI.color.sub, marginTop:2 },
});
