// screens/LeaveTypesScreen.tsx
import React, { useMemo, useState } from 'react';
import {
  Alert, FlatList, Modal, StyleSheet, Text, TextInput,
  TouchableOpacity, View, ListRenderItem
} from 'react-native';

/* ---------- Types ---------- */
type Unit = 'day' | 'hour';
type LeaveTypeCode = 'AL' | 'SL' | 'CL' | 'UL' | 'WFH' | 'OT' | string;

export type LeaveType = {
  id: string;
  code: LeaveTypeCode;
  name_th: string;
  name_en?: string;
  unit: Unit;
  allow_half_day: boolean;
  is_paid: boolean;
  require_document?: boolean;
  effective_from?: string;
  effective_to?: string | null;
  policy?: {
    annual_quota?: number;
    accrual?: {
      enabled: boolean;
      per_month?: number;
      cap?: number;
      carry_over?: { enabled: boolean; max?: number };
    };
    probation_block?: boolean;
  };
};

type Props = {
  items?: LeaveType[];
  onCreate?: (v: LeaveType) => Promise<void> | void;
  onUpdate?: (id: string, v: Partial<LeaveType>) => Promise<void> | void;
  onDelete?: (id: string) => Promise<void> | void;
};

/* ---------- Mock Data ---------- */
const MOCK: LeaveType[] = [
  {
    id: '1', code: 'AL', name_th: 'ลาพักผ่อน', name_en: 'Annual Leave', unit: 'day', allow_half_day: true, is_paid: true,
    policy: { annual_quota: 10, accrual: { enabled: true, per_month: 1, cap: 15, carry_over: { enabled: true, max: 5 } } }
  },
  {
    id: '2', code: 'SL', name_th: 'ลาป่วย', name_en: 'Sick Leave', unit: 'day', allow_half_day: true, is_paid: true,
    require_document: true, policy: { annual_quota: 30, accrual: { enabled: false } }
  },
  {
    id: '3', code: 'CL', name_th: 'ลากิจ', name_en: 'Personal Leave', unit: 'day', allow_half_day: true, is_paid: true,
    policy: { annual_quota: 3, accrual: { enabled: false }, probation_block: false }
  },
  { id: '4', code: 'UL', name_th: 'ลาไม่รับค่าจ้าง', name_en: 'Unpaid Leave', unit: 'day', allow_half_day: true, is_paid: false },
  { id: '5', code: 'WFH', name_th: 'ทำงานที่บ้าน', name_en: 'Work From Home', unit: 'day', allow_half_day: true, is_paid: true },
];

/* ---------- Screen ---------- */
const P = 16;

export default function LeaveTypesScreen({
  items = MOCK,
  onCreate,
  onUpdate,
  onDelete,
}: Props) {
  const [q, setQ] = useState('');
  const [unitFilter, setUnitFilter] = useState<Unit | 'all'>('all');
  const [paidFilter, setPaidFilter] = useState<'all' | 'paid' | 'unpaid'>('all');
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<LeaveType | null>(null);

  const data = useMemo(() => {
    return items
      .filter(it => {
        const byQ = [it.code, it.name_th, it.name_en].join(' ').toLowerCase().includes(q.toLowerCase());
        const byUnit = unitFilter === 'all' ? true : it.unit === unitFilter;
        const byPaid = paidFilter === 'all' ? true : (paidFilter === 'paid' ? it.is_paid : !it.is_paid);
        return byQ && byUnit && byPaid;
      })
      .sort((a, b) => a.code.localeCompare(b.code, 'th'));
  }, [items, q, unitFilter, paidFilter]);

  const openCreate = () => {
    setEditing({
      id: 'new',
      code: '',
      name_th: '',
      name_en: '',
      unit: 'day',
      allow_half_day: true,
      is_paid: true,
      require_document: false,
      policy: { annual_quota: undefined, accrual: { enabled: false }, probation_block: false },
    });
    setEditorOpen(true);
  };
  const openEdit = (it: LeaveType) => { setEditing(it); setEditorOpen(true); };

  const remove = (id: string) => {
    Alert.alert('ลบประเภทการลา', 'ต้องการลบรายการนี้หรือไม่?', [
      { text: 'ยกเลิก' }, { text: 'ลบ', style: 'destructive', onPress: () => onDelete?.(id) }
    ]);
  };

  /* ---------- Header สำหรับ FlatList ---------- */
  const ListHeader = () => (
    <View style={{ padding: P }}>
      <Header />

      {/* Filters */}
      <View style={S.filters}>
        <TextInput
          placeholder="ค้นหา: รหัส/ชื่อ (TH/EN)"
          placeholderTextColor="#94A3B8"
          value={q}
          onChangeText={setQ}
          style={S.input}
        />

        {/* chips → ใช้ FlatList horizontal แทน ScrollView */}
        <FlatList
          data={[
            { id: 'u_all', label: 'ทั้งหมด', active: unitFilter === 'all', onPress: () => setUnitFilter('all') },
            { id: 'u_day', label: 'หน่วย: วัน', active: unitFilter === 'day', onPress: () => setUnitFilter('day') },
            { id: 'u_hour', label: 'หน่วย: ชั่วโมง', active: unitFilter === 'hour', onPress: () => setUnitFilter('hour') },
            { id: 'p_all', label: 'ทั้งหมด', active: paidFilter === 'all', onPress: () => setPaidFilter('all') },
            { id: 'p_paid', label: 'จ่ายค่าจ้าง', active: paidFilter === 'paid', onPress: () => setPaidFilter('paid') },
            { id: 'p_unpaid', label: 'ไม่จ่ายค่าจ้าง', active: paidFilter === 'unpaid', onPress: () => setPaidFilter('unpaid') },
          ]}
          keyExtractor={(i) => String(i.id)}
          horizontal
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
          renderItem={({ item }: any) => (
            <Chip label={item.label} active={item.active} onPress={item.onPress} />
          )}
          contentContainerStyle={{ paddingVertical: 2 }}
        />
      </View>

      <View style={S.rowBetween}>
        <Text style={S.sectionTitle}>ประเภทการลา ({data.length})</Text>
        <TouchableOpacity style={S.primaryBtn} onPress={openCreate}>
          <Text style={S.primaryBtnText}>+ เพิ่มประเภท</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  /* ---------- renderItem ---------- */
  const renderItem: ListRenderItem<LeaveType> = ({ item }) => (
    <View style={{ paddingHorizontal: P }}>
      <LeaveTypeCard item={item} onEdit={() => openEdit(item)} onDelete={() => remove(item.id)} />
    </View>
  );

  return (
    <View style={S.container}>
      <FlatList
        data={data}
        keyExtractor={(it) => it.id}
        renderItem={renderItem}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={<View style={{ height: 28 }} />}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      />

      {/* Editor */}
      <EditModal
        visible={editorOpen}
        initial={editing}
        onClose={() => setEditorOpen(false)}
        onSubmit={(val) => {
          if (!val) return;
          if (val.id === 'new') {
            const id = `${Date.now()}`;
            onCreate?.({ ...val, id });
          } else {
            onUpdate?.(val.id, val);
          }
          setEditorOpen(false);
        }}
      />
    </View>
  );
}

/* ---------- Components ---------- */

function Header() {
  return (
    <View style={S.header}>
      <Text style={S.title}>ประเภทการลา</Text>
      <Text style={S.subtitle}>ตั้งค่าประเภท, โควตา, เงื่อนไขเอกสาร และการสะสม/ยกยอด</Text>
    </View>
  );
}

function Chip({ label, active, onPress }: { label: string; active?: boolean; onPress?: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={[S.chip, active && S.chipActive]}>
      <Text style={[S.chipText, active && S.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

function LeaveTypeCard({ item, onEdit, onDelete }: { item: LeaveType; onEdit: () => void; onDelete: () => void }) {
  const quotaTxt = item.policy?.annual_quota != null ? `${item.policy?.annual_quota} ${item.unit === 'day' ? 'วัน/ปี' : 'ชม./ปี'}` : '—';
  const accr = item.policy?.accrual?.enabled ? `สะสม ${item.policy?.accrual?.per_month ?? 0}/เดือน (เพดาน ${item.policy?.accrual?.cap ?? '—'})` : 'ไม่สะสม';
  const carry = item.policy?.accrual?.carry_over?.enabled ? `• ยกยอดได้สูงสุด ${item.policy?.accrual?.carry_over?.max ?? '—'}` : '';
  return (
    <View style={S.card}>
      <View style={S.cardHead}>
        <View style={{ flex: 1 }}>
          <Text style={S.code}>{item.code}</Text>
          <Text style={S.nameTh}>{item.name_th}</Text>
          {!!item.name_en && <Text style={S.nameEn}>{item.name_en}</Text>}
        </View>
        <View style={{ alignItems: 'flex-end', gap: 6 }}>
          <Badge color="#DFF7E7" textColor="#08966E" label={item.is_paid ? 'จ่ายค่าจ้าง' : 'ไม่จ่าย'} />
          <Badge color="#EAF2FF" textColor="#0EA5E9" label={item.unit === 'day' ? 'หน่วย: วัน' : 'หน่วย: ชั่วโมง'} />
          {item.allow_half_day && <Badge color="#FFF7ED" textColor="#B45309" label="ครึ่งวัน" />}
          {item.require_document && <Badge color="#FFE4E6" textColor="#BE123C" label="ต้องแนบเอกสาร" />}
        </View>
      </View>

      <View style={S.divider} />

      <View style={{ gap: 4 }}>
        <Row label="โควตาต่อปี" value={quotaTxt} />
        <Row label="การสะสม" value={`${accr} ${carry}`} />
        <Row label="ช่วงมีผล" value={`${item.effective_from ?? '—'}  →  ${item.effective_to ?? 'ไม่มีกำหนด'}`} />
        <Row label="นโยบายทดลองงาน" value={item.policy?.probation_block ? 'ห้ามใช้ระหว่างโปรเบชั่น' : '—'} />
      </View>

      <View style={S.actions}>
        <TouchableOpacity style={S.secondaryBtn} onPress={onEdit}><Text style={S.secondaryBtnText}>แก้ไข</Text></TouchableOpacity>
        <TouchableOpacity style={[S.secondaryBtn, { backgroundColor: '#FFF1F2' }]} onPress={onDelete}><Text style={[S.secondaryBtnText, { color: '#BE123C' }]}>ลบ</Text></TouchableOpacity>
      </View>
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={S.row}>
      <Text style={S.rowKey}>{label}</Text>
      <Text style={S.rowVal}>{value}</Text>
    </View>
  );
}

function Badge({ label, color, textColor }: { label: string; color: string; textColor: string }) {
  return (
    <View style={[S.badge, { backgroundColor: color }]}>
      <Text style={[S.badgeText, { color: textColor }]}>{label}</Text>
    </View>
  );
}

/* ---------- Edit Modal ---------- */

type EditModalProps = {
  visible: boolean;
  initial: LeaveType | null;
  onClose: () => void;
  onSubmit: (v?: LeaveType) => void;
};

function EditModal({ visible, initial, onClose, onSubmit }: EditModalProps) {
  const [v, setV] = useState<LeaveType | null>(initial);

  React.useEffect(() => setV(initial), [initial, visible]);

  const set = <K extends keyof LeaveType>(k: K, val: LeaveType[K]) => setV(prev => prev ? { ...prev, [k]: val } : prev);
  const setPol = <K extends keyof NonNullable<LeaveType['policy']>>(k: K, val: NonNullable<LeaveType['policy']>[K]) =>
    setV(prev => prev ? { ...prev, policy: { ...(prev.policy ?? {}), [k]: val } } : prev);
  const setAcc = <K extends keyof NonNullable<NonNullable<LeaveType['policy']>['accrual']>>(k: K, val: any) =>
    setV(prev => prev ? { ...prev, policy: { ...(prev.policy ?? {}), accrual: { ...((prev.policy?.accrual) ?? { enabled: false }), [k]: val } } } : prev);

  const save = () => {
    if (!v) return;
    if (!v.code.trim() || !v.name_th.trim()) {
      Alert.alert('กรอกไม่ครบ', 'กรุณากรอกรหัสและชื่อ (TH)');
      return;
    }
    onSubmit(v);
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} transparent>
      <View style={S.modalBackdrop}>
        <View style={S.modal}>
          {/* ScrollView อยู่ใน Modal แยก instance จาก FlatList หลัก จึงปลอดภัย */}
          <FlatList
            data={[1]} // hack ง่าย ๆ ให้ได้ behavior scroll
            keyExtractor={() => 'form'}
            renderItem={() => (
              <View style={{ paddingBottom: 14 }}>
                <Text style={S.modalTitle}>{v?.id === 'new' ? 'เพิ่มประเภทการลา' : 'แก้ไขประเภทการลา'}</Text>

                <View style={S.formRow}><Text style={S.label}>รหัส</Text>
                  <TextInput style={S.input} value={v?.code} onChangeText={(t) => set('code', t.toUpperCase())} placeholder="เช่น AL" />
                </View>

                <View style={S.formRow}><Text style={S.label}>ชื่อ (TH)</Text>
                  <TextInput style={S.input} value={v?.name_th} onChangeText={(t) => set('name_th', t)} placeholder="ลาพักผ่อน" />
                </View>

                <View style={S.formRow}><Text style={S.label}>ชื่อ (EN)</Text>
                  <TextInput style={S.input} value={v?.name_en} onChangeText={(t) => set('name_en', t)} placeholder="Annual Leave" />
                </View>

                <View style={S.rowH}>
                  <Toggle label="หน่วย: วัน" active={v?.unit === 'day'} onPress={() => set('unit', 'day')} />
                  <Toggle label="หน่วย: ชั่วโมง" active={v?.unit === 'hour'} onPress={() => set('unit', 'hour')} />
                </View>

                <View style={S.rowH}>
                  <Toggle label="ครึ่งวัน" active={!!v?.allow_half_day} onPress={() => set('allow_half_day', !v?.allow_half_day)} />
                  <Toggle label="จ่ายค่าจ้าง" active={!!v?.is_paid} onPress={() => set('is_paid', !v?.is_paid)} />
                  <Toggle label="ต้องแนบเอกสาร" active={!!v?.require_document} onPress={() => set('require_document', !v?.require_document)} />
                </View>

                <View style={S.formRow}><Text style={S.label}>มีผลตั้งแต่ (YYYY-MM-DD)</Text>
                  <TextInput style={S.input} value={v?.effective_from} onChangeText={(t) => set('effective_from', t)} placeholder="2025-01-01" />
                </View>
                <View style={S.formRow}><Text style={S.label}>สิ้นสุด (ถ้ามี)</Text>
                  <TextInput style={S.input} value={v?.effective_to ?? ''} onChangeText={(t) => set('effective_to', t || null)} placeholder="เช่น 2025-12-31 หรือเว้นว่าง" />
                </View>

                <View style={S.divider} />
                <Text style={S.subTitle}>นโยบายโควตา/สะสม</Text>

                <View style={S.formRow}><Text style={S.label}>โควตาต่อปี</Text>
                  <TextInput style={S.input} keyboardType="number-pad"
                    value={String(v?.policy?.annual_quota ?? '')}
                    onChangeText={(t) => setPol('annual_quota', t ? Number(t) : undefined)} placeholder="เช่น 10" />
                </View>

                <View style={S.rowH}>
                  <Toggle label="เปิดการสะสม" active={!!v?.policy?.accrual?.enabled} onPress={() => setAcc('enabled', !(v?.policy?.accrual?.enabled))} />
                  <Toggle label="ยกยอดได้" active={!!v?.policy?.accrual?.carry_over?.enabled}
                    onPress={() => setAcc('carry_over', { ...(v?.policy?.accrual?.carry_over ?? {}), enabled: !(v?.policy?.accrual?.carry_over?.enabled) })} />
                  <Toggle label="บล็อคช่วงโปรเบชั่น" active={!!v?.policy?.probation_block}
                    onPress={() => setPol('probation_block', !(v?.policy?.probation_block))} />
                </View>

                {v?.policy?.accrual?.enabled && (
                  <>
                    <View style={S.formRow}><Text style={S.label}>สะสม/เดือน</Text>
                      <TextInput style={S.input} keyboardType="number-pad"
                        value={String(v?.policy?.accrual?.per_month ?? '')}
                        onChangeText={(t) => setAcc('per_month', t ? Number(t) : undefined)} placeholder="เช่น 1" />
                    </View>
                    <View style={S.formRow}><Text style={S.label}>เพดานสะสมสูงสุด</Text>
                      <TextInput style={S.input} keyboardType="number-pad"
                        value={String(v?.policy?.accrual?.cap ?? '')}
                        onChangeText={(t) => setAcc('cap', t ? Number(t) : undefined)} placeholder="เช่น 15" />
                    </View>
                  </>
                )}

                {v?.policy?.accrual?.carry_over?.enabled && (
                  <View style={S.formRow}><Text style={S.label}>ยกยอดสูงสุด</Text>
                    <TextInput style={S.input} keyboardType="number-pad"
                      value={String(v?.policy?.accrual?.carry_over?.max ?? '')}
                      onChangeText={(t) => setAcc('carry_over', { ...(v?.policy?.accrual?.carry_over ?? { enabled: true }), max: t ? Number(t) : undefined })} placeholder="เช่น 5" />
                  </View>
                )}

                <View style={S.modalActions}>
                  <TouchableOpacity style={S.secondaryBtn} onPress={onClose}><Text style={S.secondaryBtnText}>ยกเลิก</Text></TouchableOpacity>
                  <TouchableOpacity style={S.primaryBtn} onPress={save}><Text style={S.primaryBtnText}>บันทึก</Text></TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
      </View>
    </Modal>
  );
}

function Toggle({ label, active, onPress }: { label: string; active?: boolean; onPress?: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={[S.toggle, active && S.toggleActive]}>
      <Text style={[S.toggleText, active && S.toggleTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

/* ---------- Styles ---------- */
const R = 18, PADDING = 16;
const S = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6FAFF' },

  header: { marginBottom: 8, paddingHorizontal: PADDING },
  title: { fontSize: 22, fontWeight: '800', color: '#0F172A' },
  subtitle: { marginTop: 6, fontSize: 13, color: '#475569' },

  filters: { marginTop: 10, gap: 10 },
  input: {
    backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderWidth: 1,
    borderRadius: 12, paddingVertical: 10, paddingHorizontal: 12, color: '#0F172A'
  },
  chip: { paddingVertical: 8, paddingHorizontal: 12, backgroundColor: '#F1F5F9', borderRadius: 999 },
  chipActive: { backgroundColor: '#C7E3FF' },
  chipText: { color: '#475569', fontWeight: '700' },
  chipTextActive: { color: '#0C4A6E' },

  rowBetween: { marginTop: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A' },

  card: {
    backgroundColor: '#FFFFFF', borderRadius: R, padding: 14,
    borderWidth: 1, borderColor: '#EEF2F7', shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06, shadowRadius: 10, elevation: 3,
  },
  cardHead: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  code: { color: '#0EA5E9', fontWeight: '900', fontSize: 16 },
  nameTh: { color: '#0F172A', fontWeight: '800', marginTop: 2 },
  nameEn: { color: '#64748B', fontSize: 12 },

  divider: { height: 1, backgroundColor: '#EEF2F7', marginVertical: 10 },

  row: { flexDirection: 'row', justifyContent: 'space-between' },
  rowKey: { color: '#475569', fontSize: 12 },
  rowVal: { color: '#0F172A', fontWeight: '700', fontSize: 12 },

  badge: { paddingVertical: 4, paddingHorizontal: 8, borderRadius: 999, alignSelf: 'flex-start' },
  badgeText: { fontSize: 11, fontWeight: '800' },

  actions: { marginTop: 12, flexDirection: 'row', gap: 10, justifyContent: 'flex-end' },
  primaryBtn: { backgroundColor: '#0EA5E9', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 12 },
  primaryBtnText: { color: 'white', fontWeight: '800' },
  secondaryBtn: { backgroundColor: '#EEF2FF', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 12 },
  secondaryBtnText: { color: '#4F46E5', fontWeight: '700' },

  /* Modal */
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'flex-end' },
  modal: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 14, maxHeight: '90%' },
  modalTitle: { fontSize: 18, fontWeight: '900', color: '#0F172A', marginBottom: 6 },
  formRow: { marginTop: 10 },
  label: { color: '#475569', marginBottom: 6, fontWeight: '700' },

  rowH: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginTop: 8 },
  toggle: { paddingVertical: 8, paddingHorizontal: 10, borderRadius: 999, backgroundColor: '#F1F5F9' },
  toggleActive: { backgroundColor: '#DFF7E7' },
  toggleText: { color: '#475569', fontWeight: '700' },
  toggleTextActive: { color: '#065F46' },

  subTitle: { fontSize: 14, fontWeight: '900', color: '#0F172A', marginTop: 6 },
  modalActions: { marginTop: 14, flexDirection: 'row', gap: 10, justifyContent: 'flex-end' },
});
