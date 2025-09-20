import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export type QuickActionProps = {
  emoji: string;
  label: string;
  onPress?: () => void;
  disabled?: boolean;
};

const QuickAction: React.FC<QuickActionProps> = ({ emoji, label, onPress, disabled }) => {
  return (
    <TouchableOpacity
      style={styles.wrap}
      onPress={onPress}
      activeOpacity={0.85}
      disabled={disabled}
    >
      <View style={styles.icon}>
        <Text style={styles.emoji}>{emoji}</Text>
      </View>
      <Text style={styles.label} numberOfLines={1}>{label}</Text>
    </TouchableOpacity>
  );
};

export default memo(QuickAction);

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', width: 72 },
  icon: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: '#16BFD6',
    alignItems: 'center', justifyContent: 'center',
  },
  emoji: { fontSize: 26 },
  label: { marginTop: 8, fontSize: 12, fontWeight: '600', color: '#1F2A37' },
});
