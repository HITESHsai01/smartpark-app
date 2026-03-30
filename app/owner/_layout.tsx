// Owner stack layout with header
import React from "react";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { COLORS } from "@/lib/constants";

export default function OwnerLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: isDark
            ? COLORS.dark.background
            : COLORS.light.background,
        },
        headerTintColor: isDark ? "#fff" : "#111",
        headerTitleStyle: {
          fontWeight: "700",
          fontSize: 17,
        },
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="index" options={{ title: "Owner Dashboard" }} />
      <Stack.Screen name="bookings" options={{ title: "Manage Bookings" }} />
      <Stack.Screen
        name="properties/index"
        options={{ title: "My Properties" }}
      />
      <Stack.Screen
        name="properties/new"
        options={{ title: "Add Property" }}
      />
      <Stack.Screen name="sign-in" options={{ headerShown: false }} />
      <Stack.Screen name="sign-up" options={{ headerShown: false }} />
    </Stack>
  );
}
