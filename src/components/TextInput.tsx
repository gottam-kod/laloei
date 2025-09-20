import React from 'react'
import { View, StyleSheet, Text, TextInput as RNTextInput } from 'react-native'
import { theme } from '../theme/theme'


type TextInputProps = {
  errorText?: string;
  description?: string;
  [key: string]: any;
};

export default function TextInput({ errorText, description, ...props }: TextInputProps) {
  return (
    <View style={styles.container}>
      <RNTextInput
        // style={{ height: 40, borderColor: 'gray', borderRadius: 50 }}
        style={styles.input}
        selectionColor={theme.colors.secondary}
        placeholder={props.label}
        // mode="outlined" // Uncomment if you want outlined style
        {...props}
      />
      {description && !errorText ? (
        <Text style={styles.description}>{description}</Text>
      ) : null}
      {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
    </View>
    
  )
}
const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 10,
  },
  input: {
    height: 50,
    borderColor: theme.colors.primary,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 20,
    fontSize: 16,
    color: theme.colors.text,
  },
  description: {
    fontSize: 12,
    color: theme.colors.secondary,
    marginTop: 5,
  },
  error: {
    fontSize: 12,
    color: theme.colors.error,
    marginTop: 5,
  },
})