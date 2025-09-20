import { useTheme } from "@react-navigation/native";
import React from "react";

export const ThemeContext = React.createContext({
  isDarkMode: false,
  toggleTheme: () => {},
});

export const themeFonts = {
  kanit: 'Kanit-Regular',
  kanitBold: 'Kanit-Bold',
  kanitLight: 'Kanit-Light'
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { colors } = useTheme();
  const isDarkMode = colors.background === 'black';

  const toggleTheme = () => {
    // Implement theme toggling logic here
    console.log("Theme toggled");
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => React.useContext(ThemeContext);
export const withTheme = (Component: React.ComponentType<any>) => {
  return (props: any) => {
    const themeContext = useThemeContext();
    return <Component {...props} theme={themeContext} />;
  };
}
;
// Usage example:
// import { ThemeProvider, useThemeContext } from './ThemeContext';
//
// function App() {
//   return (
//     <ThemeProvider>
//       <YourComponent />
//     </ThemeProvider>
//   );
// }
//
// function YourComponent() {
//   const { isDarkMode, toggleTheme } = useThemeContext();
//   return (
//     <View style={{ backgroundColor: isDarkMode ? 'black' : 'white' }}>
//       <Text style={{ color: isDarkMode ? 'white' : 'black' }}>
//         Current theme is {isDarkMode ? 'Dark' : 'Light'}
//       </Text>
//       <Button title="Toggle Theme" onPress={toggleTheme} />
//     </View>
//   );
// }
// export default App;
//