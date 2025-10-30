// screens/SettingsScreen.tsx
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, Linking,
} from 'react-native';

type Props = {
  orgName?: string;
  email?: string;
  locale?: 'th' | 'en';
  timezone?: string;
  onChangeLocale?: (v: 'th' | 'en') => void;
  onChangeTimezone?: () => void; // เปิดตัวเลือกโซนเวลา
  onManageProfile?: () => void;
  onManageOrg?: () => void;
  onOpenBilling?: () => void;
  onOpenUpgrade?: () => void;

  // แจ้งเตือน
  onTogglePush?: (v: boolean) => void;
  onToggleEmail?: (v: boolean) => void;
  onToggleDailyDigest?: (v: boolean) => void;

  // ความปลอดภัย
  onChangePassword?: () => void;
  onToggle2FA?: (v: boolean) => void;
  onViewSessions?: () => void;

  // Integrations
  onConnectGoogle?: () => void;
  onDisconnectGoogle?: () => void;
  onConnectApple?: () => void;
  onDisconnectApple?: () => void;
  onConnectLineNotify?: () => void;
  onDisconnectLineNotify?: () => void;

  // Data & Privacy
  onExportData?: () => void;
  onDeleteAccount?: () => void;

  // About
  onOpenDocs?: () => void;
  onOpenTerms?: () => void;
  onOpenPrivacy?: () => void;
  appVersion?: string;
};

export default function SettingsScreen({
  orgName = 'บริษัท ลาเลย',
  email = 'you@laloei.com',
  locale = 'th',
  timezone = 'Asia/Bangkok',
  onChangeLocale,
  onChangeTimezone,
  onManageProfile,
  onManageOrg,
  onOpenBilling,
  onOpenUpgrade,

  onTogglePush,
  onToggleEmail,
  onToggleDailyDigest,

  onChangePassword,
  onToggle2FA,
  onViewSessions,

  onConnectGoogle,
  onDisconnectGoogle,
  onConnectApple,
  onDisconnectApple,
  onConnectLineNotify,
  onDisconnectLineNotify,

  onExportData,
  onDeleteAccount,

  onOpenDocs,
  onOpenTerms,
  onOpenPrivacy,
  appVersion = '1.0.0 (build 100)',
}: Props) {
  // local UI state (สามารถผูกกับ store/query จริงได้)
  const [pushOn, setPushOn] = useState(true);
  const [emailOn, setEmailOn] = useState(true);
  const [digestOn, setDigestOn] = useState(false);
  const [twoFAOn, setTwoFAOn] = useState(false);

  const [integrations, setIntegrations] = useState({
    google: false,
    apple: false,
    line: false,
  });

  const confirmDelete = () =>
    Alert.alert('ลบบัญชี', 'การลบบัญชีเป็นการกระทำถาวรและไม่สามารถย้อนกลับได้ ต้องการดำเนินการต่อหรือไม่?', [
      { text: 'ยกเลิก', style: 'cancel' },
      { text: 'ลบถาวร', style: 'destructive', onPress: () => onDeleteAccount?.() },
    ]);

  return (
    <View style={S.container}>
      <ScrollView contentContainerStyle={S.scroll}>
        <Header />

        {/* โปรไฟล์ & องค์กร */}
        <Section title="โปรไฟล์ & องค์กร">
          <ItemPress
            title="โปรไฟล์ของฉัน"
            subtitle={email}
            onPress={onManageProfile ?? (() => Alert.alert('โปรไฟล์', 'เปิดหน้าโปรไฟล์'))}
          />
          <ItemPress
            title="ข้อมูลองค์กร"
            subtitle={orgName}
            onPress={onManageOrg ?? (() => Alert.alert('องค์กร', 'เปิดหน้าองค์กร'))}
          />
          <Divider />
          <ItemPress
            title="บิล & การชำระเงิน"
            subtitle="ประวัติบิล / วิธีชำระ / ที่อยู่วางบิล"
            onPress={onOpenBilling ?? (() => Linking.openURL('https://app.laloei.com/billing'))}
          />
          <ItemPress
            title="อัปเกรดแผน"
            subtitle="ปลดล็อกฟีเจอร์ Pro/Premium"
            accent
            onPress={onOpenUpgrade ?? (() => Linking.openURL('https://app.laloei.com/upgrade'))}
          />
        </Section>

        {/* ภาษา/เวลา */}
        <Section title="ภาษา & เวลา">
          <ItemSelect
            title="ภาษา"
            value={locale === 'th' ? 'ไทย (TH)' : 'English (EN)'}
            onPress={() => {
              const next = locale === 'th' ? 'en' : 'th';
              onChangeLocale?.(next as 'th' | 'en');
            }}
          />
          <ItemSelect
            title="โซนเวลา"
            value={timezone}
            onPress={onChangeTimezone ?? (() => Alert.alert('โซนเวลา', 'เปิดตัวเลือกโซนเวลา'))}
          />
          <Hint text="การเปลี่ยนภาษา/โซนเวลาอาจรีเฟรชแอพเพื่อให้มีผล" />
        </Section>

        {/* การแจ้งเตือน */}
        <Section title="การแจ้งเตือน">
          <ItemSwitch
            title="พุชแจ้งเตือน"
            value={pushOn}
            onValueChange={(v) => { setPushOn(v); onTogglePush?.(v); }}
          />
          <ItemSwitch
            title="อีเมลแจ้งสถานะคำขอลา"
            value={emailOn}
            onValueChange={(v) => { setEmailOn(v); onToggleEmail?.(v); }}
          />
          <ItemSwitch
            title="อีเมลสรุปรายวัน (Daily Digest)"
            value={digestOn}
            onValueChange={(v) => { setDigestOn(v); onToggleDailyDigest?.(v); }}
          />
          <Hint text="สามารถปรับความถี่แจ้งเตือนได้ที่หน้า โปรไฟล์ > การแจ้งเตือน" />
        </Section>

        {/* ความปลอดภัย */}
        <Section title="ความปลอดภัย">
          <ItemPress
            title="เปลี่ยนรหัสผ่าน"
            onPress={onChangePassword ?? (() => Alert.alert('เปลี่ยนรหัสผ่าน', 'เปิดหน้าเปลี่ยนรหัส'))}
          />
          <ItemSwitch
            title="เปิดการยืนยันตัวตน 2 ชั้น (2FA)"
            value={twoFAOn}
            onValueChange={(v) => { setTwoFAOn(v); onToggle2FA?.(v); }}
          />
          <ItemPress
            title="อุปกรณ์/เซสชันที่ใช้งาน"
            subtitle="จัดการอุปกรณ์ที่กำลังล็อกอิน"
            onPress={onViewSessions ?? (() => Alert.alert('เซสชัน', 'เปิดรายการอุปกรณ์'))}
          />
          <Hint text="หากเปิด 2FA ระบบจะขอรหัสจากแอป Authenticator ตอนเข้าสู่ระบบ" />
        </Section>

        {/* การเชื่อมต่อ (Integrations) */}
        <Section title="การเชื่อมต่อ">
          <ItemConnect
            title="Google"
            connected={integrations.google}
            onConnect={() => { setIntegrations(s => ({ ...s, google: true })); onConnectGoogle?.(); }}
            onDisconnect={() => { setIntegrations(s => ({ ...s, google: false })); onDisconnectGoogle?.(); }}
          />
          <ItemConnect
            title="Apple"
            connected={integrations.apple}
            onConnect={() => { setIntegrations(s => ({ ...s, apple: true })); onConnectApple?.(); }}
            onDisconnect={() => { setIntegrations(s => ({ ...s, apple: false })); onDisconnectApple?.(); }}
          />
          <ItemConnect
            title="LINE Notify"
            connected={integrations.line}
            onConnect={() => { setIntegrations(s => ({ ...s, line: true })); onConnectLineNotify?.(); }}
            onDisconnect={() => { setIntegrations(s => ({ ...s, line: false })); onDisconnectLineNotify?.(); }}
          />
        </Section>

        {/* ข้อมูล & ความเป็นส่วนตัว */}
        <Section title="ข้อมูล & ความเป็นส่วนตัว">
          <ItemPress
            title="Export ข้อมูลของฉัน"
            subtitle="ไฟล์ JSON/CSV"
            onPress={onExportData ?? (() => Alert.alert('Export', 'เตรียมไฟล์ข้อมูล'))}
          />
          <ItemPress
            title="ลบบัญชี"
            subtitle="ลบข้อมูลและยกเลิกการใช้งาน (ถาวร)"
            danger
            onPress={confirmDelete}
          />
        </Section>

        {/* เกี่ยวกับระบบ */}
        <Section title="เกี่ยวกับระบบ">
          <ItemPress
            title="คู่มือการใช้งาน"
            onPress={onOpenDocs ?? (() => Linking.openURL('https://docs.laloei.com'))}
          />
          <ItemPress
            title="เงื่อนไขการใช้บริการ"
            onPress={onOpenTerms ?? (() => Linking.openURL('https://laloei.com/terms'))}
          />
          <ItemPress
            title="นโยบายความเป็นส่วนตัว"
            onPress={onOpenPrivacy ?? (() => Linking.openURL('https://laloei.com/privacy'))}
          />
          <Text style={S.version}>เวอร์ชันแอพ: {appVersion}</Text>
        </Section>

        <View style={{ height: 28 }} />
      </ScrollView>
    </View>
  );
}

/* ---------------- Components ---------------- */
function Header() {
  return (
    <View style={S.header}>
      <Text style={S.title}>ตั้งค่าระบบ</Text>
      <Text style={S.subtitle}>ปรับแต่งแอพให้เหมาะกับทีมและการทำงานของคุณ</Text>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={S.section}>
      <Text style={S.sectionTitle}>{title}</Text>
      <View style={{ marginTop: 8 }}>{children}</View>
    </View>
  );
}

function Divider() {
  return <View style={S.divider} />;
}

function Hint({ text }: { text: string }) {
  return <Text style={S.hint}>{text}</Text>;
}

function ItemPress({
  title, subtitle, onPress, accent, danger,
}: {
  title: string;
  subtitle?: string;
  onPress?: () => void;
  accent?: boolean;
  danger?: boolean;
}) {
  return (
    <TouchableOpacity onPress={onPress} style={[S.item, accent && S.itemAccent, danger && S.itemDanger]}>
      <View style={{ flex: 1 }}>
        <Text style={[S.itemTitle, danger && { color: '#BE123C' }]}>{title}</Text>
        {!!subtitle && <Text style={S.itemSub}>{subtitle}</Text>}
      </View>
      <Text style={S.chev}>›</Text>
    </TouchableOpacity>
  );
}

function ItemSelect({
  title, value, onPress,
}: { title: string; value?: string; onPress?: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={S.item}>
      <Text style={S.itemTitle}>{title}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        {!!value && <Text style={S.valueText}>{value}</Text>}
        <Text style={S.chev}>›</Text>
      </View>
    </TouchableOpacity>
  );
}

function ItemSwitch({
  title, value, onValueChange,
}: { title: string; value: boolean; onValueChange?: (v: boolean) => void }) {
  return (
    <View style={S.item}>
      <Text style={S.itemTitle}>{title}</Text>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );
}

function ItemConnect({
  title, connected, onConnect, onDisconnect,
}: {
  title: string;
  connected: boolean;
  onConnect?: () => void;
  onDisconnect?: () => void;
}) {
  return (
    <View style={S.item}>
      <Text style={S.itemTitle}>{title}</Text>
      {connected ? (
        <TouchableOpacity style={[S.btnSm, { backgroundColor: '#FFE4E6' }]} onPress={onDisconnect}>
          <Text style={[S.btnSmText, { color: '#BE123C' }]}>ยกเลิกเชื่อมต่อ</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={S.btnSm} onPress={onConnect}>
          <Text style={S.btnSmText}>เชื่อมต่อ</Text>
        </TouchableOpacity>
      )}
    </View>
    );
}
const P = 16, R = 18;
const S = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6FAFF' },
  scroll: { padding: P },

  header: { marginBottom: 8 },
  title: { fontSize: 22, fontWeight: '800', color: '#0F172A' },
  subtitle: { marginTop: 6, fontSize: 13, color: '#475569' },

  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: R,
    padding: 14,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#EEF2F7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A' },

  item: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: '#FBFEFF',
    borderWidth: 1,
    borderColor: '#EAF2FF',
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'space-between',
  },
  itemAccent: { backgroundColor: '#ECFEFF', borderColor: '#CFFAFE' },
  itemDanger: { backgroundColor: '#FFF1F2', borderColor: '#FFE4E6' },

  itemTitle: { color: '#0F172A', fontWeight: '800' },
  itemSub: { color: '#64748B', fontSize: 12, marginTop: 2 },
  valueText: { color: '#0F172A' },

  hint: { color: '#64748B', fontSize: 12, marginTop: 8 },

  divider: { height: 1, backgroundColor: '#EEF2F7', marginTop: 8 },

  btnSm: { backgroundColor: '#EAF2FF', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10 },
  btnSmText: { color: '#0C4A6E', fontWeight: '800', fontSize: 12 },

  chev: { color: '#94A3B8', fontSize: 18 },

  version: { marginTop: 10, color: '#64748B', fontSize: 12, textAlign: 'right' },
});
 