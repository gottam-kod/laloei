// components/HeaderHeroCard.minimal.tsx
import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Platform, LayoutChangeEvent } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

type Props = {
  name?: string;
  onSearch?: (q: string) => void;
  remainingLeave?: number | string;
  todayTasks?: number | string;
  pending?: number | string;
  placeholder?: string;
};

const GAP = 12;

export default function HeaderHeroCardMinimal({
  name = 'พนักงาน',
  onSearch,
  remainingLeave = 8,
  todayTasks = 3,
  pending = 2,
  placeholder = 'ค้นหาเมนู งาน หรือคน',
}: Props) {
  const [q, setQ] = useState('');
  const [w, setW] = useState(0);

  const statW = useMemo(() => (w ? Math.floor((w - GAP * 2) / 3) : undefined), [w]);

  return (
    <View
      style={[S.card, { backgroundColor: '#EAF7F9' }]}   // ใช้สีพาสเทลจางแทน gradient
      onLayout={(e: LayoutChangeEvent) => setW(e.nativeEvent.layout.width)}
    >
      <Text style={S.hello}>สวัสดี, {name}.</Text>
      <Text style={S.title}>วันนี้อยากทำอะไรดี?</Text>

      {/* Search */}
      <View style={S.searchRow}>
        <View style={S.searchBox}>
          <Ionicons name="search" size={18} color="#8FA2AE" />
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder={placeholder}
            placeholderTextColor="#8FA2AE"
            style={S.input}
            returnKeyType="search"
            onSubmitEditing={() => onSearch?.(q.trim())}
          />
        </View>
        <Pressable style={S.searchBtn} onPress={() => onSearch?.(q.trim())} hitSlop={HIT}>
          <Text style={S.searchBtnText}>ค้นหา</Text>
        </Pressable>
      </View>

      {/* Stats */}
      <View style={S.statsRow}>
        <StatBox w={statW} label="คงเหลือวันลา" value={remainingLeave} />
        <StatBox w={statW} label="งานวันนี้" value={todayTasks} />
        <StatBox w={statW} label="รออนุมัติ" value={pending} last />
      </View>
    </View>

  );
}

function StatBox({
  w, label, value, last,
}: { w?: number; label: string; value: any; last?: boolean }) {
  return (
    <View style={[S.statBox, { width: w }, !last && S.mr]}>
      {/* แถบไฮไลต์บนสุดแบบจาง เพิ่ม premium touch */}
      <View style={S.statAccent} />
      <Text style={S.statLabel} numberOfLines={1}>{label}</Text>
      <Text style={S.statValue}>{String(value)}</Text>
    </View>
  );
}

// Define hitSlop for better touch area
const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

const R = 22;

const S = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 24,
    padding: 16,
    ...shadow(6),               // เงาบางลง
    overflow: 'hidden',
  },
  hello: { color: '#1E293B', fontSize: 14, fontWeight: '700' },
  title: { color: '#0F172A', fontSize: 24, fontWeight: '900', marginTop: 4 },

  searchRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  searchBox: {
    flex: 1,
    height: 44,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadow(1),
  },
  input: { flex: 1, fontSize: 16, color: '#0F172A' },
  searchBtn: {
    height: 44,
    marginLeft: GAP,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },

  // ปรับระยะแถวสถิติชิดขึ้นเล็กน้อย
statsRow: {
  flexDirection: 'row',
  alignItems: 'stretch',
  marginTop: 10,
},

// เวอร์ชันใหม่ — มินิมัล/โปร/สมมาตร
statBox: {
  minHeight: 84,
  borderRadius: 18,
  backgroundColor: '#FFFFFF',
  paddingTop: 10,
  paddingBottom: 12,
  paddingHorizontal: 14,
  justifyContent: 'center',
  // เงาบางให้ยกจากพื้นนิดเดียว
  ...shadow(2),
  // เส้นขอบจางมาก (แทบไม่เห็น) ช่วยคม
  borderWidth: 1,
  borderColor: '#EEF2F6',
  // ป้องกัน overflow ตอน iOS ทำเงา
  overflow: 'hidden',
},
// marginRight สำหรับกล่องที่ 1–2 (ไม่ใช้ gap ให้พอดีทุกหน้าจอ)
mr: { marginRight: 12 },

// แถบไฮไลต์ด้านบน (เนียน ๆ)
statAccent: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  height: 10,
  backgroundColor: '#F7FBFF',
},

// ตัวอักษร
statLabel: {
  color: '#5B6775',
  fontSize: 13,
  fontWeight: '700',
  letterSpacing: 0.2,
},
statValue: {
  color: '#0F172A',
  fontSize: 32,
  lineHeight: 36,
  fontWeight: '900',
  marginTop: 2,                 // ขยับขึ้นให้คอมแพค
  fontVariant: ['tabular-nums'] // ตัวเลขตรึงความกว้าง ดูนิ่ง/แพง
},

});

function shadow(level = 4) {
  return Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOpacity: 0.06 + level * 0.004,
      shadowRadius: 4 + level,
      shadowOffset: { width: 0, height: 2 + Math.round(level / 2) },
    },
    android: {
      elevation: 1 + Math.round(level / 2),
    },
  });
}
