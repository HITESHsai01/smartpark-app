// Home Screen — hero, features, partner link
import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
} from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { useRouter, Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MapPin, Briefcase } from "lucide-react-native";
import Avatar from "@/components/ui/Avatar";
import HeroSection from "@/components/home/HeroSection";
import FeatureCards from "@/components/home/FeatureCards";
import { COLORS } from "@/lib/constants";

export default function HomeScreen() {
  const { user, isSignedIn } = useUser();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

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
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Top Header */}
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <MapPin size={24} color={COLORS.primary} />
            <Text
              style={[
                styles.logoText,
                { color: isDark ? COLORS.dark.text : COLORS.light.text },
              ]}
            >
              SmartPark
            </Text>
          </View>

          <View style={styles.headerRight}>
            <Link href="/owner/sign-up" asChild>
              <TouchableOpacity style={styles.partnerBtn}>
                <Briefcase size={14} color={COLORS.primary} />
                <Text style={styles.partnerText}>Become a Partner</Text>
              </TouchableOpacity>
            </Link>

            {isSignedIn ? (
              <TouchableOpacity onPress={() => router.push("/(tabs)/profile")}>
                <Avatar name={user?.firstName} size={36} />
              </TouchableOpacity>
            ) : (
              <Link href="/(auth)/sign-in" asChild>
                <TouchableOpacity>
                  <Text style={styles.signInText}>Sign In</Text>
                </TouchableOpacity>
              </Link>
            )}
          </View>
        </View>

        {/* Hero */}
        <HeroSection />

        {/* Features */}
        <FeatureCards />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoText: {
    fontSize: 20,
    fontWeight: "800",
    marginLeft: 6,
    letterSpacing: -0.5,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  partnerBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2563eb30",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 4,
  },
  partnerText: {
    color: "#2563eb",
    fontSize: 12,
    fontWeight: "600",
  },
  signInText: {
    color: "#2563eb",
    fontWeight: "600",
    fontSize: 14,
  },
});
