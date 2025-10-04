import { memo } from "react";
import { Pressable, View, Text, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { UI } from "../theme/theme";

// Define the News type
type News = {
  title: string;
  date: string;
  // Add other fields as needed
};

// NewsCarousel (หุ้มเฉพาะการ์ดแต่ละใบ)
export const NewsCarousel = memo(function NewsCarousel({list}:{list:News[]}){
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={S.newsRow}>
      {list.map(n=>(
        <Pressable key={n.title} style={({pressed})=>[S.newsFloat, pressed ? S.liftPressed : S.liftIdle]}>
          <View style={S.newsChip}><Text style={S.newsChipTxt}>News</Text></View>
          <Text style={S.newsTitle} numberOfLines={2}>{n.title}</Text>
          <Text style={S.newsDate}>{n.date}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
});

const S = StyleSheet.create({
  /* News */

  /* News */
  newsRow:{ gap:UI.space.md, paddingRight:4, paddingTop:6 },
  newsCard:{ width:240, backgroundColor:UI.color.card, borderRadius:UI.radius.lg, padding:UI.space.md, borderWidth:1, borderColor:UI.color.line, ...UI.shadowCard },
  newsChip:{ alignSelf:'flex-start', backgroundColor:'#E6F7F5', paddingHorizontal:8, height:22, borderRadius:UI.radius.pill, alignItems:'center', justifyContent:'center', marginBottom:8 },
  newsChipTxt:{ color:UI.color.accentDark, fontWeight:'800', fontSize:UI.font.meta },
  newsTitle:{ color:UI.color.text, fontWeight:'900', fontSize:UI.font.h2, marginBottom:6 },
  newsDate:{ color:'#94A3B8', fontSize:UI.font.meta },

  // Floating News
  newsFloat:{
    width:240,
    backgroundColor:'rgba(255,255,255,0.92)',
    borderRadius:UI.radius.lg,
    padding:UI.space.md,
    borderWidth:1, borderColor:'rgba(255,255,255,0.65)',
    shadowColor:'#0f172a', shadowOpacity:0.08, shadowRadius:12, elevation:2,
  },
  liftIdle:{ transform:[{translateY:0}], shadowOpacity:0.08, elevation:2 },
  liftPressed:{ transform:[{translateY: -1}], shadowOpacity:0.12, elevation:4 },

  tileIcon:{
    width:40, height:40, borderRadius:12,
    alignItems:'center', justifyContent:'center',
    borderWidth:1, borderColor:'rgba(15,23,42,0.06)',
    backgroundColor:'#FFFFFF'
  },
    /* Card base */
  card:{ backgroundColor:UI.color.card, borderRadius:UI.radius.xl, padding:UI.space.lg, borderWidth:1, borderColor:UI.color.line, ...UI.shadowCard },
  
});
