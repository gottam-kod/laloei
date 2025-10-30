// screens/TeamStructureScreen.tsx
import React, { useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  FlatList, Alert, ListRenderItem,
} from 'react-native';

type RoleKey = 'owner' | 'admin' | 'hr' | 'manager' | 'employee';
type Member = {
  id: string;
  name: string;
  email: string;
  role: RoleKey;
  deptId?: string;
  joinedAt: string;
  status?: 'active' | 'pending';
};
type Department = {
  id: string;
  name: string;
  parentId?: string | null;
};
type TabKey = 'members' | 'departments' | 'roles' | 'org';

const MOCK_DEPTS: Department[] = [
  { id: 'd_root', name: 'บริษัท ลาเลย', parentId: null },
  { id: 'd_hr', name: 'ฝ่ายบุคคล (HR)', parentId: 'd_root' },
  { id: 'd_eng', name: 'วิศวกรรม', parentId: 'd_root' },
  { id: 'd_fe', name: 'Frontend', parentId: 'd_eng' },
  { id: 'd_be', name: 'Backend', parentId: 'd_eng' },
  { id: 'd_sales', name: 'การขาย', parentId: 'd_root' },
];

const MOCK_MEMBERS: Member[] = [
  { id: 'u1', name: 'โยธารักษ์ ผลาโชติ', email: 'yota@laloei.com', role: 'owner', deptId: 'd_root', joinedAt: '2025-07-01', status: 'active' },
  { id: 'u2', name: 'ฐิตาภา เจริญจิตร', email: 'thita@laloei.com', role: 'admin', deptId: 'd_hr', joinedAt: '2025-07-10', status: 'active' },
  { id: 'u3', name: 'สมชาย ใจดี', email: 'somchai@laloei.com', role: 'manager', deptId: 'd_be', joinedAt: '2025-08-05', status: 'active' },
  { id: 'u4', name: 'สุดา สายฟ้า', email: 'suda@laloei.com', role: 'hr', deptId: 'd_hr', joinedAt: '2025-08-12', status: 'active' },
  { id: 'u5', name: 'นพดล เก่งมาก', email: 'nop@laloei.com', role: 'employee', deptId: 'd_fe', joinedAt: '2025-09-01', status: 'pending' },
];

const ROLE_LABEL: Record<RoleKey, string> = {
  owner: 'Owner',
  admin: 'Admin',
  hr: 'HR',
  manager: 'Manager',
  employee: 'Employee',
};

export default function TeamStructureScreen({
  onInvite,
  onChangeRole,
  onMoveDept,
  onCreateDept,
  onRenameDept,
  onRemoveDept,
}: {
  onInvite?: () => void;
  onChangeRole?: (userId: string, role: RoleKey) => Promise<void> | void;
  onMoveDept?: (userId: string, deptId: string) => Promise<void> | void;
  onCreateDept?: (name: string, parentId?: string | null) => Promise<void> | void;
  onRenameDept?: (deptId: string, name: string) => Promise<void> | void;
  onRemoveDept?: (deptId: string) => Promise<void> | void;
}) {
  const [tab, setTab] = useState<TabKey>('members');
  const [q, setQ] = useState('');
  const [deptFilter, setDeptFilter] = useState<string | 'all'>('all');
  const [roleFilter, setRoleFilter] = useState<RoleKey | 'all'>('all');

  const members = useMemo(() => {
    const byText = (m: Member) => [m.name, m.email].join(' ').toLowerCase().includes(q.toLowerCase());
    const byDept = (m: Member) => (deptFilter === 'all' ? true : m.deptId === deptFilter);
    const byRole = (m: Member) => (roleFilter === 'all' ? true : m.role === roleFilter);
    return MOCK_MEMBERS.filter(m => byText(m) && byDept(m) && byRole(m))
      .sort((a, b) => a.name.localeCompare(b.name, 'th'));
  }, [q, deptFilter, roleFilter]);

  const rootId = 'd_root';

  /** ---------- Header สำหรับ FlatList ---------- */
  const ListHeader = () => (
    <View style={{ padding: P }}>
      <Header title="ทีม & โครงสร้างองค์กร" />
      <Tabs current={tab} onChange={setTab} />

      {tab === 'members' && (
        <View style={S.block}>
          <SearchFilters
            q={q}
            setQ={setQ}
            deptFilter={deptFilter}
            setDeptFilter={setDeptFilter}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
            depts={MOCK_DEPTS}
          />
          <View style={S.rowBetween}>
            <Text style={S.sectionTitle}>สมาชิกทั้งหมด ({members.length})</Text>
            <TouchableOpacity
              style={S.primaryBtn}
              onPress={onInvite ?? (() => Alert.alert('เชิญสมาชิก', 'เชื่อมหน้า Invite'))}
            >
              <Text style={S.primaryBtnText}>+ เชิญสมาชิก</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {tab === 'departments' && (
        <View style={S.block}>
          <Text style={S.sectionTitle}>แผนก/หน่วยงาน</Text>
          <DeptTree parentId={null} all={MOCK_DEPTS} level={0}
            onCreate={onCreateDept} onRename={onRenameDept} onRemove={onRemoveDept} />
        </View>
      )}

      {tab === 'roles' && (
        <View style={S.block}>
          <Text style={S.sectionTitle}>บทบาท & สิทธิ์ (ภาพรวม)</Text>
          <RoleMatrix />
        </View>
      )}

      {tab === 'org' && (
        <View style={S.block}>
          <Text style={S.sectionTitle}>โครงสร้างองค์กร (ย่อ)</Text>
          <OrgMiniChart rootId={rootId} depts={MOCK_DEPTS} members={MOCK_MEMBERS} />
        </View>
      )}
    </View>
  );

  /** ---------- renderItem เฉพาะแท็บสมาชิก ---------- */
  const renderItem: ListRenderItem<Member> = ({ item }) => {
    if (tab !== 'members') return null as any;
    return (
      <View style={{ paddingHorizontal: P }}>
        <MemberRow m={item} depts={MOCK_DEPTS} onChangeRole={onChangeRole} onMoveDept={onMoveDept} />
      </View>
    );
  };

  const data = tab === 'members' ? members : []; // แท็บอื่นใช้ header เท่านั้น

  return (
    <View style={S.container}>
      <FlatList
        data={data}
        keyExtractor={(m) => m.id}
        renderItem={renderItem}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={<View style={{ height: 26 }} />}
        // ช่วย UX ขณะค้นหา/แตะไอเท็ม
        keyboardShouldPersistTaps="handled"
        // อย่าใส่ ScrollView ครอบอีกชั้น
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

/* ----------------- Components ----------------- */

function Header({ title }: { title: string }) {
  return (
    <View style={S.header}>
      <Text style={S.title}>{title}</Text>
      <Text style={S.subtitle}>จัดการสมาชิก แผนก บทบาท และโครงสร้างองค์กรได้จากที่เดียว</Text>
    </View>
  );
}

function Tabs({ current, onChange }: { current: TabKey; onChange: (t: TabKey) => void }) {
  const all: { k: TabKey; label: string }[] = [
    { k: 'members', label: 'สมาชิก' },
    { k: 'departments', label: 'แผนก' },
    { k: 'roles', label: 'บทบาท' },
    { k: 'org', label: 'โครงสร้าง' },
  ];
  return (
    <View style={S.tabs}>
      {all.map(t => {
        const active = current === t.k;
        return (
          <TouchableOpacity key={t.k} style={[S.tabBtn, active && S.tabActive]} onPress={() => onChange(t.k)}>
            <Text style={[S.tabText, active && S.tabTextActive]}>{t.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function SearchFilters({
  q, setQ, deptFilter, setDeptFilter, roleFilter, setRoleFilter, depts,
}: {
  q: string; setQ: (s: string) => void;
  deptFilter: string | 'all'; setDeptFilter: (v: string | 'all') => void;
  roleFilter: RoleKey | 'all'; setRoleFilter: (v: RoleKey | 'all') => void;
  depts: Department[];
}) {
  return (
    <View style={S.filters}>
      <TextInput
        value={q}
        onChangeText={setQ}
        placeholder="ค้นหาชื่อ/อีเมล..."
        style={S.input}
        placeholderTextColor="#94A3B8"
      />
      <FlatList
        data={[
          { id: 'all', label: 'ทั้งหมด', type: 'dept', active: deptFilter === 'all', onPress: () => setDeptFilter('all') },
          ...depts.map(d => ({ id: d.id, label: d.name, type: 'dept', active: deptFilter === d.id, onPress: () => setDeptFilter(d.id) })),
          { id: 'r_all', label: 'บทบาท: ทั้งหมด', type: 'role', active: roleFilter === 'all', onPress: () => setRoleFilter('all') },
          ...(['owner','admin','hr','manager','employee'] as RoleKey[]).map(r => ({
            id: `r_${r}`, label: `บทบาท: ${ROLE_LABEL[r]}`, type: 'role', active: roleFilter === r, onPress: () => setRoleFilter(r)
          })),
        ]}
        keyExtractor={(i) => String(i.id)}
        renderItem={({ item }: any) => (
          <TouchableOpacity style={[S.chip, item.active && S.chipActive]} onPress={item.onPress}>
            <Text style={[S.chipText, item.active && S.chipTextActive]}>{item.label}</Text>
          </TouchableOpacity>
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
        contentContainerStyle={{ paddingVertical: 2 }}
      />
    </View>
  );
}

function MemberRow({
  m, depts, onChangeRole, onMoveDept,
}: {
  m: Member; depts: Department[];
  onChangeRole?: (userId: string, role: RoleKey) => void;
  onMoveDept?: (userId: string, deptId: string) => void;
}) {
  const deptName = depts.find(d => d.id === m.deptId)?.name ?? '—';
  const onRoleCycle = () => {
    const order: RoleKey[] = ['employee','manager','hr','admin','owner'];
    const next = order[(order.indexOf(m.role) + 1) % order.length];
    onChangeRole?.(m.id, next);
    Alert.alert('เปลี่ยนบทบาท', `${m.name} → ${ROLE_LABEL[next]}`);
  };
  const onMove = () => {
    const all = depts.map(d => d.id);
    const idx = Math.max(0, all.indexOf(m.deptId ?? '') );
    const nextId = all[(idx + 1) % all.length];
    onMoveDept?.(m.id, nextId);
    Alert.alert('ย้ายแผนก', `${m.name} → ${depts.find(d => d.id === nextId)?.name}`);
  };

  return (
    <View style={S.memberRow}>
      <View style={{ flex: 1 }}>
        <Text style={S.memberName}>
          {m.name} {m.status === 'pending' ? <Text style={S.pending}> (รอเข้าร่วม)</Text> : null}
        </Text>
        <Text style={S.memberEmail}>{m.email}</Text>
        <View style={S.memberMeta}>
          <RoleBadge role={m.role} />
          <Text style={S.metaDot}>•</Text>
          <Text style={S.metaText}>{deptName}</Text>
          <Text style={S.metaDot}>•</Text>
          <Text style={S.metaText}>เข้าร่วม {m.joinedAt}</Text>
        </View>
      </View>
      <View style={{ gap: 8 }}>
        <TouchableOpacity style={S.smallBtn} onPress={onRoleCycle}>
          <Text style={S.smallBtnText}>เปลี่ยนบทบาท</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[S.smallBtn, { backgroundColor: '#F0F9FF' }]} onPress={onMove}>
          <Text style={[S.smallBtnText, { color: '#0369A1' }]}>ย้ายแผนก</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function RoleBadge({ role }: { role: RoleKey }) {
  const color = {
    owner: ['#FFEFD5', '#B45309'],
    admin: ['#EEF2FF', '#4F46E5'],
    hr: ['#DFF7E7', '#08966E'],
    manager: ['#F0F9FF', '#0369A1'],
    employee: ['#EAF2FF', '#0EA5E9'],
  }[role];
  return (
    <View style={[S.badge, { backgroundColor: color[0] }]}>
      <Text style={[S.badgeText, { color: color[1] }]}>{ROLE_LABEL[role]}</Text>
    </View>
  );
}

function DeptTree({
  parentId, all, level, onCreate, onRename, onRemove,
}: {
  parentId: string | null;
  all: Department[];
  level: number;
  onCreate?: (name: string, parentId?: string | null) => void;
  onRename?: (deptId: string, name: string) => void;
  onRemove?: (deptId: string) => void;
}) {
  const items = all.filter(d => (d.parentId ?? null) === parentId);
  return (
    <View style={{ marginLeft: level * 12 }}>
      {items.map(d => (
        <View key={d.id} style={S.deptRow}>
          <Text style={S.deptName}>{'⎯ '.repeat(level)}{d.name}</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity style={S.xsBtn} onPress={() => onCreate?.('แผนกใหม่', d.id)}>
              <Text style={S.xsBtnText}>+ เพิ่มย่อย</Text>
            </TouchableOpacity>
            <TouchableOpacity style={S.xsBtn} onPress={() => onRename?.(d.id, d.name + ' (แก้ไข)')}>
              <Text style={S.xsBtnText}>แก้ไข</Text>
            </TouchableOpacity>
            {d.parentId && (
              <TouchableOpacity style={[S.xsBtn, { backgroundColor: '#FFF1F2' }]} onPress={() => onRemove?.(d.id)}>
                <Text style={[S.xsBtnText, { color: '#BE123C' }]}>ลบ</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ))}
      {items.map(d => (
        <DeptTree
          key={d.id + '_children'}
          parentId={d.id}
          all={all}
          level={level + 1}
          onCreate={onCreate}
          onRename={onRename}
          onRemove={onRemove}
        />
      ))}
      {level === 0 && (
        <TouchableOpacity style={[S.xsBtn, { marginTop: 8 }]} onPress={() => onCreate?.('แผนกใหม่', null)}>
          <Text style={S.xsBtnText}>+ เพิ่มแผนกระดับบนสุด</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

function RoleMatrix() {
  const rows = [
    { k: 'manage_org', label: 'จัดการองค์กร', owner: true, admin: true, hr: false, manager: false, employee: false },
    { k: 'manage_people', label: 'จัดการสมาชิก/แผนก', owner: true, admin: true, hr: true, manager: false, employee: false },
    { k: 'approve_leave', label: 'อนุมัติคำขอลา', owner: true, admin: true, hr: true, manager: true, employee: false },
    { k: 'view_reports', label: 'ดูรายงาน', owner: true, admin: true, hr: true, manager: true, employee: false },
    { k: 'request_leave', label: 'ยื่นขอลา', owner: true, admin: true, hr: true, manager: true, employee: true },
  ];
  const cols: RoleKey[] = ['owner','admin','hr','manager','employee'];
  return (
    <View style={S.matrix}>
      <View style={[S.matrixRow, S.matrixHeader]}>
        <Text style={[S.cellKey, S.bold]}>สิทธิ์</Text>
        {cols.map(c => (<Text key={c} style={[S.cell, S.bold]}>{ROLE_LABEL[c]}</Text>))}
      </View>
      {rows.map(r => (
        <View key={r.k} style={S.matrixRow}>
          <Text style={S.cellKey}>{r.label}</Text>
          {cols.map(c => (<Text key={c} style={S.cell}>{(r as any)[c] ? '✔︎' : '—'}</Text>))}
        </View>
      ))}
      <Text style={S.matrixFoot}>* ตัวอย่างสิทธิ์หลัก — ผูกกับ RBAC จริงจากฐานข้อมูลในภายหลัง</Text>
    </View>
  );
}

function OrgMiniChart({
  rootId, depts, members,
}: {
  rootId: string;
  depts: Department[];
  members: Member[];
}) {
  const levelOf = (id: string | null | undefined, lvl = 0): number => {
    const d = depts.find(x => x.id === id);
    if (!d || !d.parentId) return lvl;
    return levelOf(d.parentId, lvl + 1);
  };
  const sorted = depts.slice().sort((a, b) => levelOf(a.id) - levelOf(b.id));

  return (
    <View style={{ gap: 10, marginTop: 10 }}>
      {sorted.map(d => {
        const lvl = levelOf(d.id);
        const mem = members.filter(m => m.deptId === d.id);
        return (
          <View key={d.id} style={[S.orgCard, { marginLeft: lvl * 10 }]}>
            <Text style={S.orgDept}>{d.name}</Text>
            <Text style={S.orgMeta}>สมาชิก {mem.length} คน</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
              {mem.slice(0, 4).map(m => (
                <View key={m.id} style={S.orgChip}><Text style={S.orgChipText}>{m.name}</Text></View>
              ))}
              {mem.length > 4 && (
                <View style={[S.orgChip, { backgroundColor: '#E2E8F0' }]}><Text style={[S.orgChipText, { color: '#334155' }]}>+{mem.length - 4}</Text></View>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

/* ----------------- Styles ----------------- */

const P = 16;
const R = 18;

const S = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6FAFF' },

  header: { marginBottom: 8 },
  title: { fontSize: 22, fontWeight: '800', color: '#0F172A' },
  subtitle: { marginTop: 6, fontSize: 13, color: '#475569' },

  tabs: {
    flexDirection: 'row',
    backgroundColor: '#EAF2FF',
    borderRadius: 999,
    padding: 6,
    gap: 6,
    marginTop: 10,
  },
  tabBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 999 },
  tabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 5, elevation: 2,
  },
  tabText: { fontSize: 13, color: '#334155' },
  tabTextActive: { color: '#0EA5E9', fontWeight: '800' },

  block: { marginTop: 12, backgroundColor: '#FFFFFF', borderRadius: R, padding: 14 },

  filters: { gap: 10 },
  input: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10, paddingHorizontal: 12,
    color: '#0F172A',
  },

  chip: {
    paddingVertical: 8, paddingHorizontal: 12,
    backgroundColor: '#F1F5F9',
    borderRadius: 999,
  },
  chipActive: { backgroundColor: '#C7E3FF' },
  chipText: { color: '#475569', fontWeight: '700' },
  chipTextActive: { color: '#0C4A6E' },

  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A' },

  primaryBtn: {
    backgroundColor: '#0EA5E9',
    paddingVertical: 10, paddingHorizontal: 12,
    borderRadius: 12,
  },
  primaryBtnText: { color: 'white', fontWeight: '800' },

  memberRow: {
    flexDirection: 'row', gap: 12,
    padding: 12, borderRadius: 12,
    backgroundColor: '#FBFEFF',
    borderWidth: 1, borderColor: '#EEF2F7',
  },
  memberName: { color: '#0F172A', fontWeight: '800' },
  pending: { color: '#CA8A04', fontWeight: '700' },
  memberEmail: { color: '#64748B', fontSize: 12, marginTop: 2 },
  memberMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  metaDot: { color: '#94A3B8' },
  metaText: { color: '#475569', fontSize: 12 },

  badge: { paddingVertical: 4, paddingHorizontal: 8, borderRadius: 999 },
  badgeText: { fontSize: 12, fontWeight: '800' },

  smallBtn: {
    backgroundColor: '#EEF2FF',
    paddingVertical: 8, paddingHorizontal: 10,
    borderRadius: 10, alignItems: 'center',
  },
  smallBtnText: { color: '#4F46E5', fontWeight: '700', fontSize: 12 },

  xsBtn: {
    backgroundColor: '#EAF2FF',
    paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8,
  },
  xsBtnText: { color: '#0F172A', fontWeight: '700', fontSize: 12 },

  deptRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderWidth: 1, borderColor: '#EEF2F7', padding: 10, borderRadius: 10, marginTop: 8,
  },
  deptName: { color: '#0F172A', fontWeight: '800' },

  matrix: { marginTop: 6, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12 },
  matrixRow: { flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 10, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  matrixHeader: { backgroundColor: '#F8FAFC', borderTopWidth: 0, borderTopColor: 'transparent' },
  bold: { fontWeight: '800' },
  cellKey: { flex: 2, color: '#0F172A' },
  cell: { flex: 1, color: '#0F172A', textAlign: 'center' },
  matrixFoot: { padding: 10, color: '#64748B', fontSize: 12 },

  orgCard: {
    backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12,
    borderWidth: 1, borderColor: '#EEF2F7',
  },
  orgDept: { color: '#0F172A', fontWeight: '800' },
  orgMeta: { color: '#64748B', fontSize: 12, marginTop: 2 },
  orgChip: { backgroundColor: '#EAF2FF', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 999 },
  orgChipText: { color: '#0C4A6E', fontWeight: '700', fontSize: 12 },
});
