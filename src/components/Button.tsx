import React from 'react';
import { Text, TouchableOpacity, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { COLOR, SHADOW, RADIUS } from '../theme/theme';

type Props = {
  title: string;
  onPress?: () => void;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  variant?: 'solid' | 'outline' | 'ghost';
};

const Button: React.FC<Props> = ({ title, onPress, loading, style, textStyle, variant='solid' }) => {
  if (variant === 'solid') {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={[{ borderRadius: RADIUS.md, overflow: 'hidden' }, style]}>
        <LinearGradient colors={[COLOR.primary, COLOR.accent]} start={{x:0,y:0}} end={{x:1,y:1}} style={{ paddingVertical: 12, paddingHorizontal: 16 }}>
          {loading ? <ActivityIndicator/> : <Text style={[{ color: 'white', fontWeight: '700', textAlign: 'center' }, textStyle]}>{title}</Text>}
        </LinearGradient>
      </TouchableOpacity>
    );
  }
  if (variant === 'outline') {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={[{ borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLOR.primary, paddingVertical: 12, paddingHorizontal: 16, backgroundColor: 'white' }, style]}>
        {loading ? <ActivityIndicator/> : <Text style={[{ color: COLOR.primary, fontWeight: '700', textAlign: 'center' }, textStyle]}>{title}</Text>}
      </TouchableOpacity>
    );
  }
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={[{ paddingVertical: 10, paddingHorizontal: 12, borderRadius: RADIUS.md }, style]}>
      <Text style={[{ color: COLOR.text, fontWeight: '600', textAlign: 'center' }, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default Button;
