// screens/ForgotPasswordScreen.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, NavigationProp } from '@react-navigation/native';

import { BackgroundFX } from '@/src/components/Background';
import { FONT } from '@/src/theme/token';
import i18n from '@/src/lang/i18n';
import { RootStackParamList } from '@/src/navigation/RootStackParamList';
import { instanceAxios } from '@/src/connections/http';

type Props = {
  route: { params?: { email?: string } };
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

const ForgotPasswordScreen: React.FC<Props> = ({ route }) => {
  const nav = useNavigation<NavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState(route.params?.email?.trim() ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const emailValid = validateEmail(email);

  const mapError = (msg: string) => {
    const m = (msg || '').toLowerCase();
    if (m.includes('email must be an email')) return 'รูปแบบอีเมลไม่ถูกต้อง';
    if (m.includes('not found')) return 'ไม่พบบัญชีอีเมลนี้ในระบบ';
    if (m.includes('429') || m.includes('too many')) return 'คุณเพิ่งขอไปเมื่อสักครู่ กรุณาลองใหม่ภายหลัง';
    if (m.includes('network') || m.includes('timeout') || m.includes('fetch')) return 'เครือข่ายขัดข้อง กรุณาลองใหม่';
    return 'ส่งคำขอไม่สำเร็จ กรุณาลองใหม่อีกครั้ง';
  };

  const submit = async () => {
    if (!emailValid) {
      setError('รูปแบบอีเมลไม่ถูกต้อง');
      return;
    }

    setError(null);
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      setLoading(true);
      // ✅ เรียก API (ปรับ path ตาม backend ของคุณ)
      // ตัวอย่าง: POST /auth/forgot-password  { email }
      await instanceAxios.post(
        '/auth/forgot-password',
        { email: email.trim().toLowerCase() },
        { signal: ctrl.signal, headers: { 'Content-Type': 'application/json', accept: '*/*' } }
      );

      Alert.alert(
        'ส่งคำขอรีเซ็ตรหัสผ่านแล้ว',
        'กรุณาตรวจสอบอีเมลของคุณเพื่อทำรายการต่อ',
        [{ text: 'ตกลง', onPress: () => nav.goBack() }]
      );
    } catch (e: any) {
      if (e?.name === 'AbortError') return;
      const msg = String(e?.message || e);
      setError(mapError(msg));
    } finally {
      setLoading(false);
    }
  };

  const safeGoBack = () => {
    if (nav.canGoBack()) nav.goBack();
    else nav.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
  };

  const toggleLang = () => {
    const next = i18n.language.startsWith('th') ? 'en' : 'th';
    i18n.changeLanguage(next);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F7FAFD' }} edges={['left', 'right', 'bottom']}>
      {/* BG */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <BackgroundFX />
      </View>

      <StatusBar barStyle="dark-content" />

      {/* HEADER */}
      <View style={styles.headerWrap}>
        <LinearGradient
          colors={[COLOR.bgTopA, COLOR.bgTopB]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={[styles.bubble, { top: -30, left: -40, width: 180, height: 180, opacity: 0.35 }]} />
        <View style={[styles.bubble, { top: 20, right: -60, width: 220, height: 220, opacity: 0.25 }]} />
        <View style={[styles.bubbleSoft, { bottom: -70, left: -20, width: 260, height: 260, opacity: 0.22 }]} />

        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={safeGoBack}
            hitSlop={HIT}
            style={styles.backBtn}
            accessibilityLabel="ย้อนกลับ"
            disabled={loading}
          >
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>

          <Text style={[styles.headerTitle, { fontFamily: FONT.heading }]}>
            {i18n.t('auth.forgotPassword', 'ลืมรหัสผ่าน')}
          </Text>

          {/* Switch Lang */}
          <TouchableOpacity
            onPress={toggleLang}
            hitSlop={HIT}
            style={styles.langChip}
            disabled={loading}
            accessibilityLabel="Switch language"
          >
            <Text style={{ fontFamily: FONT.body, fontWeight: '800', color: COLOR.dark }}>
              {i18n.language.startsWith('th') ? 'EN' : 'TH'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* BODY */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={styles.bodyContainer}>
          <View style={styles.card}>
            <Text style={[styles.title, { fontFamily: FONT.heading }]}>
              {i18n.t('auth.resetTitle', 'รีเซ็ตรหัสผ่าน')}
            </Text>
            <Text style={[styles.sub, { fontFamily: FONT.body }]}>
              {i18n.t('auth.resetSubtitle', 'กรุณากรอกอีเมลของคุณ เราจะส่งลิงก์รีเซ็ตไปให้')}
            </Text>

            <Text style={[styles.label, { fontFamily: FONT.body }]}>
              {i18n.t('auth.email', 'อีเมล')}
            </Text>
            <TextInput
              testID="emailInput"
              placeholder={i18n.t('auth.emailPlaceholder', 'you@company.com')}
              style={[styles.input, !!email && !emailValid && styles.inputError, { fontFamily: FONT.body }]}
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={(v) => {
                setEmail(v.replace(/\s/g, ''));
                setError(null);
              }}
              editable={!loading}
              returnKeyType="done"
              onSubmitEditing={submit}
            />
            {!!email && !emailValid && (
              <Text style={[styles.error, { fontFamily: FONT.body }]}>
                {i18n.t('auth.invalidEmail', 'รูปแบบอีเมลไม่ถูกต้อง')}
              </Text>
            )}
            {!!error && <Text style={[styles.error, { marginTop: 8 }]}>{error}</Text>}

            <TouchableOpacity
              testID="submitButton"
              style={[styles.primaryBtn, (!emailValid || loading) && { opacity: 0.6 }]}
              onPress={submit}
              activeOpacity={0.9}
              disabled={!emailValid || loading}
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
                  <Text style={[styles.primaryText, { fontFamily: FONT.body }]}>
                    {i18n.t('auth.sendResetLink', 'ส่งลิงก์รีเซ็ต')}
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Helper text */}
            <Text style={[styles.helper, { fontFamily: FONT.body }]}>
              {i18n.t(
                'auth.resetHelper',
                'ถ้าไม่พบอีเมลในกล่องเข้า ลองเช็กโฟลเดอร์สแปม หรือขอใหม่อีกครั้งภายหลัง'
              )}
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;

/* ------------ helpers ------------ */
function validateEmail(v: string) {
  const s = v.trim();
  return /^\S+@\S+\.\S+$/.test(s);
}

/* ------------ styles ------------ */
const styles = StyleSheet.create({
  /* HEADER */
  headerWrap: {
    paddingTop: Platform.OS === 'ios' ? 52 : (StatusBar.currentHeight ?? 12),
    paddingHorizontal: 16,
    paddingBottom: 28,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(97, 196, 199, 0.63)',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 12, shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  backIcon: { fontSize: 22, color: '#3B536B', lineHeight: 22, marginTop: -2 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: COLOR.dark },

  langChip: {
    minWidth: 40, height: 32, paddingHorizontal: 10, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 3,
  },

  bubble: { position: 'absolute', borderRadius: 999, backgroundColor: '#8AD2FF' },
  bubbleSoft: { position: 'absolute', borderRadius: 999, backgroundColor: '#C8F9F0' },

  /* BODY */
  bodyContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -12,
  },

  /* GLASS CARD */
  card: {
    width: '100%',
    backgroundColor: COLOR.card,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLOR.line,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
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
  inputError: { borderColor: '#F5C2C7', backgroundColor: '#FFF5F6' },

  primaryBtn: { marginTop: 18, borderRadius: 16, overflow: 'hidden' },
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

  helper: { marginTop: 14, fontSize: 12.5, color: COLOR.dim },

  error: { color: COLOR.danger, fontSize: 12.5, marginTop: 6 },
});
