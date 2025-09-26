// screens/AuthEmailLogin.tsx
import { NavigationProp, useNavigation } from '@react-navigation/core';
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Platform, StatusBar,
  TouchableOpacity, TextInput, ScrollView,
  KeyboardAvoidingView, ActivityIndicator, Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import useSafeGoBack from '../../navigation/useSafeGoBack';
import { getMe, loginWithEmail } from '../../connections/auth/authApi';
import { useAuthStore } from '@/src/store/useAuthStore';

type Props = {
  onBack?: () => void;
  onLogin?: (payload: { email: string; password: string; remember: boolean }) => Promise<void> | void;
  onForgot?: (email?: string) => void;
  onRegister?: () => void;
};

const COLOR = {
  bgTopA: '#E8F3FF',
  bgTopB: '#F4FBFF',
  brand: '#2AA5E1',
  brandSoft: '#E0F2FF',
  dark: '#0F172A',
  dim: '#607089',
  card: '#FFFFFF',
  line: '#EAF0F6',
  danger: '#E5484D',
};
const HIT = { top: 10, bottom: 10, left: 10, right: 10 };

const AuthEmailLogin: React.FC<Props> = ({ onLogin, onForgot, onRegister }) => {
  const nav = useNavigation<NavigationProp<RootStackParamList>>();
  const safeGoBack = nav.canGoBack() ? nav.goBack : undefined;
  const login = useAuthStore((s) => s.login);
  const setProfile = useAuthStore((s) => s.setProfile);


  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [email, setEmail] = useState('admin@gmail.com');
  const [password, setPassword] = useState('P@ssw0rd123');

  const emailValid = validateEmail(email);
  const passValid = password.length >= 6;
  const canSubmit = emailValid && passValid && !loading;

  const submit = async () => {
    if (!canSubmit) return;        // ✅ กันกดตอนยังไม่ผ่าน
    setError(null);
    try {
      setLoading(true);

      const emailNorm = email.trim().toLowerCase();

      // ✅ ส่งทั้ง email และ username กัน API เก่า/ใหม่
      const res = await loginWithEmail({
        email: emailNorm,
        username: emailNorm,
        password,
        remember,
      } as any);


      console.log('loginWithEmail res', res.access_token);

      const me = await getMe(res.access_token);
      login(res.access_token);
     console.log('====================>  me', me);
      setProfile({
        id: me.id,
        email: me.email,
        name: me.name ?? null,
        locale: me.locale ?? null,
        timezone: me.timezone ?? null,
        emailVerified: me.email_verified_at !== null,
        orgs: (me.memberships ?? []).map((m) => ({
          id: m.org?.id,
          name: m.org?.name,
          subdomain: m.org?.subdomain ?? null,
          role: m.role,
        })),
        orgId: (me.memberships && me.memberships.length > 0) ? me.memberships[0].org?.id : null,
      });



      // ให้ parent นำทางต่อ
      await onLogin?.({ email, password, remember });
      // หรือถ้าไม่มี ให้ไป Main
      await !onLogin && nav.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
      // await !onLogin && nav.reset({ index: 0, routes: [{ name: 'AuthStack' }] });
    } catch (e: any) {
      const msg = String(e?.message || '');
      console.warn('AuthEmailLogin submit error', msg);
      if (msg.toLowerCase().includes('email must be an email')) {
        setError('รูปแบบอีเมลไม่ถูกต้อง');
      } else if (msg.toLowerCase().includes('unauthorized')) {
        setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      } else {
        setError('เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F7FAFD' }}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={[COLOR.bgTopA, COLOR.bgTopB]}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => safeGoBack} hitSlop={HIT}>
            <Text style={styles.back}>{'‹'}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>เข้าสู่ระบบ</Text>
          <View style={{ width: 24 }} />
        </View>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 140 }} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            <Text style={styles.title}>เข้าสู่ระบบด้วยอีเมล</Text>
            <Text style={styles.sub}>กรอกอีเมลและรหัสผ่านเพื่อเข้าใช้งาน</Text>

            {/* Email */}
            <Text style={styles.label}>อีเมล</Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              placeholder="you@company.com"
              value={email}
              onChangeText={(t) => { 
                // ✅ กัน space เผลอพิมพ์
                const s = t.replace(/\s/g, '');
                setEmail(s); 
                setError(null); 
              }}
              style={[styles.input, !!email && !emailValid && styles.inputError]}
              returnKeyType="next"
            />
            {!!email && !emailValid && <Text style={styles.error}>รูปแบบอีเมลไม่ถูกต้อง</Text>}

            {/* Password */}
            <Text style={styles.label}>รหัสผ่าน</Text>
            <View style={[styles.inputRow, password.length > 0 && !passValid && styles.inputError]}>
              <TextInput
                placeholder="อย่างน้อย 6 ตัวอักษร"
                value={password}
                onChangeText={(t) => { setPassword(t); setError(null); }}
                secureTextEntry={!showPw}
                style={styles.inputFlex}
                returnKeyType="done"
                onSubmitEditing={submit}
              />
              <TouchableOpacity onPress={() => setShowPw((v) => !v)} hitSlop={HIT}>
                <Text style={styles.togglePw}>{showPw ? 'ซ่อน' : 'แสดง'}</Text>
              </TouchableOpacity>
            </View>
            {password.length > 0 && !passValid && <Text style={styles.error}>รหัสผ่านต้องอย่างน้อย 6 ตัวอักษร</Text>}

            {/* Remember + Forgot */}
            <View style={styles.rowBetween}>
              <View style={styles.rememberRow}>
                <Switch value={remember} onValueChange={setRemember} thumbColor="#fff" trackColor={{ true: COLOR.brandSoft, false: '#E5EAF1' }} />
                <Text style={styles.rememberText}>จดจำการเข้าสู่ระบบ</Text>
              </View>
              <TouchableOpacity onPress={() => onForgot?.(email)} hitSlop={HIT}>
                <Text style={styles.link}>ลืมรหัสผ่าน?</Text>
              </TouchableOpacity>
            </View>

            {!!error && <Text style={[styles.error, { marginTop: 8 }]}>{error}</Text>}

            {/* Sign in */}
            <TouchableOpacity
              style={[styles.primaryBtn, !canSubmit && { opacity: 0.6 }]}
              onPress={submit}
              activeOpacity={0.9}
              disabled={!canSubmit}
            >
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryText}>เข้าสู่ระบบ</Text>}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.hr} />
              <Text style={styles.dividerText}>หรือ</Text>
              <View style={styles.hr} />
            </View>

            {/* Social / SSO */}
            <TouchableOpacity style={styles.ssoBtn} onPress={onRegister} activeOpacity={0.9}>
              <Text style={styles.ssoIcon}>🟢</Text>
              <Text style={styles.ssoText}>สมัครสมาชิกด้วย</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default AuthEmailLogin;

/* -------------- helpers -------------- */
// ✅ อ่อนโยนพอ ไม่ตีตกอีเมลปกติ
function validateEmail(v: string) {
  const s = v.trim();
  return /^\S+@\S+\.\S+$/.test(s);
}

/* -------------- styles -------------- */
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
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  back: { fontSize: 26, color: COLOR.dim, lineHeight: 26 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: COLOR.dark },

  card: {
    backgroundColor: COLOR.card,
    borderRadius: 20,
    borderWidth: 1, borderColor: COLOR.line,
    padding: 16,
    marginTop: 14,
  },
  title: { fontSize: 18, fontWeight: '900', color: COLOR.dark },
  sub: { fontSize: 13, color: COLOR.dim, marginTop: 6 },

  label: { fontSize: 12.5, color: COLOR.dim, fontWeight: '700', marginTop: 16 },

  input: {
    marginTop: 6,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1, borderColor: COLOR.line,
    paddingHorizontal: 12, paddingVertical: 12,
    fontSize: 14, color: COLOR.dark,
  },
  inputRow: {
    marginTop: 6,
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1, borderColor: COLOR.line,
    paddingHorizontal: 12, paddingVertical: 2,
  },
  inputFlex: { flex: 1, paddingVertical: 10, fontSize: 14, color: COLOR.dark },
  inputError: { borderColor: '#F5C2C7', backgroundColor: '#FFF5F6' },

  togglePw: { color: COLOR.brand, fontWeight: '800' },

  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 },
  rememberRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rememberText: { fontSize: 12.5, color: COLOR.dark, fontWeight: '600' },
  link: { color: COLOR.brand, fontWeight: '900', fontSize: 13 },

  primaryBtn: {
    marginTop: 18,
    backgroundColor: COLOR.brand,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryText: { color: '#fff', fontWeight: '900', fontSize: 16 },

  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 18 },
  hr: { flex: 1, height: 1, backgroundColor: COLOR.line },
  dividerText: { fontSize: 12, color: COLOR.dim },

  ssoBtn: {
    marginTop: 12,
    borderRadius: 12,
    borderWidth: 1, borderColor: COLOR.line,
    backgroundColor: '#F7FAFD',
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row', justifyContent: 'center', gap: 8,
  },
  ssoIcon: { fontSize: 16 },
  ssoText: { fontSize: 14, fontWeight: '800', color: COLOR.dark },

  error: { color: COLOR.danger, fontSize: 12.5, marginTop: 6 },
});
