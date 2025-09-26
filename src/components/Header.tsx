import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLOR, RADIUS } from '../theme/theme';

type Props = {
  title: string;
  onBack?: () => void;
  right?: React.ReactNode;
};

const Header: React.FC<Props> = ({ title, onBack, right }) => {
  return (
    <LinearGradient colors={[COLOR.primary, COLOR.primary2]} start={{x:0,y:0}} end={{x:1,y:1}} style={{ paddingTop: 52, paddingBottom: 16, paddingHorizontal: 16, borderBottomLeftRadius: RADIUS.lg, borderBottomRightRadius: RADIUS.lg }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <TouchableOpacity onPress={onBack}><Text style={{ color: 'white', fontWeight: '700' }}>{onBack ? '‹' : ''}</Text></TouchableOpacity>
        <Text style={{ color: 'white', fontWeight: '800', fontSize: 18 }}>{title}</Text>
        <View style={{ minWidth: 24 }}>{right}</View>
      </View>
    </LinearGradient>
  );
};

export default Header;
