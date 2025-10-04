import React, { memo } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Pressable, GestureResponderEvent } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { UI } from '../theme/theme';

type Props = {
  name: string;
  role: 'owner' | 'hr' | 'manager' | 'employee';
  subtitle?: string;            // ใช้แสดงตำแหน่ง/อีเมล ถ้าต้องการ
  avatarUrl?: string;
  onPressBell?: () => void;
};

const ROLE_LABEL: Record<Props['role'], string> = {
  owner: 'Owner', hr: 'HR', manager: 'Manager', employee: 'Employee'
};

export default function HeaderProfileFlat({ name, role, subtitle, avatarUrl, onPressBell }: Props) {
  return (
    <View style={S.wrap}>
      <View style={S.left}>
        <Image
          source={avatarUrl ? { uri: avatarUrl } : require('@/assets/icon1.png')}
          style={S.avatar}
        />
        <View style={{ flex: 1 }}>
          <View style={S.row}>
            <Text style={S.name} numberOfLines={1}>{name}</Text>
            <View style={S.roleChip}>
              <Text style={S.roleText}>{ROLE_LABEL[role]}</Text>
            </View>
          </View>
          {!!subtitle && <Text style={S.sub} numberOfLines={1}>{subtitle}</Text>}
        </View>
      </View>
      <TouchableOpacity onPress={onPressBell} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Ionicons name="notifications-outline" size={22} color="#1f2937" />
      </TouchableOpacity>
    </View>
  );
}
export const HeaderBar = memo(function HeaderBar({
  avatar, name, role, onPressBell
}: {
  avatar: any;
  name: string;
  role: string;
  onPressBell?: () => void;
}) {

    return (
    <View style={S.headerFloat}>
      <View style={S.hLeft}>
        <View style={S.avatarRing}><Image source={avatar} style={S.avatar}/></View>
        <View>
          <Text style={S.name}>{name}</Text>
          <Text style={S.role}>{role}</Text>
        </View>
      </View>
      <Pressable hitSlop={S.HIT} android_ripple={{color:'#e9eef4'}}>
        <Ionicons name="notifications-outline" size={22} color={UI.color.text} onPress={onPressBell}/>
      </Pressable>
    </View>
  );
});

const S = StyleSheet.create({
  wrap: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
 
/* Header floating */
headerFloat:{
  marginHorizontal:UI.space.lg, marginTop:UI.space.md, marginBottom:UI.space.sm,
  paddingHorizontal:UI.space.lg, paddingVertical:UI.space.md,
  borderRadius:UI.radius.xl,
  backgroundColor:'rgba(255,255,255,0.92)',
  borderWidth:1, borderColor:'rgba(255,255,255,0.65)',
  shadowColor:'#0f172a', shadowOpacity:0.08, shadowRadius:12, elevation:2,
  flexDirection:'row', alignItems:'center', justifyContent:'space-between'
},
  HIT:{top:8,bottom:8,left:8,right:8},
  left: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#e6eef5' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  name: { fontSize: 18, fontWeight: '800', color: '#0f172a', maxWidth: 180 },
  roleChip: { backgroundColor: '#e6f7f5', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  roleText: { fontSize: 12, fontWeight: '700', color: '#0b8f86' },
  sub: { fontSize: 13, color: '#64748b', marginTop: 2 },
    hLeft:{ flexDirection:'row', alignItems:'center', gap:UI.space.md },
  avatarRing:{
    width:48, height:48, borderRadius:24, alignItems:'center', justifyContent:'center',
    backgroundColor:'#F1F5FE', borderWidth:1, borderColor:'#E6ECFF'
  },
  role:{ fontSize:UI.font.meta, color:UI.color.sub, marginTop:2 },

});
