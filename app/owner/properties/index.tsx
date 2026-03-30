// Owner Properties list
import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  useColorScheme,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { MapPin, Plus } from "lucide-react-native";
import Button from "@/components/ui/Button";
import PropertyCard from "@/components/owner/PropertyCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useProperties } from "@/hooks/useProperties";
import { COLORS } from "@/lib/constants";
import type { ParkingLot } from "@/lib/types";

export default function OwnerPropertiesScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();
  const { properties, loading, fetchOwnerProperties } = useProperties();

  useEffect(() => {
    fetchOwnerProperties();
  }, []);

  const renderProperty = ({ item }: { item: ParkingLot }) => (
    <PropertyCard property={item} />
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
      {/* Add Property Button */}
      <View style={styles.addBtnContainer}>
        <Button
          title="Add Property"
          onPress={() => router.push("/owner/properties/new")}
          size="md"
          icon={<Plus size={16} color="#fff" />}
        />
      </View>

      {loading && properties.length === 0 ? (
        <LoadingSpinner fullScreen />
      ) : (
        <FlatList
          data={properties}
          keyExtractor={(item) => item.id}
          renderItem={renderProperty}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={fetchOwnerProperties}
            />
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <View style={styles.emptyIcon}>
                <MapPin size={48} color="#d1d5db" />
              </View>
              <Text
                style={[
                  styles.emptyTitle,
                  { color: isDark ? COLORS.dark.text : COLORS.light.text },
                ]}
              >
                No properties yet
              </Text>
              <Text style={styles.emptySubtitle}>
                Add your first parking property to start earning
              </Text>
              <View style={styles.emptyCta}>
                <Button
                  title="Add Your First Property"
                  onPress={() => router.push("/owner/properties/new")}
                  icon={<Plus size={16} color="#fff" />}
                />
              </View>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  addBtnContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  list: {
    paddingHorizontal: 12,
    paddingBottom: 32,
  },
  row: {
    gap: 12,
    paddingHorizontal: 4,
    marginBottom: 12,
  },
  empty: {
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
    marginBottom: 24,
  },
  emptyCta: { width: "100%" },
});
