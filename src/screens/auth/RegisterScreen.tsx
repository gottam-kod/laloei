// screens/RegisterScreen.tsx
import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  StatusBar,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { register, loginWithEmail, getMe } from '@/src/connections/auth/authApi';
import { RootStackParamList } from '@/src/navigation/RootStackParamList';
import { useAuthStore } from '@/src/store/useAuthStore';
import { COLOR, FONT } from '@/src/theme/token';
import { BackgroundFX } from '@/src/components/Background';
import i18n from '@/src/lang/i18n';

const CARD_R = 24;
const INPUT_R = 16;

export default function RegisterScreen() {
  const nav = useNavigation<NavigationProp<RootStackParamList>>();

  // ====== store auth ======
  const loginStore = useAuthStore((s) => s.login);
  const setProfile = useAuthStore((s) => s.setProfile);

  // --- form state ---
  const [firstName, setFirst] = useState('');
  const [lastName, setLast] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState(''); // optional E.164
  const [password, setPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const [tos, setTos] = useState(false);
  const [marketing, setMarketing] = useState(true);

  // password toggles
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errTop, setErrTop] = useState<string | null>(null);
  const submitting = useRef(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  // --- validation ---
  const emailOk = useMemo(() => /\S+@\S+\.\S+/.test(email.trim().toLowerCase()), [email]);
  const phoneOk = useMemo(() => phone === '' || /^\+?[0-9]{7,15}$/.test(phone.trim()), [phone]);
  const pwOk = useMemo(() => password.length >= 8, [password]);
  const matchOk = useMemo(() => confirm === password && confirm.length > 0, [confirm, password]);
  const strength = useMemo(() => calcStrength(password), [password]);

  const canSubmit = emailOk && phoneOk && pwOk && matchOk && tos && !loading;

  // ====== core: afterLogin -> getMe + set store + navigate ======
  const afterLogin = useCallback(async (access_token: string) => {
    const me = await getMe(access_token);
    loginStore(access_token);
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
    // เข้าแอปหลักทันที
    nav.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
  }, [loginStore, setProfile, nav]);

  // ====== submit: register -> (token? login auto : fallback loginWithEmail) ======
  const onSubmit = useCallback(async () => {
    if (!canSubmit || submitting.current) return;
    setErrTop(null);
    submitting.current = true;
    setLoading(true);

    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      const payload = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        name: `${firstName.trim()} ${lastName.trim()}`.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim() || undefined,
        password,
        confirmPassword: confirm,
        tosAgreed: tos,
        marketingOptIn: marketing,
      } as any;

      // 1) Register
      const regRes = await (register as any)(
        payload,
        { signal: (ctrl as any).signal, timeoutMs: 20000 }
      );
      // รูปแบบรองรับทั้ง {access_token} หรือ (ไม่มี token)
      const accessFromRegister: string | undefined =
        regRes?.access_token || regRes?.data?.access_token;

      // 2) Auto-login
      if (accessFromRegister) {
        await afterLogin(accessFromRegister);
      } else {
        // fallback: email/password
        const loginRes = await loginWithEmail(
          { email: payload.email, username: payload.email, password, remember: true } as any,
          { signal: (ctrl as any).signal, timeoutMs: 15000 }
        );
        await afterLogin(loginRes.access_token);
      }
    } catch (e: any) {
      const msg = String(e?.response?.data?.message ?? e?.message ?? 'Register failed');
      setErrTop(mapErr(msg));
    } finally {
      setLoading(false);
      submitting.current = false;
    }
  }, [canSubmit, firstName, lastName, email, phone, password, confirm, tos, marketing, afterLogin]);

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
          colors={[COLOR.bgTop, COLOR.bgBottom]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={[styles.bubble, { top: -30, left: -40, width: 180, height: 180, opacity: 0.35 }]} />
        <View style={[styles.bubble, { top: 20, right: -60, width: 220, height: 220, opacity: 0.25 }]} />
        <View style={[styles.bubbleSoft, { bottom: -70, left: -20, width: 260, height: 260, opacity: 0.22 }]} />

        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => (nav.canGoBack() ? nav.goBack() : nav.reset({ index: 0, routes: [{ name: 'MainTabs' }] }))}
            style={styles.backBtn}
            accessibilityLabel="ย้อนกลับ"
            disabled={loading}
          >
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>

          <Text style={[styles.headerTitle, { fontFamily: FONT.heading }]}>
            {i18n.t('auth.register', 'สมัครสมาชิก')}
          </Text>

          <TouchableOpacity onPress={toggleLang} style={styles.langChip} disabled={loading}>
            <Text style={{ fontFamily: FONT.body, fontWeight: '800', color: COLOR.text }}>
              {i18n.language.startsWith('th') ? 'EN' : 'TH'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* BODY */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={[styles.card, styles.cardShadow]}>
            <Text style={[styles.cardTitle, { fontFamily: FONT.heading }]}>
              {i18n.t('auth.createAccount', 'สร้างบัญชีใหม่')}
            </Text>
            <Text style={[styles.cardSub, { fontFamily: FONT.body }]}>
              {i18n.t('auth.registerSubtitle', 'กรอกข้อมูลให้ครบถ้วนเพื่อเริ่มต้นใช้งาน Laloei')}
            </Text>

            <Field
              iconLeft={<Ionicons name="person-outline" size={20} color={COLOR.dim} />}
              placeholder={i18n.t('field.firstName', 'ชื่อ')}
              value={firstName}
              onChangeText={(v) => { setFirst(v); setErrTop(null); }}
              returnKeyType="next"
              autoCapitalize="words"
            />
            <Field
              iconLeft={<Ionicons name="person-outline" size={20} color={COLOR.dim} />}
              placeholder={i18n.t('field.lastName', 'นามสกุล')}
              value={lastName}
              onChangeText={(v) => { setLast(v); setErrTop(null); }}
              returnKeyType="next"
              autoCapitalize="words"
            />
            <Field
              iconLeft={<Ionicons name="mail-outline" size={20} color={COLOR.dim} />}
              placeholder="email@example.com"
              value={email}
              onChangeText={(v) => { setEmail(v); setErrTop(null); }}
              keyboardType="email-address"
              autoCapitalize="none"
              error={!emailOk && email.length > 0 ? i18n.t('auth.invalidEmail', 'อีเมลไม่ถูกต้อง') : undefined}
              returnKeyType="next"
            />
            <Field
              iconLeft={<Ionicons name="call-outline" size={20} color={COLOR.dim} />}
              placeholder={i18n.t('field.phoneOptional', 'เบอร์โทร (ไม่บังคับ) เช่น +66912345678')}
              value={phone}
              onChangeText={(v) => { setPhone(v); setErrTop(null); }}
              keyboardType="phone-pad"
              error={!phoneOk && phone.length > 0 ? i18n.t('auth.invalidPhone', 'เบอร์ไม่ถูกต้อง') : undefined}
              returnKeyType="next"
            />

            {/* password */}
            <Field
              key={showPw ? 'pw-show' : 'pw-hide'}
              iconLeft={<Ionicons name="lock-closed-outline" size={20} color={COLOR.dim} />}
              placeholder={i18n.t('auth.passwordMin8', 'รหัสผ่าน (อย่างน้อย 8 ตัว)')}
              value={password}
              onChangeText={(v) => { setPw(v); setErrTop(null); }}
              secureTextEntry={!showPw}
              right={
                <Pressable onPress={() => setShowPw(v => !v)} accessibilityLabel="togglePassword">
                  <Ionicons name={showPw ? 'eye-off-outline' : 'eye-outline'} size={20} color={COLOR.dim} />
                </Pressable>
              }
              error={!pwOk && password.length > 0 ? i18n.t('auth.passwordTooShort', 'รหัสผ่านสั้นเกินไป') : undefined}
              returnKeyType="next"
            />

            {/* strength bar */}
            {password.length > 0 && (
              <View style={styles.strRow}>
                <View style={[styles.strBar, strength >= 1 && styles.strOn]} />
                <View style={[styles.strBar, strength >= 2 && styles.strOn]} />
                <View style={[styles.strBar, strength >= 3 && styles.strOn]} />
                <View style={[styles.strBar, strength >= 4 && styles.strOn]} />
                <Text style={styles.strText}>
                  {strengthLabel(strength)}
                </Text>
              </View>
            )}

            <Field
              key={showConfirm ? 'cpw-show' : 'cpw-hide'}
              iconLeft={<MaterialCommunityIcons name="lock-check-outline" size={20} color={COLOR.dim} />}
              placeholder={i18n.t('auth.confirmPassword', 'ยืนยันรหัสผ่าน')}
              value={confirm}
              onChangeText={(v) => { setConfirm(v); setErrTop(null); }}
              secureTextEntry={!showConfirm}
              right={
                <Pressable onPress={() => setShowConfirm(v => !v)} accessibilityLabel="toggleConfirmPassword">
                  <Ionicons name={showConfirm ? 'eye-off-outline' : 'eye-outline'} size={20} color={COLOR.dim} />
                </Pressable>
              }
              error={!matchOk && confirm.length > 0 ? i18n.t('auth.passwordNotMatch', 'รหัสผ่านไม่ตรงกัน') : undefined}
              returnKeyType="done"
              onSubmitEditing={onSubmit}
              blurOnSubmit
            />

            <CheckRow
              checked={tos}
              onToggle={() => setTos(v => !v)}
              label={i18n.t('auth.acceptTos', 'ฉันยอมรับข้อตกลงการใช้งานและนโยบายความเป็นส่วนตัว')}
            />
            <CheckRow
              checked={marketing}
              onToggle={() => setMarketing(v => !v)}
              label={i18n.t('auth.optIn', 'ยินยอมรับข่าวสาร/สิทธิพิเศษ (เลือกได้)')}
              subtle
            />

            {errTop && <Text style={styles.errText}>{errTop}</Text>}

            {/* CTA gradient */}
            <Pressable disabled={!canSubmit} onPress={onSubmit} style={[{ marginTop: 14 }, !canSubmit && { opacity: 0.6 }]}
              accessibilityLabel="registerSubmit">
              <LinearGradient colors={[COLOR.primary, COLOR.teal]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.btn}>
                {loading ? <ActivityIndicator color="#fff" /> :
                  <Text style={styles.btnText}>{i18n.t('auth.register', 'สมัครสมาชิก')}</Text>}
              </LinearGradient>
            </Pressable>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.divLine} />
              <Text style={styles.divText}>{i18n.t('auth.or', 'หรือ')}</Text>
              <View style={styles.divLine} />
            </View>

            {/* secondary: ไปหน้า Login */}
            <Pressable onPress={() => nav.navigate('AuthStack', { screen: 'AuthEmailLogin' })} style={styles.altBtn} accessibilityLabel="goLogin">
              <View style={styles.altBtnInner}>
                <View style={styles.altDot} />
                <Text style={styles.altText}>{i18n.t('auth.login', 'เข้าสู่ระบบ')}</Text>
              </View>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ---------------- Helpers ---------------- */

function mapErr(msg: string) {
  const m = msg.toLowerCase();
  if (m.includes('email') && m.includes('exists')) return 'อีเมลนี้ถูกใช้งานแล้ว';
  if (m.includes('weak')) return 'รหัสผ่านอ่อนเกินไป';
  if (m.includes('mismatch')) return 'รหัสผ่านยืนยันไม่ตรงกัน';
  if (m.includes('tos')) return 'กรุณายอมรับข้อตกลงการใช้งาน';
  if (m.includes('timeout') || m.includes('network')) return 'เครือข่ายขัดข้อง กรุณาลองใหม่';
  return 'สมัครสมาชิกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง';
}

function calcStrength(pw: string) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return Math.min(s, 4);
}
function strengthLabel(n: number) {
  switch (n) {
    case 0: return '';
    case 1: return 'Weak';
    case 2: return 'Fair';
    case 3: return 'Good';
    case 4: return 'Strong';
    default: return '';
  }
}

function Field({
  iconLeft,
  right,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  autoCapitalize,
  keyboardType,
  returnKeyType,
  error,
  onSubmitEditing,
  blurOnSubmit,
}: {
  iconLeft?: React.ReactNode;
  right?: React.ReactNode;
  placeholder?: string;
  value: string;
  onChangeText: (v: string) => void;
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: any;
  returnKeyType?: any;
  error?: string;
  onSubmitEditing?: () => void;
  blurOnSubmit?: boolean;
}) {
  return (
    <View style={{ marginTop: 12 }}>
      <View style={[styles.inputWrap, !!error && styles.inputWrapError]}>
        {!!iconLeft && <View style={styles.iconLeft} pointerEvents="none">{iconLeft}</View>}
        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          autoCapitalize={autoCapitalize ?? 'none'}
          autoCorrect={false}
          keyboardType={keyboardType ?? 'default'}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          blurOnSubmit={blurOnSubmit}
          autoComplete={secureTextEntry ? 'password' : 'off'}
          textContentType={secureTextEntry ? 'password' : 'none'}
          maxLength={128}
          style={[styles.input, { fontFamily: FONT.body }]}
          placeholderTextColor={COLOR.dim}
        />
        {!!right && <View style={styles.iconRight} pointerEvents="box-none">{right}</View>}
      </View>
      {!!error && <Text style={styles.errSmall}>{error}</Text>}
    </View>
  );
}

function CheckRow({
  checked,
  onToggle,
  label,
  subtle,
}: {
  checked: boolean;
  onToggle: () => void;
  label: string;
  subtle?: boolean;
}) {
  return (
    <Pressable style={styles.checkRow} onPress={onToggle} accessibilityRole="checkbox" aria-checked={checked}>
      <View style={[styles.checkBox, checked && styles.checkBoxOn]}>
        {checked && <Ionicons name="checkmark" size={16} color="#fff" />}
      </View>
      <Text style={[styles.checkLabel, subtle && { color: COLOR.dim }]}>{label}</Text>
    </Pressable>
  );
}

/* ---------------- Styles ---------------- */

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
    shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 4,
  },
  backIcon: { fontSize: 22, color: '#3B536B', lineHeight: 22, marginTop: -2 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: COLOR.text },

  langChip: {
    minWidth: 40, height: 32, paddingHorizontal: 10, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 3,
  },

  bubble: { position: 'absolute', borderRadius: 999, backgroundColor: '#8AD2FF' },
  bubbleSoft: { position: 'absolute', borderRadius: 999, backgroundColor: '#C8F9F0' },

  /* BODY */
  scroll: { padding: 16, paddingTop: 18, flexGrow: 1, justifyContent: 'center' },

  // glass card
  card: {
    backgroundColor: 'rgba(255,255,255,0.35)',
    borderRadius: CARD_R,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  cardShadow: {
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  cardTitle: { fontSize: 18, fontWeight: '900', color: COLOR.text },
  cardSub: { color: COLOR.dim, marginTop: 4, marginBottom: 6 },

  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: INPUT_R,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 12,
    minHeight: 50,
  },
  inputWrapError: { borderColor: '#D92D20' },
  input: { flex: 1, fontSize: 16, color: COLOR.text, paddingVertical: 12 },
  iconLeft: { marginRight: 8 },
  iconRight: { marginLeft: 8 },

  checkRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  checkBox: {
    width: 22, height: 22, borderRadius: 8, borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)', backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center', justifyContent: 'center', marginRight: 10,
  },
  checkBoxOn: { backgroundColor: COLOR.teal, borderColor: COLOR.teal },
  checkLabel: { flex: 1, color: COLOR.text },

  btn: { height: 52, borderRadius: INPUT_R, alignItems: 'center', justifyContent: 'center' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '900' },

  divider: { flexDirection: 'row', alignItems: 'center', marginTop: 14 },
  divLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.6)' },
  divText: { marginHorizontal: 8, color: COLOR.dim },

  altBtn: { marginTop: 10 },
  altBtnInner: {
    height: 46,
    borderRadius: INPUT_R,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.75)',
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center', justifyContent: 'center', flexDirection: 'row',
  },
  altDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLOR.teal, marginRight: 8 },
  altText: { color: COLOR.text, fontWeight: '700' },

  errSmall: { color: '#D92D20', marginTop: 4, fontSize: 12 },
  errText: {
    color: '#D92D20',
    marginTop: 10,
    borderRadius: 12,
    backgroundColor: '#FFF2F2',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  /* strength */
  strRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  strBar: { flex: 1, height: 6, borderRadius: 4, backgroundColor: '#E5EAF1' },
  strOn: { backgroundColor: COLOR.teal },
  strText: { marginLeft: 6, color: COLOR.dim, fontSize: 12 },
});
