import React, { useEffect, useState } from 'react';
import { PaperProvider } from 'react-native-paper';
import { Stack, useSegments, useRouter } from 'expo-router';
import { lightTheme, darkTheme } from '../constants/theme';
import { useAuth } from '../hooks/useAuth';
import { useColorScheme } from 'react-native';

export default function AppLayout() {
  const colorScheme = useColorScheme();
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  
  const [theme, setTheme] = useState(colorScheme === 'dark' ? darkTheme : lightTheme);

  useEffect(() => {
    setTheme(colorScheme === 'dark' ? darkTheme : lightTheme);
  }, [colorScheme]);

  // Handle auth state changes
  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';
    
    if (!session && !inAuthGroup) {
      // Redirect to auth screens if not logged in
      router.replace('/welcome');
    } else if (session && inAuthGroup) {
      // Redirect to main app if logged in
      router.replace('/(dashboard)');
    }
  }, [session, segments, loading, router]);

  return (
    <PaperProvider theme={theme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)/welcome" />
        <Stack.Screen name="(auth)/login" />
        <Stack.Screen name="(auth)/signup" />
        <Stack.Screen name="(dashboard)" />
        <Stack.Screen name="(banks)" />
      </Stack>
    </PaperProvider>
  );
} 