// screens/org/CreateOrganizationScreen.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert, ScrollView, View, Text, TextInput, Pressable, Switch,
  KeyboardAvoidingView, Platform, ActivityIndicator, SafeAreaView, ColorSchemeName, useColorScheme
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/useAuthStore';
import { createOrganization } from '@/src/connections/auth/orgApi';

type Address = {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string; // 'TH'
};

const TZ_OPTIONS = ['Asia/Bangkok'] as const;
const LOCALE_OPTIONS = ['th-TH', 'en-US'] as const;

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .slice(0, 50);
}

export default function CreateOrganizationScreen() {
  const { t } = useTranslation();
  const nav = useNavigation();
  const scheme = useColorScheme();
  const profile = useAuthStore((s) => s.profile);

  // palette (รองรับ dark/light)
  const C = palette(scheme);

  // --- form state ---
  const [name, setName] = useState('laloei Co., Ltd.');
  const [slug, setSlug] = useState('laloei');
  const [slugTouched, setSlugTouched] = useState(false);
  const [domain, setDomain] = useState('laloei.com');
  const [billingEmail, setBillingEmail] = useState('billing@laloei.com');
  const [billingName, setBillingName] = useState('laloei Co., Ltd.');
  const [taxId, setTaxId] = useState('0105551234567');
  const [phone, setPhone] = useState('+66912345678');
  const [timezone, setTimezone] = useState<(typeof TZ_OPTIONS)[number]>(TZ_OPTIONS[0]);
  const [locale, setLocale] = useState<(typeof LOCALE_OPTIONS)[number]>('th-TH');

  const [addr, setAddr] = useState<Address>({
    line1: '123/45 ซอยสุขสบาย',
    line2: 'แขวง/ตำบล สุขใจ',
    city: 'กรุงเทพมหานคร',
    state: 'กรุงเทพมหานคร',
    postal_code: '10240',
    country: 'TH',
  });

  const [inviteEmail, setInviteEmail] = useState('member@laloei.com'); // optional
  const [planCode, setPlanCode] = useState('pro');
  const [startTrial, setStartTrial] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // auto-slug เฉพาะตอนที่ผู้ใช้ "ยังไม่ได้แตะ slug เอง"
  useEffect(() => {
    if (!slugTouched) setSlug(slugify(name || ''));
  }, [name, slugTouched]);

  const canSubmit =
    name.trim().length > 2 &&
    slug.trim().length > 2 &&
    billingEmail.trim().length > 3;

  const onSubmit = async () => {
    if (!canSubmit) {
      Alert.alert('กรอกข้อมูลไม่ครบ', 'กรุณากรอกชื่อองค์กร/slug และ billing email');
      return;
    }
    if (!profile?.id) {
      Alert.alert('ยังไม่พร้อม', 'โปรดล็อกอินก่อนสร้างองค์กร');
      return;
    }

    const payload = {
      name: name.trim(),
      slug: slug.trim(),
      domain: domain.trim() || undefined,
      billing_email: billingEmail.trim(),
      billing_name: billingName.trim() || undefined,
      tax_id: taxId.trim() || undefined,
      phone: phone.trim() || undefined,
      timezone,
      locale,
      address: {
        line1: addr.line1.trim(),
        line2: (addr.line2 || '').trim() || undefined,
        city: addr.city.trim(),
        state: addr.state.trim(),
        postal_code: addr.postal_code.trim(),
        country: addr.country,
      },
      members: inviteEmail
        ? [
            {
              email: inviteEmail.trim(),
              role: 'member' as const,
            },
          ]
        : [],
      plan_code: planCode,
      start_trial: startTrial,
      owner_user_id: profile.id,
    };

    try {
      setSubmitting(true);
      const res = await createOrganization(payload);
      const org = res.organization;
      Alert.alert('สำเร็จ', `สร้างองค์กร ${org?.name || ''} เรียบร้อย`);
      // @ts-ignore
      nav.goBack();
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        'สร้างองค์กรไม่สำเร็จ';
      Alert.alert('Error', Array.isArray(msg) ? msg.join('\n') : String(msg));
    } finally {
      setSubmitting(false);
    }
  };

  // --- UI helpers ---
  const Field = ({ label, caption, children }: { label: string; caption?: string; children: React.ReactNode }) => (
    <View style={{ marginBottom: 14 }}>
      <Text style={[styles.label, { color: C.muted }]}>{label}</Text>
      {children}
      {caption ? <Text style={[styles.caption, { color: C.subtle }]}>{caption}</Text> : null}
    </View>
  );

  const Input = (p: React.ComponentProps<typeof TextInput>) => (
    <TextInput
      {...p}
      placeholderTextColor={C.placeholder}
      style={[
        styles.input,
        { backgroundColor: C.surface, borderColor: C.border, color: C.text },
        p.style,
      ]}
    />
  );

  const Section = ({ title, emoji, children }: { title: string; emoji?: string; children: React.ReactNode }) => (
    <View style={[styles.card, { backgroundColor: C.card, borderColor: C.cardBorder, shadowColor: C.shadow }]}>
      <Text style={[styles.cardTitle, { color: C.text }]}>{emoji ? `${emoji} ` : ''}{title}</Text>
      <View style={{ marginTop: 10 }}>{children}</View>
    </View>
  );

  const Chip = ({ active, label, onPress }: { active: boolean; label: string; onPress: () => void }) => (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        { backgroundColor: active ? C.primary : C.chip, borderColor: active ? C.primary : C.border },
      ]}
    >
      <Text style={{ color: active ? '#fff' : C.text, fontWeight: '600' }}>{label}</Text>
    </Pressable>
  );

  const Row2 = ({ left, right }: { left: React.ReactNode; right: React.ReactNode }) => (
    <View style={styles.row2}>
      <View style={{ flex: 1, marginRight: 8 }}>{left}</View>
      <View style={{ flex: 1, marginLeft: 8 }}>{right}</View>
    </View>
  );

  const currentPreviewDomain = domain ? `https://${slug}.${domain}` : `https://${slug}.example.com`;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', android: undefined })} style={{ flex: 1 }}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: C.headerBg, borderBottomColor: C.headerBorder }]}>
          <Text style={[styles.headerTitle, { color: C.headerText }]}>{t('org.createTitle', 'สร้างองค์กร')}</Text>
          <Text style={[styles.headerSub, { color: C.subtle }]}>กรอกข้อมูลองค์กรใหม่ของคุณ</Text>
        </View>

        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
          {/* Basic */}
          <Section title="ข้อมูลพื้นฐาน" emoji="🏢">
            <Field label="ชื่อองค์กร">
              <Input value={name} onChangeText={setName} placeholder="Acme Co., Ltd." />
            </Field>
            <Row2
              left={
                <Field label="Slug (โดเมนย่อย)" caption="ตัวอักษร a–z และตัวเลข, ขีดกลาง">
                  <Input
                    value={slug}
                    onFocus={() => setSlugTouched(true)}
                    onChangeText={(v) => { setSlugTouched(true); setSlug(slugify(v)); }}
                    autoCapitalize="none"
                    placeholder="acme"
                  />
                </Field>
              }
              right={
                <Field label="โดเมน (ถ้ามี)" caption="เช่น acme.com">
                  <Input value={domain} onChangeText={setDomain} autoCapitalize="none" placeholder="acme.com" />
                </Field>
              }
            />
            <View style={{ marginTop: -4, marginBottom: 6 }}>
              <Text style={{ color: C.subtle, fontSize: 12 }}>พรีวิวโดเมน: {currentPreviewDomain}</Text>
            </View>
          </Section>

          {/* Billing */}
          <Section title="ข้อมูลบิลลิง" emoji="💳">
            <Field label="Billing Email">
              <Input value={billingEmail} onChangeText={setBillingEmail} keyboardType="email-address" autoCapitalize="none" />
            </Field>
            <Row2
              left={<Field label="Billing Name"><Input value={billingName} onChangeText={setBillingName} /></Field>}
              right={<Field label="Tax ID"><Input value={taxId} onChangeText={setTaxId} keyboardType="number-pad" /></Field>}
            />
            <Field label="เบอร์โทร">
              <Input value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
            </Field>
          </Section>

          {/* Address */}
          <Section title="ที่อยู่" emoji="📍">
            <Field label="บรรทัดที่ 1"><Input value={addr.line1} onChangeText={(v) => setAddr({ ...addr, line1: v })} /></Field>
            <Field label="บรรทัดที่ 2 (ไม่บังคับ)"><Input value={addr.line2 || ''} onChangeText={(v) => setAddr({ ...addr, line2: v })} /></Field>
            <Row2
              left={<Field label="จังหวัด"><Input value={addr.state} onChangeText={(v) => setAddr({ ...addr, state: v })} /></Field>}
              right={<Field label="อำเภอ/เมือง"><Input value={addr.city} onChangeText={(v) => setAddr({ ...addr, city: v })} /></Field>}
            />
            <Row2
              left={<Field label="ไปรษณีย์"><Input value={addr.postal_code} onChangeText={(v) => setAddr({ ...addr, postal_code: v })} keyboardType="number-pad" /></Field>}
              right={<Field label="ประเทศ (ISO-2)"><Input value={addr.country} onChangeText={(v) => setAddr({ ...addr, country: v.toUpperCase() })} autoCapitalize="characters" /></Field>}
            />
          </Section>

          {/* Preferences */}
          <Section title="ภาษา & เขตเวลา" emoji="🌐">
            <Text style={[styles.subLabel, { color: C.muted, marginBottom: 6 }]}>ภาษา</Text>
            <View style={{ flexDirection: 'row', marginBottom: 12 }}>
              {LOCALE_OPTIONS.map((lc) => (
                <Chip key={lc} active={locale === lc} label={lc} onPress={() => setLocale(lc)} />
              ))}
            </View>

            <Text style={[styles.subLabel, { color: C.muted, marginBottom: 6 }]}>เขตเวลา</Text>
            <View style={{ flexDirection: 'row' }}>
              {TZ_OPTIONS.map((tz) => (
                <Chip key={tz} active={timezone === tz} label={tz} onPress={() => setTimezone(tz)} />
              ))}
            </View>
          </Section>

          {/* Members */}
          <Section title="เชิญสมาชิก (อีเมล)" emoji="👥">
            <Field label="อีเมลสมาชิก (ไม่บังคับ)" caption="หากอีเมลยังไม่มีบัญชี ระบบจะส่งคำเชิญ">
              <Input
                value={inviteEmail}
                onChangeText={setInviteEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="member@company.com"
              />
            </Field>
          </Section>

          {/* Plan */}
          <Section title="แพลน & ทดลองใช้" emoji="🎁">
            <Row2
              left={<Field label="รหัสแพลน"><Input value={planCode} onChangeText={setPlanCode} autoCapitalize="none" /></Field>}
              right={
                <View style={styles.switchRow}>
                  <Switch value={startTrial} onValueChange={setStartTrial} />
                  <Text style={{ marginLeft: 10, color: C.text }}>เริ่มทดลองใช้ 30 วัน</Text>
                </View>
              }
            />
          </Section>
        </ScrollView>

        {/* Footer actions */}
        <View style={[styles.footer, { borderTopColor: C.border, backgroundColor: C.bg }]}>
          <Pressable
            onPress={() => nav.goBack()}
            style={[styles.btn, { backgroundColor: C.ghost, borderColor: C.border }]}
          >
            <Text style={{ color: C.text, fontWeight: '700' }}>ยกเลิก</Text>
          </Pressable>
          <Pressable
            onPress={onSubmit}
            disabled={!canSubmit || submitting}
            style={[
              styles.btn,
              { backgroundColor: canSubmit && !submitting ? C.primary : C.disabled },
            ]}
          >
            {submitting ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff', fontWeight: '700' }}>สร้างองค์กร</Text>}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* -------------------- styles & palette -------------------- */
const styles = {
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 14,
    borderBottomWidth: 1,
  } as const,
  headerTitle: { fontSize: 20, fontWeight: '800' } as const,
  headerSub: { marginTop: 2, fontSize: 12 } as const,

  card: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 14,
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 1,
  } as const,
  cardTitle: { fontSize: 16, fontWeight: '700' } as const,

  label: { fontSize: 13, fontWeight: '600', marginBottom: 6 } as const,
  subLabel: { fontSize: 13, fontWeight: '600' } as const,
  caption: { fontSize: 12, marginTop: 6 },

  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
  } as const,

  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 9999,
    marginRight: 8,
    borderWidth: 1,
  } as const,

  row2: { flexDirection: 'row' } as const,

  switchRow: {
    flex: 1,
    height: 56,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  } as const,

  footer: {
    padding: 12,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 10,
  } as const,
  btn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  } as const,
};

function palette(scheme: ColorSchemeName) {
  const isDark = scheme === 'dark';
  return {
    // brand
    primary: '#0EA5E9',
    disabled: isDark ? '#1f2937' : '#93c5fd',
    // bg & surface
    bg: isDark ? '#0b1220' : '#f5f7fb',
    card: isDark ? '#0f172a' : '#ffffff',
    cardBorder: isDark ? '#1f2a44' : '#e5e7eb',
    surface: isDark ? '#0f172a' : '#ffffff',
    // text
    text: isDark ? '#e5e7eb' : '#0b1220',
    muted: isDark ? '#9aa4b2' : '#374151',
    subtle: isDark ? '#7c8aa0' : '#6b7280',
    placeholder: isDark ? '#6b7280' : '#9ca3af',
    // borders & shadows
    border: isDark ? '#1f2a44' : '#e5e7eb',
    shadow: isDark ? '#000' : '#111827',
    // header
    headerBg: isDark ? '#0b1220' : '#ffffff',
    headerText: isDark ? '#e5e7eb' : '#0b1220',
    headerBorder: isDark ? '#1f2a44' : '#e5e7eb',
    // chips
    chip: isDark ? '#111827' : '#f3f4f6',
    ghost: isDark ? '#111827' : '#f3f4f6',
  };
}
