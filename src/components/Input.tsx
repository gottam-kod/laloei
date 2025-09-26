import React from 'react';
import { TextInput, View, Text, ViewStyle } from 'react-native';
import { COLOR, RADIUS } from '../theme';

type Props = {
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (t: string) => void;
  secureTextEntry?: boolean;
  style?: ViewStyle;
};

const Input: React.FC<Props> = ({ label, placeholder, value, onChangeText, secureTextEntry, style }) => {
  return (
    <View style={[{ marginBottom: 12 }, style]}>
      {!!label && <Text style={{ marginBottom: 6, color: COLOR.textSecondary, fontWeight: '600' }}>{label}</Text>}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        placeholderTextColor="#94a3b8"
        style={{
          paddingVertical: 12,
          paddingHorizontal: 14,
          borderRadius: RADIUS.md,
          backgroundColor: 'white',
          borderWidth: 1,
          borderColor: COLOR.border,
          color: COLOR.text
        }}
      />
    </View>
  );
};

export default Input;
