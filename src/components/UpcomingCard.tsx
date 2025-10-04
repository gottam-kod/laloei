import { memo } from "react";
import Floating from "./Floating";
import { View,Text,StyleSheet } from "react-native";
import { UI } from "../theme/theme";
import { Ionicons } from "@expo/vector-icons";

// UpcomingCard
const UpcomingCard = memo(function UpcomingCard({data}:{data:Upcoming[]}){
  const Badge = ({t}:{t:Upcoming['type']})=>{
    const m = t==='VAC' ? {bg:UI.color.chipTeal, fg:'#159B8F', txt:'พักร้อน'} :
              t==='SICK'? {bg:'#FFEDEE', fg:'#C12235', txt:'ป่วย'} :
                          {bg:UI.color.chipGold, fg:'#C7811F', txt:'กิจ'};
    return <View style={[S.upBadge,{backgroundColor:m.bg}]}><Text style={[S.upBadgeTxt,{color:m.fg}]}>{m.txt}</Text></View>;
  };
  return (
    <Floating>
      {data.map((it, idx)=>(
        <View key={idx} style={[S.upRow, idx>0 && {borderTopWidth:1, borderColor:UI.color.line}]}>
          <View style={{flex:1}}>
            <View style={{flexDirection:'row', alignItems:'center', gap:8}}>
              <Text style={S.upTitle}>{it.title}</Text><Badge t={it.type}/>
            </View>
            <Text style={S.upMeta}>{it.date} · {it.days}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#9AA7B7"/>
        </View>
      ))}
    </Floating>
  );
});

/* ============ Styles ============ */
const S = StyleSheet.create({
  /* Upcoming */
  upRow:{ paddingVertical:12, flexDirection:'row', alignItems:'center', gap:10 },
  upTitle:{ color:UI.color.text, fontWeight:'900' },
  upMeta:{ color:UI.color.sub, marginTop:2 },
  upBadge:{ height:22, paddingHorizontal:8, borderRadius:UI.radius.pill, alignItems:'center', justifyContent:'center' },
  upBadgeTxt:{ fontSize:UI.font.meta, fontWeight:'800' },
});

type Upcoming = { title:string; date:string; days:string; type:'VAC'|'SICK'|'OTHER' };

export default UpcomingCard;