// components/LanguageSheet.tsx
import React from 'react';
import { Modal, View, Pressable, Text, StyleSheet } from 'react-native';
import { LOCALES } from '../utails/local';

type Props = {
  title?: string;
  visible: boolean;
  value: string; // 'th' | 'en'
  action?: string; // ปุ่มปิด
  onClose: () => void;
  onSelect: (lang: string) => void;
};



export default function LanguageSheet({title , visible, value, action, onClose, onSelect }: Props) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={s.backdrop} onPress={onClose} />
      <View style={s.sheet}>
        <Text style={s.title}>{title}</Text>
        {LOCALES.map(item => {
          const active = item.lang === value;
          return (
            <Pressable key={item.lang} style={[s.row, active && s.active]} onPress={() => onSelect(item.lang)}>
              <Text style={s.rowText}>{item.label}</Text>
              {active && <Text>✓</Text>}
            </Pressable>
          );
        })}
        <Pressable style={s.closeBtn} onPress={onClose}><Text style={s.closeText}>{action}</Text></Pressable>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: '#0006' },
  sheet: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#fff', padding: 16, borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  row: { paddingVertical: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowText: { fontSize: 16 },
  active: { backgroundColor: '#f3f4f6' },
  closeBtn: { marginTop: 8, alignSelf: 'flex-end', paddingVertical: 8, paddingHorizontal: 12 },
  closeText: { color: '#2563eb', fontWeight: '600' },
});
