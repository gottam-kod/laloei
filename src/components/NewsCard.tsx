import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export type NewsItem = {
  id: string;
  title: string;
  date: string;
  tag?: string;
};

type Props = {
  items: NewsItem[];
  onPressMore?: () => void;
  onPressItem?: (item: NewsItem) => void;
};

const NewsCard: React.FC<Props> = ({ items, onPressMore, onPressItem }) => {
  return (
    <View style={styles.card}>
      <View style={styles.head}>
        <Text style={styles.title}>ข่าวสาร HR</Text>
        <TouchableOpacity onPress={onPressMore}>
          <Text style={styles.link}>ดูทั้งหมด</Text>
        </TouchableOpacity>
      </View>

      {items.map((x, i) => (
        <TouchableOpacity
          key={x.id}
          style={[styles.row, i < items.length - 1 && styles.rowBorder]}
          onPress={() => onPressItem?.(x)}
          activeOpacity={0.8}
        >
          <View style={styles.dot} />
          <View style={{ flex: 1 }}>
            <Text numberOfLines={1} style={styles.rowTitle}>{x.title}</Text>
            <Text style={styles.meta}>{(x.tag ? `${x.tag} • ` : '') + x.date}</Text>
          </View>
          <Text style={styles.chev}>›</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default NewsCard;

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 20, padding: 14, marginBottom: 14 },
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  title: { fontWeight: '800', fontSize: 16, color: '#1F2A37' },
  link: { color: '#1AA6B7', fontWeight: '800' },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: '#E7EEF4' },
  dot: { width: 8, height: 8, borderRadius: 999, backgroundColor: '#1AA6B7', marginRight: 10 },
  rowTitle: { fontWeight: '700', color: '#1F2A37' },
  meta: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  chev: { fontSize: 18, color: '#6B7280', paddingLeft: 8 },
});
