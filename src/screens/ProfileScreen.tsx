// screens/ProfileLaloei009.tsx
import React, { useCallback, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, Platform, StatusBar,
  TouchableOpacity, ScrollView,
  StyleProp, ViewStyle, StyleSheet as RNStyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as SecureStore from 'expo-secure-store';
import { useAuthStore } from '../store/useAuthStore';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { ProfileStackParamList } from '../navigation/RootStackParamList';
import LanguageSheet from '../components/LanguageSheet';
import i18n from '../lang/i18n';
import { useTranslation } from 'react-i18next';


type Props = {
  onBack?: () => void;
  onEditProfile?: () => void;
  onShowQR?: () => void;
  onOpenLanguage?: () => void;
  onOpenPassword?: () => void;
  onOpenTerms?: () => void;
  onOpenDeviceInfo?: () => void;
  onLogout?: () => void;
};

const COLOR = {
  bgTopA: '#E8F3FF',
  bgTopB: '#F4FBFF',
  brand: '#2AA5E1',
  dark: '#0F172A',
  dim: '#607089',
  card: '#FFFFFF',
  line: '#EAF0F6',
  success: '#0A7C66',
  warn: '#9A6400',
};

const SHADOW: StyleProp<ViewStyle> = Platform.select({
  ios: { shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 6 } },
  android: { elevation: 4 },
}) as any;

const ProfileLaloei: React.FC<Props> = ({
  onBack, onEditProfile, onShowQR, onOpenLanguage, onOpenPassword, onOpenTerms, onLogout, onOpenDeviceInfo
}) => {
 const { t, i18n } = useTranslation();

  const nav = useNavigation<NavigationProp<ProfileStackParamList>>();
  const profile = useAuthStore(s => s.profile);

  const [openLang, setOpenLang] = useState(false);
  const handleOpenLanguage = useCallback(() => setOpenLang(true), []);
  const currentLangCode = (i18n.resolvedLanguage || i18n.language || '').startsWith('th') ? 'th' : 'en';
  const currentLabel = currentLangCode === 'th' ? 'ไทย' : 'English';
  useEffect(() => {
    SecureStore.getItemAsync('app-lang').then((l) => {
      if (l === 'th' || l === 'en') i18n.changeLanguage(l);
    });
  }, []);

  const switchLang = useCallback(async (l: 'th' | 'en') => {
    const current = (i18n.resolvedLanguage || i18n.language || '').startsWith('th') ? 'th' : 'en';
    if (current === l) return;
    try {
      await i18n.changeLanguage(l);          // เปลี่ยนภาษา
      await SecureStore.setItemAsync('app-lang', l); // จำค่าไว้
    } catch (e) {
      console.warn('changeLanguage error:', e);
    }
  }, []);

  // mock ข้อมูลผู้ใช้
  const user = {
    name: profile?.name || 'โสภณ ใจดี',
    dept: 'ฝ่ายพัฒนาแอพพลิเคชัน',
    empId: 'EMP-001234',
    // avatarUri: 'https://...' // ถ้ามีรูปจริงให้ใช้ <Image />
  };

  // mock สิทธิ์วันลา
  const leave = {
    annualRemain: '7/12', // ลาประจำปีคงเหลือ
    sickRemain: '8/10',   // ลาป่วยคงเหลือ
  };

  // Mock organization and permissions (replace with real data/props as needed)
  const orgId = profile?.orgId ?? null;
  const isOwnerOrAdmin = profile?.orgs.some(o => o.id === orgId && (o.role === 'owner' || o.role === 'admin')) ?? false;
  const orgName = profile?.orgs.find(o => o.id === orgId)?.name || 'องค์กรของฉัน';

  // Mock handlers (replace with real handlers as needed)
  const onCreateOrg = () => { };
  const onOpenOrgSettings = () => { };
  const onInviteMembers = () => { };
  const onOpenOrgProfile = () => { };


  return (
    <View style={{ flex: 1, backgroundColor: '#F7FAFD' }}>
      <StatusBar barStyle="dark-content" />

      {/* HEADER: gradient เป็นพื้นหลัง ไม่กินทัช */}
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={[COLOR.bgTopA, COLOR.bgTopB]}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={RNStyleSheet.absoluteFill}
          pointerEvents="none"
        />
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={onBack} hitSlop={HIT} style={styles.navLeft}>
            <Text style={styles.back}>{'‹'}</Text>
          </TouchableOpacity>

          {/* ชื่อหน้า “ชิดขวา” ตามที่เคยขอ */}
          <View style={styles.titleWrapRight}>
            <Text style={styles.headerTitle} numberOfLines={1}>{t('profile.title')}</Text>
          </View>

          {/* พื้นที่ด้านขวาเผื่ออนาคต */}
          <View style={styles.navRight} />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
        {/* การ์ดโปรไฟล์ */}
        <View style={[styles.profileCard, SHADOW]}>
          {/* Avatar */}
          <View style={styles.avatarWrap}>
            {/* ถ้ามีรูปจริง: 
              <Image source={{ uri: user.avatarUri }} style={styles.avatarImg} />
            */}
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarLetter}>โ</Text>
            </View>

            <TouchableOpacity style={styles.editBadge} onPress={onEditProfile} activeOpacity={0.85}>
              <Text style={styles.editText}>{t('common.edit')}</Text>
            </TouchableOpacity>
          </View>

          {/* ชื่อ + แผนก + Employee ID */}
          <View style={{ flex: 1 }}>
            <Text style={styles.name} numberOfLines={1}>{user.name}</Text>
            <Text style={styles.dept} numberOfLines={1}>{user.dept}</Text>

            <View style={styles.idRow}>
              <Text style={styles.idLabel}>{t('profile.employeeId')}</Text>
              <View style={styles.idChip}><Text style={styles.idChipText}>{user.empId}</Text></View>
            </View>
          </View>

          {/* ปุ่ม QR */}
          <TouchableOpacity style={styles.qrBtn} onPress={onShowQR} activeOpacity={0.9}>
            <Text style={styles.qrBtnText}>QR</Text>
          </TouchableOpacity>
        </View>

        {/* กริดสรุปสิทธิ์วันลา (โทนเดียวกับ 002) */}
        <View style={[styles.statGrid, SHADOW]}>
          <StatPill title={t('dashboard.stats.leave_annual')} value={`${leave.annualRemain} ${t('common.days')}`} tone="success" />
          <StatPill title={t('dashboard.stats.leave_sick')} value={`${leave.sickRemain} ${t('common.days')}`} tone="warn" />
        </View>

        {/* การ์ดเมนูตั้งค่า */}
        <View style={[styles.menuCard, SHADOW]}>
          <MenuItem icon="🌐" title={t('profile.changeLanguage')} subtitle={currentLabel} onPress={handleOpenLanguage} />
          <LanguageSheet
            visible={openLang}
            value={currentLangCode}               // 'th' | 'en'
            onSelect={async (lang) => {
              await switchLang(lang as 'th' | 'en');
              setOpenLang(false);
            }}
            onClose={() => setOpenLang(false)}
          />
          <Divider />
          <MenuItem icon="🔐" title={t('profile.changePassword')} subtitle={t('profile.changePasswordSubtitle')} onPress={onOpenPassword} />
          {/* create organization */}
          {!orgId ? (
            <>
              <Divider />
              <MenuItem
                icon="🏢"
                title={t('profile.createOrganization')}
                subtitle="ตั้งชื่อ • โดเมนย่อย • ทดลอง 30 วัน"
                onPress={onCreateOrg}
              />
            </>
          ) : isOwnerOrAdmin ? (
            <>
              <Divider />
              <MenuItem
                icon="🏢"
                title={`${t('profile.myOrganization')}`}
                // subtitle="ข้อมูลองค์กร • สมาชิก • สิทธิ์อนุมัติ"
                subtitle={orgName}
                onPress={onOpenOrgSettings}
              />
              <Divider />
              <MenuItem
                icon="👥"
                title={t('profile.inviteMembers')}
                subtitle={t('profile.inviteMembersSubtitle')}
                onPress={onInviteMembers}
              />
            </>
          ) : (
            <>
              <Divider />
              <MenuItem
                icon="🏢"
                title={t('profile.myOrganization')}
                subtitle={orgName}
                onPress={onOpenOrgProfile}
              />
            </>
          )}
          <Divider />
          <MenuItem icon="💼" title={t('profile.deviceInfo')} subtitle="Device Info" onPress={onOpenDeviceInfo} />
          <Divider />
          <MenuItem icon="📄" title={t('profile.termsOfService')} subtitle="Terms & Privacy" onPress={onOpenTerms} />
        </View>

        {/* ปุ่มออกจากระบบ */}
        <TouchableOpacity style={[styles.logoutBtn, SHADOW]} onPress={onLogout} activeOpacity={0.9}>
          <Text style={styles.logoutText}>{t('profile.logout')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default ProfileLaloei;

/* ---------------- Sub Components ---------------- */

const StatPill: React.FC<{ title: string; value: string; tone?: 'success' | 'warn' | 'danger' }> =
  ({ title, value, tone = 'success' }) => {
    const bg = tone === 'success' ? '#E9FBF4' : tone === 'warn' ? '#FFF6E5' : '#FCE9E9';
    const fg = tone === 'success' ? COLOR.success : tone === 'warn' ? COLOR.warn : '#9A1B1B';
    return (
      <View style={[styles.pill, { backgroundColor: bg }]}>
        <Text style={[styles.pillTitle, { color: fg }]} numberOfLines={1}>{title}</Text>
        <Text style={[styles.pillValue, { color: fg }]} numberOfLines={1}>{value}</Text>
      </View>
    );
  };

const MenuItem: React.FC<{ icon: string; title: string; subtitle?: string; onPress?: () => void }> =
  ({ icon, title, subtitle, onPress }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.menuIcon}><Text style={{ fontSize: 18 }}>{icon}</Text></View>
      <View style={{ flex: 1 }}>
        <Text style={styles.menuTitle}>{title}</Text>
        {!!subtitle && <Text style={styles.menuSub}>{subtitle}</Text>}
      </View>
      <Text style={styles.chev}>›</Text>
    </TouchableOpacity>
  );

const Divider = () => <View style={styles.divider} />;

const HIT = { top: 10, bottom: 10, left: 10, right: 10 };

/* ---------------- Styles ---------------- */
const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: Platform.OS === 'ios' ? 64 : 52,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  headerRow: { height: 44, justifyContent: 'center' },
  navLeft: {
    position: 'absolute', left: 0, top: 0, bottom: 0, width: 44,
    alignItems: 'flex-start', justifyContent: 'center',
  },
  navRight: {
    position: 'absolute', right: 0, top: 0, bottom: 0, width: 44,
    alignItems: 'flex-end', justifyContent: 'center',
  },
  titleWrapRight: {
    position: 'absolute', left: 52, right: 0, height: 44,
    alignItems: 'flex-end', justifyContent: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: COLOR.dark },
  back: { fontSize: 26, color: COLOR.dim, lineHeight: 26 },

  profileCard: {
    marginTop: 14,
    backgroundColor: COLOR.card,
    borderRadius: 20,
    borderWidth: 1, borderColor: COLOR.line,
    padding: 16,
    flexDirection: 'row', alignItems: 'center', gap: 14,
  },
  avatarWrap: { width: 64 },
  avatarCircle: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: '#3B82F6', alignItems: 'center', justifyContent: 'center',
  },
  avatarImg: { width: 64, height: 64, borderRadius: 32 },
  avatarLetter: { color: '#fff', fontSize: 28, fontWeight: '900' },
  editBadge: {
    alignSelf: 'center', marginTop: 6,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999,
    backgroundColor: '#E0F2FF', borderWidth: 1, borderColor: '#D4EAFE',
  },
  editText: { color: COLOR.brand, fontWeight: '800', fontSize: 12 },

  name: { fontSize: 16.5, fontWeight: '900', color: COLOR.dark },
  dept: { fontSize: 12.5, color: COLOR.dim, marginTop: 2 },
  idRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  idLabel: { fontSize: 12, color: COLOR.dim },
  idChip: {
    borderRadius: 999, backgroundColor: '#EFF6FF',
    paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: '#DCEBFF',
  },
  idChipText: { fontSize: 12, fontWeight: '800', color: '#1D4ED8' },

  qrBtn: {
    width: 42, height: 42, borderRadius: 12,
    backgroundColor: '#E0F2FF', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#D4EAFE',
  },
  qrBtnText: { color: COLOR.brand, fontWeight: '900' },

  statGrid: {
    marginTop: 14,
    backgroundColor: COLOR.card,
    borderRadius: 20,
    borderWidth: 1, borderColor: COLOR.line,
    padding: 14,
    flexDirection: 'row', gap: 12,
  },
  pill: { flex: 1, borderRadius: 16, paddingVertical: 12, paddingHorizontal: 12 },
  pillTitle: { fontSize: 12.5, fontWeight: '700', marginBottom: 6 },
  pillValue: { fontSize: 18, fontWeight: '900' },

  menuCard: {
    marginTop: 14,
    backgroundColor: COLOR.card,
    borderRadius: 20,
    borderWidth: 1, borderColor: COLOR.line,
    overflow: 'hidden',
  },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12, gap: 12 },
  menuIcon: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#F3F7FB', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: COLOR.line,
  },
  menuTitle: { fontSize: 14, fontWeight: '900', color: COLOR.dark },
  menuSub: { fontSize: 12, color: COLOR.dim, marginTop: 2 },
  chev: { fontSize: 20, color: COLOR.dim, paddingLeft: 6 },
  divider: { height: 1, backgroundColor: COLOR.line },

  logoutBtn: {
    marginTop: 16,
    backgroundColor: '#FFF1F2',
    borderColor: '#FBD5DC',
    borderWidth: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  logoutText: { color: '#B42334', fontWeight: '900', fontSize: 14 },
});
