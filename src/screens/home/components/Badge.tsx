import { LeaveStatus } from "@/src/interface/leaveHistory";
import { COLOR, FONT } from "@/src/theme/token";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export function Badge({ status }: { status: LeaveStatus }) {
    const STATUS_UI: Record<LeaveStatus, { label: string; icon: any; bg: string; fg: string }> = {
        PENDING: { label: 'รออนุมัติ', icon: 'time-outline', bg: '#FFF6E5', fg: '#B45309' },
        APPROVED: { label: 'อนุมัติแล้ว', icon: 'checkmark-circle', bg: '#E9FBF4', fg: '#047857' },
        REJECTED: { label: 'ถูกปฏิเสธ', icon: 'close-circle', bg: '#FEE2E2', fg: '#B91C1C' },
        CANCELLED: { label: 'ยกเลิก', icon: 'ban-outline', bg: '#F3F4F6', fg: '#6B7280' },
        ALL: {
            label: "",
            icon: undefined,
            bg: "",
            fg: ""
        }
    };
    const ui = STATUS_UI[status];
    return (
        <View style={[styles.badge, { backgroundColor: ui.bg }]}>
            <Ionicons name={ui.icon as any} size={16} color={ui.fg} />
            <Text style={[styles.badgeText, { color: ui.fg }]}>{ui.label}</Text>
        </View>
    );
}



export function Primary({ onPress, icon, text }: { onPress?: () => void; icon: any; text: string }) {
    return (
        <TouchableOpacity onPress={onPress} style={styles.btnPrimary} disabled={!onPress} accessibilityLabel={text}>
            <Ionicons name={icon} size={18} color="#fff" style={{ marginRight: 6 }} />
            <Text style={styles.btnPrimaryText}>{text}</Text>
        </TouchableOpacity>
    );
}
export function Ghost({ onPress, icon, text }: { onPress?: () => void; icon: any; text: string }) {
    return (
        <TouchableOpacity onPress={onPress} style={styles.btnGhost} disabled={!onPress} accessibilityLabel={text}>
            <Ionicons name={icon} size={18} color={COLOR.primary} style={{ marginRight: 6 }} />
            <Text style={styles.btnGhostText}>{text}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    badge: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
    badgeText: { fontFamily: FONT.body, fontSize: 13, marginLeft: 6 },
    btnPrimary: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLOR.primary, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
    btnPrimaryText: { color: '#fff', fontFamily: FONT.bodyMedium, fontSize: 14 },
    btnGhost: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
    btnGhostText: { color: COLOR.primary, fontFamily: FONT.bodyMedium, fontSize: 14 },
});

