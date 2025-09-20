import React from 'react'
import { StyleSheet, Dimensions, View } from 'react-native'

// import { theme } from '../theme/theme';
const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');
// const curveHeight = (deviceHeight * 1.5) / 4;

type HeaderProps = {
  children?: React.ReactNode;
  [key: string]: any; // Accept any additional props
};
export default function Header({ children, ...props }: HeaderProps) {

  return (
    <View style={{ flex: 1 }} {...props}>
      <View style={styles.container}>
        {children}
      </View>


    </View>
  );

}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "lightblue",
    borderBottomLeftRadius: deviceWidth * 10,
    borderBottomRightRadius: deviceWidth * 10,
    height: deviceHeight * 0.4,
    width: deviceWidth * 1.8,
    alignItems: 'center',
    justifyContent: 'center'
  },
});