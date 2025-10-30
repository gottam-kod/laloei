// screens/PerksScreen.tsx
import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Platform, StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { COLOR, THEME } from '../theme/token';
const SHADOW = THEME.light.shadowCard;
type Props = {
  onBack?: () => void;
  onOpenPerk?: (id: string) => void;
  onRedeem?: (id: string) => void;
};

type Perk = {
  id: string;
  title: string;
  vendor: string;
  category: 'อาหาร' | 'เดินทาง' | 'สุขภาพ' | 'ช็อปปิง' | 'อื่น ๆ';
  desc?: string;
  points?: number;      // แต้มที่ต้องใช้ (ถ้าเป็นแต้ม)
  expires?: string;     // วันหมดอายุ
  isHot?: boolean;
};



const CATEGORIES = ['ทั้งหมด', 'อาหาร', 'เดินทาง', 'สุขภาพ', 'ช็อปปิง', 'อื่น ๆ'] as const;
type Cat = typeof CATEGORIES[number];

const MOCK: Perk[] = [
  { id:'p1', title:'คูปองอาหารกลางวัน 100.-', vendor:'Canteen', category:'อาหาร', desc:'ใช้ได้ที่โรงอาหารบริษัท', points:50, expires:'30 ก.ย. 2025', isHot:true },
  { id:'p2', title:'ส่วนลดรถไฟฟ้า 20%', vendor:'BTS/MRT', category:'เดินทาง', desc:'สูงสุด 10 เที่ยว/เดือน', points:80, expires:'31 ธ.ค. 2025' },
  { id:'p3', title:'ตรวจสุขภาพประจำปี', vendor:'รพ.พิมาน', category:'สุขภาพ', desc:'แพ็กเกจพื้นฐาน', points:0, expires:'15 ต.ค. 2025' },
  { id:'p4', title:'โค้ดส่วนลด 200.-', vendor:'Shopee', category:'ช็อปปิง', desc:'ขั้นต่ำ 1,000.-', points:90, expires:'10 ต.ค. 2025' },
  { id:'p5', title:'คูปองกาแฟ 1 แก้ว', vendor:'Lala Café', category:'อาหาร', desc:'เมนูปกติ', points:20, expires:'31 ต.ค. 2025' },
];

const PerksScreen: React.FC<Props> = ({ onBack, onOpenPerk, onRedeem }) => {
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState<Cat>('ทั้งหมด');

  // แต้ม/สิทธิ์ mock
  const pointBalance = 160;
  const usedThisMonth = 3;

  const data = useMemo(() => {
    let list = MOCK;
    if (cat !== 'ทั้งหมด') list = list.filter(p => p.category === cat);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.vendor.toLowerCase().includes(q) ||
        (p.desc ?? '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [query, cat]);

  return (
    <View style={{ flex:1, backgroundColor:'#F7FAFD' }}>
      <StatusBar barStyle="dark-content" />

      {/* HEADER (gradient เป็นพื้นหลัง) */}
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={[COLOR.bgTopA, COLOR.bgTopB]}
          start={{x:0,y:0}} end={{x:1,y:1}}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={onBack} hitSlop={{top:10,bottom:10,left:10,right:10}}>
            <Text style={styles.back}>{'‹'}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>สวัสดิการ</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* สรุปแต้ม/สิทธิ์ */}
        <View style={[styles.summaryCard, SHADOW]}>
          <View style={{ flex:1 }}>
            <Text style={styles.sumLabel}>แต้มสะสม</Text>
            <Text style={styles.sumValue}>{pointBalance} <Text style={styles.sumUnit}>แต้ม</Text></Text>
          </View>
          <View style={styles.vline} />
          <View style={{ flex:1 }}>
            <Text style={styles.sumLabel}>ใช้สิทธิ์เดือนนี้</Text>
            <Text style={styles.sumValue}>{usedThisMonth} <Text style={styles.sumUnit}>รายการ</Text></Text>
          </View>
        </View>

        {/* Search */}
        <View style={[styles.searchWrap, SHADOW as any]}>
          <Text style={styles.searchIcon}>🔎</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="ค้นหาสิทธิ์ / ร้านค้า / คำอธิบาย"
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
          {CATEGORIES.map(c => {
            const active = cat === c;
            return (
              <TouchableOpacity
                key={c}
                onPress={() => setCat(c)}
                activeOpacity={0.9}
                style={[styles.filterChip, active && styles.filterChipActive]}
              >
                <Text style={[styles.filterText, active && styles.filterTextActive]}>{c}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <FlatList
        contentContainerStyle={{ padding: 16, paddingBottom: 140 }}
        data={data}
        keyExtractor={p => p.id}
        ListEmptyComponent={
          <View style={[styles.card, { alignItems:'center' }]}>
            <Text style={{ fontSize:16, fontWeight:'800', color:COLOR.dark }}>ยังไม่มีสิทธิ์ในหมวดนี้</Text>
            <Text style={{ fontSize:13, color:COLOR.dim, marginTop:6 }}>ลองเปลี่ยนตัวกรองหรือค้นหาใหม่</Text>
          </View>
        }
        renderItem={({ item }) => (
          <PerkCard
            p={item}
            onOpen={() => onOpenPerk?.(item.id)}
            onRedeem={() => onRedeem?.(item.id)}
          />
        )}
      />
    </View>
  );
};

export default PerksScreen;


/* ---------------- Sub Components ---------------- */

const PerkCard: React.FC<{
  p: Perk;
  onOpen?: () => void;
  onRedeem?: () => void;
}> = ({ p, onOpen, onRedeem }) => {
  return (
    <TouchableOpacity style={[styles.card, SHADOW]} activeOpacity={0.9} onPress={onOpen}>
      <View style={styles.cardHeadRow}>
        <View style={styles.badgeIcon}>
          <Text style={{ fontSize:18 }}>🎁</Text>
        </View>
        <View style={{ flex:1 }}>
          <Text style={styles.perkTitle} numberOfLines={1}>
            {p.title} {p.isHot ? '🔥' : ''}
          </Text>
          <Text style={styles.perkSub} numberOfLines={1}>
            {p.vendor} · {p.category}
          </Text>
        </View>
      </View>

      {!!p.desc && <Text style={styles.perkDesc}>{p.desc}</Text>}

      <View style={styles.metaRow}>
        {typeof p.points === 'number' && (
          <View style={styles.pointPill}>
            <Text style={styles.pointText}>{p.points} แต้ม</Text>
          </View>
        )}
        {!!p.expires && (
          <View style={styles.expPill}>
            <Text style={styles.expText}>หมดอายุ {p.expires}</Text>
          </View>
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity onPress={onOpen} activeOpacity={0.9} style={styles.secondaryBtn}>
          <Text style={styles.secondaryText}>รายละเอียด</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onRedeem} activeOpacity={0.9} style={styles.primaryBtn}>
          <Text style={styles.primaryText}>กดรับ</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: Platform.OS === 'ios' ? 64 : 52,
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  headerRow: { flexDirection:'row', alignItems:'center', justifyContent:'space-between' },
  back: { fontSize:26, color:COLOR.dim, lineHeight:26 },
  headerTitle: { fontSize:18, fontWeight:'800', color:COLOR.dark },

  summaryCard: {
    marginTop: 12,
    backgroundColor:'#FFFFFF',
    borderRadius: 16,
    borderWidth: 1, borderColor: COLOR.line,
    padding: 14,
    flexDirection:'row', alignItems:'center', gap: 12,
  },
  sumLabel: { fontSize:12, color:COLOR.dim, fontWeight:'700' },
  sumValue: { fontSize:18, fontWeight:'900', color:COLOR.dark, marginTop:2 },
  sumUnit: { fontSize:12, color:COLOR.dim, fontWeight:'700' },
  vline: { width:1, height:36, backgroundColor: COLOR.line },

  searchWrap: {
    marginTop: 12,
    backgroundColor:'#FFFFFF',
    borderRadius: 14,
    borderWidth: 1, borderColor: COLOR.line,
    paddingHorizontal: 12, paddingVertical: 10,
    flexDirection:'row', alignItems:'center', gap: 8,
  },
  searchIcon: { fontSize:16, color: COLOR.dim },
  clearIcon: { fontSize:16, color: COLOR.dim },
  searchInput: { flex:1, fontSize:14, color: COLOR.dark },

  filterRow: { flexDirection:'row', gap:8, marginTop:10, marginBottom: 2 },
  filterChip: {
    paddingHorizontal:12, paddingVertical:8, borderRadius:999,
    backgroundColor:'#F3F7FB', borderWidth:1, borderColor:'transparent',
  },
  filterChipActive: { backgroundColor: COLOR.brandSoft, borderColor:'#D4EAFE' },
  filterText: { fontSize:12.5, color: COLOR.dim, fontWeight:'700' },
  filterTextActive: { color: COLOR.brand },

  card: {
    backgroundColor: COLOR.card,
    borderRadius: 20,
    borderWidth: 1, borderColor: COLOR.line,
    padding: 14,
    marginTop: 14,
  },

  cardHeadRow: { flexDirection:'row', alignItems:'center', gap: 12 },
  badgeIcon: {
    width:42, height:42, borderRadius:21,
    backgroundColor:'#F3F7FB', alignItems:'center', justifyContent:'center',
    borderWidth:1, borderColor: COLOR.line,
  },

  perkTitle: { fontSize:15.5, fontWeight:'900', color: COLOR.dark },
  perkSub: { fontSize:12.5, color: COLOR.dim, marginTop: 2 },
  perkDesc: { fontSize:13, color: COLOR.dark, marginTop: 10 },

  metaRow: { flexDirection:'row', gap:8, marginTop: 10, flexWrap:'wrap' },
  pointPill: {
    paddingHorizontal:10, paddingVertical:6, borderRadius:999,
    backgroundColor:'#E6F7FF', borderWidth:1, borderColor:'#CDEBFF',
  },
  pointText: { fontSize:12, fontWeight:'800', color:'#1463B0' },
  expPill: {
    paddingHorizontal:10, paddingVertical:6, borderRadius:999,
    backgroundColor:'#FFF6E5', borderWidth:1, borderColor:'#FFE1B3',
  },
  expText: { fontSize:12, fontWeight:'800', color:'#9A6400' },

  actions: { flexDirection:'row', gap:10, marginTop: 12 },
  secondaryBtn: {
    flex:1, borderRadius:12, borderWidth:1, borderColor: COLOR.line,
    backgroundColor:'#F7FAFD', paddingVertical:10, alignItems:'center',
  },
  secondaryText: { color: COLOR.dark, fontWeight:'800', fontSize:14 },

  primaryBtn: {
    flex:1, borderRadius:12, backgroundColor: COLOR.brand,
    paddingVertical:10, alignItems:'center',
  },
  primaryText: { color:'#fff', fontWeight:'900', fontSize:14 },
});
