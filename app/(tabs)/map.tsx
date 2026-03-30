// Map screen — full-screen map with parking markers, search, routing
import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  StyleSheet,
  useColorScheme,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Search, X } from "lucide-react-native";
import Toast from "react-native-toast-message";

import ParkingDetailSheet from "@/components/map/ParkingDetailSheet";
import RouteInfoCard from "@/components/map/RouteInfoCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

import { useLocation } from "@/hooks/useLocation";
import { useProperties } from "@/hooks/useProperties";
import { useParkingStore } from "@/store/parkingStore";
import { geocodeAddress } from "@/lib/geocoding";
import { getRoute } from "@/lib/routing";
import { COLORS, MAP_DEFAULTS } from "@/lib/constants";
import type { MapMarkerData, RouteResult } from "@/lib/types";

export default function MapScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();
  const mapRef = useRef<MapView>(null);

  const { location, loading: locationLoading } = useLocation();
  const { properties, fetchProperties } = useProperties();
  const {
    searchQuery,
    setSearchQuery,
    destination,
    setDestination,
    selectedParking,
    setSelectedParking,
    routeToDestination,
    setRouteToDestination,
    routeToParking,
    setRouteToParking,
    clearRoute,
  } = useParkingStore();

  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [markers, setMarkers] = useState<MapMarkerData[]>([]);

  // Load properties on mount
  useEffect(() => {
    fetchProperties();
  }, []);

  // Convert properties to markers
  useEffect(() => {
    const m: MapMarkerData[] = properties
      .filter((p) => p.lat && p.lng)
      .map((p) => ({
        id: p.id,
        coordinate: { latitude: p.lat!, longitude: p.lng! },
        title: p.name,
        address: p.address,
        rate: p.baseRate,
        freeSlots: p.slots?.filter((s) => s.status === "FREE").length || 0,
        totalSlots: p.slots?.length || p.capacity,
        isBooked: false,
      }));
    setMarkers(m);
  }, [properties]);

  // Auto-search from home screen query
  useEffect(() => {
    if (searchQuery && searchQuery !== localQuery) {
      setLocalQuery(searchQuery);
      handleSearch(searchQuery);
    }
  }, [searchQuery]);

  const handleSearch = async (query?: string) => {
    const q = query || localQuery;
    if (!q.trim()) return;

    const result = await geocodeAddress(q);
    if (result) {
      setDestination(result);
      setSearchQuery(q);

      mapRef.current?.animateToRegion(
        {
          latitude: result.lat,
          longitude: result.lng,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        },
        1000
      );

      // Calculate route from user to destination
      if (location) {
        const route = await getRoute(
          { latitude: location.latitude, longitude: location.longitude },
          { latitude: result.lat, longitude: result.lng }
        );
        setRouteToDestination(route);
      }
    } else {
      Toast.show({
        type: "error",
        text1: "Location not found",
        text2: "Try a different search term",
      });
    }
  };

  const handleMarkerPress = (marker: MapMarkerData) => {
    setSelectedParking(marker);
  };

  const handleRouteToParking = async () => {
    if (!selectedParking || !destination) return;

    const route = await getRoute(
      { latitude: destination.lat, longitude: destination.lng },
      selectedParking.coordinate
    );
    setRouteToParking(route);
  };

  const handleBookSpot = () => {
    if (!selectedParking) return;
    router.push(`/booking/${selectedParking.id}`);
  };

  const initialRegion = location
    ? {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }
    : MAP_DEFAULTS.region;

  return (
    <View style={styles.flex}>
      {/* Search Bar */}
      <SafeAreaView
        edges={["top"]}
        style={[
          styles.searchSafe,
          {
            backgroundColor: isDark
              ? "rgba(10,10,10,0.9)"
              : "rgba(255,255,255,0.95)",
          },
        ]}
      >
        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: isDark ? "#27272a" : "#f3f4f6",
              borderColor: isDark ? COLORS.dark.border : "#e5e7eb",
            },
          ]}
        >
          <Search size={18} color="#9ca3af" />
          <TextInput
            style={[
              styles.searchInput,
              { color: isDark ? "#fff" : "#111" },
            ]}
            placeholder="Search destination..."
            placeholderTextColor="#9ca3af"
            value={localQuery}
            onChangeText={setLocalQuery}
            onSubmitEditing={() => handleSearch()}
            returnKeyType="search"
          />
          {localQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setLocalQuery("");
                setSearchQuery("");
                setDestination(null);
                clearRoute();
              }}
            >
              <X size={18} color="#9ca3af" />
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>

      {/* Map */}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation
        showsMyLocationButton
        provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
      >
        {/* Parking lot markers */}
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinate}
            title={marker.title}
            pinColor={
              selectedParking?.id === marker.id
                ? MAP_DEFAULTS.markerColors.selected
                : marker.isBooked
                ? MAP_DEFAULTS.markerColors.booked
                : MAP_DEFAULTS.markerColors.default
            }
            onPress={() => handleMarkerPress(marker)}
          />
        ))}

        {/* Destination marker */}
        {destination && (
          <Marker
            coordinate={{ latitude: destination.lat, longitude: destination.lng }}
            title="Destination"
            pinColor={MAP_DEFAULTS.markerColors.destination}
          />
        )}

        {/* Route: User → Destination (cyan line) */}
        {routeToDestination && (
          <Polyline
            coordinates={routeToDestination.coordinates}
            strokeColor="#06b6d4"
            strokeWidth={4}
          />
        )}

        {/* Route: Destination → Parking (blue dashed) */}
        {routeToParking && (
          <Polyline
            coordinates={routeToParking.coordinates}
            strokeColor="#2563eb"
            strokeWidth={3}
            lineDashPattern={[10, 6]}
          />
        )}
      </MapView>

      {/* Route Info Overlay */}
      {(routeToDestination || routeToParking) && selectedParking && (
        <RouteInfoCard
          distance={
            (routeToDestination?.distance || 0) +
            (routeToParking?.distance || 0)
          }
          duration={
            (routeToDestination?.duration || 0) +
            (routeToParking?.duration || 0)
          }
          parkingName={selectedParking.title}
          onClear={clearRoute}
        />
      )}

      {/* Bottom Sheet */}
      {selectedParking && (
        <ParkingDetailSheet
          parking={selectedParking}
          onRouteHere={handleRouteToParking}
          onBook={handleBookSpot}
          onClose={() => setSelectedParking(null)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  searchSafe: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    height: 48,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
  },
  map: {
    flex: 1,
  },
});
