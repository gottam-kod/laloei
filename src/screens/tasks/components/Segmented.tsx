import { useTheme } from '@/src/theme/useTheme';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { theme, mode, toggleMode, THEME } = useTheme();

type Item = { key: string; label: string };
export default function Segmented({
  items, activeKey, onChange,
}: { items: Item[]; activeKey: string; onChange: (k: string) => void }) {
  return (
    <View style={styles.segment}>
      {items.map((it) => {
        const active = it.key === activeKey;
        return (
          <TouchableOpacity
            key={it.key}
            onPress={() => onChange(it.key)}
            style={[styles.segBtn, active && styles.segBtnActive]}
          >
            <Text style={[styles.segText, active && styles.segTextActive]}>{it.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  segment: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    backgroundColor: theme.color.bgTopA,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: theme.color.bgTopA,
    padding: 6,
    gap: 6,
  },
  segBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 999 },
  segBtnActive: { backgroundColor: '#fff', borderWidth: 1, borderColor: theme.color.line },
  segText: { color: theme.color.sub, fontWeight: '700' },
  segTextActive: { color: theme.color.text },
});
