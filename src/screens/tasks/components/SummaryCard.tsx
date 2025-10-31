import { useTheme } from '@/src/theme/useTheme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';


const { theme, mode, toggleMode, THEME } = useTheme();
export default function SummaryCard({
  color, icon, label, value,
}: { color: string; icon: string; label: string; value: number }) {
  return (
    <View style={[styles.summaryCard, { backgroundColor: color }]}>
      <View style={styles.summaryIcon}>
        <Ionicons name={icon as any} size={16} color={theme.color.text} />
      </View>
      <Text style={styles.summaryValue}>{value}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  summaryCard: {
    flex: 1,
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: theme.color.line,
  },
  summaryIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  summaryValue: { fontSize: 18, fontWeight: '800', color: theme.color.text },
  summaryLabel: { fontSize: 12, color: theme.color.sub },
});
