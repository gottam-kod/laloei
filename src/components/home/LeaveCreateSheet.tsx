import { COLOR, UI } from '@/src/theme/token';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import SimpleSheet from './SimpleSheet';

type Props = { visible: boolean; onClose: () => void };
export default function LeaveCreateSheet({ visible, onClose }: Props) {
  const [reason, setReason] = useState('');
  return (
    <SimpleSheet visible={visible} title="ขอลา" onClose={onClose}>
      <View style={{ rowGap: 10 }}>
        <Text style={styles.label}>เหตุผลการลา</Text>
        <TextInput
          placeholder="กรอกเหตุผล…"
          value={reason}
          onChangeText={setReason}
          style={styles.input}
          placeholderTextColor={COLOR.sub}
        />
        <Pressable style={styles.btn} onPress={() => { /* TODO: call API */ onClose(); }}>
          <Text style={styles.btnTxt}>ส่งคำขอ</Text>
        </Pressable>
      </View>
    </SimpleSheet>
  );
}
const styles = StyleSheet.create({
  label:{ color:COLOR.text, fontWeight:'800' },
  input:{ backgroundColor:'#F1F5F9', borderRadius:UI.radius.xl, padding:12, borderWidth:1, borderColor:'#E2E8F0', color:COLOR.text },
  btn:{ backgroundColor:'#0B8AD9', paddingVertical:12, borderRadius:UI.radius.pill, alignItems:'center' },
  btnTxt:{ color:'#fff', fontWeight:'900' },
});
