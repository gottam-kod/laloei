import Ionicons from 'react-native-vector-icons/Ionicons';
import React from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { COLOR, UI, SP, FONT } from '../../theme/token';

type Props = {
  titleOpacity: Animated.AnimatedInterpolation<number>,
  organizationName: string,
  subtitle: string,
  avatar: string,
  onPressAvatar?: () => void,
  onPressNotification?: () => void,
};

export default function HeaderBar({ titleOpacity, organizationName , subtitle, avatar , onPressAvatar, onPressNotification}: Props) {
  return (
    <View style={styles.headerRow}>
      <Animated.View style={{ flex: 1, opacity: titleOpacity }}>
        <Text style={[styles.appTitle, { fontFamily: FONT.heading }]}>{organizationName}</Text>
        <Text style={[styles.appSub, { fontFamily: FONT.body }]}>{subtitle}</Text>
      </Animated.View>
      <Pressable style={styles.iconBtn} onPress={onPressNotification} >
        <Ionicons name="notifications-outline" size={18} color={COLOR.text} />
      </Pressable>
      <Pressable onPress={onPressAvatar}>
        <Image source={{ uri: avatar }} style={styles.avatar}/>
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'center', columnGap: SP.sm },
  appTitle: { fontSize: 20, fontWeight: '800', color: COLOR.text },
  appSub: { fontSize: 12, color: COLOR.sub, marginTop: 2 },
  iconBtn: { padding: 10, backgroundColor: COLOR.card, borderRadius: UI.radius.xl, borderWidth: 1, borderColor: COLOR.line },
  avatar: { width: 34, height: 34, borderRadius: 17, marginLeft: SP.sm },
});
