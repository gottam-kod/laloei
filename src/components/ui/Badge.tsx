import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function Badge({ text, color = 'sky' }: { text: string; color?: 'sky' | 'green' | 'orange' }) {
  const colorMap = {
    sky: { bg: '#E0F2FE', text: '#0369A1' },
    green: { bg: '#D1FAE5', text: '#065F46' },
    orange: { bg: '#FEF3C7', text: '#92400E' },
  }[color];
  return (
    <View style={[styles.badge, { backgroundColor: colorMap.bg }]}>
      <Text style={[styles.text, { color: colorMap.text }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});
