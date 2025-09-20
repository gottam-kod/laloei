
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '../theme/theme'; 

type ConterProps = {
  children: React.ReactNode;
  style?: object;
  [key: string]: any; 
};
export default function Container({ children, style, ...props }: ConterProps) {
  return (
    <View style={[styles.container, style]} {...props}>
      {children}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    position: "absolute",
    padding: 20,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background, // Use the background color from the theme
  },
});