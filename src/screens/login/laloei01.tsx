import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Dimensions, Image, Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Background from '../../components/Background';
import { useTranslation } from 'react-i18next';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { AuthStackParamList, MainTabParamList, RootStackParamList } from '../../navigation/RootStackParamList';
import { COLOR } from '../../theme/theme';


const { width } = Dimensions.get('window');
const R = 18;

type Props = {
  onLoginPhone?: () => void;
  onLoginEmail?: () => void;
  onLoginApple?: () => void;
  onLoginGoogle?: () => void;
  onSwitchLang?: (lang: 'th' | 'en') => void;
  onSignup?: () => void;
};

const AuthLandingScreen: React.FC<Props> = ({
  onLoginPhone,
  onLoginEmail,
  onLoginApple,
  onLoginGoogle,
  onSwitchLang,
  onSignup,
}) => {

  const { t, i18n } = useTranslation();
  const lang: 'th' | 'en' = (i18n.language || 'th').startsWith('th') ? 'th' : 'en';
  const nav = useNavigation<NavigationProp<AuthStackParamList>>();
  const switchLang = React.useCallback(async (l: 'th' | 'en') => {
    const current = (i18n.language || '').startsWith('th') ? 'th' : 'en';
    if (current === l) return;
    try { await i18n.changeLanguage(l); } catch (e) { console.warn('changeLanguage error:', e); }
    onSwitchLang?.(l);
  }, [i18n, onSwitchLang]);

  const tagline =
    lang === 'th'
      ? 'ระบบลางานสำหรับธุรกิจ SME ใช้ง่าย ไม่ยุ่งยาก'
      : 'Leave system for SMEs — simple and hassle-free';
  const handleLoginPhone = onLoginPhone || (() => nav.navigate('AuthPhoneLogin'));
  const openLoginEmail = onLoginEmail || (() => nav.navigate('AuthEmailLogin'));
  return (
    <Background>
      {/* พื้นหลังไล่สีพาสเทลเต็มจอ */}
      <LinearGradient
        colors={[COLOR.bgTop, COLOR.bgBottom]}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* มุมขวาบนแต่ง wave ส้มตาม mockup */}
      <View style={styles.orangeWave}>
        <LinearGradient
          colors={['#FFD389', '#FFB957']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={styles.orangeWaveFill}
        />

         {/* สวิตช์ภาษา pill มุมขวาล่าง */}
      <View style={styles.langPill}>
        <TouchableOpacity
          style={[styles.langChip, lang === 'th' && styles.langActive]}
          onPress={() => switchLang('th')}
        >
          <Text style={[styles.langText, lang === 'th' && styles.langTextActive]}>TH</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.langChip, lang === 'en' && styles.langActive]}
          onPress={() => switchLang('en')}
        >
          <Text style={[styles.langText, lang === 'en' && styles.langTextActive]}>EN</Text>
        </TouchableOpacity>
      </View>
      </View>

      {/* โลโก้ + ชื่อแอปกลางจอ */}
      <View style={styles.header}>
        <Text style={styles.logoEmoji}>📅</Text>
        <View style={styles.brandRow}>
          <Text style={[styles.brand, { color: COLOR.teal }]}>{t('appname')}</Text>
          {/* <Text style={[styles.brand, { color: COLOR.orange, marginLeft: 6 }]}></Text> */}
        </View>
        <Text style={styles.tagline}>{tagline}</Text>
      </View>

      {/* ปุ่มหลัก */}
      <View style={styles.container}>
        <TouchableOpacity style={[styles.btnPrimary, { backgroundColor: COLOR.orange }]} onPress={handleLoginPhone}>
          <Text style={styles.btnPrimaryText}>📱  {t('auth.loginWithPhone')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btnPrimary, { backgroundColor: COLOR.teal }]} onPress={openLoginEmail}>
          <Text style={styles.btnPrimaryText}>✉️  {t('auth.loginWithEmail')}</Text>
        </TouchableOpacity>

        {/* เส้นคั่น หรือ */}
        <View style={styles.dividerRow}>
          <View style={styles.line} />
          <Text style={styles.dividerText}>{t('auth.or')}</Text>
          <View style={styles.line} />
        </View>

        {/* Apple / Google */}
        <TouchableOpacity style={[styles.btnApple, styles.shadowSoft]} onPress={onLoginApple}>
          <Text style={styles.btnAppleText}>  {t('auth.loginWithApple')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnGoogle} onPress={onLoginGoogle}>
          <Text style={styles.btnGoogleText}>G  {t('auth.loginWithGoogle')}</Text>
        </TouchableOpacity>

        {/* ลิงก์สมัคร */}
        <Text style={styles.signup}>
          {lang === 'th' ? 'ยังไม่มีบัญชี? ' : "Don't have an account? "}
          <Text style={styles.signupLink} onPress={onSignup}>
            {lang === 'th' ? 'สมัครใช้งานฟรี' : 'Try for free'}
          </Text>
        </Text>
      </View>

     

      {/* โลโก้พาร์ทเนอร์ (ถ้ามี) */}
      <View style={styles.partnerRow}>
        <Image source={{ uri: 'https://via.placeholder.com/100x20?text=Partner+A' }} style={styles.partnerLogo} />
        <Image source={{ uri: 'https://via.placeholder.com/80x20?text=Partner+B' }} style={styles.partnerLogo} />
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },

  orangeWave: {
    position: 'absolute',
    top: 0, right: 0,
    width: 160, height: 160,
    overflow: 'hidden', borderBottomLeftRadius: 80,
  },
  orangeWaveFill: { width: '100%', height: '100%' },

  header: {
    alignItems: 'center',
    paddingTop: Platform.select({ ios: 18, android: 26 }),
    marginTop: 10,
  },
  logoEmoji: { fontSize: 44, marginBottom: 8 },
  brandRow: { flexDirection: 'row', alignItems: 'baseline' },
  brand: { fontSize: 40, fontWeight: '900', letterSpacing: 0.6 },
  tagline: {
    marginTop: 8,
    fontSize: 16,
    lineHeight: 22,
    color: COLOR.dim,
    textAlign: 'center',
    paddingHorizontal: 24,
  },

  container: {
    marginTop: 16,
    paddingHorizontal: 20,
    gap: 12,
  },

  btnPrimary: {
    height: 56,
    borderRadius: R,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  btnPrimaryText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },

  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 6, gap: 12 },
  line: { height: StyleSheet.hairlineWidth, backgroundColor: COLOR.line, flex: 1 },
  dividerText: { color: COLOR.dim },

  btnApple: {
    height: 52,
    backgroundColor: COLOR.appleBlack,
    borderRadius: R,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnAppleText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },

  btnGoogle: {
    height: 52,
    backgroundColor: '#FFFFFF',
    borderRadius: R,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1, borderColor: COLOR.line,
  },
  btnGoogleText: { color: COLOR.text, fontSize: 16, fontWeight: '800' },

  signup: { textAlign: 'center', color: COLOR.dim, marginTop: 6 },
  signupLink: { color: COLOR.text, fontWeight: '800', textDecorationLine: 'underline' },

  langPill: {
    position: 'absolute', right: 16, bottom: 16,
    flexDirection: 'row',
    backgroundColor: '#F2F4F6',
    borderRadius: 999,
    padding: 4,
  },
  langChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  langActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 1,
  },
  langText: { color: '#667085', fontWeight: '800' },
  langTextActive: { color: '#0F172A' },

  partnerRow: {
    position: 'absolute',
    bottom: 10, width,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 28,
  },
  partnerLogo: { width: 100, height: 20, resizeMode: 'contain' },
  shadowSoft: {
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
});

export default AuthLandingScreen;
