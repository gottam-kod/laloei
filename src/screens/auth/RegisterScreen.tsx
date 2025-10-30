// screens/RegisterScreen.tsx
import React, { useCallback, useMemo, useRef, useState } from 'react';
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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { register } from '@/src/connections/auth/authApi';
import { AuthStackParamList } from '@/src/navigation/RootStackParamList';
import { COLOR } from '@/src/theme/token';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const CARD_R = 24;
const INPUT_R = 16;

export default function RegisterScreen() {
  const nav = useNavigation<NavigationProp<AuthStackParamList>>();

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
  const [err, setErr] = useState<string | null>(null);
  const submitting = useRef(false);

  // --- validation ---
  const emailOk = useMemo(() => /\S+@\S+\.\S+/.test(email.trim().toLowerCase()), [email]);
  const phoneOk = useMemo(() => phone === '' || /^\+?[0-9]{7,15}$/.test(phone.trim()), [phone]);
  const pwOk = useMemo(() => password.length >= 8, [password]);
  const matchOk = useMemo(() => confirm === password && confirm.length > 0, [confirm, password]);

  const canSubmit = emailOk && phoneOk && pwOk && matchOk && tos && !loading;

  const onSubmit = useCallback(async () => {
    if (!canSubmit || submitting.current) return;
    setErr(null);
    submitting.current = true;
    setLoading(true);
    try {
      await register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        name: `${firstName.trim()} ${lastName.trim()}`.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim() || undefined,
        password,
        confirmPassword: confirm,
        tosAgreed: tos,
        marketingOptIn: marketing,
      });
      nav.navigate('AuthEmailLogin');
    } catch (e: any) {
      setErr(String(e?.response?.data?.message ?? e?.message ?? 'Register failed'));
    } finally {
      setLoading(false);
      submitting.current = false;
    }
  }, [canSubmit, firstName, lastName, email, phone, password, confirm, tos, marketing, nav]);

  return (
    <View style={{ flex: 1 }}>
      {/* BG gradient + bubbles = mood เดียวกับ Login */}
      <LinearGradient
        colors={[COLOR.bgTop, COLOR.bgBottom]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.bubbleA} />
      <View style={styles.bubbleB} />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.select({ ios: 'padding', android: undefined })}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Text style={styles.pageTitle}>สมัครสมาชิก</Text>

          {/* glass card */}
          <View style={[styles.card, styles.cardShadow]}>
            <Text style={styles.cardTitle}>สร้างบัญชีใหม่</Text>
            <Text style={styles.cardSub}>กรอกข้อมูลให้ครบถ้วนเพื่อเริ่มต้นใช้งาน Laloei</Text>

            <Field
              iconLeft={<Ionicons name="person-outline" size={20} color={COLOR.dim} />}
              placeholder="ชื่อ"
              value={firstName}
              onChangeText={setFirst}
              returnKeyType="next"
              autoCapitalize="words"
            />
            <Field
              iconLeft={<Ionicons name="person-outline" size={20} color={COLOR.dim} />}
              placeholder="นามสกุล"
              value={lastName}
              onChangeText={setLast}
              returnKeyType="next"
              autoCapitalize="words"
            />
            <Field
              iconLeft={<Ionicons name="mail-outline" size={20} color={COLOR.dim} />}
              placeholder="email@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              error={!emailOk && email.length > 0 ? 'อีเมลไม่ถูกต้อง' : undefined}
              returnKeyType="next"
            />
            <Field
              iconLeft={<Ionicons name="call-outline" size={20} color={COLOR.dim} />}
              placeholder="เบอร์โทร (ไม่บังคับ) เช่น +66912345678"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              error={!phoneOk && phone.length > 0 ? 'เบอร์ไม่ถูกต้อง' : undefined}
              returnKeyType="next"
            />

            {/* password — fix บั๊กพิมพ์ได้ตัวเดียว */}
            <Field
              key={showPw ? 'pw-show' : 'pw-hide'}
              iconLeft={<Ionicons name="lock-closed-outline" size={20} color={COLOR.dim} />}
              placeholder="รหัสผ่าน (อย่างน้อย 8 ตัว)"
              value={password}
              onChangeText={setPw}
              secureTextEntry={!showPw}
              right={
                <Pressable onPress={() => setShowPw(v => !v)} accessibilityLabel="togglePassword">
                  <Ionicons name={showPw ? 'eye-off-outline' : 'eye-outline'} size={20} color={COLOR.dim} />
                </Pressable>
              }
              error={!pwOk && password.length > 0 ? 'รหัสผ่านสั้นเกินไป' : undefined}
              returnKeyType="next"
            />

            <Field
              key={showConfirm ? 'cpw-show' : 'cpw-hide'}
              iconLeft={<MaterialCommunityIcons name="lock-check-outline" size={20} color={COLOR.dim} />}
              placeholder="ยืนยันรหัสผ่าน"
              value={confirm}
              onChangeText={setConfirm}
              secureTextEntry={!showConfirm}
              right={
                <Pressable onPress={() => setShowConfirm(v => !v)} accessibilityLabel="toggleConfirmPassword">
                  <Ionicons name={showConfirm ? 'eye-off-outline' : 'eye-outline'} size={20} color={COLOR.dim} />
                </Pressable>
              }
              error={!matchOk && confirm.length > 0 ? 'รหัสผ่านไม่ตรงกัน' : undefined}
              returnKeyType="done"
              onSubmitEditing={onSubmit}
              blurOnSubmit
            />

            <CheckRow
              checked={tos}
              onToggle={() => setTos(v => !v)}
              label="ฉันยอมรับข้อตกลงการใช้งานและนโยบายความเป็นส่วนตัว"
            />
            <CheckRow
              checked={marketing}
              onToggle={() => setMarketing(v => !v)}
              label="ยินยอมรับข่าวสาร/สิทธิพิเศษ (เลือกได้)"
              subtle
            />

            {err && <Text style={styles.errText}>{err}</Text>}

            {/* CTA gradient ให้ฟีลเดียวกับ Login */}
            <Pressable disabled={!canSubmit} onPress={onSubmit} style={[{ marginTop: 14 }, !canSubmit && { opacity: 0.6 }]}>
              <LinearGradient colors={[COLOR.primary, COLOR.teal]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.btn}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>สมัครสมาชิก</Text>}
              </LinearGradient>
            </Pressable>

            {/* Divider “หรือ” */}
            <View style={styles.divider}>
              <View style={styles.divLine} />
              <Text style={styles.divText}>หรือ</Text>
              <View style={styles.divLine} />
            </View>

            {/* secondary: ไปหน้า Login */}
            <Pressable onPress={() => nav.navigate('AuthEmailLogin')} style={styles.altBtn}>
              <View style={styles.altBtnInner}>
                <View style={styles.altDot} />
                <Text style={styles.altText}>เข้าสู่ระบบ</Text>
              </View>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

/* ---------------- Helpers ---------------- */

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
        {!!iconLeft && (
          <View style={styles.iconLeft} pointerEvents="none">
            {iconLeft}
          </View>
        )}
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
          style={styles.input}
          placeholderTextColor={COLOR.dim}
        />
        {!!right && (
          <View style={styles.iconRight} pointerEvents="box-none">
            {right}
          </View>
        )}
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
    <Pressable style={styles.checkRow} onPress={onToggle}>
      <View style={[styles.checkBox, checked && styles.checkBoxOn]}>
        {checked && <Ionicons name="checkmark" size={16} color="#fff" />}
      </View>
      <Text style={[styles.checkLabel, subtle && { color: COLOR.dim }]}>{label}</Text>
    </Pressable>
  );
}

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
  scroll: { padding: 16, paddingTop: 18 },
  pageTitle: { textAlign: 'center', fontSize: 18, fontWeight: '800', color: COLOR.text, marginBottom: 10 },

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
    width: 22,
    height: 22,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
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
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
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

  bubbleA: {
    position: 'absolute',
    top: -40,
    left: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(255,255,255,0.28)',
  },
  bubbleB: {
    position: 'absolute',
    bottom: -60,
    right: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
});
