// src/components/LeaveTypePicker.tsx
import React, { useMemo, useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Modal,
  FlatList, TextInput, ScrollView, ActivityIndicator,
  Animated, Dimensions, PanResponder, KeyboardAvoidingView, Platform, TouchableWithoutFeedback
} from 'react-native';
import { FONT } from '../theme/token';
import { useTranslation } from 'react-i18next';

type Option = { id: string | number; name: string };

type Props = {
  label?: string;
  options: Option[];
  value?: string | number | null;
  onChange: (id: string | number) => void;
  isFetching?: boolean;
  /** แสดงชิปยอดนิยมกี่ตัว (ที่เหลือไปอยู่ใน "เพิ่มเติม…") */
  topN?: number;
  /** เรียงจากขวา → ซ้าย (สำหรับ UI ภาษาไทยที่อยากเริ่มจากขวา) */
  rtl?: boolean;
  colors?: {
    primary: string; text: string; sub: string; border: string; card: string;
  };
  spacing?: { sm: number; md: number; lg: number; radius: { md: number; lg: number } };
};

export default function LeaveTypePicker({
  label = 'ประเภทการลา',
  options,
  value,
  onChange,
  isFetching,
  topN = 4,
  rtl = false,
  colors = {
    primary: '#0EA5E9', text: '#0F172A', sub: '#64748B', border: '#E2E8F0', card: '#FFFFFF'
  },
  spacing = { sm: 8, md: 12, lg: 16, radius: { md: 12, lg: 16 } }
}: Props) {

  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');

  const top = useMemo(() => options.slice(0, Math.min(topN, options.length)), [options, topN]);
  const rest = useMemo(() => options.slice(Math.min(topN, options.length)), [options, topN]);

  const filtered = useMemo(() => {
    const keyword = q.trim().toLowerCase();
    if (!keyword) return options;
    return options.filter(o => o.name.toLowerCase().includes(keyword));
  }, [options, q]);

  // ===== Bottom Sheet Animations =====
  const SHEET_MAX_HEIGHT = Math.min(Dimensions.get('window').height * 0.78, 620);
  const translateY = useRef(new Animated.Value(SHEET_MAX_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  const openSheet = () => {
    setOpen(true);
    Animated.parallel([
      Animated.timing(translateY, { toValue: 0, duration: 220, useNativeDriver: true }),
      Animated.timing(backdropOpacity, { toValue: 1, duration: 180, useNativeDriver: true }),
    ]).start();
  };
  const closeSheet = () => {
    Animated.parallel([
      Animated.timing(translateY, { toValue: SHEET_MAX_HEIGHT, duration: 200, useNativeDriver: true }),
      Animated.timing(backdropOpacity, { toValue: 0, duration: 160, useNativeDriver: true }),
    ]).start(({ finished }) => finished && setOpen(false));
  };

  // drag to dismiss
  const dragY = useRef(new Animated.Value(0)).current;
  const pan = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, g) => {
      if (g.dy > 0) { dragY.setValue(g.dy); }
    },
    onPanResponderRelease: (_, g) => {
      if (g.dy > 140 || g.vy > 0.8) {
        closeSheet();
      } else {
        Animated.timing(dragY, { toValue: 0, duration: 160, useNativeDriver: true }).start();
      }
    },
  });

  const sheetTranslate = Animated.add(translateY, dragY).interpolate({
    inputRange: [0, SHEET_MAX_HEIGHT],
    outputRange: [0, SHEET_MAX_HEIGHT],
    extrapolate: 'clamp',
  });

  // ===== Render =====
  return (
    <View style={{ gap: spacing.sm }}>
      <Text style={{ fontWeight: '700', color: colors.text, fontFamily: FONT.heading }}>{label}</Text>

      {/* แถวชิปยอดนิยม + ปุ่มเพิ่มเติม */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.chipsRow,
          { flexDirection: rtl ? 'row-reverse' : 'row', gap: spacing.sm, paddingRight: spacing.sm, alignItems: 'center' }
        ]}
      >
        {isFetching && <ActivityIndicator size="small" color={colors.primary} />}

        {top.length === 0 ? (
          <Text style={{ color: colors.sub, fontWeight: '800', fontFamily: FONT.body }}>ยังไม่มีชนิดลา</Text>
        ) : top.map(t => {
          const active = value === t.id;
          return (
            <TouchableOpacity
              key={String(t.id)}
              onPress={() => onChange(t.id)}
              activeOpacity={0.9}
              style={[
                styles.chip,
                { borderColor: colors.border, backgroundColor: colors.card, borderRadius: spacing.radius.md, paddingVertical: 10, paddingHorizontal: 14 },
                active && { backgroundColor: colors.primary, borderColor: colors.primary }
              ]}
            >
              <Text style={[{ color: colors.text, fontWeight: '600', fontFamily: FONT.body }, active && { color: '#fff' }]}>{t.name}</Text>
            </TouchableOpacity>
          );
        })}

        {rest.length > 0 && (
          <TouchableOpacity
            onPress={openSheet}
            activeOpacity={0.9}
            style={[
              styles.chip,
              { borderColor: colors.border, backgroundColor: colors.card, borderRadius: spacing.radius.md, paddingVertical: 10, paddingHorizontal: 14 }
            ]}
          >
            <Text style={{ color: colors.sub, fontWeight: '700', fontFamily: FONT.body }}>{t('common.more')}...</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Bottom Sheet Modal */}
      <Modal visible={open} transparent onRequestClose={closeSheet} animationType="none" statusBarTranslucent>
        {/* Backdrop */}
        <TouchableWithoutFeedback onPress={closeSheet}>
          <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]} />
        </TouchableWithoutFeedback>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.fill}>
          <Animated.View
            style={[
              styles.sheet,
              { height: SHEET_MAX_HEIGHT, transform: [{ translateY: sheetTranslate }] }
            ]}
            {...pan.panHandlers}
          >
            {/* Grabber */}
            <View style={styles.grabberWrap}>
              <View style={styles.grabber} />
            </View>

            {/* Header + Search */}
            <View style={[styles.sheetHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.sheetTitle, { color: colors.text, fontFamily: FONT.body }]}>เลือกประเภทการลา</Text>
              <TextInput
                placeholder="พิมพ์ค้นหา…"
                value={q}
                onChangeText={setQ}
                style={[
                  styles.searchBox,
                  { borderColor: colors.border, color: colors.text, fontFamily: FONT.body}
                ]}
                placeholderTextColor={colors.sub}
              />
            </View>

            {/* List */}
            <FlatList
              data={filtered}
              keyExtractor={item => String(item.id)}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => {
                const active = value === item.id;
                return (
                  <TouchableOpacity
                    onPress={() => { onChange(item.id); closeSheet(); }}
                    activeOpacity={0.9}
                    style={[
                      styles.row,
                      { backgroundColor: active ? '#F0F9FF' : '#fff', borderBottomColor: '#F1F5F9' }
                    ]}
                  >
                    <Text style={{ color: colors.text, fontWeight: active ? '800' : '400' , fontFamily: FONT.body }}>
                      {item.name}{active ? ' ✓' : ''}
                    </Text>
                  </TouchableOpacity>
                );
              }}
              ListEmptyComponent={
                <View style={{ padding: 20 }}>
                  <Text style={{ color: colors.sub, fontFamily: FONT.body }}>ไม่พบรายการ</Text>
                </View>
              }
              contentContainerStyle={{ paddingBottom: 12 }}
            />

            {/* Footer */}
            <View style={styles.footer}>
              <TouchableOpacity onPress={closeSheet} style={styles.flatBtn}>
                <Text style={{ color: colors.sub, fontWeight: '700', fontFamily: FONT.body}}>ปิด</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  chipsRow: { paddingVertical: 6 },
  chip: { borderWidth: 1 },

  // modal/sheet
  fill: { flex: 1, justifyContent: 'flex-end' },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.35)',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  grabberWrap: { alignItems: 'center', paddingTop: 8, paddingBottom: 4 },
  grabber: { width: 42, height: 5, borderRadius: 3, backgroundColor: '#E2E8F0' },

  sheetHeader: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: 8,
    borderBottomWidth: 1,
    backgroundColor: '#fff',
  },
  sheetTitle: { fontSize: 16, fontWeight: '800', marginBottom: 8 },
  searchBox: {
    borderWidth: 1, borderRadius: 12,
    paddingHorizontal: 12, paddingVertical: 10,
  },

  row: {
    paddingVertical: 14, paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  footer: {
    paddingHorizontal: 12, paddingVertical: 10,
    alignItems: 'flex-end', backgroundColor: '#fff',
  },

  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', padding: 24 },
  modalBox: { overflow: 'hidden' },
  flatBtn: { paddingVertical: 10, paddingHorizontal: 16 },
});
