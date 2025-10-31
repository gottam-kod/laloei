import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const COLOR = {
  bg: '#F7FAFD',
  text: '#0F172A',
  sub: '#607089',
  line: '#E8EEF7',
  card: '#FFFFFF',
};

type Props = {
  title: string;
  onBack?: () => void;
  right?: React.ReactNode; // ใส่ปุ่ม/เมนูเพิ่มได้
};

export default function TeamHeaderMinimal({ title, onBack, right }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.bar}>
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="chevron-back" size={22} color={COLOR.sub} />
        </TouchableOpacity>

        <Text style={styles.title} numberOfLines={1}>{title}</Text>

        <View style={{ width: 22 }}>
          {right /* ถ้าไม่มี ก็ปล่อยไว้ให้บาลานซ์ความกว้าง */}
        </View>
      </View>
      <View style={styles.divider} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: COLOR.card,
    paddingTop: Platform.OS === 'ios' ? 10 : 0,
  },
  bar: {
    height: 48,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    flex: 1,
    textAlign: 'left',
    fontSize: 17,
    fontWeight: '900',
    color: COLOR.text,
  },
  divider: {
    height: 1,
    backgroundColor: COLOR.line,
  },
});
