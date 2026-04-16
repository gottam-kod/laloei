import { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { theme } from "../theme/token";

const SectionTitle = memo(function SectionTitle({
  icon, title, rightLink, onRightPress
}:{ icon?:string; title:string; rightLink?:string; onRightPress?:()=>void }){
  return (
    <View style={S.secRow}>
      <View style={S.secLeft}>
        {icon ? (
          <View style={S.secIcon}>
            <Ionicons name={icon as any} size={14} color={theme.color.text}/>
          </View>
        ) : null}
        <Text style={S.secTitle}>{title}</Text>
      </View>
      {rightLink ? (
        <Pressable hitSlop={HIT} onPress={onRightPress}>
          <Text style={S.link}>{rightLink}</Text>
        </Pressable>
      ) : null}
    </View>
  );
});
export default SectionTitle;

const HIT = { top:8, bottom:8, left:8, right:8 };

const S = StyleSheet.create({

  /* Section title */
  secRow:{ flexDirection:'row', alignItems:'center', justifyContent:'space-between' },
  secLeft:{ flexDirection:'row', alignItems:'center', gap:8 },
  secIcon:{
    width:26, height:26, borderRadius:13, alignItems:'center', justifyContent:'center',
    backgroundColor:'#F2F7FB', borderWidth:1, borderColor:theme.color.line
  },
  secTitle:{ fontSize:theme.font.h2, fontWeight:'900', color:theme.color.text },
  link:{ color:theme.color.accent, fontWeight:'900' },
});