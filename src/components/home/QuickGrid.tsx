import Ionicons from 'react-native-vector-icons/Ionicons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLOR, FONT } from '../../theme/token';
import SectionTitle from '../SectionTitle';

export type QuickItem = { key: string; label: string; icon: React.ComponentProps<typeof Ionicons>['name']; color?: string };
type Props = { title?: string; items: QuickItem[]; onPressItem?: (key: string) => void };

export default function QuickGrid({ title='ทางลัด', items, onPressItem }: Props) {
  const first4 = items.slice(0, 4);
  return (
    <View>
      <SectionTitle title={title} icon='' />
      <View style={styles.grid}>
        {first4.map((q) => (
          <View key={q.key} style={styles.item}>
            <Pressable style={[styles.circle, { borderColor: q.color ?? COLOR.line }]} onPress={() => onPressItem?.(q.key)}>
              <Ionicons name={q.icon} size={38} color={q.color ?? COLOR.text} />
            </Pressable>
            <Text style={[styles.label, { fontFamily: FONT.body }]} numberOfLines={2}>{q.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  sectionTitle: { fontSize: 16, fontWeight: '900', color: COLOR.text, marginBottom: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  item: { flexBasis: '25%', maxWidth: '25%', alignItems: 'center', marginBottom: 14 },
  circle: {
    width: 66, height: 66, borderRadius: 43,
    backgroundColor: COLOR.card, borderWidth: 1, borderColor: COLOR.line,
    justifyContent: 'center', alignItems: 'center',
  },
  label: { marginTop: 8, fontSize: 12, color: COLOR.text, textAlign: 'center', fontWeight: '700', paddingHorizontal: 4 },
});
