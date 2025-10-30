// src/screens/auth/VerifyEmailScreen.tsx
import { COLOR } from '@/src/theme/token';
import React, { useMemo, useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text, TextInput, TouchableOpacity,
  View
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

type Props = {
  email: string;
  fullName?: string;             // ใช้ทำ First Character Avatar
  onVerified: () => void;        // เรียกเมื่อยืนยันสำเร็จ
  onChangeEmail?: () => void;    // ถ้าผู้ใช้กด “เปลี่ยนอีเมล”
  // ถ้ามี client http ของคุณ ส่งเข้ามาแทนที่สองฟังก์ชันนี้ได้
  resendFn?: (email: string) => Promise<void>;
  verifyFn?: (payload: { code: string; email: string }) => Promise<void>;
};

const VerifyEmailScreen: React.FC<Props> = ({
  email = '',
  fullName = 'ผู้ใช้ใหม่',
  onVerified,
  onChangeEmail,
  resendFn,
  verifyFn,
}: Props) => {
  const firstChar = (fullName?.trim() || 'ผ').charAt(0);
  const [code, setCode] = useState<string>('');
  const inputs = useRef<Array<TextInput | null>>([]);
  const [cooldown, setCooldown] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  // goback()

  // mock fallback ถ้าไม่ส่ง fn เข้ามา
  const fallbackResend = async () => new Promise<void>(r => setTimeout(r, 500));
  const fallbackVerify = async () => new Promise<void>(r => setTimeout(r, 600));

  const canSubmit = code.length === 6 && !loading;

  const handleChangeDigit = (digit: string, idx: number) => {
    const next = (code.slice(0, idx) + digit.slice(-1)).padEnd(6, '').slice(0, 6);
    setCode(next);
    // โฟกัสตัวถัดไป
    if (digit && idx < 5) {
      inputs.current[idx + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, idx: number) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (!code[idx] && idx > 0) inputs.current[idx - 1]?.focus();
      setCode(prev => (prev.slice(0, idx) + prev.slice(idx + 1)).padEnd(6, ''));
    }
  };

  const onResend = async () => {
    if (cooldown > 0 || loading) return;
    try {
      setLoading(true);
      await (resendFn ?? fallbackResend)(email);
      setCooldown(60); // 60 วินาที
      const timer = setInterval(() => {
        setCooldown(c => {
          if (c <= 1) { clearInterval(timer); return 0; }
          return c - 1;
        });
      }, 1000);
      Alert.alert('ส่งรหัสแล้ว', 'โปรดตรวจสอบอีเมลของคุณ');
    } catch (err: any) {
      Alert.alert('ไม่สำเร็จ', err?.message || 'ส่งรหัสไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async () => {
    if (!canSubmit) return;
    try {
      setLoading(true);
      await (verifyFn ?? fallbackVerify)({ code, email });
      Alert.alert('ยืนยันสำเร็จ', 'อีเมลของคุณได้รับการยืนยันแล้ว', [
        { text: 'ตกลง', onPress: onVerified }
      ]);
    } catch (err: any) {
      Alert.alert('โค้ดไม่ถูกต้อง', err?.message || 'กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  const boxes = useMemo(() => Array.from({ length: 6 }), []);

  return (
    <LinearGradient
      colors={[COLOR.bgTopB, COLOR.bgTopA]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
<View style={{ padding: 16 }}>
    <Text>{fullName}</Text>
</View>

      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <View style={styles.container}>
            {/* Header + First Character Avatar */}
            <View style={styles.headerRow}>
              <LinearGradient colors={['#deeaf3ff', '#3FA1E6']} style={styles.avatar} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                <Text style={styles.avatarText}>{firstChar}</Text>
              </LinearGradient>
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={styles.title}>ยืนยันอีเมลของคุณ</Text>
                <Text style={styles.subTitle}>{email}</Text>
              </View>
            </View>

            {/* Hint */}
            <Text style={styles.hint}>
              เราได้ส่งรหัส 6 หลักไปที่อีเมลของคุณ กรอกรหัสเพื่อยืนยันตัวตน
            </Text>

            {/* Code boxes */}
            <View style={styles.codeRow}>
              {boxes.map((_, i) => (
                <TextInput
                  key={i}
                  ref={r => { inputs.current[i] = r; }}
                  value={code[i] ?? ''}
                  onChangeText={(t) => handleChangeDigit(t, i)}
                  onKeyPress={(e) => handleKeyPress(e, i)}
                  keyboardType="number-pad"
                  maxLength={1}
                  style={[styles.codeBox, code[i] ? styles.codeFilled : null]}
                  returnKeyType={i === 5 ? 'done' : 'next'}
                />
              ))}
            </View>

            {/* Primary CTA */}
            <TouchableOpacity
              style={[styles.primaryBtn, !canSubmit && { opacity: 0.6 }]}
              disabled={!canSubmit}
              onPress={onSubmit}
              activeOpacity={0.9}
            >
              <Text style={styles.primaryText}>{loading ? 'กำลังยืนยัน...' : 'ยืนยัน'}</Text>
            </TouchableOpacity>

            {/* Resend + Change email */}
            <View style={styles.bottomRow}>
              <TouchableOpacity onPress={onResend} disabled={cooldown > 0 || loading}>
                <Text style={[styles.link, (cooldown > 0 || loading) && styles.linkDisabled]}>
                  ส่งรหัสอีกครั้ง {cooldown > 0 ? `(${cooldown}s)` : ''}
                </Text>
              </TouchableOpacity>

              {onChangeEmail && (
                <TouchableOpacity onPress={onChangeEmail}>
                  <Text style={styles.link}>เปลี่ยนอีเมล</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Info */}
            <Text style={styles.note}>
              หากไม่พบอีเมล ให้ตรวจสอบโฟลเดอร์สแปม/จดหมายขยะ
            </Text>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  avatar: { width: 54, height: 54, borderRadius: 27, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontSize: 22, fontWeight: '800' },
  title: { fontSize: 20, fontWeight: '800', color: '#0F172A' },
  subTitle: { fontSize: 14, color: '#334155' },
  hint: { marginTop: 8, color: '#475569' },

  codeRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 18 },
  codeBox: {
    width: 48, height: 56, borderRadius: 12,
    backgroundColor: '#fff', textAlign: 'center',
    fontSize: 22, fontWeight: '700',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  codeFilled: { backgroundColor: '#F0F7FF' },

  primaryBtn: {
    marginTop: 22,
    height: 50, borderRadius: 14,
    backgroundColor: '#3E8BFF', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#3E8BFF', shadowOpacity: 0.25, shadowRadius: 6,
  },
  primaryText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  bottomRow: { marginTop: 16, flexDirection: 'row', alignItems: 'center', gap: 16 },
  link: { color: '#2563EB', fontWeight: '600' },
  linkDisabled: { color: '#93C5FD' },
  note: { marginTop: 10, color: '#64748B', fontSize: 12 },
});

export default VerifyEmailScreen;