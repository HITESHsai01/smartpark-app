// Owner Sign Up / Driver Upgrade
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { useRouter, Link } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {
  Briefcase,
  MapPin,
  Globe,
  Ruler,
  Car,
  Check,
  TrendingUp,
  Shield,
  Clock,
} from "lucide-react-native";
import Toast from "react-native-toast-message";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { api } from "@/lib/api";
import { COLORS } from "@/lib/constants";

const benefits = [
  {
    icon: TrendingUp,
    text: "Earn passive income from your unused space",
  },
  {
    icon: Shield,
    text: "Secure and verified bookings",
  },
  {
    icon: Clock,
    text: "Real-time dashboard and analytics",
  },
];

export default function OwnerSignUpScreen() {
  const { user, isSignedIn } = useUser();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("India");
  const [squareFeet, setSquareFeet] = useState("");
  const [capacity, setCapacity] = useState("");
  const [loading, setLoading] = useState(false);

  const isUpgrade = isSignedIn;

  const handleSubmit = async () => {
    if (!address || !capacity) {
      Toast.show({
        type: "error",
        text1: "Missing fields",
        text2: "Please fill in address and capacity",
      });
      return;
    }

    setLoading(true);
    try {
      await api.post("/owner/upgrade", {
        address: address.trim(),
        country: country.trim(),
        squareFeet: Number(squareFeet) || 0,
        capacity: Number(capacity),
      });

      Toast.show({
        type: "success",
        text1: "Welcome, Partner! 🎉",
        text2: "Your property has been listed.",
      });

      router.replace("/owner");
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Failed",
        text2: err?.message || "Could not upgrade to owner",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        style={[
          styles.flex,
          {
            backgroundColor: isDark
              ? COLORS.dark.background
              : COLORS.light.background,
          },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Branding Header */}
        <LinearGradient
          colors={["#1e3a8a", "#7c3aed"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.logoRow}>
            <Briefcase size={28} color="#fff" />
            <Text style={styles.logoText}>Partner Hub</Text>
          </View>
          <Text style={styles.headerTitle}>
            Turn your parking space into{"\n"}passive income
          </Text>

          {/* Benefits */}
          <View style={styles.benefits}>
            {benefits.map((benefit, i) => {
              const Icon = benefit.icon;
              return (
                <View key={i} style={styles.benefitRow}>
                  <View style={styles.benefitIcon}>
                    <Icon size={16} color="#fff" />
                  </View>
                  <Text style={styles.benefitText}>{benefit.text}</Text>
                </View>
              );
            })}
          </View>
        </LinearGradient>

        {/* Form */}
        <View style={styles.form}>
          <Text
            style={[
              styles.formTitle,
              { color: isDark ? COLORS.dark.text : COLORS.light.text },
            ]}
          >
            {isUpgrade ? "List Your Property" : "Create Partner Account"}
          </Text>

          {isUpgrade && (
            <Text
              style={[
                styles.upgradeNote,
                {
                  color: isDark
                    ? COLORS.dark.textSecondary
                    : COLORS.light.textSecondary,
                },
              ]}
            >
              Hi {user?.firstName}! Fill in your property details to become a
              partner.
            </Text>
          )}

          <Input
            label="Property Address"
            placeholder="Full address with city, state"
            value={address}
            onChangeText={setAddress}
            icon={<MapPin size={16} color="#9ca3af" />}
            multiline
          />

          <Input
            label="Country"
            placeholder="India"
            value={country}
            onChangeText={setCountry}
            icon={<Globe size={16} color="#9ca3af" />}
          />

          <Input
            label="Square Feet (optional)"
            placeholder="e.g., 5000"
            value={squareFeet}
            onChangeText={setSquareFeet}
            keyboardType="numeric"
            icon={<Ruler size={16} color="#9ca3af" />}
          />

          <Input
            label="Parking Capacity"
            placeholder="Number of vehicles"
            value={capacity}
            onChangeText={setCapacity}
            keyboardType="numeric"
            icon={<Car size={16} color="#9ca3af" />}
          />

          <Button
            title={isUpgrade ? "List Property & Become Partner" : "Create Partner Account"}
            onPress={handleSubmit}
            loading={loading}
            size="lg"
            icon={<Check size={18} color="#fff" />}
          />

          {!isUpgrade && (
            <View style={styles.footer}>
              <Text
                style={[
                  styles.footerText,
                  {
                    color: isDark
                      ? COLORS.dark.textSecondary
                      : COLORS.light.textSecondary,
                  },
                ]}
              >
                Already a partner?{" "}
              </Text>
              <Link href="/owner/sign-in" asChild>
                <TouchableOpacity>
                  <Text style={styles.link}>Sign In</Text>
                </TouchableOpacity>
              </Link>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  header: {
    paddingTop: 70,
    paddingBottom: 40,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  logoText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
    marginLeft: 8,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
    lineHeight: 32,
    letterSpacing: -0.5,
    marginBottom: 20,
  },
  benefits: { gap: 10 },
  benefitRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  benefitIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  benefitText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
    flex: 1,
  },
  form: { padding: 24 },
  formTitle: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  upgradeNote: {
    fontSize: 14,
    marginBottom: 20,
    lineHeight: 20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  footerText: { fontSize: 14 },
  link: {
    color: "#2563eb",
    fontWeight: "600",
    fontSize: 14,
  },
});
