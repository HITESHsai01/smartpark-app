// Owner revenue pie chart
import React from "react";
import { View, Text, StyleSheet, useColorScheme, Dimensions } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { COLORS } from "@/lib/constants";

interface RevenueData {
  name: string;
  revenue: number;
  color: string;
}

interface RevenueChartProps {
  data: RevenueData[];
}

const chartColors = [
  "#2563eb",
  "#06b6d4",
  "#7c3aed",
  "#f97316",
  "#22c55e",
  "#ec4899",
];

export default function RevenueChart({ data }: RevenueChartProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const screenWidth = Dimensions.get("window").width - 64;

  const chartData = data.map((item, index) => ({
    name: item.name,
    population: item.revenue,
    color: chartColors[index % chartColors.length],
    legendFontColor: isDark ? "#a3a3a3" : "#6b7280",
    legendFontSize: 12,
  }));

  if (chartData.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No revenue data available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <PieChart
        data={chartData}
        width={screenWidth}
        height={180}
        chartConfig={{
          color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
          labelColor: () => (isDark ? "#a3a3a3" : "#6b7280"),
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="0"
        absolute
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", marginVertical: 8 },
  empty: {
    padding: 32,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#9ca3af",
  },
});
