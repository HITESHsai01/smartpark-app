// Owner Dashboard — stat cards, revenue chart, recent bookings, properties
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  useColorScheme,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import {
  IndianRupee,
  CalendarCheck,
  Car,
  TrendingUp,
} from "lucide-react-native";
import StatCard from "@/components/ui/StatCard";
import Card from "@/components/ui/Card";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import RevenueChart from "@/components/owner/RevenueChart";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useBookings } from "@/hooks/useBookings";
import { useProperties } from "@/hooks/useProperties";
import { COLORS } from "@/lib/constants";
import { formatCurrency, formatDateShort, timeAgo } from "@/lib/utils";

export default function OwnerDashboardScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();

  const { bookings, loading: bookingsLoading, fetchOwnerBookings } = useBookings();
  const { properties, loading: propsLoading, fetchOwnerProperties } = useProperties();

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchOwnerBookings();
    fetchOwnerProperties();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchOwnerBookings(), fetchOwnerProperties()]);
    setRefreshing(false);
  };

  // Calculate stats
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.amount || 0), 0);
  const activeBookings = bookings.filter((b) => b.status === "ACTIVE").length;
  const totalSlots = properties.reduce(
    (sum, p) => sum + (p.slots?.length || p.capacity),
    0
  );
  const occupiedSlots = properties.reduce(
    (sum, p) =>
      sum + (p.slots?.filter((s) => s.status !== "FREE").length || 0),
    0
  );
  const occupancyRate =
    totalSlots > 0 ? Math.round((occupiedSlots / totalSlots) * 100) : 0;

  // Revenue by property for chart
  const revenueByProperty = properties.map((p) => {
    const propBookings = bookings.filter(
      (b) => b.slot?.lot?.id === p.id
    );
    return {
      name: p.name.length > 12 ? p.name.slice(0, 12) + "…" : p.name,
      revenue: propBookings.reduce((sum, b) => sum + (b.amount || 0), 0),
      color: COLORS.primary,
    };
  });

  const recentBookings = bookings.slice(0, 5);

  if (bookingsLoading && bookings.length === 0) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <ScrollView
      style={[
        styles.container,
        {
          backgroundColor: isDark
            ? COLORS.dark.background
            : COLORS.light.background,
        },
      ]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Stat Cards Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statsRow}>
          <StatCard
            title="Total Revenue"
            value={formatCurrency(totalRevenue)}
            icon={<IndianRupee size={20} color="#2563eb" />}
            accentColor="#2563eb"
            trend={{ value: "12%", isPositive: true }}
          />
          <StatCard
            title="Active Bookings"
            value={String(activeBookings)}
            icon={<CalendarCheck size={20} color="#22c55e" />}
            accentColor="#22c55e"
          />
        </View>
        <View style={styles.statsRow}>
          <StatCard
            title="Total Slots"
            value={String(totalSlots)}
            icon={<Car size={20} color="#7c3aed" />}
            accentColor="#7c3aed"
          />
          <StatCard
            title="Occupancy Rate"
            value={`${occupancyRate}%`}
            icon={<TrendingUp size={20} color="#f97316" />}
            accentColor="#f97316"
            trend={{
              value: `${occupiedSlots}/${totalSlots}`,
              isPositive: occupancyRate > 50,
            }}
          />
        </View>
      </View>

      {/* Revenue Chart */}
      <Card style={styles.chartCard}>
        <Text
          style={[
            styles.sectionTitle,
            { color: isDark ? COLORS.dark.text : COLORS.light.text },
          ]}
        >
          Revenue Analytics
        </Text>
        <RevenueChart data={revenueByProperty} />
      </Card>

      {/* Recent Bookings */}
      <View style={styles.section}>
        <Text
          style={[
            styles.sectionTitle,
            { color: isDark ? COLORS.dark.text : COLORS.light.text },
          ]}
        >
          Recent Bookings
        </Text>
        {recentBookings.length === 0 ? (
          <Text style={styles.emptyText}>No bookings yet</Text>
        ) : (
          recentBookings.map((booking) => (
            <Card key={booking.id} style={styles.recentCard}>
              <View style={styles.recentRow}>
                <Avatar name={booking.user?.name} size={36} />
                <View style={styles.recentInfo}>
                  <Text
                    style={[
                      styles.recentName,
                      { color: isDark ? COLORS.dark.text : COLORS.light.text },
                    ]}
                  >
                    {booking.user?.name || "Guest"}
                  </Text>
                  <Text style={styles.recentSub}>
                    {booking.slot?.lot?.name} · {booking.slot?.number}
                  </Text>
                </View>
                <View style={styles.recentRight}>
                  <Text
                    style={[
                      styles.recentAmount,
                      { color: isDark ? COLORS.dark.text : COLORS.light.text },
                    ]}
                  >
                    {booking.amount ? formatCurrency(booking.amount) : "—"}
                  </Text>
                  <Badge text="Paid" variant="success" />
                </View>
              </View>
            </Card>
          ))
        )}
      </View>

      {/* Properties Status */}
      <View style={[styles.section, styles.lastSection]}>
        <Text
          style={[
            styles.sectionTitle,
            { color: isDark ? COLORS.dark.text : COLORS.light.text },
          ]}
        >
          Properties Status
        </Text>
        {properties.map((property) => {
          const propFree =
            property.slots?.filter((s) => s.status === "FREE").length || 0;
          const propTotal = property.slots?.length || property.capacity;
          const propOccupancy =
            propTotal > 0
              ? Math.round(((propTotal - propFree) / propTotal) * 100)
              : 0;

          return (
            <Card key={property.id} style={styles.propertyRow}>
              <View style={styles.propertyInfo}>
                <Text
                  style={[
                    styles.propertyName,
                    { color: isDark ? COLORS.dark.text : COLORS.light.text },
                  ]}
                  numberOfLines={1}
                >
                  {property.name}
                </Text>
                <Text style={styles.propertyAddr} numberOfLines={1}>
                  {property.address}
                </Text>
              </View>
              <Badge text="Active" variant="success" />
              <View style={styles.occupancyMini}>
                <View
                  style={[
                    styles.occupancyBarBg,
                    { backgroundColor: isDark ? "#27272a" : "#e5e7eb" },
                  ]}
                >
                  <View
                    style={[
                      styles.occupancyBarFill,
                      {
                        width: `${propOccupancy}%`,
                        backgroundColor:
                          propOccupancy > 80 ? COLORS.error : COLORS.primary,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.occupancyText}>{propOccupancy}%</Text>
              </View>
            </Card>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  statsGrid: { padding: 16, gap: 12 },
  statsRow: { flexDirection: "row", gap: 12 },
  chartCard: { marginHorizontal: 16, marginBottom: 20, padding: 16 },
  section: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  lastSection: { paddingBottom: 40 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: -0.3,
    marginBottom: 12,
  },
  emptyText: { fontSize: 14, color: "#9ca3af", textAlign: "center", padding: 20 },
  recentCard: { marginBottom: 8, padding: 14 },
  recentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  recentInfo: { flex: 1 },
  recentName: { fontSize: 14, fontWeight: "600" },
  recentSub: { fontSize: 12, color: "#9ca3af", marginTop: 1 },
  recentRight: { alignItems: "flex-end", gap: 4 },
  recentAmount: { fontSize: 14, fontWeight: "700" },
  propertyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    marginBottom: 8,
  },
  propertyInfo: { flex: 1 },
  propertyName: { fontSize: 14, fontWeight: "600" },
  propertyAddr: { fontSize: 11, color: "#9ca3af", marginTop: 1 },
  occupancyMini: {
    alignItems: "center",
    width: 60,
  },
  occupancyBarBg: {
    width: "100%",
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 2,
  },
  occupancyBarFill: { height: "100%", borderRadius: 2 },
  occupancyText: { fontSize: 10, color: "#9ca3af", fontWeight: "600" },
});
