import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { RADIUS, SHADOW } from '../theme/theme';

type Props = {
  children?: React.ReactNode;
  style?: ViewStyle;
  glass?: boolean;
};

const Card: React.FC<Props> = ({ children, style }) => {
  return (
    <View style={[
      styles.base,
      style
    ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: RADIUS.lg,
    backgroundColor: 'white',
    padding: 16,
    ...SHADOW,
  }
});

export default Card;
