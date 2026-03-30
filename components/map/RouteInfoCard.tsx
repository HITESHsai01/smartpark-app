// Route info overlay — total distance, duration, selected parking name
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from "react-native";
import { X, Navigation } from "lucide-react-native";
import { COLORS } from "@/lib/constants";
import { formatDistance, formatDuration } from "@/lib/utils";

interface RouteInfoCardProps {
  distance: number; // km
  duration: number; // minutes
  parkingName: string;
  onClear: () => void;
}

export default function RouteInfoCard({
  distance,
  duration,
  parkingName,
  onClear,
}: RouteInfoCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? COLORS.dark.card : "#ffffff",
          borderColor: isDark ? COLORS.dark.border : "#e5e7eb",
        },
      ]}
    >
      <View style={styles.row}>
        <Navigation size={16} color={COLORS.primary} />
        <View style={styles.info}>
          <Text
            style={[
              styles.stats,
              { color: isDark ? COLORS.dark.text : COLORS.light.text },
            ]}
          >
            {formatDistance(distance)} · {formatDuration(duration)}
          </Text>
          <Text
            numberOfLines={1}
            style={[
              styles.name,
              {
                color: isDark
                  ? COLORS.dark.textSecondary
                  : COLORS.light.textSecondary,
              },
            ]}
          >
            {parkingName}
          </Text>
        </View>
        <TouchableOpacity onPress={onClear} style={styles.closeBtn}>
          <X size={16} color={isDark ? "#a3a3a3" : "#6b7280"} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 16,
    left: 16,
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    minWidth: 180,
    maxWidth: 240,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  info: { flex: 1 },
  stats: {
    fontSize: 14,
    fontWeight: "700",
  },
  name: {
    fontSize: 11,
    marginTop: 2,
  },
  closeBtn: {
    padding: 4,
  },
});
