import { useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import 'react-native-reanimated';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { queryClient } from '@/src/lib/queryClient';
import { useAuthStore } from '@/src/stores/authStore';

// Customise navigation themes to match Receipto brand
const ReceiptoLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.green[300],
    background: Colors.bg.primary,
    card: Colors.bg.primary,
    text: Colors.text.primary,
    border: Colors.border.light,
  },
};

const ReceiptoDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: Colors.green[300],
    background: Colors.dark.background,
    card: Colors.bg.cardDark,
    text: Colors.dark.text,
    border: '#2D2D2D',
  },
};

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? ReceiptoDarkTheme : ReceiptoLightTheme;

  const { user, initialising, init } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  // Start the auth listener once
  useEffect(() => {
    const unsubscribe = init();
    return unsubscribe;
  }, [init]);

  // Auth gate: redirect based on auth state
  useEffect(() => {
    if (initialising) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      // Not signed in and not on an auth screen → redirect to login
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      // Signed in but still on an auth screen → redirect to tabs
      router.replace('/(tabs)');
    }
  }, [user, initialising, segments, router]);

  // Show a loading spinner while resolving initial auth state
  if (initialising) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={Colors.green[300]} />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={theme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="modal"
            options={{ presentation: 'modal', title: 'Modal' }}
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.bg.primary,
  },
});
