import React from 'react';
import { View, StyleSheet } from 'react-native';

type Props = {
  length: number;          // จำนวนหลักของ PIN/OTP (เช่น 6)
  filled: number;          // จำนวนหลักที่ผู้ใช้กรอกแล้ว
  cols?: number;           // จำนวนคอลัมน์ (ดีฟอลต์ 3)
  size?: number;           // เส้นผ่านศูนย์กลางจุด
  gap?: number;            // ระยะห่างระหว่างจุด
};

export default function PinDotsGrid({ length, filled, cols = 3, size = 14, gap = 12 }: Props) {
  const rows = Math.ceil(length / cols);
//   const items = Array.from({ length }).map((_, i) => i);

  return (
    <View style={S.container}>
      {Array.from({ length: rows }).map((_, rIdx) => {
        const start = rIdx * cols;
        const rowItems = Array.from({ length: cols }).map((_, cIdx) => start + cIdx);

        return (
          <View key={`row-${rIdx}`} style={S.row}>
            {rowItems.map((i) => {
              const isPlaceholder = i >= length;
              const isFilled = !isPlaceholder && i < filled;
              return (
                <View key={i} style={[S.box, { width: size + gap, height: size + gap }]}>
                  <View
                    style={[
                      S.dot,
                      { width: size, height: size, borderRadius: size / 2 },
                      isFilled && S.dotFilled,
                      isPlaceholder && { opacity: 0 },
                    ]}
                  />
                </View>
              );
            })}
          </View>
        );
      })}
    </View>
  );
}

const S = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: 12 },
  row: { flexDirection: 'row', justifyContent: 'center' },
  box: { alignItems: 'center', justifyContent: 'center' },
  dot: { backgroundColor: '#E3EEF6' },
  dotFilled: { backgroundColor: '#16B6A2' },
});