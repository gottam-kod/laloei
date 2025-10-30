import { COLOR } from '@/src/theme/token';
import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

type Props = { visible: boolean; title: string; onClose: () => void; children?: React.ReactNode };
export default function SimpleSheet({ visible, title, onClose, children }: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.head}>
            <Text style={styles.title}>{title}</Text>
            <Pressable onPress={onClose}><Text style={styles.link}>ปิด</Text></Pressable>
          </View>
          <View style={{ paddingTop: 6 }}>{children}</View>
        </View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  overlay: { flex:1, justifyContent:'flex-end', backgroundColor:'rgba(0,0,0,0.25)' },
  sheet: { backgroundColor:COLOR.card, borderTopLeftRadius:18, borderTopRightRadius:18, padding:16, borderWidth:1, borderColor:COLOR.line, maxHeight:'80%' },
  handle: { width:40, height:4, borderRadius:4, backgroundColor:'#CBD5E1', alignSelf:'center', marginBottom:10 },
  head: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:6 },
  title: { fontSize:16, fontWeight:'900', color:COLOR.text },
  link: { color:'#0B8AD9', fontWeight:'800' },
});
