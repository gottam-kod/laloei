import React from 'react'
import { StyleSheet } from 'react-native'
import { Text } from 'react-native-paper'
import { theme } from '../theme/theme';


type LabelProps = {
  [key: string]: any; // Accept any additional props
};
export default function Label({...props }: LabelProps) {
  
  return <Text children={undefined} style={styles.header} {...props} />

}

const styles = StyleSheet.create({
  header: {
    fontSize: 16,
    color: theme.colors.secondary,
    fontWeight: 'bold',
    paddingVertical: 12,
    
  },
})
