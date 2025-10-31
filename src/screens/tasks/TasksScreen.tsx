import { BackgroundFX } from '@/src/components/Background';
import { useTheme } from '@/src/theme/useTheme';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useMemo, useState } from 'react';
import {
    Alert, FlatList, KeyboardAvoidingView, Platform, RefreshControl,
    StyleSheet, Text, TextInput, TouchableOpacity, View
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Segmented from './components/Segmented';
import SummaryCard from './components/SummaryCard';
import TaskFormModal from './components/TaskFormModal';
import TaskItem from './components/TaskItem';
import type { Priority, Task, TaskStatus } from './types';

const { theme, mode, toggleMode, THEME } = useTheme();
/* ========== Mock API (แทนด้วย service จริงของคุณได้ทันที) ========== */
const wait = (ms: number) => new Promise(r => setTimeout(r, ms));
const fakeDB: Task[] = [
  { id: '1', title: 'Dashboard design for admin', note: 'UI polish', status: 'REVIEW', priority:'HIGH', dueISO: '2025-10-31', comments: 5, attachments: 2, assignees: 3 },
  { id: '2', title: 'Konom web application', status: 'DOING', priority:'LOW', dueISO: '2025-11-14', comments: 2, attachments: 1, assignees: 2 },
  { id: '3', title: 'Research and development', status: 'TODO', priority:'MEDIUM', dueISO: '2025-11-01', comments: 6, attachments: 0, assignees: 2 },
  { id: '4', title: 'Event booking application', status: 'DONE', priority:'MEDIUM', dueISO: '2025-10-30', comments: 1, attachments: 0, assignees: 1 },
  { id: '5', title: 'Mobile app redesign', status: 'TODO', priority:'LOW', dueISO: '2025-11-15', comments: 0, attachments: 0, assignees: 1 }
];
const api = {
  list: async (): Promise<Task[]> => { await wait(250); return JSON.parse(JSON.stringify(fakeDB)); },
  create: async (t: Omit<Task,'id'>): Promise<Task> => { await wait(250); const created={...t,id:Date.now().toString()}; fakeDB.unshift(created); return created; },
  update: async (id: string, patch: Partial<Task>): Promise<Task> => { await wait(250); const i=fakeDB.findIndex(x=>x.id===id); if(i>=0) fakeDB[i]={...fakeDB[i],...patch}; return fakeDB[i]; },
  bulkRemove: async (ids: string[]) => { await wait(250); ids.forEach(id=>{const i=fakeDB.findIndex(x=>x.id===id); if(i>=0) fakeDB.splice(i,1);}); },
  remove: async (id: string) => { await wait(250); const i=fakeDB.findIndex(x=>x.id===id); if(i>=0) fakeDB.splice(i,1); },
};
/* ===================================================== */

export default function TasksScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'ALL' | TaskStatus>('ALL');
  const [sortKey, setSortKey] = useState<'DUE'|'PRIORITY'|'TITLE'>('DUE');

  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  // form state (modal)
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [fTitle, setFTitle] = useState(''); const [fNote, setFNote] = useState('');
  const [fStatus, setFStatus] = useState<TaskStatus>('TODO');
  const [fPriority, setFPriority] = useState<Priority>('MEDIUM');
  const [fDue, setFDue] = useState('');

  useEffect(() => { load(); }, []);
  const load = async () => {
    setRefreshing(true);
    try { setTasks(await api.list()); } finally { setRefreshing(false); }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = tasks.filter(t =>
      (filter==='ALL' || t.status===filter) &&
      (!q || t.title.toLowerCase().includes(q) || (t.note||'').toLowerCase().includes(q))
    );
    list = list.slice().sort((a,b) => {
      if (sortKey==='TITLE') return a.title.localeCompare(b.title);
      if (sortKey==='PRIORITY') {
        const w = { HIGH:3, MEDIUM:2, LOW:1 } as Record<Priority,number>;
        return (w[b.priority||'LOW'] - w[a.priority||'LOW']) || a.title.localeCompare(b.title);
      }
      const ad = a.dueISO||'9999-12-31', bd = b.dueISO||'9999-12-31';
      return ad.localeCompare(bd);
    });
    return list;
  }, [tasks, query, filter, sortKey]);

  const summary = useMemo(() => ({
    doing: tasks.filter(t=>t.status==='DOING').length,
    review: tasks.filter(t=>t.status==='REVIEW').length,
    hold: tasks.filter(t=>t.status==='TODO').length,
    done: tasks.filter(t=>t.status==='DONE').length,
  }), [tasks]);

  // ===== actions =====
  const openCreate = () => {
    setEditTask(null); setFTitle(''); setFNote(''); setFStatus('TODO'); setFPriority('MEDIUM'); setFDue('');
    setModalOpen(true);
  };
  const openEdit = (t: Task) => {
    setEditTask(t); setFTitle(t.title); setFNote(t.note||''); setFStatus(t.status); setFPriority(t.priority||'MEDIUM'); setFDue(t.dueISO||'');
    setModalOpen(true);
  };
  const saveForm = async () => {
    if (!fTitle.trim()) { Alert.alert('กรอกชื่องาน'); return; }
    const payload: Omit<Task,'id'> = { title:fTitle.trim(), note:fNote.trim(), status:fStatus, priority:fPriority, dueISO:fDue||undefined, comments:0, attachments:0, assignees:1 };
    if (editTask) {
      const updated = await api.update(editTask.id, payload);
      setTasks(prev => prev.map(t=>t.id===updated.id?updated:t));
    } else {
      const created = await api.create(payload);
      setTasks(prev => [created, ...prev]);
    }
    setModalOpen(false);
  };

  const toggleDone = async (t: Task) => {
    const next = t.status==='DONE' ? 'TODO' : 'DONE';
    const updated = await api.update(t.id, { status: next });
    setTasks(prev => prev.map(x=>x.id===t.id?updated:x));
  };
  const cycleStatus = async (t: Task) => {
    const seq: TaskStatus[] = ['TODO','DOING','REVIEW','DONE'];
    const next = seq[(seq.indexOf(t.status)+1)%seq.length];
    const updated = await api.update(t.id, { status: next });
    setTasks(prev => prev.map(x=>x.id===t.id?updated:x));
  };
  const removeOne = async (t: Task) => {
    await api.remove(t.id);
    setTasks(prev => prev.filter(x=>x.id!==t.id));
  };

  // bulk
  const toggleSelect = (id: string) => setSelected(s => ({ ...s, [id]: !s[id] }));
  const clearSelection = () => { setSelected({}); setSelectMode(false); };
  const bulkDelete = async () => {
    const ids = Object.keys(selected).filter(k=>selected[k]);
    if (ids.length===0) return;
    await api.bulkRemove(ids);
    setTasks(prev => prev.filter(t=>!ids.includes(t.id)));
    clearSelection();
  };
  const bulkStatus = async (status: TaskStatus) => {
    const ids = Object.keys(selected).filter(k=>selected[k]);
    await Promise.all(ids.map(id => api.update(id,{status})));
    setTasks(prev => prev.map(t=>ids.includes(t.id)?{...t,status}:t));
    clearSelection();
  };

  const SortButton = () => (
    <TouchableOpacity onPress={()=>{
      const order = ['DUE','PRIORITY','TITLE'] as const;
      const i = order.indexOf(sortKey); setSortKey(order[(i+1)%order.length]);
    }} style={styles.iconBtn}>
      <Ionicons name="filter-outline" size={18} color={theme.color.text} />
      <Text style={styles.iconBtnText}>
        {sortKey==='DUE'?'ครบกำหนด':sortKey==='PRIORITY'?'ความสำคัญ':'ชื่อ'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
        <BackgroundFX />
      <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':undefined} style={{ flex: 1 }}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoCircle}><Ionicons name="checkbox-outline" size={22} color={theme.color.primary}/></View>
            <Text style={styles.title}>Task List</Text>
            <View style={{ flex:1 }}/>
            <SortButton />
          </View>

          {/* Summary */}
          <View style={styles.summaryRow}>
            <SummaryCard color="#e0d864ff" icon="construct-outline" label="In Progress" value={summary.doing}/>
            <SummaryCard color="#E9D5FF" icon="eyedrop-outline" label="In Review" value={summary.review}/>
            <SummaryCard color="#FEF3C7" icon="pause-outline" label="On Hold" value={summary.hold}/>
            <SummaryCard color="#DCFCE7" icon="checkmark-done-outline" label="Completed" value={summary.done}/>
          </View>

          {/* Controls */}
          <View style={styles.controls}>
            <Segmented
              items={[
                {key:'ALL', label:'All'},
                {key:'TODO', label:'To Do'},
                {key:'DOING', label:'In Progress'},
                {key:'REVIEW', label:'In Review'},
                {key:'DONE', label:'Done'},
              ]}
              activeKey={filter}
              onChange={k=>setFilter(k as any)}
            />
            <View style={styles.searchWrap}>
              <Ionicons name="search-outline" size={16} color={theme.color.sub}/>
              <TextInput
                value={query} onChangeText={setQuery}
                placeholder="ค้นหางาน..." placeholderTextColor={theme.color.sub}
                style={styles.searchInput} returnKeyType="search"
              />
              {!selectMode ? (
                <TouchableOpacity onPress={()=>{ setSelectMode(true); setSelected({}); }} style={styles.iconBtn}>
                  <Ionicons name="checkbox" size={18} color={theme.color.text}/>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={clearSelection} style={styles.iconBtn}>
                  <Ionicons name="close-outline" size={20} color={theme.color.text}/>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Bulk bar */}
          {selectMode && (
            <View style={styles.bulkBar}>
              <Text style={styles.bulkText}>
                เลือกแล้ว {Object.values(selected).filter(Boolean).length} รายการ
              </Text>
              <View style={{ flex:1 }}/>
              <TouchableOpacity onPress={()=>bulkStatus('DONE')} style={styles.bulkBtn}>
                <Ionicons name="checkmark-done-outline" size={16} color="#fff"/><Text style={styles.bulkBtnText}>ทำเสร็จ</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={bulkDelete} style={[styles.bulkBtn,{ backgroundColor: theme.color.danger }]}>
                <Ionicons name="trash-outline" size={16} color="#fff"/><Text style={styles.bulkBtnText}>ลบ</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* List */}
          <FlatList
            data={filtered}
            keyExtractor={i=>i.id}
            renderItem={({item})=>(
              <TaskItem
                item={item}
                selectMode={selectMode}
                selected={!!selected[item.id]}
                onToggleSelect={toggleSelect}
                onToggleDone={toggleDone}
                onEdit={openEdit}
                onCycleStatus={cycleStatus}
                onRemove={removeOne}
              />
            )}
            contentContainerStyle={{ paddingBottom: 120 }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={load} />}
            ListEmptyComponent={<Text style={styles.empty}>ไม่พบงาน</Text>}
          />

          {/* FAB */}
          <TouchableOpacity onPress={openCreate} activeOpacity={0.9} style={styles.fab}>
            <LinearGradient colors={[theme.color.primary, theme.color.teal]} style={styles.fabInner}>
              <Ionicons name="add" size={26} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Modal */}
      <TaskFormModal
        visible={modalOpen}
        onClose={()=>setModalOpen(false)}
        onSave={saveForm}
        editTask={editTask}
        fTitle={fTitle} setFTitle={setFTitle}
        fNote={fNote} setFNote={setFNote}
        fStatus={fStatus} setFStatus={setFStatus}
        fPriority={fPriority} setFPriority={setFPriority}
        fDue={fDue} setFDue={setFDue}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, padding:16, paddingTop: Platform.OS === 'ios' ? 64 : 52, },
  header:{ flexDirection:'row', alignItems:'center', gap:10, marginBottom:12 },
  logoCircle:{
    width:36, height:36, borderRadius:18, backgroundColor:'#fff', alignItems:'center', justifyContent:'center',
    shadowColor:'#000', shadowOpacity:0.06, shadowRadius:8, shadowOffset:{ width:0, height:4 }, elevation:2,
  },
  title:{ fontSize:22, fontWeight:'800', color:theme.color.text },

  iconBtn:{ flexDirection:'row', alignItems:'center', gap:6, paddingHorizontal:10, paddingVertical:6, borderRadius:999, backgroundColor:'#fff', borderWidth:1, borderColor:theme.color.line },
  iconBtnText:{ color:theme.color.text, fontWeight:'700', fontSize:12 },

  summaryRow:{ flexDirection:'row', gap:10, marginBottom:12 },

  controls:{ gap:10, marginBottom:8 },
  searchWrap:{ flexDirection:'row', alignItems:'center', gap:8, backgroundColor:'#fff', borderRadius:16, paddingHorizontal:12, height:44, borderWidth:1, borderColor:theme.color.line },
  searchInput:{ flex:1, color:theme.color.text },

  bulkBar:{ flexDirection:'row', alignItems:'center', gap:10, backgroundColor:'#fff', padding:10, borderRadius:12, borderWidth:1, borderColor:theme.color.line, marginBottom:8 },
  bulkText:{ color:theme.color.text, fontWeight:'700' },
  bulkBtn:{ flexDirection:'row', alignItems:'center', gap:6, backgroundColor:theme.color.success, paddingHorizontal:12, paddingVertical:8, borderRadius:999 },
  bulkBtnText:{ color:'#fff', fontWeight:'800' },

  empty:{ textAlign:'center', color:theme.color.sub, paddingVertical:20 },

  fab:{ position:'absolute', right:18, bottom:28 },
  fabInner:{ width:56, height:56, borderRadius:28, alignItems:'center', justifyContent:'center',
    shadowColor:'#000', shadowOpacity:0.25, shadowRadius:6, shadowOffset:{ width:0, height:3 }, },
});
