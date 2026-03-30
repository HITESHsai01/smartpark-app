// Owner Bookings Management — search, filter, booking cards
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  useColorScheme,
  RefreshControl,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Search } from "lucide-react-native";
import Input from "@/components/ui/Input";
import StatCard from "@/components/ui/StatCard";
import BookingCard from "@/components/owner/BookingCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useBookings } from "@/hooks/useBookings";
import { COLORS } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import type { Booking, BookingStatus } from "@/lib/types";
import {
  IndianRupee,
  CalendarCheck,
  CheckCircle,
  Calendar,
} from "lucide-react-native";

const statusFilters: Array<BookingStatus | "ALL"> = [
  "ALL",
  "ACTIVE",
  "COMPLETED",
  "CANCELLED",
  "EXPIRED",
];

export default function OwnerBookingsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { bookings, loading, fetchOwnerBookings } = useBookings();

  const [searchText, setSearchText] = useState("");
  const [activeFilter, setActiveFilter] = useState<BookingStatus | "ALL">("ALL");

  useEffect(() => {
    fetchOwnerBookings();
  }, []);

  // Filter bookings
  const filtered = bookings.filter((b) => {
    const matchesFilter =
      activeFilter === "ALL" || b.status === activeFilter;
    const matchesSearch =
      !searchText ||
      b.user?.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      b.vehicle?.plateNumber
        ?.toLowerCase()
        .includes(searchText.toLowerCase()) ||
      b.slot?.lot?.name?.toLowerCase().includes(searchText.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Stats
  const totalEarnings = bookings.reduce((s, b) => s + (b.amount || 0), 0);
  const activeCount = bookings.filter((b) => b.status === "ACTIVE").length;
  const completedCount = bookings.filter((b) => b.status === "COMPLETED").length;

  const renderBooking = useCallback(
    ({ item }: { item: Booking }) => <BookingCard booking={item} />,
    []
  );

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark
            ? COLORS.dark.background
            : COLORS.light.background,
        },
      ]}
    >
      {/* Stats Row */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.statsScroll}
      >
        <StatCard
          title="Total Earnings"
          value={formatCurrency(totalEarnings)}
          icon={<IndianRupee size={18} color="#2563eb" />}
          accentColor="#2563eb"
        />
        <StatCard
          title="Active"
          value={String(activeCount)}
          icon={<CalendarCheck size={18} color="#22c55e" />}
          accentColor="#22c55e"
        />
        <StatCard
          title="Completed"
          value={String(completedCount)}
          icon={<CheckCircle size={18} color="#7c3aed" />}
          accentColor="#7c3aed"
        />
      </ScrollView>

      {/* Search */}
      <View style={styles.searchArea}>
        <Input
          placeholder="Search customer, vehicle, property..."
          value={searchText}
          onChangeText={setSearchText}
          icon={<Search size={16} color="#9ca3af" />}
        />
      </View>

      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScroll}
      >
        {statusFilters.map((status) => (
          <TouchableOpacity
            key={status}
            onPress={() => setActiveFilter(status)}
            style={[
              styles.filterChip,
              {
                backgroundColor:
                  activeFilter === status
                    ? COLORS.primary
                    : isDark
                    ? "#27272a"
                    : "#f3f4f6",
                borderColor:
                  activeFilter === status
                    ? COLORS.primary
                    : isDark
                    ? COLORS.dark.border
                    : "#e5e7eb",
              },
            ]}
          >
            <Text
              style={[
                styles.filterText,
                {
                  color:
                    activeFilter === status
                      ? "#fff"
                      : isDark
                      ? COLORS.dark.text
                      : COLORS.light.text,
                },
              ]}
            >
              {status}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Bookings List */}
      {loading && bookings.length === 0 ? (
        <LoadingSpinner fullScreen />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderBooking}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={fetchOwnerBookings}
            />
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No bookings found</Text>
            </View>
          }
          ListFooterComponent={
            filtered.length > 0 ? (
              <View style={styles.footer}>
                <Text style={styles.footerText}>
                  {filtered.length} booking{filtered.length !== 1 ? "s" : ""} ·{" "}
                  {activeCount} active · {completedCount} completed
                </Text>
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  statsScroll: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  searchArea: { paddingHorizontal: 16 },
  filterScroll: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 12,
    fontWeight: "600",
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 10,
  },
  empty: { padding: 40, alignItems: "center" },
  emptyText: { fontSize: 14, color: "#9ca3af" },
  footer: {
    paddingVertical: 16,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#9ca3af",
  },
});
