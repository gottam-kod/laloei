import { useTheme } from '@/src/theme/useTheme';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Member } from '../types/team';

const { theme, mode, toggleMode, THEME } = useTheme();

type Props = {
  m: Member;
  onPress?: () => void;
  onChat?: () => void;
  onCall?: () => void;
  onEmail?: () => void;
};

const PRESENCE_COLOR: Record<NonNullable<Member['presence']>['state'], string> = {
  online: '#10B981',  // เขียว
  away:   '#F59E0B',  // เหลือง
  offline:'#9AA7B2',  // เทา
};

function formatInTime(iso?: string | null) {
  if (!iso) return null;
  try {
    const d = new Date(iso);
    const hh = `${d.getHours()}`.padStart(2, '0');
    const mm = `${d.getMinutes()}`.padStart(2, '0');
    return `IN ${hh}:${mm}`;
  } catch { return null; }
}

function WorkingLine(m: Member) {
  // เลือกสถานะหลัก
  if (m.working?.onLeaveToday) {
    const t = m.working.onLeaveToday.type;
    return (
      <View style={styles.lineRow}>
        <Badge text={`On leave (${t})`} colorBg="#FFF6E5" colorBorder="#FFE1B3" colorText="#9A6400" />
        {m.working?.checkedInAt && <DotDivider />}
        {m.working?.checkedInAt && <Text style={styles.meta}>{formatInTime(m.working.checkedInAt)}</Text>}
      </View>
    );
  }
  const loc = m.working?.location;
  return (
    <View style={styles.lineRow}>
      {loc === 'wfh' && <Badge text="WFH" colorBg="#EEF7FF" colorBorder="#D6EAFE" colorText="#2563EB" />}
      {loc === 'onsite' && <Badge text="Onsite" colorBg="#EAFBF5" colorBorder="#CFF3E6" colorText="#0A7C66" />}
      {m.working?.checkedInAt && ((loc==='wfh'||loc==='onsite')) && <DotDivider />}
      {m.working?.checkedInAt && <Text style={styles.meta}>{formatInTime(m.working.checkedInAt)}</Text>}
    </View>
  );
}

function Badge({ text, colorBg, colorBorder, colorText }: { text: string; colorBg: string; colorBorder: string; colorText: string }) {
  return (
    <View style={[styles.badgePill, { backgroundColor: colorBg, borderColor: colorBorder }]}>
      <Text style={[styles.badgeTxt, { color: colorText }]}>{text}</Text>
    </View>
  );
}
function DotDivider() { return <Text style={styles.meta}> · </Text>; }

export default function MemberCard({ m, onPress, onChat, onCall, onEmail }: Props) {
  const presence = m.presence?.state ?? 'offline';
  const presenceColor = PRESENCE_COLOR[presence as keyof typeof PRESENCE_COLOR] ?? PRESENCE_COLOR.offline;

  return (
    <TouchableOpacity style={[styles.card]} activeOpacity={0.9} onPress={onPress}>
      <View style={styles.topRow}>
        {/* [●avatar] + presence */}
        <View style={styles.avatarWrap}>
          {m.avatarUrl ? (
            <Image source={{ uri: m.avatarUrl }} style={styles.avatarImg} />
          ) : (
            <View style={styles.avatarFallback}><Text style={styles.avatarInitial}>{m.name?.[0] ?? '?'}</Text></View>
          )}
          <View style={[styles.presenceDot, { backgroundColor: presenceColor }]} />
        </View>

        {/* ชื่อ (badge หัวหน้า) */}
        <View style={{ flex: 1, minWidth: 0 }}>
          <View style={styles.nameRow}>
            <Text numberOfLines={1} style={styles.name}>{m.name}</Text>
            {m.isManager && (
              <View style={styles.leaderBadge}>
                <Ionicons name="ribbon" size={12} style={{ color: '#0A7C66', marginRight: 4 }} />
                <Text style={styles.leaderTxt}>หัวหน้า</Text>
              </View>
            )}
          </View>

          {/* ตำแหน่ง · แผนก */}
          <Text numberOfLines={1} style={styles.sub}>{m.role} · {m.dept}</Text>

          {/* Onsite | WFH | On leave (AL) · IN 09:12 */}
          <WorkingLine {...m as any} />
        </View>

        {/* [💬][📞][✉️] */}
        <View style={styles.actions}>
          <IconBtn name="chatbubble-ellipses-outline" onPress={onChat} />
          <IconBtn name="call-outline" onPress={onCall} disabled={!m.phone} />
          <IconBtn name="mail-outline" onPress={onEmail} disabled={!m.email} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

function IconBtn({ name, onPress, disabled }: { name: string; onPress?: () => void; disabled?: boolean }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled}
      style={[styles.iconBtn, disabled && { opacity: 0.4 }]}
    >
      <Ionicons name={name} size={16} color={theme.color.sub} />
    </TouchableOpacity>
  );
}

const AVATAR = 52;

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.color.card,
    borderRadius: 16,
    borderWidth: 1, borderColor: theme.color.line,
    padding: 16,
    marginTop: 16,
  },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },

  avatarWrap: { width: AVATAR, height: AVATAR, position: 'relative' },
  avatarImg: { width: '100%', height: '100%', borderRadius: AVATAR / 2, borderWidth: 1, borderColor: '#E5ECFF' },
  avatarFallback: {
    width: '100%', height: '100%', borderRadius: AVATAR / 2,
    backgroundColor: '#EFF4FF', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#E5ECFF',
  },
  avatarInitial: { fontSize: 20, fontWeight: '900', color: '#3556C7' },
  presenceDot: {
    position: 'absolute', right: -2, bottom: -2,
    width: 14, height: 14, borderRadius: 7,
    borderWidth: 2, borderColor: theme.color.card,
  },

  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  name: { fontSize: 16, fontWeight: '900', color: theme.color.text },
  sub: { fontSize: 12.5, color: theme.color.sub, marginTop: 2 },

  leaderBadge: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: theme.radius.pill,
    backgroundColor: '#E9FBF4', borderWidth: 1, borderColor: '#CFF3E6',
  },
  leaderTxt: { fontSize: 11.5, fontWeight: '800', color: '#0A7C66' },

  lineRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6, flexWrap: 'nowrap' },
  meta: { fontSize: 12, color: theme.color.sub },

  badgePill: {
    paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
  },
  badgeTxt: { fontSize: 11.5, fontWeight: '800' },

  actions: { gap: 8, marginLeft: 8, flexDirection: 'row' },
  iconBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#F6F9FF',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: theme.color.line,
  },
});
