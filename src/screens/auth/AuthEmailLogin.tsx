// screens/AuthEmailLogin.tsx
import { useAuthStore } from '@/src/store/useAuthStore';
import { NavigationProp, useNavigation } from '@react-navigation/core';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getMe, loginWithEmail } from '../../connections/auth/authApi';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import { BackgroundFX } from '@/src/components/Background';
import { FONT } from '@/src/theme/token';
import { useTranslation } from 'react-i18next';
import i18n from '@/src/lang/i18n';

type Props = {
  onBack?: () => void;
  onLogin?: (payload: { email: string; password: string; remember: boolean }) => Promise<void> | void;
  onForgot?: (email?: string) => void;
  onRegister?: () => void;
};

const COLOR = {
  bgTopA: '#CFEAFF',
  bgTopB: '#E9FEFF',
  brandA: '#3c97c4ff',
  brandB: '#90ddcb82',
  brandSoft: '#E0F2FF',
  dark: '#0F172A',
  dim: '#607089',
  card: 'rgba(255, 255, 255, 0.5)',
  line: 'rgba(255,255,255,0.65)',
  danger: '#E5484D',
};
const HIT = { top: 10, bottom: 10, left: 10, right: 10 };

const AuthEmailLogin: React.FC<Props> = ({ onLogin, onForgot, onRegister }) => {
  const { t } = useTranslation();
  const nav = useNavigation<NavigationProp<RootStackParamList>>();
  const safeGoBack = () => {
    if (nav.canGoBack()) nav.goBack();
    else nav.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
  };

  const login = useAuthStore((s) => s.login);
  const setProfile = useAuthStore((s) => s.setProfile);

  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // const [email, setEmail] = useState('admin@laloei.com');
  const [email, setEmail] = useState('ph.yotaruk@gmail.com');
  const [password, setPassword] = useState('P@ssw0rd123');

  const emailValid = validateEmail(email);
  const passValid = password.length >= 6;
  const canSubmit = emailValid && passValid && !loading;

  const submit = async () => {
    if (!canSubmit) return;
    setError(null);
    try {
      setLoading(true);
      const emailNorm = email.trim().toLowerCase();

      const res = await loginWithEmail({
        email: emailNorm,
        username: emailNorm,
        password,
        remember,
      } as any);
      // const currentLangCode = (i18n.resolvedLanguage || i18n.language || '').startsWith('th') ? 'th-TH' : 'en-EN';

      // console.log('Login successful, fetching user profile...', currentLangCode);
      const me = await getMe(res.access_token);

      console.log('User profile fetched successfully:', me.menus);

      login(res.access_token);
      setProfile({
        id: me.user.id,
        email: me.user.email,
        name: me.user.name ?? null,
        locale: me.preferences.locale ?? null,
        timezone: me.preferences.timezone ?? null,
        // department: me.user.department ?? null,
        // position: me.user.position ?? null,
        avatarUri: me.user.avatar_url ?? null,
        menus: me.menus ?? [],
        permissions: me.permissions ?? [],
        org: me.active_org ?? null,
        roles: me.user.roles ?? [],
      });

      await onLogin?.({ email, password, remember });
      if (!onLogin) nav.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
    } catch (e: any) {
      const msg = String(e?.message || '');
      if (msg.toLowerCase().includes('email must be an email')) setError('รูปแบบอีเมลไม่ถูกต้อง');
      else if (msg.toLowerCase().includes('unauthorized')) setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      else setError('เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F7FAFD' }} edges={['left', 'right', 'bottom']}>
      {/* BG เต็มจอ */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <BackgroundFX />
      </View>

      <StatusBar barStyle="dark-content" />

      {/* HEADER: ชิดขอบบนสุด + gradient + glass aura */}
      <View style={styles.headerWrap}>
        <LinearGradient
          colors={[COLOR.bgTopA, COLOR.bgTopB]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        {/* Bubbles แสงนวล */}
        <View style={[styles.bubble, { top: -30, left: -40, width: 180, height: 180, opacity: 0.35 }]} />
        <View style={[styles.bubble, { top: 20, right: -60, width: 220, height: 220, opacity: 0.25 }]} />
        <View style={[styles.bubbleSoft, { bottom: -70, left: -20, width: 260, height: 260, opacity: 0.22 }]} />

        <View style={styles.headerRow}>
          <TouchableOpacity onPress={safeGoBack} hitSlop={HIT} style={styles.backBtn} accessibilityLabel="ย้อนกลับ">
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { fontFamily: FONT.heading }]}>{t('auth.login')}</Text>
          <View style={{ width: 40 }} />
        </View>
      </View>

      {/* BODY: การ์ดแก้วใส ลอยทับหัว */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={styles.bodyContainer}>
          <View style={styles.card}>
            <Text style={[styles.title, { fontFamily: FONT.heading }]}>{t('auth.loginWithEmail')}</Text>
            <Text style={[styles.sub, { fontFamily: FONT.body }]}>{t('auth.loginSubtitle')}</Text>

            {/* Email */}
            <Text style={[styles.label, { fontFamily: FONT.body }]}>{t('auth.email')}</Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              placeholder={t('auth.emailPlaceholder')}
              value={email}
              onChangeText={(t) => {
                const s = t.replace(/\s/g, '');
                setEmail(s);
                setError(null);
              }}
              style={[styles.input, { fontFamily: FONT.body }, !!email && !emailValid && styles.inputError]}
              returnKeyType="next"
            />
            {!!email && !emailValid && <Text style={[styles.error, { fontFamily: FONT.body }]}>{t('auth.invalidEmail')}</Text>}

            {/* Password */}
            <Text style={[styles.label, { fontFamily: FONT.body }]}>{t('auth.password')}</Text>
            <View style={[styles.inputRow, password.length > 0 && !passValid && styles.inputError]}>
              <TextInput
                placeholder={t('auth.minLength')}
                value={password}
                onChangeText={(t) => {
                  setPassword(t);
                  setError(null);
                }}
                secureTextEntry={!showPw}
                style={[styles.inputFlex, { fontFamily: FONT.body }]}
                returnKeyType="done"
                onSubmitEditing={submit}
              />
              <TouchableOpacity onPress={() => setShowPw((v) => !v)} hitSlop={HIT}>
                <Text style={[styles.togglePw, { fontFamily: FONT.body }]}>{showPw ? 'ซ่อน' : 'แสดง'}</Text>
              </TouchableOpacity>
            </View>
            {password.length > 0 && !passValid && (
              <Text style={[styles.error, { fontFamily: FONT.body }]}>{t('auth.invalidPassword')}</Text>
            )}

            {/* Remember + Forgot */}
            <View style={styles.rowBetween}>
              <View style={styles.rememberRow}>
                <Switch
                  value={remember}
                  onValueChange={setRemember}
                  thumbColor="#fff"
                  trackColor={{ true: COLOR.brandSoft, false: '#E5EAF1' }}
                />
                <Text style={[styles.rememberText, { fontFamily: FONT.body }]}>{t('auth.rememberMe')}</Text>
              </View>
              <TouchableOpacity onPress={() => onForgot?.(email)} hitSlop={HIT}>
                <Text style={[styles.link, { fontFamily: FONT.body }]}>{t('auth.forgotPassword')}</Text>
              </TouchableOpacity>
            </View>

            {!!error && <Text style={[styles.error, { marginTop: 8 }]}>{error}</Text>}

            {/* Sign in (Gradient Pill) */}
            <TouchableOpacity
              style={[styles.primaryBtn, !canSubmit && { opacity: 0.6 }]}
              onPress={submit}
              activeOpacity={0.9}
              disabled={!canSubmit}
            >
              <LinearGradient
                colors={[COLOR.brandA, COLOR.brandB]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.primaryGrad}
              >
                {loading ? (
                  <ActivityIndicator color="#814747ff" />
                ) : (
                  <Text style={[styles.primaryText, { fontFamily: FONT.body }]}>{t('auth.login')}</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.hr} />
              <Text style={[styles.dividerText, { fontFamily: FONT.body }]}>{t('auth.or')}</Text>
              <View style={styles.hr} />
            </View>

            {/* CTA สมัครสมาชิก (Glass button) */}
            <TouchableOpacity style={styles.ssoBtn} onPress={onRegister} activeOpacity={0.9}>
              <View style={styles.dot} />
              <Text style={[styles.ssoText, { fontFamily: FONT.body }]}>{t('auth.signup')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AuthEmailLogin;

/* -------------- helpers -------------- */
function validateEmail(v: string) {
  const s = v.trim();
  return /^\S+@\S+\.\S+$/.test(s);
}

/* -------------- styles -------------- */
const styles = StyleSheet.create({
  /* HEADER */
  headerWrap: {
    // ชิดขอบบนจริง (ไม่กัน safe-area บน): ใช้ paddingTop เอง
    paddingTop: Platform.OS === 'ios' ? 44 : (StatusBar.currentHeight ?? 12),
    paddingHorizontal: 16,
    paddingBottom: 36,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(97, 196, 199, 0.63)',
    alignItems: 'center', justifyContent: 'center',
    // soft shadow
    shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 12, shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  backIcon: { fontSize: 22, color: '#3B536B', lineHeight: 22, marginTop: -2 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: COLOR.dark },

  bubble: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: '#8AD2FF',
    filter: undefined as any, // RN ignore; keep TS calm
  },
  bubbleSoft: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: '#C8F9F0',
  },

  /* BODY */
  bodyContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 24,
    // ดึงการ์ดขึ้นมาทับ header
    marginTop: -22,
  },

  /* GLASS CARD */
  card: {
    backgroundColor: COLOR.card,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLOR.line,
    padding: 18,
    // glass shadow
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
    backdropFilter: undefined as any,
  },
  title: { fontSize: 19, fontWeight: '900', color: COLOR.dark },
  sub: { fontSize: 13, color: COLOR.dim, marginTop: 6 },

  label: { fontSize: 12.5, color: COLOR.dim, fontWeight: '700', marginTop: 16 },

  input: {
    marginTop: 6,
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E7EFF7',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: COLOR.dark,
  },
  inputRow: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E7EFF7',
    paddingHorizontal: 14,
    paddingVertical: 2,
  },
  inputFlex: { flex: 1, paddingVertical: 10, fontSize: 14, color: COLOR.dark },
  inputError: { borderColor: '#F5C2C7', backgroundColor: '#FFF5F6' },

  togglePw: { color: COLOR.brandA, fontWeight: '800' },

  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 },
  rememberRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rememberText: { fontSize: 12.5, color: COLOR.dark, fontWeight: '600' },
  link: { color: COLOR.brandA, fontWeight: '900', fontSize: 13 },

  /* PRIMARY BUTTON (gradient pill) */
  primaryBtn: {
    marginTop: 18,
    borderRadius: 16,
    overflow: 'hidden',
  },
  primaryGrad: {
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 16,
    shadowColor: '#69b2d6ff',
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  primaryText: { color: '#fff', fontWeight: '900', fontSize: 16, letterSpacing: 0.2 },

  /* DIVIDER */
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 18 },
  hr: { flex: 1, height: 1, backgroundColor: '#EAF0F6' },
  dividerText: { fontSize: 12, color: COLOR.dim },

  /* CTA REGISTER (glass) */
  ssoBtn: {
    marginTop: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E7EFF7',
    backgroundColor: 'rgba(255,255,255,0.78)',
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  dot: {
    width: 14, height: 14, borderRadius: 7,
    backgroundColor: '#4fd3d8ff',
    shadowColor: '#4fc0caff', shadowOpacity: 0.6, shadowRadius: 8, shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  ssoText: { fontSize: 14, fontWeight: '800', color: COLOR.dark },

  error: { color: COLOR.danger, fontSize: 12.5, marginTop: 6 },
});
