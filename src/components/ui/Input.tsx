import React from 'react';
import { TextInput, StyleSheet, ViewStyle } from 'react-native';

export function Input({ style, ...props }: any) {
  return (
    <TextInput
      {...props}
      style={[styles.input, style]}
      placeholderTextColor="#94A3B8"
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#0F172A',
  },
});
