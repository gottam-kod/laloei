import React from 'react'
import { StyleSheet } from 'react-native'
import { Button as PaperButton } from 'react-native-paper'
import { theme } from '../theme/theme'

type ButtonProps = {
  mode?: 'text' | 'outlined' | 'contained';
  style?: object;
  [key: string]: any; // Accept any additional props
};

export default function Button({ mode, style, ...props }: ButtonProps) {
  return (
    <PaperButton
      children={undefined} style={[
        styles.button,
        mode === 'outlined' && { backgroundColor: theme.colors.primary },
        style,
      ]}
      labelStyle={styles.text}
      mode={mode}
      {...props}    />
  )
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    marginVertical: 10,
    paddingVertical: 2,
    backgroundColor: theme.colors.primary,
    borderRadius: 20,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 15,
    lineHeight: 26,
  },
})
