import { COLOR, UI } from '@/src/theme/token';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import SimpleSheet from './SimpleSheet';

export default function ApprovalsSheet({ visible, onClose }: { visible:boolean; onClose:()=>void }) {
  return (
    <SimpleSheet visible={visible} title="อนุมัติคำขอ" onClose={onClose}>
      <View style={{ rowGap: 10 }}>
        <Text style={{ color: COLOR.text, fontWeight:'700' }}>คำขอ #1024 — ลากิจ 1 วัน</Text>
        <View style={{ flexDirection:'row', columnGap:10 }}>
          <Pressable style={{ backgroundColor:COLOR.success, paddingVertical:10, paddingHorizontal:16, borderRadius:UI.radius.pill }}>
            <Text style={{ color:'#fff', fontWeight:'900' }}>อนุมัติ</Text>
          </Pressable>
          <Pressable style={{ backgroundColor:COLOR.danger, paddingVertical:10, paddingHorizontal:16, borderRadius:UI.radius.pill }}>
            <Text style={{ color:'#fff', fontWeight:'900' }}>ปฏิเสธ</Text>
          </Pressable>
        </View>
      </View>
    </SimpleSheet>
  );
}
