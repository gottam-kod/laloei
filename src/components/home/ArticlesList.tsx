import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { COLOR } from '../../theme/token';

type Article = { id: string; title: string; cover: string };
type Props = { title?: string; items: Article[]; onPressAll?: () => void };
export default function ArticlesList({ title='บทความ HR', items, onPressAll }: Props) {
  return (
    <View>
      <View style={styles.head}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Pressable onPress={onPressAll}><Text style={styles.link}>ดูทั้งหมด</Text></Pressable>
      </View>
      {items.map(a => (
        <View key={a.id} style={styles.row}>
          <Image source={{ uri: a.cover }} style={styles.img} />
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{a.title}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '900', color: COLOR.text },
  link: { color: COLOR.info, fontSize: 14, fontWeight: '800' },
  row: { flexDirection: 'row', columnGap: 12, backgroundColor: COLOR.card, borderRadius: 16, borderWidth: 1, borderColor: COLOR.line, padding: 8, marginTop: 8 },
  img: { width: 96, height: 72, borderRadius: 12 },
  title: { fontSize: 14, fontWeight: '800', color: COLOR.text },
});
