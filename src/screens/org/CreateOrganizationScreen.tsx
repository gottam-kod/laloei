// screens/org/CreateOrganizationScreen.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FormScreen from '@/src/components/FormScreen';
import { Field, Row2, Divider, TogglePill } from '@/src/components/FormBits';
import { createOrganization } from '@/src/connections/auth/orgApi';
import { useAuthStore } from '@/src/store/useAuthStore';
import { AuthStackParamList } from '@/src/navigation/RootStackParamList';

type Address = { line1: string; line2?: string; city: string; state: string; postal_code: string; country: string; };
const TZ_OPTIONS = ['Asia/Bangkok'] as const;
const LOCALE_OPTIONS = ['th-TH', 'en-US'] as const;

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '').slice(0, 50);

export default function CreateOrganizationScreen() {
  const nav = useNavigation<NavigationProp<AuthStackParamList>>();

  // form state (เรียบง่ายเหมือน register)
  const [name, setName] = useState('laloei Co., Ltd.');
  const [slug, setSlug] = useState('laloei');
  const [slugTouched, setSlugTouched] = useState(false);
  const [domain, setDomain] = useState('laloei.com');

  const [billingEmail, setBillingEmail] = useState('billing@qlaloei.com');
  const [billingName, setBillingName] = useState('laloei Co., Ltd.');
  const [taxId, setTaxId] = useState('0105551234567');
  const [phone, setPhone] = useState('+66912345678');

  const [addr, setAddr] = useState<Address>({
    line1: '123/45 ซอยสุขสบาย',
    line2: 'แขวง/ตำบล สุขใจ',
    city: 'กรุงเทพมหานคร',
    state: 'กรุงเทพมหานคร',
    postal_code: '10240',
    country: 'TH',
  });

  const [timezone, setTimezone] = useState<(typeof TZ_OPTIONS)[number]>('Asia/Bangkok');
  const [locale, setLocale] = useState<(typeof LOCALE_OPTIONS)[number]>('th-TH');

  const [inviteEmail, setInviteEmail] = useState('member@laloei.com');
  const [planCode, setPlanCode] = useState('pro');
  const [startTrial, setStartTrial] = useState(true);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // auto-slug (เฉพาะตอนยังไม่แตะเอง)
  useEffect(() => { if (!slugTouched) setSlug(slugify(name || '')); }, [name, slugTouched]);

  const emailOk = useMemo(() => /\S+@\S+\.\S+/.test(billingEmail.trim().toLowerCase()), [billingEmail]);
  const canSubmit = name.trim().length > 2 && slug.trim().length > 2 && emailOk && !loading;

  const domainPreview = domain ? `https://${slug}.${domain}` : `https://${slug}.example.com`;

  const onSubmit = async () => {
    if (!canSubmit) return;
    const profile = useAuthStore.getState().profile;
    if (!profile?.id) { setErr('โปรดล็อกอินก่อน'); return; }
    setErr(null);
    try {
      setLoading(true);
      await createOrganization({
        name: name.trim(),
        slug: slugify(slug.trim()),  // slugify ตอนส่ง เท่านั้น
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
        members: inviteEmail ? [{ email: inviteEmail.trim(), role: 'member' as const }] : [],
        plan_code: planCode,
        start_trial: startTrial,
        owner_user_id: profile.id,
      });
      nav.goBack();
    } catch (e: any) {
      setErr(String(e?.response?.data?.message ?? e?.message ?? 'Create org failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormScreen title="สร้างองค์กรใหม่" subtitle="ตั้งค่าองค์กร, บิลลิง, และสมาชิกเริ่มต้น">
      {/* Basic */}
      <Field
        iconLeft={<Ionicons name="business-outline" size={20} color="#9AA3AF" />}
        placeholder="ชื่อองค์กร"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
        returnKeyType="next"
      />
      <Row2
        left={
          <Field
            iconLeft={<MaterialCommunityIcons name="web" size={20} color="#9AA3AF" />}
            placeholder="slug (a-z, 0-9, -)"
            value={slug}
            onFocus={() => setSlugTouched(true)}
            onChangeText={setSlug}        // ไม่แปลงระหว่างพิมพ์
            autoCapitalize="none"
            returnKeyType="next"
          />
        }
        right={
          <Field
            iconLeft={<MaterialCommunityIcons name="domain" size={20} color="#9AA3AF" />}
            placeholder="โดเมน (ถ้ามี) เช่น acme.com"
            value={domain}
            onChangeText={setDomain}
            autoCapitalize="none"
            returnKeyType="next"
          />
        }
      />
      <Text style={{ color: '#6B7280', marginTop: 6, fontSize: 12 }}>พรีวิวโดเมน: {domainPreview}</Text>

      {/* Billing */}
      <Divider title="ข้อมูลบิลลิง" />
      <Field
        iconLeft={<Ionicons name="mail-outline" size={20} color="#9AA3AF" />}
        placeholder="Billing email"
        value={billingEmail}
        onChangeText={setBillingEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <Row2
        left={
          <Field
            iconLeft={<Ionicons name="person-outline" size={20} color="#9AA3AF" />}
            placeholder="Billing name"
            value={billingName}
            onChangeText={setBillingName}
            autoCapitalize="words"
          />
        }
        right={
          <Field
            iconLeft={<Ionicons name="document-text-outline" size={20} color="#9AA3AF" />}
            placeholder="Tax ID"
            value={taxId}
            onChangeText={setTaxId}
            keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
          />
        }
      />
      <Field
        iconLeft={<Ionicons name="call-outline" size={20} color="#9AA3AF" />}
        placeholder="เบอร์โทร"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      {/* Address */}
      <Divider title="ที่อยู่" />
      <Field placeholder="บรรทัดที่ 1" value={addr.line1} onChangeText={(v) => setAddr({ ...addr, line1: v })} />
      <Field placeholder="บรรทัดที่ 2 (ไม่บังคับ)" value={addr.line2 || ''} onChangeText={(v) => setAddr({ ...addr, line2: v })} />
      <Row2
        left={<Field placeholder="จังหวัด" value={addr.state} onChangeText={(v) => setAddr({ ...addr, state: v })} />}
        right={<Field placeholder="อำเภอ/เมือง" value={addr.city} onChangeText={(v) => setAddr({ ...addr, city: v })} />}
      />
      <Row2
        left={
          <Field
            placeholder="ไปรษณีย์"
            value={addr.postal_code}
            onChangeText={(v) => setAddr({ ...addr, postal_code: v })}
            keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
          />
        }
        right={
          <Field
            placeholder="ประเทศ (ISO-2)"
            value={addr.country}
            onChangeText={(v) => setAddr({ ...addr, country: v.toUpperCase() })}
            autoCapitalize="characters"
          />
        }
      />

      {/* Prefs */}
      <Divider title="ภาษา & เขตเวลา" />
      <Row2
        left={<TogglePill active={locale === 'th-TH'} label="th-TH" onPress={() => setLocale('th-TH')} />}
        right={<TogglePill active={locale === 'en-US'} label="en-US" onPress={() => setLocale('en-US')} />}
      />
      <View style={{ height: 10 }} />
      <Row2
        left={<TogglePill active={timezone === 'Asia/Bangkok'} label="Asia/Bangkok" onPress={() => setTimezone('Asia/Bangkok')} />}
        right={<View />}
      />

      {/* Members & Plan */}
      <Divider title="สมาชิก & แพลน" />
      <Field
        iconLeft={<Ionicons name="person-add-outline" size={20} color="#9AA3AF" />}
        placeholder="อีเมลสมาชิก (ไม่บังคับ)"
        value={inviteEmail}
        onChangeText={setInviteEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <Row2
        left={
          <Field
            iconLeft={<MaterialCommunityIcons name="tag-outline" size={20} color="#9AA3AF" />}
            placeholder="รหัสแพลน เช่น pro"
            value={planCode}
            onChangeText={setPlanCode}
            autoCapitalize="none"
          />
        }
        right={<TogglePill active={startTrial} label={startTrial ? 'ทดลองใช้: เปิด' : 'ทดลองใช้: ปิด'} onPress={() => setStartTrial((v) => !v)} />}
      />

      {err && <Text style={{ color: '#D92D20', marginTop: 10 }}>{err}</Text>}

      {/* CTA */}
      <TouchableOpacity
        activeOpacity={0.9}
        disabled={!canSubmit}
        onPress={onSubmit}
        style={[styles.btnShadow, { marginTop: 14 }]}
      >
        <View style={styles.btnPrimary}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnPrimaryText}>สร้างองค์กร</Text>}
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => nav.goBack()} style={{ marginTop: 12 }}>
        <Text style={{ textAlign: 'center', color: '#6B7280' }}>ยกเลิก</Text>
      </TouchableOpacity>
    </FormScreen>
  );
}

const styles = StyleSheet.create({
  btnPrimary: {
    height: 54, borderRadius: 16, alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#0EA5E9',
  },
  btnPrimaryText: { color: '#fff', fontSize: 16, fontWeight: '900', letterSpacing: 0.3 },
  btnShadow: {
    shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 }, elevation: 2,
  },
});
