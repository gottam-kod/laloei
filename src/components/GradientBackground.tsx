import React from 'react';
import LinearGradient from 'react-native-linear-gradient';

const GradientBackground: React.FC<{children?: React.ReactNode}> = ({ children }) => {
  return (
    <LinearGradient colors={['#e6f7ff','#f7fffb']} start={{x:0,y:0}} end={{x:1,y:1}} style={{ flex: 1 }}>
      {children}
    </LinearGradient>
  );
};

export default GradientBackground;
