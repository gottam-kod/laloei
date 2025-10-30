import * as Font from 'expo-font';

export async function loadFonts() {
  await Font.loadAsync({
    'Prompt-Regular': require('../../assets/fonts/Prompt-Regular.ttf'),
    'Prompt-Medium': require('../../assets/fonts/Prompt-Medium.ttf'),
    'Prompt-SemiBold': require('../../assets/fonts/Prompt-SemiBold.ttf'),
    'Kanit-SemiBold': require('../../assets/fonts/Kanit-SemiBold.ttf'),
    'Kanit-Bold': require('../../assets/fonts/Kanit-Bold.ttf'),
  });
}
