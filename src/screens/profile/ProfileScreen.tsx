// screens/ProfileLaloei009.tsx
import { CommonActions, NavigationProp, useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { SectionTitle } from '../../components';
import { BackgroundFX } from '../../components/Background';
import LanguageSheet from '../../components/LanguageSheet';
import { ProfileStackParamList } from '../../navigation/RootStackParamList';
import { useAuthStore, useUserRole } from '../../store/useAuthStore';
import { CONSTANTS } from '@/src/config';

// ---------- Theme ----------
const COLOR = {
  bg: '#F6FAFF',
  brand: '#0EA5E9',
  dark: '#0F172A',
  dim: '#607089',
  card: '#FFFFFF',
  line: '#EAF0F6',
  chipBg: '#EFF6FF',
  chipBorder: '#DCEBFF',
  accentBg: '#E0F2FF',
  accentBorder: '#D4EAFE',
  dangerBg: '#FFF1F2',
  dangerBorder: '#FBD5DC',
  dangerText: '#B42334',
};

const SHADOW: StyleProp<ViewStyle> = Platform.select({
  ios: { shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: 6 } },
  android: { elevation: 3 },
}) as any;

const HIT = { top: 10, bottom: 10, left: 10, right: 10 };

// ---------- Screen ----------
type Props = {
  onBack?: () => void;
  onEditProfile?: () => void;
  onShowQR?: () => void;
  onOpenLanguage?: () => void;
  onOpenPassword?: () => void;
  onOpenCreateOrg?: () => void;
  onOpenMyOrganization?: () => void;
  onInviteMembers?: () => void;
  onOpenTerms?: () => void;
  onOpenDeviceInfo?: () => void;
  onLogout?: () => void;
};

const ProfileLaloei: React.FC<Props> = ({
  onEditProfile,
  onShowQR,
  onOpenLanguage,
  onOpenPassword,
  onOpenCreateOrg,
  onOpenMyOrganization,
  onInviteMembers,
  onOpenTerms,
  onLogout,
  onOpenDeviceInfo,
}) => {
  const { t, i18n } = useTranslation();
  const nav = useNavigation<NavigationProp<ProfileStackParamList>>();
  const profile = useAuthStore((s) => s.profile);
  const role = useUserRole();

  const [openLang, setOpenLang] = useState(false);
  const handleOpenLanguage = useCallback(() => setOpenLang(true), []);
  const currentLangCode = (i18n.resolvedLanguage || i18n.language || '').startsWith('th') ? 'th' : 'en';
  const currentLabel = currentLangCode === 'th' ? 'ไทย' : 'English';

  useEffect(() => {
    SecureStore.getItemAsync(CONSTANTS.LS_LANG).then((l) => {
      if (l === 'th' || l === 'en') i18n.changeLanguage(l);
    });
  }, []);

  const switchLang = useCallback(
    async (l: 'th' | 'en') => {
      const current = (i18n.resolvedLanguage || i18n.language || '').startsWith('th') ? 'th' : 'en';
      if (current === l) return;
      try {
        await i18n.changeLanguage(l);
        await SecureStore.setItemAsync(CONSTANTS.LS_LANG, l);
      } catch (e) {
        console.warn('changeLanguage error:', e);
      }
    },
    [i18n],
  );

  const orgId = profile?.org?.id ?? null;
  const isOwnerOrAdmin =
    role === 'ORGADMIN' || role === 'MANAGER' || role === 'HRADMIN' || role === 'OWNER';

  const userName = profile?.name || 'โสภณ ใจดี';
  // const userDept = profile?.department?.name || 'ฝ่ายพัฒนาแอพพลิเคชัน';
  // const empId = profile?.employeeId || 'EMP-001234';
  const userDept =  'ฝ่ายทรัพยากรบุคคล';
  const empId = 'EMP-000001';

  const initials = useMemo(() => getInitials(userName), [userName]);

  // Default handlers
  const _onOpenPassword = onOpenPassword ?? (() => nav.navigate('ChangePassword'));
  const _onOpenLanguage = onOpenLanguage ?? (() => nav.navigate('ChangeLanguage'));
  const _onOpenCreateOrg = onOpenCreateOrg ?? (() => nav.navigate('CreateOrganization'));
  const _onOpenMyOrganization =
    onOpenMyOrganization ??
    (() => {
      nav.navigate('MyOrganization');
    });
  // const _onInviteMembers = onInviteMembers ?? (() => nav.navigate('InviteMember'));
  const _onOpenDeviceInfo =
    onOpenDeviceInfo ?? (() => nav.navigate('DeviceInfo' as any)); // ปรับตาม Route จริง

  const _onLogout =
    onLogout ??
    (() => {
      useAuthStore.getState().logout();
      nav.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'AuthStack' }],
        }),
      );
    });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLOR.bg }}>
      <BackgroundFX />
      <StatusBar barStyle="dark-content" />

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
        <HeaderCompact title={t('profile.title', 'โปรไฟล์')} />

        {/* Profile Card */}
        <View style={[styles.profileCard, SHADOW]} accessibilityLabel="Profile Card">
          <View style={styles.avatarWrap}>
            <View style={styles.avatarCircle} accessible accessibilityLabel={`Avatar ของ ${userName}`}>
              <Text style={styles.avatarLetter}>{initials}</Text>
            </View>

            <TouchableOpacity
              style={styles.editBadge}
              onPress={onEditProfile}
              activeOpacity={0.85}
              hitSlop={HIT}
              accessibilityRole="button"
              accessibilityLabel={t('common.edit', 'แก้ไขโปรไฟล์')}
            >
              <Text style={styles.editText}>{t('common.edit', 'แก้ไข')}</Text>
            </TouchableOpacity>
          </View>

          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={styles.name} numberOfLines={1}>{userName}</Text>
            <Text style={styles.dept} numberOfLines={1}>{userDept}</Text>

            <View style={styles.idRow}>
              <Text style={styles.idLabel}>{t('profile.employeeId', 'รหัสพนักงาน')}</Text>
              <View style={styles.idChip}>
                <Text style={styles.idChipText}>{empId}</Text>
              </View>
            </View>
          </View>

          <IconButton
            label="QR"
            onPress={onShowQR}
            a11yLabel="เปิดคิวอาร์โค้ด"
          />
        </View>

        {/* Settings */}
        <SectionTitle title={t('profile.settings', 'การตั้งค่า')} icon="settings-outline" />

        <View style={[styles.menuCard, SHADOW]}>
          <RowLink
            emoji="🌐"
            title={t('profile.changeLanguage', 'เปลี่ยนภาษา')}
            subtitle={currentLabel}
            onPress={handleOpenLanguage}
          />
          <LanguageSheet
            title={t('language.title', 'เลือกภาษา')}
            visible={openLang}
            value={currentLangCode}
            action={t('common.close', 'ปิด')}
            onSelect={async (lang) => {
              await switchLang(lang as 'th' | 'en');
              setOpenLang(false);
            }}
            onClose={() => setOpenLang(false)}
          />
          <Divider />
          <RowLink
            emoji="🔐"
            title={t('profile.changePassword', 'เปลี่ยนรหัสผ่าน')}
            subtitle={t('profile.changePasswordSubtitle', 'อัปเดตรหัสผ่านของคุณ')}
            onPress={_onOpenPassword}
          />

          {!orgId ? (
            <>
              <Divider />
              <RowLink
                emoji="🏢"
                title={t('profile.createOrganization', 'สร้างองค์กร')}
                subtitle="ตั้งชื่อ • โดเมนย่อย • ทดลอง 30 วัน"
                onPress={_onOpenCreateOrg}
              />
            </>
          ) : isOwnerOrAdmin ? (
            <>
              <Divider />
              <RowLink
                emoji="🏢"
                title={t('profile.myOrganization', 'องค์กรของฉัน')}
                subtitle="ข้อมูลองค์กร • สมาชิก • สิทธิ์อนุมัติ"
                onPress={_onOpenMyOrganization}
              />
              {/* <Divider />
              <RowLink
                emoji="👥"
                title={t('profile.inviteMembers', 'เชิญสมาชิก')}
                subtitle={t('profile.inviteMembersSubtitle', 'ส่งอีเมลหรือลิงก์เชิญ')}
                onPress={_onInviteMembers}
              /> */}
            </>
          ) : (
            <>
              <Divider />
              <RowLink
                emoji="🏢"
                title={t('profile.myOrganization', 'องค์กรของฉัน')}
                subtitle={profile?.org?.name || 'องค์กรของฉัน'}
                onPress={() => {}}
              />
            </>
          )}

          <Divider />
          <RowLink
            emoji="💼"
            title={t('profile.deviceInfo', 'ข้อมูลอุปกรณ์')}
            subtitle="Device & App Info"
            onPress={_onOpenDeviceInfo}
          />
          <Divider />
          <RowLink
            emoji="📄"
            title={t('profile.termsOfService', 'ข้อกำหนดการใช้งาน')}
            subtitle="Terms & Privacy"
            onPress={onOpenTerms}
          />
        </View>

        <TouchableOpacity
          style={[styles.logoutBtn, SHADOW]}
          onPress={_onLogout}
          activeOpacity={0.9}
          accessibilityRole="button"
          accessibilityLabel={t('profile.logout', 'ออกจากระบบ')}
        >
          <Text style={styles.logoutText}>{t('profile.logout', 'ออกจากระบบ')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default memo(ProfileLaloei);

// ---------- Sub Components ----------
const HeaderCompact = memo(({ title }: { title: string }) => (
  <View style={{ paddingTop: 6, paddingBottom: 2 }}>
    <Text style={{ fontSize: 22, fontWeight: '900', color: COLOR.dark }}>{title}</Text>
    <Text style={{ marginTop: 4, color: '#64748B' }}>
      จัดการโปรไฟล์ ภาษา องค์กร และความปลอดภัย
    </Text>
  </View>
));

const IconButton = memo(({ label, onPress, a11yLabel }: { label: string; onPress?: () => void; a11yLabel?: string }) => (
  <TouchableOpacity
    style={styles.qrBtn}
    onPress={onPress}
    hitSlop={HIT}
    accessibilityRole="button"
    accessibilityLabel={a11yLabel || label}
  >
    <Text style={styles.qrBtnText}>{label}</Text>
  </TouchableOpacity>
));

const RowLink = memo(
  ({ emoji, title, subtitle, onPress }: { emoji: string; title: string; subtitle?: string; onPress?: () => void }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.menuIcon}>
        <Text style={{ fontSize: 18 }}>{emoji}</Text>
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={styles.menuTitle} numberOfLines={1}>{title}</Text>
        {!!subtitle && <Text style={styles.menuSub} numberOfLines={1}>{subtitle}</Text>}
      </View>
      <Text style={styles.chev}>›</Text>
    </TouchableOpacity>
  ),
);

const Divider = memo(() => <View style={styles.divider} />);

// ---------- Helpers ----------
function getInitials(name: string) {
  // รองรับไทย/อังกฤษ: ใช้ตัวอักษรตัวแรกของคำแรก; ถ้ามีชื่อ-สกุล ดึง 2 ตัว
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '🙂';
  if (parts.length === 1) return parts[0].slice(0, 1);
  return (parts[0].slice(0, 1) + parts[1].slice(0, 1)).toUpperCase();
}

// ---------- Styles ----------
const styles = StyleSheet.create({
  profileCard: {
    marginTop: 14,
    backgroundColor: COLOR.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLOR.line,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    overflow: 'hidden',
    marginBottom: 24,
  },
  avatarWrap: { width: 64, alignItems: 'center' },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: { color: '#fff', fontSize: 22, fontWeight: '900' },
  editBadge: {
    marginTop: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: COLOR.accentBg,
    borderWidth: 1,
    borderColor: COLOR.accentBorder,
  },
  editText: { color: COLOR.brand, fontWeight: '800', fontSize: 12 },

  name: { fontSize: 17, fontWeight: '900', color: COLOR.dark },
  dept: { fontSize: 12.5, color: COLOR.dim, marginTop: 2 },
  idRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8, flexWrap: 'wrap' },
  idLabel: { fontSize: 12, color: COLOR.dim },
  idChip: {
    borderRadius: 999,
    backgroundColor: COLOR.chipBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: COLOR.chipBorder,
  },
  idChipText: { fontSize: 12, fontWeight: '800', color: '#1D4ED8' },

  qrBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: COLOR.accentBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLOR.accentBorder,
  },
  qrBtnText: { color: COLOR.brand, fontWeight: '900' },

  menuCard: {
    marginTop: 14,
    backgroundColor: COLOR.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLOR.line,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 12,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F7FB',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLOR.line,
  },
  menuTitle: { fontSize: 14, fontWeight: '900', color: COLOR.dark },
  menuSub: { fontSize: 12, color: COLOR.dim, marginTop: 2 },
  chev: { fontSize: 20, color: COLOR.dim, paddingLeft: 6 },
  divider: { height: 1, backgroundColor: COLOR.line },

  logoutBtn: {
    marginTop: 16,
    backgroundColor: COLOR.dangerBg,
    borderColor: COLOR.dangerBorder,
    borderWidth: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  logoutText: { color: COLOR.dangerText, fontWeight: '900', fontSize: 14 },
});
