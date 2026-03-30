// Home screen hero section — gradient heading, search input, CTA button
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { useRouter } from "expo-router";
import { MapPin, Search } from "lucide-react-native";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { COLORS } from "@/lib/constants";
import { useParkingStore } from "@/store/parkingStore";

export default function HeroSection() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { setSearchQuery } = useParkingStore();
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (!query.trim()) return;
    setSearchQuery(query.trim());
    router.push("/(tabs)/map");
  };

  return (
    <View style={styles.container}>
      {/* Heading with gradient feel */}
      <Text
        style={[
          styles.heading,
          { color: isDark ? "#fff" : COLORS.light.text },
        ]}
      >
        Find parking in{"\n"}
        <Text style={styles.gradientText}>seconds</Text>, not minutes.
      </Text>

      <Text
        style={[
          styles.subtitle,
          {
            color: isDark
              ? COLORS.dark.textSecondary
              : COLORS.light.textSecondary,
          },
        ]}
      >
        The smartest way to park. Book spots instantly, manage your
        listings, and save time with SmartPark.
      </Text>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Input
          placeholder="Where are you going?"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          icon={<MapPin size={18} color={COLORS.primary} />}
        />
      </View>

      {/* CTA Button */}
      <Button
        title="Book Parking Slot"
        onPress={handleSearch}
        size="lg"
        icon={<Search size={18} color="#fff" />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
  },
  heading: {
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: -1,
    lineHeight: 40,
    marginBottom: 12,
  },
  gradientText: {
    color: "#06b6d4",
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 28,
  },
  searchContainer: {
    marginBottom: 8,
  },
});
