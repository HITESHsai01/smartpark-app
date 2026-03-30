// Centered loading spinner
import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { COLORS } from "@/lib/constants";

interface LoadingSpinnerProps {
  size?: "small" | "large";
  color?: string;
  fullScreen?: boolean;
}

export default function LoadingSpinner({
  size = "large",
  color = COLORS.primary,
  fullScreen = false,
}: LoadingSpinnerProps) {
  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  fullScreen: {
    flex: 1,
  },
});
