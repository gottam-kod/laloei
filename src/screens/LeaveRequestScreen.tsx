// screens/LeaveRequestBeautiful.tsx
import React, { useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, Platform, StatusBar,
  TouchableOpacity, TextInput, ScrollView, StyleProp, ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import useSafeGoBack from '../navigation/useSafeGoBack';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/RootStackParamList';

type Props = {
  onBack?: () => void;
  onSubmit?: (data: LeaveFormData) => void;
};

type LeaveType = 'ลาป่วย' | 'ลากิจ' | 'ลาพักผ่อน' | 'อื่น ๆ';

type LeaveFormData = {
  type: LeaveType | null;
  reason: string;
  startDate: Date;
  endDate: Date;
  halfDay: boolean;
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
  success:'#20C997',
};

const SHADOW: StyleProp<ViewStyle> = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  android: { elevation: 4 },
}) as any;

const TYPES: LeaveType[] = ['ลาป่วย', 'ลากิจ', 'ลาพักผ่อน', 'อื่น ๆ'];

const LeaveRequest: React.FC<Props> = ({ onSubmit }) => {
  const [form, setForm] = useState<LeaveFormData>({
    type: null,
    reason: '',
    startDate: new Date(),
    endDate: new Date(),
    halfDay: false,
  });

    const nav = useNavigation<NavigationProp<RootStackParamList>>();
    const safeGoBack = useSafeGoBack(nav);
  
  
  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);

  const setField = <K extends keyof LeaveFormData>(key: K, value: LeaveFormData[K]) =>
    setForm(prev => ({ ...prev, [key]: value }));

  // คำนวณจำนวนวัน (รวมปลายทาง) + ครึ่งวัน
  const totalDays = useMemo(() => {
    const s = new Date(form.startDate.getFullYear(), form.startDate.getMonth(), form.startDate.getDate());
    const e = new Date(form.endDate.getFullYear(), form.endDate.getMonth(), form.endDate.getDate());
    const diff = Math.max(0, Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24))) + 1;
    const days = form.halfDay ? Math.max(0.5, diff - 0.5) : diff;
    return days;
  }, [form.startDate, form.endDate, form.halfDay]);

  const isValid = form.type && form.reason.trim().length > 0 && totalDays > 0;

  const quickSet = (kind: 'today' | 'tomorrow' | 'thisWeek') => {
    const now = new Date();
    if (kind === 'today') setField('startDate', now), setField('endDate', now);
    if (kind === 'tomorrow') {
      const t = new Date(now); t.setDate(t.getDate() + 1);
      setField('startDate', t); setField('endDate', t);
    }
    if (kind === 'thisWeek') {
      const start = new Date(now); const end = new Date(now);
      const day = start.getDay(); // 0=Sun
      const toSun = 7 - day; // เหลือถึงอาทิตย์
      end.setDate(end.getDate() + toSun);
      setField('startDate', start); setField('endDate', end);
    }
  };

  const submit = () => {
    if (!isValid) return;
    onSubmit?.(form);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F7FAFD' }}>
      <StatusBar barStyle="dark-content" />

      {/* HEADER (gradient เป็นพื้นหลัง) */}
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={[COLOR.bgTopA, COLOR.bgTopB]}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => safeGoBack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={styles.back} >{'‹'}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>ขอลา</Text>
          <View style={{ width: 24 }} />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
        {/* การ์ดเลือกประเภท */}
        <View style={[styles.card, SHADOW]}>
          <Text style={styles.sectionTitle}>ประเภทการลา</Text>
          <View style={styles.chipsRow}>
            {TYPES.map((t) => {
              const active = form.type === t;
              return (
                <TouchableOpacity
                  key={t}
                  onPress={() => setField('type', t)}
                  activeOpacity={0.9}
                  style={[styles.chip, active && styles.chipActive]}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{t}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* การ์ดช่วงวัน */}
        <View style={[styles.card, SHADOW]}>
          <Text style={styles.sectionTitle}>ช่วงวันที่</Text>

          {/* ปุ่มเร็ว */}
          <View style={styles.quickRow}>
            <QuickBtn label="วันนี้"  onPress={() => quickSet('today')}  />
            <QuickBtn label="พรุ่งนี้" onPress={() => quickSet('tomorrow')} />
            <QuickBtn label="สัปดาห์นี้" onPress={() => quickSet('thisWeek')} />
          </View>

          {/* Start */}
          <Text style={styles.label}>วันที่เริ่มต้น</Text>
          <TouchableOpacity onPress={() => setShowStart(true)} activeOpacity={0.85} style={styles.inputBtn}>
            <Text style={styles.inputBtnText}>{form.startDate.toLocaleDateString()}</Text>
            <Text style={styles.chev}>›</Text>
          </TouchableOpacity>
          {showStart && (
            <DateTimePicker
              value={form.startDate}
              mode="date"
              display="default"
              onChange={(e, d) => { setShowStart(false); if (d) setField('startDate', d); }}
            />
          )}

          {/* End */}
          <Text style={[styles.label, { marginTop: 12 }]}>วันที่สิ้นสุด</Text>
          <TouchableOpacity onPress={() => setShowEnd(true)} activeOpacity={0.85} style={styles.inputBtn}>
            <Text style={styles.inputBtnText}>{form.endDate.toLocaleDateString()}</Text>
            <Text style={styles.chev}>›</Text>
          </TouchableOpacity>
          {showEnd && (
            <DateTimePicker
              value={form.endDate}
              mode="date"
              display="default"
              onChange={(e, d) => { setShowEnd(false); if (d) setField('endDate', d); }}
            />
          )}

          {/* Half-day */}
          <TouchableOpacity
            onPress={() => setField('halfDay', !form.halfDay)}
            activeOpacity={0.8}
            style={styles.toggle}
          >
            <View style={[styles.toggleDot, form.halfDay && styles.toggleDotOn]} />
            <Text style={styles.toggleLabel}>ลาแบบครึ่งวัน</Text>
          </TouchableOpacity>
        </View>

        {/* การ์ดเหตุผล */}
        <View style={[styles.card, SHADOW]}>
          <Text style={styles.sectionTitle}>เหตุผล</Text>
          <TextInput
            style={styles.textArea}
            placeholder="กรอกเหตุผลการลา..."
            multiline
            value={form.reason}
            onChangeText={(t) => setField('reason', t)}
          />
        </View>

        {/* การ์ดสรุป */}
        <View style={[styles.card, SHADOW, { paddingVertical: 14 }]}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>รวมวันลา</Text>
            <Text style={styles.summaryValue}>
              {totalDays} <Text style={{ fontSize: 13, color: COLOR.dim }}>วัน</Text>
            </Text>
          </View>
          {!!form.type && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>ประเภท</Text>
              <Text style={styles.summaryValueSmall}>{form.type}</Text>
            </View>
          )}
        </View>

        {/* ปุ่มส่ง */}
        <TouchableOpacity
          style={[styles.submitBtn, !isValid && { opacity: 0.5 }]}
          onPress={submit}
          disabled={!isValid}
          activeOpacity={0.9}
        >
          <Text style={styles.submitText}>ส่งคำขอ</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default LeaveRequest;

/* ----------------- Sub ----------------- */
const QuickBtn: React.FC<{ label: string; onPress: () => void }> = ({ label, onPress }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={quickStyles.btn}>
    <Text style={quickStyles.text}>{label}</Text>
  </TouchableOpacity>
);

/* ----------------- Styles ----------------- */
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
    borderWidth: 1,
    borderColor: COLOR.line,
    padding: 16,
    marginTop: 14,
  },

  sectionTitle: { fontSize: 14, fontWeight: '800', color: COLOR.dark, marginBottom: 10 },

  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#F3F7FB',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  chipActive: { backgroundColor: COLOR.brandSoft, borderColor: '#D4EAFE' },
  chipText: { fontSize: 13, color: COLOR.dim, fontWeight: '700' },
  chipTextActive: { color: COLOR.brand },

  quickRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  label: { fontSize: 12.5, fontWeight: '700', color: COLOR.dim },

  inputBtn: {
    marginTop: 6,
    borderWidth: 1, borderColor: COLOR.line,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12, paddingVertical: 12,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  inputBtnText: { fontSize: 14, color: COLOR.dark, fontWeight: '600' },
  chev: { fontSize: 18, color: COLOR.dim },

  toggle: {
    marginTop: 14,
    flexDirection: 'row', alignItems: 'center', gap: 10,
  },
  toggleDot: {
    width: 42, height: 26, borderRadius: 13,
    backgroundColor: '#E5EAF1', position: 'relative',
  },
  toggleDotOn: {
    backgroundColor: '#C7EBFF',
  },
  toggleLabel: { fontSize: 13.5, color: COLOR.dark, fontWeight: '700' },

  textArea: {
    borderWidth: 1, borderColor: COLOR.line, backgroundColor: '#FFF',
    borderRadius: 12, padding: 12, minHeight: 100, textAlignVertical: 'top',
  },

  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 4, paddingVertical: 6 },
  summaryLabel: { fontSize: 12.5, color: COLOR.dim, fontWeight: '700' },
  summaryValue: { fontSize: 22, fontWeight: '900', color: COLOR.dark },
  summaryValueSmall: { fontSize: 14, fontWeight: '800', color: COLOR.dark },

  submitBtn: {
    marginTop: 16,
    backgroundColor: COLOR.brand,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  submitText: { color: '#fff', fontWeight: '900', fontSize: 16 },
});

const quickStyles = StyleSheet.create({
  btn: {
    backgroundColor: '#F3F7FB',
    borderWidth: 1,
    borderColor: COLOR.line,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  text: { color: COLOR.dim, fontWeight: '700', fontSize: 12.5 },
});
