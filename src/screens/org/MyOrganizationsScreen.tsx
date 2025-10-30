// screens/MyOrganizationScreen.tsx
import React, { useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, StatusBar,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { FONT, THEME } from '@/src/theme/token';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList, RootStackParamList } from '@/src/navigation/RootStackParamList';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { BackgroundFX } from '@/src/components/Background';

type OrgPlan = 'Starter' | 'Pro' | 'Premium';

type Org = {
  id: string;
  name: string;
  code: string;
  domain?: string;          // เช่น app.laloei.com หรือ org.laloei.com
  plan: OrgPlan;
  membersCount: number;
  membersLimit: number;
  storageUsedMB: number;
  storageLimitMB: number;
  nextBillingDate?: string; // YYYY-MM-DD
  createdAt: string;
  logoText?: string;        // ใช้เป็นอักษรย่อโลโก้
};

type Member = { id: string; name: string; role: string };
type Invite = { id: string; email: string; role: string; sentAt: string };

//http://localhost:3003/api/v1/organizations/4f19b276-4629-4179-895a-951577c3e98f
const mockOrg: Org = {
  id: 'org_001',
  name: 'Laloei Co., Ltd.',
  code: 'LALOEI',
  domain: 'app.laloei.com',
  plan: 'Starter',
  membersCount: 8,
  membersLimit: 15,
  storageUsedMB: 320,
  storageLimitMB: 1024,
  nextBillingDate: '2025-11-01',
  createdAt: '2025-09-15',
  logoText: 'LA',
};

// {
//   "id": "4f19b276-4629-4179-895a-951577c3e98f",
//   "name": "laloei Co., Ltd.",
//   "slug": "app",
//   "domain": "laloei.com",
//   "owner_user_id": "9c25a948-2a34-44d9-bac7-fc900072ea90",
//   "billing_email": "billing@laloei.com",
//   "billing_name": null,
//   "tax_id": null,
//   "phone": null,
//   "timezone": "Asia/Bangkok",
//   "locale": "th-TH",
//   "address": null,
//   "plan_code": "PRO",
//   "status": "active",
//   "settings": {},
//   "created_at": "2025-10-16T07:56:38.941Z",
//   "created_by": null,
//   "updated_at": "2025-10-16T07:56:38.941Z",
//   "updated_by": null,
//   "deleted_at": null,
//   "deleted_by": null
// }


  const quickItems = [
    { key: 'invite', label: 'เชิญสมาชิก', icon: <Ionicons name="person-add-outline" size={18} /> },
    { key: 'upgrade', label: 'อัปเกรดแผน', icon: <Ionicons name="sparkles-outline" size={18} /> },
    { key: 'billing', label: 'บิล/ชำระเงิน', icon: <Ionicons name="card-outline" size={18} /> },
    { key: 'teams', label: 'ทีม/โครงสร้าง', icon: <MaterialCommunityIcons name="sitemap-outline" size={18} /> },
    { key: 'leavetype', label: 'ประเภทการลา', icon: <Ionicons name="calendar-outline" size={18} /> },
    { key: 'settings', label: 'ตั้งค่าระบบ', icon: <Ionicons name="settings-outline" size={18} /> },
  ];

const mockMembers: Member[] = [
  { id: 'u1', name: 'โยธารักษ์ ผลาโชติ', role: 'OWNER' },
  { id: 'u2', name: 'สุภาวดี มณีโชติ', role: 'HR ADMIN' },
  { id: 'u3', name: 'ธนพล สุขดี', role: 'LINE MANAGER' },
  { id: 'u4', name: 'ชนิกา จันทร์เพ็ญ', role: 'EMPLOYEE' },
];

const mockInvites: Invite[] = [
  { id: 'i1', email: 'newuser1@example.com', role: 'EMPLOYEE', sentAt: '2025-10-15' },
  { id: 'i2', email: 'manager@example.com', role: 'LINE MANAGER', sentAt: '2025-10-14' },
];

export default function MyOrganizationScreen() {
  const [org] = useState<Org>(mockOrg);
  const [members] = useState<Member[]>(mockMembers);
  const [invites] = useState<Invite[]>(mockInvites);

    const nav = useNavigation<NavigationProp<ProfileStackParamList>>();
  


  const memberUsage = useMemo(
    () => Math.min(100, Math.round((org.membersCount / org.membersLimit) * 100)),
    [org.membersCount, org.membersLimit]
  );
  const storageUsage = useMemo(
    () => Math.min(100, Math.round((org.storageUsedMB / org.storageLimitMB) * 100)),
    [org.storageUsedMB, org.storageLimitMB]
  );

  const planColor = useMemo(() => {
    switch (org.plan) {
      case 'Starter': return '#22c55e';
      case 'Pro': return '#0ea5e9';
      case 'Premium': return '#a855f7';
      default: return '#0ea5e9';
    }
  }, [org.plan]);


    const onQuickPress = (key: string) => {
    switch (key) {
      case 'invite':
        // ไปหน้าชวนสมาชิก
        return nav.navigate('InviteMember');
      case 'upgrade':
        // ไปหน้าอัปเกรดแผน/แพคเกจ
        return nav.navigate('UpgradePlan');
      case 'billing':
        // ไปหน้าบิล/ชำระเงิน
        return nav.navigate('Billing');
      case 'teams':
        // ไปจัดการทีม/โครงสร้าง
        return nav.navigate('TeamStructure');
      case 'leavetype':
        // ไปจัดการประเภทการลา
        return nav.navigate('LeaveType' as never); // แปลงเป็น never ชั่วคราว
      case 'settings':
        // ไปตั้งค่าระบบขององค์กร
        return nav.navigate('Settings' as never); // แปลงเป็น never ชั่วคราว
      default:
        return Alert.alert('ยังไม่รองรับ', `ยังไม่ได้เชื่อม route ของ "${key}"`);
    }
  };
return (
  <View style={S.container}>
    <StatusBar barStyle="dark-content" />

    <FlatList
      data={[
        { type: 'members' },
        ...(invites.length ? [{ type: 'invites' as const }] : []),
        { type: 'orgActions' },
        { type: 'activity' },
      ]}
      keyExtractor={(_, i) => String(i)}
      contentContainerStyle={S.bodyPad}
      ListHeaderComponent={
        <LinearGradient
          colors={['#EAF5FF', '#EAFBF4']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={S.headerGrad}
        >
          <View style={S.headerTop}>
            <Text style={[S.headerTitle, {fontFamily: FONT.headingBold}]}>องค์กรของฉัน</Text>
            <TouchableOpacity style={S.iconBtn} onPress={() => {}}>
              <Ionicons name="settings-outline" size={20} />
            </TouchableOpacity>
          </View>

          <View style={S.orgRow}>
            <View style={S.logoCircle}>
              <Text style={[S.logoText, { fontFamily: FONT.headingBold }]}>{org.logoText ?? 'ORG'}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[S.orgName, { fontFamily: FONT.bodyBold }]}>{org.name}</Text>
              <Text style={[S.orgSub, { fontFamily: FONT.body }]}>
                รหัสองค์กร: <Text style={S.bold}>{org.code}</Text>
              </Text>
              {!!org.domain && (
                <Text style={[S.orgSub, { fontFamily: FONT.body }]}>
                  โดเมน: <Text style={S.bold}>{org.domain}</Text>
                </Text>
              )}
            </View>
            <View style={[S.planBadge, { backgroundColor: planColor + '22', borderColor: planColor }]}>
              <Text style={[S.planText, { color: planColor }]}>{org.plan}</Text>
            </View>
          </View>

          <View style={S.metricsCard}>
            <View style={S.metricBlock}>
              <View style={S.metricRow}>
                <MaterialCommunityIcons name="account-group-outline" size={18} />
                <Text style={[S.metricLabel, { fontFamily: FONT.bodyBold }]}>จำนวนสมาชิก</Text>
                <Text style={[S.metricValue, { fontFamily: FONT.body }]}>
                  {org.membersCount}/{org.membersLimit}
                </Text>
              </View>
              <Progress value={memberUsage} />
            </View>

            <View style={S.divider} />

            <View style={S.metricBlock}>
              <View style={S.metricRow}>
                <Ionicons name="cloud-outline" size={18} />
                <Text style={[S.metricLabel, { fontFamily: FONT.bodyBold }]}>พื้นที่จัดเก็บ</Text>
                <Text style={[S.metricValue, { fontFamily: FONT.body }]}>
                  {org.storageUsedMB}/{org.storageLimitMB} MB
                </Text>
              </View>
              <Progress value={storageUsage} />
            </View>

            {!!org.nextBillingDate && (
              <View style={S.billingRow}>
                <Ionicons name="card-outline" size={16} />
                <Text style={[S.billingText, { fontFamily: FONT.body }]}>
                  รอบบิลถัดไป: <Text style={S.bold}>{formatDate(org.nextBillingDate)}</Text>
                </Text>
                <TouchableOpacity style={S.linkBtn} onPress={() => {}}>
                  <Text style={[S.linkText, { fontFamily: FONT.body }]}>ดูบิล</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <QuickActions items={quickItems} onPress={onQuickPress} />
        </LinearGradient>
      }
      renderItem={({ item }) => {
        switch (item.type) {
          case 'members':
            return (
              <Section title="สมาชิกหลัก (ล่าสุด)">
                {/* map ธรรมดา แทน FlatList ด้านใน */}
                {members.slice(0, 4).map((m, idx) => (
                  <React.Fragment key={m.id}>
                    <RowItem
                      icon={<Ionicons name="person-circle-outline" size={22} />}
                      title={m.name}
                      subtitle={m.role}
                      trailing={
                        <TouchableOpacity onPress={() => {}}>
                          <Ionicons name="chevron-forward" size={20} />
                        </TouchableOpacity>
                      }
                    />
                    {idx < Math.min(4, members.length) - 1 && <View style={S.rowSep} />}
                  </React.Fragment>
                ))}
                <View style={S.rowBetween}>
                  <GhostButton label="ดูสมาชิกทั้งหมด" onPress={() => {}} />
                  <PrimaryButton label="เชิญสมาชิก" onPress={() => {}} />
                </View>
              </Section>
            );

          case 'invites':
            return (
              <Section title="คำเชิญที่รอการยืนยัน">
                {invites.map((it, idx) => (
                  <React.Fragment key={it.id}>
                    <RowItem
                      icon={<Ionicons name="mail-unread-outline" size={20} />}
                      title={it.email}
                      subtitle={`บทบาท: ${it.role} • ส่งเมื่อ ${formatDate(it.sentAt)}`}
                      trailing={
                        <View style={{ flexDirection: 'row', gap: 8 }}>
                          <TouchableOpacity onPress={() => {}}>
                            <Text style={[S.linkText, { fontFamily: FONT.body }]}>ส่งซ้ำ</Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => {}}>
                            <Text style={[S.linkText, { color: '#ef4444', fontFamily: FONT.body }]}>ยกเลิก</Text>
                          </TouchableOpacity>
                        </View>
                      }
                    />
                    {idx < invites.length - 1 && <View style={S.rowSep} />}
                  </React.Fragment>
                ))}
              </Section>
            );

          case 'orgActions':
            return (
              <Section title="การจัดการองค์กร">
                <GridActions
                  items={[
                    { key: 'edit', label: 'แก้ไขข้อมูล', icon: <Ionicons name="create-outline" size={18} />, onPress: () => {} },
                    { key: 'dept', label: 'แผนก', icon: <Ionicons name="business-outline" size={18} />, onPress: () => {} },
                    { key: 'pos', label: 'ตำแหน่งงาน', icon: <Ionicons name="briefcase-outline" size={18} />, onPress: () => {} },
                    { key: 'approver', label: 'อนุมัติลา', icon: <Ionicons name="checkmark-done-outline" size={18} />, onPress: () => {} },
                    { key: 'policy', label: 'นโยบาย/สิทธิ์ลา', icon: <Ionicons name="document-text-outline" size={18} />, onPress: () => {} },
                    { key: 'integrations', label: 'Integrations', icon: <Ionicons name="link-outline" size={18} />, onPress: () => {} },
                  ]}
                />
              </Section>
            );

          case 'activity':
            return (
              <Section title="กิจกรรมล่าสุด">
                <RowItem
                  icon={<Ionicons name="time-outline" size={20} />}
                  title="อนุมัติคำขอลาของ ชนิกา จันทร์เพ็ญ"
                  subtitle="เมื่อ 2 ชั่วโมงที่ผ่านมา"
                />
                <View style={S.rowSep} />
                <RowItem
                  icon={<Ionicons name="time-outline" size={20} />}
                  title="เพิ่มสมาชิก: manager@example.com"
                  subtitle="เมื่อวานนี้"
                />
              </Section>
            );

          default:
            return null;
        }
      }}
      ListFooterComponent={<View style={{ height: 24 }} />}
    />
  </View>
);

}

/** -------- Components -------- */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={S.section}>
      <Text style={[S.sectionTitle, { fontFamily: FONT.bodyBold }]}>{title}</Text>
      <View style={S.sectionBody}>{children}</View>
    </View>
  );
}

function RowItem({
  icon, title, subtitle, trailing,
}: { icon?: React.ReactNode; title: string; subtitle?: string; trailing?: React.ReactNode }) {
  return (
    <View style={S.row}>
      <View style={S.rowIcon}>{icon}</View>
      <View style={{ flex: 1 }}>
        <Text style={[S.rowTitle, { fontFamily: FONT.bodyBold }]}>{title}</Text>
        {!!subtitle && <Text style={[S.rowSub, { fontFamily: FONT.body }]}>{subtitle}</Text>}
      </View>
      {trailing}
    </View>
  );
}

function Progress({ value }: { value: number }) {
  return (
    <View style={S.progressWrap}>
      <View style={[S.progressBar, { width: `${value}%` }]} />
    </View>
  );
}

function QuickActions({
  items,
  onPress,
}: {
  items: { key: string; label: string; icon: React.ReactNode }[];
  onPress?: (key: string) => void;
}) {
  return (
    <View style={S.quickWrap}>
      {items.map((it) => (
        <TouchableOpacity key={it.key} style={S.quickItem} onPress={() => onPress?.(it.key)}>
          <View style={S.quickIcon}>{it.icon}</View>
          <Text style={[S.quickLabel, { fontFamily: FONT.body }]}>{it.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function GridActions({ items }: { items: { key: string; label: string; icon: React.ReactNode; onPress: () => void }[] }) {
  return (
    <View style={S.grid}>
      {items.map((it) => (
        <TouchableOpacity key={it.key} style={S.gridItem} onPress={it.onPress}>
          <View style={S.gridIcon}>{it.icon}</View>
          <Text style={[S.gridText, { fontFamily: FONT.body }]}>{it.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function PrimaryButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={S.primaryBtn} onPress={onPress}>
      <Text style={[S.primaryText, { fontFamily: FONT.bodyBold }]}>{label}</Text>
    </TouchableOpacity>
  );
}

function GhostButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={S.ghostBtn} onPress={onPress}>
      <Text style={[S.ghostText, { fontFamily: FONT.body }]}>{label}</Text>
    </TouchableOpacity>
  );
}

function formatDate(yyyyMMdd?: string) {
  if (!yyyyMMdd) return '-';
  const [y, m, d] = yyyyMMdd.split('-').map(Number);
  return `${d}/${m}/${y + 543}`; // แสดง พ.ศ.
}

/** -------- Styles -------- */
const S = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6faf9' },
  headerGrad: { paddingTop: 12, paddingHorizontal: 16, paddingBottom: 12 },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  headerTitle: { fontSize: 20, fontWeight: '700' },
  iconBtn: { padding: 8, borderRadius: 12, backgroundColor: '#ffffffaa' },

  orgRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 6, marginBottom: 12 },
  logoCircle: {
    width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#dbeafe',
  },
  logoText: { fontWeight: '800', fontSize: 16, color: '#0ea5e9' },
  orgName: { fontSize: 18, fontWeight: '700' },
  orgSub: { fontSize: 12, color: '#566' },
  bold: { fontWeight: '700' },

  planBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, borderWidth: 1 },
  planText: { fontSize: 12, fontWeight: '700' },

  metricsCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 12, gap: 10,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  metricBlock: { gap: 6 },
  metricRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  metricLabel: { fontSize: 13, color: '#334155' },
  metricValue: { marginLeft: 'auto', fontSize: 13, fontWeight: '700' },
  divider: { height: 1, backgroundColor: '#eef2f7' },
  progressWrap: { height: 8, backgroundColor: '#eef2f7', borderRadius: 999, overflow: 'hidden' },
  progressBar: { height: '100%', backgroundColor: '#0ea5e9', borderRadius: 999 },

  billingRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  billingText: { fontSize: 12, color: '#334155' },
  linkBtn: { marginLeft: 'auto', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  linkText: { color: '#0ea5e9', fontWeight: '700' },

  quickWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  quickItem: {
    width: '31.5%', backgroundColor: '#ffffff', borderRadius: 14, paddingVertical: 10,
    alignItems: 'center', justifyContent: 'center', gap: 6,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 1,
  },
  quickIcon: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  quickLabel: { fontSize: 12, textAlign: 'center' },

  bodyPad: { padding: 16, paddingTop: 8 },
  section: { marginBottom: 14 },
  sectionTitle: { fontSize: 16, fontWeight: '800', marginBottom: 8 },
  sectionBody: { backgroundColor: '#fff', borderRadius: 16, padding: 10, gap: 8 },

  row: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6 },
  rowIcon: {
    width: 34, height: 34, borderRadius: 17, backgroundColor: '#f1f5f9',
    alignItems: 'center', justifyContent: 'center',
  },
  rowTitle: { fontSize: 14, fontWeight: '700' },
  rowSub: { fontSize: 12, color: '#64748b', marginTop: 2 },
  rowSep: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 4 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },

  primaryBtn: { backgroundColor: '#0ea5e9', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12 },
  primaryText: { color: '#fff', fontWeight: '800' },

  ghostBtn: { paddingVertical: 10, paddingHorizontal: 16 },
  ghostText: { color: '#0ea5e9', fontWeight: '800' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  gridItem: {
    width: '31.5%', backgroundColor: '#ffffff', borderRadius: 14, paddingVertical: 12,
    alignItems: 'center', justifyContent: 'center', gap: 6,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 1,
  },
  gridIcon: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  gridText: { fontSize: 12, textAlign: 'center' },
});
