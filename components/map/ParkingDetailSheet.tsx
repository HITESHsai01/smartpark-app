// Parking detail bottom sheet — shows when a marker is tapped
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
} from "react-native";
import { MapPin, Navigation, CalendarCheck, Check } from "lucide-react-native";
import Button from "@/components/ui/Button";
import Badge, { getBadgeVariant } from "@/components/ui/Badge";
import { COLORS } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import type { MapMarkerData } from "@/lib/types";

interface ParkingDetailSheetProps {
  parking: MapMarkerData;
  onRouteHere: () => void;
  onBook: () => void;
  onClose: () => void;
}

export default function ParkingDetailSheet({
  parking,
  onRouteHere,
  onBook,
  onClose,
}: ParkingDetailSheetProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? COLORS.dark.card : "#ffffff",
          borderColor: isDark ? COLORS.dark.border : "#f3f4f6",
        },
      ]}
    >
      {/* Handle */}
      <View style={styles.handleContainer}>
        <View
          style={[
            styles.handle,
            { backgroundColor: isDark ? "#404040" : "#d1d5db" },
          ]}
        />
      </View>

      {/* Title & Address */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text
            style={[
              styles.title,
              { color: isDark ? COLORS.dark.text : COLORS.light.text },
            ]}
          >
            {parking.title}
          </Text>
          {parking.isBooked && (
            <Badge text="Booked ✓" variant="success" />
          )}
        </View>
        <View style={styles.addressRow}>
          <MapPin size={14} color={isDark ? "#a3a3a3" : "#6b7280"} />
          <Text
            numberOfLines={2}
            style={[
              styles.address,
              {
                color: isDark
                  ? COLORS.dark.textSecondary
                  : COLORS.light.textSecondary,
              },
            ]}
          >
            {parking.address}
          </Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text
            style={[
              styles.statValue,
              { color: isDark ? COLORS.dark.text : COLORS.light.text },
            ]}
          >
            {formatCurrency(parking.rate)}
          </Text>
          <Text style={styles.statLabel}>per hour</Text>
        </View>
        <View
          style={[
            styles.statDivider,
            {
              backgroundColor: isDark ? COLORS.dark.border : "#e5e7eb",
            },
          ]}
        />
        <View style={styles.stat}>
          <Text
            style={[
              styles.statValue,
              {
                color:
                  parking.freeSlots > 0 ? COLORS.success : COLORS.error,
              },
            ]}
          >
            {parking.freeSlots}
          </Text>
          <Text style={styles.statLabel}>
            of {parking.totalSlots} free
          </Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[
            styles.routeBtn,
            {
              borderColor: isDark ? COLORS.dark.border : "#e5e7eb",
            },
          ]}
          onPress={onRouteHere}
          activeOpacity={0.7}
        >
          <Navigation size={16} color={COLORS.primary} />
          <Text style={styles.routeBtnText}>Route Here</Text>
        </TouchableOpacity>

        <View style={styles.bookBtnWrapper}>
          <Button
            title={parking.isBooked ? "Booked!" : "Book This Spot"}
            onPress={onBook}
            disabled={parking.freeSlots === 0 || parking.isBooked}
            icon={
              parking.isBooked ? (
                <Check size={16} color="#fff" />
              ) : (
                <CalendarCheck size={16} color="#fff" />
              )
            }
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderBottomWidth: 0,
    padding: 20,
    paddingBottom: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  handleContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
  },
  header: { marginBottom: 16 },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: -0.3,
    flex: 1,
    marginRight: 8,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 4,
  },
  address: {
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  stat: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 32,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  routeBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 6,
  },
  routeBtnText: {
    color: "#2563eb",
    fontWeight: "600",
    fontSize: 14,
  },
  bookBtnWrapper: { flex: 1 },
});
