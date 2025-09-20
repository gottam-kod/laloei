import React from 'react'
import { Image, StyleSheet } from 'react-native'

export default function Logo() {
  return (

      <Image
        source={require('../../assets/logo3.png')}
        style={styles.image}
        // resizeMode="contain"
      />
  );

  
}

const styles = StyleSheet.create({
  image: {
    width: 140,
    height: 140,
  },
})
