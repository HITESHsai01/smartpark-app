// Owner Sign In screen
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
import { useSignIn } from "@clerk/clerk-expo";
import { useRouter, Link } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Briefcase, Mail, Lock } from "lucide-react-native";
import Toast from "react-native-toast-message";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { COLORS, GRADIENT } from "@/lib/constants";

export default function OwnerSignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!isLoaded || !email || !password) return;

    setLoading(true);
    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.replace("/owner" as any);
      }
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Sign In Failed",
        text2: err?.errors?.[0]?.longMessage || "Please try again.",
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
          <Text style={styles.headerTitle}>Owner Sign In</Text>
          <Text style={styles.headerSubtitle}>
            Access your dashboard to manage properties and bookings
          </Text>
        </LinearGradient>

        <View style={styles.form}>
          <Input
            label="Email"
            placeholder="owner@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            icon={<Mail size={18} color="#9ca3af" />}
          />

          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            icon={<Lock size={18} color="#9ca3af" />}
          />

          <Button title="Sign In" onPress={handleSignIn} loading={loading} size="lg" />

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
              Want to list your space?{" "}
            </Text>
            <Link href="/owner/sign-up" asChild>
              <TouchableOpacity>
                <Text style={styles.link}>Become a Partner</Text>
              </TouchableOpacity>
            </Link>
          </View>

          <Link href="/(auth)/sign-in" asChild>
            <TouchableOpacity style={styles.driverLink}>
              <Text style={styles.link}>← Sign in as Driver</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  header: {
    paddingTop: 80,
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
    fontSize: 22,
    fontWeight: "800",
    marginLeft: 8,
    letterSpacing: -0.5,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  headerSubtitle: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 15,
    lineHeight: 22,
  },
  form: { padding: 24, paddingTop: 32 },
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
  driverLink: {
    marginTop: 16,
    alignItems: "center",
  },
});
