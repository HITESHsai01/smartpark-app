// Duration selector — increment/decrement hours
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from "react-native";
import { Minus, Plus } from "lucide-react-native";
import { COLORS } from "@/lib/constants";

interface DurationSelectorProps {
  hours: number;
  onChange: (hours: number) => void;
  minHours?: number;
  maxHours?: number;
}

export default function DurationSelector({
  hours,
  onChange,
  minHours = 1,
  maxHours = 24,
}: DurationSelectorProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.label,
          { color: isDark ? COLORS.dark.textSecondary : COLORS.light.textSecondary },
        ]}
      >
        Duration
      </Text>

      <View style={styles.selectorRow}>
        <TouchableOpacity
          onPress={() => onChange(Math.max(minHours, hours - 1))}
          style={[
            styles.button,
            {
              backgroundColor: isDark ? "#27272a" : "#f3f4f6",
              borderColor: isDark ? COLORS.dark.border : "#e5e7eb",
            },
          ]}
          disabled={hours <= minHours}
          activeOpacity={0.7}
        >
          <Minus size={20} color={hours <= minHours ? "#d1d5db" : COLORS.primary} />
        </TouchableOpacity>

        <View style={styles.display}>
          <Text
            style={[
              styles.hoursValue,
              { color: isDark ? COLORS.dark.text : COLORS.light.text },
            ]}
          >
            {hours}
          </Text>
          <Text style={styles.hoursLabel}>
            {hours === 1 ? "hour" : "hours"}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => onChange(Math.min(maxHours, hours + 1))}
          style={[
            styles.button,
            {
              backgroundColor: isDark ? "#27272a" : "#f3f4f6",
              borderColor: isDark ? COLORS.dark.border : "#e5e7eb",
            },
          ]}
          disabled={hours >= maxHours}
          activeOpacity={0.7}
        >
          <Plus size={20} color={hours >= maxHours ? "#d1d5db" : COLORS.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  label: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  selectorRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
  },
  button: {
    width: 48,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  display: { alignItems: "center", minWidth: 60 },
  hoursValue: {
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: -1,
  },
  hoursLabel: {
    fontSize: 13,
    color: "#9ca3af",
    marginTop: -2,
  },
});
