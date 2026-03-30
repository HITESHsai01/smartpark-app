// Property card for owner's property list
import React from "react";
import { View, Text, StyleSheet, useColorScheme, TouchableOpacity } from "react-native";
import { MapPin, Car, IndianRupee } from "lucide-react-native";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { COLORS } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import type { ParkingLot } from "@/lib/types";

interface PropertyCardProps {
  property: ParkingLot;
  onPress?: () => void;
}

export default function PropertyCard({ property, onPress }: PropertyCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const freeSlots =
    property.slots?.filter((s) => s.status === "FREE").length || 0;
  const totalSlots = property.slots?.length || property.capacity;
  const occupancyPercent =
    totalSlots > 0
      ? Math.round(((totalSlots - freeSlots) / totalSlots) * 100)
      : 0;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Card style={styles.card}>
        {/* Image placeholder */}
        <View
          style={[
            styles.imageArea,
            { backgroundColor: isDark ? "#1a1a2e" : "#eff6ff" },
          ]}
        >
          <MapPin size={32} color={COLORS.primary} />
        </View>

        {/* Details */}
        <View style={styles.details}>
          <Text
            style={[
              styles.name,
              { color: isDark ? COLORS.dark.text : COLORS.light.text },
            ]}
            numberOfLines={1}
          >
            {property.name}
          </Text>

          <View style={styles.addressRow}>
            <MapPin size={12} color="#9ca3af" />
            <Text style={styles.address} numberOfLines={1}>
              {property.address}
            </Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Car size={12} color={COLORS.primary} />
              <Text
                style={[
                  styles.statText,
                  { color: isDark ? COLORS.dark.text : COLORS.light.text },
                ]}
              >
                {totalSlots} slots
              </Text>
            </View>

            <View style={styles.stat}>
              <IndianRupee size={12} color="#22c55e" />
              <Text
                style={[
                  styles.statText,
                  { color: isDark ? COLORS.dark.text : COLORS.light.text },
                ]}
              >
                {formatCurrency(property.baseRate)}/hr
              </Text>
            </View>
          </View>

          {/* Occupancy bar */}
          <View style={styles.occupancyContainer}>
            <View style={styles.occupancyHeader}>
              <Text style={styles.occupancyLabel}>Occupancy</Text>
              <Text style={styles.occupancyPercent}>{occupancyPercent}%</Text>
            </View>
            <View
              style={[
                styles.occupancyBar,
                { backgroundColor: isDark ? "#27272a" : "#e5e7eb" },
              ]}
            >
              <View
                style={[
                  styles.occupancyFill,
                  {
                    width: `${occupancyPercent}%`,
                    backgroundColor:
                      occupancyPercent >= 80
                        ? COLORS.error
                        : occupancyPercent >= 50
                        ? COLORS.warning
                        : COLORS.success,
                  },
                ]}
              />
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { padding: 0, overflow: "hidden" },
  imageArea: {
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  details: { padding: 14 },
  name: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginBottom: 10,
  },
  address: { fontSize: 12, color: "#9ca3af", flex: 1 },
  statsRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 10,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: { fontSize: 12, fontWeight: "600" },
  occupancyContainer: { marginTop: 2 },
  occupancyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  occupancyLabel: { fontSize: 11, color: "#9ca3af" },
  occupancyPercent: { fontSize: 11, color: "#9ca3af", fontWeight: "600" },
  occupancyBar: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  occupancyFill: {
    height: "100%",
    borderRadius: 3,
  },
});
