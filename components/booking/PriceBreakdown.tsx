// Price breakdown — rate × hours = total
import React from "react";
import { View, Text, StyleSheet, useColorScheme } from "react-native";
import { COLORS } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";

interface PriceBreakdownProps {
  rate: number;
  hours: number;
}

export default function PriceBreakdown({ rate, hours }: PriceBreakdownProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const total = rate * hours;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? "#1a1a2e" : "#eff6ff",
          borderColor: isDark ? "#1e3a8a" : "#bfdbfe",
        },
      ]}
    >
      <View style={styles.row}>
        <Text
          style={[
            styles.label,
            { color: isDark ? COLORS.dark.textSecondary : "#4b5563" },
          ]}
        >
          Rate
        </Text>
        <Text
          style={[
            styles.value,
            { color: isDark ? COLORS.dark.text : COLORS.light.text },
          ]}
        >
          {formatCurrency(rate)}/hr
        </Text>
      </View>

      <View style={styles.row}>
        <Text
          style={[
            styles.label,
            { color: isDark ? COLORS.dark.textSecondary : "#4b5563" },
          ]}
        >
          Duration
        </Text>
        <Text
          style={[
            styles.value,
            { color: isDark ? COLORS.dark.text : COLORS.light.text },
          ]}
        >
          {hours} {hours === 1 ? "hour" : "hours"}
        </Text>
      </View>

      <View style={[styles.row, styles.totalRow]}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  label: { fontSize: 14 },
  value: { fontSize: 14, fontWeight: "600" },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#2563eb30",
    marginTop: 4,
    paddingTop: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2563eb",
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#2563eb",
    letterSpacing: -0.5,
  },
});
