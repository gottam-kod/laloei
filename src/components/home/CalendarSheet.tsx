import { COLOR } from '@/src/theme/token';
import React from 'react';
import { Text, View } from 'react-native';
import SimpleSheet from './SimpleSheet';
export default function CalendarSheet({ visible, onClose }: { visible:boolean; onClose:()=>void }) {
  return (
    <SimpleSheet visible={visible} title="ปฏิทินการลา" onClose={onClose}>
      <View><Text style={{ color: COLOR.text }}>— ใส่ปฏิทินจริง/รายการวันลาในอนาคตได้ที่นี่ —</Text></View>
    </SimpleSheet>
  );
}
