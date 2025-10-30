import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

type Props = { onPress: () => void };
export default function FabAll({ onPress }: Props) {
  return (
    <View style={styles.wrap}>
      <Pressable style={styles.fab} onPress={onPress}>
        <Ionicons name="apps-outline" size={22} color="#0B8AD9" />
        <Text style={styles.txt}>ดูทั้งหมด</Text>
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  wrap: { position: 'absolute', right: 16, bottom: 24 },
  fab: {
    flexDirection: 'row', alignItems: 'center', columnGap: 8,
    backgroundColor: '#ffffffcc', borderWidth: 1, borderColor: '#DDE6F2',
    paddingHorizontal: 14, paddingVertical: 10, borderRadius: 999,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.15, shadowRadius: 6, elevation: 6,
  },
  txt: { color: '#0B8AD9', fontWeight: '800' },
});
