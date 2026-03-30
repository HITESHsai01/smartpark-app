// My Bookings screen — driver's active/past bookings
import React, { useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  useColorScheme,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CalendarCheck, Clock, MapPin } from "lucide-react-native";
import Card from "@/components/ui/Card";
import Badge, { getBadgeVariant } from "@/components/ui/Badge";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useBookings } from "@/hooks/useBookings";
import { COLORS } from "@/lib/constants";
import { formatCurrency, formatDateShort, timeAgo } from "@/lib/utils";
import type { Booking } from "@/lib/types";

export default function BookingsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { bookings, loading, fetchBookings } = useBookings();

  useEffect(() => {
    fetchBookings();
  }, []);

  const renderBooking = useCallback(
    ({ item }: { item: Booking }) => (
      <Card style={styles.bookingCard}>
        {/* Header */}
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <View style={styles.iconWrap}>
              <CalendarCheck size={16} color={COLORS.primary} />
            </View>
            <View>
              <Text
                style={[
                  styles.lotName,
                  { color: isDark ? COLORS.dark.text : COLORS.light.text },
                ]}
              >
                {item.slot?.lot?.name || "Parking Spot"}
              </Text>
              <View style={styles.addressRow}>
                <MapPin size={12} color="#9ca3af" />
                <Text style={styles.address} numberOfLines={1}>
                  {item.slot?.lot?.address || "—"}
                </Text>
              </View>
            </View>
          </View>
          <Badge text={item.status} variant={getBadgeVariant(item.status)} />
        </View>

        {/* Details */}
        <View style={styles.detailsRow}>
          <View style={styles.detail}>
            <Text style={styles.detailLabel}>Slot</Text>
            <Text
              style={[
                styles.detailValue,
                { color: isDark ? COLORS.dark.text : COLORS.light.text },
              ]}
            >
              {item.slot?.number || "—"}
            </Text>
          </View>
          <View style={styles.detail}>
            <Text style={styles.detailLabel}>Start</Text>
            <Text
              style={[
                styles.detailValue,
                { color: isDark ? COLORS.dark.text : COLORS.light.text },
              ]}
            >
              {formatDateShort(item.startTime)}
            </Text>
          </View>
          <View style={styles.detail}>
            <Text style={styles.detailLabel}>Amount</Text>
            <Text
              style={[
                styles.detailValue,
                styles.amountText,
                { color: isDark ? COLORS.dark.text : COLORS.light.text },
              ]}
            >
              {item.amount ? formatCurrency(item.amount) : "—"}
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.cardFooter}>
          <Clock size={12} color="#9ca3af" />
          <Text style={styles.footerText}>{timeAgo(item.startTime)}</Text>
        </View>
      </Card>
    ),
    [isDark]
  );

  return (
    <SafeAreaView
      style={[
        styles.safe,
        {
          backgroundColor: isDark
            ? COLORS.dark.background
            : COLORS.light.background,
        },
      ]}
    >
      <View style={styles.headerContainer}>
        <Text
          style={[
            styles.headerTitle,
            { color: isDark ? COLORS.dark.text : COLORS.light.text },
          ]}
        >
          My Bookings
        </Text>
      </View>

      {loading && bookings.length === 0 ? (
        <LoadingSpinner fullScreen />
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id}
          renderItem={renderBooking}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={fetchBookings} />
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <CalendarCheck size={48} color="#d1d5db" />
              <Text
                style={[
                  styles.emptyTitle,
                  { color: isDark ? COLORS.dark.text : COLORS.light.text },
                ]}
              >
                No bookings yet
              </Text>
              <Text style={styles.emptySubtitle}>
                Book a parking spot from the map to get started
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  headerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 12,
  },
  bookingCard: { padding: 16 },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  cardHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#2563eb15",
    alignItems: "center",
    justifyContent: "center",
  },
  lotName: {
    fontSize: 15,
    fontWeight: "700",
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginTop: 2,
  },
  address: {
    fontSize: 12,
    color: "#9ca3af",
    maxWidth: 180,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#f3f4f615",
    marginBottom: 10,
  },
  detail: { alignItems: "center" },
  detailLabel: { fontSize: 11, color: "#9ca3af", marginBottom: 2 },
  detailValue: { fontSize: 13, fontWeight: "600" },
  amountText: { color: "#2563eb" },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  footerText: { fontSize: 11, color: "#9ca3af" },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
  },
});
