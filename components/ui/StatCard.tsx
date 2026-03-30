// Dashboard stat card with icon, value, and trend
import React from "react";
import { View, Text, StyleSheet, useColorScheme } from "react-native";
import { COLORS } from "@/lib/constants";
import Card from "./Card";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: { value: string; isPositive: boolean };
  accentColor?: string;
}

export default function StatCard({
  title,
  value,
  icon,
  trend,
  accentColor = COLORS.primary,
}: StatCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: accentColor + "15" },
          ]}
        >
          {icon}
        </View>
        {trend && (
          <View
            style={[
              styles.trendBadge,
              {
                backgroundColor: trend.isPositive ? "#dcfce7" : "#fee2e2",
              },
            ]}
          >
            <Text
              style={[
                styles.trendText,
                { color: trend.isPositive ? "#16a34a" : "#dc2626" },
              ]}
            >
              {trend.isPositive ? "↑" : "↓"} {trend.value}
            </Text>
          </View>
        )}
      </View>
      <Text
        style={[
          styles.value,
          { color: isDark ? COLORS.dark.text : COLORS.light.text },
        ]}
      >
        {value}
      </Text>
      <Text
        style={[
          styles.title,
          {
            color: isDark
              ? COLORS.dark.textSecondary
              : COLORS.light.textSecondary,
          },
        ]}
      >
        {title}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, minWidth: 140 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  trendBadge: {
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  trendText: {
    fontSize: 11,
    fontWeight: "600",
  },
  value: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  title: {
    fontSize: 12,
    fontWeight: "500",
  },
});
