// Booking form screen — select duration, vehicle, pay & book
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { MapPin, Clock, CreditCard } from "lucide-react-native";
import Toast from "react-native-toast-message";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import DurationSelector from "@/components/booking/DurationSelector";
import VehicleSelector from "@/components/booking/VehicleSelector";
import PriceBreakdown from "@/components/booking/PriceBreakdown";
import { api } from "@/lib/api";
import { COLORS, DEFAULT_BASE_RATE } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import type { ParkingLot } from "@/lib/types";

export default function BookingFormScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [property, setProperty] = useState<ParkingLot | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [hours, setHours] = useState(1);
  const [vehicleType, setVehicleType] = useState("CAR");

  useEffect(() => {
    loadProperty();
  }, [id]);

  const loadProperty = async () => {
    try {
      const data = await api.get<ParkingLot>(`/properties/${id}`);
      setProperty(data);
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Could not load property details",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async () => {
    if (!property) return;

    setBooking(true);
    try {
      const amount = (property.baseRate || DEFAULT_BASE_RATE) * hours;

      await api.post("/bookings", {
        propertyId: property.id,
        duration: hours,
        vehicleType,
        amount,
      });

      router.replace("/booking/success");
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Booking Failed",
        text2: err?.message || "Could not create booking",
      });
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!property) {
    return (
      <SafeAreaView style={[styles.safe, styles.center]}>
        <Text style={styles.errorText}>Property not found</Text>
      </SafeAreaView>
    );
  }

  const rate = property.baseRate || DEFAULT_BASE_RATE;
  const freeSlots =
    property.slots?.filter((s) => s.status === "FREE").length || 0;

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Book Parking",
          headerTintColor: isDark ? "#fff" : "#111",
          headerStyle: {
            backgroundColor: isDark
              ? COLORS.dark.background
              : COLORS.light.background,
          },
        }}
      />
      <SafeAreaView
        edges={["bottom"]}
        style={[
          styles.safe,
          {
            backgroundColor: isDark
              ? COLORS.dark.background
              : COLORS.light.background,
          },
        ]}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Property Info */}
          <Card style={styles.propertyCard}>
            <Text
              style={[
                styles.propertyName,
                { color: isDark ? COLORS.dark.text : COLORS.light.text },
              ]}
            >
              {property.name}
            </Text>
            <View style={styles.propertyRow}>
              <MapPin size={14} color="#9ca3af" />
              <Text style={styles.propertyAddress} numberOfLines={2}>
                {property.address}
              </Text>
            </View>
            <View style={styles.propertyStats}>
              <View style={styles.propStat}>
                <Clock size={14} color={COLORS.primary} />
                <Text
                  style={[
                    styles.propStatText,
                    { color: isDark ? COLORS.dark.text : COLORS.light.text },
                  ]}
                >
                  {formatCurrency(rate)}/hr
                </Text>
              </View>
              <Badge
                text={`${freeSlots} slots free`}
                variant={freeSlots > 0 ? "success" : "error"}
              />
            </View>
          </Card>

          {/* Duration */}
          <DurationSelector hours={hours} onChange={setHours} />

          {/* Vehicle */}
          <VehicleSelector selected={vehicleType} onSelect={setVehicleType} />

          {/* Price */}
          <PriceBreakdown rate={rate} hours={hours} />

          {/* Book Button */}
          <Button
            title={`Pay ${formatCurrency(rate * hours)} & Book`}
            onPress={handleBook}
            loading={booking}
            disabled={freeSlots === 0}
            size="lg"
            icon={<CreditCard size={18} color="#fff" />}
          />
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  center: { justifyContent: "center", alignItems: "center" },
  scrollContent: { padding: 20, paddingBottom: 40 },
  errorText: { color: "#9ca3af", fontSize: 16 },
  propertyCard: { marginBottom: 24 },
  propertyName: {
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  propertyRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 4,
    marginBottom: 12,
  },
  propertyAddress: {
    fontSize: 13,
    color: "#9ca3af",
    flex: 1,
    lineHeight: 18,
  },
  propertyStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  propStat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  propStatText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
