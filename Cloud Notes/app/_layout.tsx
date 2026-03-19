import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import Toast from "react-native-toast-message";

import { SplashScreenController } from "@/components/splash-screen-controller";
import { useColorScheme } from "@/components/useColorScheme";
import { useAuthContext } from "@/hooks/auth-context";
import AuthProvider from "@/providers/auth-provider";
import { NotesProvider } from "./NotesContext";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { isLoggedIn } = useAuthContext();

  console.log('isLoggedIn:', isLoggedIn)

  return (
    <Stack>
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ title: "Profile" }} />
      </Stack.Protected>

      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  const colorScheme = useColorScheme();

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <AuthProvider>
          <NotesProvider>
            <SplashScreenController />
            <RootNavigator />
            <StatusBar style="auto" />
          </NotesProvider>
        </AuthProvider>
      </ThemeProvider>
      <Toast />
    </>
  );
}