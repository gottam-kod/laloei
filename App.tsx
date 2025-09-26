import 'react-native-gesture-handler';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import RootStackNavigator from './src/navigation/RootStackNavigator';

import * as SecureStore from 'expo-secure-store';
import * as Localization from 'expo-localization';
import i18n from './src/lang/i18n'; // ไฟล์ตั้งค่า i18next ของคุณ
import { navigationRef } from './src/navigation/navigationRef';



const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: '#ffffff', // กันไม่ให้จอดำ
    },
};

export default function App() {
    React.useEffect(() => {
        (async () => {
            try {
                const stored = await SecureStore.getItemAsync('app-lang');
                const fallback = (Localization.getLocales()[0]?.languageCode || '').startsWith('th') ? 'th' : 'en';
                const want = stored ?? fallback;
                const current = (i18n.resolvedLanguage || i18n.language || '').slice(0, 2);
                if (current !== want) await i18n.changeLanguage(want);
            } catch (e) {
                console.warn('load lang error:', e);
            }
        })();
    }, []);
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <NavigationContainer theme={theme} ref={navigationRef}>
                <RootStackNavigator />
            </NavigationContainer>
        </GestureHandlerRootView>
    );
}
