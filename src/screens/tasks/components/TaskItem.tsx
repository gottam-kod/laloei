import { useTheme } from '@/src/theme/useTheme';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import type { Task } from '../types';


const statusToColor = (s: Task['status']) =>
  s === 'DONE' ? theme.color.success : s === 'REVIEW' ? theme.color.bgTopA : s === 'DOING' ? theme.color.bgTopB : theme.color.danger;

const chip = (backgroundColor: string) => ({
  backgroundColor,
  borderRadius: 999,
  paddingHorizontal: 8,
  paddingVertical: 4,
});

const { theme, mode, toggleMode, THEME } = useTheme();
export default function TaskItem({
  item,
  selectMode,
  selected,
  onToggleSelect,
  onToggleDone,
  onEdit,
  onCycleStatus,
  onRemove,
}: {
  item: Task;
  selectMode: boolean;
  selected: boolean;
  onToggleSelect: (id: string) => void;
  onToggleDone: (t: Task) => void;
  onEdit: (t: Task) => void;
  onCycleStatus: (t: Task) => void;
  onRemove: (t: Task) => void;
}) {

  return (
    <View style={styles.taskCard}>
      <View style={styles.taskHead}>
        {selectMode ? (
          <TouchableOpacity
            onPress={() => onToggleSelect(item.id)}
            style={[styles.selBox, selected && { backgroundColor: theme.color.primary, borderColor: theme.color.primary }]}
          >
            {selected && <Ionicons name="checkmark" size={16} color="#fff" />}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => onToggleDone(item)}
            style={[styles.chkBox, item.status === 'DONE' && { backgroundColor: theme.color.success, borderColor: theme.color.success }]}
          >
            {item.status === 'DONE' && <Ionicons name="checkmark" size={14} color="#fff" />}
          </TouchableOpacity>
        )}

        <View style={{ flex: 1, paddingRight: 8 }}>
          <Text
            style={[styles.taskTitle, item.status === 'DONE' && { textDecorationLine: 'line-through', opacity: 0.6 }]}
            numberOfLines={2}
          >
            {item.title}
          </Text>
          {!!item.note && <Text style={styles.taskNote} numberOfLines={1}>{item.note}</Text>}
        </View>

        <TouchableOpacity onPress={() => onEdit(item)} style={styles.roundIcon}>
          <Ionicons name="ellipsis-horizontal" size={18} color={theme.color.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.taskMeta}>
        <View style={chip(statusToColor(item.status))}>
          <Text style={styles.chipText}>
            {item.status === 'TODO' ? 'To Do' : item.status === 'DOING' ? 'In Progress' : item.status === 'REVIEW' ? 'In Review' : 'Done'}
          </Text>
        </View>
        <View style={chip('#a9de46ff')}>
          <Text style={[styles.chipText, { color: theme.color.text }]}>{item.priority || 'MEDIUM'}</Text>
        </View>
        {!!item.dueISO && (
          <View style={styles.metaRow}>
            <Ionicons name="calendar-outline" size={14} color={theme.color.sub} />
            <Text style={styles.metaText}>{item.dueISO}</Text>
          </View>
        )}
        <View style={{ flex: 1 }} />
        <TouchableOpacity onPress={() => onCycleStatus(item)} style={styles.metaIcon}>
          <Ionicons name="repeat-outline" size={16} color={theme.color.text} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onRemove(item)} style={styles.metaIcon}>
          <Ionicons name="trash-outline" size={16} color={theme.color.danger} />
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  taskCard: {
    borderRadius: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: theme.color.line,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
    backgroundColor: '#fff',
  },
  metaText: { color: theme.color.sub, fontSize: 12 },
  taskHead: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  chkBox: { width: 20, height: 20, borderRadius: 6, borderWidth: 2, borderColor: theme.color.success, alignItems: 'center', justifyContent: 'center' },
  selBox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: theme.color.primary, alignItems: 'center', justifyContent: 'center' },
  taskTitle: { color: theme.color.text, fontWeight: '800' },
  taskNote: { color: theme.color.sub, fontSize: 12, marginTop: 2 },
  roundIcon: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: theme.color.line },

  taskMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#fff', borderRadius: 999, paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1, borderColor: theme.color.line },
  metaIcon: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: theme.color.line },
  chipText: { color: '#fff', fontWeight: '800', fontSize: 12 },
});
