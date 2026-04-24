import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  useFonts,
} from "@expo-google-fonts/manrope";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Platform } from "react-native";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { RootStore } from "@/stores/root-store";
import { RootStoreProvider } from "@/stores/root-store-context";

const APP_BACKGROUND = "#F5F8FD";

const AppLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: APP_BACKGROUND,
    card: APP_BACKGROUND,
  },
};

const AppDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: APP_BACKGROUND,
    card: APP_BACKGROUND,
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [queryClient] = useState(() => new QueryClient());
  const [rootStore] = useState(() => new RootStore());
  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <RootStoreProvider store={rootStore}>
        <ThemeProvider
          value={colorScheme === "dark" ? AppDarkTheme : AppLightTheme}
        >
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen
              name="posts/[id]"
              options={{
                headerShown: false,
                gestureEnabled: true,
                ...(Platform.OS === "ios"
                  ? { fullScreenGestureEnabled: true }
                  : null),
              }}
            />
          </Stack>
          <StatusBar style="dark" />
        </ThemeProvider>
      </RootStoreProvider>
    </QueryClientProvider>
  );
}
