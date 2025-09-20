import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { AuthStackParamList } from '@/src/navigation/RootStackParamList';
import { COLOR } from '@/src/theme/theme';

const R = 16;

export default function RegisterScreen() {
  const nav = useNavigation<NavigationProp<AuthStackParamList>>();
  const { t, i18n } = useTranslation();

  // form state
  const [firstName, setFirst] = useState('');
  const [lastName, setLast] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState(''); // optional (E.164)
  const [password, setPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const [tos, setTos] = useState(false);
  const [marketing, setMarketing] = useState(true);

  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // validation
  const emailOk = useMemo(() => /\S+@\S+\.\S+/.test(email.trim().toLowerCase()), [email]);
  const phoneOk = useMemo(() => phone === '' || /^\+?[0-9]{7,15}$/.test(phone.trim()), [phone]);
  const pwOk = useMemo(() => password.length >= 8, [password]);
  const matchOk = useMemo(() => confirm === password && confirm.length > 0, [confirm, password]);

  const canSubmit = emailOk && phoneOk && pwOk && matchOk && tos && !loading;

  const onSubmit = async () => {
    if (!canSubmit) return;
    setErr(null);
    try {
      setLoading(true);
      // TODO: ต่อ API จริง /auth/register
      await new Promise((r) => setTimeout(r, 700));

      // ไปหน้า login
      nav.navigate('AuthEmailLogin');
    } catch (e: any) {
      setErr(String(e?.message ?? 'Register failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      {/* Soft gradient background */}
      <LinearGradient
        colors={[COLOR.bgTop, COLOR.bgBottom]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Brand / Header card */}
          <View style={[styles.heroCard, styles.cardShadow]}>
            <View style={styles.brandRow}>
              <LinearGradient
                colors={[COLOR.teal, COLOR.orange]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.brandBadge}
              >
                <Text style={styles.brandBadgeText}>L</Text>
              </LinearGradient>
              <Text style={styles.brandTitle}>
                {t('auth.createAccount', 'สร้างบัญชีใหม่')}
              </Text>
            </View>
            <Text style={styles.brandSub}>
              {t('auth.registerSubtitle', 'ลงทะเบียนใช้งาน Laloei ฟรีภายในไม่กี่ขั้นตอน')}
            </Text>
          </View>

          {/* Form card */}
          <View style={[styles.formCard, styles.cardShadow]}>
            <Field
              iconLeft={<Ionicons name="person-outline" size={20} color={COLOR.dim} />}
              placeholder={t('auth.firstName', 'ชื่อ')}
              value={firstName}
              onChangeText={setFirst}
              autoCapitalize="words"
              returnKeyType="next"
            />
            <Field
              iconLeft={<Ionicons name="person-outline" size={20} color={COLOR.dim} />}
              placeholder={t('auth.lastName', 'นามสกุล')}
              value={lastName}
              onChangeText={setLast}
              autoCapitalize="words"
              returnKeyType="next"
            />
            <Field
              iconLeft={<Ionicons name="mail-outline" size={20} color={COLOR.dim} />}
              placeholder="email@example.com"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              error={!emailOk && email.length > 0 ? t('auth.invalidEmail', 'อีเมลไม่ถูกต้อง') : undefined}
            />
            <Field
              iconLeft={<Ionicons name="call-outline" size={20} color={COLOR.dim} />}
              placeholder={t('auth.phoneOptional', 'เบอร์โทร (ไม่บังคับ) เช่น +66912345678')}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              error={!phoneOk && phone.length > 0 ? t('auth.invalidPhone', 'เบอร์ไม่ถูกต้อง') : undefined}
            />

            <Field
              iconLeft={<Ionicons name="lock-closed-outline" size={20} color={COLOR.dim} />}
              placeholder={t('auth.password', 'รหัสผ่าน (อย่างน้อย 8 ตัว)')}
              value={password}
              onChangeText={setPw}
              secureTextEntry={!showPw}
              right={
                <TouchableOpacity onPress={() => setShowPw((v) => !v)}>
                  <Ionicons name={showPw ? 'eye-off-outline' : 'eye-outline'} size={20} color={COLOR.dim} />
                </TouchableOpacity>
              }
              error={!pwOk && password.length > 0 ? t('auth.passwordTooShort', 'ต้องมีอย่างน้อย 8 ตัวอักษร') : undefined}
            />

            <Field
              iconLeft={<MaterialCommunityIcons name="lock-check-outline" size={20} color={COLOR.dim} />}
              placeholder={t('auth.confirmPassword', 'ยืนยันรหัสผ่าน')}
              value={confirm}
              onChangeText={setConfirm}
              secureTextEntry
              error={!matchOk && confirm.length > 0 ? t('auth.passwordNotMatch', 'รหัสผ่านไม่ตรงกัน') : undefined}
            />

            {/* Check rows */}
            <CheckRow
              checked={tos}
              onToggle={() => setTos((v) => !v)}
              label={t('auth.acceptTos', 'ฉันยอมรับข้อตกลงการใช้งานและนโยบายความเป็นส่วนตัว')}
            />
            <CheckRow
              checked={marketing}
              onToggle={() => setMarketing((v) => !v)}
              label={t('auth.allowMarketing', 'ยินยอมรับข่าวสาร/สิทธิพิเศษ (เลือกได้)')}
              subtle
            />

            {err && <Text style={styles.errText}>{err}</Text>}

            {/* Primary CTA */}
            <TouchableOpacity
              activeOpacity={0.9}
              disabled={!canSubmit}
              onPress={onSubmit}
              style={[styles.btnShadow, { marginTop: 14 }]}
            >
              <LinearGradient
                colors={canSubmit ? [COLOR.teal, COLOR.orange] : ['#C9D2D6', '#C9D2D6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.btnPrimary}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.btnPrimaryText}>
                    {t('auth.register', 'สมัครสมาชิก')}
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Login link */}
            <TouchableOpacity onPress={() => nav.navigate('AuthEmailLogin')} style={{ marginTop: 12 }}>
              <Text style={styles.loginLink}>
                {t('auth.alreadyHaveAccount', 'มีบัญชีอยู่แล้ว?')}{' '}
                <Text style={styles.loginLinkStrong}>{t('auth.login', 'เข้าสู่ระบบ')}</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

/* ====== Small UI helpers ====== */

type FieldProps = {
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
};
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
}: FieldProps) {
  return (
    <View style={{ marginTop: 10 }}>
      <View style={[styles.inputWrap, error ? styles.inputWrapError : undefined]}>
        {!!iconLeft && <View style={styles.iconLeft}>{iconLeft}</View>}
        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          returnKeyType={returnKeyType}
          style={styles.input}
          placeholderTextColor={COLOR.dim}
        />
        {!!right && <View style={styles.iconRight}>{right}</View>}
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
    <TouchableOpacity style={styles.checkRow} onPress={onToggle} activeOpacity={0.7}>
      <View style={[styles.checkBox, checked && styles.checkBoxOn]}>
        {checked && <Ionicons name="checkmark" size={16} color="#fff" />}
      </View>
      <Text style={[styles.checkLabel, subtle && { color: COLOR.dim }]}>{label}</Text>
    </TouchableOpacity>
  );
}

/* ====== Styles ====== */

const styles = StyleSheet.create({
  root: { flex: 1 },

  scrollContent: {
    padding: 18,
    paddingTop: 28,
  },

  heroCard: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 24,
    padding: 18,
    marginBottom: 14,
  },
  brandRow: { flexDirection: 'row', alignItems: 'center' },
  brandBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  brandBadgeText: { color: '#fff', fontWeight: '900', fontSize: 18 },
  brandTitle: { fontSize: 22, fontWeight: '900', color: COLOR.text },
  brandSub: { color: COLOR.dim, marginTop: 6 },

  formCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 16,
  },

  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: R,
    borderWidth: 1,
    borderColor: COLOR.line,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    height: 52,
  },
  inputWrapError: { borderColor: '#D92D20' },
  iconLeft: { marginRight: 8 },
  iconRight: { marginLeft: 8 },
  input: { flex: 1, fontSize: 16, color: COLOR.text },

  checkRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  checkBox: {
    width: 22, height: 22, borderRadius: 7,
    borderWidth: 1, borderColor: COLOR.line,
    alignItems: 'center', justifyContent: 'center',
    marginRight: 10, backgroundColor: '#fff',
  },
  checkBoxOn: { backgroundColor: COLOR.teal, borderColor: COLOR.teal },
  checkLabel: { flex: 1, color: COLOR.text },

  btnPrimary: {
    height: 54,
    borderRadius: R,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimaryText: { color: '#fff', fontSize: 16, fontWeight: '900', letterSpacing: 0.3 },
  btnShadow: {
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },

  errSmall: { color: '#D92D20', marginTop: 4, fontSize: 12 },
  errText: { color: '#D92D20', marginTop: 8 },

  loginLink: { textAlign: 'center', marginTop: 8, color: COLOR.dim },
  loginLinkStrong: { color: COLOR.text, fontWeight: '800', textDecorationLine: 'underline' },

  cardShadow: {
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
});
