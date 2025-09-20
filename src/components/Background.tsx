import React from 'react'
import { View, StyleSheet, KeyboardAvoidingView } from 'react-native'
// import { theme } from '../theme/theme';



type BackgroundProps = {
  children: React.ReactNode;
  [key: string]: any; // Accept any additional props
};

export default function Background({ children }: BackgroundProps) {
  return (

    <View style={styles.background}>
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        {children}
      </KeyboardAvoidingView>

    </View>



  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    // // backgroundColor: theme.colors.primary,
    position: 'absolute',
    height: '100%',

  },
  container: {
    flex: 1,
    // padding: 20,
    width: '100%',
    // // maxWidth: 340,
    alignSelf: 'center',
    // alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: theme.colors.background, // Use the background color from the theme
  },
})
