// Styled card component with dark mode support
import React from "react";
import { View, StyleSheet, useColorScheme, ViewStyle } from "react-native";
import { COLORS } from "@/lib/constants";

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  noPadding?: boolean;
}

export default function Card({ children, style, noPadding }: CardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: isDark ? COLORS.dark.card : COLORS.light.card,
          borderColor: isDark ? COLORS.dark.border : COLORS.light.border,
        },
        !noPadding && styles.padding,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  padding: {
    padding: 16,
  },
});
