// Driver Sign Up screen
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
import { useSignUp } from "@clerk/clerk-expo";
import { useRouter, Link } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { MapPin, User, Mail, Lock } from "lucide-react-native";
import Toast from "react-native-toast-message";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { COLORS, GRADIENT } from "@/lib/constants";
import { api } from "@/lib/api";

export default function SignUpScreen() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    code?: string;
  }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 8)
      newErrors.password = "Min 8 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!isLoaded || !validate()) return;

    setLoading(true);
    try {
      await signUp.create({
        emailAddress: email,
        password,
        firstName: name.split(" ")[0],
        lastName: name.split(" ").slice(1).join(" ") || undefined,
      });

      // Start email verification
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);

      Toast.show({
        type: "info",
        text1: "Verification Code Sent",
        text2: "Please check your email for the code.",
      });
    } catch (err: any) {
      const message =
        err?.errors?.[0]?.longMessage || "Sign up failed. Please try again.";
      Toast.show({ type: "error", text1: "Sign Up Failed", text2: message });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!isLoaded || !code) return;

    setLoading(true);
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status !== "complete") {
        console.log(JSON.stringify(completeSignUp, null, 2));
      }

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });

        // Create user in our database
        try {
          await api.post("/users", {
            clerkId: completeSignUp.createdUserId,
            name,
            email,
          });
        } catch (dbErr) {
          console.warn("DB user creation may have failed:", dbErr);
        }

        Toast.show({
          type: "success",
          text1: "Welcome to SmartPark! 🎉",
          text2: "Your account has been created.",
        });

        router.replace("/(tabs)");
      }
    } catch (err: any) {
      const message =
        err?.errors?.[0]?.longMessage || "Verification failed. Please try again.";
      Toast.show({ type: "error", text1: "Verification Failed", text2: message });
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
        {/* Header */}
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
          <Text style={styles.headerTitle}>
            {pendingVerification ? "Verify Email" : "Create Account"}
          </Text>
          <Text style={styles.headerSubtitle}>
            {pendingVerification
              ? `We've sent a 6-digit code to ${email}`
              : "Sign up to start booking parking spots in seconds"}
          </Text>
        </LinearGradient>

        {/* Form */}
        <View style={styles.form}>
          {!pendingVerification ? (
            <>
              <Input
                label="Full Name"
                placeholder="John Doe"
                value={name}
                onChangeText={setName}
                icon={<User size={18} color="#9ca3af" />}
                error={errors.name}
              />

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
                placeholder="Min 8 characters"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                icon={<Lock size={18} color="#9ca3af" />}
                error={errors.password}
              />

              <Button
                title="Create Account"
                onPress={handleSignUp}
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
                  Already have an account?{" "}
                </Text>
                <Link href="/(auth)/sign-in" asChild>
                  <TouchableOpacity>
                    <Text style={styles.link}>Sign In</Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </>
          ) : (
            <>
              <Input
                label="Verification Code"
                placeholder="123456"
                value={code}
                onChangeText={setCode}
                keyboardType="numeric"
                maxLength={6}
                icon={<Lock size={18} color="#9ca3af" />}
                error={errors.code}
              />

              <Button
                title="Verify Email"
                onPress={handleVerify}
                loading={loading}
                size="lg"
              />

              <TouchableOpacity
                onPress={() => setPendingVerification(false)}
                style={styles.backButton}
              >
                <Text style={styles.link}>Change Email</Text>
              </TouchableOpacity>
            </>
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
  backButton: {
    marginTop: 16,
    alignItems: "center",
  },
});
