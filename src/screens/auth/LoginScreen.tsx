// screens/AuthEmailLogin.tsx

import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as WebBrowser from 'expo-web-browser';
import Constants from 'expo-constants';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import * as Google from 'expo-auth-session/providers/google';

import { BackgroundFX } from '@/src/components/Background';
import { useAuthStore } from '@/src/store/useAuthStore';
import { RootStackParamList } from '@/src/navigation/RootStackParamList';
import { useTranslation } from 'react-i18next';

import { getMe, loginWithEmail } from '@/src/connections/auth/authApi';
import { instanceAxios } from '@/src/connections/http'; // ใช้ axios เดียวกับระบบ
import Ionicons from 'react-native-vector-icons/Ionicons';

import { theme, FONT } from '@/src/theme/token';
import i18n from '@/src/lang/i18n';

// import { API_URL, APP_ENV, APP_NAME , GOOGLE_ANALYTICS_ID} from '@env';
import { LinearGradient } from 'expo-linear-gradient';

type Props = {
  onBack?: () => void;
  onLogin?: (payload: { email: string; password: string; remember: boolean }) => Promise<void> | void;
  onForgot?: (email?: string) => void;
  onRegister?: () => void;
};




const HIT = { top: 10, bottom: 10, left: 10, right: 10 };
const LS_LAST_EMAIL = 'laloei_last_email';
const LS_PASSWORD = 'laloei_password';
const LS_REMEMBER = 'laloei_remember';
const LS_LANG = 'laloei_lang';

// ===== Google Auth =====
WebBrowser.maybeCompleteAuthSession();
const extra = (Constants.expoConfig?.extra ?? {}) as any;
const googleCfg = extra.google ?? {};
// ใส่ clientId ที่ app.config.ts > extra.google.* (ดูท้ายไฟล์)
const GOOGLE_IOS = googleCfg.iosClientId ?? 'REPLACE_ME_IOS.apps.googleusercontent.com';
const GOOGLE_ANDROID = googleCfg.androidClientId ?? 'REPLACE_ME_ANDROID.apps.googleusercontent.com';
const GOOGLE_WEB = googleCfg.webClientId ?? 'REPLACE_ME_WEB.apps.googleusercontent.com';

// ===== Helper: call backend เพื่อแลก id_token -> access_token ระบบเรา =====
async function exchangeSocial(provider: 'google' | 'apple', idToken: string, signal?: AbortSignal) {
  // ปรับ path ให้ตรงกับ backend ของคุณ (แนะนำรวมเป็นตัวเดียว)
  const { data } = await instanceAxios.post<{ access_token: string }>(
    '/auth/social/exchange',
    { provider, id_token: idToken },
    { signal, headers: { accept: '*/*', 'Content-Type': 'application/json' } }
  );
  return data;
}


async function loadInitialLang(): Promise<'th' | 'en'> {
  try {
    const saved = await AsyncStorage.getItem(LS_LANG);
    if (saved === 'th' || saved === 'en') return saved;
  } catch { }
  const device = (Intl?.DateTimeFormat?.().resolvedOptions?.().locale || '').toLowerCase();
  return device.startsWith('th') ? 'th' : 'en';
}

const LoginScreen: React.FC<Props> = ({ onLogin, onForgot, onRegister }) => {
  const { t } = useTranslation();
  
  const nav = useNavigation<NavigationProp<RootStackParamList>>();
  const login = useAuthStore((s) => s.login);
  const setProfile = useAuthStore((s) => s.setProfile);

  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lang, setLang] = useState<'th' | 'en'>('th');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [netOK, setNetOK] = useState(true);
  const [appleAvailable, setAppleAvailable] = useState(false);

  const abortRef = useRef<AbortController | null>(null);

  // ===== Network status =====
  useEffect(() => {
    const sub = NetInfo.addEventListener((s) => setNetOK(!!s.isConnected));
    return () => sub();
  }, []);

  useEffect(() => {
    (async () => {
      const initial = await loadInitialLang();
      setLang(initial);
      i18n.changeLanguage(initial);
    })();
  }, []);

  const toggleLang = async () => {
    const next = lang === 'th' ? 'en' : 'th';
    setLang(next);
    i18n.changeLanguage(next);
    try { await AsyncStorage.setItem(LS_LANG, next); } catch { }
  };

  // ===== Apple availability (ต้อง await) =====
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const ok = Platform.OS === 'ios' ? await AppleAuthentication.isAvailableAsync() : false;
        if (mounted) setAppleAvailable(!!ok);
      } catch {
        if (mounted) setAppleAvailable(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // ===== Prefill remember me =====
  useEffect(() => {
    (async () => {
      try {
        const [e, r] = await Promise.all([
          AsyncStorage.getItem(LS_LAST_EMAIL),
          AsyncStorage.getItem(LS_REMEMBER),
        ]);
        if (e) setEmail(e);
        if (r != null) setRemember(r === '1');
      } catch { }
    })();
    return () => { abortRef.current?.abort(); };
  }, []);

  const emailValid = useMemo(() => validateEmail(email), [email]);
  const passValid = password.length >= 6;
  const canSubmit = emailValid && passValid && !loading;


  const mapError = (msg: string) => {
    const m = (msg || '').toLowerCase();
    if (m.includes('email must be an email')) return 'รูปแบบอีเมลไม่ถูกต้อง';
    if (m.includes('unauthorized') || m.includes('invalid') || m.includes('401')) return 'อีเมลหรือรหัสผ่านไม่ถูกต้อง';
    if (m.includes('network') || m.includes('timeout') || m.includes('fetch')) return 'เครือข่ายขัดข้อง กรุณาลองใหม่';
    return 'เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่';
  };

  const afterLogin = async (access_token: string) => {
    const me = await getMe(access_token);
    console.log('Logged in user profile:', me);
    login(access_token);
    setProfile({
      id: me.user.id,
      email: me.user.email,
      name: me.user.name ?? null,
      locale: me.preferences?.locale ?? null,
      timezone: me.preferences?.timezone ?? null,
      avatarUri: me.user.avatar_url ?? null,
      menus: me.menus ?? [],
      permissions: me.permissions ?? [],
      org: me.active_org ?? null,
      roles: me.user.roles ?? [],
    });
    try {
      await AsyncStorage.setItem(LS_REMEMBER, remember ? '1' : '0');
      if (remember) await AsyncStorage.setItem(LS_LAST_EMAIL, (email || me.user?.email || '').toLowerCase());
      else await AsyncStorage.removeItem(LS_LAST_EMAIL);
    } catch { }
    await onLogin?.({ email, password, remember });
    if (!onLogin) nav.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
  };

  onRegister = onRegister || (() => nav.navigate('AuthStack', { screen: 'Register' }));
  onForgot = onForgot || ((email?: string) => nav.navigate('AuthStack', { screen: 'ForgotPassword', params: email ? { email } : {} }));
  // ===== Email/Password login =====
  const submit = async () => {
    if (!canSubmit) return;
    if (!netOK) { setError('ออฟไลน์อยู่ กรุณาเชื่อมต่ออินเทอร์เน็ต'); return; }
    setError(null);
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    try {
      setLoading(true);
      const emailNorm = email.trim().toLowerCase();
      const res = await loginWithEmail(
        { email: emailNorm, username: emailNorm, password, remember } as any,
        { signal: ctrl.signal, timeoutMs: 15000 }
      );
      await afterLogin(res.access_token);
    } catch (e: any) {
      if (e?.name !== 'AbortError') setError(mapError(String(e?.message || e)));
    } finally { setLoading(false); }
  };

  // ===== Google Sign-In (ใช้ providers/google เพื่อกัน useProxy/redirectUri ผิด) =====
  const [googleRequest, googleResponse, googlePromptAsync] = Google.useAuthRequest({
    iosClientId: GOOGLE_IOS,
    androidClientId: GOOGLE_ANDROID,
    webClientId: GOOGLE_WEB,
    responseType: 'id_token', // ได้ id_token ตรงๆ
    selectAccount: true,
    // ไม่ต้องกำหนด redirectUri เอง -> provider จัดการ proxy ให้บน Expo Go, และ native scheme ตอน build
  });

  useEffect(() => {
    (async () => {
      if (googleResponse?.type === 'success') {
        const idToken = googleResponse.authentication?.idToken;
        if (!idToken) return;
        setLoading(true);
        setError(null);
        abortRef.current?.abort();
        const ctrl = new AbortController();
        abortRef.current = ctrl;
        try {
          const exchanged = await exchangeSocial('google', idToken, ctrl.signal);
          await afterLogin(exchanged.access_token);
        } catch (e: any) {
          if (e?.name !== 'AbortError') setError(mapError(String(e?.message || e)));
        } finally { setLoading(false); }
      }
    })();
  }, [googleResponse]);

  const onLoginGoogle = async () => {
    if (loading || !netOK) { setError(!netOK ? 'ออฟไลน์อยู่ กรุณาเชื่อมต่ออินเทอร์เน็ต' : null); return; }
    setError(null);
    await googlePromptAsync();
  };

  // ===== Apple Sign-In =====
  const onLoginApple = async () => {
    if (loading || !appleAvailable) return;
    if (!netOK) { setError('ออฟไลน์อยู่ กรุณาเชื่อมต่ออินเทอร์เน็ต'); return; }
    setError(null);
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    try {
      setLoading(true);
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      const idToken = credential.identityToken;
      if (!idToken) throw new Error('ไม่พบ identityToken จาก Apple');
      const exchanged = await exchangeSocial('apple', idToken, ctrl.signal);
      await afterLogin(exchanged.access_token);
    } catch (e: any) {
      if (e?.code === 'ERR_CANCELED' || e?.name === 'AbortError') return;
      setError(mapError(String(e?.message || e)));
    } finally { setLoading(false); }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F7FAFD' }} edges={['left', 'right', 'bottom']}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <BackgroundFX />
      </View>
      <StatusBar barStyle="dark-content" />

      {/* HEADER */}
      <View style={styles.headerWrap}>
        {/* <LinearGradient
          colors={[COLOR.bgTopA, COLOR.bgTopB]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        /> */}
        <View style={[styles.bubble, { top: -30, left: -40, width: 180, height: 180, opacity: 0.35 }]} />
        <View style={[styles.bubble, { top: 20, right: -60, width: 220, height: 220, opacity: 0.25 }]} />
        <View style={[styles.bubbleSoft, { bottom: -70, left: -20, width: 260, height: 260, opacity: 0.22 }]} />

        <View style={styles.header}>
          <View style={styles.logoCircle}><Ionicons name="checkbox-outline" size={22} color={theme.color.accent} /></View>
          <Text style={styles.title}>{t('auth.login')}</Text>
          <View style={{ flex: 1 }} />
          <TouchableOpacity
            onPress={toggleLang}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={{
              minWidth: 40,
              height: 32,
              paddingHorizontal: 10,
              borderRadius: 16,
              backgroundColor: 'rgba(255,255,255,0.85)',
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowRadius: 6,
              shadowOffset: { width: 0, height: 2 },
              elevation: 3,
            }}
            accessibilityLabel="Switch language"
          >
            <Text style={{ fontFamily: FONT.body, fontWeight: '800', color: theme.color.dark }}>
              {lang === 'th' ? 'EN' : 'TH'}
            </Text>
          </TouchableOpacity>
        </View>

      </View>

      {/* BODY */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={styles.bodyContainer}>
          <View style={styles.card}>
            <Text style={[styles.title]}>{t('auth.loginWithEmail')}</Text>
            <Text style={[styles.sub, { fontFamily: FONT.body }]}>
              {netOK ? t('auth.loginSubtitle') : 'โหมดออฟไลน์: เข้าสู่ระบบไม่ได้ กรุณาเชื่อมต่ออินเทอร์เน็ต'}
            </Text>

            {/* Email */}
            <Text style={[styles.label]}>{t('auth.email')}</Text>
            <TextInput
              testID="emailInput"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              placeholder={t('auth.emailPlaceholder')}
              value={email}
              onChangeText={(v) => {
                const s = v.replace(/\s/g, '');
                setEmail(s);
                setError(null);
              }}
              style={[styles.input, { fontFamily: FONT.body }, !!email && !emailValid && styles.inputError]}
              returnKeyType="next"
              editable={!loading}
            />
            {!!email && !emailValid && (
              <Text style={[styles.error, { fontFamily: FONT.body }]}>{t('auth.invalidEmail')}</Text>
            )}

            {/* Password */}
            <Text style={[styles.label, { fontFamily: FONT.body }]}>{t('auth.password')}</Text>
            <View style={[styles.inputRow, password.length > 0 && !passValid && styles.inputError]}>
              <TextInput
                testID="passwordInput"
                placeholder={t('auth.minLength')}
                value={password}
                onChangeText={(v) => {
                  setPassword(v);
                  setError(null);
                }}
                secureTextEntry={!showPw}
                style={[styles.inputFlex, { fontFamily: FONT.body }]}
                returnKeyType="done"
                onSubmitEditing={submit}
                editable={!loading}
              />
              <TouchableOpacity onPress={() => setShowPw((v) => !v)} hitSlop={HIT} disabled={loading}>
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
                  onValueChange={(v) => {
                    setRemember(v);
                    setError(null);
                  }}
                  thumbColor="#fff"
                  trackColor={{ true: theme.color.brandSoft, false: '#E5EAF1' }}
                  disabled={loading}
                />
                <Text style={[styles.rememberText, { fontFamily: FONT.body }]}>{t('auth.rememberMe')}</Text>
              </View>
              <TouchableOpacity onPress={() => onForgot?.(email)} hitSlop={HIT} disabled={loading}>
                <Text style={[styles.link, { fontFamily: FONT.body }]}>{t('auth.forgotPassword')}</Text>
              </TouchableOpacity>
            </View>

            {!!error && <Text style={[styles.error, { marginTop: 8 }]}>{error}</Text>}

            {/* Sign in */}
            <TouchableOpacity
              testID="loginButton"
              style={[styles.primaryBtn, (!canSubmit || !netOK) && { opacity: 0.6 }]}
              onPress={submit}
              activeOpacity={0.9}
              disabled={!canSubmit || !netOK}
            >
              <LinearGradient
                colors={[theme.color.brandA, theme.color.brandB]}
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

            {/* Social Login */}
            <View style={{ gap: 10 }}>
              <TouchableOpacity
                testID="googleButton"
                style={[styles.ssoBtn, (loading || !netOK || !googleRequest) && { opacity: 0.6 }]}
                onPress={onLoginGoogle}
                disabled={loading || !netOK || !googleRequest}
              >
                <View style={styles.dot} />
                <Text style={[styles.ssoText, { fontFamily: FONT.body }]}>{t('auth.loginWithGoogle')}</Text>
              </TouchableOpacity>

              {appleAvailable && (
                <TouchableOpacity
                  testID="appleButton"
                  style={[styles.ssoBtn, (loading || !netOK) && { opacity: 0.6 }]}
                  onPress={onLoginApple}
                  disabled={loading || !netOK}
                >
                  <View style={[styles.dot, { backgroundColor: '#111827' }]} />
                  <Text style={[styles.ssoText, { fontFamily: FONT.body }]}>{t('auth.loginWithApple')}</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* CTA สมัครสมาชิก */}
            <TouchableOpacity style={styles.ssoBtn} onPress={onRegister} activeOpacity={0.9} disabled={loading}>
              <View style={styles.dot} />
              <Text style={[styles.ssoText, { fontFamily: FONT.body }]}>{t('auth.signup')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

/* -------------- helpers -------------- */
function validateEmail(v: string) {
  const s = v.trim();
  return /^\S+@\S+\.\S+$/.test(s);
}

/* -------------- styles -------------- */
const styles = StyleSheet.create({
  headerWrap: {
    paddingTop: Platform.OS === 'ios' ? 62 : (StatusBar.currentHeight ?? 12),
    paddingHorizontal: 16,
    paddingBottom: 28,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
    alignItems: 'center',
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  logoCircle: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 2,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(97, 196, 199, 0.63)',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 4,
  },
  backIcon: { fontSize: 22, color: '#3B536B', lineHeight: 22, marginTop: -2 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: theme.color.dark },

  bubble: { position: 'absolute', borderRadius: 999, backgroundColor: '#8AD2FF' },
  bubbleSoft: { position: 'absolute', borderRadius: 999, backgroundColor: '#C8F9F0' },

  bodyContainer: { flex: 1, paddingHorizontal: 16, paddingBottom: 24, marginTop: -22 },

  card: {
    backgroundColor: theme.color.card, borderRadius: 22, borderWidth: 1, borderColor: theme.color.line, padding: 18,
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 18, shadowOffset: { width: 0, height: 10 }, elevation: 6,
  },
  title: { fontSize: 19, fontWeight: '900', color: theme.color.dark, fontFamily: FONT.heading },
  sub: { fontSize: 13, color: theme.color.dark, marginTop: 6 },

  label: { fontSize: 12.5, color: theme.color.dark, fontWeight: '700', marginTop: 16, fontFamily: FONT.body },

  input: {
    marginTop: 6, backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#E7EFF7',
    paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: theme.color.dark,
  },
  inputRow: {
    marginTop: 6, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14,
    borderWidth: 1, borderColor: '#E7EFF7', paddingHorizontal: 14, paddingVertical: 2,
  },
  inputFlex: { flex: 1, paddingVertical: 10, fontSize: 14, color: theme.color.dim },
  inputError: { borderColor: '#F5C2C7', backgroundColor: '#FFF5F6' },

  togglePw: { color: theme.color.brandA, fontWeight: '800' },

  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 },
  rememberRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rememberText: { fontSize: 12.5, color: theme.color.dark, fontWeight: '600' },
  link: { color: theme.color.brandA, fontWeight: '900', fontSize: 13 },

  primaryBtn: { marginTop: 18, borderRadius: 16, overflow: 'hidden' },
  primaryGrad: {
    paddingVertical: 14, alignItems: 'center', borderRadius: 16,
    shadowColor: '#69b2d6ff', shadowOpacity: 0.35, shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 }, elevation: 3,
  },
  primaryText: { color: '#fff', fontWeight: '900', fontSize: 16, letterSpacing: 0.2 },

  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 18 },
  hr: { flex: 1, height: 1, backgroundColor: '#EAF0F6' },
  dividerText: { fontSize: 12, color: theme.color.dim },

  ssoBtn: {
    marginTop: 12, borderRadius: 14, borderWidth: 1, borderColor: '#E7EFF7',
    backgroundColor: 'rgba(255,255,255,0.78)', paddingVertical: 12,
    alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 10,
  },
  dot: {
    width: 14, height: 14, borderRadius: 7, backgroundColor: '#4fd3d8ff',
    shadowColor: '#4fc0caff', shadowOpacity: 0.6, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  ssoText: { fontSize: 14, fontWeight: '800', color: theme.color.dark },

  error: { color: theme.color.danger, fontSize: 12.5, marginTop: 6 },

  langSwitch: {
    position: 'absolute',
    right: 20,
    top: Platform.OS === 'ios' ? 64 : (StatusBar.currentHeight ?? 12) + 8,
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  langText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
});
