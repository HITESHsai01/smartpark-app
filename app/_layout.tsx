// Polyfill console for early boot errors in RN 0.77+
if (typeof console === "undefined") {
  (global as any).console = {
    log: () => {},
    error: () => {},
    warn: () => {},
    info: () => {},
    debug: () => {},
    trace: () => {},
  };
}

// Root layout — ClerkProvider, NativeWind, Toast, auth-based routing
import React, { useEffect } from "react";
import { Slot, useRouter, useSegments } from "expo-router";
import { ClerkProvider, ClerkLoaded, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from "../lib/auth";
import { CLERK_PUBLISHABLE_KEY } from "../lib/constants";
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";
import "../global.css";

function AuthGate() {
  const { isSignedIn, isLoaded } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inOwnerAuth =
      segments[0] === "owner" &&
      (segments[1] === "sign-in" || segments[1] === "sign-up");

    if (!isSignedIn && !inAuthGroup && !inOwnerAuth) {
      // Not signed in and not on an auth page — redirect to sign-in
      router.replace("/(auth)/sign-in");
    } else if (isSignedIn && inAuthGroup) {
      // Signed in but on auth page — redirect to home
      router.replace("/(tabs)");
    }
  }, [isSignedIn, isLoaded, segments]);

  return <Slot />;
}

export default function RootLayout() {
  return (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
    >
      <ClerkLoaded>
        <StatusBar style="auto" />
        <AuthGate />
        <Toast />
      </ClerkLoaded>
    </ClerkProvider>
  );
}
