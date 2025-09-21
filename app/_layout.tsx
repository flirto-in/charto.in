import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import '../global.css';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  
  return (
    <>
      <Stack>
        {/* Main tabs navigation */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        
        {/* Additional pages outside tabs */}
        <Stack.Screen 
          name="settings" 
          options={{ 
            title: 'Settings',
            headerStyle: { backgroundColor: '#1F2937' },
            headerTintColor: '#FFFFFF',
            presentation: 'modal'
          }} 
        />
        <Stack.Screen 
          name="notifications" 
          options={{ 
            title: 'Notifications',
            headerStyle: { backgroundColor: '#1F2937' },
            headerTintColor: '#FFFFFF',
          }} 
        />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}
