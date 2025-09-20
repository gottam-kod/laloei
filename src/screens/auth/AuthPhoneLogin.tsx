// screens/AuthPhoneLogin.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Platform, StatusBar,
  TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView,
  Clipboard,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

type Props = {
  onBack?: () => void;
  // ให้โปรเจ็กต์จริงโยง API ที่นี่
  onRequestOtp?: (phoneE164: string) => Promise<void> | void;
  onVerifyOtp?: (phoneE164: string, otp: string) => Promise<void> | void;
};

const COLOR = {
  bgTopA: '#E8F3FF',
  bgTopB: '#F4FBFF',
  brand:  '#2AA5E1',
  brandSoft: '#E0F2FF',
  dark:   '#0F172A',
  dim:    '#607089',
  card:   '#FFFFFF',
  line:   '#EAF0F6',
  danger: '#E5484D',
  success:'#0A7C66',
};

const OTP_LEN = 6;

const AuthPhoneLogin: React.FC<Props> = ({ onBack, onRequestOtp, onVerifyOtp }) => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');

  // phone
  const [phone, setPhone] = useState('');          // 08x-xxx-xxxx
  const [err, setErr] = useState<string | null>(null);
  const phoneE164 = useMemo(() => toE164TH(phone), [phone]); // +66xxxxxxxxx

  // otp
  const [otp, setOtp] = useState<string[]>(Array(OTP_LEN).fill(''));
  const inputs = useRef<Array<TextInput | null>>([]);
  const [cooldown, setCooldown] = useState(0);     // วินาที
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let t: any;
    if (cooldown > 0) {
      t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    }
    return () => clearTimeout(t);
  }, [cooldown]);

  const requestOtp = async () => {
    setErr(null);
    const valid = validateThaiPhone(phone);
    if (!valid) {
      setErr('กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง');
      return;
    }
    try {
      setLoading(true);
      await onRequestOtp?.(phoneE164);
      setStep('otp');
      setCooldown(60);
      setOtp(Array(OTP_LEN).fill(''));
      setTimeout(() => inputs.current[0]?.focus(), 100);
    } catch (e: any) {
      setErr(e?.message || 'ขอรหัส OTP ไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    const code = otp.join('');
    if (code.length !== OTP_LEN) return;
    try {
      setLoading(true);
      await onVerifyOtp?.(phoneE164, code);
      // สำเร็จ: ปล่อยให้ parent นำทางต่อ (เช่น ไปหน้า Home)
    } catch (e: any) {
      setErr(e?.message || 'รหัสไม่ถูกต้อง กรุณาลองใหม่');
    } finally {
      setLoading(false);
    }
  };

  const pasteFromClipboard = async () => {
    try {
      const text = await Clipboard.getString();
      if (!text) return;
      const onlyDigits = text.replace(/\D/g, '');
      const updated = formatThaiPhone(onlyDigits);
      setPhone(updated);
    } catch {}
  };

  const onChangeOtpBox = (idx: number, v: string) => {
    const d = v.replace(/\D/g, '').slice(-1);
    const next = [...otp];
    next[idx] = d;
    setOtp(next);
    if (d && idx < OTP_LEN - 1) inputs.current[idx + 1]?.focus();
    if (idx === OTP_LEN - 1 && d) verifyOtp();
  };

  const onKeyPressOtp = (idx: number, key: string) => {
    if (key === 'Backspace' && !otp[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus();
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F7FAFD' }}>
      <StatusBar barStyle="dark-content" />

      {/* HEADER: gradient พื้นหลัง ไม่กินทัช */}
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={[COLOR.bgTopA, COLOR.bgTopB]}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={onBack} hitSlop={HIT}>
            <Text style={styles.back}>{'‹'}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>เข้าสู่ระบบ</Text>
          <View style={{ width: 24 }} />
        </View>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 140 }} keyboardShouldPersistTaps="handled">
          {/* การ์ดหลัก */}
          <View style={styles.card}>
            {step === 'phone' ? (
              <>
                <Text style={styles.title}>ยืนยันตัวตนด้วยเบอร์โทรศัพท์</Text>
                <Text style={styles.sub}>เราจะส่งรหัส OTP 6 หลักไปยังหมายเลขของคุณ</Text>

                <Text style={styles.label}>เบอร์โทรศัพท์</Text>
                <View style={styles.phoneRow}>
                  <View style={styles.ccBox}><Text style={styles.ccText}>+66</Text></View>
                  <TextInput
                    keyboardType="phone-pad"
                    placeholder="08x-xxx-xxxx"
                    value={phone}
                    onChangeText={(t) => {
                      setErr(null);
                      setPhone(formatThaiPhone(t.replace(/\D/g, '')));
                    }}
                    style={styles.phoneInput}
                    maxLength={12} // 3-3-4 รวมขีดคั่น
                  />
                  <TouchableOpacity onPress={pasteFromClipboard} hitSlop={HIT}>
                    <Text style={styles.paste}>วาง</Text>
                  </TouchableOpacity>
                </View>

                {!!err && <Text style={styles.error}>{err}</Text>}

                <TouchableOpacity
                  onPress={requestOtp}
                  activeOpacity={0.9}
                  style={[styles.primaryBtn, (!validateThaiPhone(phone) || loading) && { opacity: 0.6 }]}
                  disabled={!validateThaiPhone(phone) || loading}
                >
                  <Text style={styles.primaryText}>{loading ? 'กำลังส่ง...' : 'ส่งรหัส OTP'}</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.title}>กรอกรหัส OTP</Text>
                <Text style={styles.sub}>ส่งไปที่ {maskPhoneThai(phone)}</Text>

                <View style={styles.otpRow}>
                  {Array.from({ length: OTP_LEN }).map((_, i) => (
                    <TextInput
                      key={i}
                      ref={(el) => { inputs.current[i] = el; }}
                      style={styles.otpBox}
                      keyboardType="number-pad"
                      maxLength={1}
                      value={otp[i]}
                      onChangeText={(v) => onChangeOtpBox(i, v)}
                      onKeyPress={({ nativeEvent }) => onKeyPressOtp(i, nativeEvent.key)}
                      autoFocus={i === 0}
                    />
                  ))}
                </View>

                {!!err && <Text style={styles.error}>{err}</Text>}

                <TouchableOpacity
                  onPress={verifyOtp}
                  activeOpacity={0.9}
                  style={[styles.primaryBtn, (otp.join('').length !== OTP_LEN || loading) && { opacity: 0.6 }]}
                  disabled={otp.join('').length !== OTP_LEN || loading}
                >
                  <Text style={styles.primaryText}>{loading ? 'กำลังตรวจสอบ...' : 'ยืนยันเข้าสู่ระบบ'}</Text>
                </TouchableOpacity>

                <View style={styles.resendRow}>
                  {cooldown > 0 ? (
                    <Text style={styles.resendText}>ขอรหัสใหม่ได้ใน {cooldown}s</Text>
                  ) : (
                    <TouchableOpacity onPress={requestOtp} hitSlop={HIT}>
                      <Text style={styles.link}>ขอรหัสใหม่</Text>
                    </TouchableOpacity>
                  )}
                </View>

                <TouchableOpacity onPress={() => setStep('phone')} hitSlop={HIT} style={{ marginTop: 8 }}>
                  <Text style={styles.changePhone}>เปลี่ยนเบอร์โทรศัพท์</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default AuthPhoneLogin;

/* -------------- Utils (Thai phone helpers) -------------- */
function formatThaiPhone(digits: string) {
  // 10 หลัก: 0xx xxx xxxx -> 08x-xxx-xxxx
  const s = digits.slice(0, 10);
  if (s.length <= 3) return s;
  if (s.length <= 6) return `${s.slice(0, 3)}-${s.slice(3)}`;
  return `${s.slice(0, 3)}-${s.slice(3, 6)}-${s.slice(6)}`;
}

function validateThaiPhone(viewVal: string) {
  const d = viewVal.replace(/\D/g, '');
  return /^0[689]\d{8}$/.test(d); // mobile TH ปกติขึ้นต้น 06/08/09 รวม 10 หลัก
}

function toE164TH(viewVal: string) {
  const d = viewVal.replace(/\D/g, ''); // 0XXXXXXXXX
  if (d.startsWith('0')) return `+66${d.slice(1)}`;
  if (d.startsWith('66')) return `+${d}`;
  return `+66${d}`;
}

function maskPhoneThai(viewVal: string) {
  const d = viewVal.replace(/\D/g, '');
  if (d.length < 10) return viewVal;
  return `${d.slice(0, 3)}-xxx-${d.slice(6)}`;
}

/* ---------------- Styles ---------------- */
const HIT = { top: 10, bottom: 10, left: 10, right: 10 };

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

  title: { fontSize: 18, color: COLOR.dark, fontWeight: '900' },
  sub: { fontSize: 13, color: COLOR.dim, marginTop: 6 },

  label: { fontSize: 12.5, color: COLOR.dim, fontWeight: '700', marginTop: 16 },
  phoneRow: {
    marginTop: 6,
    borderWidth: 1, borderColor: COLOR.line, borderRadius: 12,
    backgroundColor: '#fff', paddingHorizontal: 10, paddingVertical: 6,
    flexDirection: 'row', alignItems: 'center', gap: 8,
  },
  ccBox: {
    borderRadius: 10, backgroundColor: '#F3F7FB',
    borderWidth: 1, borderColor: COLOR.line, paddingHorizontal: 10, paddingVertical: 8,
  },
  ccText: { color: COLOR.dark, fontWeight: '800' },
  phoneInput: { flex: 1, fontSize: 16, color: COLOR.dark },
  paste: { color: COLOR.brand, fontWeight: '800' },

  error: { color: COLOR.danger, fontSize: 12.5, marginTop: 10 },

  primaryBtn: {
    marginTop: 16,
    backgroundColor: COLOR.brand,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryText: { color: '#fff', fontWeight: '900', fontSize: 16 },

  otpRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  otpBox: {
    width: 48, height: 54, borderRadius: 12,
    borderWidth: 1, borderColor: COLOR.line, backgroundColor: '#fff',
    textAlign: 'center', fontSize: 20, fontWeight: '900', color: COLOR.dark,
  },

  resendRow: { alignItems: 'center', marginTop: 12 },
  resendText: { fontSize: 13, color: COLOR.dim },
  link: { color: COLOR.brand, fontWeight: '900', fontSize: 13 },

  changePhone: { color: COLOR.dim, textAlign: 'center' },
});
