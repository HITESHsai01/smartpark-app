// Clerk token cache using expo-secure-store
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import type { TokenCache } from "@clerk/clerk-expo";

/**
 * Secure token cache for Clerk (uses SecureStore on native, memory on web)
 */
const createTokenCache = (): TokenCache => {
  return {
    getToken: async (key: string) => {
      try {
        if (Platform.OS === "web") {
          return localStorage.getItem(key);
        }
        return await SecureStore.getItemAsync(key);
      } catch (error) {
        console.error("Token cache getToken error:", error);
        return null;
      }
    },
    saveToken: async (key: string, token: string) => {
      try {
        if (Platform.OS === "web") {
          localStorage.setItem(key, token);
          return;
        }
        await SecureStore.setItemAsync(key, token);
      } catch (error) {
        console.error("Token cache saveToken error:", error);
      }
    },
    clearToken: async (key: string) => {
      try {
        if (Platform.OS === "web") {
          localStorage.removeItem(key);
          return;
        }
        await SecureStore.deleteItemAsync(key);
      } catch (error) {
        console.error("Token cache clearToken error:", error);
      }
    },
  };
};

export const tokenCache = createTokenCache();
