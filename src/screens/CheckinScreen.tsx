import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { BackgroundFX } from '../components/Background';

type TodayEvent = {
  id: string;
  type: 'IN' | 'OUT';
  timeISO: string;
  note?: string;
};

/* ====== Laloei Pastel Theme ====== */
const R = 16;
const THEME = {
  bgA: '#E9F4FF',
  bgB: '#F4FFFD',
  card: '#FFFFFF',
  text: '#0F172A',
  sub: '#6B7280',
  line: '#E6EDF5',
  primary: '#6C7EF7',   // pastel indigo
  teal: '#22C1C3',      // pastel teal
  success: '#10B981',   // green
  warn: '#F59E0B',
  danger: '#EF4444',
  soft: '#F8FAFF',
};

export default function CheckInScreen() {
  const [now, setNow] = useState(new Date());
  const [loading, setLoading] = useState<'in' | 'out' | null>(null);
  const [note, setNote] = useState('');
  const [events, setEvents] = useState<TodayEvent[]>([]);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const checkedIn = useMemo(() => {
    const hasIn = events.some((e) => e.type === 'IN');
    const hasOut = events.some((e) => e.type === 'OUT');
    return hasIn && !hasOut;
  }, [events]);

  const timeStr = useMemo(
    () => now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    [now]
  );
  const dateStr = useMemo(
    () => now.toLocaleDateString('th-TH', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' }),
    [now]
  );

  const doCheckIn = async () => {
    if (loading || checkedIn) return;
    setLoading('in');
    try {
      // TODO: call API จริง
      await new Promise((r) => setTimeout(r, 400));
      setEvents((prev) => [
        ...prev,
        { id: String(Date.now()), type: 'IN', timeISO: new Date().toISOString(), note },
      ]);
      setNote('');
    } catch (e: any) {
      Alert.alert('ผิดพลาด', 'เช็คอินไม่สำเร็จ');
    } finally {
      setLoading(null);
    }
  };

  const doCheckOut = async () => {
    if (loading || !checkedIn) return;
    setLoading('out');
    try {
      // TODO: call API จริง
      await new Promise((r) => setTimeout(r, 400));
      setEvents((prev) => [
        ...prev,
        { id: String(Date.now()), type: 'OUT', timeISO: new Date().toISOString(), note },
      ]);
      setNote('');
    } catch (e: any) {
      Alert.alert('ผิดพลาด', 'เช็คเอาท์ไม่สำเร็จ');
    } finally {
      setLoading(null);
    }
  };

  return (
    <LinearGradient colors={[THEME.bgA, THEME.bgB]} style={{ flex: 1 }}>
        <BackgroundFX />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {/* ===== Header ===== */}
          <View style={styles.headerWrap}>
            <View style={styles.logoCircle}>
              <Ionicons name="location-outline" size={26} color={THEME.primary} />
            </View>
            <Text style={styles.title}>เช็คอิน / เช็คเอาท์</Text>
            <Text style={styles.subtitle}>Laloei — ลาได้ทุกที่ จัดการง่ายในแอปเดียว</Text>

            <View style={styles.timePanel}>
              <Text style={styles.date}>{dateStr}</Text>
              <Text style={styles.clock}>{timeStr}</Text>
              <View style={statusPill(checkedIn ? THEME.success : THEME.primary)}>
                <Ionicons
                  name={checkedIn ? 'checkmark-circle-outline' : 'time-outline'}
                  size={16}
                  color="#fff"
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.statusText}>{checkedIn ? 'เช็คอินแล้ว (รอเช็คเอาท์)' : 'ยังไม่ได้เช็คอิน'}</Text>
              </View>
            </View>
          </View>

          {/* ===== Card: Note + Actions ===== */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>บันทึกวันนี้</Text>

            <View style={styles.inputWrap}>
              <Ionicons name="create-outline" size={18} color={THEME.sub} style={{ marginRight: 6 }} />
              <TextInput
                value={note}
                onChangeText={setNote}
                placeholder="เช่น ทำงานที่ออฟฟิศ / นอกสถานที่"
                style={styles.input}
                placeholderTextColor={THEME.sub}
                returnKeyType="done"
              />
            </View>

            <View style={styles.btnRow}>
              <GradientButton
                disabled={checkedIn || !!loading}
                colors={[THEME.success, '#3DD9A3']}
                onPress={doCheckIn}
                icon="log-in-outline"
                label="Check-In"
                loading={loading === 'in'}
              />
              <GradientButton
                disabled={!checkedIn || !!loading}
                colors={[THEME.primary, '#8EA1FF']}
                onPress={doCheckOut}
                icon="log-out-outline"
                label="Check-Out"
                loading={loading === 'out'}
              />
            </View>
          </View>

          {/* ===== Card: Today timeline ===== */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="time-outline" size={18} color={THEME.text} />
              <Text style={styles.cardTitle}>วันนี้</Text>
            </View>

            {events.length === 0 ? (
              <Text style={styles.empty}>ยังไม่มีข้อมูล</Text>
            ) : (
              events
                .slice()
                .sort((a, b) => a.timeISO.localeCompare(b.timeISO))
                .map((ev) => (
                  <View key={ev.id} style={styles.eventRow}>
                    <View style={dot(ev.type === 'IN' ? THEME.success : THEME.primary)} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.eventTitle}>
                        {ev.type === 'IN' ? 'Check-In' : 'Check-Out'} •{' '}
                        {new Date(ev.timeISO).toLocaleTimeString('th-TH', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Text>
                      {!!ev.note && <Text style={styles.eventNote}>{ev.note}</Text>}
                    </View>
                  </View>
                ))
            )}
          </View>

          <View style={{ height: 32 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

/* ===== Small Components ===== */
function GradientButton({
  disabled,
  colors,
  onPress,
  icon,
  label,
  loading,
}: {
  disabled?: boolean;
  colors: [string, string] | string[];
  onPress: () => void;
  icon: string;
  label: string;
  loading?: boolean;
}) {
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} disabled={disabled} style={{ flex: 1 }}>
      <LinearGradient
        colors={colors as readonly [string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradientBtn, disabled && { opacity: 0.6 }]}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Ionicons name={icon as any} size={20} color="#fff" />
            <Text style={styles.gradientBtnText}>{label}</Text>
          </>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}
/* ===== Dynamic style helpers (อยู่นอก StyleSheet.create) ===== */
const statusPill = (bg: string): ViewStyle => ({
  marginTop: 10,
  alignSelf: 'center',
  backgroundColor: bg,
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 999,
  flexDirection: 'row',
  alignItems: 'center',
});
const dot = (c: string): ViewStyle => ({
  width: 10,
  height: 10,
  borderRadius: 5,
  backgroundColor: c,
  marginTop: 7,
});

/* ===== Styles (เฉพาะ object คงที่) ===== */
const styles = StyleSheet.create({
  scroll: { padding: 20, paddingTop: 100, flexGrow: 1 },

  headerWrap: { alignItems: 'center', marginBottom: 10 },
  logoCircle: {
    width: 70, height: 70, borderRadius: 35,
    backgroundColor: THEME.card, alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 3,
  },
  title: { marginTop: 10, fontSize: 22, fontWeight: '800', color: THEME.text },
  subtitle: { marginTop: 4, fontSize: 13, color: THEME.sub },

  timePanel: {
    width: '100%',
    marginTop: 16,
    borderRadius: R * 1.2,
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: THEME.soft,
    borderWidth: 1,
    borderColor: THEME.line,
    alignItems: 'center',
  },
  date: { fontSize: 13, color: THEME.sub, marginBottom: 4 },
  clock: { fontSize: 44, fontWeight: '800', color: THEME.text },
  statusText: { color: '#fff', fontSize: 12, fontWeight: '700' },

  card: {
    backgroundColor: THEME.card,
    borderRadius: R * 1.25,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: THEME.line,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },

  sectionTitle: { fontWeight: '700', color: THEME.text, marginBottom: 10, fontSize: 16 },

  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.line,
    borderRadius: R,
    paddingHorizontal: 12,
    backgroundColor: '#FAFCFF',
  },
  input: { height: 44, color: THEME.text, flex: 1 },

  btnRow: { flexDirection: 'row', gap: 12, marginTop: 14 },

  gradientBtn: {
    height: 48,
    borderRadius: R,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  gradientBtnText: { color: '#fff', fontWeight: '800' },

  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  cardTitle: { fontWeight: '800', color: THEME.text, fontSize: 16 },
  empty: { color: THEME.sub },

  eventRow: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: THEME.line,
  },
  eventTitle: { color: THEME.text, fontWeight: '700' },
  eventNote: { color: THEME.sub, marginTop: 2 },
});
