// screens/org/MyOrganizationsScreen.tsx
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert, FlatList, RefreshControl, SafeAreaView, View, Text, Pressable, ActivityIndicator,
  useColorScheme
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
// API ที่คุณมีอยู่แล้ว (ปรับ path ให้ตรงโปรเจกต์)
import { listMyOrganizations, leaveOrganization } from '../../connections/auth/orgApi';
import { useAuthStore } from '../../store/useAuthStore';

type OrgSummary = {
  id: string;
  name: string;
  subdomain?: string | null;
  domain?: string | null;
  role?: 'owner'|'admin'|'approver'|'hr'|'member';
  plan_code?: string | null;
  trial?: { status: 'trialing'|'active'|'canceled'|'past_due'; ends_at?: string | null } | null;
  locale?: string | null;
  timezone?: string | null;
  created_at?: string;
  members_count?: number;
};

// ถ้าในโปรเจกต์ยังไม่มี ให้เพิ่ม function 2 ตัวนี้ใน orgApi:
// export async function listMyOrganizations(): Promise<{ items: OrgSummary[] }> { ... }
// export async function leaveOrganization(orgId: string): Promise<{ ok: boolean }> { ... }

export default function MyOrganizationsScreen() {
  const { t } = useTranslation();
  const nav = useNavigation<any>();
  const scheme = useColorScheme();
  const C = palette(scheme);
  const profile = useAuthStore(s => s.profile);

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<OrgSummary[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listMyOrganizations();
    //   setItems(res.items || []);
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message || 'โหลดรายการองค์กรไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await listMyOrganizations();
    //   setItems(res.items || []);
    } catch (e: any) {
      // เงียบๆ
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const empty = !loading && items.length === 0;

  const renderItem = ({ item }: { item: OrgSummary }) => {
    const url = item.domain && item.subdomain
      ? `https://${item.subdomain}.${item.domain}`
      : item.subdomain
      ? `https://${item.subdomain}.example.com`
      : (item.domain ? `https://${item.domain}` : '—');

    const trialText = item.trial?.status === 'trialing'
      ? `Trial • ถึง ${formatDate(item.trial?.ends_at)}`
      : item.plan_code
      ? `Plan: ${item.plan_code}`
      : '—';

    return (
      <View style={[s.card, { backgroundColor: C.card, borderColor: C.cardBorder, shadowColor: C.shadow }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={[s.cardEmoji]}>🏢</Text>
          <View style={{ flex: 1 }}>
            <Text style={[s.title, { color: C.text }]} numberOfLines={1}>{item.name}</Text>
            <Text style={{ color: C.subtle, marginTop: 2 }} numberOfLines={1}>{url}</Text>
          </View>
          <View style={[s.rolePill, { backgroundColor: roleBg(item.role), borderColor: C.cardBorder }]}>
            <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700', textTransform: 'uppercase' }}>{item.role || '—'}</Text>
          </View>
        </View>

        <View style={s.metaRow}>
          <Meta label="สถานะ" value={trialText} color={C.muted} />
          <Meta label="สมาชิก" value={String(item.members_count ?? '—')} color={C.muted} />
          <Meta label="โซนเวลา" value={item.timezone || '—'} color={C.muted} />
        </View>

        <View style={s.actions}>
          <Pressable
            onPress={() => nav.navigate('OrganizationHome', { orgId: item.id })}
            style={[s.btn, { backgroundColor: C.primary }]}
          >
            <Text style={s.btnTextWhite}>เข้าใช้งาน</Text>
          </Pressable>
          <Pressable
            onPress={() => nav.navigate('OrganizationSettings', { orgId: item.id })}
            style={[s.btn, { backgroundColor: C.ghost, borderColor: C.border }]}
          >
            <Text style={[s.btnText, { color: C.text }]}>ตั้งค่า</Text>
          </Pressable>
          <Pressable
            onPress={() => nav.navigate('InviteMember', { orgId: item.id })}
            style={[s.iconBtn, { borderColor: C.border }]}
          >
            <Text style={{ fontSize: 16 }}>✉️</Text>
          </Pressable>
          {item.role !== 'owner' && (
            <Pressable
              onPress={() => confirmLeave(item)}
              style={[s.iconBtn, { borderColor: C.border }]}
            >
              <Text style={{ fontSize: 16 }}>🚪</Text>
            </Pressable>
          )}
        </View>
      </View>
    );
  };

  const confirmLeave = (org: OrgSummary) => {
    Alert.alert('ออกจากองค์กร', `คุณต้องการออกจาก "${org.name}" ใช่ไหม`,
      [
        { text: 'ยกเลิก', style: 'cancel' },
        {
          text: 'ออก', style: 'destructive',
          onPress: async () => {
            try {
              await leaveOrganization(org.id);
              setItems(prev => prev.filter(o => o.id !== org.id));
            } catch (e: any) {
              Alert.alert('Error', e?.response?.data?.message || 'ออกจากองค์กรไม่สำเร็จ');
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      {/* Header */}
      <View style={[s.header, { backgroundColor: C.headerBg, borderBottomColor: C.headerBorder }]}>
        <Text style={[s.headerTitle, { color: C.headerText }]}>องค์กรของฉัน</Text>
        <Text style={{ color: C.subtle, fontSize: 12 }}>ผู้ใช้: {profile?.email || '—'}</Text>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8 }}>
          <ActivityIndicator />
          <Text style={{ color: C.subtle }}>กำลังโหลด…</Text>
        </View>
      ) : empty ? (
        <View style={{ flex: 1, padding: 16, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: C.muted, marginBottom: 12, fontSize: 16 }}>ยังไม่มีองค์กร</Text>
          <Pressable
            onPress={() => nav.navigate('CreateOrganization')}
            style={[s.btn, { backgroundColor: C.primary, paddingHorizontal: 18 }]}
          >
            <Text style={s.btnTextWhite}>สร้างองค์กรใหม่</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(it) => it.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListFooterComponent={<View style={{ height: 24 }} />}
        />
      )}

      {/* Floating create button */}
      {!loading && (
        <View style={[s.fabWrap]}>
          <Pressable
            onPress={() => nav.navigate('CreateOrganization')}
            style={[s.fab, { backgroundColor: C.primary, shadowColor: C.shadow }]}
          >
            <Text style={{ color: '#fff', fontSize: 22 }}>＋</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

/* ---------- UI helpers ---------- */
const Meta = ({ label, value, color }: { label: string; value: string; color: string }) => (
  <View style={{ flex: 1 }}>
    <Text style={{ color, fontSize: 12 }}>{label}</Text>
    <Text style={{ color, fontWeight: '700', marginTop: 2 }} numberOfLines={1}>{value}</Text>
  </View>
);

const s = {
  header: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12, borderBottomWidth: 1 } as const,
  headerTitle: { fontSize: 20, fontWeight: '800' } as const,

  card: {
    borderWidth: 1, borderRadius: 16, padding: 14, marginBottom: 12,
    shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 1,
  } as const,
  cardEmoji: { fontSize: 22, marginRight: 10 } as const,
  title: { fontSize: 16, fontWeight: '800' } as const,

  rolePill: { paddingHorizontal: 8, paddingVertical: 6, borderRadius: 8, borderWidth: 1, marginLeft: 10 } as const,

  metaRow: { flexDirection: 'row', gap: 12, marginTop: 10 } as const,

  actions: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 } as const,
  btn: { paddingVertical: 10, borderRadius: 10, paddingHorizontal: 12, borderWidth: 1 } as const,
  btnText: { fontWeight: '700' } as const,
  btnTextWhite: { color: '#fff', fontWeight: '700' } as const,
  iconBtn: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10, borderWidth: 1 } as const,

  fabWrap: { position: 'absolute', right: 16, bottom: 20 } as const,
  fab: { width: 54, height: 54, borderRadius: 27, alignItems: 'center', justifyContent: 'center', shadowOpacity: 0.15, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 3 } as const,
};

function palette(scheme: ReturnType<typeof useColorScheme>) {
  const isDark = scheme === 'dark';
  return {
    primary: '#0EA5E9',
    bg: isDark ? '#0b1220' : '#f5f7fb',
    card: isDark ? '#0f172a' : '#ffffff',
    cardBorder: isDark ? '#1f2a44' : '#e5e7eb',
    text: isDark ? '#e5e7eb' : '#0b1220',
    subtle: isDark ? '#7c8aa0' : '#6b7280',
    muted: isDark ? '#9aa4b2' : '#374151',
    border: isDark ? '#1f2a44' : '#e5e7eb',
    headerBg: isDark ? '#0b1220' : '#ffffff',
    headerText: isDark ? '#e5e7eb' : '#0b1220',
    headerBorder: isDark ? '#1f2a44' : '#e5e7eb',
    ghost: isDark ? '#111827' : '#f3f4f6',
    shadow: isDark ? '#000' : '#111827',
  };
}

function roleBg(role?: OrgSummary['role']) {
  switch (role) {
    case 'owner': return '#22C55E';
    case 'admin': return '#F59E0B';
    case 'approver': return '#6366F1';
    case 'hr': return '#14B8A6';
    default: return '#9CA3AF';
  }
}

function formatDate(iso?: string | null) {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    const y = d.getFullYear();
    const m = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');
    return `${y}-${m}-${day}`;
  } catch { return '—'; }
}
