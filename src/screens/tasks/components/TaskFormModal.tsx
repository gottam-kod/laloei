import { useTheme } from '@/src/theme/useTheme';
import React from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import type { Priority, Task, TaskStatus } from '../types';
const { theme, mode, toggleMode, THEME } = useTheme();
function Field({ label, children }:{ label:string; children:React.ReactNode }) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {children}
    </View>
  );
}

function RowChips({ items, active, onChange }:{ items:string[]; active:string; onChange:(v:string)=>void; }) {
  return (
    <View style={{ flexDirection:'row', flexWrap:'wrap', gap:8 }}>
      {items.map(it=>{
        const a = it===active;
        return (
          <TouchableOpacity key={it} onPress={()=>onChange(it)} style={[{ backgroundColor: a?theme.color.primary:'#EEF2FF', borderRadius: 16 }, { paddingHorizontal:12, paddingVertical:6 }]}>
            <Text style={[styles.chipText, a && { color:'#fff' }]}>{it}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function TaskFormModal({
  visible, onClose, onSave,
  editTask,
  fTitle, setFTitle,
  fNote, setFNote,
  fStatus, setFStatus,
  fPriority, setFPriority,
  fDue, setFDue,
}: {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
  editTask: Task|null;
  fTitle: string; setFTitle: (v:string)=>void;
  fNote: string; setFNote: (v:string)=>void;
  fStatus: TaskStatus; setFStatus: (v:TaskStatus)=>void;
  fPriority: Priority; setFPriority: (v:Priority)=>void;
  fDue: string; setFDue: (v:string)=>void;
}) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalBack}>
        <View style={styles.modalCard}>
          <View style={styles.modalHead}>
            <Text style={styles.modalTitle}>{editTask?'แก้ไขงาน':'สร้างงานใหม่'}</Text>
            <TouchableOpacity onPress={onClose} style={styles.roundIcon}><Ionicons name="close" size={20} color={theme.color.text}/></TouchableOpacity>
          </View>

          <Field label="ชื่อเรื่อง">
            <TextInput value={fTitle} onChangeText={setFTitle} placeholder="เช่น อัปเดตนโยบายลางาน"
              style={styles.input} placeholderTextColor={theme.color.sub}/>
          </Field>

          <Field label="หมายเหตุ">
            <TextInput value={fNote} onChangeText={setFNote} placeholder="รายละเอียดเพิ่มเติม"
              style={styles.input} placeholderTextColor={theme.color.sub}/>
          </Field>

          <Field label="สถานะ">
            <RowChips items={['TODO','DOING','REVIEW','DONE']} active={fStatus} onChange={(v)=>setFStatus(v as TaskStatus)} />
          </Field>

          <Field label="ความสำคัญ">
            <RowChips items={['LOW','MEDIUM','HIGH']} active={fPriority} onChange={(v)=>setFPriority(v as Priority)} />
          </Field>

          <Field label="ครบกำหนด (YYYY-MM-DD)">
            <TextInput value={fDue} onChangeText={setFDue} placeholder="2025-11-30"
              style={styles.input} placeholderTextColor={theme.color.sub}/>
          </Field>

          <TouchableOpacity onPress={onSave} style={styles.saveBtn}>
            <Ionicons name="save-outline" size={18} color="#fff" /><Text style={styles.saveText}>บันทึก</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBack:{ flex:1, backgroundColor:'rgba(0,0,0,0.25)', alignItems:'center', justifyContent:'flex-end' },
  modalCard:{ width:'100%', backgroundColor:'#fff', borderTopLeftRadius:22, borderTopRightRadius:22, padding:16, borderWidth:1, borderColor:theme.color.line },
  modalHead:{ flexDirection:'row', alignItems:'center', marginBottom:8 },
  modalTitle:{ fontWeight:'800', fontSize:16, color:theme.color.text, flex:1 },
  roundIcon:{ width:32, height:32, borderRadius:16, alignItems:'center', justifyContent:'center', backgroundColor:'#fff', borderWidth:1, borderColor:theme.color.line },

  fieldLabel:{ color:theme.color.text, fontWeight:'700', marginBottom:6 },
  input:{ height:44, borderWidth:1, borderColor:theme.color.line, borderRadius:16, paddingHorizontal:12, color:theme.color.text, backgroundColor:theme.color.brand },

  saveBtn:{ marginTop:8, backgroundColor:theme.color.primary, borderRadius:12, height:48, alignItems:'center', justifyContent:'center', flexDirection:'row', gap:8 },
  saveText:{ color:'#fff', fontWeight:'800' },
  chipText:{ color:'#fff', fontWeight:'800', fontSize:12 },
});
