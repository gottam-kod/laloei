// screens/LeaveRequestPro.tsx
import React, { useMemo, useState, useCallback, useMemo as _useMemo, use } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// ใช้ react-native-calendars (ติดตั้งไว้ก่อน: yarn add react-native-calendars)
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import { BackgroundFX } from '../components/Background';

/* -------------------- Locale ปฏิทินไทย -------------------- */
LocaleConfig.locales.th = {
  monthNames: [
    'มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน',
    'กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม',
  ],
  monthNamesShort: [
    'ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.',
    'ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.',
  ],
  dayNames: ['อาทิตย์','จันทร์','อังคาร','พุธ','พฤหัสบดี','ศุกร์','เสาร์'],
  dayNamesShort: ['อา.','จ.','อ.','พ.','พฤ.','ศ.','ส.'],
  today: 'วันนี้',
};
LocaleConfig.defaultLocale = 'th';

/* -------------------- Utils -------------------- */
const localNoon = (d = new Date()) => {
  // เที่ยงวันท้องถิ่น กันเหตุ timezone ตอนเที่ยงคืน
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12, 0, 0, 0);
};

const isoDate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const fmtTH = (d?: Date | null, useBE = true) => {
  if (!d) return '-';
  try {
    if (useBE) {
      return new Intl.DateTimeFormat('th-TH-u-ca-buddhist', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(d);
    }
    return new Intl.DateTimeFormat('th-TH', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(d);
  } catch {
    return d.toLocaleDateString('th-TH');
  }
};

type LeaveType = 'ลาป่วย' | 'ลากิจ' | 'ลาพักผ่อน' | 'อื่น ๆ';
type HalfDay = 'FULL' | 'AM' | 'PM';

type LeaveFormData = {
  type: LeaveType | null;
  reason: string;
  startDate: Date;
  endDate: Date;
  halfDay: HalfDay;
};

const TYPES: LeaveType[] = ['ลาป่วย', 'ลากิจ', 'ลาพักผ่อน', 'อื่น ๆ'];

/* -------------------- Screen -------------------- */
const COLOR = {
  bgTopA: '#EAF3FF',
  bgTopB: '#F7FBFF',
  dark: '#0F172A',
  sub: '#6B7A90',
  line: '#E6EDF5',
  card: '#FFFFFF',
  brand: '#20A7C9',
  brandSoft: '#E6F8FD',
  success: '#21C19C',
};

export default function LeaveRequestPro() {
  const today = localNoon();
  const [form, setForm] = useState<LeaveFormData>({
    type: null,
    reason: '',
    startDate: today,
    endDate: today,
    halfDay: 'FULL',
  });

  const navigator = useNavigation();
  // สถานะช่วยเหลือ

  // สำหรับระบุสถานะ "กำลังเลือกปลายทาง"
  const [hasPickedStart, setHasPickedStart] = useState<boolean>(false);

  const setField = useCallback(<K extends keyof LeaveFormData>(key: K, value: LeaveFormData[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  }, []);

  /* ---- จำนวนวันลา (รวมปลายทาง) + ครึ่งวันกรณีวันเดียว ---- */
  const totalDays = useMemo(() => {
    const s = localNoon(form.startDate);
    const e = localNoon(form.endDate);
    const diff = Math.max(0, Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24))) + 1;
    if (diff === 1 && form.halfDay !== 'FULL') return 0.5;
    return diff;
  }, [form.startDate, form.endDate, form.halfDay]);

  /* -------------------- Calendar Marked -------------------- */
  const marked = useMemo(() => {
    const s = isoDate(form.startDate);
    const e = isoDate(form.endDate);

    // สร้างช่วงระหว่าง start..end
    const dates: Record<string, any> = {};
    const d0 = localNoon(form.startDate);
    const d1 = localNoon(form.endDate);
    const a = d0 <= d1 ? d0 : d1;
    const b = d0 <= d1 ? d1 : d0;

    for (let d = new Date(a); d <= b; d.setDate(d.getDate() + 1)) {
      const k = isoDate(d);
      dates[k] = {
        color: '#CDECF6',
        textColor: '#0F172A',
      };
    }

    dates[s] = { startingDay: true, color: '#20C6BA', textColor: '#fff' };
    dates[e] = { endingDay: true, color: '#20C6BA', textColor: '#fff' };

    return dates;
  }, [form.startDate, form.endDate]);

  /* -------------------- Handlers -------------------- */
  const onDayPress = useCallback((d: { year: number; month: number; day: number }) => {
    const picked = localNoon(new Date(d.year, d.month - 1, d.day));

    // ยังไม่ได้เริ่ม หรือเลือกครบช่วงไว้แล้ว → เริ่มใหม่
    if (!hasPickedStart || (form.startDate && form.endDate && isoDate(form.startDate) !== isoDate(form.endDate))) {
      setField('startDate', picked);
      setField('endDate', picked);
      setHasPickedStart(true);
      // reset ครึ่งวันถ้าเริ่มใหม่
      setField('halfDay', 'FULL');
      return;
    }

    // มี start อยู่แล้ว → ตั้ง end (สลับอัตโนมัติถ้าเลือกย้อนหลัง)
    const s = form.startDate;
    const [a, b] = picked < s ? [picked, s] : [s, picked];
    setField('startDate', a);
    setField('endDate', b);
    setHasPickedStart(false);
  }, [form.startDate, form.endDate, hasPickedStart, setField]);

  const pickQuick = useCallback((k: 'today' | 'tomorrow' | 'thisWeek') => {
    const base = localNoon();
    if (k === 'today') {
      setForm(f => ({ ...f, startDate: base, endDate: base, halfDay: 'FULL' }));
      setHasPickedStart(false);
      return;
    }
    if (k === 'tomorrow') {
      const t = localNoon(new Date(base));
      t.setDate(t.getDate() + 1);
      setForm(f => ({ ...f, startDate: t, endDate: t, halfDay: 'FULL' }));
      setHasPickedStart(false);
      return;
    }
    // สัปดาห์นี้ (วันนี้ → วันอาทิตย์)
    const start = base;
    const end = localNoon(new Date(base));
    const dow = start.getDay();            // 0=อาทิตย์
    const toSun = (7 - dow) % 7;
    end.setDate(end.getDate() + toSun);
    setForm(f => ({ ...f, startDate: start, endDate: end, halfDay: 'FULL' }));
    setHasPickedStart(false);
  }, []);

  const selectType = useCallback((t: LeaveType) => setField('type', t), [setField]);

  const canHalfDay = useMemo(() => isoDate(form.startDate) === isoDate(form.endDate), [form.startDate, form.endDate]);

  const isValid = useMemo(() => !!form.type && totalDays > 0, [form.type, totalDays]);

  const submit = useCallback(() => {
    if (!isValid) return;
    // TODO: ส่งคำขอจริง
    console.log('SUBMIT:', {
      ...form,
      totalDays,
    });
  }, [form, isValid, totalDays]);

  /* -------------------- Render -------------------- */
  return (
     <SafeAreaView style={{ flex: 1, backgroundColor: COLOR.bgTopB }}>
          <BackgroundFX />
      <StatusBar barStyle="dark-content" />

      {/* Header + Sticky Summary */}
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={[COLOR.bgTopA, COLOR.bgTopB]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.headerRow} >
          <TouchableOpacity onPress={() => navigator.goBack()} activeOpacity={0.7}>
            <Text style={styles.headerBack}>{'‹'}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>ขอลา</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.stickyCard}>
          <Text style={styles.stickyLabel}>สรุปคำขอ</Text>
          <Text style={styles.stickyDate}>
            {fmtTH(form.startDate, true)} — {fmtTH(form.endDate, true)}
            {form.halfDay !== 'FULL' ? ` • ครึ่งวัน(${form.halfDay === 'AM' ? 'เช้า' : 'บ่าย'})` : ''}
          </Text>
          <Text style={styles.stickySub}>
            {form.type ?? 'เลือกประเภท'} • {totalDays} วัน
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 140 }} showsVerticalScrollIndicator={false}>

        {/* ประเภทการลา */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>ประเภทการลา</Text>
          <View style={styles.chipsRow}>
            {TYPES.map((t) => {
              const active = form.type === t;
              return (
                <TouchableOpacity
                  key={t}
                  onPress={() => selectType(t)}
                  activeOpacity={0.9}
                  style={[styles.chip, active && styles.chipActive]}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{t}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ช่วงวันที่ (Calendar + Quick) */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>ช่วงวันที่</Text>

          <View style={styles.quickRow}>
            <QuickBtn label="วันนี้" onPress={() => pickQuick('today')} />
            <QuickBtn label="พรุ่งนี้" onPress={() => pickQuick('tomorrow')} />
            <QuickBtn label="สัปดาห์นี้" onPress={() => pickQuick('thisWeek')} />
          </View>

          <Calendar
            firstDay={1}
            minDate={isoDate(today)}
            onDayPress={onDayPress}
            markingType="period"
            markedDates={marked}
            theme={{
              todayTextColor: COLOR.brand,
              textDayFontFamily: Platform.select({ ios: 'System', android: 'System' }),
              textMonthFontWeight: '800',
              arrowColor: COLOR.brand,
              monthTextColor: COLOR.dark,
            }}
            style={styles.calendar}
          />

          {/* แสดงผลเลือกแล้ว */}
          <View style={styles.rangeRow}>
            <View style={styles.rangeItem}>
              <Text style={styles.rangeLabel}>เริ่ม</Text>
              <Text style={styles.rangeValue}>{fmtTH(form.startDate, true)}</Text>
            </View>
            <View style={styles.rangeItem}>
              <Text style={styles.rangeLabel}>สิ้นสุด</Text>
              <Text style={styles.rangeValue}>{fmtTH(form.endDate, true)}</Text>
            </View>
          </View>

          {/* ครึ่งวัน (เฉพาะวันเดียว) */}
          <View style={[styles.halfRow, !canHalfDay && { opacity: 0.4 }]}>
            <Text style={styles.halfLabel}>รูปแบบ</Text>
            <View style={styles.halfChips}>
              {(['FULL', 'AM', 'PM'] as HalfDay[]).map(h => {
                const active = form.halfDay === h;
                return (
                  <TouchableOpacity
                    key={h}
                    disabled={!canHalfDay && h !== 'FULL'}
                    onPress={() => setField('halfDay', h)}
                    style={[styles.halfChip, active && styles.halfChipActive]}
                    activeOpacity={0.9}
                  >
                    <Text style={[styles.halfChipText, active && styles.halfChipTextActive]}>
                      {h === 'FULL' ? 'เต็มวัน' : h === 'AM' ? 'ครึ่งวัน(เช้า)' : 'ครึ่งวัน(บ่าย)'}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* สรุปจำนวนวัน + ปุ่มส่ง */}
        <View style={[styles.card, { paddingVertical: 14 }]}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>รวมวันลา</Text>
            <Text style={styles.summaryValue}>
              {totalDays} <Text style={{ fontSize: 13, color: COLOR.sub }}>วัน</Text>
            </Text>
          </View>
          {!!form.type && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>ประเภท</Text>
              <Text style={styles.summaryValueSmall}>{form.type}</Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[styles.submitBtn, !isValid && { opacity: 0.5 }]}
          onPress={submit}
          disabled={!isValid}
          activeOpacity={0.9}
        >
          <Text style={styles.submitText}>ส่งคำขอ</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

/* -------------------- Sub -------------------- */
const QuickBtn: React.FC<{ label: string; onPress: () => void }> = ({ label, onPress }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={quickStyles.btn}>
    <Text style={quickStyles.text}>{label}</Text>
  </TouchableOpacity>
);

/* -------------------- Styles -------------------- */
const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: Platform.OS === 'ios' ? 64 : 52,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: COLOR.bgTopB,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerBack: { fontSize: 26, color: COLOR.sub, lineHeight: 26 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: COLOR.dark },

  stickyCard: {
    marginTop: 12,
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLOR.line,
    padding: 12,
  },
  stickyLabel: { color: COLOR.sub, fontWeight: '700', fontSize: 12 },
  stickyDate: { color: COLOR.dark, fontWeight: '900', marginTop: 4 },
  stickySub: { color: COLOR.sub, marginTop: 2 },

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
  chipText: { fontSize: 13, color: COLOR.sub, fontWeight: '700' },
  chipTextActive: { color: COLOR.brand },

  quickRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },

  calendar: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLOR.line,
    overflow: 'hidden',
  },

  rangeRow: { flexDirection: 'row', gap: 12, marginTop: 12 },
  rangeItem: { flex: 1, borderWidth: 1, borderColor: COLOR.line, borderRadius: 12, padding: 12 },
  rangeLabel: { color: COLOR.sub, fontWeight: '700', fontSize: 12 },
  rangeValue: { color: COLOR.dark, fontWeight: '800', marginTop: 4 },

  halfRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 },
  halfLabel: { color: COLOR.sub, fontWeight: '800' },
  halfChips: { flexDirection: 'row', gap: 8 },
  halfChip: {
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999,
    backgroundColor: '#F3F7FB', borderWidth: 1, borderColor: 'transparent',
  },
  halfChipActive: { backgroundColor: COLOR.brandSoft, borderColor: '#D4EAFE' },
  halfChipText: { color: COLOR.sub, fontWeight: '800', fontSize: 12.5 },
  halfChipTextActive: { color: COLOR.brand },

  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 4, paddingVertical: 6 },
  summaryLabel: { fontSize: 12.5, color: COLOR.sub, fontWeight: '700' },
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
  text: { color: COLOR.sub, fontWeight: '700', fontSize: 12.5 },
});
