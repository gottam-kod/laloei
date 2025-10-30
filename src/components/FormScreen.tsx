// src/components/FormScreen.tsx
import React from 'react';
import { Platform, SafeAreaView, KeyboardAvoidingView, ScrollView, StyleSheet, View, Text } from 'react-native';

type Props = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  headerRight?: React.ReactNode;
  contentPadding?: number;
};

export default function FormScreen({ title, subtitle, children, headerRight, contentPadding = 18 }: Props) {
  const Header = (
    <View style={S.header}>
      <View style={{ flex: 1 }}>
        <Text style={S.headerTitle}>{title}</Text>
        {subtitle ? <Text style={S.headerSub}>{subtitle}</Text> : null}
      </View>
      {headerRight}
    </View>
  );

  const Body = (
    <ScrollView
      contentContainerStyle={[S.scrollContent, { padding: contentPadding, paddingTop: 28 }]}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  );

  return (
    <SafeAreaView style={S.root}>
      {Platform.OS === 'ios' ? (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
          {Header}
          {Body}
        </KeyboardAvoidingView>
      ) : (
        <>
          {Header}
          {Body}
        </>
      )}
    </SafeAreaView>
  );
}

const S = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F7F9FC' },
  header: {
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: '#E6E8EC',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#0B1220' },
  headerSub: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  scrollContent: {},
});
