import React, { memo, ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { UI } from '../theme/token';

export type QuickAction = {
  badge: ReactNode;
  key: string;
  label: string;
  icon: string;         // Ionicons name e.g. "document-text-outline"
  onPress?: () => void;
};

type Props = {
  actions: QuickAction[];
  columns?: 2 | 3 | 4;  // จำนวนคอลัมน์ต่อแถว
  shape?: 'rounded' | 'circle';
};


// QuickActions
export const QuickActions = memo(function QuickActions({items,onPress}:{items:QuickAction[]; onPress?:(k:string)=>void;}){
  return (
    <View style={S.qaRow}>
      {items.map(it=>(
        <Pressable
          key={it.key}
          onPress={()=>onPress?.(it.key)}
          style={({pressed})=>[
            S.tileFloat, pressed ? S.liftPressed : S.liftIdle
          ]}
          android_ripple={{color:'#d5dce4ff'}}
        >
          <View style={S.tileIconWrap}>
            <LinearGradient colors={['#FFFFFF','#51c7e8ff']} start={{x:0,y:0}} end={{x:1,y:1}} style={S.tileIcon}>
              <Ionicons name={it.icon} size={18} color={UI.color.text}/>
            </LinearGradient>
          </View>
          <View style={{flexDirection:'row', alignItems:'center', gap:6}}>
            <Text style={S.tileTxt} numberOfLines={1}>{it.label}</Text>
            {it.badge ? <View style={S.badgeSmall}><Text style={S.badgeSmallTxt}>{it.badge}</Text></View> : null}
          </View>
        </Pressable>
      ))}
    </View>
  );
});

const S = StyleSheet.create({
   /* Quick */
   qaRow:{ flexDirection:'row', flexWrap:'wrap', gap:UI.space.md, justifyContent:'space-between' },
   tile:{ width:'48%', paddingVertical:16, paddingHorizontal:14, backgroundColor:UI.color.card, borderRadius:UI.radius.xl, borderWidth:1, borderColor:UI.color.line, ...UI.shadowCard },
   tileIconWrap:{ marginBottom:8 },
   tileTxt:{ fontSize:UI.font.body, fontWeight:'800', color:UI.color.text },
   badgeSmall:{ height:18, paddingHorizontal:6, backgroundColor:'#ef4444', borderRadius:UI.radius.pill, alignItems:'center', justifyContent:'center' },
   badgeSmallTxt:{ color:'#fff', fontSize:11, fontWeight:'800' },

  tileFloat:{
    backgroundColor:'rgba(42, 197, 236, 0.28)',
    borderRadius:UI.radius.xl,
    paddingVertical:16, paddingHorizontal:14,
    borderWidth:1, borderColor:'rgba(255,255,255,0.65)',
    shadowColor:'#0f172a', shadowOpacity:0.08, shadowRadius:12, elevation:2,
    width:'48%',
  },
  /* Lift effect */
  liftIdle:{ transform:[{translateY:0}], shadowOpacity:0.08, elevation:2 },
  liftPressed:{ transform:[{translateY: -1}], shadowOpacity:0.12, elevation:4 },

 /* ปรับของเดิมเล็กน้อยให้เข้าธีมลอย */
  tileIcon:{
    width:40, height:40, borderRadius:12,
    alignItems:'center', justifyContent:'center',
    borderWidth:1, borderColor:'rgba(15,23,42,0.06)',
    backgroundColor:'#FFFFFF'
  },
});
