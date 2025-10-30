import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    View, Text, StyleSheet, TextInput, Pressable, ScrollView,
    TouchableOpacity, Platform, StatusBar, Modal, FlatList, Share, Alert,
    GestureResponderEvent,
    SafeAreaView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// @ts-ignore (ถ้ามี lib ไอคอนอยู่แล้ว)
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Role } from '@/src/auth/roles';
import { BackgroundFX } from '@/src/components/Background';
import { inviteUser } from '@/src/connections/auth/orgApi';
import { useAuthStore } from '@/src/store/useAuthStore';
import { OrganizationModel } from '@/src/interface/organization';
import { fetchRoles } from '@/src/connections/auth/roleApi';

const THEME = {
    bgA: '#E9F4FF',
    bgB: '#F4FFFD',
    card: '#FFFFFF',
    line: '#E6EDF5',
    text: '#0F172A',
    sub: '#6B7A90',
    tint: '#29C5BD',
    tint2: '#20A4D9',
    ok: '#16a34a',
    warn: '#f59e0b',
    err: '#e11d48',
    shadow: '#0f172a'
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

type Payload = {
    emails: string[];
    role: Role;
    message: string;
    expireDays: number;
};

type Props = {
    onInviteMembers?: (payload: Payload) => Promise<void> | void; // เปลี่ยน ? ให้เป็น optional
    onImportCsv?: () => Promise<string[]> | string[];
    onBack?: () => void;
};



const InviteScreen: React.FC<Props> = ({
    onInviteMembers,
    onImportCsv,
    onBack,
}) => {

    const [raw, setRaw] = useState('hr_qr@gmail.com');
    const [emails, setEmails] = useState<string[]>([]);
    const [invalids, setInvalids] = useState<string[]>([]);
    const [role, setRole] = useState<Role>('EMP');
    const [note, setNote] = useState('สวัสดีครับ ยินดีต้อนรับเข้าสู่ระบบลาออนไลน์ของเรา');
    const [expireDays, setExpireDays] = useState<number>(7);
    const [showRolePicker, setShowRolePicker] = useState(false);
    const [loading, setLoading] = useState(false);
    const [ROLES, setRoles] = useState<{ id: string; code: string; name: string }[]>([]);
    const [role_id, setRoleId] = useState<string>('');

    const profile = useAuthStore(s => s.profile);
    const org = profile?.org;

    const inputRef = useRef<TextInput>(null);

    // ---- Handlers ----
    const safeOnInvite = onInviteMembers ?? (async () => {
        inviteUser({ email: emails, org_id: org?.id || '', role_id: role_id, message: note, expireDays });
        Alert.alert('ส่งคำเชิญเรียบร้อย', 'โปรดตรวจสอบอีเมลของผู้รับ');
    });   // default
    // const safeImport = onImportCsv ?? (async () => []);        // default

    // http://localhost:3000/api/v1/role'

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const resp = await fetchRoles({ timeoutMs: 5000 });
    //             setRoles(resp);
    //         } catch (error) {
    //             console.error('Failed to fetch roles:', error);
    //         }
    //     };
    //     fetchData();
    // }, []);

    const link = useMemo(() => {
        // mock link เชิญ (จริง ๆ ควรได้จาก backend)
        const origin = 'https://laloei.com/invite';
        const params = new URLSearchParams({ r: role, exp: String(expireDays) }).toString();
        return `${origin}?${params}`;
    }, [role, expireDays]);

    // --- Utils ---
    const normalize = (t: string) =>
        t.replace(/\s/g, '')
            .replace(/[，；;]/g, ','); // รองรับ ; หรือ เครื่องหมายจีน

    const splitEmails = (t: string) =>
        normalize(t).split(',').map(e => e.trim()).filter(Boolean);

    const classify = (items: string[]) => {
        const good: string[] = [];
        const bad: string[] = [];
        items.forEach(e => (EMAIL_RE.test(e) ? good.push(e.toLowerCase()) : bad.push(e)));
        return { good, bad };
    };

    const addFromInput = useCallback(() => {
        if (!raw.trim()) return;
        const parts = splitEmails(raw);
        const { good, bad } = classify(parts);
        const uniqueGood = Array.from(new Set([...emails, ...good]));
        setEmails(uniqueGood);
        setInvalids(bad);
        setRaw('');
        inputRef.current?.focus();
    }, [raw, emails]);

    const removeEmail = (e: string) => {
        setEmails(prev => prev.filter(x => x !== e));
    };

    const clearInvalids = () => setInvalids([]);


    const shareLink = async () => {
        try {
            await Share.share({ message: `เข้าร่วมองค์กรผ่านลิงก์นี้: ${link}` });
        } catch { }
    };

    const tryImport = async () => {
        if (!onImportCsv) return;
        const list = await onImportCsv();
        const { good, bad } = classify(list);
        setEmails(prev => Array.from(new Set([...prev, ...good])));
        if (bad.length) setInvalids(bad);
    };

    const canSend = emails.length > 0 && !loading;

    const send = async () => {
        if (!canSend) return;
        try {
            setLoading(true);
            await (safeOnInvite({ emails, role, message: note, expireDays }) ?? Promise.resolve());
            Alert.alert('ส่งคำเชิญแล้ว', `${emails.length} รายชื่อจะได้รับอีเมล/ลิงก์เข้าร่วม`);
            setEmails([]);
            setNote('');
        } catch (e: any) {
            Alert.alert('ส่งไม่สำเร็จ', e?.message ?? 'โปรดลองอีกครั้ง');
        } finally {
            setLoading(false);
        }
    };

    // เมื่อพิมพ์แล้วกด space/คอมมา/enter → แปลงเป็น chip
    const onChangeRaw = (t: string) => {
        setRaw(t);
        if (/[,\n]$/.test(t)) addFromInput();
    };

    function copyLink(event: GestureResponderEvent): void {
        // Clipboard.setString(link);
        Alert.alert('คัดลอกลิงก์แล้ว', 'นำไปวางในแชท/อีเมลได้เลย');
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F7FAFD' }}>
            <BackgroundFX />
            <StatusBar barStyle="dark-content" />
            {/* Header */}
            {/* <View style={styles.headerContainer}>
        <LinearGradient colors={[THEME.bgA, THEME.bgB]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={onBack} hitSlop={HIT}>
            <Text style={styles.backChevron}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>เชิญเข้าร่วมองค์กร</Text>
          <View style={{ width: 24 }} />
        </View>
      </View> */}

            <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 160 }} showsVerticalScrollIndicator={false}>
                {/* Section: Emails */}
                <View style={styles.card}>
                    <Text style={styles.secTitle}>อีเมลผู้เข้าร่วม</Text>
                    <Text style={styles.secHint}>พิมพ์อีเมลแล้วกด , หรือ Enter เพื่อเพิ่มหลายรายการ</Text>

                    {/* Input + chips */}
                    <View style={styles.chipsBox}>
                        {emails.map(e => (
                            <View key={e} style={styles.chip}>
                                <Text style={styles.chipText}>{e}</Text>
                                <Pressable hitSlop={HIT} onPress={() => removeEmail(e)}>
                                    <Ionicons name="close" size={14} color={THEME.sub} />
                                </Pressable>
                            </View>
                        ))}

                        <TextInput
                            ref={inputRef}
                            value={raw}
                            onChangeText={onChangeRaw}
                            onBlur={addFromInput}
                            placeholder="name@company.com, another@company.com"
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType="email-address"
                            style={styles.input}
                            returnKeyType="done"
                            onSubmitEditing={addFromInput}
                        />
                    </View>

                    {/* Invalid */}
                    {!!invalids.length && (
                        <View style={styles.invalidBox}>
                            <Ionicons name="alert-circle-outline" size={16} color={THEME.err} />
                            <Text style={styles.invalidTxt}>อีเมลไม่ถูกต้อง: {invalids.join(', ')}</Text>
                            <Pressable onPress={clearInvalids} hitSlop={HIT}><Text style={styles.clearErr}>ซ่อน</Text></Pressable>
                        </View>
                    )}

                    {/* Quick: Import CSV */}
                    <View style={styles.row}>
                        <TouchableOpacity onPress={tryImport} style={styles.linkBtn} activeOpacity={0.8}>
                            <Ionicons name="cloud-upload-outline" size={16} color={THEME.tint} />
                            <Text style={styles.linkBtnTxt}>นำเข้าจาก CSV</Text>
                        </TouchableOpacity>
                        <Text style={styles.countTxt}>{emails.length} รายชื่อ</Text>
                    </View>
                </View>

                {/* Section: Role & Expire */}
                <View style={styles.card}>
                    <Text style={styles.secTitle}>สิทธิ์ & ตั้งค่า</Text>

                    {/* Role */}
                    <Text style={styles.label}>บทบาทเริ่มต้น</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 6 }}>
                        <Pressable
                            style={styles.selectBtn}
                            onPress={() =>
                                setShowRolePicker(true)}
                        >
                            <Text style={styles.selectTxt} >{ROLES.find(r => r.code === role)?.name ?? role}</Text>
                            <Ionicons name="chevron-down" size={16} color={THEME.sub} />
                        </Pressable>
                        <Pressable
                            style={styles.selectBtn}
                            onPress={() =>
                                setShowRolePicker(true)}
                        >
                            <Text style={styles.selectTxt} >{ROLES.find(r => r.code === role)?.name ?? role}</Text>
                            <Ionicons name="chevron-down" size={16} color={THEME.sub} />
                        </Pressable>
                            <Pressable
                            style={styles.selectBtn}
                            onPress={() =>
                                setShowRolePicker(true)}
                        >
                            <Text style={styles.selectTxt} >{ROLES.find(r => r.code === role)?.name ?? role}</Text>
                            <Ionicons name="chevron-down" size={16} color={THEME.sub} />
                        </Pressable>
                    </View>
                


                    {/* Expire */}
                    <Text style={[styles.label, { marginTop: 12 }]}>ลิงก์หมดอายุ</Text>
                    <View style={styles.expRow}>
                        {[1, 3, 7, 14, 30].map(d => (
                            <Pressable
                                key={d}
                                onPress={() => setExpireDays(d)}
                                style={[styles.pill, expireDays === d && styles.pillActive]}
                            >
                                <Text style={[styles.pillTxt, expireDays === d && styles.pillTxtActive]}>{d} วัน</Text>
                            </Pressable>
                        ))}
                    </View>

                    {/* Message */}
                    <Text style={[styles.label, { marginTop: 12 }]}>ข้อความถึงผู้รับ (ไม่บังคับ)</Text>
                    <TextInput
                        value={note}
                        onChangeText={setNote}
                        placeholder="สวัสดีครับ/ค่ะ… ยินดีต้อนรับเข้าสู่ระบบ…"
                        style={styles.textArea}
                        multiline
                    />
                </View>

                {/* Section: Invite Link */}
                <View style={styles.card}>
                    <Text style={styles.secTitle}>ลิงก์เชิญ (สำหรับแชร์)</Text>
                    <View style={styles.linkBox}>
                        <Text numberOfLines={1} style={styles.linkTxt}>{link}</Text>
                    </View>
                    <View style={[styles.row, { marginTop: 8 }]}>
                        <TouchableOpacity style={styles.ghostBtn} onPress={copyLink} activeOpacity={0.85}>
                            <Ionicons name="copy-outline" size={16} color={THEME.text} />
                            <Text style={styles.ghostBtnTxt}>คัดลอก</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.ghostBtn} onPress={shareLink} activeOpacity={0.85}>
                            <Ionicons name="share-social-outline" size={16} color={THEME.text} />
                            <Text style={styles.ghostBtnTxt}>แชร์</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.secHint}>ผู้มีลิงก์จะเข้าร่วมด้วยบทบาทที่เลือกด้านบน</Text>
                </View>
            </ScrollView>

            {/* Bottom CTA */}
            <Pressable onPress={send} style={[styles.fab, !canSend && { opacity: 0.5 }]} disabled={!canSend}>
                <LinearGradient colors={[THEME.tint2, THEME.tint]} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} style={styles.fabInner}>
                    <Ionicons name="send-outline" size={18} color="#fff" />
                    <Text style={styles.fabTxt}>{loading ? 'กำลังส่ง…' : `ส่งเชิญ (${emails.length})`}</Text>
                </LinearGradient>
            </Pressable>

            {/* Role Picker (Modal) */}
            <Modal visible={showRolePicker} transparent animationType="fade" onRequestClose={() => setShowRolePicker(false)}>
                <Pressable style={styles.modalBackdrop} onPress={() => setShowRolePicker(false)}>
                    <View />
                </Pressable>
                <View style={styles.modalSheet}>
                    <Text style={styles.sheetTitle}>เลือกบทบาท</Text>
                    <FlatList
                        data={ROLES}
                        keyExtractor={(it) => it.code}
                        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                        renderItem={({ item }) => (
                            <Pressable
                                onPress={() => {
                                    setRole(item.code as Role); setShowRolePicker(false);
                                    setRoleId(item.id);
                                }}
                                style={({ pressed }) => [styles.roleItem, pressed && { backgroundColor: '#F6FAFF' }]}
                            >
                                <Text style={styles.roleLabel}>{item.name}</Text>
                                {role === item.code && <Ionicons name="checkmark-circle" size={18} color={THEME.tint} />}
                            </Pressable>
                        )}
                    />
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default InviteScreen;

/* ========== Styles ========== */

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

const styles = StyleSheet.create({
    headerContainer: {
        paddingTop: Platform.OS === 'ios' ? 64 : 52,
        paddingHorizontal: 16,
        paddingBottom: 12,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        overflow: 'hidden',
    },
    headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    backChevron: { fontSize: 28, color: THEME.sub, lineHeight: 28 },
    headerTitle: { fontSize: 18, fontWeight: '800', color: THEME.text },

    card: {
        backgroundColor: THEME.card,
        borderRadius: 20,
        borderWidth: 1, borderColor: THEME.line,
        padding: 16,
        marginTop: 14,
        shadowColor: THEME.shadow,
        shadowOpacity: Platform.OS === 'ios' ? 0.08 : 0.06,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 3,
    },

    secTitle: { fontSize: 14, fontWeight: '900', color: THEME.text, marginBottom: 8 },
    secHint: { fontSize: 12, color: THEME.sub, marginTop: 6 },

    chipsBox: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        alignItems: 'center',
        borderWidth: 1, borderColor: THEME.line,
        borderRadius: 14, padding: 10, backgroundColor: '#fff',
    },
    chip: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        backgroundColor: '#F4F8FF',
        borderWidth: 1, borderColor: THEME.line,
        paddingHorizontal: 10, height: 32, borderRadius: 999,
    },
    chipText: { color: THEME.text, fontWeight: '700' },

    input: {
        flexGrow: 1, minWidth: 160,
        paddingVertical: 4,
        color: THEME.text,
    },

    invalidBox: {
        marginTop: 10,
        backgroundColor: '#FEF2F2',
        borderWidth: 1, borderColor: '#FEE2E2',
        borderRadius: 12, padding: 10,
        flexDirection: 'row', alignItems: 'center', gap: 8,
    },
    invalidTxt: { color: THEME.err, flex: 1, fontSize: 12.5, fontWeight: '600' },
    clearErr: { color: THEME.err, fontWeight: '800' },

    row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 },
    linkBtn: {
        flexDirection: 'row', gap: 6, alignItems: 'center',
        paddingVertical: 8, paddingHorizontal: 10, borderRadius: 10,
        backgroundColor: '#F3F7FB', borderWidth: 1, borderColor: THEME.line
    },
    linkBtnTxt: { color: THEME.tint, fontWeight: '800' },
    countTxt: { color: THEME.sub, fontWeight: '700' },

    label: { fontSize: 12.5, color: THEME.sub, fontWeight: '700', marginTop: 4 },

    selectBtn: {
        marginTop: 6,
        borderWidth: 1, borderColor: THEME.line,
        backgroundColor: '#fff',
        borderRadius: 12, paddingHorizontal: 12, height: 44,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    },
    selectTxt: { color: THEME.text, fontWeight: '700' },

    expRow: { flexDirection: 'row', gap: 8, marginTop: 6, flexWrap: 'wrap' },
    pill: {
        paddingHorizontal: 12, height: 32, borderRadius: 999,
        borderWidth: 1, borderColor: THEME.line,
        alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff'
    },
    pillActive: { backgroundColor: '#E6FBF4', borderColor: '#BBF7D0' },
    pillTxt: { color: THEME.text, fontWeight: '700' },
    pillTxtActive: { color: THEME.ok },

    textArea: {
        marginTop: 6,
        borderWidth: 1, borderColor: THEME.line,
        backgroundColor: '#fff', borderRadius: 12,
        padding: 12, minHeight: 90, textAlignVertical: 'top',
        color: THEME.text, fontWeight: '600'
    },

    linkBox: {
        borderWidth: 1, borderColor: THEME.line, backgroundColor: '#fff',
        borderRadius: 12, padding: 12,
    },
    linkTxt: { color: THEME.text, fontWeight: '700' },

    ghostBtn: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        paddingVertical: 8, paddingHorizontal: 12,
        backgroundColor: '#F8FAFD',
        borderRadius: 10, borderWidth: 1, borderColor: THEME.line
    },
    ghostBtnTxt: { color: THEME.text, fontWeight: '800' },

    fab: {
        position: 'absolute', left: 16, right: 16, bottom: 20,
        borderRadius: 18, overflow: 'hidden',
    },
    fabInner: {
        height: 52, alignItems: 'center', justifyContent: 'center',
        flexDirection: 'row', gap: 8,
        shadowColor: THEME.shadow, shadowOpacity: 0.18, shadowRadius: 14,
        shadowOffset: { width: 0, height: 10 }, elevation: 6,
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.6)',
        borderTopWidth: 0,
    },
    fabTxt: { color: '#fff', fontWeight: '900', fontSize: 16 },

    modalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.2)' },
    modalSheet: {
        position: 'absolute', left: 0, right: 0, bottom: 0,
        backgroundColor: '#fff',
        borderTopLeftRadius: 20, borderTopRightRadius: 20,
        padding: 16, maxHeight: '60%',
        shadowColor: THEME.shadow, shadowOpacity: 0.18, shadowRadius: 14, elevation: 8
    },
    sheetTitle: { color: THEME.text, fontWeight: '900', marginBottom: 10, fontSize: 16 },
    roleItem: {
        height: 48, borderRadius: 12, borderWidth: 1, borderColor: THEME.line,
        backgroundColor: '#fff', paddingHorizontal: 12,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
    },
    roleLabel: { color: THEME.text, fontWeight: '700' },
});
