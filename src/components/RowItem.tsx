import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLOR as THEME_COLOR } from '../theme/theme';

const COLOR =
  THEME_COLOR ?? {
    text: '#1F2A37',
    dim: '#6B7280',
    brand: '#1AA6B7',
  };

export type RowItemProps = {
  title: string;
  meta: string;
  statusColor?: string;
  onPress?: () => void;
};

const RowItem: React.FC<RowItemProps> = ({ title, meta, statusColor = COLOR.dim, onPress }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.row}>
    <View style={[styles.dot, { backgroundColor: statusColor }]} />
    <View style={{ flex: 1 }}>
      <Text numberOfLines={1} style={styles.title}>{title}</Text>
      <Text style={styles.meta}>{meta}</Text>
    </View>
    <Text style={styles.chev}>›</Text>
  </TouchableOpacity>
);

export default memo(RowItem);

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  dot: { width: 8, height: 8, borderRadius: 999, marginRight: 10 },
  title: { fontSize: 14, fontWeight: '700', color: COLOR.text },
  meta: { fontSize: 12, color: COLOR.dim, marginTop: 2 },
  chev: { fontSize: 20, color: COLOR.dim, paddingLeft: 10 },
});
