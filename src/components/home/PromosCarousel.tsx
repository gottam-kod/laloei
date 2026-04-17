import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SP, theme } from '../../theme/token';

export type Promo = { id: string; title: string; description: string, content: string; cover: string };
type Props = { title?: string; items: Promo[] };
export default function PromosCarousel({ title='บริการแนะนำ', items }: Props) {
  return (
    <>
      <Text style={styles.sectionTitle}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ columnGap: SP.md }}>
        {items.map(p => (
          <View key={p.id} style={styles.card}>
            <Image source={{ uri: p.cover }} style={styles.img} />
            <Text style={styles.txt}>{p.title}</Text>
          </View>
        ))}
      </ScrollView>
    </>
  );
}
const styles = StyleSheet.create({
  sectionTitle: { fontSize: 16, fontWeight: '900', color: theme.color.text, marginBottom: 8 },
  card: { width: 240, backgroundColor: theme.color.card, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: theme.color.line },
  img: { width: 240, height: 120 },
  txt: { padding: 10, fontSize: 14, color: theme.color.text, fontWeight: '800' },
});
