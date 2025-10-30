// screens/UpgradePlanScreen.tsx
import React, { useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Linking,
} from 'react-native';

type BillingCycle = 'monthly' | 'yearly';
type PlanKey = 'Starter' | 'Pro' | 'Premium';

type Plan = {
  key: PlanKey;
  name: string;
  tagline: string;
  monthlyPrice: number;   // THB/เดือน
  yearlyPrice: number;    // THB/เดือน (เฉลี่ยรายเดือนหลังหักส่วนลด)
  badge?: string;         // เช่น "ยอดนิยม"
  limits: {
    members: string;
    storage: string;
    approvals: string;
  };
  features: string[];     // ใช้โชว์ bullet ในการ์ด
};

type Props = {
  currentPlan?: PlanKey;        // แผนปัจจุบันของผู้ใช้
  onUpgrade?: (plan: PlanKey, cycle: BillingCycle) => Promise<void> | void;
  onRestorePurchase?: () => Promise<void> | void;   // สำหรับ iOS (ถ้ามี In-App)
  onManageBilling?: () => void;                      // ลิงก์ไปหน้า Billing
};

const PLANS: Plan[] = [
  {
    key: 'Starter',
    name: 'Starter',
    tagline: 'เริ่มต้นใช้งานสำหรับทีมเล็ก',
    monthlyPrice: 0,
    yearlyPrice: 0,
    limits: { members: 'สูงสุด 5 คน', storage: '1 GB', approvals: '1 ขั้น' },
    features: [
      'ขอลา/อนุมัติ (พื้นฐาน)',
      'ปฏิทินทีม',
      'สรุปการลา',
    ],
  },
  {
    key: 'Pro',
    name: 'Pro',
    tagline: 'ครบขึ้นสำหรับทีมกำลังโต',
    monthlyPrice: 259,
    yearlyPrice: 199, // แสดงเป็นค่าเฉลี่ยต่อเดือนเมื่อจ่ายรายปี
    badge: 'ยอดนิยม',
    limits: { members: 'สูงสุด 20 คน', storage: '10 GB', approvals: 'หลายขั้น' },
    features: [
      'เวิร์กโฟลว์อนุมัติหลายชั้น',
      'นโยบายลา/โควต้าแยกแผนก',
      'รายงาน/Export CSV',
      'Email & In-app Notifications',
    ],
  },
  {
    key: 'Premium',
    name: 'Premium',
    tagline: 'สำหรับองค์กรจริงจังและปรับแต่งได้',
    monthlyPrice: 499,
    yearlyPrice: 399,
    limits: { members: 'ไม่จำกัด', storage: 'ไม่จำกัด*', approvals: 'ไม่จำกัดขั้น' },
    features: [
      'SLA Support',
      'SSO / SCIM (Coming soon)',
      'Audit Trail ขั้นสูง',
      'Webhook & API rate สูง',
    ],
  },
];

export default function UpgradePlanScreen({
  currentPlan = 'Starter',
  onUpgrade,
  onRestorePurchase,
  onManageBilling,
}: Props) {
  const [cycle, setCycle] = useState<BillingCycle>('monthly');
  const isYearly = cycle === 'yearly';

  const discountLabel = useMemo(() => {
    // สมมติส่วนลด 20% เมื่อเลือกแบบรายปี (ค่าที่ใส่ในแผนเป็นราคาเฉลี่ยต่อเดือนแล้ว)
    return 'ประหยัด ~20% (จ่ายรายปี)';
  }, []);

  const handleUpgrade = async (plan: PlanKey) => {
    if (onUpgrade) return onUpgrade(plan, cycle);
    // ตัวอย่างดีฟอลต์: เปิดลิงก์ไปหน้าเก็บเงิน/เช็คเอาท์
    const url = `https://app.laloei.com/checkout?plan=${plan}&cycle=${cycle}`;
    try { await Linking.openURL(url); } catch {}
  };

  return (
    <View style={S.container}>
      <ScrollView contentContainerStyle={S.scroll}>
        <HeaderSection
          cycle={cycle}
          onChangeCycle={setCycle}
          discountLabel={discountLabel}
        />

        <View style={S.cardsWrap}>
          {PLANS.map(p => (
            <PlanCard
              key={p.key}
              plan={p}
              cycle={cycle}
              isCurrent={p.key === currentPlan}
              onPress={() => handleUpgrade(p.key)}
            />
          ))}
        </View>

        <CompareStrip />

        <FAQ />

        <View style={{ height: 28 }} />

        <FooterActions
          onRestorePurchase={onRestorePurchase}
          onManageBilling={onManageBilling}
        />
      </ScrollView>
    </View>
  );
}

/* ---------- Sections ---------- */

function HeaderSection({
  cycle, onChangeCycle, discountLabel,
}: { cycle: BillingCycle; onChangeCycle: (c: BillingCycle) => void; discountLabel: string; }) {
  const isYearly = cycle === 'yearly';
  return (
    <View style={S.header}>
      <Text style={S.title}>อัปเกรดแผน</Text>
      <Text style={S.subtitle}>ปลดล็อกฟีเจอร์ระดับองค์กร เพื่อการบริหารงานที่ไหลลื่น</Text>

      <View style={S.billingToggle}>
        <TouchableOpacity
          style={[S.toggleBtn, cycle === 'monthly' && S.toggleActive]}
          onPress={() => onChangeCycle('monthly')}
        >
          <Text style={[S.toggleText, cycle === 'monthly' && S.toggleTextActive]}>รายเดือน</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[S.toggleBtn, isYearly && S.toggleActive]}
          onPress={() => onChangeCycle('yearly')}
        >
          <Text style={[S.toggleText, isYearly && S.toggleTextActive]}>รายปี</Text>
        </TouchableOpacity>
      </View>

      {isYearly && (
        <View style={S.discountPill}>
          <Text style={S.discountText}>{discountLabel}</Text>
        </View>
      )}
    </View>
  );
}

function PlanCard({
  plan, cycle, isCurrent, onPress,
}: { plan: Plan; cycle: BillingCycle; isCurrent: boolean; onPress: () => void; }) {
  const price = cycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
  const isFree = price === 0;

  return (
    <View style={[S.card, isCurrent && S.cardCurrent]}>
      <View style={S.cardHeader}>
        <View>
          <Text style={S.planName}>{plan.name}</Text>
          <Text style={S.planTag}>{plan.tagline}</Text>
        </View>
        {!!plan.badge && <View style={S.badge}><Text style={S.badgeText}>{plan.badge}</Text></View>}
      </View>

      <View style={S.priceRow}>
        {isFree ? (
          <Text style={S.priceFree}>ฟรี</Text>
        ) : (
          <>
            <Text style={S.priceNumber}>{price}</Text>
            <Text style={S.priceTail}>฿/เดือน</Text>
          </>
        )}
      </View>

      <View style={S.limitRow}>
        <LimitItem label="จำนวนสมาชิก" value={plan.limits.members} />
        <LimitItem label="พื้นที่จัดเก็บ" value={plan.limits.storage} />
        <LimitItem label="อนุมัติ" value={plan.limits.approvals} />
      </View>

      <View style={S.divider} />

      <View style={{ gap: 8 }}>
        {plan.features.map((f, i) => (
          <View key={i} style={S.featureRow}>
            <View style={S.bullet} />
            <Text style={S.featureText}>{f}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        disabled={isCurrent}
        style={[S.primaryBtn, isCurrent && S.btnDisabled]}
        onPress={onPress}
      >
        <Text style={[S.primaryBtnText, isCurrent && S.primaryBtnTextDim]}>
          {isCurrent ? 'แผนปัจจุบัน' : 'อัปเกรดแผนนี้'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function LimitItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={S.limitValue}>{value}</Text>
      <Text style={S.limitLabel}>{label}</Text>
    </View>
  );
}

function CompareStrip() {
  return (
    <View style={S.compareWrap}>
      <Text style={S.compareTitle}>สรุปความต่างแบบย่อ</Text>
      <View style={S.compareRow}>
        <Text style={S.compareKey}>เวิร์กโฟลว์หลายชั้น</Text>
        <Text style={S.compareVal}>Starter: —  •  Pro: ✔︎  •  Premium: ✔︎</Text>
      </View>
      <View style={S.compareRow}>
        <Text style={S.compareKey}>สมาชิกสูงสุด</Text>
        <Text style={S.compareVal}>Starter: 5  •  Pro: 50  •  Premium: ไม่จำกัด</Text>
      </View>
      <View style={S.compareRow}>
        <Text style={S.compareKey}>พื้นที่จัดเก็บ</Text>
        <Text style={S.compareVal}>1 GB  •  20 GB  •  ไม่จำกัด*</Text>
      </View>
      <Text style={S.compareFoot}>* พื้นที่แบบยืดหยุ่นตามนโยบายที่กำหนด</Text>
    </View>
  );
}

function FAQ() {
  const [open, setOpen] = useState<string | null>(null);
  const toggle = (k: string) => setOpen(prev => (prev === k ? null : k));
  const QA = [
    {
      k: 'bill',
      q: 'คิดค่าบริการอย่างไร?',
      a: 'รายเดือนยกเลิกได้ทุกเมื่อ รายปีคิดล่วงหน้าพร้อมส่วนลด ~20% จากราคารายเดือน (แสดงเป็นค่าเฉลี่ย/เดือน).',
    },
    {
      k: 'change',
      q: 'สลับแผนได้ไหม?',
      a: 'อัปเกรดได้ทันทีและจะมีผลทันที ดาวน์เกรดจะมีผลรอบบิลถัดไป.',
    },
    {
      k: 'pay',
      q: 'รองรับการชำระเงินแบบใด?',
      a: 'บัตรเครดิต/เดบิต และใบแจ้งหนี้สำหรับองค์กร (Premium).',
    },
  ];

  return (
    <View style={S.faqWrap}>
      <Text style={S.faqTitle}>คำถามที่พบบ่อย</Text>
      {QA.map(item => {
        const isOpen = open === item.k;
        return (
          <View style={S.faqItem} key={item.k}>
            <TouchableOpacity onPress={() => toggle(item.k)} style={S.faqQ}>
              <Text style={S.faqQText}>{item.q}</Text>
              <Text style={S.faqQIcon}>{isOpen ? '–' : '+'}</Text>
            </TouchableOpacity>
            {isOpen && <Text style={S.faqAText}>{item.a}</Text>}
          </View>
        );
      })}
    </View>
  );
}

function FooterActions({
  onRestorePurchase,
  onManageBilling,
}: { onRestorePurchase?: () => void; onManageBilling?: () => void; }) {
  return (
    <View style={S.footer}>
      {Platform.OS === 'ios' && (
        <TouchableOpacity style={S.linkBtn} onPress={onRestorePurchase}>
          <Text style={S.linkText}>กู้คืนการซื้อ (iOS)</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={S.linkBtn}
        onPress={onManageBilling ?? (() => Linking.openURL('https://app.laloei.com/billing'))}
      >
        <Text style={S.linkText}>จัดการการเรียกเก็บเงิน</Text>
      </TouchableOpacity>
      <Text style={S.legal}>
        โดยการอัปเกรด คุณยอมรับ <Text style={S.legalLink} onPress={() => Linking.openURL('https://laloei.com/terms')}>เงื่อนไขการใช้บริการ</Text> และ <Text style={S.legalLink} onPress={() => Linking.openURL('https://laloei.com/privacy')}>นโยบายความเป็นส่วนตัว</Text>
      </Text>
    </View>
  );
}

/* ---------- Styles ---------- */

const P = 16;
const R = 18;

const S = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6FAFF' },
  scroll: { padding: P },
  header: { alignItems: 'center', marginBottom: 14 },
  title: { fontSize: 22, fontWeight: '800', color: '#0F172A' },
  subtitle: { marginTop: 6, fontSize: 13, color: '#475569', textAlign: 'center' },

  billingToggle: {
    flexDirection: 'row',
    backgroundColor: '#EAF2FF',
    padding: 6,
    borderRadius: 999,
    marginTop: 12,
  },
  toggleBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
  },
  toggleActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 5,
    elevation: 2,
  },
  toggleText: { fontSize: 13, color: '#334155' },
  toggleTextActive: { color: '#0EA5E9', fontWeight: '700' },

  discountPill: {
    marginTop: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#DFF7E7',
    borderRadius: 999,
  },
  discountText: { color: '#08966E', fontWeight: '700', fontSize: 12 },

  cardsWrap: { gap: 14, marginTop: 12 },

  card: {
    borderRadius: R,
    backgroundColor: '#FFFFFF',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  cardCurrent: {
    borderWidth: 1.5,
    borderColor: '#A5B4FC',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  planName: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
  planTag: { marginTop: 2, fontSize: 12, color: '#64748B' },
  badge: { backgroundColor: '#EEF2FF', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 999 },
  badgeText: { color: '#4F46E5', fontWeight: '700', fontSize: 12 },

  priceRow: { flexDirection: 'row', alignItems: 'flex-end', marginVertical: 8 },
  priceFree: { fontSize: 26, fontWeight: '800', color: '#0EA5E9' },
  priceNumber: { fontSize: 28, fontWeight: '900', color: '#0EA5E9' },
  priceTail: { marginLeft: 6, fontSize: 12, color: '#64748B', paddingBottom: 4 },

  limitRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6, marginBottom: 10 },
  limitValue: { fontSize: 13, fontWeight: '700', color: '#111827' },
  limitLabel: { fontSize: 11, color: '#6B7280', marginTop: 2 },

  divider: { height: 1, backgroundColor: '#EEF2F7', marginVertical: 10 },

  featureRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  bullet: { width: 6, height: 6, borderRadius: 6, backgroundColor: '#22C55E', marginTop: 6 },
  featureText: { fontSize: 13, color: '#0F172A', flex: 1 },

  primaryBtn: {
    marginTop: 14,
    backgroundColor: '#0EA5E9',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryBtnText: { color: 'white', fontWeight: '800', fontSize: 15 },
  btnDisabled: { backgroundColor: '#E2E8F0' },
  primaryBtnTextDim: { color: '#64748B' },

  compareWrap: {
    marginTop: 18,
    backgroundColor: '#F0F9FF',
    borderRadius: R,
    padding: 14,
  },
  compareTitle: { fontWeight: '800', color: '#0F172A', marginBottom: 8 },
  compareRow: { flexDirection: 'column', marginBottom: 6 },
  compareKey: { fontSize: 12, color: '#475569', marginBottom: 2 },
  compareVal: { fontSize: 13, color: '#0F172A', fontWeight: '600' },
  compareFoot: { fontSize: 11, color: '#64748B', marginTop: 8 },

  faqWrap: { marginTop: 18, backgroundColor: '#FFFFFF', borderRadius: R, padding: 14 },
  faqTitle: { fontWeight: '800', color: '#0F172A', marginBottom: 6 },
  faqItem: { borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  faqQ: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  faqQText: { fontWeight: '700', color: '#0F172A' },
  faqQIcon: { fontSize: 18, color: '#64748B', paddingHorizontal: 6 },
  faqAText: { color: '#475569', paddingBottom: 12 },

  footer: { alignItems: 'center', marginTop: 16, marginBottom: 12 },
  linkBtn: { paddingVertical: 8, paddingHorizontal: 12 },
  linkText: { color: '#0284C7', fontWeight: '700' },
  legal: { marginTop: 6, fontSize: 11, color: '#64748B', textAlign: 'center', paddingHorizontal: 8 },
  legalLink: { textDecorationLine: 'underline', color: '#0284C7' },
});
