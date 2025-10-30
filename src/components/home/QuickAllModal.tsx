import Ionicons from 'react-native-vector-icons/Ionicons';
import React from 'react';
import { Animated, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { COLOR, UI } from '../../theme/token';
import type { QuickItem } from './QuickGrid';

type Props = {
  visible: boolean;
  items: QuickItem[];
  onClose: () => void;
  opacity: Animated.Value;
  scale: Animated.Value;
  onPressItem?: (key: string) => void;   // ← เพิ่ม
};

export default function QuickAllModal({ visible, items, onClose, opacity, scale, onPressItem }: Props) {
  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <Animated.View style={[styles.overlay, { opacity }]}>
        <Animated.View style={[styles.sheet, { transform: [{ scale }] }]}>
          <View style={styles.handle} />
          <Text style={[styles.title]}>เมนูทั้งหมด</Text>
          <ScrollView contentContainerStyle={{ rowGap: 14 }}>
            <View style={styles.grid}>
              {items.map((q) => (
                <View key={q.key} style={styles.item}>
                  <Pressable style={[styles.circle, { borderColor: q.color ?? COLOR.line }]}>
                    <Ionicons name={q.icon} size={26} color={q.color ?? COLOR.text} />
                  </Pressable>
                  <Text style={styles.label} numberOfLines={2}>{q.label}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
          <Pressable style={styles.pill} onPress={onClose}><Text style={styles.pillTxt}>ปิด</Text></Pressable>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: COLOR.card, borderTopLeftRadius: 18, borderTopRightRadius: 18, maxHeight: '75%', padding: 16, borderWidth: 1, borderColor: COLOR.line },
  handle: { width: 40, height: 4, borderRadius: 4, backgroundColor: '#CBD5E1', alignSelf: 'center', marginBottom: 10 },
  title: { fontSize: 16, fontWeight: '900', color: COLOR.text, marginBottom: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  item: { flexBasis: '25%', maxWidth: '25%', alignItems: 'center', marginBottom: 14 },
  circle: { width: 70, height: 70, borderRadius: 35, backgroundColor: COLOR.card, borderWidth: 1, borderColor: COLOR.line, justifyContent: 'center', alignItems: 'center' },
  label: { marginTop: 8, fontSize: 12, color: COLOR.text, textAlign: 'center', fontWeight: '700', paddingHorizontal: 4 },
  pill: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: UI.radius.pill, backgroundColor: '#E6EBF2', alignSelf: 'center', marginTop: 10 },
  pillTxt: { fontSize: 14, color: COLOR.text, fontWeight: '800' },
});
