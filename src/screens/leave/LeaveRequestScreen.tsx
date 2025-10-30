// screens/LeaveRequestNew.tsx
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';

/** ==== คุณมีอยู่แล้วในโปรเจกต์ (แก้ path ให้ตรงโปรเจกต์คุณ) ==== */
import { BackgroundFX } from '../../components/Background';
import LeaveTypePicker from '../../components/LeaveTypePicker';
import { useCreateLeave } from '../../hooks/leave/useLeaveRequest';
import { useLeaveTypes } from '../../hooks/leave/useLeaveTypes';
import type { CreateLeaveRequestPayload } from '../../interface/leave-request';
import type { HalfDay } from '../../interface/leave-type';
import { useAuthStore } from '../../store/useAuthStore';
import { COLOR, FONT } from '../../theme/token';
import { useTranslation } from 'react-i18next';
import { ThaiLocale } from '@/src/utails/calendar-locale';
import { resetToLogin } from '@/src/navigation/navigationRef';

/** ---------- Utils ---------- */
const localNoon = (d = new Date()) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12, 0, 0, 0);
const isoDate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const fmtTH = (d?: Date | null, useBE = true) => {
  if (!d) return '-';
  try {
    return new Intl.DateTimeFormat(useBE ? 'th-TH-u-ca-buddhist' : 'th-TH', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    }).format(d);
  } catch { return d.toLocaleDateString('th-TH'); }
};

/** ---------- Types ---------- */
type LeaveForm = {
  typeCode: string | null;
  reason: string;
  startDate: Date;
  endDate: Date;
  halfDay: HalfDay; // 'FULL' | 'AM' | 'PM'
};

const R = { pill: 999, card: 18 };
const SP = { xs: 6, sm: 8, md: 12, lg: 16, xl: 20 };

export default function LeaveRequestNew() {
  const nav = useNavigation();
  const today = localNoon();
  const profile = useAuthStore((s) => s.profile);
  if (!profile) {
    resetToLogin();
  }

    const { t, i18n } = useTranslation();
    const current = (i18n.resolvedLanguage || i18n.language || '').startsWith('th') ? 'th' : 'en';
    if (current === 'th') {
      LocaleConfig.locales["th"] = ThaiLocale;
    }
    LocaleConfig.defaultLocale = current;

  const [form, setForm] = useState<LeaveForm>({
    typeCode: null,
    reason: '',
    startDate: today,
    endDate: today,
    halfDay: 'FULL',
  });
  const [hasPickedStart, setHasPickedStart] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: leaveTypes, isLoading, isError, error, refetch, isFetching } = useLeaveTypes('leave-types');
  const createLeave = useCreateLeave('create leave-request');

  const typeOptions = useMemo(
    () => (leaveTypes ?? []).map(t => ({ id: t.id, name: current === 'th' ? t.name_th : t.name_en || t.name_th })),
    [leaveTypes, current]
  );

  const setField = useCallback(<K extends keyof LeaveForm>(k: K, v: LeaveForm[K]) => {
    setForm(p => ({ ...p, [k]: v }));
  }, []);

  const totalDays = useMemo(() => {
    const s = localNoon(form.startDate);
    const e = localNoon(form.endDate);
    const diff = Math.max(0, Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24))) + 1;
    return diff === 1 && form.halfDay !== 'FULL' ? 0.5 : diff;
  }, [form.startDate, form.endDate, form.halfDay]);

  const marked = useMemo(() => {
    const sKey = isoDate(form.startDate);
    const eKey = isoDate(form.endDate);
    const dates: Record<string, any> = {};
    const d0 = localNoon(form.startDate);
    const d1 = localNoon(form.endDate);
    const [a, b] = d0 <= d1 ? [d0, d1] : [d1, d0];
    for (let d = new Date(a); d <= b; d.setDate(d.getDate() + 1)) {
      dates[isoDate(d)] = { color: '#E9F7FF', textColor: COLOR.text };
    }
    dates[sKey] = { ...(dates[sKey] || {}), startingDay: true, color: COLOR.info, textColor: '#fff' };
    dates[eKey] = { ...(dates[eKey] || {}), endingDay: true, color: COLOR.info, textColor: '#fff' };
    return dates;
  }, [form.startDate, form.endDate]);

  const onDayPress = useCallback((d: { year: number; month: number; day: number }) => {
    const picked = localNoon(new Date(d.year, d.month - 1, d.day));
    const hasRange = isoDate(form.startDate) !== isoDate(form.endDate);

    if (!hasPickedStart || hasRange) {
      setField('startDate', picked);
      setField('endDate', picked);
      setHasPickedStart(true);
      setField('halfDay', 'FULL');
      return;
    }
    const s = form.startDate;
    const [a, b] = picked < s ? [picked, s] : [s, picked];
    setField('startDate', a);
    setField('endDate', b);
    setHasPickedStart(false);
  }, [form.startDate, form.endDate, hasPickedStart, setField]);

  const quickPick = useCallback((k: 'today' | 'tomorrow' | 'thisWeek') => {
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
    // thisWeek (today -> Sunday)
    const start = base;
    const end = localNoon(new Date(base));
    const dow = start.getDay();
    end.setDate(end.getDate() + ((7 - dow) % 7));
    setForm(f => ({ ...f, startDate: start, endDate: end, halfDay: 'FULL' }));
    setHasPickedStart(false);
  }, []);

  const canHalf = useMemo(() => isoDate(form.startDate) === isoDate(form.endDate), [form.startDate, form.endDate]);
  const selectedTypeName = useMemo(
    () => typeOptions.find(t => t.id === form.typeCode)?.name ?? null,
    [typeOptions, form.typeCode]
  );
  const isValid = useMemo(() => !!form.typeCode && totalDays > 0, [form.typeCode, totalDays]);

  const submit = useCallback(async () => {
    if (!isValid || isSubmitting) return;
    try {
      setIsSubmitting(true);
      const payload: CreateLeaveRequestPayload = {
        leave_type_id: form.typeCode!,
        start_date: isoDate(form.startDate),
        end_date: isoDate(form.endDate),
        reason: form.reason.trim() || undefined,
        halfDay: form.halfDay,
      };
      if (form.halfDay !== 'FULL') payload.halfDay = form.halfDay;
      await createLeave.mutateAsync(payload);
      (nav as any)?.goBack?.();
    } finally {
      setIsSubmitting(false);
    }
  }, [form, isValid, isSubmitting, nav]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLOR.backgroundColor }} edges={['left', 'right']}>
      <BackgroundFX />
      <StatusBar barStyle="dark-content" />

      {/* HEADER: gradient + title + summary floating */}
      <View style={s.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={s.avatar} />
          <View>
            <Text style={[s.hi, { fontFamily: FONT.headingBold }]}>{t('leave.requestLeave')}</Text>
            <Text style={[s.sub, { fontFamily: FONT.body }]}>{t('leave.formTitle')}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => Linking.openURL('https://example.com/policy')} style={s.policyBtn}>
          <Text style={[s.policyBtnText, { fontFamily: FONT.body }]}>{t('leave.policy')}</Text>
        </TouchableOpacity>
      </View>


      {/* CONTENT */}
      {isLoading ? (
        <CenterNote text={t('leave.loadingTypes')} />
      ) : isError ? (
        <View style={{ padding: SP.lg }}>
          <Text style={{ color: '#ef4444', fontWeight: '900' }}>
            {(error as any)?.message ?? 'โหลดชนิดลาไม่สำเร็จ'}
          </Text>
          <TouchableOpacity onPress={() => refetch()} activeOpacity={0.9} style={[s.primaryBtn, { marginTop: SP.md }]}>
            <LinearGradient
              colors={['#13C3A3', '#2EA8FF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={s.primaryBtnGrad}
            >
              <Text style={s.primaryBtnText}>{t('common.retry')}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView
            contentContainerStyle={{ padding: SP.lg, paddingBottom: 170 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Leave types */}
            <View style={s.card}>
              <LeaveTypePicker
                label={t('leave.type')}
                options={typeOptions}
                value={form.typeCode}
                onChange={(id) => setField('typeCode', id != null ? String(id) : null)}
                isFetching={isFetching}
                topN={3}
                rtl
                colors={{ primary: COLOR.info, text: COLOR.text, sub: COLOR.sub, border: COLOR.line, card: '#fff' }}
                spacing={{ sm: 8, md: 12, lg: 16, radius: { md: 12, lg: 16 } }}
              />
              {!form.typeCode && <Text style={s.hint}>{t('leave.selectTypeFirst')}</Text>}
            </View>

            {/* Date range */}
            <View style={s.card}>
              <Text style={[s.section, { fontFamily: FONT.bodyBold }]}>{t('leave.dateRange')}</Text>


              <View style={s.quickRow}>
                <Pill label={t('common.today')} onPress={() => quickPick('today')} />
                <Pill label={t('common.tomorrow')} onPress={() => quickPick('tomorrow')} />
                <Pill label={t('common.thisWeek')} onPress={() => quickPick('thisWeek')} />
              </View>
              
              <Calendar
                firstDay={1}
                minDate={isoDate(localNoon())}
                onDayPress={onDayPress}
                markingType="period"
                markedDates={marked}
                style={[s.calendar, { height: 400 }, Platform.OS === 'android' && { marginBottom: 16 }]}
                theme={{
                  calendarBackground: COLOR.card,
                  dayTextColor: COLOR.text,
                  monthTextColor: COLOR.text,
                  todayTextColor: COLOR.info,
                  textSectionTitleColor: COLOR.sub,
                  arrowColor: COLOR.info,
                  textMonthFontWeight: '800',
                  selectedDayBackgroundColor: COLOR.primary,
                  selectedDayTextColor: '#fff',
                  textDayFontFamily: FONT.body,
                  textMonthFontFamily: FONT.bodyBold,
                  textDayHeaderFontFamily: FONT.bodyBold,
                  textDayFontSize: 14,
                  textMonthFontSize: 16,
                  textDayHeaderFontSize: 13,
                }}
              />


              <View style={s.rangeRow}>
                <Info label={t('common.start')} value={fmtTH(form.startDate, true)} />
                <Info label={t('common.end')} value={fmtTH(form.endDate, true)} />
              </View>

              <View style={[s.halfRow, !canHalf && { opacity: 0.45 }]}>
                <Text style={[s.halfLabel, { fontFamily: FONT.body }]}>{t('leave.timeRange')}</Text>
                <View style={s.segment}>
                  {(['FULL', 'AM', 'PM'] as HalfDay[]).map(h => {
                    const active = form.halfDay === h;
                    return (
                      <TouchableOpacity
                        key={h}
                        disabled={!canHalf && h !== 'FULL'}
                        onPress={() => setField('halfDay', h)}
                        activeOpacity={0.95}
                        style={[s.segmentItem, active && s.segmentActive, (!canHalf && h !== 'FULL') && { opacity: 0.45 }]}
                      >
                        <Text style={[s.segmentText, active && s.segmentTextActive, { fontFamily: FONT.body }]}>
                          {h === 'FULL' ? t('leave.fullDay') : h === 'AM' ? t('leave.halfDayAM') : t('leave.halfDayPM')}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
                {!canHalf && <Text style={[s.hint, { fontFamily: FONT.body }]}>{t('leave.halfDayOnly')}</Text>}
              </View>
            </View>

            {/* Reason */}
            <View style={s.card}>
              <Text style={[s.section, { fontFamily: FONT.body }]}>{t('leave.reason')} ({t('common.optional')})</Text>
              <View style={s.textAreaBox}>
                <TextInput
                  placeholder={t('leave.reasonPlaceholder')}
                  placeholderTextColor={COLOR.sub}
                  value={form.reason}
                  onChangeText={(tx) => setField('reason', tx)}
                  multiline
                  numberOfLines={3}
                  style={[s.textArea, { fontFamily: FONT.body }]}
                />
              </View>
            </View>
          </ScrollView>

          {/* STICKY BOTTOM */}
          <View style={s.sticky}>
            <View style={{ flex: 1 }}>
              <Text style={[s.stickyLabel, { fontFamily: FONT.body }]}>{t('leave.sumDay')}</Text>
              <Text style={[s.stickyValue, { fontFamily: FONT.body }]}>
                {totalDays} <Text style={[s.stickyUnit, { fontFamily: FONT.body }]}>{t('common.days')}</Text>
              </Text>
            </View>
            <TouchableOpacity
              onPress={submit}
              disabled={!isValid || isSubmitting}
              activeOpacity={0.9}
              style={[s.primaryBtn, (!isValid || isSubmitting) && { opacity: 0.6 }]}
            >
              <LinearGradient
                colors={['#13C3A3', '#2EA8FF']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={s.primaryBtnGrad}
              >
                {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={[s.primaryBtnText, { fontFamily: FONT.body }]}>{t('common.submit')}</Text>}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

/* ---------- Small components ---------- */
const Pill: React.FC<{ label: string; onPress: () => void }> = ({ label, onPress }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={s.pill}>
    <Text style={[s.pillText, { fontFamily: FONT.body }]}>{label}</Text>
  </TouchableOpacity>
);

const Info: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View style={s.infoCell}>
    <Text style={[s.infoLabel, { fontFamily: FONT.body }]}>{label}</Text>
    <Text style={[s.infoValue, { fontFamily: FONT.body }]}>{value}</Text>
  </View>
);

const CenterNote: React.FC<{ text: string }> = ({ text }) => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <ActivityIndicator color={COLOR.info} />
    <Text style={{ marginTop: 8, color: COLOR.sub, fontWeight: '800', fontFamily: FONT.body }}>{text}</Text>
  </View>
);

/* ---------- Styles ---------- */
const s = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLOR.gradB,
    paddingTop: Platform.OS === 'ios' ? 60 : 48,
  },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#E2F2FF', marginRight: 12 },
  hi: { fontSize: 22, fontWeight: '800', color: '#0F172A' },
  sub: { fontSize: 12, color: '#475569', marginTop: 2 },
  policyBtn: { paddingVertical: 8, paddingHorizontal: 12, backgroundColor: '#E9F4FF', borderRadius: 999 },
  policyBtnText: { color: '#0369A1', fontWeight: '600' },
  headerWrap: {
    paddingTop: Platform.OS === 'ios' ? 60 : 48,
    paddingHorizontal: SP.lg,
    paddingBottom: 14,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
    backgroundColor: COLOR.gradB,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', columnGap: 10 },
  backBtn: { paddingVertical: 6, paddingRight: 6, paddingLeft: 2 },
  backIcon: { fontSize: 28, color: COLOR.sub, lineHeight: 28 },
  hTitle: { fontSize: 20, fontWeight: '900', color: COLOR.text, letterSpacing: 0.1 },
  hSub: { fontSize: 12, color: COLOR.sub, marginTop: 2, fontWeight: '700' },

  summaryCard: {
    marginTop: 12,
    backgroundColor: COLOR.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLOR.line,
    padding: 14,
    shadowColor: COLOR.shadow.color, shadowOffset: COLOR.shadow.s, shadowOpacity: COLOR.shadow.o, shadowRadius: COLOR.shadow.r, elevation: 2,
    flexDirection: 'row', alignItems: 'center',
  },
  kicker: { color: COLOR.sub, fontWeight: '900', fontSize: 12 },
  range: { color: COLOR.text, fontWeight: '900', fontSize: 16, marginTop: 2 },
  subline: { color: COLOR.sub, fontWeight: '800', marginTop: 2 },

  daysBadge: {
    width: 74, height: 74, borderRadius: 16, alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#E8FFF6', borderWidth: 1, borderColor: '#C8F2E5',
  },
  daysNum: { fontSize: 26, fontWeight: '900', color: COLOR.primary, lineHeight: 28 },
  daysUnit: { fontSize: 12, fontWeight: '900', color: COLOR.primary, marginTop: -2 },

  card: {
    backgroundColor: COLOR.card, borderRadius: R.card, borderWidth: 1, borderColor: COLOR.line,
    padding: SP.lg, marginTop: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
  },
  section: { fontSize: 15.5, fontWeight: '900', color: COLOR.text, marginBottom: 10, letterSpacing: 0.1 },

  quickRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  pill: {
    backgroundColor: '#F0F6FF', borderWidth: 1, borderColor: '#DCE8F7',
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: R.pill,
  },
  pillText: { color: COLOR.info, fontWeight: '900', fontSize: 12.5 },

  calendar: { borderRadius: 16, borderWidth: 1, borderColor: COLOR.line, overflow: 'hidden' },

  rangeRow: { flexDirection: 'row', gap: 12, marginTop: 12 },
  infoCell: { flex: 1, borderWidth: 1, borderColor: COLOR.line, borderRadius: 14, padding: 12, backgroundColor: '#FAFCFF' },
  infoLabel: { color: COLOR.sub, fontWeight: '900', fontSize: 12 },
  infoValue: { color: COLOR.text, fontWeight: '900', marginTop: 4 },

  halfRow: { marginTop: 14 },
  halfLabel: { color: COLOR.sub, fontWeight: '900', marginBottom: 8 },
  segment: { flexDirection: 'row', backgroundColor: '#F3F7FB', padding: 4, borderRadius: R.pill, borderWidth: 1, borderColor: COLOR.line },
  segmentItem: { flex: 1, paddingVertical: 10, borderRadius: R.pill, alignItems: 'center' },
  segmentActive: { backgroundColor: '#E7FFF6', borderWidth: 1, borderColor: '#BDEEDD' },
  segmentText: { color: COLOR.sub, fontWeight: '900', fontSize: 12.5 },
  segmentTextActive: { color: COLOR.primary },

  textAreaBox: { borderWidth: 1, borderColor: COLOR.line, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#FAFCFF' },
  textArea: { minHeight: 64, textAlignVertical: 'top', fontSize: 14, color: COLOR.text, fontWeight: '700' },

  hint: { marginTop: 8, color: COLOR.sub, fontSize: 12, fontWeight: '800' },

  sticky: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    backgroundColor: '#FFFFFFF0',
    borderTopWidth: 1, borderTopColor: COLOR.line,
    paddingHorizontal: SP.lg, paddingTop: 10, paddingBottom: Platform.OS === 'ios' ? 14 : 12,
    flexDirection: 'row', alignItems: 'center', columnGap: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: -1 }, shadowOpacity: 0.07, shadowRadius: 10, elevation: 12,
  },
  stickyLabel: { color: COLOR.sub, fontWeight: '900', fontSize: 12 },
  stickyValue: { color: COLOR.text, fontWeight: '900', fontSize: 22 },
  stickyUnit: { fontSize: 13, color: COLOR.sub, fontWeight: '900' },

  primaryBtn: { borderRadius: R.pill, overflow: 'hidden' },
  primaryBtnGrad: { paddingVertical: 14, paddingHorizontal: 22, alignItems: 'center', borderWidth: 1, borderColor: '#B5EEDD', borderRadius: R.pill },
  primaryBtnText: { color: '#fff', fontWeight: '900', fontSize: 16, letterSpacing: 0.2 },
});
