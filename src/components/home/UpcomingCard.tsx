import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLOR, SP, UI } from '../../theme/token';
import { useTranslation } from 'react-i18next';

type Props = { status?: 'PENDING'|'APPROVED'|'REJECTED'| 'CANCELLED' | undefined; date: string; time: string; detail: string; approver?: string };
export default function UpcomingCard(
  { status='PENDING', date, time, detail, approver }: Props) {
    const { t } = useTranslation();
  return (
    <View style={styles.card}>
      <View style={styles.head}>
        <Text style={styles.title}>{t('leave.upcomingRequest')}</Text>
        <Text style={styles.badge}>{status}</Text>
      </View>
      {/* <Text style={styles.line}>{`${date} • ${time}`}</Text> */}
      <Text style={styles.line}>{date}</Text>
      <Text style={styles.line}>{detail}</Text>
      {approver ? <Text style={[styles.line, { color: COLOR.info }]}>{approver}</Text> : null}
      <View style={styles.actions}>
        <Pressable style={styles.pill}><Text style={styles.pillTxt}>{t('common.details')}</Text></Pressable>
        <Pressable style={[styles.pill, { backgroundColor: COLOR.primary }]}><Text style={[styles.pillTxt, { color: '#fff' }]}>{t('common.cancel')}</Text></Pressable>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  card: { backgroundColor: COLOR.card, borderRadius: UI.radius.xl, padding: SP.lg, borderWidth: 1, borderColor: COLOR.line },
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  title: { fontSize: 16, fontWeight: '900', color: COLOR.text },
  badge: { backgroundColor: COLOR.backgroundColor, color: COLOR.warn, paddingHorizontal: 10, paddingVertical: 4, borderRadius: UI.radius.pill, fontSize: 12, fontWeight: '800' },
  line: { fontSize: 14, color: COLOR.sub },
  actions: { flexDirection: 'row', columnGap: 12, marginTop: 12 },
  pill: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: UI.radius.pill, backgroundColor: '#E6EBF2' },
  pillTxt: { fontSize: 14, color: COLOR.text, fontWeight: '800' },
});
