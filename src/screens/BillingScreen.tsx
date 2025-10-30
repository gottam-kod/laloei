// screens/BillingScreen.tsx
import React, { useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert,
} from 'react-native';

type Currency = 'THB';
type InvoiceStatus = 'open' | 'paid' | 'void';
type PaymentMethodType = 'card' | 'promptpay' | 'bank';

type Invoice = {
  id: string;
  number: string;
  date: string;            // YYYY-MM-DD
  dueDate?: string;        // YYYY-MM-DD
  amount: number;          // in currency unit
  currency: Currency;
  status: InvoiceStatus;
  invoiceUrl?: string;     // ไฟล์ PDF ใบแจ้งหนี้
  receiptUrl?: string;     // ไฟล์ PDF ใบเสร็จ
};

type PaymentMethod = {
  id: string;
  type: PaymentMethodType;
  brand?: string;          // 'Visa','Mastercard' (สำหรับ card)
  last4?: string;          // '4242'
  promptpayRef?: string;   // สำหรับ promptpay
  bankName?: string;       // สำหรับ bank
  isDefault?: boolean;
};

type Props = {
  orgName?: string;
  planName?: string;
  nextBillingDate?: string;     // YYYY-MM-DD
  billingCycle?: 'monthly' | 'yearly';
  amountDue?: number;           // ยอดที่ต้องชำระตอนนี้ (ถ้ามี)
  currency?: Currency;
  upcomingInvoice?: Invoice | null;
  invoices?: Invoice[];
  paymentMethods?: PaymentMethod[];
  billingAddress?: {
    company?: string;
    taxId?: string;
    line1?: string;
    line2?: string;
    district?: string;
    province?: string;
    zipcode?: string;
    country?: string;
  };

  // Handlers สำหรับเชื่อมต่อ Backend/Payment Gateway จริง
  onPayNow?: (invoiceId?: string) => Promise<void> | void;
  onDownloadInvoice?: (invoiceId: string, url?: string) => Promise<void> | void;
  onDownloadReceipt?: (invoiceId: string, url?: string) => Promise<void> | void;
  onAddPaymentMethod?: () => Promise<void> | void;
  onDeletePaymentMethod?: (pmId: string) => Promise<void> | void;
  onSetDefaultPaymentMethod?: (pmId: string) => Promise<void> | void;
  onEditBillingAddress?: () => void;
  onOpenBillingPortal?: () => void; // Stripe/Omise Billing Portal
};

const MOCK_INVOICES: Invoice[] = [
  { id: 'inv_001', number: 'INV-2025-0001', date: '2025-09-22', amount: 249, currency: 'THB', status: 'paid', receiptUrl: 'https://example.com/receipt/INV-2025-0001.pdf' },
  { id: 'inv_002', number: 'INV-2025-0002', date: '2025-10-22', amount: 249, currency: 'THB', status: 'open', invoiceUrl: 'https://example.com/invoice/INV-2025-0002.pdf' },
];

const MOCK_PMS: PaymentMethod[] = [
  { id: 'pm_visa4242', type: 'card', brand: 'Visa', last4: '4242', isDefault: true },
  { id: 'pm_promptpay', type: 'promptpay', promptpayRef: '081-xxx-1234' },
];

export default function BillingScreen({
  orgName = 'Laloei Co., Ltd.',
  planName = 'Pro',
  nextBillingDate = '2025-11-22',
  billingCycle = 'monthly',
  amountDue = 259,
  currency = 'THB',
  upcomingInvoice = { ...MOCK_INVOICES[1] },
  invoices = MOCK_INVOICES,
  paymentMethods = MOCK_PMS,
  billingAddress = {
    company: 'Laloei Co., Ltd.',
    taxId: '0105559999999',
    line1: '12/1 หมู่ 3 ต.บัวคำ',
    line2: 'อ.โพธิ์ชัย',
    district: 'โพธิ์ชัย',
    province: 'ร้อยเอ็ด',
    zipcode: '45230',
    country: 'TH',
  },
  onPayNow,
  onDownloadInvoice,
  onDownloadReceipt,
  onAddPaymentMethod,
  onDeletePaymentMethod,
  onSetDefaultPaymentMethod,
  onEditBillingAddress,
  onOpenBillingPortal,
}: Props) {
  const hasAmountDue = (amountDue ?? 0) > 0;

  const titleAmount = useMemo(() => {
    const v = (amountDue ?? 0).toLocaleString('th-TH', { maximumFractionDigits: 0 });
    return `${v} ${currency}`;
  }, [amountDue, currency]);

  const handlePayNow = async () => {
    if (onPayNow) return onPayNow(upcomingInvoice?.id);
    Alert.alert('ชำระเงิน', 'เชื่อมต่อเกตเวย์เพื่อชำระบิล');
  };

  const handleOpenUrl = async (url?: string) => {
    if (!url) return;
    try { await Linking.openURL(url); } catch {}
  };

  return (
    <View style={S.container}>
      <ScrollView contentContainerStyle={S.scroll}>
        {/* สรุปสถานะ */}
        <View style={S.header}>
          <Text style={S.title}>บิล & การชำระเงิน</Text>
          <Text style={S.subtitle}>
            องค์กร: {orgName}  •  แผนปัจจุบัน: {planName} ({billingCycle === 'monthly' ? 'รายเดือน' : 'รายปี'})
          </Text>
        </View>

        {/* กล่องยอดที่ต้องชำระ */}
        <View style={S.cardDue}>
          <View style={{ flex: 1 }}>
            <Text style={S.dueLabel}>ยอดที่ต้องชำระ</Text>
            <Text style={S.dueAmount}>{hasAmountDue ? titleAmount : '—'}</Text>
            <Text style={S.dueSub}>
              รอบบิลถัดไป: {nextBillingDate}
              {upcomingInvoice?.number ? `  •  ใบแจ้งหนี้: ${upcomingInvoice.number}` : ''}
            </Text>
          </View>
          <TouchableOpacity
            style={[S.payBtn, !hasAmountDue && S.btnDisabled]}
            disabled={!hasAmountDue}
            onPress={handlePayNow}
          >
            <Text style={[S.payBtnText, !hasAmountDue && S.payBtnTextDim]}>
              {hasAmountDue ? 'ชำระตอนนี้' : 'ไม่มีรายการค้างชำระ'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* วิธีชำระเงิน */}
        <View style={S.section}>
          <Text style={S.sectionTitle}>วิธีชำระเงิน</Text>

          {paymentMethods.map((pm) => (
            <View key={pm.id} style={S.pmRow}>
              <View style={{ flex: 1 }}>
                <Text style={S.pmMain}>
                  {pm.type === 'card' && `${pm.brand ?? 'Card'} •••• ${pm.last4}`}
                  {pm.type === 'promptpay' && `PromptPay • ${pm.promptpayRef}`}
                  {pm.type === 'bank' && `บัญชีธนาคาร • ${pm.bankName ?? '-'}`}
                </Text>
                <Text style={S.pmSub}>{pm.isDefault ? 'ค่าเริ่มต้น' : '—'}</Text>
              </View>

              {!pm.isDefault && (
                <TouchableOpacity
                  style={S.pmBtn}
                  onPress={() => onSetDefaultPaymentMethod?.(pm.id)}
                >
                  <Text style={S.pmBtnText}>ตั้งเป็นค่าเริ่มต้น</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[S.pmBtn, { marginLeft: 8 }]}
                onPress={() => onDeletePaymentMethod?.(pm.id)}
              >
                <Text style={S.pmBtnText}>ลบ</Text>
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity style={S.addPmBtn} onPress={() => onAddPaymentMethod?.()}>
            <Text style={S.addPmText}>+ เพิ่มวิธีชำระเงิน</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={S.portalBtn}
            onPress={() => onOpenBillingPortal?.() ?? Linking.openURL('https://app.laloei.com/billing/portal')}
          >
            <Text style={S.portalText}>เปิดพอร์ทัลการเรียกเก็บเงิน</Text>
          </TouchableOpacity>
        </View>

        {/* ที่อยู่ใบกำกับภาษี/วางบิล */}
        <View style={S.section}>
          <Text style={S.sectionTitle}>ที่อยู่สำหรับวางบิล</Text>
          <Text style={S.addrText}>
            {billingAddress.company}{billingAddress.taxId ? `  (เลขผู้เสียภาษี: ${billingAddress.taxId})` : ''}
            {'\n'}{billingAddress.line1}
            {billingAddress.line2 ? `, ${billingAddress.line2}` : ''}
            {'\n'}{billingAddress.district}, {billingAddress.province} {billingAddress.zipcode}
            {'\n'}{billingAddress.country}
          </Text>
          <TouchableOpacity style={S.linkBtn} onPress={onEditBillingAddress}>
            <Text style={S.linkText}>แก้ไขที่อยู่</Text>
          </TouchableOpacity>
        </View>

        {/* ประวัติบิล */}
        <View style={S.section}>
          <Text style={S.sectionTitle}>ประวัติบิล</Text>

          {invoices.map((inv) => (
            <View key={inv.id} style={S.invRow}>
              <View style={{ flex: 1 }}>
                <Text style={S.invMain}>
                  {inv.number} • {formatTHBCurrency(inv.amount, inv.currency)}
                </Text>
                <Text style={S.invSub}>
                  ออกบิล: {inv.date}  {inv.dueDate ? `• กำหนดชำระ: ${inv.dueDate}` : ''}  • สถานะ: {statusText(inv.status)}
                </Text>
              </View>

              {/* ปุ่มย่อ */}
              {inv.status === 'open' && (
                <TouchableOpacity
                  style={S.invBtn}
                  onPress={() => onPayNow?.(inv.id)}
                >
                  <Text style={S.invBtnText}>ชำระ</Text>
                </TouchableOpacity>
              )}

              {!!inv.invoiceUrl && (
                <TouchableOpacity
                  style={[S.invBtn, { marginLeft: 8 }]}
                  onPress={() => onDownloadInvoice?.(inv.id, inv.invoiceUrl) ?? handleOpenUrl(inv.invoiceUrl)}
                >
                  <Text style={S.invBtnText}>ใบแจ้งหนี้</Text>
                </TouchableOpacity>
              )}

              {!!inv.receiptUrl && (
                <TouchableOpacity
                  style={[S.invBtn, { marginLeft: 8 }]}
                  onPress={() => onDownloadReceipt?.(inv.id, inv.receiptUrl) ?? handleOpenUrl(inv.receiptUrl)}
                >
                  <Text style={S.invBtnText}>ใบเสร็จ</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        <View style={{ height: 28 }} />
      </ScrollView>
    </View>
  );
}

/* -------- Helpers -------- */
function formatTHBCurrency(amount: number, currency: Currency) {
  const v = amount.toLocaleString('th-TH', { maximumFractionDigits: 0 });
  return `${v} ${currency}`;
}
function statusText(s: InvoiceStatus) {
  if (s === 'paid') return 'ชำระแล้ว';
  if (s === 'open') return 'ค้างชำระ';
  return 'ยกเลิก';
}

/* -------- Styles -------- */
const R = 18;
const P = 16;

const S = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6FAFF' },
  scroll: { padding: P },

  header: { marginBottom: 10 },
  title: { fontSize: 22, fontWeight: '800', color: '#0F172A' },
  subtitle: { marginTop: 6, fontSize: 13, color: '#475569' },

  cardDue: {
    backgroundColor: '#FFFFFF',
    borderRadius: R,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E8F0FF',
  },
  dueLabel: { color: '#475569', fontSize: 12 },
  dueAmount: { marginTop: 2, fontSize: 28, fontWeight: '900', color: '#0EA5E9' },
  dueSub: { marginTop: 6, fontSize: 12, color: '#64748B' },

  payBtn: {
    backgroundColor: '#0EA5E9',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  payBtnText: { color: 'white', fontWeight: '800' },
  btnDisabled: { backgroundColor: '#E2E8F0' },
  payBtnTextDim: { color: '#64748B' },

  section: { marginTop: 16, backgroundColor: '#FFFFFF', borderRadius: R, padding: 14 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A', marginBottom: 10 },

  pmRow: {
    borderWidth: 1,
    borderColor: '#EEF2F7',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#FBFEFF',
    flexDirection: 'row',
    alignItems: 'center',
  },
  pmMain: { color: '#0F172A', fontWeight: '700' },
  pmSub: { color: '#64748B', fontSize: 12, marginTop: 2 },
  pmBtn: {
    backgroundColor: '#EEF2FF',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  pmBtnText: { color: '#4F46E5', fontWeight: '700', fontSize: 12 },

  addPmBtn: {
    marginTop: 6,
    backgroundColor: '#DFF7E7',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  addPmText: { color: '#08966E', fontWeight: '800' },

  portalBtn: { marginTop: 10, alignItems: 'center' },
  portalText: { color: '#0284C7', fontWeight: '800', textDecorationLine: 'underline' },

  addrText: { color: '#0F172A', lineHeight: 20 },

  linkBtn: { marginTop: 8, alignSelf: 'flex-start' },
  linkText: { color: '#0284C7', fontWeight: '700', textDecorationLine: 'underline' },

  invRow: {
    borderWidth: 1,
    borderColor: '#EEF2F7',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
  },
  invMain: { color: '#0F172A', fontWeight: '800' },
  invSub: { color: '#64748B', fontSize: 12, marginTop: 2 },
  invBtn: {
    backgroundColor: '#F0F9FF',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  invBtnText: { color: '#0369A1', fontWeight: '700', fontSize: 12 },
});
