// Owner booking card — detailed card for booking management
import React from "react";
import { View, Text, StyleSheet, useColorScheme } from "react-native";
import { Clock, Car, MapPin } from "lucide-react-native";
import Card from "@/components/ui/Card";
import Avatar from "@/components/ui/Avatar";
import Badge, { getBadgeVariant } from "@/components/ui/Badge";
import { COLORS } from "@/lib/constants";
import { formatCurrency, formatDateShort, timeAgo } from "@/lib/utils";
import type { Booking } from "@/lib/types";

interface BookingCardProps {
  booking: Booking;
}

export default function BookingCard({ booking }: BookingCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Card style={styles.card}>
      {/* Header: User info + Status */}
      <View style={styles.header}>
        <View style={styles.userRow}>
          <Avatar name={booking.user?.name} size={40} />
          <View style={styles.userInfo}>
            <Text
              style={[
                styles.userName,
                { color: isDark ? COLORS.dark.text : COLORS.light.text },
              ]}
            >
              {booking.user?.name || "Guest"}
            </Text>
            <Text style={styles.userEmail}>{booking.user?.email || "—"}</Text>
          </View>
        </View>
        <Badge
          text={booking.status}
          variant={getBadgeVariant(booking.status)}
        />
      </View>

      {/* Details grid */}
      <View style={styles.detailsGrid}>
        <View style={styles.detailItem}>
          <MapPin size={14} color="#9ca3af" />
          <Text
            style={[
              styles.detailText,
              { color: isDark ? COLORS.dark.text : COLORS.light.text },
            ]}
            numberOfLines={1}
          >
            {booking.slot?.lot?.name || "—"} · {booking.slot?.number || "—"}
          </Text>
        </View>

        <View style={styles.detailItem}>
          <Car size={14} color="#9ca3af" />
          <Text
            style={[
              styles.detailText,
              { color: isDark ? COLORS.dark.text : COLORS.light.text },
            ]}
          >
            {booking.vehicle?.plateNumber || "—"} ·{" "}
            {booking.vehicle?.type || "—"}
          </Text>
        </View>

        <View style={styles.detailItem}>
          <Clock size={14} color="#9ca3af" />
          <Text
            style={[
              styles.detailText,
              { color: isDark ? COLORS.dark.text : COLORS.light.text },
            ]}
          >
            {formatDateShort(booking.startTime)}
          </Text>
        </View>
      </View>

      {/* Footer: Amount + Time ago */}
      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <Badge text="Paid" variant="success" />
          <Text style={styles.timeAgo}>{timeAgo(booking.startTime)}</Text>
        </View>
        <Text
          style={[
            styles.amount,
            { color: isDark ? COLORS.dark.text : COLORS.light.text },
          ]}
        >
          {booking.amount ? formatCurrency(booking.amount) : "—"}
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  userInfo: { flex: 1 },
  userName: { fontSize: 14, fontWeight: "700" },
  userEmail: { fontSize: 12, color: "#9ca3af", marginTop: 1 },
  detailsGrid: { gap: 8, marginBottom: 14 },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  detailText: { fontSize: 13 },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#f3f4f615",
    paddingTop: 12,
  },
  footerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  timeAgo: { fontSize: 11, color: "#9ca3af" },
  amount: {
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
});
