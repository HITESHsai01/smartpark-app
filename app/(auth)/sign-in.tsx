// Driver Sign In screen
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
import { MapPin, Mail, Lock } from "lucide-react-native";
import Toast from "react-native-toast-message";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { COLORS, GRADIENT } from "@/lib/constants";

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email";
    if (!password) newErrors.password = "Password is required";
    if (password.length < 6) newErrors.password = "Min 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async () => {
    if (!isLoaded || !validate()) return;

    setLoading(true);
    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.replace("/(tabs)");
      }
    } catch (err: any) {
      const message =
        err?.errors?.[0]?.longMessage || "Sign in failed. Please try again.";
      Toast.show({ type: "error", text1: "Sign In Failed", text2: message });
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
        {/* Header / Branding */}
        <LinearGradient
          colors={[...GRADIENT.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.logoRow}>
            <MapPin size={28} color="#fff" />
            <Text style={styles.logoText}>SmartPark</Text>
          </View>
          <Text style={styles.headerTitle}>Welcome back</Text>
          <Text style={styles.headerSubtitle}>
            Sign in to find and book parking spots instantly
          </Text>
        </LinearGradient>

        {/* Form */}
        <View style={styles.form}>
          <Input
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            icon={<Mail size={18} color="#9ca3af" />}
            error={errors.email}
          />

          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            icon={<Lock size={18} color="#9ca3af" />}
            error={errors.password}
          />

          <Button
            title="Sign In"
            onPress={handleSignIn}
            loading={loading}
            size="lg"
          />

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
              Don't have an account?{" "}
            </Text>
            <Link href="/(auth)/sign-up" asChild>
              <TouchableOpacity>
                <Text style={styles.link}>Sign Up</Text>
              </TouchableOpacity>
            </Link>
          </View>

          <View style={styles.divider}>
            <View
              style={[
                styles.dividerLine,
                {
                  backgroundColor: isDark
                    ? COLORS.dark.border
                    : COLORS.light.border,
                },
              ]}
            />
            <Text
              style={[
                styles.dividerText,
                {
                  color: isDark
                    ? COLORS.dark.textSecondary
                    : COLORS.light.textSecondary,
                },
              ]}
            >
              or
            </Text>
            <View
              style={[
                styles.dividerLine,
                {
                  backgroundColor: isDark
                    ? COLORS.dark.border
                    : COLORS.light.border,
                },
              ]}
            />
          </View>

          <Link href="/owner/sign-in" asChild>
            <TouchableOpacity>
              <Text style={styles.ownerLink}>Sign in as Partner / Owner →</Text>
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
  form: {
    padding: 24,
    paddingTop: 32,
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
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { marginHorizontal: 12, fontSize: 13 },
  ownerLink: {
    color: "#2563eb",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 14,
  },
});
