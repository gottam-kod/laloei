import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import RootStackNavigator from './src/navigation/RootStackNavigator';

import { QueryClient, QueryClientProvider, focusManager } from '@tanstack/react-query';
import * as SplashScreen from 'expo-splash-screen';
import * as SecureStore from 'expo-secure-store';
import * as Localization from 'expo-localization';
import i18n from './src/lang/i18n'; // ไฟล์ตั้งค่า i18next ของคุณ
import { navigationRef } from './src/navigation/navigationRef';
import { AppState } from 'react-native';
import { loadFonts } from './src/theme/fonts';
SplashScreen.preventAutoHideAsync();


const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: '#ffffff', // กันไม่ให้จอดำ
    },
};

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: (failCount, err: any) =>
                failCount < 1 && !(err?.status >= 400 && err?.status < 500),
            refetchOnWindowFocus: false, // RN ไม่มี window-focus เหมือนเว็บ แต่เผื่อไว้
            staleTime: 5 * 60 * 1000,
            gcTime: 30 * 60 * 1000,
        },
    },
});

export default function App() {
    const [ready, setReady] = useState(false);

    console.log('App render, ready=', ready);
    React.useEffect(() => {
        (async () => {
            try {
                const stored = await SecureStore.getItemAsync('app-lang');
                const fallback = (Localization.getLocales()[0]?.languageCode || '').startsWith('th') ? 'th' : 'en';
                const want = stored ?? fallback;
                const current = (i18n.resolvedLanguage || i18n.language || '').slice(0, 2);
                if (current !== want) await i18n.changeLanguage(want);
                await loadFonts();
                setReady(true);
                await SplashScreen.hideAsync();
            } catch (e) {
                console.warn('load lang error:', e);
            }
        })();
    }, []);


    React.useEffect(() => {
        const sub = AppState.addEventListener('change', (state) => {
            focusManager.setFocused(state === 'active');
        });
        return () => sub.remove();
    }, []);
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <QueryClientProvider client={queryClient}>
                <NavigationContainer theme={theme} ref={navigationRef}>
                    <RootStackNavigator />
                </NavigationContainer>
            </QueryClientProvider>
        </GestureHandlerRootView>
    );
}
