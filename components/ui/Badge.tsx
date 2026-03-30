// Color-coded status badge
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "@/lib/constants";

type BadgeVariant = "success" | "warning" | "error" | "info" | "neutral";

interface BadgeProps {
  text: string;
  variant?: BadgeVariant;
}

const variantColors: Record<BadgeVariant, { bg: string; text: string }> = {
  success: { bg: "#dcfce7", text: "#16a34a" },
  warning: { bg: "#fef3c7", text: "#d97706" },
  error: { bg: "#fee2e2", text: "#dc2626" },
  info: { bg: "#dbeafe", text: "#2563eb" },
  neutral: { bg: "#f3f4f6", text: "#6b7280" },
};

export function getBadgeVariant(
  status: string
): BadgeVariant {
  switch (status) {
    case "ACTIVE":
    case "FREE":
    case "Paid":
      return "success";
    case "COMPLETED":
      return "info";
    case "CANCELLED":
    case "OCCUPIED":
      return "error";
    case "RESERVED":
    case "Pending":
      return "warning";
    case "EXPIRED":
    default:
      return "neutral";
  }
}

export default function Badge({ text, variant = "neutral" }: BadgeProps) {
  const colors = variantColors[variant];

  return (
    <View style={[styles.badge, { backgroundColor: colors.bg }]}>
      <Text style={[styles.text, { color: colors.text }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
});
