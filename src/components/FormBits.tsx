// src/components/FormBits.tsx
import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export function Field(props: {
  iconLeft?: React.ReactNode;
  placeholder?: string;
  value: string;
  onChangeText: (v: string) => void;
  onFocus?: () => void;
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: any;
  returnKeyType?: any;
}) {
  const { iconLeft, ...rest } = props;
  return (
    <View style={{ marginTop: 10 }}>
      <View style={S.inputWrap}>
        {!!iconLeft && <View style={S.iconLeft}>{iconLeft}</View>}
        <TextInput
          {...rest}
          style={S.input}
          placeholderTextColor="#9AA3AF"
          autoCorrect={false}
        />
      </View>
    </View>
  );
}

export function Row2({ left, right }: { left: React.ReactNode; right: React.ReactNode }) {
  return (
    <View style={{ flexDirection: 'row', gap: 10 }}>
      <View style={{ flex: 1 }}>{left}</View>
      <View style={{ flex: 1 }}>{right}</View>
    </View>
  );
}

export function Divider({ title }: { title: string }) {
  return (
    <View style={{ marginTop: 16, marginBottom: 6, flexDirection: 'row', alignItems: 'center' }}>
      <Text style={{ fontSize: 13, fontWeight: '800', color: '#0B1220' }}>{title}</Text>
      <View style={{ flex: 1, height: 1, backgroundColor: '#E6E8EC', marginLeft: 8, opacity: 0.6 }} />
    </View>
  );
}

export function TogglePill({ active, label, onPress }: { active: boolean; label: string; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
      <View style={[
        S.inputWrap,
        { backgroundColor: active ? '#0EA5E9' : '#fff', borderColor: active ? '#0EA5E9' : '#E6E8EC', alignItems: 'center', justifyContent: 'center' }
      ]}>
        <Text style={{ color: active ? '#fff' : '#0B1220', fontWeight: '700' }}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
}

const S = StyleSheet.create({
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E6E8EC',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    height: 52,
  },
  iconLeft: { marginRight: 8 },
  input: { flex: 1, fontSize: 16, color: '#0B1220' },
});
