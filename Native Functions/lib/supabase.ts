import "react-native-url-polyfill/auto";
import { AppState, AppStateStatus } from "react-native";
import { createClient } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseKey =
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

const ExpoSecureStoreAdapter = {
  getItem: async (key: string) => {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.warn("SecureStore getItem failed:", key, error);
      return null;
    }
  },

  setItem: async (key: string, value: string) => {
    try {
      if (value.length > 2048) {
        console.warn(
          "Value being stored in SecureStore is larger than 2048 bytes and may fail on some iOS versions.",
        );
      }

      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.warn("SecureStore setItem failed:", key, error);
    }
  },

  removeItem: async (key: string) => {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.warn("SecureStore removeItem failed:", key, error);
    }
  },
};

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

let appStateListenerRegistered = false;

export const registerSupabaseAutoRefresh = () => {
  if (appStateListenerRegistered) return;

  const onAppStateChange = (state: AppStateStatus) => {
    if (state === "active") {
      supabase.auth.startAutoRefresh();
    } else {
      supabase.auth.stopAutoRefresh();
    }
  };

  AppState.addEventListener("change", onAppStateChange);
  onAppStateChange(AppState.currentState);

  appStateListenerRegistered = true;
};